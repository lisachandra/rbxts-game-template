<div align="center">
  <h1>rbxts-game-template</h1>

  <p>
    <strong>A general-purpose Roblox game template built with roblox-ts.</strong>
  </p>

![CI Status][ci-badge] ![Test Results][test-results-badge]
![Test Coverage][test-coverage-badge] ![Version][version-badge]

[ci-badge]: https://github.com/lisachandra/rbxts-game-template/actions/workflows/ci.yaml/badge.svg
[test-results-badge]: https://gist.githubusercontent.com/lisachandra/98ea2c22899fecc5bd04aa463fa43c4f/raw/test-results-badge.svg
[test-coverage-badge]: https://gist.githubusercontent.com/lisachandra/98ea2c22899fecc5bd04aa463fa43c4f/raw/test-coverage-badge.svg
[version-badge]: https://gist.githubusercontent.com/lisachandra/98ea2c22899fecc5bd04aa463fa43c4f/raw/version-badge.svg

</div>

A general-purpose Roblox game template built with roblox-ts, pnpm, the
`@lisachandra` runtime stack, and a strict build/lint/typecheck/emulated test pipeline.

## Core Features

- **`sloptor` replaces `rbxtsc`** — a native TypeScript→Luau compiler and type
  checker in one binary. It builds the game, runs the strict typecheck, and
  drives the Flamework transformer from `rotor.toml`. A fork is required here:
  this repo mounts two `node_modules` trees and needs `rbxts.runtimeRoots`,
  which upstream `v3.0.0-beta.4` does not have.
- **Offline emulated test lane** — `pnpm test` compiles to Luau and runs the
  suite inside `ree`, a headless Roblox engine reimplementation. No Studio
  roundtrip, no uploaded place, no credentials, and coverage maps back to
  TypeScript. Specs with engine parity gaps are listed in `reeParityPaths` and
  route to the Studio lane when targeted.
- **Offline UI rendering** — `pnpm ui:render <story>` rasterises UI stories
  through `roblox-ui-renderer` (`rur`) for layout and geometry checks without
  opening Studio.
- **Interactive setup** — `bash scripts/setup-template.sh` walks through
  project naming, Roblox ids, API keys, badge gists, and CI secrets, then
  installs and builds.

## Toolchain Credits

The compiler, emulator, and jest runner are personal forks of public projects:

| Tool                     | Upstream                                                                                                            | Fork adds                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `sloptor`                | [`howmanyslop/sloptor`](https://github.com/howmanyslop/sloptor)                                                     | `rbxts.runtimeRoots` for multi-tree mounts                |
| `ree`                    | [`Anime-Vanguards/roblox-engine-emulator`](https://github.com/Anime-Vanguards/roblox-engine-emulator)               | Pinned commit with the harness fixes (GPL-2.0-or-later)   |
| `@isentinel/jest-roblox` | [`christopher-buss/jest-roblox-cli`](https://github.com/christopher-buss/jest-roblox-cli) by Christopher Buss (MIT) | The `emulator` backend that runs jest suites inside `ree` |
| `rur`                    | [`Anime-Vanguards/roblox-ui-renderer`](https://github.com/Anime-Vanguards/roblox-ui-renderer)                       | Pinned commit                                             |

Forks are consumed as release binaries and tarballs, never vendored. See
[`docs/agents/setup-guide.md`](docs/agents/setup-guide.md) for install detail.

## Requirements

- [mise](https://mise.jdx.dev) (pins node, pnpm, rojo, gh, jq, and Luau tools)
- pnpm
- Git

## Setup Wizard

Creating a project _from_ this template? Run the interactive wizard instead of
configuring by hand:

```bash
bash scripts/setup-template.sh
```

It walks you through naming the project, your Roblox universe/place ids and
Open Cloud keys, the Bedrock/Asphalt keys, CI badge gists and GitHub secrets,
then runs the toolchain install and `pnpm setup`.

The wizard is for a fresh copy only — it rewrites tracked files in place, so do
not run it inside the template repository itself. For the full manual path,
including the optional Bedrock, UI-render, and Studio lanes, see
[`docs/agents/setup-guide.md`](docs/agents/setup-guide.md).

## Getting Started

```bash
pnpm setup
```

`pnpm setup` initializes submodules, installs with `--frozen-lockfile`, and
builds the source tree. Then develop:

```bash
pnpm dev    # watch source, sourcemap, and rbx-tree server
pnpm serve  # rojo serve for Studio editing
```

## License

MIT © 2026 lisachandra
