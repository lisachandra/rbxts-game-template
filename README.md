# rbxts-game-template

A general-purpose Roblox game template built with roblox-ts, pnpm, Matter ECS
examples, and a strict build/lint/typecheck/test pipeline.

## Features

- roblox-ts + pnpm workspace
- `packages/@internal/shared` and `packages/@internal/server` dependency hosts
  that back the roblox-ts runtime includes
- Matter ECS scaffold (`src/server`, `src/shared/matter`) with a minimal
  player-lifecycle example
- Minimal client bootstrap (`src/client`) and generic instance-tree types
  (`src/types/services`)
- jest-roblox test setup (`pnpm test`)
- Bedrock deployment CLI from npm (`@bedrock-rbx/core`)
- `.codex` LSP configuration with oxlint and TypeScript 7 (`packages/tsc7`)
  alongside the project's TypeScript 6
- Local `.agents` junction (hooks/rules/settings) and `creator-docs` junction
  for Roblox API docs

## Getting Started

Requirements: [mise](https://mise.jdx.dev) (pinned tools), pnpm, and Git.

```bash
pnpm setup
```

Then serve the template in Roblox Studio:

```bash
pnpm dev:rbx-tree
pnpm dev:source
```

## Commands

| Task                                 | Command          |
| ------------------------------------ | ---------------- |
| Setup (submodules + install + build) | `pnpm setup`     |
| Build                                | `pnpm build`     |
| Lint                                 | `pnpm lint:fix`  |
| Typecheck                            | `pnpm typecheck` |
| Test                                 | `pnpm test`      |
| Barrels                              | `pnpm barrels`   |

## Submodules

- `submodules/flux` — input action system (`@rbxts/flux` via `file:` dependency)
- `submodules/jest-roblox-cli` — jest-roblox runner fork with place hook support
- `submodules/naming-standard` — naming convention reference

## License

MIT © 2026 lisachandra
