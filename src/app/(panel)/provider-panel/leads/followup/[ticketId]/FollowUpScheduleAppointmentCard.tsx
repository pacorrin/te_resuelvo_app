"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarClock,
  CalendarDays,
  ChevronDownIcon,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
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
import { Textarea } from "@/src/components/ui/textarea";
import { _scheduleServiceAppointment } from "@/src/lib/actions/service-tickets.actions";
import {
  _completeServiceTicketAppointment,
  _createServiceTicketAppointment,
} from "@/src/lib/actions/service-ticket-appointments.actions";
import type { ServiceTicketAppointmentDTO } from "@/src/lib/dtos/ServiceTicketAppointment.dto";
import type { OrganizationMemberDTO } from "@/src/lib/dtos/OrganizationMembers.dto";
import { ServiceTicketAppointmentStatus } from "@/src/lib/enums/service-ticket-appointment.enum";
import { ServiceTicketStatus } from "@/src/lib/enums/service-tickets.enum";
import { toastError, toastSuccess } from "@/src/lib/utils";
import { useUser } from "@/src/components/providers/UserProvider";

import { FollowUpAppointmentListItem } from "./FollowUpAppointmentListItem";
import { FollowUpAppointmentsModal } from "./FollowUpAppointmentsModal";
import {
  applyScheduledAtToForm,
  hasScheduledBackendValue,
  HOURS_12,
  type Meridiem,
  meridiemLabel,
  MINUTES,
  scheduledAtKey,
  state12ToHHmm,
  toAppointmentUtcIso,
} from "./appointment-form.utils";
import { useFollowUpTicketStatus } from "./FollowUpTicketStatus";

type FollowUpScheduleAppointmentCardProps = {
  ticketId: number;
  organizationId: number;
  initialAppointments: ServiceTicketAppointmentDTO[];
  organizationMembers: OrganizationMemberDTO[];
  initialScheduledAt: Date | string | null;
  initialVisitCompleted: boolean;
};

function memberAttendeeLabel(member: OrganizationMemberDTO): string {
  const name = member.user?.name?.trim();
  if (name) return name;
  return member.userEmail;
}

function isActiveAppointment(appt: ServiceTicketAppointmentDTO): boolean {
  return appt.status === ServiceTicketAppointmentStatus.SCHEDULED;
}

