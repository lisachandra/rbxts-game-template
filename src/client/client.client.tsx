/* oxlint-disable import/first -- Halt execution if executed in tests */

import("shared/matter/components").expect();
import("shared/network/messaging").expect();

import { setupLogger } from "@lisachandra/core/logger";
import {
	configureEntityLookup,
	configureStreamableEntityLookup,
	getEntityInstanceComponents,
	getStreamableComponents,
} from "@lisachandra/matter";
import { bootstrap } from "@lisachandra/platform";
import Log from "@rbxts/log";
import React, { StrictMode } from "@rbxts/react";
import ReactGlobals from "@rbxts/react-globals";
import { createRoot } from "@rbxts/react-roblox";
import { Players, ReplicatedStorage, RunService } from "@rbxts/services";

import { TemplateHud } from "./ui/components";

ReactGlobals.__DEV__ = RunService.IsStudio();
ReactGlobals.__PROFILE__ = RunService.IsStudio();
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

const { client, shared } = ReplicatedStorage.TS;

bootstrap({
	hotReload: {
		containers: [client.systems, shared.matter.systems],
	},
	mode: _G.__PROD__ ? "production" : "development",
	modules: {
		client: import("client/systems/barrel").expect(),
		shared: import("shared/matter/systems/barrel").expect(),
	},
});

const playerGui = Players.LocalPlayer.WaitForChild<PlayerGui>("PlayerGui");
const screenGui = new Instance("ScreenGui");
screenGui.Name = "TemplateHud";
screenGui.ResetOnSpawn = false;
screenGui.Parent = playerGui;

createRoot(screenGui).render(
	<StrictMode>
		<TemplateHud title="rbxts-game-template" />
	</StrictMode>,
);

Log.Info("Client started");
