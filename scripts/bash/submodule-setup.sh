git submodule update --init --recursive

cd submodules/flux && \
pnpm -C . install && \
pnpm run --filter "@rbxts/flux" build && \
mv packages/core/out packages/core/dist

cd "$OLDPWD"
cd submodules/jest-roblox-cli && \
pnpm -C . install && \
pnpm -C . build
