---
tipo: tecnico
actualizado: 2026-09-14
fuentes: [../../teresuelvo_app/src/lib (Tender, TenderBuyer, TenderService, TenderBuyerService, Tender.repo.ts)]
---

# Ciclo de vida del Tender (lead)

Implementación real en código del concepto de "lead" descrito en [[mvp-modelo-pago-por-lead]].

## Entidades involucradas
- **Tender** (`tenders`) — la solicitud del cliente. No tiene columna `status` propia; su estado se infiere vía sus `TenderBuyer`. Campos clave: `serviceId`, `customerId`, dirección + `latitude`/`longitude` (guardadas como `varchar`, no `decimal` — nota técnica, no geo-tipo nativo), `zipcode`, `customerAccessCode` (código de 6 dígitos para que el cliente entre al portal de seguimiento sin cuenta formal).
- **TenderBuyer** (`tenders_buyers`) — la "compra" de un lead por una Organization. Vincula `tenderId` + `organizationId` + `buyedBy` (usuario comprador), con `paymentStatus`, `amount`, `paymentTaxAmount`, `paymentReceiptNumber`, `processUuid` (UUID v7 del proceso de checkout Stripe).

## Estados de pago del lead (`TenderPaymentStatus`)
| Valor | Estado |
|---|---|
| 1 | PENDING |
| 2 | PAID |
| 3 | CANCELLED |
| 4 | FAILED |

## Flujo real
1. Cliente crea el Tender desde el sitio público (`TenderService.createTenderFromPublicSite`) → dispara email `CustomerTenderCreatedEmail` si hay correo.
2. Una organización interesada llama `TenderBuyerService.initPurchaseProcess` → crea (o **reutiliza si ya existe**) un `TenderBuyer` en PENDING con `amount=0`. Si la misma organización reintenta, actualiza `buyedBy` en vez de duplicar — **un lead solo puede tener un registro de compra por organización**.
3. Checkout de Stripe se resuelve → el webhook `checkout.session.completed` llama `TenderBuyerService.markAsPaid`, que:
   - Marca el `TenderBuyer` como PAID con `amount_total`/`amount_tax` reales de Stripe.
   - **Crea el `ServiceTicket`** correspondiente en estado PENDING — este es el disparador real de creación del ticket, no el inicio de la compra.
   - Dispara `notifyPurchaseCompleted`: envía `CustomerProviderAssignedEmail` (al cliente) y `ProviderTenderPurchasedEmail` (al proveedor, con link a `/provider-panel/leads/followup/{ticketId}`).

## Lo que NO existe (importante corregir vs. el plan de Notion)
- **No hay expiración de leads** ni campo para ello.
- **No hay "reposición" automática de lead inválido** — el riesgo mitigado en [[mvp-modelo-pago-por-lead]] ("proveedor se queja del lead") no tiene contraparte en código todavía; sigue siendo un proceso manual/no resuelto.
- **No hay bloqueo global de "lead vendido"**: un mismo Tender puede en teoría ser comprado por varias organizaciones distintas — solo se excluye para quien ya lo pagó (ver [[cobertura-geografica]], la query de matching excluye tenders donde la organización ya tiene un `TenderBuyer` PAID, pero no excluye ese tender para otras organizaciones). Esto es una decisión de producto implícita en el código, no documentada explícitamente en Notion — confirmar con Francisco si es intencional (¿se vende el mismo lead a varios proveedores, tipo "primero en pagar, se lleva el ticket"? ¿o es un bug/gap?).

## Relacionado
- [[modelos-de-cobro]]
- [[ciclo-de-vida-service-ticket]]
- [[cobertura-geografica]]
- [[emails-transaccionales]]
- [[gap-negocio-vs-producto]]
