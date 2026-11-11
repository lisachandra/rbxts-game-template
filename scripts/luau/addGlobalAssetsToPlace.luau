local roblox = require("@lune/roblox")
local process = require("@lune/process")
local fs = require("@lune/fs")

local assetsFilePath = process.args[1]
assert(type(assetsFilePath) == "string" and fs.isFile(assetsFilePath), "Failed to parse assets file path")

local placeFilePath = process.args[2]
assert(type(placeFilePath) == "string" and fs.isFile(placeFilePath), "Failed to parse place file path")

print(`Adding global assets ({assetsFilePath}) to {placeFilePath}`)

local game = roblox.deserializePlace(fs.readFile(placeFilePath))
local assets = roblox.deserializeModel(fs.readFile(assetsFilePath))

for _, container in assets do
	if not container:IsA("Folder") then
		continue
	end

	local service = game:GetService(container.Name)
	for _, asset in container:GetChildren() do
		if service:FindFirstChild(asset.Name) then
			service:FindFirstChild(asset.Name):Destroy()
		end

		asset.Parent = service
	end
end

fs.writeFile(placeFilePath, roblox.serializePlace(game))
print(`Added global assets ({assetsFilePath}) to {placeFilePath}`)
