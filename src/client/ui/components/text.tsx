import React from "@rbxts/react";
import type { JSX } from "@rbxts/react";

import { COLORS, FONT } from "../tokens";

type TextLabelProps = JSX.IntrinsicElements["textlabel"];
export type TextProps = TextLabelProps;

export function Text(props: Readonly<TextProps>): JSX.Element {
	return (
		<textlabel
			BackgroundTransparency={1}
			FontFace={FONT}
			TextColor3={COLORS.foreground}
			TextSize={14}
			TextXAlignment={Enum.TextXAlignment.Left}
			{...props}
		/>
	);
}
