# Bedrock Deployment

Bedrock manages Roblox resources through Open Cloud.
Published GitHub releases trigger production deploy.

## Rules

- Use Open Cloud. Never use `ROBLOSECURITY`.
- Pin Bedrock by submodule commit.
- Build Bedrock in its own workspace during `pnpm submodules`.
- Keep only `mise run bedrock` public. Keep install/build steps in submodule setup.
- Build deterministic `.rbxl` before deploy.
- Run `diff` before changing Roblox.
- Deploy only playable, reviewable, rollback-worthy releases.
- Keep credentials in local `.env` or GitHub secrets. Never commit credentials.
- Keep one Bedrock state Gist per environment.
- Bedrock manages product metadata. Server code grants purchases.

## Local setup

Create private GitHub Gist. Create GitHub token with `gist` scope.

Set local `.env`:

```sh
BEDROCK_API_KEY="..."
BEDROCK_GITHUB_TOKEN="..."
BEDROCK_ENVIRONMENT="production"
ROBLOX_GLOBAL_ASSETS_PLACE_ID="..."
```

Set production universe ID, place ID, and state Gist ID in `bedrock.config.ts`.
Never commit API keys or tokens.

Build submodules:

```sh
pnpm submodules
pnpm install --frozen-lockfile
```

Build production place:

```sh
ROBLOX_GLOBAL_ASSETS_PLACE_ID=... pnpm build:place:production
```

Inspect changes:

```sh
pnpm exec bedrock -- diff --env production
```

Deploy after diff review:

```sh
pnpm exec bedrock -- deploy --env production
```

`build:place:production` does four things:

1. Builds Rojo place.
2. Fetches global-assets place.
3. Injects global assets.
4. Writes `build/production.rbxl`.

Production artifact stays separate from Jest `test.rbxl`.

## Developer products

Declare products in environment overlay in `bedrock.config.ts`:

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

Bedrock manages Open Cloud product metadata. Bedrock does not grant purchases.
Server code handles `MarketplaceService.ProcessReceipt`.

Keep product IDs available to server code. Make receipt granting idempotent.

## GitHub Actions

`Deploy Roblox` runs on `release.published` or manual dispatch.

Workflow:

1. Checkout exact release tag.
2. Initialize submodules.
3. Run setup; setup builds Bedrock CLI.
4. Build production `.rbxl`.
5. Run Bedrock `diff`.
6. Run Bedrock `deploy`.

Mise exposes only `bedrock` task.

Create protected GitHub environment named `production`.

Set environment secrets:

- `ROBLOX_OPEN_CLOUD_API_KEY`: production Open Cloud key.
- `BEDROCK_GITHUB_TOKEN`: GitHub token with `gist` scope.
- `ROBLOX_GLOBAL_ASSETS_PLACE_ID`: global-assets source place ID.
- `SSH_PRIVATE_KEY`: only when private checkout needs it.

Bedrock universe ID, place ID, and state Gist ID live in `bedrock.config.ts`.
CI needs no separate Bedrock state-Gist variable.

CI badge Gist ID lives in GitHub Actions variable:

```text
CI_BADGE_GIST_ID
```

Badge token remains GitHub Actions secret:

```text
GIST_SECRET
```

## Release policy

Read `docs/agents/release.md`.

Preview release:

```sh
pnpm release:dry
```

Dispatch release only for playable, reviewable, rollback-worthy milestone.
Deploy workflow does not create release. Published release starts deploy.
