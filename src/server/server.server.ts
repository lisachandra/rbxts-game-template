import { World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";

import { spawnPlayers } from "./systems/playerLifecycle";

const world = new World();

RunService.Heartbeat.Connect(() => {
	spawnPlayers(world);
});
