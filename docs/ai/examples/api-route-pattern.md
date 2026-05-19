# Example: API route pattern

Two references: **binary file download** and **JSON status** (both App Router).

## 1. Reference files

- `src/app/api/files/[fileId]/route.ts` — `GET`, `auth()`, `runtime = "nodejs"`, streams file via `FileService`, 401/400/404/500.
- `src/app/api/checkout/[processUUID]/status/route.ts` — `GET`, `auth()`, JSON body aligned with success/error pattern, 401/400/403/500, delegates to `TenderBuyerService`.

## 2. Why good

- **`export const runtime = "nodejs"`** when using Node APIs (`fs`, streams) or TypeORM-backed services.
- **`await context.params`** — params are a **Promise** in these route types.
- **Auth at the edge**: `await auth()` then explicit **401**; domain checks (e.g. `buyedBy === userId`) → **403**.

## 3. Patterns

- **GET handler** (or POST, etc.) with `try/catch`, `console.error` with route name.
- Parse **path params** after auth; validate presence; return **400** if missing.
- **Delegate** to a **service** for DB/domain work (`FileService.getById`, `TenderBuyerService.getTenderBuyerByProcessUuid`).
- **JSON routes**: `NextResponse.json({ success, data?, error? }, { status })` to stay close to `ActionResponse` shape where appropriate.

## 4. Naming

- File: **`route.ts`** under `src/app/api/...`.
- Context type: local **`RouteContext`** with `params: Promise<{ ... }>`.

## 5. Architectural conventions

- Route handlers **thin** — no business rules beyond HTTP concerns; services own rules.
- **Same auth stack** as the rest of the app: `auth` from `@/src/lib/auth/auth`.

## 6. Replicate behaviors

- Always **`await context.params`** when using dynamic segments.
- Use **numeric user id**: `Number(session?.user?.id)` and **`Number.isFinite`** before domain calls when the handler requires a user.
- For downloads, set **Content-Type**, **Content-Length**, **Cache-Control**, **Content-Disposition** as in the files route.

## 7. Anti-patterns avoided

- No **repository imports** in routes when a **service** already wraps the domain.
- No **`edge` runtime** by default for TypeORM/fs-heavy handlers.
- No **silent auth failure** — return explicit **401/403** statuses.
