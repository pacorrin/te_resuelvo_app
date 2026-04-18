"use client";

import * as React from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";

type LatLng = { latitude: number; longitude: number };

export interface MapboxAddressDetails {
  formattedAddress: string;
  shortAddress?: string;
  streetNumber?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  featureId?: string;
  placeType?: string[];
}

const RADIUS_SOURCE_ID = "mapbox-location-radius";
const RADIUS_FILL_LAYER_ID = "mapbox-location-radius-fill";
const RADIUS_LINE_LAYER_ID = "mapbox-location-radius-line";

/** Approximate WGS84 circle (km) as a polygon for map display. */
function createCirclePolygon(
  lng: number,
  lat: number,
  radiusKm: number,
  steps = 64,
) {
  const ring: [number, number][] = [];
  const latRad = (lat * Math.PI) / 180;
  const kmPerDegLat = 110.574;
  const kmPerDegLng = 111.32 * Math.cos(latRad);
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * 2 * Math.PI;
    const dxKm = radiusKm * Math.cos(theta);
    const dyKm = radiusKm * Math.sin(theta);
    const dLat = dyKm / kmPerDegLat;
    const dLng = dxKm / kmPerDegLng;
    ring.push([lng + dLng, lat + dLat]);
  }
  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "Polygon" as const,
      coordinates: [ring],
    },
  };
}

function boundsFromRing(ring: [number, number][]) {
  let minLng = ring[0][0];
  let maxLng = ring[0][0];
  let minLat = ring[0][1];
  let maxLat = ring[0][1];
  for (const [lng, lat] of ring) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ] as [[number, number], [number, number]];
}

const DEFAULT_LOCATION: LatLng = {
  latitude: 19.4326,
  longitude: -99.1332,
};

/** Public asset; Next.js serves `/public` at site root. */
const MAP_MARKER_ICON_SRC = "/logo_ico.svg";

function createMapMarkerElement(): HTMLDivElement {
  const root = document.createElement("div");
  root.style.lineHeight = "0";
  const img = document.createElement("img");
  img.src = MAP_MARKER_ICON_SRC;
  img.alt = "Ubicación seleccionada";
  img.draggable = false;
  img.style.width = "40px";
  img.style.height = "auto";
  img.style.display = "block";
  img.style.pointerEvents = "none";
  img.style.filter = "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.28))";
  root.appendChild(img);
  return root;
}

interface MapboxLocationPickerProps {
  onLocationSelect: (
    location: LatLng,
    details?: MapboxAddressDetails | null,
  ) => void;
  /**
   * When omitted, the map asks for the browser location (with fallback to CDMX).
   * When set (e.g. saved coords), that point is used and geolocation is skipped.
   */
  initialLocation?: LatLng;
  /** When set (> 0), draws a km-radius circle around the selected point. */
  radiusKm?: number;
  /** Seed for the address search field when the picker mounts (e.g. text typed before opening). */
  initialAddressQuery?: string;
  /** Label shown above the address search input. */
  searchLabel?: string;
  placeholder?: string;
  heightClassName?: string;
}

declare global {
  interface Window {
    mapboxgl?: any;
  }
}

const MAPBOX_GL_JS =
  "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
const MAPBOX_GL_CSS =
  "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";

let mapboxCssLoaded = false;
let mapboxScriptLoading: Promise<void> | null = null;

async function ensureMapboxLoaded() {
  if (typeof window === "undefined") return;
  if (window.mapboxgl) return;

  if (!mapboxCssLoaded) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = MAPBOX_GL_CSS;
    document.head.appendChild(link);
    mapboxCssLoaded = true;
  }

  if (!mapboxScriptLoading) {
    mapboxScriptLoading = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = MAPBOX_GL_JS;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Mapbox GL JS"));
      document.head.appendChild(script);
    });
  }

  return mapboxScriptLoading;
}

