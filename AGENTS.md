# Agent Instructions

- Use `./.tmp/` for temp files. No OS temp.
- `pnpm submodules` builds local `@rbxts/flux` and `@isentinel/jest-roblox`
  after fresh checkout.

## References

- Code standards: `docs/agents/coding-standards.md`
- Issue tracker: `docs/agents/issue-tracker.md`
- Release/milestone policy: `docs/agents/release.md`
- Triage labels: `docs/agents/triage-labels.md`
- Domain docs: `CONTEXT.md`, `docs/adr/`, `docs/agents/domain.md`
- Studio/runtime testing: `docs/agents/testing-apis.md`

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
| Test (all)       | `pnpm test:local`        |
| Test (selective) | `pnpm test --testPathPattern <pattern>` |
| Slow tests       | `pnpm test:slow`        |
| Barrels          | `pnpm barrels`          |
| Release preview  | `pnpm release:dry`      |
| Release dispatch | `pnpm release:dispatch` |

## Commit Attribution

AI commits MUST include:

```text
Co-Authored-By: (the agent's name and attribution byline)
```

## Agent Workflow

- Check matching GitHub issue/sub-issue when useful. Mention in plan and
  summary.
- Before changeset: check related changesets. Avoid duplicate.
- One commit may have many changesets when user-facing behaviors differ.
- After work: create/update issues for material follow-up. Do not bury follow-up
  in chat.

## Verification

- `pnpm barrels`, `pnpm lint:fix`, `pnpm typecheck`, `pnpm build`
- Always use the most efficient test option:
  - selective tests: `pnpm test --testPathPattern <pattern>`
  - all tests: `pnpm test:local`
- Never run the full `pnpm test` suite (jest-roblox-cli Studio-backed full runs time out).
- Report exact tests/tools run and blockers.

## Project Conventions

- Server/client bootstrap stays integration boundary unless task changes it.
- System discovery is barrel-based. Run `pnpm barrels` when discovery changes.
- System filenames: noun-verb camelCase.
- `./submodules/flux` backs local `@rbxts/flux`.
- `./submodules/jest-roblox-cli` backs Drillbit/Jest runner plugin.
- Use `./creator-docs` for Roblox API.
