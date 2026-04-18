"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { InputNumber } from "@/src/components/ui/input-number";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { MapboxLocationPicker } from "@/src/components/MapboxLocationPicker";
import type { MapboxAddressDetails } from "@/src/components/MapboxLocationPicker";
import type { OrganizationCoverageAreaDTO } from "@/src/lib/dtos/OrganizationCoverageArea.dto";
import type { CreateCoverageAreaDTO } from "@/src/lib/dtos/OrganizationCoverageArea.dto";
import { _createCoverageArea, _removeCoverageArea } from "@/src/lib/actions/organization-coverage.actions";
import { Spinner } from "@/src/components/ui/spinner";
import { toastError, toastSuccess } from "@/src/lib/utils";

export function CoverageAreasSection({
  organizationId,
  initialCoverageAreas,
}: {
  organizationId: number;
  initialCoverageAreas: OrganizationCoverageAreaDTO[];
}) {
  const [coverageAreas, setCoverageAreas] =
    useState<OrganizationCoverageAreaDTO[]>(initialCoverageAreas);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [radiusKm, setRadiusKm] = useState<string>("10");
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [addressInfo, setAddressInfo] = useState<MapboxAddressDetails | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteArea, setDeleteArea] =
    useState<OrganizationCoverageAreaDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const radiusKmNum = Number(radiusKm);
  const mapRadiusKm =
    Number.isFinite(radiusKmNum) && radiusKmNum > 0 ? radiusKmNum : undefined;

  const resetForm = () => {
    setName("");
    setRadiusKm("10");
    setCoords(null);
    setAddressInfo(null);
  };

  const onSubmit = async () => {
    let trimmedName = name.trim();
    const radius = Number(radiusKm);
    if (!trimmedName) {
      trimmedName = `${addressInfo?.city ?? ""} - ${addressInfo?.state ?? ""}`;
    }
    if (!coords) {
      toastError("Selecciona una ubicación en el mapa.");
      return;
    }
    if (!Number.isFinite(radius) || radius <= 0) {
      toastError("El radio (km) debe ser mayor a 0.");
      return;
    }

    const payload: CreateCoverageAreaDTO = {
      organizationId,
      name: trimmedName,
      latitude: coords.latitude,
      longitude: coords.longitude,
      radiusKm: radius,
      address: addressInfo?.formattedAddress ?? undefined,
    };

    try {
      const response = await _createCoverageArea(payload);
      if (response.success && response.data) {
        setCoverageAreas((prev) => [...prev, response.data!]);
        setIsOpen(false);
        resetForm();
        toastSuccess("Área de cobertura creada.");
      } else {
        toastError(response.error ?? "No se pudo crear el área.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteArea) return;
    setIsDeleting(true);
    try {
      const response = await _removeCoverageArea(deleteArea.id);
      if (response.success) {
        setCoverageAreas((prev) => prev.filter((a) => a.id !== deleteArea.id));
        toastSuccess("Área de cobertura eliminada.");
        setDeleteArea(null);
      } else {
        toastError(response.error ?? "No se pudo eliminar el área.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Áreas de Cobertura</CardTitle>
        <CardDescription className="text-xs">
          Zonas donde brinda servicio la organización
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {coverageAreas.map((area) => (
            <div
              key={area.id}
              className="flex items-start justify-between gap-3 p-2 bg-muted rounded"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{area.name}</div>
                <div className="text-xs text-muted-foreground">
                  {area.radiusKm} km
                </div>
              </div>
              {/* optional: remove UI could be added later */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Eliminar área ${area.name}`}
                onClick={() => setDeleteArea(area)}
              >
                <X className="w-4 h-4 opacity-40" />
              </Button>
            </div>
          ))}
        </div>

        <Dialog
          open={deleteArea != null}
          onOpenChange={(open) => {
            if (!open) setDeleteArea(null);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>¿Eliminar área de cobertura?</DialogTitle>
              <DialogDescription>
                {deleteArea ? (
                  <>
                    Se eliminará{" "}
                    <span className="font-medium text-foreground">
                      {deleteArea.name}
                    </span>
                    . Esta acción no se puede deshacer.
                  </>
                ) : null}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteArea(null)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void handleConfirmDelete()}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Spinner className="mr-2" />
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isOpen}
          onOpenChange={(next) => {
            setIsOpen(next);
            if (!next) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full mt-3">
              Agregar área
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>Nueva área de cobertura</DialogTitle>
              <DialogDescription>
                Selecciona una ubicación en el mapa, define el nombre y el radio
                (km).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coverage-name">Nombre</Label>
                  <Input
                    id="coverage-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Zona Centro"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverage-radius">
                    Radio (km) <span className="text-red-500">*</span>
                  </Label>
                  <InputNumber
                    id="coverage-radius"
                    allowDecimals
                    value={radiusKm}
                    onValueChange={(v) => setRadiusKm(v)}
                    placeholder="Ej: 5.5"
                  />
                </div>
              </div>

              <MapboxLocationPicker
                initialLocation={coords ?? undefined}
                radiusKm={mapRadiusKm}
                onLocationSelect={(l, details) => {
                  setCoords(l);
                  if (details !== undefined) {
                    setAddressInfo(details);
                  }
                }}
                heightClassName="h-[500px]"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => void onSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Creando...
                  </>
                ) : (
                  "Crear área"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
