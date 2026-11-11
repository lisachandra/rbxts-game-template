#!/usr/bin/env node

/*
 * #551: the repo pins pnpm via mise (`pnpm = "12.16.1"`), but a standalone
 * pnpm earlier on PATH (C:\Users\PC\AppData\Local\pnpm, historically v10)
 * silently shadows it. A wrong-major install reformats the lockfile and
 * re-arbitrates .bin shims, so refuse to install rather than corrupt state.
 * The version source of truth is mise.toml; package.json's packageManager
 * field is kept in sync with it and CI/corepack read that one.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.env.INIT_CWD ?? process.cwd();
const miseToml = readFileSync(resolve(root, "mise.toml"), "utf-8");
const miseMatch = /^pnpm = "([^"]+)"/m.exec(miseToml);
if (!miseMatch) {
	console.error("preinstall: cannot find the pnpm pin in mise.toml");
	process.exit(1);
}

const expected = miseMatch[1];

const actual = process.env.npm_config_user_agent?.match(/^pnpm\/(\d+\.\d+\.\d+)/)?.[1];
if (!actual) {
	console.error("preinstall: this script must run under pnpm (npm_config_user_agent missing).");
	process.exit(1);
}

if (actual !== expected) {
	console.error(
		`preinstall: pnpm ${actual} is running, but the repo pins ${expected} (mise.toml).\n` +
			"  A wrong-major install rewrites pnpm-lock.yaml and re-picks node_modules/.bin shims.\n" +
			"  Run the pinned toolchain instead:  mise x pnpm -- pnpm install\n" +
			"  (Or remove the standalone pnpm from PATH — see issue #551.)",
	);
	process.exit(1);
}
