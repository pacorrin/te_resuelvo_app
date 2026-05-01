export function getLeadFollowUpStatusLabel(status: string): string {
  switch (status) {
    case "contacted":
      return "Contactado";
    case "in-progress":
      return "En progreso";
    case "quoted":
      return "Cotizado";
    case "completed":
      return "Completado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

/** Tailwind background class for the header badge. */
export function getLeadFollowUpStatusBadgeClass(status: string): string {
  switch (status) {
    case "contacted":
      return "bg-blue-600";
    case "in-progress":
      return "bg-yellow-600";
    case "quoted":
      return "bg-purple-600";
    case "completed":
      return "bg-green-600";
    case "cancelled":
      return "bg-red-600";
    default:
      return "bg-muted";
  }
}
