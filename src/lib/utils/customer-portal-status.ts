import { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";

export function customerServiceStatusLabel(status: ServiceTicketStatus): string {
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

export function customerAppointmentStatusLabel(
  status: ServiceTicketAppointmentStatus,
): string {
  switch (status) {
    case ServiceTicketAppointmentStatus.SCHEDULED:
      return "Programada";
    case ServiceTicketAppointmentStatus.COMPLETED:
      return "Realizada";
    case ServiceTicketAppointmentStatus.CANCELLED:
      return "Cancelada";
    default:
      return String(status);
  }
}

export function customerServiceStatusBadgeClass(
  status: ServiceTicketStatus,
): string {
  switch (status) {
    case ServiceTicketStatus.PENDING:
      return "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/80 dark:text-amber-100 dark:border-amber-800";
    case ServiceTicketStatus.CONTACTED:
      return "bg-sky-100 text-sky-900 border-sky-200 dark:bg-sky-950/80 dark:text-sky-100 dark:border-sky-800";
    case ServiceTicketStatus.IN_PROGRESS:
      return "bg-violet-100 text-violet-900 border-violet-200 dark:bg-violet-950/80 dark:text-violet-100 dark:border-violet-800";
    case ServiceTicketStatus.QUOTED:
      return "bg-indigo-100 text-indigo-900 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-100 dark:border-indigo-800";
    case ServiceTicketStatus.COMPLETED:
      return "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-100 dark:border-emerald-800";
    case ServiceTicketStatus.CANCELLED:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function customerAppointmentStatusBadgeClass(
  status: ServiceTicketAppointmentStatus,
): string {
  switch (status) {
    case ServiceTicketAppointmentStatus.SCHEDULED:
      return "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950/80 dark:text-blue-100 dark:border-blue-800";
    case ServiceTicketAppointmentStatus.COMPLETED:
      return "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-100 dark:border-emerald-800";
    case ServiceTicketAppointmentStatus.CANCELLED:
      return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function customerAppointmentBorderClass(
  status: ServiceTicketAppointmentStatus,
): string {
  switch (status) {
    case ServiceTicketAppointmentStatus.SCHEDULED:
      return "border-l-blue-500";
    case ServiceTicketAppointmentStatus.COMPLETED:
      return "border-l-emerald-500";
    case ServiceTicketAppointmentStatus.CANCELLED:
      return "border-l-slate-400";
    default:
      return "border-l-border";
  }
}
