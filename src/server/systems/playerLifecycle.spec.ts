import { describe, expect, it } from "@rbxts/jest-globals";

import { nextSpawnPosition } from "./playerLifecycle";

describe("nextSpawnPosition", () => {
	it("should space spawns along the z axis", () => {
		expect.hasAssertions();
		expect(nextSpawnPosition(0).Z).toBe(0);
		expect(nextSpawnPosition(1).Z).toBe(4);
	});
});
