"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarClock, ChevronDownIcon } from "lucide-react";

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
import { _scheduleServiceAppointment } from "@/src/lib/actions/service-tickets.actions";
import { toastError, toastSuccess } from "@/src/lib/utils";

function parseInitialDate(
  value: Date | string | null | undefined,
): Date | null {
  if (value == null || value === "") return null;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

type Meridiem = "am" | "pm";

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

function utcTimeTo12State(d: Date): {
  hour12: string;
  minute: string;
  meridiem: Meridiem;
} {
  const h24 = d.getUTCHours();
  const m = d.getUTCMinutes();
  const meridiem: Meridiem = h24 >= 12 ? "pm" : "am";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return {
    hour12: String(h12),
    minute: String(m).padStart(2, "0"),
    meridiem,
  };
}

function state12ToHHmm(
  hour12: string,
  minute: string,
  meridiem: Meridiem,
): string | null {
  let h = Number.parseInt(hour12, 10);
  const mi = Number.parseInt(minute, 10);
  if (!Number.isFinite(h) || h < 1 || h > 12) return null;
  if (!Number.isFinite(mi) || mi < 0 || mi > 59) return null;
  if (meridiem === "am") {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
}

/** Hydrate picker from a stored instant: UTC calendar date + 12h UTC time (matches how we save). */
function applyScheduledAtToForm(
  value: Date | string | null | undefined,
): {
  date: Date | undefined;
  hour12: string;
  minute: string;
  meridiem: Meridiem;
} {
  const d = parseInitialDate(value);
  if (!d) {
    return {
      date: undefined,
      hour12: "9",
      minute: "00",
      meridiem: "am",
    };
  }
  return {
    date: new Date(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
    ),
    ...utcTimeTo12State(d),
  };
}

/**
 * Persist the chosen civil date + time as UTC (Z). Same numeric Y-M-D and H:m as shown in the UI,
 * interpreted on the UTC timeline — not the browser’s local offset.
 */
function toAppointmentUtcIso(date: Date, timeHHmm: string): string | null {
  const y = date.getFullYear();
  const mo = date.getMonth();
  const day = date.getDate();
  const parts = timeHHmm.split(":").map((p) => Number(p));
  const h = Number.isFinite(parts[0]) ? parts[0] : 0;
  const m = Number.isFinite(parts[1]) ? parts[1] : 0;
  const s = Number.isFinite(parts[2]) ? parts[2] : 0;
  const ms = Date.UTC(y, mo, day, h, m, s, 0);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}

type FollowUpScheduleAppointmentCardProps = {
  ticketId: number;
  initialScheduledAt: Date | string | null;
};

function hasScheduledBackendValue(
  value: Date | string | null | undefined,
): boolean {
  if (value == null || value === "") return false;
  const d = typeof value === "string" ? new Date(value) : value;
  return !Number.isNaN(d.getTime());
}

function meridiemLabel(m: Meridiem): string {
  return m === "am" ? "am" : "pm";
}

function scheduledAtKey(value: Date | string | null | undefined): string {
  if (value == null || value === "") return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

export default function FollowUpScheduleAppointmentCard({
  ticketId,
  initialScheduledAt,
}: FollowUpScheduleAppointmentCardProps) {
  const router = useRouter();
  const initialForm = applyScheduledAtToForm(initialScheduledAt);
  /** Editable form vs read-only summary (new ticket or after “Reagendar”). */
  const [isEditing, setIsEditing] = useState(() => initialForm.date == null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialForm.date,
  );
  const [hour12, setHour12] = useState(initialForm.hour12);
  const [minute, setMinute] = useState(initialForm.minute);
  const [meridiem, setMeridiem] = useState<Meridiem>(initialForm.meridiem);
  const [saving, setSaving] = useState(false);
  const serverHasAppointment = hasScheduledBackendValue(initialScheduledAt);
  const isEditingRef = useRef(isEditing);
  isEditingRef.current = isEditing;
  const initialKey = scheduledAtKey(initialScheduledAt);

  useEffect(() => {
    if (isEditingRef.current) return;
    const next = applyScheduledAtToForm(initialScheduledAt);
    setSelectedDate(next.date);
    setHour12(next.hour12);
    setMinute(next.minute);
    setMeridiem(next.meridiem);
    if (next.date == null) {
      setIsEditing(true);
    }
  }, [initialKey, initialScheduledAt]);

  const handleSave = async () => {
    let iso: string | null = null;
    if (selectedDate) {
      const hhmm = state12ToHHmm(hour12, minute, meridiem);
      if (hhmm == null) {
        toastError("Revisa la hora.");
        return;
      }
      iso = toAppointmentUtcIso(selectedDate, hhmm);
      if (iso == null) {
        toastError("Revisa la hora.");
        return;
      }
    }

    setSaving(true);
    try {
      const result = await _scheduleServiceAppointment(ticketId, iso);
      if (result.success && result.data) {
        toastSuccess("Cita del servicio actualizada.");
        const next = applyScheduledAtToForm(result.data.serviceScheduledFor);
        setSelectedDate(next.date);
        setHour12(next.hour12);
        setMinute(next.minute);
        setMeridiem(next.meridiem);
        setIsEditing(false);
        router.refresh();
      } else {
        toastError(
          result.error ?? "No se pudo guardar la cita del servicio.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancelReschedule = () => {
    const next = applyScheduledAtToForm(initialScheduledAt);
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
        toastSuccess("Cita eliminada.");
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

  const canClear =
    selectedDate != null || serverHasAppointment;

  const showReadOnly =
    !isEditing && selectedDate != null;

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-secondary-400" />
          Programar cita del servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {showReadOnly ? (
          <>
            <div
              className="rounded-lg border border-border/80 bg-muted/35 px-4 py-4 space-y-4 text-sm"
              aria-readonly="true"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fecha
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
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={() => setIsEditing(true)}
              disabled={saving}
            >
              Reagendar cita
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleClear}
              disabled={saving || !canClear}
            >
              Quitar cita
            </Button>
          </>
        ) : (
          <>
            <FieldGroup className="flex-col gap-4 @sm/field-group:flex-row @sm/field-group:items-end">
              <Field className="min-w-0 flex-1">
                <FieldLabel htmlFor="service-appointment-date">Fecha</FieldLabel>
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      id="service-appointment-date"
                      disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                className="flex-1 min-w-[8rem]"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Guardando…" : "Guardar"}
              </Button>
              {serverHasAppointment ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 min-w-[8rem]"
                  onClick={handleCancelReschedule}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              ) : null}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
