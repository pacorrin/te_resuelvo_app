import type { ServiceTicketIncidenceType } from "@/src/lib/enums/service-tickets.enum";

export interface SearchServiceTicketIncidence {
  id?: number;
  ticketId?: number;
}

export interface CreateServiceTicketIncidenceInput {
  ticketId: number;
  type: ServiceTicketIncidenceType;
  description: string;
}
