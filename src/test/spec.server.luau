local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

if not RunService:IsStudio() then
	coroutine.yield()
end

_G.NOCOLOR = true
_G.__TEST__ = true
_G.__ROACT_17_MOCK_SCHEDULER__ = true

local Jest = require(ReplicatedStorage.TS.rbxts_include.node_modules["@rbxts"].jest.src)

local status, result = Jest.runCLI(script, {
	verbose = false,
	ci = false,
	setupFiles = {
		ReplicatedStorage.TS.rbxts_include.node_modules["@lisachandra"].test.setup,
		ReplicatedStorage.TS.test.setup,
	},
}, {
	ReplicatedStorage.TS.shared,
	ReplicatedStorage.TS.client,
	ServerScriptService.TS.server,
}):awaitStatus()

if status == "Rejected" or result.results.numFailedTestSuites > 0 or result.results.numFailedTests > 0 then
	print(result)
	error("Tests failed!")
else
	print("Tests passed!")
end
