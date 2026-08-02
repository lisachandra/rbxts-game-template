# Release And Milestone Policy

Release info live here, not `AGENTS.md`: policy detail, rare workflow, human decision surface.

## Commands

| Need               | Command                       |
| ------------------ | ----------------------------- |
| Preview release    | `pnpm release:dry`            |
| Dispatch auto bump | `pnpm release:dispatch`       |
| Dispatch patch     | `pnpm release:dispatch:patch` |
| Dispatch minor     | `pnpm release:dispatch:minor` |
| Dispatch major     | `pnpm release:dispatch:major` |

## Release Rules

- Commit-driven releases use `commit-and-tag-version` and `.versionrc`.
- Changelog path: `.github/CHANGELOG.md`.
- Use Conventional Commits.
- Preview first: `pnpm release:dry`.
- Dispatch only for explicit milestone request.
- No release for routine progress, docs-only changes, formatting, partial experiments.
- Override bump only when asked.
- Dispatch needs authenticated `gh`: `gh workflow run release.yaml`.
- No `gh` auth: run Release workflow manually in GitHub Actions.

## Milestone Rules

- Stay on `0.x.x` during prototyping.
- Tag only playable, reviewable, rollback-worthy, tester-facing milestones.
- Treat roadmap passes in `docs/superpowers/specs/2026-05-06-rocket-league-design.md` as buckets, not release boundaries.

## Agent Behavior

- Do not cut release unless user explicitly asks.
- If task finishes milestone-worthy work, suggest release preview only.
- Include release commands in final only when relevant.
