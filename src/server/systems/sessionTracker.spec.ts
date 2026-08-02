import { describe, expect, it } from "@rbxts/jest-globals";

import { formatSessionLabel } from "./sessionTracker";

describe("formatSessionLabel", () => {
	it("should format a zero session count", () => {
		expect.hasAssertions();
		expect(formatSessionLabel(0)).toBe("Sessions: 0");
	});

	it("should format a non-zero session count", () => {
		expect.hasAssertions();
		expect(formatSessionLabel(3)).toBe("Sessions: 3");
	});
});
