import { registry } from "@lisachandra/matter";
import { describe, expect, it } from "@rbxts/jest-globals";

import { PlayerSession } from "./components";

describe("matter components", () => {
	it("should export the PlayerSession component", () => {
		expect.hasAssertions();
		expect(PlayerSession).never.toBeUndefined();
	});

	it("should register the PlayerSession replication codec", () => {
		expect.hasAssertions();
		expect(registry.get("PlayerSession")).never.toBeUndefined();
	});
});
