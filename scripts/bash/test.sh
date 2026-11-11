#!/bin/sh

set -e

OUTPUT=build/test.rbxl

ROJO_PROJECT=$1
SPEC_SCRIPT=$2
shift 2

TEST_PATH_PATTERN=""
TEST_NAME_PATTERN=""
TEST_IGNORE_PATHS=""
REFRESH_PLACES=""
BACKEND=""
COVERAGE_ARGS=""

while [ "$#" -gt 0 ]; do
	case "$1" in
		--)
			shift
			;;
		--refresh-places)
			REFRESH_PLACES=1
			shift
			;;
		--backend)
			if [ -z "$2" ]; then
				echo "Missing value for --backend" >&2
				exit 1
			fi
			BACKEND=$2
			shift 2
			;;
		--testPathPattern)
			if [ -z "$2" ]; then
				echo "Missing value for --testPathPattern" >&2
				exit 1
			fi
			TEST_PATH_PATTERN=$2
			shift 2
			;;
		-t | --testNamePattern)
			if [ -z "$2" ]; then
				echo "Missing value for --testNamePattern" >&2
				exit 1
			fi
			TEST_NAME_PATTERN=$2
			shift 2
			;;
		--coverage | --no-coverage)
			COVERAGE_ARGS="$COVERAGE_ARGS $1"
			shift
			;;
		--coverageReporters)
			if [ -z "$2" ]; then
				echo "Missing value for --coverageReporters" >&2
				exit 1
			fi
			COVERAGE_ARGS="$COVERAGE_ARGS --coverageReporters $2"
			shift 2
			;;
		*)
			echo "Unknown test.sh option: $1" >&2
			exit 1
			;;
	esac
done

# `--testPathPattern` alternation with `|` is unsupported by the in-Studio runner — only the first
# alternate runs. Warn early so a `foo|bar` filter is not mistaken for covering both suites; use one
# directory-prefix pattern or run suites individually.
case "$TEST_PATH_PATTERN" in
	*"|"*)
		echo "WARNING: --testPathPattern contains '|', which is unsupported (only the first alternate runs). Use one directory-prefix pattern or separate runs." >&2
		;;
esac

# Print a named quoted-string list from jest.config.ts, one entry per line, unquoted — so the local
# runner and the cloud config read the same list and cannot drift.
config_list() {
	awk -v list="$1" '
		BEGIN { header = "^const " list "[ :]" }
		$0 ~ header && /\[/ { inside = 1; next }
		inside && /^\];/ { exit }
		inside && match($0, /"[^"]+"/) {
			print substr($0, RSTART + 1, RLENGTH - 2)
		}
	' jest.config.ts
}

# Jest-on-Roblox matches Roblox Instance paths — `client/ui/.../foo.connect.spec` — not filesystem
# paths: the mount has no `src/` prefix, the TS extension is gone, and roblox-ts renames an `index`
# stem to `init`. An untranslated `src/...spec.tsx` pattern is a substring of nothing, so the ignore
# list filtered zero files and the full run kept executing the very suite it meant to skip.
to_instance_pattern() {
	sed -e 's#^src/##' -e 's#\.tsx\?$##' -e 's#/index\(\.spec\)#/init\1#'
}

# Quote a newline-separated list into a Luau array body.
quote_list() {
	awk 'NF { printf "%s\"%s\"", (count++ ? ", " : ""), $0 }'
}

# Determine backend automatically based on pattern target.
# Emulator backend is default and runs full test suite including slow paths.
# Studio backend is strictly for ree-parity unsupported specs targeting reeParityPaths.
if ! RESOLVED_BACKEND=$(node scripts/javascript/resolveTestBackend.mjs "$TEST_PATH_PATTERN"); then
	exit 1
fi

if [ -n "$BACKEND" ] && [ "$BACKEND" != "$RESOLVED_BACKEND" ]; then
	if [ "$BACKEND" = "studio" ]; then
		echo "Studio backend cannot run all tests or slow/standard specs. It is strictly for ree-parity unsupported specs targeting reeParityPaths." >&2
		exit 1
	fi
fi

BACKEND="$RESOLVED_BACKEND"

if [ "$BACKEND" = "studio" ]; then
	if [ -z "$TEST_PATH_PATTERN" ]; then
		echo "Studio backend cannot run all tests at once. Targeted pattern required." >&2
		exit 1
	fi
	SLOW_PATHS=$(config_list slowTestPaths | to_instance_pattern | quote_list)
	TEST_IGNORE_PATHS="$SLOW_PATHS"
fi

# `places/*.rbxl` LFS snapshots are the cache; cloud content is never freshness-checked on a
# normal run. `--refresh-places` bypasses the cache (useCache=false in fetchPlace.luau) so the
# tester place is re-downloaded — the new snapshot stays in the tree to review and commit, same
# as `scripts/bash/fetch-places.sh`.
SETUP_PLACE_ARGS=""
if [ -n "$REFRESH_PLACES" ]; then
	SETUP_PLACE_ARGS="--refresh-places"
fi

