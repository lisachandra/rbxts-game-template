# Coding Standards

## Public API Docs

Use TSDoc for public properties, functions, classes, modules.

- Document observable contract, not internals.
- Add examples for non-obvious APIs.
- Use tags when useful: `@param`, `@returns`, `@example`, `@remarks`, `@throws`, `@template`.

## Function Parameters

Optional params are bug magnets. Scrutinize. Prefer correctness over backwards compatibility.

## Static Roblox Service Trees

`src/types/services/*.d.ts` is source of truth for static Roblox service trees.

- Do not create folders/instances already declared there and provided by place/source/global assets.
- Do not use `FindFirstChild`, `WaitForChild`, string indexing, optional chaining, nil-tolerant lookup for declared service-tree children.
- Use typed direct access: `SoundService.Sounds.Vehicle.EngineLoop`.
- Truly optional/dynamic child: model in type declarations or one narrow boundary helper. Do not weaken all call sites.
- Tests use same typed service tree as runtime. For isolated assets, make local fake instances and pass through explicit dependency/test fixture. Do not mutate/recreate typed global service folders.

Typed declarations catch asset-contract drift at compile time. `FindFirstChild` and recreated folders hide drift, turn type errors into runtime nil checks.

```ts
// GOOD: typed asset contract
const engineLoop = SoundService.Sounds.Vehicle.EngineLoop;

// GOOD: local test fixture through seam
const sounds = createTestVehicleSounds();
stepVehicleAudioForTest({ sounds, ... });

// BAD: bypasses typed service tree
const vehicleFolder = SoundService.Sounds.FindFirstChild<Folder>("Vehicle");
const engineLoop = vehicleFolder?.FindFirstChild<Sound>("EngineLoop");

// BAD: recreates declared global folder in test
const sounds = new Instance("Folder");
sounds.Name = "Sounds";
sounds.Parent = SoundService;
```

## Constants

Grouped constants MUST use `@lisachandra/constant` `new Constant()`.

No plain object literals, top-level numeric/string exports, or other grouped constant patterns.

```ts
import { Constant } from "@lisachandra/constant";

const c = new Constant().add("INPUT_TICK_RATE", 120).add("DEBUG_LOG_INTERVAL", 0.5).build();
```

## Entity ID Spaces

For ECS (@rbxts/matter) Two ID spaces exist. Never mix without explicit mapping.

- `world.query` gives either client entity id or server entity id based on the current running context.
- `findServerEntityIdFromMap()` / `findClientEntityIdFromMap()` bridge ID spaces.
- Trace ID from origin to use. Never assume Matter ID equals server ID.

## Testing

Tests verify behavior through public interfaces, not implementation details. Refactors should not break tests unless behavior changed.

Good tests:

```typescript
// GOOD: observable behavior through public interface
test("createUser makes user retrievable", async () => {
	const user = await createUser({ name: "Alice" });
	const retrieved = await getUser(user.id);
	expect(retrieved.name).toBe("Alice");
});
```

- Test caller/user behavior.
- Use public API only.
- Survive internal refactors.
- Prefer one logical assertion per test.

Bad tests:

```typescript
// BAD: mocks internal collaborator, tests HOW not WHAT
test("checkout calls paymentService.process", async () => {
	const mockPayment = jest.mock(paymentService);
	await checkout(cart, payment);
	expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});

// BAD: bypasses interface to verify via database
test("createUser saves to database", async () => {
	await createUser({ name: "Alice" });
	const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
	expect(row).toBeDefined();
});
```

Red flags:

- Mocking internal collaborators.
- Testing private methods.
- Asserting internal call counts/order.
- Refactor breaks test with no behavior change.
- Test name says HOW, not WHAT.
- Verifying through external means instead of interface.
- Creating/stubbing global Roblox service-tree folders declared in `src/types/services`.

## Mocking

Mock system boundaries only:

- External APIs.
- Time/randomness.
- File system or databases when real instance impractical.

Never mock own classes/modules or internal collaborators. If hard to test, redesign interface.

