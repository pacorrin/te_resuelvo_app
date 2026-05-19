# Architecture (reverse-engineered)

This document describes **how this repository is actually built today**, inferred from file layout and repeated patterns. It is not a target-state blueprint.

## 1. Architecture summary

### Product shape

- **Next.js 16** App Router (`src/app`), **React 19**, **TypeScript** (`strict: true`).
- **MySQL** via **TypeORM** (entities, repositories, migrations under `src/migrations`).
- **Auth**: **NextAuth v5 (beta)** with a **Credentials** provider; route protection is wired through the default export in `src/proxy.ts` (Next’s auth entry) plus `authorized` logic in `src/lib/auth/auth.config.ts`.
- **Payments**: **Stripe** (embedded checkout) via `StripeService` and server actions.
- **UI**: Tailwind CSS 4, **Radix**-based primitives under `src/components/ui`, feature cards under route folders (e.g. provider follow-up).

### Layer structure and dependency direction

Data and mutations generally flow **in one direction**:

```text
Route (RSC / client)  →  Server Action ("use server")  →  Service (static class)  →  Repository (static class)  →  TypeORM  →  MySQL
```

- **`src/app`**: Pages, layouts, route segments, colocated feature UI (large “card” components for provider flows).
- **`src/lib/actions/*.actions.ts`**: Server Actions. Entry points from the UI for mutations and many reads used by RSCs.
- **`src/lib/services/*.service.ts`**: Application/business orchestration: validation-ish checks, calling one or more repositories, cross-entity workflows, **`serialize` / `serialize*`** methods to shape responses.
- **`src/lib/repositories/*.repo.ts`**: Thin TypeORM access (`getDataSource` → `getRepository`), `findOne` / `find` / `save`-style operations; often defines small **input/search** interfaces colocated with the repo.
- **`src/lib/entities/*.entity.ts`**: TypeORM entities (DB column mapping, relations).
- **`src/lib/dtos/*.dto.ts`**: TypeScript **interfaces** for payloads and API-ish shapes (especially public forms and cross-layer contracts). Not a separate runtime DTO layer.
- **`src/lib/enums/*.enum.ts`**: Numeric/string enums used by entities and UI.
- **`src/lib/db`**: `connection.ts` (lazy singleton `getDataSource`, dev global cache) and `data-source.ts` (entity registration).
- **`src/lib/storage`**: Local filesystem helpers used by services and upload API routes.
- **`src/app/api/**`**: A few **Route Handlers** (e.g. file download/upload) that call `auth()` and services directly instead of Server Actions.

**Dependency rule in practice**: UI and server actions depend on **services** (and utilities), not repositories. Services depend on repositories and other services; repositories depend on TypeORM and entities. Repositories **do not** import services.

### Auth patterns

1. **Edge / proxy**: `src/proxy.ts` exports `auth` as default with a `matcher`—this runs the NextAuth middleware pipeline for matched routes.
2. **Session augmentation**: `auth.config.ts` extends session with `user.id` (number from token), `sub`, `nameInitial`.
3. **Server Actions that require a user**: Wrapped with **`protectedAction`** (`src/lib/protected-action.ts`), which calls `auth()` and **throws** `"Unauthorized"` if there is no session, no user, or **`session.user.id`** is not a finite number (callers rarely catch this; most traffic is already behind protected routes).
4. **Server Actions without `protectedAction`**: Public flows (e.g. tender creation from the marketing site, registration) or helpers like `getCurrentUser` / `loadUserProfile` that call `auth()` or services directly.
5. **Organization authorization**: Enforced by **services** (e.g. **`OrganizationMemberService`**, **`ServiceTicketService.ensureUserMembershipForTicket`**) backed by **`OrganizationMemberRepository`**—returning **`ActionResponse`** failures or delegated checks—not a centralized policy object.
6. **API routes**: Explicit `await auth()` and HTTP status codes (401/404/500).

### State management

- **Server state**: Primary pattern—**React Server Components** call **server actions** or services indirectly; props passed to client subtrees.
- **Client state**: Local component state; **`zustand`** appears only for **theme** (`src/lib/stores/theme-store.ts`) with `persist`, in addition zustand is used for complex workflows too.
- **Session user in client trees**: **`UserProvider`** + `useUser()` (`src/components/providers/UserProvider.tsx`) fed from `RootLayout` session.

### Validation approach

- **No single validation layer**: Most server actions use **manual guards** (`Number.isFinite`, null checks, string trim) and return **`ActionResponse`** with Spanish user-facing messages.
- **Zod** is used **selectively** (e.g. **Credentials** payload in `src/lib/auth/auth.ts`); it is **not** consistently applied across actions or DTOs.

### DTO usage

- **`src/lib/dtos`**: Shared **TypeScript interfaces** for inputs and stable response shapes (e.g. `CreateTenderFromPublicSiteDTO`).
- **Service-level types**: Many services also export **`SomethingDTO`** interfaces and implement **`static serialize(...)`**—sometimes overlapping with `dtos/` files, sometimes defined only on the service.
- **Repository-level types**: `Create*Input`, `Update*Input`, `Search*` interfaces often live **next to the repository** rather than under `dtos/`.

