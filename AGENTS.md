# Agent Instructions

- Use `./.tmp/` for temp files. No OS temp.
- `pnpm submodules` builds local `@rbxts/flux` after fresh checkout.
- Toolchain binaries (`sloptor`, `ree`, `rur`, `rojo`, `lune`) come from `mise`. Run
  `mise install` once before `pnpm setup`.

## References

- Setup guide: `docs/agents/setup-guide.md` (fresh copy → build, test lane, UI render)
- Code standards: `docs/agents/coding-standards.md`
- Issue tracker: `docs/agents/issue-tracker.md`
- Release/milestone policy: `docs/agents/release.md`
- Triage labels: `docs/agents/triage-labels.md`
- Domain docs: `CONTEXT.md`, `docs/adr/`, `docs/agents/domain.md`
- Studio/runtime testing: `docs/agents/testing-apis.md`
- Emulator parity ledger: `docs/agents/offline-runtime-spike.md`

## Package Manager

Use **pnpm**.

## Setup

```bash
mise install
pnpm setup
```

## Commands

| Task                 | Command                                   |
| -------------------- | ----------------------------------------- |
| Build                | `pnpm build`                              |
| Lint                 | `pnpm lint:fix`                           |
| Typecheck            | `pnpm typecheck`                          |
| Test (all, emulated) | `pnpm test`                               |
| Test (selective)     | `pnpm test --testPathPattern "<pattern>"` |
| Refresh place cache  | `pnpm test -- --refresh-places`           |
| Barrels              | `pnpm barrels`                            |
| Release preview      | `pnpm release:dry`                        |
| Release dispatch     | `pnpm release:dispatch`                   |

> Target spec with `pnpm test --testPathPattern "<pattern>"`. Ree parity failure? Add the spec
> path to `reeParityPaths` in `jest.config.ts` so it routes to the Studio backend.

## Commit Attribution

AI commits MUST include:

```text
Co-Authored-By: (the agent's name and attribution byline)
```

## Agent Workflow

- Check matching GitHub issue/sub-issue when useful. Mention in plan and
  summary.
- After work: fix when you can or create/update issues for material follow-up. Do not bury
  follow-up in chat. Make sure it adheres to the issue tracker doc.

## Verification

- `pnpm barrels`, `pnpm typecheck`, `pnpm lint:fix`, `pnpm build`, `pnpm test`.
- `pnpm test` runs the emulator lane (fast, offline, all specs). Specs in `reeParityPaths`
  auto-route to Studio when targeted.
- Report exact tests/tools run and blockers.

## Project Conventions

- Server/client bootstrap stays integration boundary unless task changes it.
- System discovery is barrel-based. Run `pnpm barrels` when discovery changes.
- System filenames: noun-verb camelCase.
- `./submodules/flux` backs local `@rbxts/flux`.
- `rotor.toml` is load-bearing for the compiler: without it `sloptor` runs no transformer
  plugins and still exits 0.
- Use `./creator-docs` for Roblox API.
