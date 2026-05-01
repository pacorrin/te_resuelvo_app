"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
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

export type FollowUpIncident = {
  id: number;
  type: string;
  date: string;
  description: string;
  resolvedAt: string | null;
};

const INITIAL_INCIDENTS: FollowUpIncident[] = [
  {
    id: 1,
    type: "problema",
    date: "15 Ene, 2:00 PM",
    description:
      "Cliente reportó que la fuga es más grande de lo que pensaba. Requiere piezas adicionales.",
    resolvedAt: null,
  },
  {
    id: 2,
    type: "nota",
    date: "15 Ene, 4:30 PM",
    description:
      "Cliente mencionó que el problema comenzó hace 3 días. Pidió garantía por escrito.",
    resolvedAt: null,
  },
];

function getIncidentIcon(type: string) {
  switch (type) {
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

function getIncidentColor(type: string) {
  switch (type) {
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

function getIncidentLabel(type: string) {
  switch (type) {
    case "problema":
      return "Problema";
    case "retraso":
      return "Retraso";
    case "cancelacion":
      return "Cancelación";
    case "nota":
      return "Nota";
    default:
      return type;
  }
}

export default function FollowUpIncidentsCard() {
  const [incidentType, setIncidentType] = useState("nota");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidents, setIncidents] =
    useState<FollowUpIncident[]>(INITIAL_INCIDENTS);

  const handleAddIncident = () => {
    if (!incidentDescription.trim()) return;

    const newIncident: FollowUpIncident = {
      id: Math.max(0, ...incidents.map((i) => i.id)) + 1,
      type: incidentType,
      date: new Date().toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      description: incidentDescription,
      resolvedAt: null,
    };
    setIncidents([newIncident, ...incidents]);
    setIncidentDescription("");
    setIncidentType("nota");
  };

  const handleResolveIncident = (id: number) => {
    setIncidents(
      incidents.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              resolvedAt: new Date().toLocaleDateString("es-MX", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : incident,
      ),
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-secondary" />
          <CardTitle>Incidencias del Servicio</CardTitle>
        </div>
        <CardDescription>
          Documenta problemas, retrasos y notas importantes relacionadas al servicio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-1">
              <Label htmlFor="incident-type" className="text-sm">
                Tipo
              </Label>
              <Select value={incidentType} onValueChange={setIncidentType}>
                <SelectTrigger id="incident-type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nota">Nota</SelectItem>
                  <SelectItem value="problema">Problema</SelectItem>
                  <SelectItem value="retraso">Retraso</SelectItem>
                  <SelectItem value="cancelacion">Cancelación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="incident-description" className="text-sm">
                Descripción
              </Label>
              <Input
                id="incident-description"
                placeholder="Describe la incidencia..."
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleAddIncident}
            disabled={!incidentDescription.trim()}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar incidencia
          </Button>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Historial de incidencias (
            {incidents.filter((i) => !i.resolvedAt).length} activas)
          </Label>
          {incidents.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No hay incidencias registradas
            </div>
          ) : (
            incidents.map((incident) => {
              const IncidentIcon = getIncidentIcon(incident.type);
              return (
                <div
                  key={incident.id}
                  className={`rounded-lg border p-3 ${
                    incident.resolvedAt ? "bg-muted/20 opacity-60" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getIncidentColor(incident.type)}`}
                    >
                      <IncidentIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getIncidentLabel(incident.type)}
                          </Badge>
                          {incident.resolvedAt && (
                            <Badge
                              variant="outline"
                              className="border-green-300 bg-green-100 text-xs text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
                            >
                              Resuelta
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {incident.date}
                        </span>
                      </div>
                      <p className="mb-2 text-sm">{incident.description}</p>
                      {incident.resolvedAt && (
                        <p className="text-xs text-muted-foreground">
                          Resuelta el {incident.resolvedAt}
                        </p>
                      )}
                      {!incident.resolvedAt && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 h-7 text-xs"
                          onClick={() => handleResolveIncident(incident.id)}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Marcar como resuelta
                        </Button>
                      )}
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
