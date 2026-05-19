# Prompt: implement a feature

Use **`.cursorrules`**, **`docs/ai/architecture.md`**, and **`docs/ai/coding-rules.md`** as contract. Mirror the closest live module (prefer **service tickets**, **tenders**, **organizations**).

**Deliver**

1. **Entity + enum** (if new persistence) → migration path noted, `data-source` if required by repo standards.
2. **`ThingRepository`** — `getRepo`, `findOneBy`, `findAll`, `create`, `update`; **no service imports**.
3. **`ThingService`** — `serialize`, `getById` guards, orchestration; call repos + sibling services for cross-domain checks (e.g. membership).
4. **`_verbNoun` actions** — `"use server"`, `protectedAction`, `ActionResponse<T>`, validate ids, `getErrorMessage` in `catch`, **no repo/TypeORM** in actions.
5. **UI** — server/client components beside route; `"use client"` only where needed; toast via **`@/src/lib/utils`** pattern used in neighbors.

**Constraints**

- **No** CQRS, DI frameworks, generic repos, commands/handlers layers.
- **pnpm**; path alias **`@/*`** / **`@/src/...`** as siblings do.
- Org-scoped work: enforce membership/ownership in **services**, not only UI.

**Reference docs**

- Slice map: `docs/ai/examples/service-tickets-module.md`
- Patterns: `docs/ai/examples/service-pattern.md`, `repository-pattern.md`, `action-pattern.md`
