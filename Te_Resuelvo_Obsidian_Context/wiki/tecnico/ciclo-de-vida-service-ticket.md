---
tipo: tecnico
actualizado: 2026-09-14
fuentes: [../../teresuelvo_app/src/lib (ServiceTicket, ServiceTicketStatusHistory, ServiceTicketAppointment, ServiceTicketIncidence, ServiceTicketPayment)]
---

# Ciclo de vida de ServiceTickets

El `ServiceTicket` es el trabajo real una vez que una organización compró un `Tender` (ver [[ciclo-de-vida-tender]]). Se crea siempre en **PENDING** al confirmarse el pago del lead vía webhook de Stripe.

## Estados (`ServiceTicketStatus`)
| Valor | Estado |
|---|---|
| 1 | PENDING |
| 2 | CONTACTED |
| 3 | IN_PROGRESS |
| 4 | QUOTED |
| 5 | COMPLETED |
| 6 | CANCELLED |

Campo adicional: `serviceScheduledFor` (fecha agendada del servicio).

## Auditoría de estado — `ServiceTicketStatusHistory`
Log de cada cambio: guarda el `status` + un `eventType` más granular y quién lo cambió (`changedBy`).

`ServiceTicketStatusHistoryEventType`: FIRST_CONTACT, VISIT_SCHEDULED, VISIT_COMPLETED, QUOTE_SENT, WORK_IN_PROGRESS, WORK_COMPLETED, WORK_CANCELLED.

## Appointment vs. Incidence
- **ServiceTicketAppointment** — cita/visita agendada al domicilio (`scheduledAt`, `attendingUserId`, estado SCHEDULED/COMPLETED/CANCELLED). Es la agenda operativa.
- **ServiceTicketIncidence** — nota/evento libre sobre el ticket, tipado (`ServiceTicketIncidenceType`: NOTA, PROBLEMA, RETRASO, CANCELACION), con autor y descripción (máx. 255 caracteres). Es más un log cualitativo que un cambio de estado formal.

## Pagos del ticket — `ServiceTicketPayment`
Libro de movimientos **independiente del pago del lead a la plataforma**: registra abonos/cargos entre la organización y el cliente final por el trabajo realizado.

`ServiceTicketPaymentBalanceType`: CREDIT (1, abono) / DEBIT (2, cargo).

**Importante:** no hay acoplamiento automático entre `ServiceTicketPayment` y el `status` del ticket — saldar un pago no marca el ticket como COMPLETED automáticamente. Eso es una operación manual del proveedor. Punto de mejora potencial a evaluar con Francisco.

## Límites de negocio codificados (varchar lengths)
- Descripción del tender: máx. 400 caracteres
- Teléfono: máx. 15 caracteres
- Descripción de incidencia: máx. 255 caracteres
- Descripción de cita: máx. 500 caracteres

## Relacionado
- [[ciclo-de-vida-tender]]
- [[modelos-de-cobro]]
- [[dominios]]
