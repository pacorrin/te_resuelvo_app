"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDownIcon, Loader2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { Textarea } from "@/src/components/ui/textarea";
import {
  _completeServiceTicketAppointment,
  _createServiceTicketAppointment,
  _deleteServiceTicketAppointment,
} from "@/src/lib/actions/service-ticket-appointments.actions";
import type { ServiceTicketAppointmentDTO } from "@/src/lib/dtos/ServiceTicketAppointment.dto";
import type { OrganizationMemberDTO } from "@/src/lib/dtos/OrganizationMembers.dto";
import { toastError, toastSuccess } from "@/src/lib/utils";

import {
  applyScheduledAtToForm,
  HOURS_12,
  type Meridiem,
  MINUTES,
  state12ToHHmm,
  toAppointmentUtcIso,
} from "./appointment-form.utils";
import { FollowUpAppointmentListItem } from "./FollowUpAppointmentListItem";

function memberAttendeeLabel(member: OrganizationMemberDTO): string {
  const name = member.user?.name?.trim();
  if (name) return name;
  return member.userEmail;
}

type FollowUpAppointmentsModalProps = {
  ticketId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointments: ServiceTicketAppointmentDTO[];
  organizationMembers: OrganizationMemberDTO[];
  disabled?: boolean;
  defaultAttendingUserId?: string;
  firstAppointmentId?: number | null;
  onFirstAppointmentCompleted?: () => void;
};

