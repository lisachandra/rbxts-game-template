import type { SessionState } from "client/ui/hooks/useSessionState";

export interface SessionHudModel {
	readonly pingMs?: number;
	readonly sessionCount: number;
}

export function createSessionHudModel(state: SessionState): SessionHudModel {
	return {
		pingMs: state.pingMs,
		sessionCount: state.sessionCount,
	};
}
