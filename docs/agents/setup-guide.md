# Setup Guide

Everything needed to take a fresh clone to a running build, test lane, and
UI render. Follow in order; each step states what "done" looks like.

> **Fresh copy only.** This guide and `scripts/setup-template.sh` are for a
> project created _from_ the template. Neither applies inside the template
> repository itself — it is already set up, and the wizard rewrites tracked
> files in place.

## 0. Prerequisites

| Tool                         | Why                         | Install                |
| ---------------------------- | --------------------------- | ---------------------- |
| [mise](https://mise.jdx.dev) | pins every binary below     | see mise docs          |
| Git + Git LFS                | submodules, `places/*.rbxl` | system package manager |
| Node 26 / pnpm 12            | provided by mise            | —                      |

`mise.toml` pins the toolchain. Nothing else needs a global install except
mise itself.

**Done when:** `mise --version` works.

## 1. Install the toolchain

```bash
mise install
```

This fetches every pinned binary, including four you will not find on npm:

| Binary                    | Role                                                       | Source          |
| ------------------------- | ---------------------------------------------------------- | --------------- |
| `sloptor`                 | TypeScript→Luau compiler and type checker                  | release fork    |
| `ree`                     | roblox-engine-emulator; runs the default test lane offline | release fork    |
| `rojo`, `lune`, `darklua` | project build, Luau scripting, bundling                    | public releases |
| `run-in-roblox`           | Studio test lane                                           | public release  |

**Done when:** `sloptor version`, `ree --version`, and `rojo --version` all
print a version.

## 2. Project setup

```bash
pnpm setup
```

Runs submodule init, a frozen install, a full build, and the workspace hoist.

**Done when:** `out/` exists and `pnpm typecheck` passes.

## 3. Configure secrets

Copy `.env.example` to `.env` and fill what you need. Every value is optional
for local development:

| Variable                        | Needed for                                |
| ------------------------------- | ----------------------------------------- |
| `ROBLOX_OPEN_CLOUD_API_KEY`     | Studio/Open Cloud test lane, Bedrock      |
| `ROBLOX_UNIVERSE_ID`            | Studio/Open Cloud test lane, Bedrock      |
| `ROBLOX_PLACE_ID`               | Studio/Open Cloud test lane, Bedrock      |
| `BEDROCK_API_KEY`               | `pnpm bedrock:diff` / `deploy`            |
| `BEDROCK_GITHUB_TOKEN`          | Bedrock state gist                        |
| `ASPHALT_API_KEY`               | asset codegen                             |
| `ROBLOX_GLOBAL_ASSETS_PLACE_ID` | global-asset injection during place build |

The emulator lane needs none of these: `pnpm test` is offline. The Open Cloud
triple is only read by the Studio fallback and by Bedrock.

**Done when:** `.env` exists and is git-ignored.

## 4. Bedrock (only if deploying)

1. Replace the TODO universe/place IDs in `bedrock.config.ts`.
2. Create a private GitHub gist for state; set its id in `state.gistId`.
3. Run `pnpm bedrock:diff` before any `pnpm bedrock:deploy`.

**Done when:** `pnpm bedrock:diff` reports the expected resource set.

## 5. Test lane

```bash
pnpm test                                  # full suite, emulated
pnpm test --testPathPattern "<pattern>"    # targeted
```

The default lane runs compiled Luau inside `ree`, offline. Specs listed in
`reeParityPaths` (`jest.config.ts`) auto-route to the Studio backend when
targeted, because ree does not emulate everything — see
`docs/agents/offline-runtime-spike.md`.

**Done when:** `pnpm test` is green.

## 6. UI rendering (optional)

`rur` rasterises UI stories without opening Studio.

```bash
pnpm build
pnpm ui:templates          # scaffolds <Service> container bundles for ree staging
pnpm ui:render <story>     # writes build/ui-renders/<story>/
```

`pnpm ui:templates` runs `scripts/luau/scaffoldContainers.luau`, which builds the
container bundles offline from `default.project.json`. To export bundles from a
real place file instead, run `pnpm ui:templates:export`.

Register stories in `scripts/emulator/ui-renders.json` under the `renders` key
(the reader in `scripts/javascript/uiRender.mjs` reads `parsed.renders`):

```json
{
	"renders": {
		"myHud": {
			"story": "src/client/ui/hud/myHud.story.tsx",
			"viewport": "1920x1080"
		}
	}
}
```

`rur` needs Rust 1.90+, a C++ toolchain, and a Roblox Studio install for its
fonts and `rbxasset://` textures. Set `RUR_ROBLOX_CONTENT` to a copy of
Studio's `content` folder to avoid the Studio dependency. The first run builds
a native binary, which takes minutes. `rur doctor` checks the toolchain.

Trust `rur` for layout and geometry parity. Verify final polish, input, and
effects in Studio.

**Done when:** `pnpm ui:render <story>` writes a `render.png` you are happy
with.

## 7. Studio lane (only when ree disagrees)

```bash
pnpm test --testPathPattern "<a spec in reeParityPaths>"
```

Needs a Roblox Studio install. If the runner times out with
`Timeout reached while waiting for Roblox Studio to come online` on Windows:

```powershell
net stop winnat
net start winnat
```

Then reopen Studio and retry.

**Done when:** the targeted spec passes on the Studio backend.

## Troubleshooting

| Symptom                                    | Cause                                      | Fix                                                         |
| ------------------------------------------ | ------------------------------------------ | ----------------------------------------------------------- |
| `sloptor: not found`                       | mise not activated                         | `mise install`, then `mise trust`                           |
| Build emits `.luau` but plugins do nothing | missing `rotor.toml` `[flamework]` section | restore `rotor.toml` — it is load-bearing                   |
| `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`        | CRLF in `patches/**`                       | `.gitattributes` pins `patches/** text eol=lf`; re-checkout |
| Test spec fails only on emulator           | ree parity gap                             | add path to `reeParityPaths`, log it in the parity ledger   |
| `rur` cannot find fonts                    | Studio not installed                       | set `RUR_ROBLOX_CONTENT`                                    |
