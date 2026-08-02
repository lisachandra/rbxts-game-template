// oxlint-disable jest-js/require-top-level-describe -- describeEachReactMode is valid
import { expect, test } from "@rbxts/jest-globals";
import React from "@rbxts/react";
import { screen } from "@rbxts/react-testing-library";

import { describeEachReactMode, expectText, renderWithAppContext } from "client/ui/tests/utils";

import { SessionHudRender } from "../sessionHud.render";

describeEachReactMode("SessionHudRender", () => {
	test("should render the template title, ping, and session count", () => {
		expect.hasAssertions();

		renderWithAppContext(<SessionHudRender pingMs={12.4} sessionCount={3} />);

		expect(screen.getByTestId("session-hud")).toBeDefined();

		expectText(screen.getByTestId("session-title"), "rbxts-game-template");
		expectText(screen.getByTestId("session-ping"), "Ping: 12 ms");
		expectText(screen.getByTestId("session-count"), "Sessions: 3");
	});
});
