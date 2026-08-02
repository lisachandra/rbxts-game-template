interface ReplicatedStorage extends Instance {
	Animations: Folder & {
		Tools: Folder;
	};
	Models: Folder & {
		Items: Folder;
	};
	Tools: Folder;
	UI: Folder;
	VFX: Folder;
	TS: Folder & {
		client: Folder & {
			systems: Folder;
		};
		shared: Folder & {
			matter: Folder & {
				systems: Folder;
			};
		};
		test: Folder;
		rbxts_include: Folder & {
			node_modules: Folder;
		};
	};
}
