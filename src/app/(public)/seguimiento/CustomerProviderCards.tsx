"use client";

import { useId, useState, type ComponentType } from "react";
import {
  Building2,
  CalendarClock,
  ChevronDown,
  File,
  FileText,
  Mail,
  Phone,
  Table2,
  Users,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type {
  CustomerAppointmentDTO,
  CustomerProviderProgressDTO,
  CustomerQuoteFileDTO,
} from "@/src/lib/dtos/CustomerTenderPortal.dto";
import { cn } from "@/src/lib/utils";
import {
  customerAppointmentBorderClass,
  customerAppointmentStatusBadgeClass,
  customerServiceStatusBadgeClass,
} from "@/src/lib/utils/customer-portal-status";
import {
  classifyCustomerQuoteFile,
  customerQuoteFileHref,
  isCustomerQuoteImage,
  type CustomerQuoteFileKind,
} from "./customer-quote.utils";

function QuoteTypeIcon({ kind }: { kind: CustomerQuoteFileKind }) {
  switch (kind) {
    case "pdf":
      return <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />;
    case "word":
      return <FileText className="h-6 w-6 text-blue-700 dark:text-blue-400" />;
    case "excel":
      return <Table2 className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />;
    default:
      return <File className="h-6 w-6 text-muted-foreground" />;
  }
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );
}

function AppointmentItem({ appointment }: { appointment: CustomerAppointmentDTO }) {
  return (
    <li
      className={cn(
        "rounded-lg border border-border/70 border-l-4 bg-muted/25 px-4 py-3 text-sm shadow-sm",
        customerAppointmentBorderClass(appointment.status),
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 font-medium tabular-nums text-foreground">
          <CalendarClock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {appointment.scheduledAt}
        </p>
        <Badge
          variant="outline"
          className={cn(
            "border font-medium",
            customerAppointmentStatusBadgeClass(appointment.status),
          )}
        >
          {appointment.statusLabel}
        </Badge>
      </div>
      {appointment.description ? (
        <p className="mt-2 whitespace-pre-wrap leading-relaxed text-muted-foreground">
          {appointment.description}
        </p>
      ) : null}
    </li>
  );
}

function ProviderQuotes({ quotes }: { quotes: CustomerQuoteFileDTO[] }) {
  if (quotes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
        Aún no hay cotizaciones de este proveedor.
      </p>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {quotes.map((f) => {
        const href = customerQuoteFileHref(f.id);
        const image = isCustomerQuoteImage(f);
        const kind = classifyCustomerQuoteFile(f);
        return (
          <li key={f.id} className="flex min-w-0 flex-col">
            {image ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-36 w-full overflow-hidden rounded-lg border border-border bg-muted/20 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <img
                  src={href}
                  alt={f.originalName}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
              </a>
            ) : (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={f.originalName}
                className="group flex h-36 w-full flex-col rounded-lg border border-border bg-muted/20 p-3 text-center shadow-sm transition-all hover:border-primary/40 hover:bg-muted/40 hover:shadow-md"
              >
                <div className="flex min-h-0 flex-1 items-center justify-center">
                  <QuoteTypeIcon kind={kind} />
                </div>
                <span className="line-clamp-2 w-full shrink-0 text-xs font-medium text-foreground wrap-break-word">
                  {f.originalName}
                </span>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function ProviderCard({
  provider,
  defaultOpen = false,
}: {
  provider: CustomerProviderProgressDTO;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader
        className={cn(
          "bg-linear-to-r from-primary/8 via-primary/3 to-transparent px-6 py-5",
          open && "border-b border-border/60",
        )}
      >
        <button
          type="button"
          className="flex w-full items-start gap-4 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm"
            aria-hidden
          >
            <Building2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2 pr-1">
              <CardTitle className="text-lg leading-tight">
                {provider.organizationName}
              </CardTitle>
              <div className="flex shrink-0 items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "border font-semibold",
                    customerServiceStatusBadgeClass(provider.status),
                  )}
                >
                  {provider.statusLabel}
                </Badge>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-muted-foreground transition-transform duration-200",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
              <a
                href={`mailto:${provider.contactEmail}`}
                className="inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{provider.contactEmail}</span>
              </a>
              <a
                href={`tel:${provider.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {provider.phone}
              </a>
            </div>
          </div>
        </button>
      </CardHeader>

      {open ? (
        <CardContent id={panelId} className="space-y-6 px-6 py-5">
          <section className="space-y-3">
            <SectionHeading icon={CalendarClock} title="Citas" />
            {provider.appointments.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-4 py-5 text-center text-sm text-muted-foreground">
                Sin citas programadas por ahora.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {provider.appointments.map((a, i) => (
                  <AppointmentItem
                    key={`${a.scheduledAt}-${i}`}
                    appointment={a}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3">
            <SectionHeading icon={FileText} title="Cotizaciones" />
            <ProviderQuotes quotes={provider.quotes} />
          </section>
        </CardContent>
      ) : null}
    </Card>
  );
}

type CustomerProviderCardsProps = {
  providers: CustomerProviderProgressDTO[];
};

export function CustomerProviderCards({ providers }: CustomerProviderCardsProps) {
  if (providers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
            Aún no hay proveedores asignados a tu solicitud. Te avisaremos cuando
            haya actualizaciones.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Users className="h-5 w-5 text-primary" />
        Proveedores
      </h2>
      <div className="space-y-4">
        {providers.map((provider, index) => (
          <ProviderCard
            key={`${provider.organizationName}-${provider.status}-${index}`}
            provider={provider}
          />
        ))}
      </div>
    </div>
  );
}
