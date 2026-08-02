<div align="center">
  <h1>rbxts-game-template</h1>

  <p>
    <strong>A general-purpose Roblox game template built with roblox-ts.</strong>
  </p>
</div>

A general-purpose Roblox game template built with roblox-ts, pnpm, the
`@lisachandra` runtime stack, and a strict build/lint/typecheck/test pipeline.

## Features

- roblox-ts + pnpm workspace
- `packages/@internal/shared` and `packages/@internal/server` dependency hosts
  that back the roblox-ts runtime includes
- Matter ECS scaffold: a streamable component with a replication codec
  (`src/shared/matter/components.ts`), a player-lifecycle system
  (`src/server/systems/playerLifecycle.ts`), and a client camera system
- Tether messaging example with typed schemas
  (`src/shared/network/messaging.ts`) backed by the public
  `lisachandra/tether` fork
- React UI example (`src/client/ui/components/templateHud.tsx`) with a render
  spec, mounted from the `client.client.tsx` bootstrap
- Server bootstrap (`server.server.ts`) with player documents
  (`src/server/document.ts`), Centurion command examples
  (`src/server/centurion/commands/example.ts`), and the Matter runtime
- Generic instance-tree types (`src/types/services`)
- jest-roblox test setup (`pnpm test`) plus the Studio-local harness
  (`pnpm test:local` with `src/test/spec.server.luau`)
- Bedrock deployment CLI from npm (`@bedrock-rbx/core`) with codegen and
  developer-product placeholders
- `.codex` LSP configuration with oxlint and TypeScript 7 (`packages/tsc7`)
  alongside the project's TypeScript 6
- Local `.agents` junction (hooks/rules/settings) and `creator-docs` junction
  for Roblox API docs

## Getting Started

Requirements: [mise](https://mise.jdx.dev) (pinned tools), pnpm, and Git.

```bash
pnpm setup
```

Then serve the template:

```bash
pnpm dev
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

## Submodules

- `submodules/flux` — input action system (`@rbxts/flux` via `file:` dependency)
- `submodules/jest-roblox-cli` — jest-roblox runner fork with place hook support
- `submodules/naming-standard` — naming convention reference

## License

MIT © 2026 lisachandra
