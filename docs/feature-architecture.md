# Feature Architecture

This codebase follows a feature-slice architecture designed for TanStack Start's
execution model (isomorphic by default, explicit server boundaries).

Use the simplest shape that fits the feature:
- Small features: `contract + server + rpc + client`.
- Complex features: split into `repository + use-cases + composition`.

## Layers

1. `*.contract.ts`
- Shared schemas, DTOs and query keys.
- Safe to import from client and server.

2. `*.server.ts` (small-feature default)
- Server-only business rules + data access in one place.
- Imported only by `*.rpc.ts`.

3. `*.repository.ts` (optional, complex features)
- Data access interfaces only (ports).
- No runtime infra imports.

4. `*.repository-*.ts` (server implementation)
- Concrete adapters (Drizzle, external APIs, filesystem).
- Must remain server-only at runtime (`createServerOnlyFn`) and be imported
  from feature composition roots.

5. `*.use-cases.ts` (optional)
- Business rules and orchestration.
- Depends on interfaces + action policies.
- No direct infra imports.

6. `*.composition.ts` (optional server composition root)
- Dependency injection root for a feature.
- Wires repository adapters + action policies.

7. `*.rpc.ts`
- Transport boundary (`createServerFn` wrappers).
- Parses/validates input and delegates to server module or use-cases.

8. `*.client.ts`
- Query/mutation option builders and typed client errors.
- UI-facing helpers only.

## Server Core

- `src/config/helpers/errors.ts`: app error model and serialization.
- `src/config/helpers/result.ts`: `neverthrow` aliases/wrappers.
- `src/config/helpers/dal.ts`: DAL primitives for DB operations.
- `src/config/helpers/action-kit.ts`: policy-aware action orchestration (`public`,
  `auth`, `owned`, invalidation).
- `src/config/helpers/rpc.ts`: RPC response envelope and server function factories.

## Rules

- Do not import server-only implementation modules from routes, components,
  loaders, or other isomorphic modules at top level.
- Small-feature path: call `*.server.ts` only from RPC handlers.
- Complex-feature path: call repositories via use-cases, and use-cases via RPC.
- UI should consume `*.client.ts` query/mutation helpers instead of calling
  server functions directly in multiple places.
