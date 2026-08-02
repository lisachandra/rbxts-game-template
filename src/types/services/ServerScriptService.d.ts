interface ServerScriptService extends Instance {
	TS: Folder & {
		server: Folder & {
			systems: Folder;
		};
		rbxts_include: Folder & {
			node_modules: Folder;
		};
	};
}
