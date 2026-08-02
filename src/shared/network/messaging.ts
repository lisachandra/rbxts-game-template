import type { u8 } from "@rbxts/serio";
import { RunService } from "@rbxts/services";
import { MessageEmitter } from "@rbxts/tether";

export enum Message {
	Ping,
	PingReturn,
	Loaded,
}

export interface MessageMap {
	[Message.Loaded]: undefined;
	[Message.Ping]: {
		readonly payload: string;
		readonly tick: u8;
	};
	[Message.PingReturn]: {
		readonly tick: u8;
	};
}

export const messaging = MessageEmitter.create<MessageMap>({
	batchRate: 1 / 60,
	batchRemotes: !RunService.IsStudio(),
});
