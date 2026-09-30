---
tipo: tecnico
actualizado: 2026-09-14
fuentes: [../../teresuelvo_app (código fuente)]
---

# Dominios de negocio y modelo de datos

Mapeo de los dominios de negocio identificables en el código de `teresuelvo_app` a features de negocio (ver [[vision-y-modelo-de-negocio]] y [[mvp-modelo-pago-por-lead]] para el porqué de cada uno).

## Dominios / features

| Dominio | Dónde vive | Qué resuelve |
|---|---|---|
| Auth / Users | `(public)/login`, `provider-signup` | Login, registro de proveedores, verificación por email |
| Organizations | `(panel)/organizations` | Organizaciones proveedoras, miembros, áreas de cobertura |
| Services (catálogo) | `(public)/services` | Catálogo maestro de tipos de servicio (rubros) |
| Tenders (leads) | `(panel)/provider-panel/leads`, `leads/followup`, `(public)/seguimiento` | Solicitud de cliente → oportunidad vendible a organizaciones. Es la formalización en código del "lead" de [[mvp-modelo-pago-por-lead]] |
| Service Tickets | entidades `ServiceTickets*` | Gestión del servicio ya contratado: citas, incidencias, pagos, historial de estado |
| Checkout / Payments | `(panel)/provider-panel/checkout`, `api/checkout`, `api/stripe/webhook` | Cobro vía Stripe, identificado por `processUUID` |
| Question Sets | entidades `Question*` | Formularios dinámicos para calificar leads/servicios |
| Files | `api/files`, `api/customer/files` | Adjuntos de clientes/organizaciones |

## Entidades principales (TypeORM, `src/lib/entities/`)
- **User** — usuarios de la plataforma (proveedores/staff)
- **Organization** — organización proveedora de servicios
- **OrganizationMember** — relación usuario–organización (roles)
- **OrganizationCoverageArea** — zonas geográficas de cobertura (usado en cálculos de distancia)
- **OrganizationService** — servicios que ofrece cada organización
- **Service** — catálogo maestro de tipos de servicio
- **Tender** — solicitud/lead de cliente, ofertable a organizaciones
- **TenderBuyer** — qué organización compró un tender
- **ServiceTickets** — ticket activo cuando una organización toma un tender
- **ServiceTicketAppointment** — citas agendadas dentro de un ticket
- **ServiceTicketIncidence** — incidencias durante la ejecución
- **ServiceTicketPayment** — pagos asociados a un ticket
- **ServiceTicketStatusHistory** — historial de cambios de estado
- **Question / QuestionSet / QuestionSetAnswer** — formularios dinámicos
- **File** — archivos adjuntos

## Lectura de negocio de este modelo de datos
El ciclo de vida real implementado es más rico que el MVP 100% manual descrito en Notion:

```
Cliente → Tender (lead) → TenderBuyer (organización compra) → ServiceTickets (servicio activo)
       → ServiceTicketAppointment / Incidence / Payment / StatusHistory (ejecución y cobro)
```

Esto confirma que el sistema ya modela **todo el ciclo del servicio**, no solo la venta del lead — ver la discrepancia con la documentación de negocio en [[gap-negocio-vs-producto]].

`OrganizationCoverageArea` + fórmulas de geolocalización en `README.md` indican que el matching proveedor↔cliente por zona ya está más automatizado de lo que sugiere el flujo manual original ("zona aproximada" visible al proveedor en Notion).

## Páginas de detalle por dominio
Este documento es el mapa general; para el detalle de reglas de negocio reales de cada dominio, ver:
- [[ciclo-de-vida-tender]] — estados de pago del lead, flujo de compra, qué falta (expiración, exclusividad)
- [[ciclo-de-vida-service-ticket]] — estados del ticket, appointments, incidencias, pagos internos
- [[cobertura-geografica]] — fórmula Haversine, matching por zona de cobertura
- [[roles-y-permisos]] — roles de organización, ausencia de rol de plataforma, doble sistema de sesión
- [[emails-transaccionales]] — qué evento dispara qué email
- [[infraestructura-y-config]] — variables de entorno, storage local, deploy manual

## Relacionado
- [[arquitectura]]
- [[mvp-modelo-pago-por-lead]]
- [[modelos-de-cobro]]
- [[gap-negocio-vs-producto]]
- [[exclusividad-del-lead]]
