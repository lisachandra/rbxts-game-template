import { describe, expect, it } from "@rbxts/jest-globals";

import { HUD_NAME, HUD_TITLE } from "./constants";

describe("client constants", () => {
	it("should export the HUD name", () => {
		expect.hasAssertions();
		expect(HUD_NAME).toBe("TemplateHud");
	});

	it("should export the HUD title", () => {
		expect.hasAssertions();
		expect(HUD_TITLE).toBe("rbxts-game-template");
	});
});
