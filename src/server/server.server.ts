/* oxlint-disable import/first -- Halt execution if executed in tests */

const OWNER = 0; // TODO: replace with your Roblox user id

const RunService = game.GetService("RunService");
if ((RunService.IsStudio() && RunService.IsRunMode()) || (_G.__TEST__ ?? false)) {
	coroutine.yield();
}

import("@rbxts/tether").expect();
import("shared/network/messaging/session").expect();
import("shared/matter/components").expect();

import { configureAutomaticConstantReplication, configureConstant } from "@lisachandra/constant";

import * as constants from "./constants.json";

configureConstant("src/server/constants.json", constants);

import { setupLogger } from "@lisachandra/core/logger";
import {
	Components,
	configureEntityLookup,
	configureRuntimeAdapters,
	configureStreamableEntityLookup,
	getEntityInstanceComponents,
	getStreamableComponents,
} from "@lisachandra/matter";
import { builtinPackage } from "@lisachandra/matter/systems";
import { bootstrap, configureCenturionUsers } from "@lisachandra/platform";
import { Centurion } from "@rbxts/centurion";
import { setConfig } from "@rbxts/lapis";
import DataStoreServiceMock from "@rbxts/lapis-mockdatastore";
import Log from "@rbxts/log";
import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";

// Set global variables for development.
_G.__DEV__ = RunService.IsStudio();
_G.__PROD__ = !RunService.IsStudio();

// Use the mock data store in Studio so player documents work without Roblox storage.
if (RunService.IsStudio()) {
	setConfig({ dataStoreService: new DataStoreServiceMock() });
}

setupLogger();

configureAutomaticConstantReplication({
	canEdit: (player) => player.UserId === OWNER,
});

configureEntityLookup({
	instanceComponents: [...getEntityInstanceComponents()],
});

configureStreamableEntityLookup({
	components: [...getStreamableComponents(), "Session"],
});

let nextSpawnIndex = 0;

configureRuntimeAdapters({
	authorize: Promise.promisify((player) => player.UserId === OWNER),
	playerLifecycle: {
		componentFactory: (player, janitor) => {
			const spawnIndex = nextSpawnIndex;
			nextSpawnIndex += 1;

			return [
				Components.Profile({ janitor, player }),
				Components.Session({ playerId: player.UserId, spawnIndex }),
			];
		},
		onPlayerRemoving: (_world, player) => {
			Log.Info("Player removed: {Player}", player.Name);
		},
		preSpawn: (_player) => {
			// TODO: replace with your spawn authorization rules.
			return [true];
		},
	},
});

configureCenturionUsers([OWNER]);

const { shared } = ReplicatedStorage.TS;
const { server } = ServerScriptService.TS;

import("server/document").expect();

const { debugger: worldDebugger } = bootstrap({
	hotReload: {
		containers: [server.systems, shared.matter.systems],
	},
	mode: _G.__PROD__ ? "production" : "development",
	modules: {
		server: import("server/systems/barrel").expect(),
		shared: import("shared/matter/systems/barrel").expect(),
	},
	packages: [builtinPackage],
});

worldDebugger.authorize = (player: Player) => player.UserId === OWNER;

import("@lisachandra/platform/centurion").expect();
import("server/centurion").expect();

Centurion.server().start();

Log.Info("Server started");
