# Issue Tracker

GitHub Issues are source of truth for PRDs, roadmap slices, AFK handoff. Use `gh` CLI.

## Workflow

1. Grill/shape idea in chat (`/wayfinder` OR `/grill-with-docs`).
2. Convert to a spec with `/to-spec` when all decisions are settled.
3. Break the spec into tracer-bullet slices with `/to-tickets`.
4. Publish narrow implementation slices as issues.
5. Apply labels from `docs/agents/triage-labels.md` and the metadata contract below.
6. Add `ready-for-agent` only after the issue passes the readiness review.
7. Sandcastle picks up `ready-for-agent` issue in isolated branch/worktree.
8. Human reviews/validates before merge.

## Issue Metadata Contract

Read this section before creating or editing a GitHub issue. Issue titles use the
same conventional prefix vocabulary as commits, while remaining specific to the
work:

- `feat(scope): ...` — new player or system behavior
- `fix(scope): ...` — correction of broken behavior
- `refactor(scope): ...` — structural change without behavior change
- `test(scope): ...` — test-only work
- `chore(scope): ...` — tooling or maintenance
- `docs(scope): ...` — documentation

Use lowercase scopes where practical. Do not use a vague title such as
`improve matchmaking`; name the concrete outcome instead.

Every issue must have the correct:

- milestone, matching its parent map or roadmap pass;
- parent/sub-issue relationship, when it belongs to a map;
- native `blocked-by` relationships for prerequisites;
- lifecycle and domain labels;
- `ready-for-agent` label only after implementation readiness review.

Relationship direction is explicit: if issue A cannot start until issue B is
resolved, A is **blocked by** B.

```bash
gh issue edit A --parent MAP
gh issue edit A --add-blocked-by B
```
