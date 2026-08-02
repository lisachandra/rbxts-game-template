interface ServerScriptService extends Instance {
	TS: Folder & {
		server: Folder;
		rbxts_include: Folder & {
			node_modules: Folder;
		};
	};
}