Prefer SDK-style boundary interfaces over generic fetchers. Each function independently mockable, one return shape, no conditional test setup.

## TDD Vertical Slices

Do not write all tests first, then all implementation. That tests imagined behavior.

Use one test, one implementation, repeat.

```text
RED-GREEN: test1 then implementation1
RED-GREEN: test2 then implementation2
RED-GREEN: test3 then implementation3
```

Each test responds to prior learning. Never refactor while RED; get GREEN first.

## Interface Design

Prefer deep modules: small interface, deep implementation. Few methods, simple params, hidden complexity.

Avoid shallow modules: large interface, many pass-through methods, thin implementation.

Ask:

- Can method count shrink?
- Can params simplify?
- Can more complexity hide inside?

Testability rules:

1. Accept dependencies; do not create them internally.
2. Return results; avoid side effects when possible.
3. Keep surface small; fewer methods and params mean simpler tests.

## Error Handling

Fail fast, fail loud. Prefer assertions over silent failure.

- Silent failures hide bugs.
- Assertions surface problems immediately.
- Better to crash in development than fail silently in production.

### Assertions vs Guard Clauses

Prefer assertions over guard clauses. Guard clauses that silently return hide bugs.

```ts
// BAD: guard clause hides the bug
function damagePlayer(world: World, entity: Entity, amount: number): void {
	const health = world.get(entity, HealthComponent);
	if (!health) {
		// Silent failure - why is health missing?
		return;
	}

	world.set(entity, HealthComponent, health - amount);
}

// GOOD: assertion surfaces the bug
function damagePlayer(world: World, entity: Entity, amount: number): void {
	const health = world.get(entity, HealthComponent);
	assert(health, "Cannot damage entity without HealthComponent");
	world.set(entity, HealthComponent, health - amount);
}
```

Use guard clauses only when:

- The undefined/null case is legitimately expected (optional data).
- You have explicit handling logic for that case.
- The caller expects and handles the fallback value.

If you cannot explain why the value might be undefined, use an assertion.

### Assertions vs Errors

Choose by failure category.

`assert()` for programmer errors — conditions that should never happen if code is correct:

- Missing expected component on entity.
- Invalid internal state transitions.
- Design contract violations.

Assertions also document intent:

```ts
const health = entity.get(HealthComponent);
assert(health !== undefined, "Entity missing required HealthComponent");
// Entities ALWAYS have health at this point
```

`throw new Error()` for runtime failures — external/unpredictable failures (import from `@rbxts/luau-polyfill`):

- Asset loading failures.
- Network request failures.
- External data corruption.
- Player-provided data validation.

```ts
import { Error } from "@rbxts/luau-polyfill";

if (!assetExists(assetId)) {
	throw new Error(`Required asset not found: ${assetId}`);
}
```

### Type Guards vs Data Validation

Flamework type guards validate types, not data integrity.

```ts
// Type guard guarantees petName is string.
// Exploiters can still send malformed UTF-8, NaN, or oversized strings.
events.connect((player, petName) => {
	// Flamework handled: petName is string
	// Still need to validate data:
	if (!utf8.len(petName)) {
		throw new Error("Invalid UTF-8 string"); // Prevents DataStore exploit
	}
});
```

Type safety ≠ data safety. Type guards catch `string` vs `number`, not malformed UTF-8, NaN, or size limits that break DataStores.

### Defense-in-Depth

Validate at every layer data passes through. Make bugs structurally impossible.

| Layer       | Purpose                               | Example                       |
| ----------- | ------------------------------------- | ----------------------------- |
| Entry       | Reject invalid input at API boundary  | UTF-8 validation, size limits |
| Business    | Ensure data makes sense for operation | Ownership checks, existence   |
| Environment | Prevent dangerous context operations  | No client DataStore writes    |
| Debug       | Capture context for forensics         | Stack traces, data logging    |

Single validation: "we fixed the bug." Multiple layers: "we made the bug impossible."

### Result Pattern

For operations that can legitimately fail:

```ts
type Result<T, E = string> = { error: E; success: false } | { success: true; value: T };
```
