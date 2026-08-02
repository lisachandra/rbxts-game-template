import { Players, UserInputService } from "@rbxts/services";

import { HUD_NAME, HUD_TITLE } from "./constants";
import { initCamera } from "./systems/camera";

function initHud(): void {
	const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
	const screenGui = new Instance("ScreenGui");
	screenGui.Name = HUD_NAME;
	screenGui.ResetOnSpawn = false;

	const label = new Instance("TextLabel");
	label.Name = "Title";
	label.Text = HUD_TITLE;
	label.Size = new UDim2(1, 0, 1, 0);
	label.BackgroundTransparency = 1;
	label.TextScaled = true;
	label.Font = Enum.Font.GothamBold;
	label.Parent = screenGui;

	screenGui.Parent = playerGui;
}

function initInput(): void {
	UserInputService.InputBegan.Connect((input, gameProcessed) => {
		if (gameProcessed) {
			return;
		}

		if (input.UserInputType !== Enum.UserInputType.Keyboard) {
			return;
		}

		print(`Key pressed: ${input.KeyCode.Name}`);
	});
}

initInput();
initHud();
initCamera();
