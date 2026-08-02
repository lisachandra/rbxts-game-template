import React from "@rbxts/react";
import type { JSX } from "@rbxts/react";

export interface TemplateHudProps {
	readonly title: string;
}

export function TemplateHud({ title }: TemplateHudProps): JSX.Element {
	return (
		<frame BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
			<textlabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Font={Enum.Font.GothamBold}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 0, 48)}
				Tag="data-testid=template-title"
				Text={title}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			/>
		</frame>
	);
}
