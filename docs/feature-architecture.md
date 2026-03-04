# Feature Architecture

This codebase follows a feature-slice architecture designed for TanStack Start's
execution model (isomorphic by default, explicit server boundaries).

## Layers

1. `*.contract.ts`
- Shared schemas, DTOs, query keys and cache tags.
- Safe to import from client and server.

2. `*.repository.ts`
- Data access interfaces only (ports).
- No runtime infra imports.

3. `*.repository.server.ts`
- Concrete adapters (Drizzle, external APIs, filesystem).
- Must remain server-only and be imported from server composition roots.

4. `*.use-cases.ts`
- Business rules and orchestration.
- Depends on interfaces + action policies.
- No direct infra imports.

5. `*.composition.server.ts`
- Dependency injection root for a feature.
- Wires repository adapters + action policies.

6. `*.rpc.ts`
- Transport boundary (`createServerFn` wrappers).
- Parses/validates input and delegates to use-cases.

7. `*.client.ts`
- Query/mutation option builders and typed client errors.
- UI-facing helpers only.

## Server Core

- `src/server/errors.ts`: app error model and serialization.
- `src/server/result.ts`: `neverthrow` aliases/wrappers.
- `src/server/dal.ts`: repository primitives for DB operations.
- `src/server/action-kit.ts`: policy-aware action orchestration (`public`,
  `auth`, `owned`, invalidation).
- `src/server/rpc.ts`: RPC response envelope and server function factories.

## Rules

- Do not import `*.server.ts` modules from routes, components, loaders, or
  other isomorphic modules at top level.
- Only call repositories via use-cases.
- Only call use-cases from RPC handlers.
- UI should consume `*.client.ts` query/mutation helpers instead of calling
  server functions directly in multiple places.
