import { RunService } from "@rbxts/services";
import { MessageEmitter } from "@rbxts/tether";

export const enum SessionMessage {
	Ping,
	PingReturn,
}

export interface SessionMessageMap {
	[SessionMessage.Ping]: {
		readonly sentAt: number;
	};
	[SessionMessage.PingReturn]: {
		readonly sentAt: number;
	};
}

export const sessionMessaging = MessageEmitter.create<SessionMessageMap>({
	batchRate: 1 / 60,
	batchRemotes: !RunService.IsStudio(),
});
