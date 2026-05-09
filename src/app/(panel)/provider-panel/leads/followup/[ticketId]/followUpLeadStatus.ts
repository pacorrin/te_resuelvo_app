import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";

export function getLeadFollowUpStatusLabel(status: ServiceTicketStatus): string {
  switch (status) {
    case ServiceTicketStatus.PENDING:
      return "Pendiente";
    case ServiceTicketStatus.CONTACTED:
      return "Contactado";
    case ServiceTicketStatus.IN_PROGRESS:
      return "En progreso";
    case ServiceTicketStatus.QUOTED:
      return "Cotizado";
    case ServiceTicketStatus.COMPLETED:
      return "Completado";
    case ServiceTicketStatus.CANCELLED:
      return "Cancelado";
    default:
      return String(status);
  }
}

/** Tailwind background class for the header badge. */
export function getLeadFollowUpStatusBadgeClass(status: ServiceTicketStatus): string {
  switch (status) {
    case ServiceTicketStatus.CONTACTED:
      return "bg-blue-600";
    case ServiceTicketStatus.IN_PROGRESS:
      return "bg-yellow-600";
    case ServiceTicketStatus.QUOTED:
      return "bg-purple-600";
    case ServiceTicketStatus.COMPLETED:
      return "bg-green-600";
    case ServiceTicketStatus.CANCELLED:
      return "bg-red-600";
    default:
      return "bg-primary";
  }
}
