# Domain Docs

Use repo domain docs before naming product concepts, issues, tests, refactors.

## Read First

- `CONTEXT.md` at repo root.
- Relevant ADRs in `docs/adr/`.
- Relevant legacy Superpowers specs/plans in `docs/superpowers/`.

Missing file? Proceed silently. Do not propose creating upfront. Create/update only when domain terms or architectural decisions get resolved.

## Repo Shape

Single-context repo:

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

Current state may lack `CONTEXT.md` or root `docs/adr/`. That is OK.

## Vocabulary

Use glossary terms from `CONTEXT.md` in issue titles, proposals, hypotheses, tests.

Do not drift to synonyms glossary avoids.

Missing concept means either wrong language or real gap. Reconsider first; note for `/domain-modeling` if gap real.

## ADR Conflicts

If output contradicts ADR, say so explicitly:

> Contradicts ADR-0007 — worth reopening because ...
