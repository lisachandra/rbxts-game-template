local roblox = require("@lune/roblox")
local net = require("@lune/net")
local process = require("@lune/process")
local fs = require("@lune/fs")
local serde = require("@lune/serde")

local placeId = process.args[1]
assert(tonumber(placeId) ~= nil, "Failed to parse place id")

local placeOutput = process.args[2]
assert(type(placeOutput) == "string", "Failed to parse place output")

local useCache = process.args[3]
assert(useCache == nil or useCache == "true" or useCache == "false", "Failed to parse use cache")
useCache = useCache == "true" and true or false

-- A place file starts with the binary signature (`<roblox!` + magic) or the XML tag (`<roblox`).
-- Anything else is not a place: an un-smudged Git LFS pointer (`version https://git-lfs...`),
-- a truncated download, or an error body. Reading it back in `fetchGlobalAssets` dies with
-- "Unknown document format".
local function isPlaceFile(contents: string): boolean
	return string.sub(contents, 1, 8) == "<roblox!"
		or string.sub(contents, 1, 7) == "<roblox"
end

-- Some assetdelivery CDN servers gzip the response even though the request does not accept
-- compression (gzip magic: 0x1f 0x8b).
local function decompressIfGzip(contents: string): string
	if string.byte(contents, 1) == 0x1f and string.byte(contents, 2) == 0x8b then
		return tostring(serde.decompress("gzip", contents))
	end
	return contents
end

local cacheHit = false
if useCache and fs.isFile(placeOutput) then
	if isPlaceFile(fs.readFile(placeOutput)) then
		cacheHit = true
	else
		print(`Cached place file {placeOutput} is not a valid place file; refetching`)
	end
end

if not cacheHit then
	print(`Fetching place: {placeId}`)

	local cookie = process.env["ROBLOX_COOKIE"] or roblox.getAuthCookie()
	assert(type(cookie) == "string", "Failed to get roblox auth cookie")

	-- assetdelivery serves from several CDN nodes and some return a body that is not a usable
	-- place file for the same request (compressed or error bodies), so a non-place body is
	-- retryable rather than fatal. Retry until a node returns a parseable place.
	local contents: string? = nil
	for attempt = 1, 5 do
		local placeRequest = net.request({
			url = `https://assetdelivery.roblox.com/v1/asset?id={placeId}`,
			headers = {
				Cookie = cookie,
			} :: never,
		})
		assert(
			placeRequest.ok,
			`Unable to download place - status {placeRequest.statusCode} ({placeRequest.statusMessage})`
		)

		local body = decompressIfGzip(placeRequest.body)
		if isPlaceFile(body) then
			contents = body
			break
		end

		print(`Attempt {attempt}/5 returned a non-place body ({#placeRequest.body} bytes); retrying`)
	end

	assert(contents ~= nil, "All download attempts returned a non-place body")
	fs.writeFile(placeOutput, contents :: string)
end

print(`Fetched place: {placeId}`)
