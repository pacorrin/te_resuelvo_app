/** Parse tender coordinate strings (may be empty or invalid). */
function parseCoord(value: string | null | undefined): number | null {
  if (value == null || String(value).trim() === "") return null;
  const n = Number.parseFloat(String(value).trim());
  return Number.isFinite(n) ? n : null;
}

export type MapsLinkInput = {
  address: string;
  latitude?: string | null;
  longitude?: string | null;
};

/**
 * Prefer exact lat/lng for Google Maps; fall back to address search when coords are missing or invalid.
 */
export function buildGoogleMapsSearchUrl(input: MapsLinkInput): string {
  const lat = parseCoord(input.latitude);
  const lng = parseCoord(input.longitude);
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  const q = (input.address ?? "").trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q || "—")}`;
}

export function hasUsableMapCoordinates(input: MapsLinkInput): boolean {
  return (
    parseCoord(input.latitude) != null && parseCoord(input.longitude) != null
  );
}
