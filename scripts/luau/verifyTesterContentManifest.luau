local roblox = require("@lune/roblox")
local process = require("@lune/process")
local fs = require("@lune/fs")
local serde = require("@lune/serde")

local placePath = process.args[1]
assert(type(placePath) == "string" and fs.isFile(placePath), "Failed to parse tester place path")

local manifestPath = process.args[2] or "assets/tester-manifest.json"
assert(fs.isFile(manifestPath), `Failed to parse tester manifest: {manifestPath}`)

local game = roblox.deserializePlace(fs.readFile(placePath))
local manifest = serde.decode("json", fs.readFile(manifestPath))

local function pathSegments(relativePath: string): { string }
	local segments = string.split(relativePath, "/")
	assert(#segments > 0 and segments[1] ~= "", `Manifest path must not be empty: {relativePath}`)
	return segments
end

local function readManifestAsset(category: Instance, relativePath: string): Instance
	local current = category
	for _, segment in pathSegments(relativePath) do
		local child = current:FindFirstChild(segment)
		assert(child ~= nil, `Built tester place is missing {category.Parent.Name}/{category.Name}/{relativePath}`)
		current = child
	end
	return current
end

local function readExpectedRoots(relativePaths: { string }): { [string]: boolean }
	local roots = {}
	for _, relativePath in relativePaths do
		local segments = pathSegments(relativePath)
		roots[segments[1]] = true
	end
	return roots
end

for serviceName, categories in manifest do
	local service = game:GetService(serviceName)

	-- Support both formats: ["Folder1", "Folder2"] (flat) or
	-- { Folder1: ["path/a", "path/b"], Folder2: [] } (detailed).
	local isFlatArray = #categories > 0 and type(categories[1]) == "string"

	if isFlatArray then
		-- Flat format: each entry is a top-level folder; just verify it exists.
		for _, folderName in categories do
			local category = service:FindFirstChild(folderName)
			assert(category ~= nil, `Built tester place is missing {serviceName}/{folderName}`)
		end
	else
		-- Detailed format: { categoryName: ["relative/path", ...] }.
		for categoryName, relativePaths in categories do
			local category = service:FindFirstChild(categoryName)
			assert(category ~= nil, `Built tester place is missing {serviceName}/{categoryName}`)

			for _, relativePath in relativePaths do
				readManifestAsset(category, relativePath)
			end

			local expectedRoots = readExpectedRoots(relativePaths)
			for _, child in category:GetChildren() do
				assert(
					expectedRoots[child.Name] == true,
					`Built tester place contains disallowed asset root {serviceName}/{categoryName}/{child.Name}`
				)
			end
		end
	end
end

print(`Verified tester content manifest against {placePath}`)
