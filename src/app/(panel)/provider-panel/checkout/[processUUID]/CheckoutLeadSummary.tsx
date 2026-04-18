"use client";

import {
  Calendar,
  Hash,
  Mail,
  MapPin,
  Phone,
  User,
  Wrench,
} from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import type { LeadListItemData } from "@/src/app/(panel)/provider-panel/LeadListItemCompact";
import { getTenderNumber } from "@/src/lib/utils/tender.utils";

export type CheckoutLeadSummaryProps = {
  lead: LeadListItemData;
  customer: {
    name: string;
    email: string;
  };
};

export default function CheckoutLeadSummary({
  lead,
  customer,
}: CheckoutLeadSummaryProps) {
  const formattedPrice =
    Number.isFinite(lead.price) && lead.price >= 0
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
          maximumFractionDigits: 0,
        }).format(lead.price)
      : `$${lead.price}`;

  return (
    <div className="rounded-xl border border-zinc-200 bg-linear-to-b from-zinc-50 to-white p-4 shadow-sm dark:border-zinc-800 dark:from-zinc-900/80 dark:to-zinc-950">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-start gap-2.5">
              {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <Wrench className="h-4 w-4" />
              </div> */}
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <p className="text-md font-bold uppercase text-secondary">
                      #{getTenderNumber(lead.id)}
                    </p>
                    {lead.date ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-xs font-normal text-white dark:text-zinc-300"
                      >
                        <Calendar className="h-3 w-3" />
                        {lead.date}
                      </Badge>
                    ) : null}
                  </div>
                  <h3 className="text-base font-bold leading-snug text-zinc-900 dark:text-zinc-50 sm:text-lg">
                    {lead.serviceType}
                  </h3>
                </div>
                <p className="text-md text-zinc-500 dark:text-zinc-100">
                  {lead.service}
                </p>
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-lg border border-blue-100 bg-blue-50/80 px-3 py-2 text-right dark:border-blue-900/40 dark:bg-blue-950/30">
            <p className="text-[10px] font-medium uppercase tracking-wide text-blue-800/80 dark:text-blue-300/90">
              Precio del lead
            </p>
            <p className="text-xl font-bold tabular-nums tracking-tight text-blue-700 dark:text-blue-200 sm:text-2xl">
              {formattedPrice}
            </p>
          </div>
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-800" />

        <div className="grid gap-3 sm:grid-cols-1">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
              <User className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Cliente
              </p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {customer.name
                  ? customer.name.slice(0, 4).padEnd(customer.name.length, "*")
                  : ""}
           
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
              <Phone className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Teléfono
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {lead.phone || "—"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
              <MapPin className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Ubicación (código postal)
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {lead.location || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
