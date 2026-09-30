---
tipo: producto
actualizado: 2026-09-14
fuentes: [raw/notion/visualizacion-del-mvp.md]
---

# MVP — Diseño operativo (modelo pago por lead)

Diseño operativo y de negocio del MVP original de Te Resuelvo, basado en el modelo de [[modelos-de-cobro|comisión por lead]].

## Principios no negociables
1. Sin registro de clientes finales
2. Captura inmediata de leads
3. Proveedor paga **antes** de ver los datos del cliente
4. WhatsApp como canal principal
5. Control manual al inicio (sin automatizar de más)
6. Escalabilidad posterior, no desde el día 1

## Flujo del cliente (demanda)
Entra a la web → selecciona rubro → completa formulario (nombre, zona/colonia, WhatsApp, descripción del problema) → CTA "Recibe propuestas de proveedores verificados" → confirmación. **No paga, no se registra, no espera algo complejo.**

## Flujo del proveedor (oferta)
- **Alta:** manual, por Francisco/equipo — se le asigna rubro, zona, tipo de trabajos, método de pago.
- **Visualización de oportunidades:** el proveedor ve rubro, zona aproximada, tipo de problema y precio del lead — pero NO ve nombre, teléfono, dirección ni WhatsApp hasta pagar.
- **Desbloqueo (pago por lead):** selecciona oportunidad → "Desbloquea este cliente por $X" → paga → se liberan los datos completos (manual o automático).

## Flujo operativo interno
Lead entra → se guarda → se notifica a proveedores (WhatsApp/email) → pago (transferencia/link/efectivo al inicio) → liberación manual del contacto. Explícitamente: **el MVP no necesita automatizar esto todavía.**

## Módulos web necesarios (según diseño original)
1. Landing + servicios (qué es, cómo funciona, rubros, CTA)
2. Formulario de cliente
3. Panel de proveedor básico (oportunidades, estado bloqueado/disponible, botón desbloquear)
4. Backoffice mínimo (crear proveedores, crear oportunidades, marcar pagado, liberar contacto)

## Riesgos identificados y mitigación
| Riesgo | Mitigación propuesta |
|---|---|
| Proveedor se queja del lead | Definir "lead válido"; reposición si no responde |
| Pocos proveedores al lanzar | Pre-reclutar antes de publicar; AC como rubro ancla |

## Estado de implementación vs. diseño original
El código actual ya va más allá de este diseño manual: hay checkout con Stripe, un módulo completo de `ServiceTickets` (citas, incidencias, pagos, historial de estados) y entidades `Tender`/`TenderBuyer` que formalizan el ciclo de vida del lead. Esto sugiere que el producto evolucionó de "MVP 100% manual" a un sistema con más automatización — ver [[dominios]] y [[gap-negocio-vs-producto]]. Vale la pena que Francisco confirme cuáles de estos módulos del diseño original siguen siendo el flujo real hoy.

## Relacionado
- [[vision-y-modelo-de-negocio]]
- [[modelos-de-cobro]]
- [[decision-web-vs-app]]
- [[dominios]]
