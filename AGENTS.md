# Agent Instructions

- Use `./.tmp/` for temp files. No OS temp.
- `pnpm submodules` builds local `@rbxts/flux` and `@isentinel/jest-roblox`
  after fresh checkout.

## Package Manager

Use **pnpm**.

## Setup

```bash
pnpm setup
```

## Commands

| Task             | Command                 |
| ---------------- | ----------------------- |
| Build            | `pnpm build`            |
| Lint             | `pnpm lint:fix`         |
| Typecheck        | `pnpm typecheck`        |
| Test             | `pnpm test`             |
| Slow tests       | `pnpm test:slow`        |
| Barrels          | `pnpm barrels`          |
| Release preview  | `pnpm release:dry`      |
| Release dispatch | `pnpm release:dispatch` |

## Commit Attribution

AI commits MUST include:

```text
Co-Authored-By: (the agent's name and attribution byline)
```

## Verification

- `pnpm barrels`, `pnpm lint:fix`, `pnpm typecheck`, `pnpm build`, `pnpm test`
- Report exact tests/tools run and blockers.

## Project Conventions

- Server/client bootstrap stays an integration boundary unless the task changes it.
- System discovery is barrel-based. Run `pnpm barrels` when discovery changes.
- `./submodules/flux` backs local `@rbxts/flux`.
- `./submodules/jest-roblox-cli` backs the Drillbit/Jest runner plugin.
- Use `./creator-docs` for Roblox API docs when present.
