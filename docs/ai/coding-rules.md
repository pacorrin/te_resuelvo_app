# Coding rules

**Audience:** humans and AI assistants working in this repo.  
**Source of truth:** the existing codebase, not generic framework advice.

---

## 1. Scope and stack (do not “improve away” without an explicit decision)

- **App:** Next.js App Router (`src/app`), React 19, TypeScript `strict`.
- **Data:** TypeORM + MySQL; lazy `getDataSource()` (`src/lib/db/connection.ts`).
- **Auth:** NextAuth v5 (beta); default middleware export in `src/proxy.ts`; session/session callbacks in `src/lib/auth/auth.config.ts`.
- **Package manager:** `pnpm` (see root `package.json` scripts for migrations).

---

## 2. Layering and dependency direction

**MUST** keep this direction for new domain code:

```text
UI (RSC / client) → Server Action (`"use server"`) → Service (static class) → Repository (static class) → TypeORM → DB
```

- **MUST NOT** import repositories or TypeORM from server actions. Actions call **services only** (or other non-DB utilities). **MUST NOT** import services from repositories.
- Orchestration (**membership**, multi-step updates, **`serialize`**) lives in **services**; actions stay thin: validate inputs, **`ActionResponse`**, **`try/catch`**, **`getErrorMessage`**.

---

## 3. File and folder placement

| Artifact | Location | Naming |
|----------|----------|--------|
| Server Actions | `src/lib/actions/` | `domain.actions.ts` or `domain-sub.actions.ts` |
| Services | `src/lib/services/` | `domain.service.ts` |
| Repositories | `src/lib/repositories/` | `EntityName.repo.ts` (PascalCase + `.repo.ts`) |
| Entities | `src/lib/entities/` | `EntityName.entity.ts` |
| DTOs (TS `interface` / `type` only) | `src/lib/dtos/` | `Entity.dto.ts` or plural `Entities.dto.ts` |
| Enums | `src/lib/enums/` | `domain.enum.ts` |
| DB config | `src/lib/db/` | `connection.ts`, `data-source.ts` |
| Migrations | `src/migrations/` | TypeORM-generated names |
| Storage helpers | `src/lib/storage/` | `*.service.ts`, `*.enums.ts` |
| Route Handlers | `src/app/api/**/route.ts` | Next.js conventions |
| Shared UI primitives | `src/components/ui/` | shadcn/Radix style |
| Feature UI | Next to the route’s `page.tsx` | `PascalCase.tsx` (e.g. `FollowUpStatusManagementCard.tsx`) |
| Client-only global UI state | `src/lib/stores/` | `*-store.ts` (currently theme only) |

---

## 4. Imports

- Path alias **`@/*`** → repo root (`tsconfig.json`).
- **SHOULD** use **`@/src/lib/...`** for imports from `src/lib` in new/edited files when the same directory already does so (many actions/services use this).
- **MAY** use relative `../` in the same feature island if that file’s neighbors already do—**match the file you are editing**, not an ideal.

---

## 5. Naming conventions

### Server Actions

- **SHOULD** prefix exports with **`_`** (e.g. `_getTicketById`, `_updateTicketStatus`) so call sites read consistently across the app.
- **Exceptions in tree today:** `authenticate`, `handleSignOut`, `loadUserProfile`, `getCurrentUser`, `createServiceTicketIncidence`, `_createTenderFromPublicSiteAction` (underscore after `_create`). **For new actions:** prefer **`_verbNoun`** unless you are extending a file that already uses a different local convention.
- **Auth-gated actions:** wrap with **`protectedAction`** from `src/lib/protected-action.ts` and implement handler as **`(session, ...args) => ...`**. If `session` is unused, name it **`_`** (already done in several files).

### Classes

- **Services:** `export class FooService { static ... }` — no instance DI.
- **Repositories:** `export class FooRepository { private static async getRepo() ... }`.

### React components

- **SHOULD** use **PascalCase** file names for components (`LeadListItemCompact.tsx`).

---

## 6. Server Actions (`"use server"`)

1. **MUST** put `"use server"` at the top of files that export server actions used as actions from the client/RSC.
2. **SHOULD** return **`Promise<ActionResponse<T>>`** for domain operations (`src/lib/utils/action-response.ts`), with:
   - `success: true` + `data` on OK
   - `success: false` + `error` (string) on expected failures
3. **Session (logged-in user):** **`protectedAction`** (`src/lib/protected-action.ts`) **MUST** be the place that ensures a session exists and that **`Number(session.user.id)`** is **finite**; it throws **`Error("Unauthorized")`** otherwise. Handlers wrapped with **`protectedAction`** **SHOULD NOT** repeat that session / user-id guard—use **`Number(session.user.id)`** directly when you need the user id.
   - **Domain ids** (ticket id, organization id, etc.): **SHOULD** still validate at the start of the action with **`Number.isFinite(id) && id > 0`** (or equivalent) before hitting the DB.
