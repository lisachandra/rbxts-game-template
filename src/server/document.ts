import type { CollectionData } from "@lisachandra/core/store";
import { configureRuntimeAdapters } from "@lisachandra/matter";
import { createDataStoreValidator } from "@lisachandra/platform/document/validate";
import { createCollection } from "@rbxts/lapis";

export interface PlayerProfileData {
	readonly favoriteColor: string;
	readonly title: string;
}

// oxlint-disable-next-line eslint-js/no-restricted-syntax -- ambient module declaration
declare module "@lisachandra/core/store" {
	interface CollectionData {
		profile?: PlayerProfileData;
	}
}

const playerDataCollection = createCollection("PlayerData", {
	defaultData: {},
	validate: createDataStoreValidator<CollectionData>(),
});

configureRuntimeAdapters({
	document: {
		collection: playerDataCollection,
	},
});
