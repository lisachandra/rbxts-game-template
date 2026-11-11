import { defineConfig } from "@isentinel/jest-roblox";

/*
 * Specs the emulator lane cannot run yet — ree parity gaps, each with a
 * captured failure signature in docs/agents/offline-runtime-spike.md.
 *
 * NOTE FOR AGENTS:
 * Implementing spec that fails on Roblox engine gap (ree parity)? Add spec
 * path here. `test.sh` auto-routes `pnpm test --testPathPattern "<pattern>"`
 * to Studio backend when targeting a path in this list.
 */
const reeParityPaths: Array<string> = [];

/*
 * Specs that want their own lane rather than the default run. Empty in the
 * template: add a path when a spec is slow enough to warrant one, not because
 * it fails.
 */
// oxlint-disable-next-line unused-imports/no-unused-vars -- read textually by scripts/bash/test.sh
const slowTestPaths: Array<string> = [];

const isCi = process.env["CI"] !== undefined && process.env["CI"] !== "";

export default defineConfig({
	/*
	 * Default lane (`pnpm test`): emulator backend stages out/ and runs
	 * compiled specs inside ree — offline, no Studio roundtrip, with
	 * coverage. Runs the full suite including slow specs.
	 * Ree parity gaps (`reeParityPaths`) auto-route to the Studio runner when
	 * targeted via pattern.
	 */
	backend: "emulator",
	emulator: {
		globals: {
			__ROACT_17_MOCK_SCHEDULER__: true,
			__TEST__: true,
			NOCOLOR: true,
		},
		ignorePatterns: [...reeParityPaths],
		reePath: "ree",
		reflectionPath: "scripts/emulator/reflection.json",
		seconds: 30,
		/*
		 * `<Service>.rbxm` bundles of the container folders the Rojo project
		 * declares; ree loads them before the mounts so the global-asset
		 * containers exist. `scaffoldContainers.luau` generates them offline
		 * from `default.project.json` (`pnpm ui:templates`); a place-exported
		 * bundle wins over the scaffold, and missing bundles degrade to the
		 * runner's empty stubs.
		 */
		snapshotsDirectory: "build/ui-templates",
	},
	gameOutput: "game-output.log",
	jestPath: "ReplicatedStorage/TS/rbxts_include/node_modules/@rbxts/jest/src",
	outputFile: "jest-output.log",
	placeFile: "build/production.rbxl",
	rojoProject: "default.project.json",
	test: {
		clearMocks: true,
		collectCoverage: true,
		coveragePathIgnorePatterns: ["**/*.spec.ts", "**/*.spec.tsx"],
		mockDataModel: false,
		projects: [
			{
				test: {
					displayName: { color: "blue", name: "client" },
					include: ["src/client/**/*.spec.ts", "src/client/**/*.spec.tsx"],
					outDir: "out/client",
				},
			},
			{
				test: {
					displayName: { color: "green", name: "shared" },
					include: ["src/shared/**/*.spec.ts", "src/shared/**/*.spec.tsx"],
					outDir: "out/shared",
				},
			},
			{
				test: {
					displayName: { color: "magenta", name: "server" },
					include: ["src/server/**/*.spec.ts", "src/server/**/*.spec.tsx"],
					outDir: "out/server",
				},
			},
		],
		/*
		 * Default is 60s per project, measured against Studio. Open Cloud
		 * executes the same suites several times slower, so give every project
		 * the headroom the slowest backend needs.
		 */
		projectTimeout: 300_000,
		setupFiles: [
			"./packages/@internal/shared/node_modules/@lisachandra/test/out/setup",
			"./out/test/setup",
		],
		testTimeout: 30000,
		typecheck: { enabled: true },
	},
	timeout: isCi ? 600000 : 300000,
});
