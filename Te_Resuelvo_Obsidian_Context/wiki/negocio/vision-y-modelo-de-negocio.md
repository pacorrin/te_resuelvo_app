---
tipo: negocio
actualizado: 2026-09-14
fuentes: [raw/notion/analisis-general.md, raw/notion/te-resuelvo-home.md]
---

# Visión y modelo de negocio

Te Resuelvo es una **empresa de intermediación de servicios para el hogar**, no un proyecto tecnológico. La tesis central: convertir una experiencia operativa ya dominada (venta y operación de aire acondicionado) en un negocio escalable de ingresos constantes, usando tecnología mínima viable como palanca, no como producto.

## El problema que resuelve
- **Cliente final:** no sabe a quién contratar, teme malas experiencias, quiere respuesta rápida y precio justo.
- **Proveedor:** vive de referencias, ingresos inestables, sin tiempo ni saber para digitalizarse.

El mercado existe pero está mal organizado — esa desorganización es la oportunidad.

## Qué se está construyendo
Un canal de ventas recurrente + una marca de confianza + un sistema que conecta problema → solución, sin depender de publicidad tradicional sino de resolver bien el servicio.

## Principio estratégico: negocio-first, no tech-first
"Primero hacemos que el negocio gane dinero. Después lo escalamos con tecnología." Por eso se descartó explícitamente construir una app nativa en esta etapa — ver [[decision-web-vs-app]]. Ver el detalle operativo en [[mvp-modelo-pago-por-lead]].

## Rubro ancla: aire acondicionado
Se eligió AC como primer rubro porque ya hay ventaja competitiva real: se sabe vender, operar, costear, y dónde se pierde dinero. Da flujo de efectivo temprano y reputación desde el día uno. Otros rubros (electricidad, plomería, limpieza) se agregan cuando el sistema ya funciona — ver [[modelos-de-cobro]] para precios relativos por rubro.

## Roadmap de negocio (visión original)
1. **Fase 1 – Validación:** web + 3–5 giros + AC como ancla + generar ingresos desde ya
2. **Fase 2 – Optimización:** mejorar procesos, automatizar lo que funciona, medir repetición
3. **Fase 3 – Escala:** app mobile, pagos dentro de la plataforma, expansión de giros

Nota de brecha (2026-09-14): el código actual en [[arquitectura]] ya implementa varios elementos de Fase 2/3 (pagos con Stripe, backoffice completo, tickets de servicio con seguimiento) mientras la documentación de negocio en Notion sigue describiendo una Fase 1 muy manual (WhatsApp, liberación manual de contactos). Ver [[gap-negocio-vs-producto]].

## Estrategia de arranque (30–45 días, versión original)
- Semanas 1–2: reclutar proveedores, definir comisiones, alinear expectativas
- Semana 3: web básica, WhatsApp operativo, operación definida
- Semana 4: publicar, activar clientes existentes, pruebas reales

Costo estimado de alojamiento inicial: $1,000–$2,200 MXN/mes dependiendo del proveedor (referencia para pruebas y arranque, no para escala).

## Relacionado
- [[modelos-de-cobro]]
- [[mvp-modelo-pago-por-lead]]
- [[decision-web-vs-app]]
- [[arquitectura]]
- [[gap-negocio-vs-producto]]
