---
tipo: tecnico
actualizado: 2026-09-14
fuentes: [../../teresuelvo_app/src/lib (OrganizationMember, auth.config.ts, proxy.ts, customer-tender-session.ts)]
---

# Roles y permisos

## Roles a nivel organización — `OrganizationMemberRoles`
| Valor | Rol |
|---|---|
| 1 | ADMIN |
| 2 | MEMBER |

No se encontraron checks granulares tipo "solo ADMIN puede X" en los services explorados — el enum existe para soportarlo pero la diferenciación de permisos entre ADMIN y MEMBER parece estar sin implementar completamente, o vive en la capa de UI/actions no revisada en detalle. **Punto a verificar antes de asumir que hay control de acceso real por rol dentro de una organización.**

## No existe rol de plataforma (super-admin / staff interno)
No hay enum ni lógica de "admin de Te Resuelvo" separado de las organizaciones proveedoras. Esto es relevante porque [[mvp-modelo-pago-por-lead]] describe un "backoffice mínimo" operado por Francisco/equipo (crear proveedores, marcar pagado, liberar contacto) — ese backoffice, si existe hoy, no está protegido por un rol de plataforma explícito en el código revisado. Confirmar cómo se gestiona el acceso operativo interno.

## Dos sistemas de sesión distintos (no un solo login)
1. **NextAuth** (`auth.config.ts` + `proxy.ts`) — protege `/provider-panel` (el backoffice de proveedores/organizaciones). Solo distingue logueado vs. no logueado a nivel de middleware.
2. **Sesión de cliente separada** (`customer-tender-session.ts`, secreto propio `CUSTOMER_TENDER_SESSION_SECRET`) — protege el portal de seguimiento del cliente final (`/seguimiento`), sin cuenta formal: se entra con el `customerAccessCode` de 6 dígitos del Tender (ver [[ciclo-de-vida-tender]]), no con NextAuth.

Esta separación es coherente con el principio de [[mvp-modelo-pago-por-lead]] de "sin registro de clientes finales" — el cliente nunca tiene cuenta, solo un código de acceso temporal.

## Relacionado
- [[dominios]]
- [[arquitectura]]
- [[ciclo-de-vida-tender]]
