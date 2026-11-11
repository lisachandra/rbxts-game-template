# Agent Testing APIs

Use when change touches gameplay, ECS, UI, networking, authority, replication, developer tooling. Run repo checks first, then Studio/runtime proof when needed.

## Source Of Truth

- Local Roblox docs: `./creator-docs`.
- Studio test sessions: `creator-docs/content/en-us/reference/engine/classes/StudioTestService.yaml`.
- Player-like input: `creator-docs/content/en-us/reference/engine/classes/VirtualInput.yaml`.
- Device simulation: `creator-docs/content/en-us/reference/engine/classes/StudioDeviceSimulatorService.yaml`.
- Assistant workflows: `creator-docs/skills/`.

## Pick Tool

| Need                               | Prefer                                                           |
| ---------------------------------- | ---------------------------------------------------------------- |
| Start/stop playtest                | Assistant/Studio automation or manual                            |
| Runtime logs                       | Studio Output, Developer Console, saved logs, Assistant          |
| Player view                        | Screenshot, Assistant screenshot, Studio capture                 |
| Click/type/move/scroll/game input  | `VirtualInput` plugin/test harness or Assistant input            |
| Exercise scenario                  | Assistant playtest agent                                         |
| Solo scripted Play/Run             | `StudioTestService:ExecutePlayModeAsync` / `ExecuteRunModeAsync` |
| Multi-client replication/authority | `StudioTestService:ExecuteMultiplayerTestAsync`                  |
| Add clients                        | `StudioTestService:AddPlayers`                                   |
| Disconnect client                  | `StudioTestService:CanLeaveTest` and `LeaveTest`                 |
| End scripted test                  | `StudioTestService:EndTest`                                      |
| Responsive UI/platform layout      | `StudioDeviceSimulatorService` plus screenshots/human review     |
| Rendering/memory/geometry/leaks    | Assistant Scene Analysis or `SceneAnalysisService`               |
| Exact API context                  | Assistant Docs Search or `./creator-docs`                        |

## Offline Lanes (`pnpm test`, `pnpm ui:render`)

`pnpm test` runs compiled specs inside `ree` (roblox-engine-emulator) by default — offline, no
Studio roundtrip, with Istanbul coverage mapped back to TypeScript by `@isentinel/jest-roblox`.
The full run includes specs listed in `slowTestPaths`.

Specs with engine parity gaps (`reeParityPaths` in `jest.config.ts`) auto-route to the Studio
runner when targeted with `pnpm test --testPathPattern "<pattern>"`. The parity ledger is
`docs/agents/offline-runtime-spike.md`.

`pnpm ui:render <name>` rasterises a UI story through `roblox-ui-renderer` (`rur`). Register
stories in `scripts/emulator/ui-renders.json`; run `pnpm build` and `pnpm ui:templates` first.
Output lands in `build/ui-renders/<name>/`. Trust `rur` for layout and geometry parity; verify
final polish, input, and effects in Studio.

## Studio Unreachable From `run_in_roblox`

The Studio lane can fail with:

```
[ERROR run_in_roblox] receiving on a closed channel
thread '<unnamed>' panicked at 'called `Result::unwrap()` on an `Err` value: Timeout reached while waiting for Roblox Studio to come online', src/main.rs:75:9
```

On Windows this is usually the NAT driver holding a stale socket. Run `net stop winnat` then
`net start winnat` in PowerShell, reopen Studio, and retry. A resumed run re-executes
`setupCommands`.

## Workflow Patterns

- Cross-device multiplayer: device profiles plus multiplayer test plus screenshots.
- Join/leave stress: stagger `AddPlayers`, use `LeaveTest`, verify cleanup/ownership/reconnection/replication.
- Orientation regression: test `Portrait`, `LandscapeLeft`, `LandscapeRight`.
- UI automation: virtual input, then screenshot/console verification.
- Scene performance: camera sweeps, frustum audits, geometry hotspots, Luau heap, leaked instances.

## StudioTestService Notes

- `ExecuteMultiplayerTestAsync` is plugin-only. Max 8 simulated clients.
- `ExecutePlayModeAsync`, `ExecuteRunModeAsync`, `ExecuteMultiplayerTestAsync` yield until test ends.
- Pass small serializable `args`; read with `GetTestArgs`.
- Call `EndTest` from server DataModel; return `"pass"` or failure reason.
- Call `CanLeaveTest` before `LeaveTest` from client DataModel.
- Do not rely on `GetTestArgs` from client LocalScripts; docs say it may fail there.

## Virtual Input Notes

- Use for real input stack behavior: buttons, text fields, menus, movement keys, camera controls, pointer gestures.
- Use `SendTextInput` for focused text fields.
- Use `SendMouseButton`, `SendMousePosition`, `SendPointerAction` for UI/viewport.
- Avoid CoreGui targets; methods throw against Roblox system UI.
- Prefer screenshot/log verification after interaction.

## Device Simulator Notes

- Use when UI, camera framing, touch/mouse affordance, safe layout, aspect ratio matter.
- Test at least desktop viewport and phone viewport for UI changes.
- `SetDeviceAsync`, `SetOrientationAsync`, `SetResolutionAsync`, `SetPixelDensityAsync`, `SetScalingModeAsync` only from Edit mode or Play Client.
- Stop simulation or restore defaults when persistent Studio session may be reused.

## Scene Analysis Notes

- Use Assistant Scene Analysis when runtime/edit-time scene cost matters.
- Ask for camera sweeps, frustum audits, geometry hotspots, memory owners, script heap, animation/audio memory, leaked unparented instances.
- Treat findings as diagnostic evidence. Convert broad optimization into follow-up work.

## Agent Verification Pattern

1. Run repo checks first: `pnpm build` then `pnpm test` (targeted during implementation with `--testPathPattern "<pattern>"`, full on review) — the offline emulator lane — plus `pnpm lint` when useful. Specs with engine parity gaps (`reeParityPaths` in `jest.config.ts`) auto-route to the Studio runner when targeted.
2. If Studio available, ask human/Assistant for runtime evidence automated Jest cannot cover.
3. UI: device simulation plus virtual input plus screenshots.
4. Networking/authority: multi-client `StudioTestService`; include join/leave when relevant.
5. Gameplay: Assistant playtest agent or human exploratory pass, then deterministic logs/screenshots/scripted assertions for critical paths.
6. Report what ran, what observed, and Studio API limits/blockers.

## Debug Surfaces

- Plasma: live tuning or inspector when runtime state would be guessed.
- Matter: ECS world/entity/component/system/authority inspection.
- Centurion: repeatable scenario setup, match state forcing, telemetry toggles, debug spawning, admin test hooks.

## References

- `./creator-docs/content/en-us/studio/testing-modes.md`
- `./creator-docs/content/en-us/reference/engine/classes/StudioTestService.yaml`
- `./creator-docs/content/en-us/reference/engine/classes/VirtualInput.yaml`
- `./creator-docs/content/en-us/reference/engine/classes/StudioDeviceSimulatorService.yaml`
- `./creator-docs/skills/device-simulator/SKILL.md`
- `./creator-docs/skills/scene-analysis/`
- `./creator-docs/skills/docs-search/`
- https://devforum.roblox.com/t/new-studio-testing-apis-and-assistant-improvements/4657854
