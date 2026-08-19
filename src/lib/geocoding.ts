import { haversineDistanceKm } from "@/lib/geo";

export const DEFAULT_MAP_CENTER: [number, number] = [40.7128, -74.006]; // fallback: NYC

export interface GeocodeResult {
  displayName: string;
  primaryLabel: string;
  lat: number;
  lng: number;
  distanceKm?: number;
}

// Nominatim (OpenStreetMap's free geocoder) — fine for this app's low, personal
// query volume. No API key needed. A heavier-traffic deployment should switch
// to a paid geocoder or self-hosted Nominatim per their usage policy.
//
// `bias` (already-placed pin, or the user's device location) softly prefers
// results near that point via Nominatim's viewbox param, and lets us sort
// and label results by actual distance client-side.
export async function geocode(
  query: string,
  signal: AbortSignal,
  bias?: [number, number] | null
): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
    q: query,
  });
  if (bias) {
    const [lat, lng] = bias;
    const span = 0.4; // degrees — a soft ~40km-ish box, not a hard filter
    params.set("viewbox", `${lng - span},${lat + span},${lng + span},${lat - span}`);
    params.set("bounded", "0");
  }
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Geocoding request failed");
  const data = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    name?: string;
    address?: Record<string, string>;
  }>;
  const results = data.map((r) => ({
    displayName: r.display_name,
    primaryLabel: r.name || r.address?.amenity || r.address?.shop || r.display_name.split(",")[0],
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  }));

  if (!bias) return results;

  return results
    .map((r) => ({ ...r, distanceKm: haversineDistanceKm(bias, [r.lat, r.lng]) }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/** Looks up a name + address for a pin dropped by tap or geolocation (rather than search), so the user never has to type one manually. */
export async function reverseGeocode(
  pos: [number, number],
  signal: AbortSignal
): Promise<{ label: string; address: string } | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(pos[0]),
    lon: String(pos[1]),
    zoom: "18",
    addressdetails: "1",
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const r = (await res.json()) as {
    display_name?: string;
    name?: string;
    address?: Record<string, string>;
  };
  if (!r.display_name) return null;
  const label =
    r.name || r.address?.amenity || r.address?.shop || r.address?.cafe || r.display_name.split(",")[0];
  return { label, address: r.display_name };
}