export function MapboxLocationPicker({
  onLocationSelect,
  initialLocation,
  radiusKm,
  initialAddressQuery,
  searchLabel = "Busqueda",
  placeholder = "Buscar dirección…",
  heightClassName = "h-96",
}: MapboxLocationPickerProps) {
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);
  const mapCreatedRef = React.useRef(false);
  const geoFailedRef = React.useRef(false);
  const reverseGeocodeRequestRef = React.useRef(0);

  const [geoLocation, setGeoLocation] = React.useState<LatLng | null>(null);
  const [geoSettled, setGeoSettled] = React.useState(
    () => initialLocation != null,
  );

  const [addressQuery, setAddressQuery] = React.useState(
    () => initialAddressQuery?.trim() ?? "",
  );
  const [addressResults, setAddressResults] = React.useState<
    { placeName: string; center: [number, number] }[]
  >([]);
  const [selected, setSelected] = React.useState<LatLng>(
    () => initialLocation ?? DEFAULT_LOCATION,
  );
  const [isMapReady, setIsMapReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const reverseGeocode = React.useCallback(
    async (location: LatLng): Promise<MapboxAddressDetails | null> => {
      if (!token) return null;
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.longitude},${location.latitude}.json?access_token=${token}&types=address,place,postcode,region,country&limit=1`,
        );
        const data = await response.json();
        const feature = Array.isArray(data?.features) ? data.features[0] : null;
        if (!feature) return null;

        const context = Array.isArray(feature?.context) ? feature.context : [];
        const findContextText = (prefix: string): string | undefined => {
          const item = context.find(
            (c: any) =>
              typeof c?.id === "string" &&
              c.id.startsWith(prefix) &&
              typeof c?.text === "string",
          );
          return item?.text;
        };

        return {
          formattedAddress:
            typeof feature?.place_name === "string" ? feature.place_name : "",
          shortAddress:
            typeof feature?.text === "string" ? feature.text : undefined,
          streetNumber:
            typeof feature?.address === "string" ? feature.address : undefined,
          postalCode: findContextText("postcode."),
          city: findContextText("place."),
          state: findContextText("region."),
          country: findContextText("country."),
          featureId: typeof feature?.id === "string" ? feature.id : undefined,
          placeType: Array.isArray(feature?.place_type)
            ? feature.place_type
            : undefined,
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    [token],
  );

  React.useEffect(() => {
    if (initialLocation != null) {
      setGeoSettled(true);
      return;
    }

    let cancelled = false;
    geoFailedRef.current = false;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      geoFailedRef.current = true;
      setGeoLocation(DEFAULT_LOCATION);
      setGeoSettled(true);
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        geoFailedRef.current = false;
        setGeoLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setGeoSettled(true);
      },
      () => {
        if (cancelled) return;
        geoFailedRef.current = true;
        setGeoLocation(DEFAULT_LOCATION);
        setGeoSettled(true);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 300_000,
        timeout: 12_000,
      },
    );

    return () => {
      cancelled = true;
    };
  }, [initialLocation?.latitude, initialLocation?.longitude]);

  const setMarker = React.useCallback(
    (location: LatLng, options?: { notifyParent?: boolean }) => {
      const notify = options?.notifyParent !== false;
      setSelected(location);
      if (notify) onLocationSelect(location, null);

      if (mapRef.current && window.mapboxgl) {
        const { longitude, latitude } = location;
        if (!markerRef.current) {
          markerRef.current = new window.mapboxgl.Marker({
            element: createMapMarkerElement(),
            draggable: false,
            anchor: "bottom",
          })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);
        } else {
          markerRef.current.setLngLat([longitude, latitude]);
        }
      }

      if (!notify) return;

      const requestId = ++reverseGeocodeRequestRef.current;
      void reverseGeocode(location).then((details) => {
        if (requestId !== reverseGeocodeRequestRef.current) return;
        if (details?.formattedAddress) {
          setAddressQuery(details.formattedAddress);
        }
        onLocationSelect(location, details);
      });
    },
    [onLocationSelect, reverseGeocode],
  );

  React.useEffect(() => {
    if (!token) {
      setError(
        "Falta NEXT_PUBLIC_MAPBOX_TOKEN para cargar el mapa. Agrega tu token público en el .env.",
      );
      return;
    }
    if (!geoSettled || mapCreatedRef.current) return;

    const center: LatLng =
      initialLocation ?? geoLocation ?? DEFAULT_LOCATION;

    let cancelled = false;
    ensureMapboxLoaded()
      .then(() => {
        if (cancelled) return;
        if (!window.mapboxgl) throw new Error("mapboxgl is not available");

        window.mapboxgl.accessToken = token;
        if (!mapContainerRef.current) return;

        mapRef.current = new window.mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [center.longitude, center.latitude],
          zoom: 12,
        });

        mapCreatedRef.current = true;

        mapRef.current.on("load", () => {
          if (cancelled) return;
          setIsMapReady(true);
          const notifyParent =
            initialLocation != null || !geoFailedRef.current;
          setMarker(center, { notifyParent });

          mapRef.current.on("click", (e: any) => {
            const lng = e.lngLat?.lng;
            const lat = e.lngLat?.lat;
            if (typeof lat !== "number" || typeof lng !== "number") return;
            setMarker({ latitude: lat, longitude: lng });
          });
        });
      })
      .catch((e) => {
        console.error(e);
        mapCreatedRef.current = false;
        setError(
          "No se pudo cargar Mapbox. Revisa tu token y conexión a internet.",
        );
      });

    return () => {
      cancelled = true;
      if (mapRef.current) mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
      mapCreatedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, geoSettled]);

  React.useEffect(() => {
    if (!isMapReady || initialLocation == null) return;
    setMarker(initialLocation, { notifyParent: false });
  }, [
    initialLocation?.latitude,
    initialLocation?.longitude,
    isMapReady,
    setMarker,
    initialLocation,
  ]);

  React.useEffect(() => {
    if (!isMapReady || !mapRef.current || !mapContainerRef.current) return;

    const map = mapRef.current as { resize: () => void };
    const container = mapContainerRef.current;

    const resizeMap = () => {
      map.resize();
    };

    // Dialog open/animation can change dimensions after initial load.
    resizeMap();
    requestAnimationFrame(resizeMap);
    setTimeout(resizeMap, 180);

    const observer = new ResizeObserver(() => {
      resizeMap();
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isMapReady]);

  React.useEffect(() => {
    if (!isMapReady || !mapRef.current) return;
    const map = mapRef.current;
    const show =
      typeof radiusKm === "number" &&
      Number.isFinite(radiusKm) &&
      radiusKm > 0;

    const emptyCollection = {
      type: "FeatureCollection" as const,
      features: [] as object[],
    };

    if (!show) {
      const existing = map.getSource(RADIUS_SOURCE_ID) as
        | { setData?: (data: object) => void }
        | undefined;
      existing?.setData?.(emptyCollection);
      return;
    }

    if (!map.getSource(RADIUS_SOURCE_ID)) {
      map.addSource(RADIUS_SOURCE_ID, {
        type: "geojson",
        data: emptyCollection,
      });
      map.addLayer({
        id: RADIUS_FILL_LAYER_ID,
        type: "fill",
        source: RADIUS_SOURCE_ID,
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.25,
        },
      });
      map.addLayer({
        id: RADIUS_LINE_LAYER_ID,
        type: "line",
        source: RADIUS_SOURCE_ID,
        paint: {
          "line-color": "#2563eb",
          "line-width": 2,
          "line-opacity": 0.9,
        },
      });
    }

    const source = map.getSource(RADIUS_SOURCE_ID) as {
      setData: (data: object) => void;
    };
    const circle = createCirclePolygon(
      selected.longitude,
      selected.latitude,
      radiusKm,
    );
    source.setData({
      type: "FeatureCollection",
      features: [circle],
    });

    const ring = circle.geometry.coordinates[0] as [number, number][];
    const bounds = boundsFromRing(ring);
    map.fitBounds(bounds, {
      padding: 48,
      duration: 450,
      maxZoom: 17,
      essential: true,
    });
  }, [isMapReady, selected.latitude, selected.longitude, radiusKm]);

  const searchAddress = async (q: string) => {
    const query = q.trim();
    if (!query || !token) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query,
        )}.json?access_token=${token}&autocomplete=true&limit=5&types=address,place`,
      );
      const json = await res.json();

      const features = Array.isArray(json?.features) ? json.features : [];
      setAddressResults(
        features
          .filter(
            (f: any) =>
              Array.isArray(f?.center) &&
              typeof f?.place_name === "string",
          )
          .map((f: any) => ({ placeName: f.place_name, center: f.center })),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const commitAddress = (center: [number, number], placeName?: string) => {
    const [lng, lat] = center;
    if (typeof lat !== "number" || typeof lng !== "number") return;
    if (mapRef.current) {
      const hasRadius =
        typeof radiusKm === "number" &&
        Number.isFinite(radiusKm) &&
        radiusKm > 0;
      if (hasRadius) {
        mapRef.current.jumpTo({ center: [lng, lat], essential: true });
      } else {
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          essential: true,
        });
      }
    }
    setMarker({ latitude: lat, longitude: lng });
    if (placeName) setAddressQuery(placeName);
    setAddressResults([]);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="address-search">{searchLabel}</Label>
        <div className="flex items-center gap-2">
          <Input
            id="address-search"
            value={addressQuery}
            placeholder={placeholder}
            onChange={(e) => setAddressQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void searchAddress(addressQuery);
              }
            }}
            autoComplete="off"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => void searchAddress(addressQuery)}
            disabled={!token}
          >
            Buscar
          </Button>
        </div>
        {addressResults.length > 0 && (
          <div className="max-h-40 overflow-auto rounded-md border bg-popover text-popover-foreground">
            {addressResults.map((r) => (
              <button
                key={r.placeName}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => commitAddress(r.center, r.placeName)}
              >
                {r.placeName}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div
          ref={mapContainerRef}
          className={`${heightClassName} w-full rounded-md border bg-muted/30 cursor-crosshair relative overflow-hidden`}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        >
          {!geoSettled && initialLocation == null && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
              <div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                Obteniendo tu ubicación…
              </div>
            </div>
          )}
          {geoSettled && !isMapReady && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
              <div className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                Cargando mapa...
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-md border bg-background px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Lat: {selected.latitude.toFixed(6)} / Lng:{" "}
          {selected.longitude.toFixed(6)}
          {typeof radiusKm === "number" &&
            Number.isFinite(radiusKm) &&
            radiusKm > 0 && (
              <span className="text-muted-foreground">
                {" "}
                · Radio: {radiusKm} km
              </span>
            )}
        </div>
      </div>
    </div>
  );
}