export default function FollowUpScheduleAppointmentCard({
  ticketId,
  organizationId: _organizationId,
  initialAppointments,
  organizationMembers,
  initialScheduledAt,
  initialVisitCompleted,
}: FollowUpScheduleAppointmentCardProps) {
  const router = useRouter();
  const sessionUser = useUser();
  const { status: ticketStatus } = useFollowUpTicketStatus();
  const membersWithUser = organizationMembers.filter(
    (m): m is OrganizationMemberDTO & { userId: number } =>
      m.userId != null && Number.isFinite(m.userId),
  );
  const schedulingLockedByTicketStatus =
    ticketStatus === ServiceTicketStatus.COMPLETED ||
    ticketStatus === ServiceTicketStatus.CANCELLED;
  const formDisabled = schedulingLockedByTicketStatus;

  const firstAppointment = initialAppointments[0] ?? null;
  const activeAppointments = initialAppointments.filter(isActiveAppointment);
  const hasFirstAppointment = firstAppointment != null;

  const primarySource =
    activeAppointments[0]?.scheduledAt ??
    firstAppointment?.scheduledAt ??
    initialScheduledAt;

  const initialForm = applyScheduledAtToForm(primarySource);
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(
    () => !hasFirstAppointment && initialForm.date == null,
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialForm.date,
  );
  const [hour12, setHour12] = useState(initialForm.hour12);
  const [minute, setMinute] = useState(initialForm.minute);
  const [meridiem, setMeridiem] = useState<Meridiem>(initialForm.meridiem);
  const [saving, setSaving] = useState(false);
  const [visitCompleted, setVisitCompleted] = useState(initialVisitCompleted);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [appointmentDescription, setAppointmentDescription] = useState("");
  const [attendingUserId, setAttendingUserId] = useState<string>(() =>
    sessionUser?.id != null ? String(sessionUser.id) : "",
  );

  const serverHasAppointment =
    hasFirstAppointment || hasScheduledBackendValue(initialScheduledAt);
  const isEditingRef = useRef(isEditing);
  isEditingRef.current = isEditing;
  const initialKey = scheduledAtKey(initialScheduledAt);

  useEffect(() => {
    setVisitCompleted(initialVisitCompleted);
  }, [initialVisitCompleted]);

  useEffect(() => {
    if (isEditingRef.current) return;
    const next = applyScheduledAtToForm(
      firstAppointment?.scheduledAt ?? initialScheduledAt,
    );
    setSelectedDate(next.date);
    setHour12(next.hour12);
    setMinute(next.minute);
    setMeridiem(next.meridiem);
    if (!hasFirstAppointment && next.date == null) {
      setIsEditing(true);
    }
  }, [
    initialKey,
    initialScheduledAt,
    firstAppointment?.scheduledAt,
    hasFirstAppointment,
  ]);

  const handleCompleteAppointment = async (appointmentId: number) => {
    setCompletingId(appointmentId);
    try {
      const result = await _completeServiceTicketAppointment(
        ticketId,
        appointmentId,
      );
      if (result.success) {
        if (appointmentId === firstAppointment?.id) {
          setVisitCompleted(true);
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

  const buildIsoFromPicker = (): string | null => {
    if (!selectedDate) return null;
    const hhmm = state12ToHHmm(hour12, minute, meridiem);
    if (hhmm == null) return null;
    return toAppointmentUtcIso(selectedDate, hhmm);
  };

  const handleSave = async () => {
    const iso = buildIsoFromPicker();
    if (iso == null) {
      toastError("Selecciona fecha y hora válidas.");
      return;
    }

    const attendeeId = Number(attendingUserId);
    if (!Number.isFinite(attendeeId) || attendeeId <= 0) {
      toastError("Selecciona quién atenderá la cita.");
      return;
    }

    setSaving(true);
    try {
      if (!hasFirstAppointment) {
        const description =
          appointmentDescription.trim() || "Primera visita";
        const result = await _createServiceTicketAppointment(ticketId, {
          description,
          scheduledAt: iso,
          attendingUserId: attendeeId,
        });
        if (result.success && result.data) {
          toastSuccess("Primera visita guardada.");
          setIsEditing(false);
          setAppointmentDescription("");
          router.refresh();
        } else {
          toastError(result.error ?? "No se pudo guardar la cita.");
        }
      } else {
        const result = await _scheduleServiceAppointment(ticketId, iso);
        if (result.success) {
          toastSuccess("Primera visita actualizada.");
          setIsEditing(false);
          router.refresh();
        } else {
          toastError(result.error ?? "No se pudo actualizar la cita.");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancelReschedule = () => {
    const next = applyScheduledAtToForm(
      firstAppointment?.scheduledAt ?? initialScheduledAt,
    );
    setSelectedDate(next.date);
    setHour12(next.hour12);
    setMinute(next.minute);
    setMeridiem(next.meridiem);
    setPickerOpen(false);
    setIsEditing(false);
  };

  const handleClear = async () => {
    setSaving(true);
    try {
      const result = await _scheduleServiceAppointment(ticketId, null);
      if (result.success) {
        setSelectedDate(undefined);
        setHour12("9");
        setMinute("00");
        setMeridiem("am");
        setIsEditing(true);
        toastSuccess("Citas eliminadas.");
        router.refresh();
      } else {
        toastError(
          result.error ?? "No se pudo quitar la cita del servicio.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const canClear = selectedDate != null || serverHasAppointment;
  const showReadOnly = !isEditing && selectedDate != null && hasFirstAppointment;

  const renderMemberSelect = (disabled: boolean) => (
    <Field className="min-w-0">
      <FieldLabel htmlFor="attending-member">Miembro que atiende</FieldLabel>
      <Select
        value={attendingUserId}
        onValueChange={setAttendingUserId}
        disabled={disabled}
      >
        <SelectTrigger id="attending-member" className="w-full">
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
  );

  const renderDateTimeFields = (disabled: boolean) => (
    <FieldGroup className="flex-col gap-4 @sm/field-group:flex-row @sm/field-group:items-end">
      <Field className="min-w-0 flex-1">
        <FieldLabel htmlFor="service-appointment-date">Fecha</FieldLabel>
        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              id="service-appointment-date"
              disabled={disabled}
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
        <FieldLabel htmlFor="service-appointment-hour">Hora</FieldLabel>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={hour12}
            onValueChange={setHour12}
            disabled={disabled}
          >
            <SelectTrigger
              id="service-appointment-hour"
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
            disabled={disabled}
          >
            <SelectTrigger
              id="service-appointment-minute"
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
            disabled={disabled}
          >
            <SelectTrigger
              id="service-appointment-meridiem"
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
  );

  const activeAppointmentsList =
    activeAppointments.length > 0 ? (
      <ul className="space-y-2">
        {activeAppointments.map((appt) => (
          <FollowUpAppointmentListItem
            key={appt.id}
            appointment={appt}
            label={
              appt.id === firstAppointment?.id
                ? "Primera visita"
                : "Próxima visita"
            }
            disabled={formDisabled}
            completingId={completingId}
            deletingId={null}
            onComplete={handleCompleteAppointment}
          />
        ))}
      </ul>
    ) : null;

  const manageAppointmentsButton = hasFirstAppointment ? (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => setAppointmentsModalOpen(true)}
      disabled={saving || completingId != null || formDisabled}
    >
      <CalendarDays className="mr-2 h-4 w-4" />
      Ver y agregar citas
      {initialAppointments.length > 1 ? (
        <span className="ml-1 text-muted-foreground">
          ({initialAppointments.length})
        </span>
      ) : null}
    </Button>
  ) : null;

  const firstVisitCompletedWhen = applyScheduledAtToForm(
    firstAppointment?.scheduledAt ?? initialScheduledAt,
  );

  const appointmentsModal = (
    <FollowUpAppointmentsModal
      ticketId={ticketId}
      open={appointmentsModalOpen}
      onOpenChange={setAppointmentsModalOpen}
      appointments={initialAppointments}
      organizationMembers={organizationMembers}
      disabled={formDisabled}
      defaultAttendingUserId={
        sessionUser?.id != null ? String(sessionUser.id) : ""
      }
      firstAppointmentId={firstAppointment?.id ?? null}
      onFirstAppointmentCompleted={() => setVisitCompleted(true)}
    />
  );

  if (visitCompleted) {
    return (
      <>
        <Card className="gap-2 border-muted bg-muted/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-secondary-400" />
              Programar cita del servicio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3 dark:bg-blue-950/30 dark:border-blue-900/40">
              <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-300 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  Primera visita realizada
                </h3>
                <p className="text-xs text-blue-900 dark:text-blue-200">
                  {firstVisitCompletedWhen.date ? (
                    <>
                      La primera visita ya fue registrada como realizada el{" "}
                      {format(firstVisitCompletedWhen.date, "PPP", {
                        locale: es,
                      })}{" "}
                      a las {firstVisitCompletedWhen.hour12}:
                      {firstVisitCompletedWhen.minute}{" "}
                      {meridiemLabel(firstVisitCompletedWhen.meridiem)}.
                    </>
                  ) : (
                    <>La primera visita ya fue registrada como realizada.</>
                  )}
                </p>
              </div>
            </div>
            {activeAppointmentsList}
            {manageAppointmentsButton}
          </CardContent>
        </Card>
        {appointmentsModal}
      </>
    );
  }

  return (
    <>
      <Card className="gap-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-secondary-400" />
            Programar cita del servicio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showReadOnly ? (
            <>
              {activeAppointmentsList}
              {!activeAppointmentsList && selectedDate ? (
                <div
                  className="rounded-lg border border-border/80 bg-muted/35 px-4 py-4 space-y-4 text-sm"
                  aria-readonly="true"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Primera visita
                    </p>
                    <p className="text-base font-medium leading-snug">
                      {format(selectedDate, "PPP", { locale: es })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Hora
                    </p>
                    <p className="text-base font-medium leading-snug tabular-nums">
                      {hour12}:{minute} {meridiemLabel(meridiem)}
                    </p>
                  </div>
                </div>
              ) : null}

              <Button
                type="button"
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={() => setIsEditing(true)}
                disabled={saving || completingId != null || formDisabled}
              >
                Reagendar primera visita
              </Button>

              {manageAppointmentsButton}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleClear}
                disabled={saving || !canClear || completingId != null || formDisabled}
              >
                Quitar todas las citas
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {hasFirstAppointment
                  ? "Actualiza la fecha y hora de la primera visita."
                  : "Programa la primera visita del servicio."}
              </p>
              {!hasFirstAppointment ? (
                <Field>
                  <FieldLabel htmlFor="appointment-description">
                    Descripción (opcional)
                  </FieldLabel>
                  <Textarea
                    id="appointment-description"
                    value={appointmentDescription}
                    onChange={(e) => setAppointmentDescription(e.target.value)}
                    placeholder="Primera visita"
                    disabled={saving || formDisabled}
                    rows={2}
                  />
                </Field>
              ) : null}
              {renderDateTimeFields(saving || formDisabled)}
              {!hasFirstAppointment ? renderMemberSelect(saving || formDisabled) : null}
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button
                  type="button"
                  className="flex-1 min-w-[8rem]"
                  onClick={handleSave}
                  disabled={saving || formDisabled}
                >
                  {saving ? "Guardando…" : "Guardar"}
                </Button>
                {hasFirstAppointment ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 min-w-[8rem]"
                    onClick={handleCancelReschedule}
                    disabled={saving || formDisabled}
                  >
                    Cancelar
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {appointmentsModal}
    </>
  );
}
