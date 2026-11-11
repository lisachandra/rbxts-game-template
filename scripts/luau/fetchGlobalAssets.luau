local roblox = require("@lune/roblox")
local process = require("@lune/process")
local fs = require("@lune/fs")
local serde = require("@lune/serde")

local placeId = process.args[1]
assert(tonumber(placeId) ~= nil, "Failed to parse place id")

local assetsOutput = process.args[2]
assert(type(assetsOutput) == "string", "Failed to parse assets output")

local placeOutput = process.args[3]
assert(type(placeOutput) == "string", "Failed to parse place output")

local manifestPath = process.args[4] or "assets/tester-manifest.json"
assert(fs.isFile(manifestPath), `Failed to parse tester manifest: {manifestPath}`)

-- useCache: "true" keeps the places/*.rbxl snapshot as the cache, "false" re-downloads
-- (test.sh --refresh-places, fetch-places.sh).
local useCache = process.args[5] or "true"
assert(useCache == "true" or useCache == "false", "Failed to parse use cache")

local result = process.exec("lune", {
	"run",
	"scripts/luau/fetchPlace.luau",
	placeId,
	placeOutput,
	useCache,
}, {
	stdio = "forward",
})

if not result.ok then
	return
end

print(`Fetching tester assets from {placeId} using {manifestPath}`)

local game = roblox.deserializePlace(fs.readFile(placeOutput))
local manifest = serde.decode("json", fs.readFile(manifestPath))
local assets = {}

for serviceName, categories in manifest do
	local service = game:GetService(serviceName)
	local container = roblox.Instance.new("Folder")
	container.Name = serviceName

	-- Support both formats: ["Folder1", "Folder2"] (flat) or
	-- { Folder1: ["path/a", "path/b"], Folder2: [] } (detailed).
	local isFlatArray = #categories > 0 and type(categories[1]) == "string"

	if isFlatArray then
		-- Flat format: each entry is a top-level folder name; copy the whole folder.
		for _, folderName in categories do
			local source = service:FindFirstChild(folderName)
			assert(source ~= nil, `Missing tester asset {serviceName}/{folderName}`)
			local copy = source:Clone()
			copy.Parent = container
		end
	else
		-- Detailed format: { categoryName: ["relative/path", ...] }.
		for categoryName, relativePaths in categories do
			local sourceCategory = service:FindFirstChild(categoryName)

			if #relativePaths == 0 then
				-- Empty array means "copy the whole category".
				assert(sourceCategory ~= nil, `Missing tester asset {serviceName}/{categoryName}`)
				local copy = sourceCategory:Clone()
				copy.Parent = container
			else
				local destinationCategory = roblox.Instance.new("Folder")
				destinationCategory.Name = categoryName
				destinationCategory.Parent = container

				for _, relativePath in relativePaths do
					local source = sourceCategory
					local segments = string.split(relativePath, "/")
					for _, segment in segments do
						assert(source ~= nil, `Missing tester asset parent {serviceName}/{categoryName}/{relativePath}`)
						source = source:FindFirstChild(segment)
					end
					assert(source ~= nil, `Missing tester asset {serviceName}/{categoryName}/{relativePath}`)

					local destination = destinationCategory
					for segmentIndex = 1, #segments - 1 do
						local segment = segments[segmentIndex]
						local nextDestination = destination:FindFirstChild(segment)
						if nextDestination == nil then
							nextDestination = roblox.Instance.new("Folder")
							nextDestination.Name = segment
							nextDestination.Parent = destination
						end
						destination = nextDestination
					end

					local copy = source:Clone()
					copy.Parent = destination
				end
			end
		end
	end

	table.insert(assets, container)
end

local modelFile = roblox.serializeModel(assets)
fs.writeFile(assetsOutput, modelFile)
print(`Fetched tester assets from {placeId}`)
