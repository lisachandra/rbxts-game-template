/**
 * Bedrock build override.
 *
 * `bedrock build` / a codegen-enabled `bedrock deploy` invoke this file as `<node-or-bun>
 * .bedrock/build.ts --env <environment>`. It must write the place artifact to the `filePath`
 * declared in bedrock.config.ts.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync(
	"sh",
	["scripts/bash/setup-place.sh", "default.project.json", "build/production.rbxl"],
	{ cwd: process.cwd(), stdio: "inherit" },
);

if (result.error !== undefined) {
	console.error(`[bedrock build] failed to launch build script: ${result.error.message}`);
	process.exit(1);
}

process.exit(result.status ?? 1);
