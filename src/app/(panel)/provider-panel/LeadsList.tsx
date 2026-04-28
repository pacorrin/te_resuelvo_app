"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Spinner } from "@/src/components/ui/spinner";
import {
  LeadListItemCompact,
  type LeadListItemData,
} from "./LeadListItemCompact";
import { _getTendersForOrganizationCoverageAction } from "@/src/lib/actions/tender.actions";
import type { TenderClientListDTO } from "@/src/lib/dtos/Tenders.dto";


function hace(n: number, singular: string, plural: string): string {
  const unit = n === 1 ? singular : plural;
  return `hace ${n} ${unit}`;
}

export function formatRelativeEs(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const elapsedSec = Math.round((Date.now() - date.getTime()) / 1000);
  console.log("elapsedSec", elapsedSec);
  if (elapsedSec <= 0) {
    return "ahora";
  }

  if (elapsedSec < 60) {
    return hace(elapsedSec, "segundo", "segundos");
  }

  const minutes = Math.floor(elapsedSec / 60);
  if (minutes < 60) {
    return hace(minutes, "minuto", "minutos");
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hace(hours, "hora", "horas");
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return hace(days, "día", "días");
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return hace(months, "mes", "meses");
  }

  const years = Math.floor(days / 365);
  return hace(years, "año", "años");
}

export function tenderToLeadItem(tender: TenderClientListDTO): LeadListItemData {
  const title =
    tender.description.length > 72
      ? `${tender.description.slice(0, 69)}…`
      : tender.description;

  return {
    id: tender.id,
    service: title,
    serviceType: tender.service?.name ?? "—",
    customer: {
      name: tender.personName,
      email: tender.customer?.email ?? "—",
      phone: tender.customer?.phone ?? "—",
    },
    phone: tender.customer?.phone ?? "—",
    location: 'CP ' + tender.zipcode?.trim() || "—",
    date: formatRelativeEs(new Date(tender.createdAt)),
    status: "available",
    price: tender.service?.leadPrice ?? 0,
  };
}

export function LeadsList({
  organizationId,
}: {
  organizationId: number;
}) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [leads, setLeads] = useState<LeadListItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    if (organizationId == null) {
      setLeads([]);
      setLoading(false);
      setError("No se encontró la organización.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result =
        await _getTendersForOrganizationCoverageAction(organizationId);
      if (result.success && result.data) {
        console.log("result.data", result.data);
        setLeads(result.data.map(tenderToLeadItem));
      } else {
        setLeads([]);
        setError(result.error ?? "No se pudieron cargar los leads.");
      }
    } catch(error) {
      console.error("Error fetching tenders for organization coverage:", error);
      setLeads([]);
      setError("No autorizado o sesión expirada.");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const filteredLeads =
    activeTab === "all"
      ? leads
      : leads.filter((lead) => lead.status === activeTab);

  return (
    <Card className="bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Nuevos clientes</CardTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Solicitudes dentro de tus zonas de cobertura
            </p>
          </div>
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full sm:w-[180px] bg-zinc-50 dark:bg-zinc-800/50 border-none shadow-none">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los leads</SelectItem>
              <SelectItem value="available">Disponibles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">
              No se encontraron leads en esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
            {filteredLeads.map((lead) => (
              <LeadListItemCompact key={lead.id} lead={lead} organizationId={organizationId} isPurchased={false} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
