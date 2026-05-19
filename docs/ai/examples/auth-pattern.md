# Example: auth pattern

## 1. Reference files

- `src/proxy.ts` — default export **`auth`** from `@/src/lib/auth/auth`; **`config.matcher`** for protected vs public paths (note: `/api` allowed through; panel vs login redirect logic lives in **`authConfig.callbacks.authorized`**).
- `src/lib/auth/auth.config.ts` — **`authConfig`**: `pages.signIn`, **`authorized`** callback (e.g. `/provider-panel` requires login; logged-in users redirected away from public routes per current rules), **`session`** callback augments `user` with `id`, `sub`, `nameInitial`.
- `src/lib/auth/auth.ts` — **`NextAuth({ ...authConfig, providers: [...] })`** — **Credentials** provider with **Zod**-validated input; **`UserService`** for lookup; **`handlers`, `auth`, `signIn`, `signOut`** export.
- `src/lib/protected-action.ts` — server actions: **`await auth()`**, enforce **`session?.user`** and finite **`user.id`**, else throw **`Unauthorized`**.

## 2. Why good

- **Single `auth()`** entry for RSC, routes, and actions proxy.
- **Route protection** centralized in NextAuth **`authorized`** callback — UI routes don’t each reimplement redirects.
- **Server actions** get a **second gate** via `protectedAction` for mutation/query safety beyond “page URL allowed”.

## 3. Patterns

- **Session typing** extended in `auth.config.ts` (`Session.user.id` as `number`, etc.).
- **Credentials** flow validates with **Zod** in `authorize`.
- **`protectedAction`**: throw **`Error("Unauthorized")`** when no session — callers don’t re-validate session existence.

## 4. Naming

- Exports: **`auth`**, **`authConfig`**, **`handlers`**, **`signIn`**, **`signOut`**.
- Helper: **`protectedAction`** wraps `(session, ...args) => ...` handlers.

## 5. Architectural conventions

- **No business logic in `authorize`** beyond credential verification and user load — domain stays in **`UserService`**.
- **Org/ticket authorization** still enforced in **domain services** (e.g. `ensureUserMembershipForTicket`); auth stack proves *who* the user is, not always *what* they may do.

## 6. Replicate behaviors

- For **API routes**, call **`await auth()`** and return **401** if missing user when the endpoint requires identity.
- For **logged-in server actions**, use **`protectedAction`** and **`Number(session.user.id)`** for DB queries.
- When changing **who may access a path**, update **`authConfig.callbacks.authorized`** and keep **`proxy.ts` `matcher`** aligned with Next.js expectations.

## 7. Anti-patterns avoided

- Not relying only on **client-side** hiding for protected operations.
- Not **skipping** membership checks in services because the user passed `auth()`.
- Not importing **TypeORM** into **`auth.ts`** — use **services** (`UserService`).
