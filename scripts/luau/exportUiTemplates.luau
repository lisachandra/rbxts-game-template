-- Export Studio-authored UI template containers from a cached tester place into standalone
-- .rbxm files that the offline tools (rur / ree) can mount.
-- Usage: lune run scripts/luau/exportUiTemplates.luau <places/<placeId>.rbxl> <outDir>
local roblox = require("@lune/roblox")
local process = require("@lune/process")
local fs = require("@lune/fs")

local placeFilePath = process.args[1]
assert(type(placeFilePath) == "string" and fs.isFile(placeFilePath), "usage: exportUiTemplates.luau <places/<placeId>.rbxl> <outDir>")
local outDir = process.args[2]
assert(type(outDir) == "string", "usage: exportUiTemplates.luau <places/<placeId>.rbxl> <outDir>")

print(`Exporting UI templates from {placeFilePath} to {outDir}`)

local game = roblox.deserializePlace(fs.readFile(placeFilePath))

fs.writeDir(outDir)

-- Containers the UI stories and specs consume (subset of assets/tester-manifest.json).
-- ReplicatedStorage.UI holds the static template trees; SoundService.Sounds backs usePlaySound.
-- Models/VFX/Animations are mounted alongside because content modules index them at require time.
local exports = {
	{ service = "ReplicatedStorage", container = "UI", outFile = "UI.rbxm" },
	{ service = "ReplicatedStorage", container = "Models", outFile = "Models.rbxm" },
	{ service = "ReplicatedStorage", container = "VFX", outFile = "VFX.rbxm" },
	{ service = "ReplicatedStorage", container = "Animations", outFile = "Animations.rbxm" },
	{ service = "ReplicatedStorage", container = "Tools", outFile = "Tools.rbxm" },
	{ service = "SoundService", container = "Sounds", outFile = "Sounds.rbxm" },
	{ service = "Workspace", container = "Caches", outFile = "WorkspaceCaches.rbxm" },
	{ service = "Workspace", container = "Maps", outFile = "WorkspaceMaps.rbxm" },
	{ service = "Workspace", container = "Characters", outFile = "WorkspaceCharacters.rbxm" },
	{ service = "Workspace", container = "Nodes", outFile = "WorkspaceNodes.rbxm" },
	{ service = "Workspace", container = "Cars", outFile = "WorkspaceCars.rbxm" },
}

for _, spec in exports do
	local service = game:GetService(spec.service)
	local container = service:FindFirstChild(spec.container)
	if container == nil then
		print(`  !! {spec.service}.{spec.container} not found in place; skipped`)
		continue
	end

	local path = `{outDir}/{spec.outFile}`
	fs.writeFile(path, roblox.serializeModel({ container }))
	print(`  exported {spec.service}.{spec.container} ({#container:GetChildren()} children) -> {path}`)
end

--[[
	Service-level bundles for ree's `--snapshot-dir`, which loads every
	`<Service>.rbxm` in a directory into its service before the mounts. Each
	bundle's root children are the exported containers, so one file per service
	covers all of them (`load_snapshot` merges the children under the service).
]]
local serviceContainers: { [string]: { string } } = {}
for _, spec in exports do
	local list = serviceContainers[spec.service]
	if list == nil then
		list = {}
		serviceContainers[spec.service] = list
	end
	table.insert(list, spec.container)
end

for service, containers in serviceContainers do
	local roots = {}
	local missing = {}
	for _, container in containers do
		local instance = game:GetService(service):FindFirstChild(container)
		if instance == nil then
			table.insert(missing, container)
		else
			table.insert(roots, instance)
		end
	end
	if #roots == 0 then
		print(`  !! {service}: no containers found; bundle skipped`)
		continue
	end

	local path = `{outDir}/{service}.rbxm`
	fs.writeFile(path, roblox.serializeModel(roots))
	print(
		`  bundled {service}.rbxm ({#roots} container(s); skipped: {table.concat(missing, ", ")}) -> {path}`
	)
end
