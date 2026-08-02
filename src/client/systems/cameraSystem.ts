import type { ClientState } from "@lisachandra/core/store";
import type { Crate } from "@rbxts/crate";
import type { DebugWidgets, SystemStruct, World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";

function system(_world: World, _crate: Crate<ClientState>, ui: DebugWidgets): void {
	const camera = Workspace.CurrentCamera;
	if (camera !== undefined) {
		camera.CameraType = Enum.CameraType.Custom;
	}

	ui.label("Template client systems active");
}

export const meta = {
	system,
} satisfies SystemStruct<[world: World, crate: Crate<ClientState>, ui: DebugWidgets]>;
