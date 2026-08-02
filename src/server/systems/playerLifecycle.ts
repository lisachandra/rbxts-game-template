import type { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";

import { Spawned } from "shared/matter/components";

const spawnedPlayers = new Set<number>();

export function nextSpawnPosition(index: number): Vector3 {
	return new Vector3(0, 10, index * 4);
}

export function spawnPlayers(world: World): void {
	const players = Players.GetPlayers();
	for (const index of $range(0, players.size() - 1)) {
		const player = players[index];
		if (player === undefined) {
			continue;
		}

		if (spawnedPlayers.has(player.UserId)) {
			continue;
		}

		spawnedPlayers.add(player.UserId);
		world.spawn(Spawned({ playerId: player.UserId, position: nextSpawnPosition(index) }));
	}
}