# Offline lane: the jest-roblox emulator backend stages the compiled out/ tree
# and runs it inside ree. No place build, no spec patching (the harness takes
# the pattern via --context), no run-in-roblox, no watchdog — ree's own script
# guards and the CLI's timeout bound the run.
if [ "$BACKEND" = "emulator" ]; then
	LOG=build/test-output.log
	mkdir -p build

	CLI_ARGS=""
	if [ -n "$TEST_PATH_PATTERN" ]; then
		CLI_ARGS="$CLI_ARGS --testPathPattern $TEST_PATH_PATTERN"
	fi
	if [ -n "$TEST_NAME_PATTERN" ]; then
		CLI_ARGS="$CLI_ARGS --testNamePattern $TEST_NAME_PATTERN"
	fi

	set +e
	# Coverage flags flow through to the CLI (the config enables collection by
	# default; CI narrows the reporters for the badge's coverage-summary.json).
	node_modules/.bin/jest-roblox --backend emulator $COVERAGE_ARGS $CLI_ARGS > "$LOG" 2>&1
	RC=$?
	set -e
	cat "$LOG"
	exit $RC
fi

scripts/bash/setup-place.sh "$ROJO_PROJECT" "$OUTPUT" $SETUP_PLACE_ARGS
LOG=build/test-output.log

TMP_SCRIPT="$SPEC_SCRIPT"
if [ -n "$TEST_PATH_PATTERN" ] || [ -n "$TEST_NAME_PATTERN" ] || [ -n "$TEST_IGNORE_PATHS" ]; then
	mkdir -p .tmp
	TMP_SCRIPT=".tmp/test-server.patched.luau"
	TEST_PATH_PATTERN="$TEST_PATH_PATTERN" TEST_NAME_PATTERN="$TEST_NAME_PATTERN" TEST_IGNORE_PATHS="$TEST_IGNORE_PATHS" awk '
		function esc(s, out, i, c) {
			out = ""
			for (i = 1; i <= length(s); i++) {
				c = substr(s, i, 1)
				if (c == "\\") out = out "\\\\"
				else if (c == "\"") out = out "\\\""
				else out = out c
			}
			return out
		}
		/^[[:space:]]*ci = false,$/ {
			print
			if (ENVIRON["TEST_PATH_PATTERN"] != "") print "\ttestPathPattern = \"" esc(ENVIRON["TEST_PATH_PATTERN"]) "\","
			if (ENVIRON["TEST_NAME_PATTERN"] != "") print "\ttestNamePattern = \"" esc(ENVIRON["TEST_NAME_PATTERN"]) "\","
			if (ENVIRON["TEST_IGNORE_PATHS"] != "") print "\ttestPathIgnorePatterns = { " ENVIRON["TEST_IGNORE_PATHS"] " },"
			next
		}
		{ print }
	' "$SPEC_SCRIPT" > "$TMP_SCRIPT"
fi

# A wedged suite never trips the per-test timeout, and run-in-roblox has no deadline of its own,
# so a stall here used to hang forever while the reviewer "polled the log". Watch the log instead:
# no growth for TEST_STALL_SECS (default 600, 0 disables) means a dead run — mark it, kill the
# runner tree (Studio included, best effort), and exit 3.
TEST_STALL_SECS=${TEST_STALL_SECS:-600}

# Run detached from the pipeline and stream the log with GNU tail (Git Bash) so the runner's real
# exit code survives and the watchdog can address the runner by PID.
run-in-roblox --place "$OUTPUT" --script "$TMP_SCRIPT" > "$LOG" 2>&1 &
RUNNER_PID=$!
tail -f --retry --pid="$RUNNER_PID" "$LOG" &
TAIL_PID=$!

if [ "$TEST_STALL_SECS" -gt 0 ]; then
	LAST_SIZE=-1
	LAST_CHANGE=$(date +%s)
	while kill -0 "$RUNNER_PID" 2>/dev/null; do
		sleep 10
		SIZE=$(wc -c < "$LOG" 2>/dev/null || echo 0)
		NOW=$(date +%s)
		if [ "$SIZE" != "$LAST_SIZE" ]; then
			LAST_SIZE=$SIZE
			LAST_CHANGE=$NOW
		elif [ $((NOW - LAST_CHANGE)) -ge "$TEST_STALL_SECS" ]; then
			{
				echo ""
				echo "*** STALLED: no log growth for ${TEST_STALL_SECS}s; watchdog killed the run (exit 3). A stray Studio window may remain. ***"
			} >> "$LOG"
			echo "test.sh: no log growth for ${TEST_STALL_SECS}s; killing runner tree (PID $RUNNER_PID)" >&2
			WINPID=$(ps -W | awk -v mpid="$RUNNER_PID" '$1 == mpid { print $4; exit }')
			if [ -n "$WINPID" ]; then
				taskkill //F //T //PID "$WINPID" >/dev/null 2>&1 || true
			fi
			kill -9 "$RUNNER_PID" "$TAIL_PID" 2>/dev/null || true
			exit 3
		fi
	done
fi

RUN_RC=0
wait "$RUNNER_PID" || RUN_RC=$?
wait "$TAIL_PID" 2>/dev/null || true

if [ "$RUN_RC" -eq 0 ]; then
	exit 0
fi

if grep -q "Tests passed!" "$LOG"; then
	exit 0
fi

exit 1
