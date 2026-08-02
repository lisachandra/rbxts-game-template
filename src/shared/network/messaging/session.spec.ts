import { describe, expect, it } from "@rbxts/jest-globals";

import { SessionMessage, sessionMessaging } from "./session";

describe("session messaging", () => {
	it("should map Ping to the first message slot", () => {
		expect.hasAssertions();
		expect(SessionMessage.Ping).toBe(0);
	});

	it("should map PingReturn to the second message slot", () => {
		expect.hasAssertions();
		expect(SessionMessage.PingReturn).toBe(1);
	});

	it("should create both emitter halves", () => {
		expect.hasAssertions();
		expect(sessionMessaging.server).never.toBeUndefined();
		expect(sessionMessaging.client).never.toBeUndefined();
	});
});
