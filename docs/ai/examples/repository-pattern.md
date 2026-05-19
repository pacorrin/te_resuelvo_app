# Example: repository pattern

Golden slice: **service tickets**.

## 1. Reference files

- `src/lib/repositories/ServiceTickets.repo.ts` — `ServiceTicketRepository`, persistence types `SearchServiceTicket`, `CreateServiceTicketInput`, `UpdateServiceTicketInput`.

## 2. Why good

- **Thin persistence layer**: `getDataSource` → `getRepository` → TypeORM calls; no business rules beyond load/save.
- **Colocated input types** for create/update/search keep service signatures clean without a separate “infra DTO” explosion.
- **Predictable API**: `findOneBy`, `findAll`, `create`, `update` mirror how services call persistence.

## 3. Patterns

- `private static async getRepo(): Promise<Repository<Entity>>`
- **`findOneBy(where, relations?)`** — `repo.findOne({ where, relations })`
- **`findAll(where, relations?)`** — optional default `{}`, explicit `order` when needed
- **`create`** — `repo.create` + `repo.save`
- **`update`** — load existing, merge patch, `save` (or `throw` if missing row)

## 4. Naming

- Class: **`ThingRepository`** (e.g. `ServiceTicketRepository`).
- Search shape: **`SearchThing`** or **`SearchServiceTicket`**.
- Inputs: **`CreateThingInput`**, **`UpdateThingInput`**.

## 5. Architectural conventions

- Repositories **must not** import services (avoid cycles).
- **TypeORM** and **`getDataSource`** live here only at the data edge (plus `data-source` / migrations elsewhere).
- Heavy **authorization and rules** stay in services/actions, not in `find*`.

## 6. Replicate behaviors

- Export **narrow interfaces** for search/create/update next to the repository when that’s the project norm.
- Use **string entity name** or entity class consistently with the rest of the repo (`getRepository("ServiceTicket")` here).
- In `update`, **fail clearly** if the row is missing (`throw new Error(...)`) unless the module standard is `return null`.

## 7. Anti-patterns avoided

- No **generic base repo** wrapping TypeORM.
- No **service calls from repository** (no orchestration).
- No **UI or ActionResponse** types in the repository layer.
