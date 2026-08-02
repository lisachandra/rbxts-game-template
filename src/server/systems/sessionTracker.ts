import type { ServerState } from "@lisachandra/core/store";
import { store } from "@lisachandra/core/store";
import { Components } from "@lisachandra/matter";
import { useMessage } from "@lisachandra/matter/hooks";
import type { Crate } from "@rbxts/crate";
import type { DebugWidgets, SystemStruct, World } from "@rbxts/matter";

import { SessionMessage, sessionMessaging } from "shared/network/messaging/session";

export function formatSessionLabel(sessionCount: number): string {
	return `Sessions: ${sessionCount}`;
}

function system(_world: World, _crate: Crate<ServerState>, ui: DebugWidgets): void {
	for (const [_index, player, data] of useMessage(sessionMessaging.server, SessionMessage.Ping)) {
		sessionMessaging.client.emit(
			player,
			SessionMessage.PingReturn,
			{ sentAt: data.sentAt },
			true,
		);
	}

	let sessionCount = 0;
	for (const [_entityId, _session] of store.world.query(Components.Session)) {
		sessionCount += 1;
	}

	ui.label(formatSessionLabel(sessionCount));
}

export const meta = {
	system,
} satisfies SystemStruct<[world: World, crate: Crate<ServerState>, ui: DebugWidgets]>;
