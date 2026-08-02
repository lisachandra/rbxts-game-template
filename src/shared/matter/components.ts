import { registry } from "@lisachandra/matter";
import { Components } from "@lisachandra/matter/components";
import { component } from "@rbxts/matter";
import { equalsDeep } from "@rbxts/sift/Dictionary";

// oxlint-disable-next-line eslint-js/no-restricted-syntax -- ambient module declaration
declare module "@lisachandra/matter/components" {
	interface Components {
		Session: {
			playerId: number;
			spawnIndex: number;
		};
	}
}

Components.Session = component<Components["Session"]>("Session");

registry.register<Components["Session"], Components["Session"]>({
	component: Components.Session,
	deserializer: (data) => data,
	mode: "all",
	serializer: (record) => (!equalsDeep(record.old ?? {}, record.new ?? {}) ? record.new : false),
});
