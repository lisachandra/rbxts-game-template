import { bool, createCore, defineActions, defineContexts, direction1d } from "@rbxts/flux";
import type { BindingForAction, BindingState } from "@rbxts/flux";

export const playerInputActions = defineActions({
	jump: bool(),
	steer: direction1d(),
	throttle: direction1d(),
});

type PlayerBindingState = {
	readonly [K in keyof typeof playerInputActions]: ReadonlyArray<
		BindingForAction<(typeof playerInputActions)[K]["type"]>
	>;
};

export function createDefaultPlayerBindingState(): BindingState<typeof playerInputActions> &
	PlayerBindingState {
	return {
		jump: [Enum.KeyCode.Space, Enum.KeyCode.ButtonA],
		steer: [
			{ down: Enum.KeyCode.A, up: Enum.KeyCode.D },
			{ down: Enum.KeyCode.Thumbstick1Left, up: Enum.KeyCode.Thumbstick1Right },
		],
		throttle: [
			{ down: Enum.KeyCode.W, up: Enum.KeyCode.S },
			{ down: Enum.KeyCode.Thumbstick1Up, up: Enum.KeyCode.Thumbstick1Down },
		],
	};
}

export const playerInputContexts = defineContexts({
	gameplay: {
		bindings: createDefaultPlayerBindingState(),
	},
});

export const playerInputCore = createCore({
	actions: playerInputActions,
	contexts: playerInputContexts,
	replication: {
		transport: "native",
	},
});
