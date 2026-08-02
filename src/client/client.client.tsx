/* oxlint-disable import/first -- Halt execution if executed in tests */

import("@rbxts/tether").expect();
import("shared/network/messaging/session").expect();
import("shared/matter/components").expect();

import { configureConstant } from "@lisachandra/constant";
import { setupLogger } from "@lisachandra/core/logger";
import { catcher } from "@lisachandra/core/utils/main";
import {
	configureEntityLookup,
	configureStreamableEntityLookup,
	getEntityInstanceComponents,
	getStreamableComponents,
	Message,
	messaging,
} from "@lisachandra/matter";
import { builtinPackage } from "@lisachandra/matter/systems";
import { bootstrap } from "@lisachandra/platform";
import { Centurion } from "@rbxts/centurion";
import { CenturionUI } from "@rbxts/centurion-ui";
import Iris from "@rbxts/iris";
import Log from "@rbxts/log";
import { backend } from "@rbxts/react-devtools-core";
import ReactGlobals from "@rbxts/react-globals";
import {
	Players,
	ReplicatedStorage,
	RunService,
	SoundService,
	StarterGui,
	UserInputService,
} from "@rbxts/services";

import * as constants from "./constants.json";
import { startAppHotReloader } from "./ui/hotReloader";

ReactGlobals.__PROFILE__ = RunService.IsStudio();
ReactGlobals.__EXPERIMENTAL__ = RunService.IsStudio();
ReactGlobals.__DEV__ = RunService.IsStudio();
ReactGlobals.__COMPAT_WARNINGS__ = RunService.IsStudio();
_G.__DEV__ = RunService.IsStudio();
_G.__PROD__ = !RunService.IsStudio();

if (_G.__DEV__) {
	backend.connectToDevtools();
}

Iris.Init();
setupLogger();
configureConstant("src/client/constants.json", constants, {
	keyCode: Enum.KeyCode.F8,
	title: "Constants",
});

configureEntityLookup({
	instanceComponents: [...getEntityInstanceComponents()],
});

configureStreamableEntityLookup({
	components: [...getStreamableComponents(), "Session"],
});

for (const coreGui of [
	Enum.CoreGuiType.Chat,
	Enum.CoreGuiType.Health,
	Enum.CoreGuiType.Backpack,
	Enum.CoreGuiType.PlayerList,
]) {
	StarterGui.SetCoreGuiEnabled(coreGui, false);
}

// Wait for the folders declared in default.project.json.
for (const name of ["Animations", "Models", "UI", "VFX"]) {
	ReplicatedStorage.WaitForChild(name);
}

for (const name of ["Sounds"]) {
	SoundService.WaitForChild(name);
}

// Wait for the server to assign a server entity ID to the player.
while (Players.LocalPlayer.GetAttribute("serverEntityId") === undefined) {
	task.wait(1);
}

const heartbeat = task.spawn(() => {
	// Send Loaded packets to the server until the client is fully loaded.
	while (true) {
		messaging.server.emit(Message.Loaded);
		task.wait(1);
	}
});

const { client, shared } = ReplicatedStorage.TS;

const { debugger: worldDebugger } = bootstrap({
	hotReload: {
		containers: [client.systems, shared.matter.systems],
	},
	mode: _G.__PROD__ ? "production" : "development",
	modules: {
		client: import("client/systems/barrel").expect(),
		shared: import("shared/matter/systems/barrel").expect(),
	},
	packages: [builtinPackage],
});

UserInputService.InputBegan.Connect((input) => {
	if (input.KeyCode === Enum.KeyCode.F4) {
		worldDebugger.toggle();
	}
});

// Wait for the client to assign a client entity ID to the player.
while (Players.LocalPlayer.GetAttribute("clientEntityId") === undefined) {
	task.wait(1);
}

task.cancel(heartbeat);

startAppHotReloader();
import("@lisachandra/platform/centurion").expect();

Centurion.client()
	.start()
	.then(() => {
		CenturionUI.start(Centurion.client(), { activationKeys: [Enum.KeyCode.F2] });
	})
	.catch(catcher);

Log.Info("Client started");
