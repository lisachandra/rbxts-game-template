import type { u8 } from "@rbxts/serio";
import { MessageEmitter } from "@rbxts/tether";

export enum Message {
	Ping,
}

export interface MessageData {
	[Message.Ping]: {
		readonly payload: string;
		readonly tick: u8;
	};
}

export const messaging = MessageEmitter.create<MessageData>();
