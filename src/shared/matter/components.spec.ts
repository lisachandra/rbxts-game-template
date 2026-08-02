import { registry } from "@lisachandra/matter";
import { Components } from "@lisachandra/matter/components";
import { describe, expect, it } from "@rbxts/jest-globals";

// oxlint-disable-next-line import/no-unassigned-import -- Registers Matter component codecs in the registry used by these specs.
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
