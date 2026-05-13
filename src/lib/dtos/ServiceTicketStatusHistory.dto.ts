import type {
  ServiceTicketStatus,
  ServiceTicketStatusHistoryEventType,
} from "@/src/lib/enums/service-tickets.enum";

export interface ServiceTicketStatusHistoryDTO {
  id: number;
  ticketId: number;
  status: ServiceTicketStatus;
  eventType: ServiceTicketStatusHistoryEventType | null;
  changedBy: number;
  createdAt: Date;
}

export interface SearchServiceTicketStatusHistory {
  id?: number;
  ticketId?: number;
  status?: ServiceTicketStatus;
  eventType?: ServiceTicketStatusHistoryEventType;
  changedBy?: number;
}

export interface CreateServiceTicketStatusHistoryInput {
  ticketId: number;
  status: ServiceTicketStatus;
  changedBy: number;
  eventType?: ServiceTicketStatusHistoryEventType | null;
}


export interface DeleteServiceTicketStatusHistoryInput {
  ticketId: number;
  eventType: ServiceTicketStatusHistoryEventType;
}