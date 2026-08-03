# Bedrock Deployment

Bedrock manages Roblox resources through Open Cloud
(`@bedrock-rbx/core` from npm). It builds the place, provisions
universes/places, manages developer products, and deploys from a
deterministic `.rbxl`.

## Rules

- Use Open Cloud. Never use `ROBLOSECURITY`.
- Keep Bedrock as an npm dependency; do not pin it by submodule.
- Build a deterministic `.rbxl` before deploy (`.bedrock/build.ts` runs
  `scripts/bash/setup-place.sh`).
- Run `diff` before changing Roblox.
- Deploy only playable, reviewable, rollback-worthy releases.
- Keep credentials in local `.env` or GitHub secrets. Never commit
  credentials.
- Keep one Bedrock state gist per environment.
- Bedrock manages product metadata. Server code grants purchases.

## Configuration

`bedrock.config.ts` declares:

- `environments.production` — universe/place IDs and developer-product
  placeholders
- `places.start` — place display name and output file
  (`build/production.rbxl`)
- `codegen` — enabled, writes type declarations to `src/shared/assets`
- `state` — gist-backed state; set `gistId` per environment

Replace the TODOs (universe ID, place ID, products, state gist) with your own
values before deploying.

## Local setup

Create a private GitHub gist for Bedrock state. Create a GitHub token with
the `gist` scope.

Set local `.env`:

```sh
BEDROCK_API_KEY="..."
BEDROCK_GITHUB_TOKEN="..."
```

Build the place:

```sh
pnpm bedrock:build
```

Inspect changes:

```sh
pnpm bedrock:diff
```

Deploy after diff review:

```sh
pnpm bedrock:deploy
```

`bedrock:build` runs Rojo build and writes `build/production.rbxl` via
`.bedrock/build.ts`.

## Developer products

Declare products in the environment overlay in `bedrock.config.ts`:

```ts
products: {
	starterPack: {
		name: "Starter Pack",
		description: "A starter bundle.",
		price: 99,
		storePageEnabled: true,
	},
},
```

Bedrock manages Open Cloud product metadata. Bedrock does not grant
purchases; server code handles `MarketplaceService.ProcessReceipt` and keeps
receipt granting idempotent.

## GitHub Actions

The badge job in `ci.yaml` updates test, coverage, and version badges in the
CI badge gist:

- Repository variable: `CI_BADGE_GIST_ID`
- Repository secret: `GIST_SECRET` (GitHub token with `gist` scope)

Set environment secrets for the test job: `ROBLOX_OPEN_CLOUD_API_KEY`,
`ROBLOX_PLACE_ID`, and `ROBLOX_UNIVERSE_ID`.

## Release policy

Read `docs/agents/release.md`.

Preview release:

```sh
pnpm release:dry
```

Dispatch release only for playable, reviewable, rollback-worthy milestones.