4. **SHOULD** in `catch (error)`:
   - `console.error("Short English label:", error);`
   - normalize failure text with **`getErrorMessage(error)`** when surfacing **`ActionResponse.error`**, **`toast*`**, **`setError`**, logs, etc.
5. **`protectedAction`:** if there is no session, no user, or **`session.user.id`** is not a finite number, it **throws** `Error("Unauthorized")`. Callers on public routes or client code **MUST** be prepared to catch if they call a protected action without a valid session (most panel usage assumes middleware already sent users to login).
6. **Public server actions** (no session): use a plain `export async function` / `export const fn = async (...) =>` **without** `protectedAction`, and still use **`ActionResponse`** where sibling actions do.

---

## 7. Services

- **MUST** implement domain orchestration as **`static` methods** on a **single exported class** per file.
- **SHOULD** expose **`static serialize(entity): SomeDTO`** (or `serializeThing`) for anything crossing the server boundary to UI/RSC; keep entity types internal where possible.
- **MAY** `throw new Error("...")` for true exceptional cases; actions **SHOULD** map those to `ActionResponse` in `try/catch` when the UX expects a structured failure.
- **SHOULD** call other services for cross-aggregate work (pattern already used, e.g. tender + coverage + answers).

---

## 8. Repositories

- **MUST** obtain the repository via **`await getDataSource()`** then **`getRepository(...)`** inside a **`private static async getRepo()`** (or equivalent) — see existing `*.repo.ts` files.
- **SHOULD** colocate **`SearchFoo`**, **`CreateFooInput`**, **`UpdateFooInput`** with the repository when they describe persistence filters/patches.
- **MUST** use **`getRepository("EntityName")`** or the entity class consistently **within the same file** as neighboring methods.

---

## 9. Entities and migrations

- **MUST** use TypeORM decorators; follow existing entities for **explicit DB names** (`@Entity({ name: "..." })`, `@Column({ name: "..." })`) when adding columns/tables in the same style.
- **MUST** register new entities in **`src/lib/db/data-source.ts`**.
- **MUST** ship schema changes via **`src/migrations`** using repo scripts (`pnpm migration:generate`, `pnpm migration:run`, etc.).

---

## 10. Validation

- **Primary pattern:** imperative checks in **server actions** (and sometimes services)—not a shared schema layer.
- **Zod** is used **in this repo** for **credentials** parsing in `src/lib/auth/auth.ts`. **DO NOT** assume Zod exists on every action; **DO NOT** add Zod to every endpoint “for consistency” unless the team decides to standardize.
- **SHOULD** parse string datetimes with the **Temporal** API rather than **`new Date(string)`** + **`Number.isNaN(d.getTime())`**: use **`Temporal.Instant.from(...)`** for absolute UTC instants (typical for submitted ISO strings with offset/`Z`), or **`Temporal.PlainDateTime.from(...)`** / **`Temporal.PlainDate`** when the value is intentionally wall-clock/local without zone; wrap **`from`** in **`try/catch`** and treat **`RangeError`** as invalid input (**`from`** rejects malformed strings).
- At boundaries that still require **`Date`** (e.g. **TypeORM**, older APIs), convert explicitly (e.g. from **`Temporal.Instant`** use **`epochMilliseconds`** with **`new Date(...)`**) instead of relying on **`Date`** parsing.
- If **`Temporal`** is not on the global object in the target runtime (typical until engine support ships everywhere), **`import '@js-temporal/polyfill'`** once in server/client entry paths that need parsing (add the dependency first).

---

## 11. Async handling

- **RSC pages:** **`await`** server actions directly; branch on **`result.success`**.
- **Client components:** **`async`** event handlers that **`await`** server actions are normal; **`useTransition`** is **not** currently a project-wide pattern—**do not introduce it** unless you are refactoring a specific flow that needs it.
- **Route Handlers:** **`params` is a `Promise`** — **`await context.params`** (already used in `src/app/api/...`).

---

## 12. Error handling and logging

- **Structured results:** **`ActionResponse<T>`** (`success`, `data?`, `error?`, `message?`).
- **Unknown errors in `catch`:** use **`getErrorMessage(error)`** from `src/lib/utils/error.ts` for `unknown` (do not duplicate `instanceof Error` ternaries).
- **Logging:** `console.error` with an English prefix is common; webhook code sometimes uses `console.log` for non-errors—follow **nearest neighbor** in the same directory.

---

## 13. API routes (`src/app/api`)

