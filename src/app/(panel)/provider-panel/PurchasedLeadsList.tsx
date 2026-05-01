"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Spinner } from "@/src/components/ui/spinner";
import {
  LeadListItemCompact,
  type LeadListItemData,
} from "./LeadListItemCompact";
import { _getPurchasedTendersForOrganizationAction } from "@/src/lib/actions/tender.actions";
import { tenderToLeadItem } from "./LeadsList";
import { _getTicketsByOrganization } from "@/src/lib/actions/service-tickets.actions";
import { TenderClientListDTO } from "@/src/lib/dtos/Tenders.dto";

export function PurchasedLeadsList({
  organizationId,
}: {
  organizationId: number;
}) {
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
      const tickets = await _getTicketsByOrganization(organizationId);
      console.log("tickets", tickets);
      if (tickets.success && tickets.data) {
        setLeads(tickets.data.map((t) => ({
          ...tenderToLeadItem(t.tender as TenderClientListDTO, t.id),
          status: "purchased" as const,
        })));
      } else {
        setLeads([]);
        setError(tickets.error ?? "No se pudieron cargar los leads comprados.");
      }
    } catch (err) {
      console.error("Error fetching purchased tenders:", err);
      setLeads([]);
      setError("No autorizado o sesión expirada.");
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  return (
    <Card className="bg-white dark:bg-zinc-900 overflow-hidden">
      <CardHeader className="pb-4">
        <div>
          <CardTitle className="text-xl font-bold">Leads comprados</CardTitle>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Clientes que ya adquiriste; datos visibles para seguimiento
          </p>
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
        ) : leads.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-zinc-500 dark:text-zinc-400">
              Aún no tienes leads comprados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
            {leads.map((lead) => (
              <LeadListItemCompact
                key={lead.id}
                lead={lead}
                organizationId={organizationId}
                isPurchased={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
