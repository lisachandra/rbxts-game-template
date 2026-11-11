#!/bin/sh

set -e

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <rojo-project> <place-output> [--do-not-rebuild] [--assets-place-id <id>] [--assets-output <path>]" >&2
  exit 1
fi

ROJO_PROJECT=$1
PLACE_OUTPUT=$2
shift 2

ASSETS_OUTPUT=build/global-assets.rbxm
ASSETS_PLACE_ID=""
DO_NOT_REBUILD=false
REFRESH_PLACES=false

# A generated places manifest is optional. Templates start without one, in
# which case the global-asset steps are skipped rather than failing the build.
PLACES_MANIFEST=src/shared/assets/generated/places.json
if [ -f "$PLACES_MANIFEST" ]; then
  ASSETS_PLACE_ID=$(jq -r '.dev.main // empty' "$PLACES_MANIFEST")
fi

if [ -n "$ROBLOX_GLOBAL_ASSETS_PLACE_ID" ]; then
  ASSETS_PLACE_ID=$ROBLOX_GLOBAL_ASSETS_PLACE_ID
fi

while [ "$#" -gt 0 ]; do
  case "$1" in
    --do-not-rebuild)
      DO_NOT_REBUILD=true
      shift
      ;;
    --refresh-places)
      REFRESH_PLACES=true
      shift
      ;;
    --assets-place-id)
      if [ -z "$2" ]; then
        echo "Missing value for --assets-place-id" >&2
        exit 1
      fi
      ASSETS_PLACE_ID=$2
      shift 2
      ;;
    --assets-output)
      if [ -z "$2" ]; then
        echo "Missing value for --assets-output" >&2
        exit 1
      fi
      ASSETS_OUTPUT=$2
      shift 2
      ;;
    *)
      echo "Unknown setup-place.sh option: $1" >&2
      exit 1
      ;;
  esac
done

mkdir -p "$(dirname "$PLACE_OUTPUT")"

if [ "$DO_NOT_REBUILD" = false ]; then
  rojo build "$ROJO_PROJECT" --output "$PLACE_OUTPUT"
fi

if [ -z "$ASSETS_PLACE_ID" ] || [ ! -f "assets/tester-manifest.json" ]; then
  echo "setup-place.sh: no global-assets place configured; skipping asset injection."
  exit 0
fi

mkdir -p "$(dirname "$ASSETS_OUTPUT")"

# useCache=true keeps the `places/*.rbxl` LFS snapshot as the cache; --refresh-places forces a
# re-download whose snapshot lands in the tree to review and commit.
USE_CACHE=true
if [ "$REFRESH_PLACES" = true ]; then
  USE_CACHE=false
fi

lune run scripts/luau/fetchGlobalAssets.luau "$ASSETS_PLACE_ID" "$ASSETS_OUTPUT" "places/$ASSETS_PLACE_ID.rbxl" "assets/tester-manifest.json" "$USE_CACHE"
lune run scripts/luau/addGlobalAssetsToPlace.luau "$ASSETS_OUTPUT" "$PLACE_OUTPUT"
lune run scripts/luau/verifyTesterContentManifest.luau "$PLACE_OUTPUT" "assets/tester-manifest.json"
