"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { Label } from "@/src/components/ui/label";
import type { MapboxAddressDetails } from "@/src/components/MapboxLocationPicker";

const MapboxLocationPicker = dynamic(
  () =>
    import("@/src/components/MapboxLocationPicker").then((m) => ({
      default: m.MapboxLocationPicker,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-white/10 bg-slate-900/50 px-3 py-8 text-center text-sm text-slate-300">
        Cargando mapa…
      </div>
    ),
  },
);

export type HeroRequestVisualProps = {
  mapPickerMounted: boolean;
  addressLine: string;
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: (
    location: { latitude: number; longitude: number },
    details?: MapboxAddressDetails | null,
  ) => void;
};

export function HeroRequestVisual({
  mapPickerMounted,
  addressLine,
  selectedLocation,
  onLocationSelect,
}: HeroRequestVisualProps) {
  if (mapPickerMounted) {
    return (
      <div className="flex min-h-[280px] flex-col gap-3 overflow-hidden  p-4 lg:min-h-[420px] lg:p-5">
        <Label className="flex items-center gap-2 text-xs font-semibold ">
          <MapPin className="h-4 w-4 text-primary" />
          Ubicación precisa
        </Label>
        <p className="text-xs text-slate-400">
          Selecciona o marca tu ubicación exacta en el mapa para garantizar que podamos conectarte con el profesional disponible más cercano a ti.
     
        </p>
        <div className="min-h-0 flex-1">
          <MapboxLocationPicker
            initialLocation={
              selectedLocation
                ? {
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng,
                  }
                : undefined
            }
            initialAddressQuery={addressLine}
            onLocationSelect={onLocationSelect}
            heightClassName="h-[450px]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-2xl bg-linear-to-b from-slate-800 to-slate-950 p-6 shadow-inner lg:min-h-[580px]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute left-[12%] top-[18%] text-blue-400 drop-shadow-lg">
        <MapPin className="h-8 w-8 text-secondary" strokeWidth={2} />
      </div>
      <div className="pointer-events-none absolute right-[22%] top-[28%] text-blue-300 drop-shadow-lg">
        <MapPin className="h-6 w-6 text-secondary" strokeWidth={2} />
      </div>
      <div className="pointer-events-none absolute bottom-[42%] left-[38%] text-blue-500 drop-shadow-lg">
        <MapPin className="h-7 w-7" strokeWidth={2} />
      </div>
      <div className="pointer-events-none absolute right-[14%] top-[12%] text-blue-400/80 drop-shadow-lg">
        <MapPin className="h-5 w-5" strokeWidth={2} />
      </div>
    </div>
  );
}
