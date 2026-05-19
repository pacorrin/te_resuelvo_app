# Example: service pattern

Golden slice: **service tickets**.

## 1. Reference files

- `src/lib/services/service-tickets.service.ts` — `ServiceTicketService`: `serialize`, `getById`, `getOneByOrganization`, `getAllBy`, `ensureUserMembershipForTicket`, orchestration + other ticket flows.
- `src/lib/services/organization-member.service.ts` — `OrganizationMemberService.userBelongsToOrganization` (membership check used by ticket authorization).

## 2. Why good

- **Single place** for ticket rules, relation loading defaults, and DTO shaping; UI and actions stay thin.
- **Typed DTOs** (`ServiceTicketDTO`) so clients never see raw entities when the module serializes.
- **Authorization helper** (`ensureUserMembershipForTicket`) composes org membership without duplicating repo queries in every action.

## 3. Patterns

- **Static class** with only static methods; no instance state.
- **`serialize(entity)`** maps entity → DTO; nested data delegated (e.g. `TenderService.serializeTenderClientList`).
- **`getById`** guards invalid ids (`Number.isFinite`, `> 0`), returns `null` when not found.
- **Repository calls** for persistence; **other services** for cross-domain reads (e.g. tenders, org membership).
- **Explicit relation lists** (`SERVICE_TICKET_RELATIONS`) passed into repository calls for consistent graphs.

## 4. Naming

- Service class: **`ThingService`** (e.g. `ServiceTicketService`).
- Serialization: **`serialize`**, **`serializeThing`** (match siblings).
- Factories/getters: **`getById`**, **`getAllBy`**, **`getOneByOrganization`** — verb + scope.

## 5. Architectural conventions

- **Services orchestrate** business logic and compose other services/repos.
- **Repositories** own TypeORM; services do not construct queries inline beyond calling repo methods.
- **Membership / tenancy** enforced in the service layer (or via service helpers called from actions), not only in UI.

## 6. Replicate behaviors

- Add **`serialize`** before exposing entity fields to the client.
- Validate numeric ids at service public entry points when the rest of the stack expects safe calls.
- Return **`null` or structured `{ ok: false, error }`** for expected “not found / forbidden” paths; reserve throws for exceptional persistence failures if that matches the module.

## 7. Anti-patterns avoided

- No **generic repository** or **DI container**; plain static classes.
- No **CQRS** split; one service handles reads + writes for the aggregate.
- No **raw `ServiceTicket`** leaked to UI when the module already defines `ServiceTicketDTO`.
