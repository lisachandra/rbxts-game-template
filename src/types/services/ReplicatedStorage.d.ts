interface ReplicatedStorage extends Instance {
	TS: Folder & {
		client: Folder;
		shared: Folder;
		test: Folder;
		rbxts_include: Folder & {
			node_modules: Folder;
		};
	};
}
