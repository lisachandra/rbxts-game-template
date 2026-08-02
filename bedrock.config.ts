import { defineConfig } from "@bedrock-rbx/core/config";

/**
 * Bedrock's logical resource names are stable across environments. Roblox IDs belong in the
 * environment overlay because staging and production target different universes/places.
 */
export default defineConfig({
	environments: {
		production: {
			label: "production",
			passes: {},
			places: {
				start: {
					placeId: "0", // TODO: replace with your place ID
				},
			},
			products: {},
			universe: {
				consoleEnabled: true,
				desktopEnabled: true,
				mobileEnabled: true,
				tabletEnabled: true,
				universeId: "0", // TODO: replace with your universe ID
				voiceChatEnabled: false,
				vrEnabled: false,
			},
		},
	},
	places: {
		start: {
			displayName: "rbxts-game-template",
			filePath: "build/production.rbxl",
		},
	},
	state: {
		backend: "gist",
		gistId: "", // TODO: replace with your state Gist ID
	},
});
