# Índice — Segundo Cerebro Te Resuelvo

Catálogo de todas las páginas de la wiki. Actualizar en cada ingest.

## Negocio
- [[vision-y-modelo-de-negocio]] — Tesis del negocio, principio negocio-first, rubro ancla (AC), roadmap por fases
- [[modelos-de-cobro]] — 4 modelos evaluados + cuál está realmente activo hoy (confirmado en código: comisión por lead, `Service.leadPrice`, sin %)

## Producto
- [[mvp-modelo-pago-por-lead]] — Diseño operativo del MVP original: flujos cliente/proveedor, módulos, riesgos

## Técnico
- [[arquitectura]] — Stack, capas obligatorias, estructura de carpetas de `teresuelvo_app`, docs ya existentes en el repo
- [[dominios]] — Dominios de negocio y entidades del modelo de datos (mapa general, enlaza al detalle de cada uno)
- [[ciclo-de-vida-tender]] — Estados de pago del lead, flujo de compra Stripe, qué falta (expiración, exclusividad)
- [[ciclo-de-vida-service-ticket]] — Estados del ticket, appointments vs. incidencias, pagos internos del ticket
- [[cobertura-geografica]] — Fórmula Haversine, matching Tender↔Organization por zona de cobertura
- [[roles-y-permisos]] — Roles de organización (ADMIN/MEMBER), ausencia de rol de plataforma, doble sistema de sesión
- [[emails-transaccionales]] — Qué evento de negocio dispara qué email transaccional
- [[infraestructura-y-config]] — Variables de entorno, storage 100% local (riesgo de escala), deploy manual sin CI/CD

## Decisiones
- [[decision-web-vs-app]] — Por qué el MVP es web y no app nativa (vigente)
- [[gap-negocio-vs-producto]] — Brecha entre plan de Notion y código real (parcialmente resuelto tras deep dive de código)
- [[exclusividad-del-lead]] — Hallazgo: un mismo lead puede venderse a más de una organización; ¿es intencional? (abierto)

## Procesos
_(vacío — pendiente de minutas/PRDs para documentar cómo se trabaja: ritmo de reuniones, cómo se prioriza, cómo se despliega. Ver nota de `.env.example` faltante y deploy manual en [[infraestructura-y-config]] como candidatos a formalizar aquí)_

## Personas
_(vacío — pendiente de identificar stakeholders, proveedores clave, roles)_

## Fuentes raw disponibles
- `raw/notion/te-resuelvo-home.md`
- `raw/notion/visualizacion-del-mvp.md`
- `raw/notion/analisis-general.md`
- `raw/notion/modelos-sugeridos-de-cobro.md`
- `raw/notion/tech-stack.md` (casi vacía, ver nota en el archivo)
- `raw/minutas/` — vacío, sin minutas de Te Resuelvo encontradas en Notion aún
- `raw/prd/` — vacío, sin PRD formal de Te Resuelvo encontrado en Notion aún

## Preguntas abiertas para Francisco (consolidado)
1. ¿Un lead debe ser exclusivo de la primera organización que lo compra, o se puede vender a varias? Ver [[exclusividad-del-lead]].
2. ¿Se necesita mecanismo de "lead inválido" con reposición? No existe en código hoy. Ver [[ciclo-de-vida-tender]].
3. ¿Actualizar Notion para reflejar el estado real, o esta wiki es ya la fuente de verdad de negocio? Ver [[gap-negocio-vs-producto]].

## Nota de scope
No confundir con los proyectos de cliente de Francisco bajo "KRONOX DESARROLLO" en Notion (Pre15na, KOVAN) — son proyectos distintos, no forman parte de este cerebro salvo referencia explícita.
