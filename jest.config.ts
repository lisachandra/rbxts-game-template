import { defineConfig } from "@isentinel/jest-roblox";

const isCi = process.env["CI"] !== undefined && process.env["CI"] !== "";

export default defineConfig({
	backend: isCi ? "open-cloud" : "studio-cli",
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
		setupFiles: [
			"./packages/@internal/shared/node_modules/@lisachandra/test/out/setup",
			"./out/test/setup",
		],
		testTimeout: isCi ? 600000 : 300000,
		typecheck: { enabled: true },
	},
	timeout: isCi ? 600000 : 300000,
});
