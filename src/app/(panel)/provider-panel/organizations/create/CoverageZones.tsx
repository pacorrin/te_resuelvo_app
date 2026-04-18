"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Trash2 } from "lucide-react";
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
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { Badge } from "@/src/components/ui/badge";
import { MapPicker } from "@/src/components/MapPicker";
import { CreateCoverageAreaDTO, CreateOrganizationCoverageAreaDTO } from "@/src/lib/dtos/OrganizationCoverageArea.dto";
import { InputNumber } from "@/src/components/ui/input-number";

const ESTADOS_MEXICO = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

interface CoverageZonesSectionProps {
  onCoverageZonesChange?: (zones: CreateOrganizationCoverageAreaDTO[]) => void;
}

const defaultZoneState: CreateCoverageAreaDTO = {
  organizationId: 0,
  name: "",
  latitude: 0,
  longitude: 0,
  radiusKm: 0,
  description: "",
  administratorId: 0,
};

export default function CoverageZonesSection({
  onCoverageZonesChange,
}: CoverageZonesSectionProps) {
  const [coverageZones, setCoverageZones] = useState<CreateOrganizationCoverageAreaDTO[]>([]);
  const [currentZone, setCurrentZone] = useState<CreateCoverageAreaDTO>(defaultZoneState);

  useEffect(() => {
    onCoverageZonesChange?.(coverageZones);
  }, [coverageZones, onCoverageZonesChange]);

  const addCoverageZone = () => {
    if (
      currentZone.name &&
      currentZone.latitude !== null &&
      currentZone.longitude !== null &&
      currentZone.radiusKm
    ) {
      const newZone: any = {
        name: currentZone.name,
        latitude: currentZone.latitude,
        longitude: currentZone.longitude,
        radiusKm: currentZone.radiusKm,
        description: currentZone.description,
      };
      const newZones = [...coverageZones, newZone];
      setCoverageZones(newZones as CreateOrganizationCoverageAreaDTO[]);
      setCurrentZone(defaultZoneState);
    }
  };

  const removeCoverageZone = (name: string) => {
    setCoverageZones((prev) => prev.filter((z) => z.name !== name));
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
      <CardContent className="space-y-6">
        {/* Add coverage zone form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="zoneState">Estado *</Label>
              <Select
                value={currentZone.name}
                onValueChange={(value) =>
                  setCurrentZone((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }
              >
                <SelectTrigger id="zoneState" className="w-full">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_MEXICO.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zoneRadius">Radio de cobertura (km) *</Label>
              <InputNumber
                id="zoneRadius"
                placeholder="Ej: 15"
                value={currentZone.radiusKm}
                onValueChange={(value) =>
                  setCurrentZone((prev) => ({
                    ...prev,
                    radiusKm: Number(value),
                  }))
                }
                min={1}
                max={500}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ubicación en el mapa *</Label>
            <MapPicker
              onLocationSelect={(lat, lng) => {
                setCurrentZone((prev) => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                }));
              }}
              initialPosition={[19.4326, -99.1332]}
            />
            {currentZone.latitude !== 0 && currentZone.longitude !== 0 && (
              <p className="text-xs text-muted-foreground">
                Coordenadas seleccionadas: {currentZone.latitude.toFixed(4)},{" "}
                {currentZone.longitude.toFixed(4)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zoneDescription">Descripción de cobertura</Label>
            <Textarea
              id="zoneDescription"
              placeholder="Ej: Atendemos toda la zona metropolitana del norte..."
              value={currentZone.description}
              onChange={(e) =>
                setCurrentZone((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          <Button
            type="button"
            onClick={addCoverageZone}
            disabled={
              !currentZone.name ||
              currentZone.latitude === 0 ||
              currentZone.longitude === 0 ||
              !currentZone.radiusKm
            }
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar zona de cobertura
          </Button>
        </div>

        {/* Coverage zones list */}
        {coverageZones.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label>Zonas agregadas ({coverageZones.length})</Label>
              {coverageZones.map((zone) => (
                <div
                  key={zone.name}
                  className="p-4 rounded-lg border bg-muted/30 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/30">
                          {zone.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Radio: {zone.radiusKm} km
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Coordenadas: {zone.latitude.toFixed(4)},{" "}
                        {zone.longitude.toFixed(4)}
                      </p>
                      {zone.description && (
                        <p className="text-sm mt-2">{zone.description}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCoverageZone(zone.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {coverageZones.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No has agregado zonas de cobertura aún. Define las áreas donde
            ofreces tus servicios.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
