import { AppContext } from "@lisachandra/ui";
import React, { useContext } from "@rbxts/react";
import type { JSX } from "@rbxts/react";

import { Text } from "client/ui/components";
import { COLORS } from "client/ui/tokens";

export interface SessionHudRenderProps {
	readonly pingMs?: number;
	readonly sessionCount: number;
}

export function SessionHudRender({ pingMs, sessionCount }: SessionHudRenderProps): JSX.Element {
	const { px } = useContext(AppContext);

	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundColor3={COLORS.background}
			BackgroundTransparency={0.35}
			BorderSizePixel={0}
			Position={new UDim2(0.5, 0, 0, px(12))}
			Size={UDim2.fromOffset(px(220), px(64))}
			Tag="data-testid=session-hud"
		>
			<uilistlayout Padding={new UDim(0, px(4))} SortOrder={Enum.SortOrder.LayoutOrder} />
			<Text
				LayoutOrder={1}
				Size={UDim2.fromOffset(px(200), px(20))}
				Tag="data-testid=session-title"
				Text="rbxts-game-template"
				TextSize={px(14)}
			/>
			<Text
				LayoutOrder={2}
				Size={UDim2.fromOffset(px(200), px(20))}
				Tag="data-testid=session-ping"
				Text={pingMs === undefined ? "Ping: --" : `Ping: ${math.round(pingMs)} ms`}
				TextColor3={COLORS.muted}
				TextSize={px(12)}
			/>
			<Text
				LayoutOrder={3}
				Size={UDim2.fromOffset(px(200), px(20))}
				Tag="data-testid=session-count"
				Text={`Sessions: ${sessionCount}`}
				TextColor3={COLORS.muted}
				TextSize={px(12)}
			/>
		</frame>
	);
}
