import type { ClientState } from "@lisachandra/core/store";
import type { Crate } from "@rbxts/crate";
import type { InputHandle } from "@rbxts/flux";
import type { DebugWidgets, SystemStruct, World } from "@rbxts/matter";
import { useDeltaTime } from "@rbxts/matter";
import { Players } from "@rbxts/services";

import { playerInputCore } from "shared/input";

let inputHandle: undefined | InputHandle;

function ensureInputSource(): InputHandle {
	if (inputHandle !== undefined) {
		return inputHandle;
	}

	inputHandle = playerInputCore.subscribe(Players.LocalPlayer, "gameplay")[0];
	return inputHandle;
}

function system(_world: World, _crate: Crate<ClientState>, ui: DebugWidgets): void {
	const handle = ensureInputSource();
	playerInputCore.update(useDeltaTime());

	const state = playerInputCore.getState(handle);
	ui.label(
		`Input: jump=${state.pressed("jump")} steer=${state.axis1d("steer")} throttle=${state.axis1d("throttle")}`,
	);
}

export const meta = {
	phase: "renderInput",
	system,
} satisfies SystemStruct<[world: World, crate: Crate<ClientState>, ui: DebugWidgets]>;
