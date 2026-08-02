import { describe, expect, it } from "@rbxts/jest-globals";
import React from "@rbxts/react";
import { render, screen } from "@rbxts/react-testing-library";

import { TemplateHud } from "../templateHud";

describe("templateHud", () => {
	it("should render the template title", () => {
		expect.hasAssertions();

		render(<TemplateHud title="rbxts-game-template" />);

		const label = screen.getByTestId("template-title") as TextLabel;

		expect(label.Text).toBe("rbxts-game-template");
	});
});
