git submodule update --init --recursive

cd submodules/flux && \
pnpm -C . install && \
pnpm run --filter "@rbxts/flux" build && \
mv packages/core/out packages/core/dist

cd "$OLDPWD"

# `@isentinel/jest-roblox` is consumed as a released tarball (see the
# `devDependencies` entry), so the `jest-roblox-cli` submodule has nothing left
# to provide. Building it required Node >= 25 for tsdown's `exe` option and
# failed CI's `pnpm setup` on Node 24 with "does not support `exe` option".
# The submodule stays checked out for reference; it is not built.
