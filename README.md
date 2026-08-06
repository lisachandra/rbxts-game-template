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
`@lisachandra` runtime stack, and a strict build/lint/typecheck/test pipeline.
It mirrors the architecture of `rocket-powered-blox-cars` while keeping the
public surface generic: no game code, assets, or internal references leak
through.

## Features

- roblox-ts + pnpm workspace, with `packages/@internal/shared` and
  `packages/@internal/server` dependency hosts that back the runtime
  `node_modules` include paths
- Matter ECS scaffold: a streamable `Session` component with a replication
  codec (`src/shared/matter/components.ts`) and a server session system
  (`src/server/systems/sessionTracker.ts`)
- Tether messaging example with typed schemas and a client ping loop
  (`src/shared/network/messaging/session.ts`,
  `src/client/ui/hooks/useSessionState.ts`)
- React UI example: an app root with `AppContext`, and a session HUD split
  into render/model/connector files (`src/client/ui/app.tsx`,
  `src/client/ui/hud/session/`), mounted from `src/client/client.client.tsx`
- Server bootstrap (`src/server/server.server.ts`) with player documents
  (`src/server/document.ts`), Centurion command examples
  (`src/server/centurion/commands/example.ts`), and the Matter runtime
- flux input actions (`src/shared/input.ts`) with client input/render system
  initializers
- Generic instance-tree types in `src/types/services` — no game-specific
  assets or services
- jest-roblox tests (`pnpm test`) plus the Studio-local harness
  (`pnpm test:local` with `src/test/spec.server.luau`)
- Bedrock deployment CLI from npm (`@bedrock-rbx/core`) with codegen and
  developer-product placeholders
- `.codex` LSP configuration with oxlint and TypeScript 7 (`packages/tsc7`)
  alongside the project's TypeScript 6
- Local `.agents` and `creator-docs` junctions for agent hooks and Roblox API
  docs

## Requirements

- [mise](https://mise.jdx.dev) (pins node, pnpm, rojo, gh, jq, and Luau tools)
- pnpm
- Git

## Setup Wizard (recommended)

Run the interactive setup wizard instead of configuring by hand:

```bash
bash scripts/setup-template.sh
```

It walks you through naming the project, your Roblox universe/place ids and
Open Cloud keys, the Bedrock/Asphalt keys, CI badge gists and GitHub secrets,
then runs the toolchain install and `pnpm setup`.

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

For Codex agent hooks, junction your global agent config (the repo keeps it
out of git):

```bash
mklink /J .agents C:\Users\PC\.agents   # Windows
ln -s ~/.agents .agents                 # Unix
```

## Repository Structure

```
rbxts-game-template/
├── src/client/         client bootstrap, systems, and React UI
├── src/server/         server bootstrap, systems, commands, player documents
├── src/shared/         input actions, Matter components, tether messages
├── src/test/           jest-roblox setup and the Studio-local spec
├── src/types/          generic instance-tree type declarations
├── packages/           @internal dependency hosts + packages/tsc7 (LSP)
├── assets/             game assets (codegen exports to src/shared/assets)
├── places/             place files
├── scripts/            setup, hoist, and place-build scripts
├── submodules/         flux, jest-roblox-cli, naming-standard (pinned)
├── docs/agents/        maintainer docs (standards, testing, release, bedrock)
├── .codex/             committed LSP/agent tooling config
├── bedrock.config.ts   Bedrock resources, codegen, and product placeholders
└── default.project.json
```

## Commands

| Task                                 | Command           |
| ------------------------------------ | ----------------- |
| Setup (submodules + install + build) | `pnpm setup`      |
| Build                                | `pnpm build`      |
| Lint                                 | `pnpm lint:fix`   |
| Typecheck                            | `pnpm typecheck`  |
| Test                                 | `pnpm test`       |
| Test (Studio CLI)                    | `pnpm test:local` |
| Barrels                              | `pnpm barrels`    |
| Dev (watch)                          | `pnpm dev`        |
| Serve to Studio                      | `pnpm serve`      |

Deployment:

| Task                     | Command                  |
| ------------------------ | ------------------------ |
| Build production place   | `pnpm bedrock:build`     |
| Preview resource changes | `pnpm bedrock:diff`      |
| Provision resources      | `pnpm bedrock:provision` |
| Deploy the place         | `pnpm bedrock:deploy`    |
| Publish products         | `pnpm bedrock:publish`   |

## Testing

`pnpm test` builds a throwaway place and runs jest-roblox specs for client,
shared, and server with coverage:

- Locally it uses the Studio CLI backend.
- In CI it uses the Open Cloud backend and only runs when
  `ROBLOX_OPEN_CLOUD_API_KEY`, `ROBLOX_PLACE_ID`, and `ROBLOX_UNIVERSE_ID`
  are configured (see `.env.example`).

`pnpm test:local` runs the same suites from Studio through
`src/test/spec.server.luau`, which is handy for quick iteration.

## Deployment (Bedrock)

Bedrock manages Roblox resources through Open Cloud. `bedrock.config.ts`
declares the production universe/place, codegen output
(`src/shared/assets`), and developer-product placeholders:

1. Replace the TODO universe/place IDs and product entries in
   `bedrock.config.ts`.
2. Create a private state gist and set its ID in `state.gistId`.
3. Set `BEDROCK_API_KEY` (and `BEDROCK_GITHUB_TOKEN` if needed) in `.env`.
4. Run `pnpm bedrock:diff` before any `pnpm bedrock:deploy`.

Server code is responsible for granting purchases
(`MarketplaceService.ProcessReceipt`); Bedrock only manages product metadata.

## Status Badges

The CI workflow updates the test, coverage, and version badges in a private
gist using `schneegans/dynamic-badges-action`. To enable it:

1. Create a secret gist and set the repository variable `CI_BADGE_GIST_ID`
   to its ID.
2. Create a GitHub personal access token with the `gist` scope and set it as
   the `GIST_SECRET` repository secret.
3. Point the badge links at the top of this file at your gist ID.

## Renaming the Template

1. Rename the repository and update `package.json` (`name`).
2. Update `default.project.json` and `places.start.displayName` in
   `bedrock.config.ts`.
3. Replace the `rbxts-game-template` strings in the UI
   (`src/client/ui/hud/session/sessionHud.render.tsx`) and the example
   commands (`src/server/centurion/commands/example.ts`).
4. Set your creator/user IDs in `src/server/server.server.ts` (`OWNER`),
   `asphalt.toml`, and `.env.example`.
5. Update this README, the badge links above, and `AGENTS.md` to taste.

## Maintainer Documentation

`AGENTS.md` and `docs/agents/` cover coding standards, testing APIs, issue
tracking, release policy, and Bedrock deployment.

## Submodules

- `submodules/flux` — input action system (`@rbxts/flux` via `file:` dependency)
- `submodules/jest-roblox-cli` — jest-roblox runner fork with place hook support
- `submodules/naming-standard` — naming convention reference

## License

MIT © 2026 lisachandra
