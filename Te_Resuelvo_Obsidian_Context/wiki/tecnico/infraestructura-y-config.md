---
tipo: tecnico
actualizado: 2026-09-14
fuentes: [../../teresuelvo_app/.env, src/lib/storage]
---

# Infraestructura y configuración

## Variables de entorno requeridas (no hay `.env.example` en el repo — riesgo de onboarding)
- Auth: `AUTH_SECRET` / `NEXTAUTH_SECRET`
- Sesión de cliente: `CUSTOMER_TENDER_SESSION_SECRET` (separado de NextAuth, ver [[roles-y-permisos]])
- DB: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- Mapas: `NEXT_PUBLIC_MAPBOX_TOKEN`
- Stripe: `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_FROM_NAME`
- App: `NEXT_PUBLIC_APP_URL`

**Recomendación de proceso:** crear `.env.example` documentado — ahora mismo el conocimiento de qué variables existen vive solo en el código, riesgo si alguien más se suma al proyecto. Ver [[procesos]].

## Storage de archivos — 100% local, sin nube
`src/lib/storage/local-storage.service.ts` guarda archivos en `storage/<folder>/` dentro del propio proyecto, con nombre randomizado (`crypto.randomUUID()` + extensión sanitizada). Metadata (`category`, `ownerType`, `ownerId`) se registra en la tabla de archivos vía `FileService`.

**Riesgo operativo real:** no hay integración con S3/GCS/almacenamiento externo. Esto es incompatible con:
- Múltiples instancias del servidor (no hay filesystem compartido)
- Contenedores efímeros (Docker sin volumen persistente perdería los archivos)
- Cualquier plan de escalar horizontalmente (ver Fase 3 en [[vision-y-modelo-de-negocio]])

Si se planea escalar infraestructura, migrar storage a algo como S3-compatible debería ser prioritario antes que otras optimizaciones.

## Deploy actual
Build standalone de Next.js, empaquetado manual (zip) y subido a hosting tipo Hostinger. **Sin CI/CD, sin Vercel.** Cada deploy es un proceso manual — ver [[arquitectura]] para el detalle técnico y considerar documentar el proceso paso a paso en [[procesos]] si se repite seguido.

## Jobs / cron
No se encontraron scripts programados ni colas de trabajo — todo el procesamiento (emails, creación de tickets) es síncrono dentro del request/webhook que lo dispara. No hay reintentos automáticos si un email falla, por ejemplo.

## Relacionado
- [[arquitectura]]
- [[emails-transaccionales]]