export function FollowUpAppointmentsModal({
  ticketId,
  open,
  onOpenChange,
  appointments,
  organizationMembers,
  disabled = false,
  defaultAttendingUserId = "",
  firstAppointmentId = null,
  onFirstAppointmentCompleted,
}: FollowUpAppointmentsModalProps) {
  const router = useRouter();
  const membersWithUser = organizationMembers.filter(
    (m): m is OrganizationMemberDTO & { userId: number } =>
      m.userId != null && Number.isFinite(m.userId),
  );

  const emptyForm = applyScheduledAtToForm(null);
  const [description, setDescription] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    emptyForm.date,
  );
  const [hour12, setHour12] = useState(emptyForm.hour12);
  const [minute, setMinute] = useState(emptyForm.minute);
  const [meridiem, setMeridiem] = useState<Meridiem>(emptyForm.meridiem);
  const [attendingUserId, setAttendingUserId] = useState(
    defaultAttendingUserId,
  );
  const [saving, setSaving] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const resetForm = () => {
    const next = applyScheduledAtToForm(null);
    setDescription("");
    setSelectedDate(next.date);
    setHour12(next.hour12);
    setMinute(next.minute);
    setMeridiem(next.meridiem);
    setAttendingUserId(defaultAttendingUserId);
    setPickerOpen(false);
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens
  }, [open, defaultAttendingUserId]);

  const handleCreate = async () => {
    if (!selectedDate) {
      toastError("Selecciona fecha y hora válidas.");
      return;
    }
    const hhmm = state12ToHHmm(hour12, minute, meridiem);
    if (hhmm == null) {
      toastError("Selecciona fecha y hora válidas.");
      return;
    }
    const iso = toAppointmentUtcIso(selectedDate, hhmm);
    if (iso == null) {
      toastError("Selecciona fecha y hora válidas.");
      return;
    }
    const trimmed = description.trim();
    if (!trimmed) {
      toastError("Escribe una descripción para la cita.");
      return;
    }
    const attendeeId = Number(attendingUserId);
    if (!Number.isFinite(attendeeId) || attendeeId <= 0) {
      toastError("Selecciona quién atenderá la cita.");
      return;
    }

    setSaving(true);
    try {
      const result = await _createServiceTicketAppointment(ticketId, {
        description: trimmed,
        scheduledAt: iso,
        attendingUserId: attendeeId,
      });
      if (result.success) {
        toastSuccess("Cita agregada.");
        resetForm();
        router.refresh();
      } else {
        toastError(result.error ?? "No se pudo agregar la cita.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (appointmentId: number) => {
    setCompletingId(appointmentId);
    try {
      const result = await _completeServiceTicketAppointment(
        ticketId,
        appointmentId,
      );
      if (result.success) {
        if (
          firstAppointmentId != null &&
          appointmentId === firstAppointmentId
        ) {
          onFirstAppointmentCompleted?.();
        }
        toastSuccess("Cita marcada como realizada.");
        router.refresh();
      } else {
        toastError(result.error ?? "No se pudo marcar la cita como realizada.");
      }
    } finally {
      setCompletingId(null);
    }
  };

  const handleDelete = async (appointmentId: number) => {
    setDeletingId(appointmentId);
    try {
      const result = await _deleteServiceTicketAppointment(
        ticketId,
        appointmentId,
      );
      if (result.success) {
        toastSuccess("Cita eliminada.");
        router.refresh();
      } else {
        toastError(result.error ?? "No se pudo eliminar la cita.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const ta = new Date(a.scheduledAt).getTime();
    const tb = new Date(b.scheduledAt).getTime();
    if (ta !== tb) return ta - tb;
    return a.id - b.id;
  });

  const sortedFirstAppointmentId = sortedAppointments[0]?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Citas del servicio</DialogTitle>
          <DialogDescription>
            Agenda visitas adicionales y consulta el historial abajo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="modal-appointment-description">
              Descripción
            </FieldLabel>
            <Textarea
              id="modal-appointment-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Visita para realizar el servicio"
              disabled={disabled || saving}
              rows={2}
            />
          </Field>

          <FieldGroup className="flex-col gap-4 @sm/field-group:flex-row @sm/field-group:items-end">
            <Field className="min-w-0 flex-1">
              <FieldLabel htmlFor="modal-appointment-date">Fecha</FieldLabel>
              <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    id="modal-appointment-date"
                    disabled={disabled || saving}
                    className="w-full justify-between font-normal"
                  >
                    {selectedDate
                      ? format(selectedDate, "PPP", { locale: es })
                      : "Seleccionar fecha"}
                    <ChevronDownIcon className="size-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    defaultMonth={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setPickerOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Field className="min-w-0 flex-1 @sm/field-group:w-auto @sm/field-group:max-w-none">
              <FieldLabel htmlFor="modal-appointment-hour">Hora</FieldLabel>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={hour12}
                  onValueChange={setHour12}
                  disabled={disabled || saving}
                >
                  <SelectTrigger
                    id="modal-appointment-hour"
                    className="w-[4.25rem]"
                    aria-label="Hora (1–12)"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {HOURS_12.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={minute}
                  onValueChange={setMinute}
                  disabled={disabled || saving}
                >
                  <SelectTrigger
                    id="modal-appointment-minute"
                    className="w-[4.25rem]"
                    aria-label="Minutos"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-60">
                    {MINUTES.map((mm) => (
                      <SelectItem key={mm} value={mm}>
                        {mm}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={meridiem}
                  onValueChange={(v) => setMeridiem(v as Meridiem)}
                  disabled={disabled || saving}
                >
                  <SelectTrigger
                    id="modal-appointment-meridiem"
                    className="w-[5.5rem]"
                    aria-label="a. m. o p. m."
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="am">a. m.</SelectItem>
                    <SelectItem value="pm">p. m.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="modal-attending-member">
              Miembro que atiende
            </FieldLabel>
            <Select
              value={attendingUserId}
              onValueChange={setAttendingUserId}
              disabled={disabled || saving}
            >
              <SelectTrigger id="modal-attending-member" className="w-full">
                <SelectValue placeholder="Seleccionar miembro" />
              </SelectTrigger>
              <SelectContent position="popper">
                {membersWithUser.map((m) => (
                  <SelectItem key={m.userId} value={String(m.userId)}>
                    {memberAttendeeLabel(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cerrar
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={
                disabled ||
                saving ||
                completingId != null ||
                appointments.length === 0
              }
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                "Guardar cita"
              )}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium">Historial de citas</p>
          {sortedAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Aún no hay citas registradas.
            </p>
          ) : (
            <ul className="space-y-2">
              {sortedAppointments.map((appt, index) => (
                <FollowUpAppointmentListItem
                  key={appt.id}
                  appointment={appt}
                  label={
                    index === 0 ? "Primera visita" : `Visita ${index + 1}`
                  }
                  disabled={disabled}
                  completingId={completingId}
                  deletingId={deletingId}
                  canDelete={appt.id !== sortedFirstAppointmentId}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
