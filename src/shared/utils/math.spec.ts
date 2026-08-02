import { describe, expect, it } from "@rbxts/jest-globals";

import { clamp } from "./math";

describe("clamp", () => {
	it("should clamp values above the maximum", () => {
		expect.hasAssertions();
		expect(clamp(5, 0, 3)).toBe(3);
	});

	it("should clamp values below the minimum", () => {
		expect.hasAssertions();
		expect(clamp(-1, 0, 3)).toBe(0);
	});

	it("should keep in-range values unchanged", () => {
		expect.hasAssertions();
		expect(clamp(2, 0, 3)).toBe(2);
	});
});
