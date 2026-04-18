import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

export function MapPicker({
  onLocationSelect,
  initialPosition = [-34.6037, -58.3816],
}: MapPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel coordinates to approximate lat/lng
    // This is a simple approximation for Buenos Aires area
    const lat =
      initialPosition[0] + ((rect.height / 2 - y) / rect.height) * 0.2;
    const lng = initialPosition[1] + ((x - rect.width / 2) / rect.width) * 0.2;

    setMarkerPosition({ x, y });
    onLocationSelect(lat, lng);
  };

  if (!mounted) {
    return (
      <div className="h-[300px] w-full rounded-md border bg-muted flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        onClick={handleMapClick}
        className="h-[300px] w-full rounded-md border bg-muted/30 cursor-crosshair relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted/80" />

        {/* Center indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border" />

        {/* Instructions */}
        {!markerPosition && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-md border text-sm text-muted-foreground">
              Haz clic para marcar tu ubicación
            </div>
          </div>
        )}

        {/* Marker */}
        {markerPosition && (
          <div
            className="absolute -translate-x-1/2 -translate-y-full animate-in zoom-in duration-200"
            style={{
              left: `${markerPosition.x}px`,
              top: `${markerPosition.y}px`,
            }}
          >
            <MapPin className="w-8 h-8 text-primary fill-primary/20" />
          </div>
        )}

        {/* Compass */}
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm p-2 rounded-md border text-xs font-medium">
          N
        </div>

        {/* Scale indicator */}
        <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md border text-xs text-muted-foreground">
          ~2 km
        </div>
      </div>
    </div>
  );
}
