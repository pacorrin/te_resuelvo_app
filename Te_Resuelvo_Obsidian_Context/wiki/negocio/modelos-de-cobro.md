---
tipo: negocio
actualizado: 2026-09-14
fuentes: [raw/notion/modelos-sugeridos-de-cobro.md, raw/notion/visualizacion-del-mvp.md, ../../teresuelvo_app/src/lib (código real, ver [[ciclo-de-vida-tender]])]
---

# Modelos de cobro / monetización

> **Actualización 2026-09-14 (confirmado por código):** el modelo activo hoy en producción es el **Modelo 1 — Comisión por Lead**, implementado literalmente así: precio fijo por tipo de servicio (`Service.leadPrice`), cobrado vía Stripe al proveedor al momento de comprar el lead. No hay comisión porcentual ni "precio con comisión incluida" (Modelo 3) implementados en código — ver detalle abajo y en [[ciclo-de-vida-tender]]. Esto resuelve la pregunta que había quedado abierta en [[gap-negocio-vs-producto]].

Cuatro modelos evaluados originalmente, pensados como una progresión (no mutuamente excluyentes en el tiempo).

## Modelo 1 — Comisión por Lead
El proveedor paga por cada contacto válido, cierre o no. Ejemplo: lead AC $100–300 MXN, lead plomería $80–150 MXN.
- ✅ Cero fricción, ingreso inmediato, no requiere controlar pagos post-servicio.
- ❌ No captura valor del ticket completo.
- Es el modelo elegido para el MVP — ver [[mvp-modelo-pago-por-lead]].

## Modelo 2 — Comisión por servicio cerrado
Tú das el cliente, el proveedor cobra directo, y te paga su comisión después (10–20%). Depende de relación y confianza, no de tecnología — requiere seguimiento post-servicio y proveedores conocidos de entrada.

## Modelo 3 — Precio "con comisión incluida" (recomendado por el análisis original)
El precio que ve el cliente ya incluye el margen. Ejemplo AC: costo real del proveedor $8,000, precio publicado $9,000, margen $1,000. El proveedor cobra el total y transfiere la parte de Te Resuelvo.
- ✅ El cliente no percibe la comisión como tal; el proveedor la ve como costo de adquisición de cliente — más sostenible en el tiempo.

## Modelo 4 — Proveedor Premium (mediano plazo)
Mensualidad de proveedores a cambio de más leads, prioridad y menor comisión por transacción. Explícitamente marcado como "viene después, no al inicio".

## Precio por lead según rubro (referencia original)
| Rubro | Precio lead |
|---|---|
| Aire acondicionado | Alto |
| Electricidad | Medio |
| Plomería | Medio |
| Limpieza | Bajo |

Regla de negocio: un lead debe ser una oportunidad real, no spam — de ahí la necesidad de definir qué es un "lead válido" (ver riesgos en [[mvp-modelo-pago-por-lead]]).

## Estado real de implementación (confirmado en código)

**Modelo activo: Comisión por Lead, automatizado.**
- Precio fijo por lead viene de `Service.leadPrice` (catálogo de servicios), no hay fórmula de comisión % en ningún lugar del código.
- Cobro vía Stripe Checkout embebido, con `tax_behavior: "inclusive"` — es decir, `leadPrice` ya es el total que paga el proveedor; Stripe solo calcula el desglose de IVA sobre ese total, no suma nada encima.
- El pago se confirma por webhook (`checkout.session.completed`), no manualmente — la "liberación de contacto" del MVP original (ver [[mvp-modelo-pago-por-lead]]) ya está automatizada: al confirmarse el pago se crea el `ServiceTicket` y se envían los emails de asignación (ver [[emails-transaccionales]]).
- `ServiceTicketPayment` es un libro de movimientos **aparte**, entre la organización y el cliente final por el trabajo realizado — no es el cobro de la plataforma, no debe confundirse con el modelo de monetización de Te Resuelvo.

**Lo que NO está implementado:** Modelo 2 (comisión por servicio cerrado, requiere seguimiento post-servicio y seguridad de pago), Modelo 3 (precio con comisión incluida — hoy el precio es directo, sin margen oculto), Modelo 4 (suscripción premium de proveedores).

Ver el detalle técnico completo en [[ciclo-de-vida-tender]].

## Relacionado
- [[vision-y-modelo-de-negocio]]
- [[mvp-modelo-pago-por-lead]]
- [[dominios]] (entidades Tender, ServiceTicketPayment)
