"use client";

import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
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
import type { CreateOrganizationCoverageAreaDTO } from "@/src/lib/dtos/OrganizationCoverageArea.dto";
import { toastError } from "@/src/lib/utils";

type LocalCoverageZone = CreateOrganizationCoverageAreaDTO & {
  localId: string;
};

interface CoverageZonesSectionProps {
  onCoverageZonesChange?: (zones: CreateOrganizationCoverageAreaDTO[]) => void;
}

export default function CoverageZonesSection({
  onCoverageZonesChange,
}: CoverageZonesSectionProps) {
  const [coverageZones, setCoverageZones] = useState<LocalCoverageZone[]>([]);
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

  const radiusKmNum = Number(radiusKm);
  const mapRadiusKm =
    Number.isFinite(radiusKmNum) && radiusKmNum > 0 ? radiusKmNum : undefined;

  useEffect(() => {
    onCoverageZonesChange?.(
      coverageZones.map(({ localId: _, ...zone }) => zone),
    );
  }, [coverageZones, onCoverageZonesChange]);

  const resetForm = () => {
    setName("");
    setRadiusKm("10");
    setCoords(null);
    setAddressInfo(null);
  };

  const addCoverageZone = () => {
    let trimmedName = name.trim();
    const radius = Number(radiusKm);

    if (!trimmedName) {
      trimmedName = `${addressInfo?.city ?? ""} - ${addressInfo?.state ?? ""}`.trim();
    }
    if (!trimmedName) {
      toastError("Ingresa un nombre para la zona de cobertura.");
      return;
    }
    if (!coords) {
      toastError("Selecciona una ubicación en el mapa.");
      return;
    }
    if (!Number.isFinite(radius) || radius <= 0) {
      toastError("El radio (km) debe ser mayor a 0.");
      return;
    }

    const newZone: LocalCoverageZone = {
      localId: crypto.randomUUID(),
      organizationId: 0,
      name: trimmedName,
      latitude: coords.latitude,
      longitude: coords.longitude,
      radiusKm: radius,
      address: addressInfo?.formattedAddress ?? undefined,
    };

    setCoverageZones((prev) => [...prev, newZone]);
    setIsOpen(false);
    resetForm();
  };

  const removeCoverageZone = (localId: string) => {
    setCoverageZones((prev) => prev.filter((z) => z.localId !== localId));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <CardTitle>Zonas de cobertura</CardTitle>
        </div>
        <CardDescription>
          Define las áreas geográficas donde ofreces tus servicios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {coverageZones.map((zone) => (
            <div
              key={zone.localId}
              className="flex items-start justify-between gap-3 p-2 bg-muted rounded"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{zone.name}</div>
                <div className="text-xs text-muted-foreground">
                  {zone.radiusKm} km
                  {zone.address ? ` · ${zone.address}` : ""}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Eliminar zona ${zone.name}`}
                onClick={() => removeCoverageZone(zone.localId)}
              >
                <X className="w-4 h-4 opacity-40" />
              </Button>
            </div>
          ))}
        </div>

        {coverageZones.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No has agregado zonas de cobertura aún. Define las áreas donde
            ofreces tus servicios.
          </div>
        )}

        <Dialog
          open={isOpen}
          onOpenChange={(next) => {
            setIsOpen(next);
            if (!next) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full mt-3">
              Agregar zona
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>Nueva zona de cobertura</DialogTitle>
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
              >
                Cancelar
              </Button>
              <Button type="button" onClick={addCoverageZone}>
                Agregar zona
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
