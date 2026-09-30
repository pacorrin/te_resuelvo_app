# Log — Segundo Cerebro Te Resuelvo

Registro cronológico de ingests, queries y lint passes. Formato: `## [YYYY-MM-DD] tipo | título`.

## [2026-09-14] setup | Creación inicial del segundo cerebro
Se creó la estructura `raw/` + `wiki/` + `CLAUDE.md` siguiendo el patrón LLM Wiki. Se ingestaron:
- 4 páginas de Notion bajo el espacio raíz "Te resuelvo" (Visualizacion del mvp, Analisis general, Modelos sugeridos de cobro, Tech Stack) → `raw/notion/`
- Arquitectura y modelo de datos de `teresuelvo_app` vía exploración de código (Next.js 16, TypeORM/MySQL, NextAuth, Stripe) → `wiki/tecnico/`

Páginas de wiki creadas: [[vision-y-modelo-de-negocio]], [[modelos-de-cobro]], [[mvp-modelo-pago-por-lead]], [[decision-web-vs-app]], [[arquitectura]], [[dominios]], [[gap-negocio-vs-producto]].

Hallazgo clave del primer pase: existe una brecha notable entre el plan de negocio documentado en Notion (MVP 100% manual, pago por lead) y lo ya implementado en código (Stripe, ciclo completo de ServiceTickets, geolocalización) — documentado en [[gap-negocio-vs-producto]] como pregunta abierta para Francisco.

No se encontraron minutas de reunión ni PRD formal de Te Resuelvo en Notion — solo existe el árbol de páginas bajo "Te resuelvo". Se identificaron y excluyeron correctamente proyectos de cliente no relacionados (Pre15na, KOVAN bajo "KRONOX DESARROLLO").

## [2026-09-15] ingest | Deep dive de lógica de negocio en código

A petición de Francisco, se profundizó en `teresuelvo_app/src/lib` (entities, services, repos) para extraer reglas de negocio reales, no solo estructura. Páginas nuevas creadas: [[ciclo-de-vida-tender]], [[ciclo-de-vida-service-ticket]], [[cobertura-geografica]], [[roles-y-permisos]], [[emails-transaccionales]], [[infraestructura-y-config]], [[exclusividad-del-lead]].

Páginas actualizadas: [[modelos-de-cobro]] (se confirmó el modelo real activo: comisión por lead vía `Service.leadPrice`, sin % de comisión), [[gap-negocio-vs-producto]] (dos de tres preguntas quedaron resueltas), [[dominios]] (enlaza ahora a las páginas de detalle por dominio).

Hallazgos clave de este pase:
- El modelo de cobro y la liberación de contacto ya están automatizados end-to-end vía Stripe — más avanzado que el plan manual original de Notion.
- **Hallazgo nuevo no anticipado:** el código no impide que un mismo Tender se venda a más de una organización (solo evita que la misma organización lo recompre). Documentado como decisión abierta en [[exclusividad-del-lead]] — requiere que Francisco decida si es bug o comportamiento intencional.
- No existe mecanismo de "lead inválido"/expiración/reposición pese a estar contemplado como riesgo en el plan de negocio original.
- Riesgos técnicos operativos detectados: storage de archivos 100% local (no apta para escalar horizontalmente), sin `.env.example`, deploy manual sin CI/CD, sin rol de plataforma/admin separado de las organizaciones.