### Error handling conventions

- **`ActionResponse<T>`** (`src/lib/utils/action-response.ts`): `{ success, data?, error?, message? }` is the dominant contract for server actions.
- **`getErrorMessage`** (`src/lib/utils/error.ts`): Normalizes `unknown` to string for `error` fields.
- **Logging**: `console.error` in catch blocks is common; some catches swallow details and return a **generic** Spanish message.
- **`protectedAction`**: Uses **throw** for missing/invalid session or user id (different from `ActionResponse`).

### External configuration

- **`next.config.ts`**: `serverExternalPackages` includes `typeorm`, `mysql2`, `reflect-metadata`; **Server Actions** `bodySizeLimit` raised to **10mb** for uploads (incidence evidence, quotes).

---

## 2. Implicit rules discovered

- Server mutation/query entry points live under **`src/lib/actions`** with **`"use server"`** at the top of the file; those files depend on **services** (`*.service.ts`) and shared utils—not **`*.repo.ts`** or TypeORM.
- Authenticated actions use **`protectedAction((session, ...args) => ...)`**; **`protected-action.ts`** ensures **`session.user.id`** is a **finite number** before the handler runs.
- **Multi-tenant** behavior is modeled as **organization membership** checks via **`OrganizationMemberService`** / domain services wired to **`OrganizationMemberRepository`**.
- **User-facing copy** for panel flows is predominantly **Spanish**; some older strings remain **English**.
- **Serialization** for client/RSC consumption is done in **services** via `serialize*` static methods, not in repositories.
- **TypeORM** entity **table/column names** are often explicit (`@Entity({ name: "..." })`, `@Column({ name: "..." })`).

---

## 3. Stable patterns already adopted

| Pattern | Where it shows up |
|--------|-------------------|
| Static **Service** class with `static async` methods | `*service.ts` |
| Static **Repository** with private `getRepo()` | `*repo.ts` |
| **`getDataSource()`** lazy init + dev global | `src/lib/db/connection.ts` |
| **`ActionResponse<T>`** for server action results | Most `*.actions.ts` |
| **`serialize` / `serializeTenderClientList`** shaping | `TenderService`, `ServiceTicketService`, etc. |
| **Route groups** `(public)` vs `(panel)` | `src/app` |
| **Colocated feature components** with the page | e.g. `followup/[ticketId]/` |
| **shadcn-style** UI primitives | `src/components/ui` |

---

## 4. Dangerous inconsistencies (real risk today)

1. **`protectedAction` throws `"Unauthorized"`** while the rest of the stack prefers **`ActionResponse`**—client code that assumes `{ success: false }` may not handle thrown errors uniformly.
2. **Authorization split**: Middleware protects `/provider-panel`, but **fine-grained access** (org membership, ticket ownership) is **per-action** and easy to forget on new endpoints.
3. **Naming drift for server actions**: Most exports use a **`_` prefix**; at least one uses **`createServiceTicketIncidence`** without it—grep/import confusion.
4. **DTO location drift**: Inputs live in **`dtos/`** vs **`repositories/`** vs **inline service types**—new code can duplicate shapes.
5. **Loose typing in places**: e.g. `Record<string, any>` in serialization paths (`TenderService.serializeTender`) and `any` in Stripe serialization—undermines `strict` TypeScript benefits.
6. **Stripe / payment actions** may not mirror the same **`ActionResponse`** + membership patterns as domain actions—behavior is “whatever the service throws/returns.”
7. **Mixed languages** in errors and validation messages complicate UX and tests.

---

## 5. Recommendations (only if staying aligned with this architecture)

- **Prefer** adding behavior as: **thin action** (**`ActionResponse`**, input guards) → **existing service** → **existing repository**; add a **repository** only when a new aggregate or query pattern appears. **Never** import a repository into **`src/lib/actions`**.
- **Prefer** returning **`ActionResponse`** from new server actions for consistency; if using `protectedAction`, document whether the caller must **`try/catch`**.
- **Prefer** putting **cross-feature** input contracts in **`src/lib/dtos`** and keeping **repo-only** filter types next to the repo **only** when they are truly persistence-shaped.
- **Prefer** enforcing org/ticket access via **existing service helpers** (e.g. **`OrganizationMemberService`**, **`ServiceTicketService.ensureUserMembershipForTicket`**) rather than calling repositories from server actions.
- **When adding entities**, follow **TypeORM migration** workflow already in `package.json` (`migration:generate`, `migration:run`).

---

## 6. Suggested AI context documentation (optional splits)

These two files are the baseline. If the repo grows, add **narrow** companion docs (keep them short, feature-owned):

| File | Purpose |
|------|---------|
| `docs/ai/domain-service-tickets.md` | Status enums, payments, incidences, status history, quote upload rules |
| `docs/ai/domain-tenders-and-buyers.md` | Tender creation, coverage, purchase / `processUuid` |
| `docs/ai/auth-and-tenancy.md` | `protectedAction`, membership checks, proxy matcher quirks |
| `docs/ai/ui-patterns.md` | Panel cards, Sonner toasts, Radix dialog patterns used in follow-up |

Avoid duplicating TypeORM entity fields in docs—**link to entities** instead.
