---
tipo: decision
actualizado: 2026-09-14
fuentes: [raw/notion/analisis-general.md]
estado: vigente
---

# Decisión: Web como MVP, no app nativa

## Contexto
Al definir cómo lanzar Te Resuelvo, existía la opción obvia de construir una app móvil como producto principal (marketplace de servicios "se siente" como app).

## Decisión
El MVP se construye como **aplicación web**, no como app móvil nativa. La app queda para Fase 3 del roadmap (ver [[vision-y-modelo-de-negocio]]).

## Por qué
Argumento financiero explícito (comparación original):

| Aspecto | App | Web |
|---|---|---|
| Inversión inicial | Alta | Baja |
| Tiempo a mercado | Lento | Rápido |
| Riesgo | Alto | Bajo |
| Flexibilidad | Baja | Alta |
| Retorno temprano | No | Sí |

Razones adicionales:
- El cliente final quiere una solución a su problema, no instalar una app.
- WhatsApp ya es el canal de comunicación real con clientes y proveedores — la web solo necesita complementarlo, no reemplazarlo.
- La web permite validar demanda real y ajustar precio/oferta rápido sin fricción de app store.
- Conclusión explícita del análisis: "la app no reduce riesgo, lo aumenta en esta etapa".

## Alternativas consideradas
- App nativa como producto principal desde el día 1 — descartada por costo, tiempo a mercado y riesgo.

## Estado
Vigente. El código en `teresuelvo_app` confirma esta decisión: es una app Next.js (web), sin componente móvil nativo — ver [[arquitectura]].

## Relacionado
- [[vision-y-modelo-de-negocio]]
- [[mvp-modelo-pago-por-lead]]
