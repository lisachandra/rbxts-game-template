import { Workspace } from "@rbxts/services";

export function initCamera(): void {
	const camera = Workspace.CurrentCamera;
	if (camera === undefined) {
		return;
	}

	camera.CameraType = Enum.CameraType.Custom;
}
