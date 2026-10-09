# Deepening

How to deepen a cluster of shallow modules safely, given its dependencies. Assumes the vocabulary in [SKILL.md](SKILL.md): **module**, **interface**, **seam**, **adapter**.

## Dependency categories

When assessing a candidate for deepening, classify its dependencies to understand what varies across its seam. The testing examples below apply when maintaining existing tests or adding checks under [Testing and verification](../tdd/TESTING-POLICY.md).

### 1. In-process

Pure computation, in-memory state, no I/O. Merge the modules when that improves depth and locality. Their behavior is observable through the new interface directly; no adapter is needed.

### 2. Local-substitutable

Dependencies that have local test stand-ins (PGLite for Postgres, in-memory filesystem). When tests are needed, prefer an existing stand-in. The seam is internal; no port at the module's external interface is needed for it.

### 3. Remote but owned (Ports & Adapters)

For your own services across a network boundary, inspect how production callers use the existing client. Add an interface or pass in a transport only when supported business behavior requires it, such as choosing between transports. Tests can replace dependencies through an interface the application already needs.

Keep the business logic together. When the application needs interchangeable transports, explain which callers select them and keep test replacements in test code.

### 4. True external (Mock)

For third-party services such as Stripe or Twilio, use the client or interface required by production callers. The fact that a service is external does not by itself justify an extra interface. Tests may use an existing replacement point; otherwise use an available integration check or report the verification limit.

## Seam discipline

- Choose dependency boundaries for actual production callers and supported business behavior, following [Testing and verification](../tdd/TESTING-POLICY.md).
- Keep internal details out of the public interface. Verification code belongs in tests and uses the same business interfaces as production callers.

## Testing strategy: replace, don't layer

- Preserve valid checks; replace old tests only when equivalent behavior is covered at the deepened interface or the behavior is obsolete.
- When new tests are needed, place them at the deepened module's interface. The **interface is the test surface**.
- Tests assert on observable outcomes through the interface, not internal state.
- Tests should survive internal refactors, since they describe behaviour, not implementation. If a test has to change when the implementation changes, it's testing past the interface.
