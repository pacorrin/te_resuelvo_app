import type { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";
import type { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";

export interface CustomerTenderQuestionAnswerDTO {
  questionText: string;
  answer: string;
}

export interface CustomerTenderRequestDTO {
  requestNumber: string;
  serviceName: string;
  description: string;
  requestDate: string;
  personName: string;
  personPhone: string;
  email: string;
  address: string;
  addressReference: string | null;
  zipcode: string;
  questionAnswers: CustomerTenderQuestionAnswerDTO[];
}

export interface CustomerQuoteFileDTO {
  id: number;
  originalName: string;
  mimeType: string;
  createdAt: string;
}

export interface CustomerAppointmentDTO {
  scheduledAt: string;
  status: ServiceTicketAppointmentStatus;
  statusLabel: string;
  description: string;
}

export interface CustomerProviderProgressDTO {
  organizationName: string;
  contactEmail: string;
  phone: string;
  status: ServiceTicketStatus;
  statusLabel: string;
  appointments: CustomerAppointmentDTO[];
  quotes: CustomerQuoteFileDTO[];
}

export interface CustomerTenderOverviewDTO {
  request: CustomerTenderRequestDTO;
  providers: CustomerProviderProgressDTO[];
}

export interface CustomerTenderAccessResultDTO {
  requestNumber: string;
}

export interface CustomerTenderOptionDTO {
  tenderId: number;
  requestNumber: string;
  serviceName: string;
  createdAt: string;
}
