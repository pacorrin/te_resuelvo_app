---
tipo: decision
actualizado: 2026-09-14
fuentes: [raw/notion/visualizacion-del-mvp.md, raw/notion/modelos-sugeridos-de-cobro.md, ../../teresuelvo_app (código fuente, deep dive 2026-09-14)]
estado: parcialmente resuelto — ver actualización
---

# Gap: documentación de negocio (Notion) vs. producto real (código)

## Contexto
Al construir esta wiki (2026-09-14) se comparó lo documentado como plan de negocio/MVP en Notion contra lo que ya existe implementado en `teresuelvo_app`. Hay una brecha significativa que vale la pena que Francisco resuelva explícitamente, porque cualquier feature nueva sugerida con IA debe partir del estado **real**, no del plan original.

## Lo que dice Notion (plan original, ver [[mvp-modelo-pago-por-lead]])
- Liberación de contacto del cliente **manual**
- Pago por lead vía transferencia/link/efectivo, sin automatizar
- Alta de proveedores manual
- WhatsApp como canal operativo principal
- Backoffice "mínimo"

## Lo que existe en el código (ver [[dominios]], [[arquitectura]])
- Checkout automatizado con **Stripe** + webhook
- Ciclo de vida completo del servicio: `Tender` → `TenderBuyer` → `ServiceTickets` con citas, incidencias, pagos e historial de estado
- Zonas de cobertura geográfica con fórmulas de distancia (`OrganizationCoverageArea`)
- Sistema de formularios dinámicos (`QuestionSet`) para calificar leads

## Por qué importa
1. Si se sigue el plan de Notion al pie de la letra para nuevas features, se estaría re-construyendo algo que el código ya resolvió mejor.
2. El modelo de cobro "vigente" en negocio ([[modelos-de-cobro]]) no está claro si sigue siendo pago-por-lead puro, o si ya se avanzó a comisión por ticket dado que existe `ServiceTicketPayment`.
3. Para reportar bien el estado del proyecto a stakeholders/organización a largo plazo, la fuente de verdad operativa debería ser el código + confirmación de Francisco, y Notion debería actualizarse para reflejarlo (o marcarse explícitamente como "plan histórico").

## Actualización 2026-09-14 — deep dive de código

Dos de las tres preguntas quedaron resueltas leyendo el código a fondo (ver [[ciclo-de-vida-tender]], [[modelos-de-cobro]]):

- **Modelo de cobro activo:** confirmado, es pago-por-lead puro (Modelo 1), precio fijo por servicio vía `Service.leadPrice`, sin comisión %. No hay mezcla con Modelo 2/3.
- **Liberación de contacto:** confirmado, ya es **automática** — se dispara por webhook de Stripe al confirmarse el pago, no manual como describía el plan original de Notion.

Además, el deep dive reveló **una brecha nueva no anticipada**: el código no implementa expiración de leads, "lead inválido" ni bloqueo global de venta (un mismo Tender puede en teoría venderse a más de una organización — solo se evita la recompra por la misma organización). El riesgo "proveedor se queja del lead" identificado en el plan original de negocio ([[mvp-modelo-pago-por-lead]]) sigue sin mitigación técnica.

## Preguntas abiertas restantes para Francisco
1. ¿Es intencional que un mismo Tender pueda venderse a varias organizaciones distintas, o debería bloquearse tras la primera venta? Esto es una decisión de producto/negocio importante — afecta directamente la percepción de "lead exclusivo" para el proveedor.
2. ¿Se necesita ya un mecanismo de "lead inválido" con reposición, dado que no existe en código y sí estaba en el plan de riesgos original?
3. ¿Vale la pena actualizar las páginas de Notion para que reflejen el estado real, o esta wiki asume el rol de fuente de verdad de negocio de aquí en adelante?

## Estado
Parcialmente resuelto. El modelo de cobro y automatización de liberación de contacto ya están confirmados. Las preguntas de exclusividad del lead y manejo de leads inválidos siguen abiertas — revisar en el próximo ingest.

## Relacionado
- [[vision-y-modelo-de-negocio]]
- [[mvp-modelo-pago-por-lead]]
- [[modelos-de-cobro]]
- [[dominios]]
