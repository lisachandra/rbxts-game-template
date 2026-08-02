#!/bin/sh

set -e

OUTPUT=build/test.rbxl

scripts/bash/setup-place.sh "$1" "$OUTPUT"
LOG=build/test-output.log
if run-in-roblox --place "$OUTPUT" --script "$2" 2>&1 | tee "$LOG"; then
	exit 0
fi

if grep -q "Tests passed!" "$LOG"; then
	exit 0
fi

exit 1
