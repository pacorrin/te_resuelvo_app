"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  Info,
  Plus,
  XCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  createServiceTicketIncidence,
  _listServiceTicketIncidences,
} from "@/src/lib/actions/service-tickets-incidences.actions";
import { ServiceTicketIncidenceType } from "@/src/lib/enums/service-tickets.enum";
import type { ServiceTicketIncidenceDTO } from "@/src/lib/services/service-ticket-incidence.service";
import { toastError, toastSuccess } from "@/src/lib/utils";

const DESC_MAX = 255;

function normalizeIncidenceRows(
  rows: ServiceTicketIncidenceDTO[],
): ServiceTicketIncidenceDTO[] {
  return rows.map((r) => ({
    ...r,
    createdAt:
      typeof r.createdAt === "string" ? new Date(r.createdAt) : r.createdAt,
  }));
}

function incidenceTypeSlug(type: ServiceTicketIncidenceType): string {
  switch (type) {
    case ServiceTicketIncidenceType.PROBLEMA:
      return "problema";
    case ServiceTicketIncidenceType.RETRASO:
      return "retraso";
    case ServiceTicketIncidenceType.CANCELACION:
      return "cancelacion";
    case ServiceTicketIncidenceType.NOTA:
    default:
      return "nota";
  }
}

function formatIncidentDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getIncidentIcon(typeSlug: string) {
  switch (typeSlug) {
    case "problema":
      return AlertTriangle;
    case "retraso":
      return Clock;
    case "cancelacion":
      return XCircle;
    case "nota":
      return Info;
    default:
      return Info;
  }
}

function getIncidentColor(typeSlug: string) {
  switch (typeSlug) {
    case "problema":
      return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
    case "retraso":
      return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
    case "cancelacion":
      return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
    case "nota":
      return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
    default:
      return "text-muted-foreground bg-muted";
  }
}

function getIncidentLabel(typeSlug: string) {
  switch (typeSlug) {
    case "problema":
      return "Problema";
    case "retraso":
      return "Retraso";
    case "cancelacion":
      return "Cancelación";
    case "nota":
      return "Nota";
    default:
      return typeSlug;
  }
}

type FollowUpIncidentsCardProps = {
  ticketId: number;
  initialIncidences: ServiceTicketIncidenceDTO[];
};

export default function FollowUpIncidentsCard({
  ticketId,
  initialIncidences,
}: FollowUpIncidentsCardProps) {
  const router = useRouter();
  const [incidentType, setIncidentType] = useState<ServiceTicketIncidenceType>(
    ServiceTicketIncidenceType.NOTA,
  );
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidents, setIncidents] = useState<ServiceTicketIncidenceDTO[]>(() =>
    normalizeIncidenceRows(initialIncidences),
  );
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  useEffect(() => {
    setIncidents(normalizeIncidenceRows(initialIncidences));
  }, [initialIncidences]);

  const refetchList = async () => {
    setLoadingList(true);
    try {
      const result = await _listServiceTicketIncidences(ticketId);
      if (result.success && result.data) {
        setIncidents(normalizeIncidenceRows(result.data));
      } else if (!result.success) {
        toastError(result.error ?? "No se pudieron cargar las incidencias.");
      }
    } finally {
      setLoadingList(false);
    }
  };

  const handleAddIncident = async () => {
    const trimmed = incidentDescription.trim();
    if (!trimmed) return;

    setSaving(true);
    try {
      const result = await createServiceTicketIncidence({
        ticketId,
        type: incidentType,
        description: trimmed.slice(0, DESC_MAX),
      });
      if (result.success && result.data) {
        toastSuccess("Incidencia registrada.");
        setIncidentDescription("");
        setIncidentType(ServiceTicketIncidenceType.NOTA);
        const row = normalizeIncidenceRows([result.data])[0];
        setIncidents((prev) => [row, ...prev]);
        router.refresh();
      } else {
        toastError(
          result.error ?? "No se pudo registrar la incidencia.",
        );
      }
    } catch {
      toastError("No se pudo registrar la incidencia.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-secondary" />
            <CardTitle>Incidencias del Servicio</CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
            onClick={() => void refetchList()}
            disabled={loadingList}
          >
            {loadingList ? "Actualizando…" : "Actualizar"}
          </Button>
        </div>
        <CardDescription>
          Documenta problemas, retrasos y notas importantes relacionadas al servicio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="shrink-0 sm:w-40">
              <Label htmlFor="incident-type" className="text-sm">
                Tipo
              </Label>
              <Select
                value={String(incidentType)}
                onValueChange={(v) =>
                  setIncidentType(Number(v) as ServiceTicketIncidenceType)
                }
                disabled={saving}
              >
                <SelectTrigger id="incident-type" className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(ServiceTicketIncidenceType.NOTA)}>
                    Nota
                  </SelectItem>
                  <SelectItem
                    value={String(ServiceTicketIncidenceType.PROBLEMA)}
                  >
                    Problema
                  </SelectItem>
                  <SelectItem
                    value={String(ServiceTicketIncidenceType.RETRASO)}
                  >
                    Retraso
                  </SelectItem>
                  <SelectItem
                    value={String(ServiceTicketIncidenceType.CANCELACION)}
                  >
                    Cancelación
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-0 flex-1">
              <Label htmlFor="incident-description" className="text-sm">
                Descripción
              </Label>
              <Input
                id="incident-description"
                placeholder="Describe la incidencia..."
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                maxLength={DESC_MAX}
                disabled={saving}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Máximo {DESC_MAX} caracteres
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => void handleAddIncident()}
            disabled={saving || !incidentDescription.trim()}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {saving ? "Guardando…" : "Agregar incidencia"}
          </Button>
        </div>

        <div className="space-y-3">
          {incidents.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No hay incidencias registradas
            </div>
          ) : (
            incidents.map((incident) => {
              const slug = incidenceTypeSlug(incident.type);
              const IncidentIcon = getIncidentIcon(slug);
              return (
                <div
                  key={incident.id}
                  className="rounded-lg border p-3"
                >
                  <div className="flex gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getIncidentColor(slug)}`}
                    >
                      <IncidentIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getIncidentLabel(slug)}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatIncidentDate(incident.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm break-words">{incident.description}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
