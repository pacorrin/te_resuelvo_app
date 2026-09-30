---
tipo: tecnico
actualizado: 2026-09-14
fuentes: [../../teresuelvo_app/src/emails, servicios que los invocan]
---

# Emails transaccionales

Sistema basado en React Email (`src/emails/`), disparados desde services (no desde un job/cola — son síncronos dentro del flujo de negocio).

| Email | Disparador | Destinatario |
|---|---|---|
| `CustomerTenderCreatedEmail` | `TenderService.createTenderFromPublicSite` (creación del lead) | Cliente final, si dio email |
| `CustomerTenderAccessCodeEmail` | `CustomerTenderAccessService.requestAccessCode` | Cliente final, al pedir/reenviar su código de 6 dígitos |
| `ProviderVerificationCodeEmail` | Flujo de auth/registro de proveedor | Proveedor |
| `CustomerProviderAssignedEmail` | `TenderBuyerService.notifyPurchaseCompleted` (tras pago confirmado) | Cliente final — "ya tienes proveedor asignado" |
| `ProviderTenderPurchasedEmail` | `TenderBuyerService.notifyPurchaseCompleted` (mismo trigger, junto al anterior) | Organización compradora — incluye link a `/provider-panel/leads/followup/{ticketId}` |

## Regla de negocio del código de acceso
El `customerAccessCode` es siempre **6 dígitos numéricos** (`crypto.randomInt(100000, 999999)`), validado por regex `^\d{6}$`, y **se rota automáticamente en cada login exitoso** — efectivamente un código de un solo uso por sesión. Esto refuerza el principio "sin registro de clientes finales" de [[mvp-modelo-pago-por-lead]].

## Relacionado
- [[ciclo-de-vida-tender]]
- [[arquitectura]]
