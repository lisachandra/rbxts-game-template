#!/usr/bin/env node
/*
 * `pnpm ui:render [<name> | <story.tsx>] [extra rur flags...]` — render a UI
 * Labs story offline with roblox-ui-renderer.
 *
 * The registry (scripts/emulator/ui-renders.json) maps short names to story
 * sources; a path starting with `src/` works directly. The story is rendered
 * from its compiled Luau twin under out/ (run `pnpm build` first), against
 * the repo's Rojo project, with the Studio-authored container templates from
 * `pnpm ui:templates` as rur's snapshot dir (missing exports degrade to empty
 * containers, same as the emulator test lane). State (engine builds, caches)
 * goes to .cache/rur; renders land in build/ui-renders/<name>/.
 */
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";

const REGISTRY_PATH = "scripts/emulator/ui-renders.json";
const DEFAULT_VIEWPORT = "1920x1080";
const OUT_ROOT = "build/ui-renders";

const [target, ...extra] = process.argv.slice(2);
if (target === undefined || target === "") {
	console.error("usage: pnpm ui:render [<name> | <story.tsx>] [extra rur flags...]");
	console.error(`registered names: ${Object.keys(readRegistry()).join(", ") || "(none)"}`);
	process.exit(64);
}

const registry = readRegistry();
const entry = registry[target];
const storySource = entry?.story ?? target;
const renderName =
	entry !== undefined ? target : path.basename(storySource).replace(/\.story\.tsx?$/u, "");

if (!fs.existsSync(storySource)) {
	console.error(
		`ui-render: story "${storySource}" does not exist${entry !== undefined ? " (registry entry)" : ""}`,
	);
	process.exit(66);
}

const storyLuau = storySource
	.replace(/^src\//u, "out/")
	.replace(/\.tsx?$/u, ".luau")
	.replaceAll("\\", "/");
if (!fs.existsSync(storyLuau)) {
	console.error(`ui-render: compiled story "${storyLuau}" is missing — run \`pnpm build\` first`);
	process.exit(66);
}

const args = [
	"node_modules/roblox-ui-renderer/cli/rur.mjs",
	"render",
	"--story",
	storyLuau,
	"--rojo",
	"default.project.json",
	"--out",
	path.join(OUT_ROOT, renderName),
	"--viewport",
	entry?.viewport ?? DEFAULT_VIEWPORT,
];

if (fs.existsSync("build/ui-templates")) {
	args.push("--snapshot-dir", "build/ui-templates");
} else {
	console.warn(
		"ui-render: build/ui-templates missing — run `pnpm ui:templates`; rendering with empty containers",
	);
}

args.push(...extra);

const result = spawnSync(process.execPath, args, {
	env: { ...process.env, RUR_OUT_DIR: OUT_ROOT, RUR_STATE_DIR: ".cache/rur" },
	stdio: "inherit",
});

process.exit(result.status ?? 1);

function readRegistry() {
	if (!fs.existsSync(REGISTRY_PATH)) {
		return {};
	}

	const parsed = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
	return parsed.renders ?? {};
}
