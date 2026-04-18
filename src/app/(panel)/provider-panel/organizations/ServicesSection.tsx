"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Autocomplete,
  type AutocompleteCommitPayload,
} from "@/src/components/ui/autocomplete";
import { _findServices } from "@/src/lib/actions/services.actions";
import {
  _assignServiceToOrganization,
  _removeServiceFromOrganization,
} from "@/src/lib/actions/organizations-services.actions";
import { ServiceDTO } from "@/src/lib/dtos/Services.dto";
import type { OrganizationServiceDTO } from "@/src/lib/dtos/OrganizationServices.dto";
import { toast } from "sonner";

export function ServicesSection({
  organizationId,
  initialOrganizationServices,
}: {
  organizationId: number;
  initialOrganizationServices: OrganizationServiceDTO[];
}) {
  type LoadingAction = "idle" | "search" | "assign" | "remove";
  const [searchResults, setSearchResults] = useState<ServiceDTO[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [loadingAction, setLoadingAction] = useState<LoadingAction>("idle");
  const [organizationServices, setOrganizationServices] = useState<
    OrganizationServiceDTO[]
  >(initialOrganizationServices);

  const searchServices = async (name: string) => {
    setServiceName(name);
    if (name.length < 3) {
      setSearchResults([]);
      return;
    }
    setLoadingAction("search");
    try {
      const result = await _findServices({ name });
      if (result.success && result.data) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
      }
    } finally {
      setLoadingAction("idle");
    }
  };

  const handleCommit = async (payload: AutocompleteCommitPayload<number>) => {
    if (payload.value === null) {
      toast.error(
        "Selecciona un servicio de la lista o elige uno tras buscar.",
      );
      return;
    }
    const svc = searchResults.find((s) => s.id === payload.value);
    if (!svc) return;
    if (organizationServices.some((l) => l.serviceId === payload.value)) {
      toast.error("Este servicio ya está asignado.");
      return;
    }
    setLoadingAction("assign");
    try {
      const result = await _assignServiceToOrganization(
        organizationId,
        payload.value,
      );
      if (result.success && result.service) {
        setOrganizationServices((prev) => [
          ...prev,
          { ...result.service, service: svc },
        ]);
        setServiceName("");
      } else {
        toast.error(result.error ?? "No se pudo asignar el servicio.");
      }
    } finally {
      setLoadingAction("idle");
    }
  };

  const handleAddClick = () => {
    const v = serviceName.trim();
    if (!v) return;
    const match = searchResults.find(
      (s) => s.name.toLowerCase() === v.toLowerCase(),
    );
    if (match) {
      void handleCommit({ label: match.name, value: match.id });
    } else {
      toast.error("Busca y elige un servicio de la lista (mín. 3 caracteres).");
    }
  };

  const removeService = async (linkId: number) => {
    setLoadingAction("remove");
    try {
      const result = await _removeServiceFromOrganization(linkId);
      if (result.success) {
        setOrganizationServices((prev) => prev.filter((l) => l.id !== linkId));
      } else {
        toast.error(result.error ?? "No se pudo quitar el servicio.");
      }
    } finally {
      setLoadingAction("idle");
    }
  };

  const options = searchResults.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const excludeIds = organizationServices.map((l) => l.serviceId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios</CardTitle>
        <CardDescription>
          Los servicios que brinda tu organización
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-w-[min(100%,16rem)] flex-1 items-center gap-1 mb-4">
          <Autocomplete<number>
            className="min-w-0 flex-1"
            options={options}
            exclude={excludeIds}
            value={serviceName}
            onValueChange={searchServices}
            onCommit={(p) => void handleCommit(p)}
            placeholder="Buscar servicio (mín. 3 caracteres)"
            emptyMessage={
              loadingAction === "search" ? "Buscando..." : "Sin coincidencias"
            }
            disabled={loadingAction === "assign" || loadingAction === "remove"}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {organizationServices.map((link) => (
            <Badge
              key={`${link.id}-${link.serviceId}`}
              variant="secondary"
              className="text-sm px-3 py-1"
            >
              {link.service?.name}
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 hover:bg-transparent text-white/40 hover:text-white"
                onClick={() => void removeService(link.id)}
                disabled={loadingAction === "assign" || loadingAction === "remove"}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
