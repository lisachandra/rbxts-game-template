import { AppContext, usePx } from "@lisachandra/ui";
import type { AppContextObject } from "@lisachandra/ui";
import { expect } from "@rbxts/jest-globals";
import React, { useBinding, useMemo } from "@rbxts/react";
import type { JSX } from "@rbxts/react";
import { render } from "@rbxts/react-testing-library";

export { describeEachReactMode } from "@lisachandra/test";

interface RenderOptions {
	readonly screen?: Vector2;
	readonly viewport?: Vector2;
}

function TestWrapper({
	children,
	screen: screenSize,
	viewport: viewportSize,
}: {
	readonly children: React.ReactNode;
	readonly screen: Vector2;
	readonly viewport: Vector2;
}): JSX.Element {
	const [viewport] = useBinding(viewportSize);
	const [screen] = useBinding(screenSize);
	const px = usePx(viewport);
	const value = useMemo<AppContextObject>(() => {
		return { px, screen, viewport };
	}, [px, screen, viewport]);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function renderWithAppContext(
	element: JSX.Element,
	options: RenderOptions = {},
): ReturnType<typeof render> {
	return render(
		<TestWrapper
			screen={options.screen ?? new Vector2(1920, 1080)}
			viewport={options.viewport ?? new Vector2(1920, 1080)}
		>
			{element}
		</TestWrapper>,
	);
}

export function expectText(instance: Instance, expected: string): void {
	expect(instance.IsA("TextLabel") || instance.IsA("TextButton")).toBe(true);
	if (instance.IsA("TextLabel") || instance.IsA("TextButton")) {
		expect(instance.Text).toBe(expected);
	}
}
