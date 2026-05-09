export enum ServiceTicketStatus {
  PENDING = 1,
  CONTACTED = 2,
  IN_PROGRESS = 3,
  QUOTED = 4,
  COMPLETED = 5,
  CANCELLED = 6,
}

/** `service_tickets_incidences.tick_type` (smallint). */
export enum ServiceTicketIncidenceType {
  NOTA = 1,
  PROBLEMA = 2,
  RETRASO = 3,
  CANCELACION = 4,
}