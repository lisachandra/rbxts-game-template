import { registry } from "@lisachandra/matter";
import { Components } from "@lisachandra/matter/components";
import { describe, expect, it } from "@rbxts/jest-globals";

import "./components";

describe("matter components", () => {
	it("should export the Session component", () => {
		expect.hasAssertions();
		expect(Components.Session).never.toBeUndefined();
	});

	it("should register the Session replication codec", () => {
		expect.hasAssertions();
		expect(registry.get("Session")).never.toBeUndefined();
	});
});
