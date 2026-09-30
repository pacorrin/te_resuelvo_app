---
tipo: tecnico
actualizado: 2026-09-14
fuentes: [../../teresuelvo_app (código fuente), teresuelvo_app/docs/ai/architecture.md, teresuelvo_app/.cursorrules]
---

# Arquitectura técnica — teresuelvo_app

## Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript estricto
- **ORM / DB:** TypeORM 0.3 sobre MySQL (`mysql2`), config en `src/typeorm.config.ts`, `synchronize: false` (todo por migraciones en `src/migrations`)
- **Auth:** NextAuth v5 beta, Credentials provider (`src/lib/auth/`), protección de rutas vía `src/proxy.ts`
- **Pagos:** Stripe (checkout embebido) + webhook en `src/app/api/stripe/webhook`
- **Emails:** React Email + Nodemailer (`src/emails`), fallback a consola en dev sin `SMTP_HOST`
- **UI:** Tailwind CSS 4 + Radix primitives (`src/components/ui`)
- **Estado cliente:** Zustand
- **Validación:** Zod
- **DB local dev:** `docker/mysql-compose.yml`
- **Deploy:** build standalone de Next, empaquetado manual (zip) a hosting tipo Hostinger — **sin CI/CD ni Vercel configurado**
- **Package manager:** pnpm

## Flujo de capas (obligatorio por convención)
```
UI (app/) → Server Action (lib/actions/) → Service (lib/services/) → Repository (lib/repositories/) → TypeORM (lib/entities/)
```
Reglas duras documentadas en `.cursorrules` y `docs/ai/architecture.md`:
- Las Server Actions **no pueden** importar repositorios ni TypeORM directamente.
- Los repositorios **no pueden** importar servicios.
- No se usan patrones enterprise no adoptados (DI, CQRS, use cases) — mantener el patrón simple existente.

Esto es importante para [[gap-negocio-vs-producto]]: cualquier feature nueva sugerida por IA debe respetar este flujo o rompe la convención del repo.

## Estructura de `src/`
- `app/` — rutas App Router, agrupadas en `(panel)` (backoffice/proveedores) y `(public)` (sitio público/cliente), más `api/` (checkout, stripe webhook, files)
- `components/` — `ui/` (primitivas Radix) y `providers/` (context)
- `lib/` — núcleo de negocio: `actions/`, `services/`, `repositories/`, `entities/`, `dtos/`, `enums/`, `auth/`, `db/`, `storage/`, `stores/`, `utils/`, `config/`
- `emails/` — plantillas React Email
- `migrations/` — historial de esquema

## Documentación ya existente en el repo (no duplicar, referenciar)
- `README.md` — setup, comandos TypeORM, fórmulas SQL de geolocalización, proceso de build/deploy manual
- `.cursorrules` — reglas para asistentes IA sobre arquitectura y ubicación de archivos
- `docs/ai/architecture.md` — arquitectura reverse-engineered del estado real del repo
- `docs/ai/coding-rules.md` — convenciones de estilo de código
- `docs/ai/business-rules.md` — define el producto: plataforma intermediaria que genera y vende tenders (leads) a organizaciones; explícitamente **NO** es proveedor directo, ni marketplace freelance, ni subastas en tiempo real
- `docs/ai/examples/*` y `docs/ai/templates/*` — plantillas por capa para que la IA replique el patrón exacto
- `docs/ai/prompts/*` — prompts predefinidos para crear/revisar/refactorizar features con IA
- `improve_ia_code_generation_plan.md` — origen del sistema `docs/ai`, plan para mejorar consistencia generando código con IA (Cursor)

Cuando Francisco pida generar una feature con IA, **usar primero los templates/prompts de `docs/ai/`** — ya están diseñados para eso; esta wiki aporta el contexto de negocio que esos templates no tienen.

## Relacionado
- [[dominios]]
- [[vision-y-modelo-de-negocio]]
- [[gap-negocio-vs-producto]]
