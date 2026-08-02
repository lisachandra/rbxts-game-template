import React from "@rbxts/react";
import type { JSX } from "@rbxts/react";

import { useSessionState } from "client/ui/hooks/useSessionState";

import { SessionHudRender } from "./sessionHud.render";
import { createSessionHudModel } from "./sessionHudModel";

export function SessionHudConnector(): JSX.Element {
	const state = useSessionState();
	const model = createSessionHudModel(state);

	return <SessionHudRender pingMs={model.pingMs} sessionCount={model.sessionCount} />;
}