- **MUST** set **`export const runtime = "nodejs";`** where TypeORM / Node APIs are used (existing routes do this).
- **MUST** authenticate with **`await auth()`** when the route serves user-specific resources; return **`401`** JSON or `NextResponse` when unauthenticated.
- **SHOULD** return JSON bodies with **`success` / `error`** fields when mirroring server-action style (`files/upload`, checkout status).
- **Stripe webhook:** verify signature when secret is configured; delegate business effects to **services** (`TenderBuyerService`, `ServiceTicketService`), not raw SQL in the route.

---

## 14. Authentication and tenancy

- **Route-level auth:** `src/proxy.ts` + `authConfig.callbacks.authorized` — `/provider-panel` requires login; `/api` is excluded from the redirect logic in config.
- **Action-level auth:** **`protectedAction`** ensures a session exists, a user is present, and **`session.user.id`** is a finite number (otherwise it throws).
- **Tenancy / authorization:** enforce **organization membership** and ticket/org gates via **services** (e.g. **`OrganizationMemberService.userBelongsToOrganization`**, **`ServiceTicketService.ensureUserMembershipForTicket`**) **before** mutating org-owned rows. **MUST** keep this pattern for **new** org-scoped mutations.
- **Numeric user id:** in **`protectedAction`** handlers, rely on **`src/lib/protected-action.ts`** for session + finite **`session.user.id`**; use **`Number(session.user.id)`** as the user id. In **Route Handlers** and **non-`protectedAction`** code, still derive with **`Number(session?.user?.id)`** and validate with **`Number.isFinite`**.

---

## 15. State management

- **Default:** server-rendered data + props; mutations via **server actions**, then **router refresh** or local `useState` where components already do.
- **Session snapshot for client UI:** **`UserProvider`** / **`useUser()`** from `src/components/providers/UserProvider.tsx` (populated in root layout).
- **Global client persistence:** **Zustand** only where already established (**theme** — `src/lib/stores/theme-store.ts`). **DO NOT** add Zustand for routine form or server data.

---

## 16. UI and feedback

- **Panel copy:** **Spanish** for user-visible strings in provider flows unless the surrounding file is English-only.
- **Toasts:** both patterns exist:
  - **`import { toast } from "sonner"`** (direct)
  - **`toastError` / `toastSuccess`** from **`@/src/lib/utils`** (theme-token–aware wrapper)
  - **SHOULD** match the component you are editing; **SHOULD NOT** mix both in the same small component without reason.

---

## 17. Infrastructure and config

- **Next:** `serverExternalPackages` includes **`typeorm`**, **`mysql2`**, **`reflect-metadata`** (`next.config.ts`).
- **Server Actions body size:** raised to **10mb** for uploads—if you add large payloads, stay within configured limits or update config deliberately.
- **DB timezone:** data source uses **`timezone: "Z"`** — assume UTC semantics for datetimes.

---

## 18. Preferred patterns (project style)

| Area | Preferred |
|------|-----------|
| Mutations / reads from UI | Server Actions in `src/lib/actions` |
| Business logic | `*Service` static methods |
| SQL access | `*Repository` static methods |
| Wire format to UI | `ActionResponse` + service `serialize` |
| Auth for panel actions | `protectedAction` |
| Org access | `OrganizationMemberService` / domain service helpers (e.g. `ServiceTicketService.ensureUserMembershipForTicket`) |
| New UI in panel | Spanish strings, existing `components/ui`, feature colocation |

---

## 19. Deprecated / legacy (avoid for new code)

- **Export names without `_`** for new domain actions in files where all siblings use `_` (reduces grep/import drift).
- **`Record<string, any>` / `any`** in new APIs—narrow types; legacy serializers may still use them.

---

## 20. Anti-patterns (do not add more of these)

- Business rules **only** in React components when a service already exists for that domain.
- Importing **`*.repo`** or **TypeORM** from **`src/lib/actions`** — actions call **services** (and **`@/src/lib/utils`**), not repositories directly.
- New **repository → service** import cycles.
- **Skipping** org membership (or equivalent) checks on new org-scoped mutations “because the UI hides the button.”
- Returning **raw TypeORM entities** to the client when nearby code uses **DTOs + `serialize`**.
- Catching **`protectedAction`** failures only as `ActionResponse`—invalid or missing session can **throw**.
- **`instanceof Error` ternaries or `String(caught)` in `catch`** instead of **`getErrorMessage`**.

---

## 21. Minimal checklist (new vertical slice)

1. Entity (+ `data-source.ts`) and migration if the schema changes.
2. Repository methods mirroring an existing `*.repo.ts`.
3. Service methods + `serialize` (+ calls to other services if needed).
4. Server action(s): `ActionResponse`, validation of **domain** ids in the action, **`protectedAction`** when logged-in (session + user id enforced in `protected-action.ts`).
5. RSC `page.tsx` and/or client component colocated with route; toasts/copy match neighbors.

---

## 22. Related doc

- **`docs/ai/architecture.md`** — layer diagram, auth flow summary, and known inconsistencies across the repo.
