import type { ServerState } from "@lisachandra/core/store";
import type { Crate } from "@rbxts/crate";
import { useEvent } from "@rbxts/matter";
import type { DebugWidgets, SystemStruct, World } from "@rbxts/matter";
import { Players } from "@rbxts/services";

import { PlayerSession } from "shared/matter/components";

let sessionCount = 0;

export function nextSpawnPosition(index: number): Vector3 {
	return new Vector3(0, 10, index * 4);
}

function system(world: World, _crate: Crate<ServerState>, ui: DebugWidgets): void {
	for (const [, player] of useEvent(Players, "PlayerAdded")) {
		world.spawn(
			PlayerSession({
				playerId: player.UserId,
				position: nextSpawnPosition(sessionCount),
			}),
		);
		sessionCount += 1;
	}

	for (const [, player] of useEvent(Players, "PlayerRemoving")) {
		for (const [entityId] of world.query(PlayerSession)) {
			const session = world.get(entityId, PlayerSession);
			if (session !== undefined && session.playerId === player.UserId) {
				world.despawn(entityId);
			}
		}
	}

	ui.label(`Player sessions: ${sessionCount}`);
}

export const meta = {
	system,
} satisfies SystemStruct<[world: World, crate: Crate<ServerState>, ui: DebugWidgets]>;
