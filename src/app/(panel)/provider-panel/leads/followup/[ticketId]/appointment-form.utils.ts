import { format } from "date-fns";
import { es } from "date-fns/locale";

export type Meridiem = "am" | "pm";

export const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1));
export const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

export function parseInitialDate(
  value: Date | string | null | undefined,
): Date | null {
  if (value == null || value === "") return null;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export function utcTimeTo12State(d: Date): {
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

export function state12ToHHmm(
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

export function applyScheduledAtToForm(
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
    date: new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    ...utcTimeTo12State(d),
  };
}

export function toAppointmentUtcIso(date: Date, timeHHmm: string): string | null {
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

export function meridiemLabel(m: Meridiem): string {
  return m === "am" ? "a. m." : "p. m.";
}

export function formatAppointmentWhen(value: Date | string): string {
  const applied = applyScheduledAtToForm(value);
  if (!applied.date) return "—";
  return `${format(applied.date, "PPP", { locale: es })} · ${applied.hour12}:${applied.minute} ${meridiemLabel(applied.meridiem)}`;
}

export function scheduledAtKey(value: Date | string | null | undefined): string {
  if (value == null || value === "") return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

export function hasScheduledBackendValue(
  value: Date | string | null | undefined,
): boolean {
  if (value == null || value === "") return false;
  const d = typeof value === "string" ? new Date(value) : value;
  return !Number.isNaN(d.getTime());
}
