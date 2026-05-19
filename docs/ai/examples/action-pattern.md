# Example: server action pattern

Golden slice: **service tickets** + shared utilities.

## 1. Reference files

- `src/lib/actions/service-tickets.actions.ts` — `"use server"`, `protectedAction`, `ActionResponse`, validation + service calls.
- `src/lib/protected-action.ts` — session gate + `Unauthorized` throw.
- `src/lib/utils/action-response.ts` — `ActionResponse<T>` shape.
- `src/lib/utils/error.ts` — `getErrorMessage` for catch paths.

## 2. Why good

- **Thin boundary**: parse/validate inputs, call **one service** (or a small orchestration), map to `ActionResponse`.
- **Auth centralized** in `protectedAction` — handlers receive `session` and use `Number(session.user.id)` without re‑checking boilerplate.
- **Consistent errors**: user-facing strings in Spanish where the module does; `getErrorMessage` for unknown errors.

## 3. Patterns

- File starts with **`"use server"`**.
- Export **`_verbNoun`** = `protectedAction(async (session, ...args) => { ... })`.
- Early **`return { success: false, error: "..." }`** for validation / expected failures.
- **`try/catch`**: `console.error` + `getErrorMessage(error)` or a safe generic message per action.
- **Success**: `{ success: true, data }` with serialized DTOs from the service.

## 4. Naming

- Actions: **`_scheduleServiceAppointment`**, **`_getTicketsByOrganization`** — leading underscore + verb + domain noun (match sibling files).

## 5. Architectural conventions

- Actions call **services** (and small shared helpers), **not** repositories or TypeORM.
- **Heavy logic** stays in services; actions keep **id parsing**, **date parsing**, and **response mapping**.

## 6. Replicate behaviors

- Use **`protectedAction`** for logged-in mutations/queries; validate **`ticketId`**, org ids, etc. before calling services.
- Delegate **membership** to something like `ServiceTicketService.ensureUserMembershipForTicket` instead of duplicating queries.
- Prefer **service `serialize`** in the return path so the client gets DTOs.

## 7. Anti-patterns avoided

- No **repository imports** in actions.
- No **duplicate session existence checks** inside every handler.
- No **`any` / `Record<string, any>`** for responses; use **`ActionResponse<T>`**.
