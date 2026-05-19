# Prompt: review implementation

Audit the change set against **`.cursorrules`**, **`docs/ai/architecture.md`**, and **`docs/ai/coding-rules.md`**. Compare to **`docs/ai/examples/`** (service tickets slice) for shape.

**Checklist**

1. **Boundaries**: actions → services → repos → TypeORM only downward; **no** repo from actions; **no** service from repos.
2. **Auth**: `protectedAction` for logged-in actions; **`Number(session.user.id)`**; domain authorization (org/ticket) in **services**.
3. **Responses**: `ActionResponse<T>` / JSON routes roughly aligned; **`getErrorMessage`** where errors are surfaced; no `any`.
4. **Data to client**: DTOs / `serialize*` — no raw entities where siblings serialize.
5. **API routes**: `runtime = "nodejs"` when Node/TypeORM; **`await context.params`**; 401/403/400 consistent with neighbors.
6. **Scope**: no speculative abstractions, no duplicate patterns, Spanish copy for provider panel if applicable.

**Output**

- Short verdict: **merge-ready** vs **needs fixes**.
- Bullet **blockers** (with file paths).
- Optional **nits** (non-blocking).
