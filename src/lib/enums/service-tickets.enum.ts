export enum ServiceTicketStatus {
  PENDING = 1,
  CONTACTED = 2,
  IN_PROGRESS = 3,
  QUOTED = 4,
  COMPLETED = 5,
  CANCELLED = 6,
}

export enum ServiceTicketIncidenceType {
  NOTA = 1,
  PROBLEMA = 2,
  RETRASO = 3,
  CANCELACION = 4,
}

export enum ServiceTicketPaymentBalanceType {
  /** ABONO / payment toward balance */
  CREDIT = 1,
  /** CARGO / charge */
  DEBIT = 2,
}

export enum ServiceTicketStatusHistoryEventType {
  FIRST_CONTACT = 1,
  VISIT_SCHEDULED = 2,
  VISIT_COMPLETED = 3,
  QUOTE_SENT = 4,
  WORK_IN_PROGRESS = 5,
  WORK_COMPLETED = 6,
  WORK_CANCELLED = 7,
}