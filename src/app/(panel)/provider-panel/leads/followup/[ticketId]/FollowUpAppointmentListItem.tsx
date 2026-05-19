"use client";

import { CheckCircle2, Loader2, Trash2 } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import type { ServiceTicketAppointmentDTO } from "@/src/lib/dtos/ServiceTicketAppointment.dto";
import { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";

import { formatAppointmentWhen } from "./appointment-form.utils";

function appointmentStatusLabel(
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
      return "—";
  }
}

function appointmentStatusVariant(
  status: ServiceTicketAppointmentStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case ServiceTicketAppointmentStatus.SCHEDULED:
      return "default";
    case ServiceTicketAppointmentStatus.COMPLETED:
      return "secondary";
    case ServiceTicketAppointmentStatus.CANCELLED:
      return "outline";
    default:
      return "outline";
  }
}

type FollowUpAppointmentListItemProps = {
  appointment: ServiceTicketAppointmentDTO;
  label: string;
  disabled?: boolean;
  completingId: number | null;
  deletingId: number | null;
  canDelete?: boolean;
  onComplete: (appointmentId: number) => void;
  onDelete?: (appointmentId: number) => void;
};

export function FollowUpAppointmentListItem({
  appointment,
  label,
  disabled = false,
  completingId,
  deletingId,
  canDelete = false,
  onComplete,
  onDelete,
}: FollowUpAppointmentListItemProps) {
  const isScheduled =
    appointment.status === ServiceTicketAppointmentStatus.SCHEDULED;
  const isBusy =
    completingId === appointment.id || deletingId === appointment.id;

  return (
    <li className="rounded-lg border border-border/80 bg-muted/35 px-4 py-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1.5 w-full">
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <Badge variant={appointmentStatusVariant(appointment.status)}>
              {appointmentStatusLabel(appointment.status)}
            </Badge>
          </div>
          <p className="font-medium leading-snug">{appointment.description}</p>
          <p className="text-muted-foreground tabular-nums">
            {formatAppointmentWhen(appointment.scheduledAt)}
          </p>
          {appointment.attendingUserName ? (
            <p className="text-muted-foreground text-xs">
              Atiende: {appointment.attendingUserName}
            </p>
          ) : null}
          {!disabled ? (
          <div className="flex shrink-0 flex-col gap-1 w-full">
            {isScheduled ? (
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-8 whitespace-nowrap w-full"
                disabled={isBusy || deletingId != null}
                onClick={() => onComplete(appointment.id)}
              >
                {completingId === appointment.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    Marcar cita
                  </>
                )}
              </Button>
            ) : null}
            {canDelete && onDelete && isScheduled ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                aria-label="Eliminar cita"
                disabled={isBusy || completingId != null}
                onClick={() => onDelete(appointment.id)}
              >
                {deletingId === appointment.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            ) : null}
          </div>
        ) : null}
        </div>
      </div>
    </li>
  );
}
