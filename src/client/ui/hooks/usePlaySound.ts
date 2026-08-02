import { store } from "@lisachandra/core/store";
import { Components } from "@lisachandra/matter/components";
import { useCallback } from "@rbxts/react";
import { SoundService } from "@rbxts/services";

/**
 * Returns a stable fire-and-forget callback that spawns a local Sound ECS component when invoked.
 * The builtin soundRenderer system consumes the entity and plays the sound through SoundService.
 *
 * @param category - Folder name under SoundService.Sounds (e.g. "UI").
 * @param name - Sound name under the category folder (e.g. "Confirm").
 * @returns A stable () => void callback.
 */
export function usePlaySound(category: string, name: string): () => void {
	return useCallback(() => {
		const soundInstance =
			SoundService.Sounds.FindFirstChild<Folder>(category)?.FindFirstChild<Sound>(name);
		if (soundInstance === undefined) {
			return;
		}

		const id = soundInstance.GetAttribute("id");
		if (typeIs(id, "number")) {
			store.world.spawn(Components.Sound({ id, local: true }));
		}
	}, [category, name]);
}
