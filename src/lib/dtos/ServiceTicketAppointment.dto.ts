import type { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";

export interface ServiceTicketAppointmentDTO {
  id: number;
  ticketId: number;
  description: string;
  scheduledAt: Date;
  attendingUserId: number;
  attendingUserName: string | null;
  status: ServiceTicketAppointmentStatus;
  createdAt: Date;
}

export interface CreateServiceTicketAppointmentInput {
  description: string;
  scheduledAt: string;
  attendingUserId: number;
  status?: ServiceTicketAppointmentStatus;
}
