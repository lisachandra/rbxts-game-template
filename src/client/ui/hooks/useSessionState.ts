import { store } from "@lisachandra/core/store";
import { Components } from "@lisachandra/matter";
import { useEffect, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";

import { SessionMessage, sessionMessaging } from "shared/network/messaging/session";

export interface SessionState {
	readonly pingMs?: number;
	readonly sessionCount: number;
}

const PING_INTERVAL_SECONDS = 1;

/**
 * Tracks the local client's ping round-trip and the number of live player sessions. The ping loop
 * is the tether example; the session count is read from the replicated Matter world.
 */
export function useSessionState(): SessionState {
	const [pingMs, setPingMs] = useState<number | undefined>(undefined);
	const [sessionCount, setSessionCount] = useState(0);

	useEffect(() => {
		const unsubscribePingReturn = sessionMessaging.client.on(
			SessionMessage.PingReturn,
			(data) => {
				setPingMs(math.max(0, (os.clock() - data.sentAt) * 1000));
			},
		);

		let lastSentAt = 0;
		const heartbeat = RunService.Heartbeat.Connect(() => {
			const now = os.clock();
			if (now - lastSentAt < PING_INTERVAL_SECONDS) {
				return;
			}

			lastSentAt = now;
			sessionMessaging.server.emit(SessionMessage.Ping, { sentAt: now }, true);
		});

		return () => {
			unsubscribePingReturn();
			heartbeat.Disconnect();
		};
	}, []);

	useEffect(() => {
		const heartbeat = RunService.Heartbeat.Connect(() => {
			let count = 0;
			for (const [_entityId, _profile] of store.world.query(Components.Profile)) {
				count += 1;
			}

			setSessionCount((current) => (current === count ? current : count));
		});

		return () => {
			heartbeat.Disconnect();
		};
	}, []);

	return { pingMs, sessionCount };
}
