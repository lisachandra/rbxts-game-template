/* oxlint-disable import/first -- Halt execution if executed in tests */

const RunService = game.GetService("RunService");
if ((RunService.IsStudio() && RunService.IsRunMode()) || (_G.__TEST__ ?? false)) {
	coroutine.yield();
}

import("server/document").expect();
import("shared/matter/components").expect();
import("shared/network/messaging").expect();

import { setupLogger } from "@lisachandra/core/logger";
import {
	configureEntityLookup,
	configureRuntimeAdapters,
	configureStreamableEntityLookup,
	getEntityInstanceComponents,
	getStreamableComponents,
} from "@lisachandra/matter";
import { bootstrap } from "@lisachandra/platform";
import { Centurion } from "@rbxts/centurion";
import Log from "@rbxts/log";
import { ReplicatedStorage, ServerScriptService } from "@rbxts/services";

const OWNER = 0; // TODO: replace with your Roblox user id

_G.__DEV__ = RunService.IsStudio();
_G.__PROD__ = !RunService.IsStudio();

setupLogger();

// Register your entity components here, e.g. ["PlayerSession"].
configureEntityLookup({
	instanceComponents: [...getEntityInstanceComponents()],
});

configureStreamableEntityLookup({
	components: [...getStreamableComponents()],
});

configureRuntimeAdapters({
	authorize: async (player) => player.UserId === OWNER,
});

const { shared } = ReplicatedStorage.TS;
const { server } = ServerScriptService.TS;

bootstrap({
	hotReload: {
		containers: [server.systems, shared.matter.systems],
	},
	mode: _G.__PROD__ ? "production" : "development",
	modules: {
		server: import("server/systems/barrel").expect(),
		shared: import("shared/matter/systems/barrel").expect(),
	},
});

import("@lisachandra/platform/centurion/commands").expect();
import("server/centurion").expect();

Centurion.server().start();

Log.Info("Server started");
