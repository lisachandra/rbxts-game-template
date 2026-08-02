import type { SandcastleUserConfig } from "@lisachandra/sandcastle";

const config: SandcastleUserConfig = {
	dir: ".sandcastle",
	baseBranch: "main",
	setupCommands: ["pnpm setup"],
	symlinks: [
		{ path: "creator-docs", target: "creator-docs" },
		{ path: ".diracrules", target: ".agents" },
	],
	labels: { readyForAgent: "ready-for-agent" },
	reviewMarker: "Sandcastle-Review",
	issueCommand: "gh issue view {issue}",
	agents: {
		enabled: ["dirac", "pi"],
		default: "dirac",
		models: { dirac: "dp/deepseek-v4-flash" },
	},
	effort: "max",
};

export default config;
