import { registry } from "@lisachandra/matter";
import { component } from "@rbxts/matter";
import { equalsDeep } from "@rbxts/sift/Dictionary";

export interface PlayerSessionData {
	playerId: number;
	position: Vector3;
}

export const PlayerSession = component<PlayerSessionData>("PlayerSession");

registry.register<PlayerSessionData, PlayerSessionData>({
	component: PlayerSession,
	deserializer: (data) => data,
	mode: "all",
	serializer: (record) => {
		if (equalsDeep(record.old ?? {}, record.new ?? {})) {
			return undefined;
		}

		return record.new;
	},
});
