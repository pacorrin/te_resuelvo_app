---
tipo: tecnico
actualizado: 2026-09-14
fuentes: [../../teresuelvo_app/src/lib (OrganizationCoverageArea, Tender.repo.ts, TenderService)]
---

# Cobertura geográfica y matching Tender↔Organization

## Modelo de datos
`OrganizationCoverageArea` — cada organización puede tener **múltiples zonas de cobertura**, cada una un círculo: `latitude`, `longitude`, `radiusKm` (decimal 5,2), `name`/`address` opcional.

## Fórmula de matching
Se usa **Haversine en SQL puro** (no PostGIS ni tipos espaciales nativos de MySQL), en `Tender.repo.ts`:

```
6371 * ACOS(LEAST(1, GREATEST(-1,
  COS(RADIANS(lat)) * COS(RADIANS(tend_lat)) * COS(RADIANS(tend_lng) - RADIANS(lng))
  + SIN(RADIANS(lat)) * SIN(RADIANS(tend_lat))
)))
```
(6371 = radio de la Tierra en km)

`TenderService.getTendersForOrganizationCoverage` toma todas las zonas de cobertura de la organización y llama a `findWithinAnyCoverageDisk`, que arma un `OR` de "distancia ≤ radio" por cada disco de cobertura de esa organización.

## Filtros adicionales del matching (además de distancia)
Cuando se filtra por organización, el query exige (vía `EXISTS`):
1. Que exista relación en `organization_services` — la organización ofrece ese tipo de servicio.
2. Que **no** exista ya un `TenderBuyer` PAID de esa misma organización para ese tender (evita comprar el mismo lead dos veces desde la misma organización — pero no bloquea que otras organizaciones también lo compren, ver [[ciclo-de-vida-tender]]).

## Búsqueda genérica por cercanía
`findAllNearbyByCoordinates` (no ligado a coverage areas): radio por defecto **50 km** (`DEFAULT_NEARBY_RADIUS_KM`), distinto del radio configurable por zona de cobertura de cada organización.

## Nota técnica de riesgo
`latitude`/`longitude` de `Tender` están guardadas como `varchar`, no como tipo numérico/geo — cualquier feature nueva que dependa de cálculos geográficos debe castear/validar el formato en vez de asumir tipo numérico limpio.

## Relacionado
- [[dominios]]
- [[ciclo-de-vida-tender]]
