import { describe, expect, it } from "@rbxts/jest-globals";

import { DEFAULT_SPAWN_POSITION, GAME_NAME } from "./constants";

describe("constants", () => {
	it("should export the template game name", () => {
		expect.hasAssertions();
		expect(GAME_NAME).toBe("rbxts-game-template");
	});

	it("should export a default spawn position", () => {
		expect.hasAssertions();
		expect(DEFAULT_SPAWN_POSITION.X).toBe(0);
		expect(DEFAULT_SPAWN_POSITION.Y).toBe(10);
		expect(DEFAULT_SPAWN_POSITION.Z).toBe(0);
	});
});
