# Golden slice: service tickets module

End-to-end reference for **one vertical**: tickets tied to tenders and organizations.

## Flow

`UI (RSC/client)` → **`src/lib/actions/service-tickets.actions.ts`** → **`ServiceTicketService`** (`src/lib/services/service-tickets.service.ts`) → **`ServiceTicketRepository`** (`src/lib/repositories/ServiceTickets.repo.ts`) → **`ServiceTicket` entity** (`src/lib/entities/ServiceTickets.entity`)

## Core files (copy order)

| Layer | File |
|--------|------|
| Entity / enums | `src/lib/entities/ServiceTickets.entity.ts`, `src/lib/enums/service-tickets.enum.ts` |
| Repository | `src/lib/repositories/ServiceTickets.repo.ts` |
| Service | `src/lib/services/service-tickets.service.ts` |
| Related services | `src/lib/services/organization-member.service.ts` (membership), `src/lib/services/tender.service.ts` (nested DTOs), `src/lib/services/service-ticket-status-history.service.ts`, `src/lib/services/service-ticket-payment.service.ts` |
| Actions | `src/lib/actions/service-tickets.actions.ts` |
| UI | Search under `src/app/(panel)/` for routes consuming `_getTicketsByOrganization`, scheduling, follow-up (e.g. provider panel leads / tickets) |

## Behaviors to mirror

- **DTO boundary**: `ServiceTicketService.serialize` → `ServiceTicketDTO`; actions return serialized data on success.
- **AuthZ**: `ensureUserMembershipForTicket` + `OrganizationMemberService.userBelongsToOrganization` before sensitive mutations.
- **IDs**: `Number.isFinite` / `> 0` guards at action and service entry points.
- **Relations**: default relation list in service, passed into `findOneBy` / `findAll`.

## Docs

- Service / repo / action detail: `docs/ai/examples/service-pattern.md`, `repository-pattern.md`, `action-pattern.md`.

## Avoid

Repositories importing services; actions importing repos or TypeORM; leaking raw entities to the client when a `*DTO` exists.
