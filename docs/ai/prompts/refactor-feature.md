# Prompt: refactor a feature

Refactor **only** what is needed for the stated goal; follow **`.cursorrules`**, **`docs/ai/architecture.md`**, **`docs/ai/coding-rules.md`**. Preserve public exports and behavior unless the user asks otherwise.

**Preferred moves**

- **Actions**: strip logic → call **one service** method; keep validation + `ActionResponse` mapping.
- **Services**: consolidate duplicated guards (`Number.isFinite`, membership checks); add **`serialize`** if UI still receives entities.
- **Repositories**: persistence only; colocate `Search*` / `Create*` / `Update*` inputs if that matches the module.

**Forbidden churn**

- No new architectural layers (use cases, CQRS, DI, generic repos).
- No mass renames unrelated to the refactor.
- No moving business logic into actions or repositories.

**Verification**

- Same user-visible behavior; tighter types; fewer duplicate queries.
- Cite or align with **`docs/ai/examples/service-pattern.md`** and **`repository-pattern.md`**.
