import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapContainer, Marker, useMap, useMapEvents } from "react-leaflet";
import { addSpot } from "@/lib/spotsStore";
import { fixLeafletIcons } from "@/lib/leafletIcons";
import OpenFreeMapLayer from "@/components/OpenFreeMapLayer";
import { haversineDistanceKm, formatDistanceKm } from "@/lib/geo";

fixLeafletIcons();

const DEFAULT_CENTER: [number, number] = [40.7128, -74.006]; // fallback: NYC

interface GeocodeResult {
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
async function geocode(
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

/** Looks up a name for a pin dropped by tap or geolocation (rather than search), so the user never has to type one manually. */
async function reverseGeocode(pos: [number, number], signal: AbortSignal): Promise<string | null> {
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
  return r.name || r.address?.amenity || r.address?.shop || r.address?.cafe || r.display_name.split(",")[0];
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function LocationPicker({
  position,
  onPick,
}: {
  position: [number, number] | null;
  onPick: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

/** Keeps the map view in sync when the pin moves programmatically (search select, geolocation) — MapContainer's `center` prop only applies on first mount. */
function RecenterOnMove({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 15));
    }
  }, [position, map]);
  return null;
}

export default function AddSpotPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [drinkOrdered, setDrinkOrdered] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(4);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justPlaced, setJustPlaced] = useState(false);
  const [namingLoading, setNamingLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 400);
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);

  // Best-effort device location, used only to bias/sort search results by
  // proximity — silently ignored if unavailable or denied.
  const [deviceLocation, setDeviceLocation] = useState<[number, number] | null>(null);
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setDeviceLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { maximumAge: 5 * 60 * 1000, timeout: 5000 }
    );
  }, []);

  // Prefer the pin the user already placed (most intentional signal); fall
  // back to device location so results are still distance-sorted before that.
  const searchBias = position ?? deviceLocation;

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 3) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    geocode(trimmed, controller.signal, searchBias)
      .then((results) => {
        setSearchResults(results);
        setSearching(false);
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setSearching(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-searching on every pixel of pin movement would be excessive; bias only needs to be "close enough"
  }, [debouncedQuery]);

  const mapSectionRef = useRef<HTMLDivElement>(null);

  function revealMap() {
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setJustPlaced(true);
    setTimeout(() => setJustPlaced(false), 1600);
  }

  // Every way of setting a location — search, tap, geolocation — feeds the
  // Name field automatically. The user never has to type it themselves,
  // though the field stays editable in case the auto name needs a tweak.
  function placePin(pos: [number, number], knownLabel?: string, reveal = true) {
    setPosition(pos);
    setError(null);
    if (reveal) revealMap();

    if (knownLabel) {
      setName(knownLabel);
      return;
    }
    const controller = new AbortController();
    setNamingLoading(true);
    reverseGeocode(pos, controller.signal)
      .then((label) => {
        if (label) setName(label);
      })
      .finally(() => setNamingLoading(false));
  }

  function selectSearchResult(result: GeocodeResult) {
    placePin([result.lat, result.lng], result.primaryLabel);
    setSearchQuery("");
    setSearchResults([]);
    setResultsOpen(false);
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setError("Your browser doesn't support location — tap the map to place a pin instead.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        placePin([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location — tap the map to place a pin instead.");
        setLocating(false);
      }
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!position) {
      setError("Search for it, use your location, or tap the map to set where this spot is.");
      return;
    }
    if (!name.trim()) {
      setError("Couldn't find a name for that spot — type one in below.");
      return;
    }
    addSpot({
      name: name.trim(),
      drinkOrdered: drinkOrdered.trim() || undefined,
      notes: notes.trim() || undefined,
      rating,
      lat: position[0],
      lng: position[1],
    });
    navigate("/spots");
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12 pt-8">
      <Link to="/spots" className="text-sm text-husk/50 hover:text-husk/80">
        &larr; Coffee spots
      </Link>

      <header className="mt-4 mb-5">
        <h1 className="font-display text-2xl font-semibold italic text-husk">
          Log a coffee spot
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="spot-search" className="mb-1 block text-xs uppercase tracking-wide text-husk/50">
            Find it
          </label>
          <div className="relative">
            <input
              id="spot-search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setResultsOpen(true);
              }}
              onFocus={() => setResultsOpen(true)}
              onBlur={() => setTimeout(() => setResultsOpen(false), 150)}
              placeholder="Cafe name, address, or postal code"
              className="w-full rounded border border-husk/15 bg-bark px-3 py-2 text-sm text-husk placeholder:text-husk/30"
              autoComplete="off"
            />
            {searching && (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-husk/30">
                Searching…
              </span>
            )}

            {resultsOpen && searchResults.length > 0 && (
              <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-56 overflow-y-auto rounded border border-husk/15 bg-bark shadow-lg shadow-black/30">
                {searchResults.map((result, i) => (
                  <li key={`${result.lat}-${result.lng}-${i}`}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectSearchResult(result)}
                      className="block w-full px-3 py-2 text-left text-sm text-husk/80 hover:bg-char"
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate font-medium text-husk">
                          {result.primaryLabel}
                        </span>
                        {result.distanceKm !== undefined && (
                          <span className="shrink-0 font-mono text-[11px] text-roast-light">
                            {formatDistanceKm(result.distanceKm)}
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-husk/40">
                        {result.displayName}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {resultsOpen &&
              !searching &&
              debouncedQuery.trim().length >= 3 &&
              searchResults.length === 0 && (
                <div className="absolute inset-x-0 top-full z-10 mt-1 rounded border border-husk/15 bg-bark px-3 py-2 text-xs text-husk/40 shadow-lg shadow-black/30">
                  No matches — try a broader search, or place the pin manually below.
                </div>
              )}
          </div>
        </div>

        <div>
          <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-wide text-husk/50">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={namingLoading ? "Looking up name…" : "Filled in automatically once you set a location"}
              className="w-full rounded border border-husk/15 bg-bark px-3 py-2 text-sm text-husk placeholder:text-husk/30"
            />
            {namingLoading && (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-husk/30">
                …
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-husk/40">
            Picked up from the location you set below — edit it if it's not quite right.
          </p>
        </div>

        <div>
          <label htmlFor="drink" className="mb-1 block text-xs uppercase tracking-wide text-husk/50">
            What you had
          </label>
          <input
            id="drink"
            value={drinkOrdered}
            onChange={(e) => setDrinkOrdered(e.target.value)}
            placeholder="e.g. Oat milk cortado"
            className="w-full rounded border border-husk/15 bg-bark px-3 py-2 text-sm text-husk placeholder:text-husk/30"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-husk/50">
            Rating
          </label>
          <div className="flex gap-1" role="radiogroup" aria-label="Rating out of 5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                onClick={() => setRating(n)}
                className={`text-2xl ${n <= rating ? "text-roast-light" : "text-husk/20"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="mb-1 block text-xs uppercase tracking-wide text-husk/50">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Tasting notes, vibe, anything worth remembering"
            className="w-full rounded border border-husk/15 bg-bark px-3 py-2 text-sm text-husk placeholder:text-husk/30"
          />
        </div>

        <div ref={mapSectionRef} className="scroll-mt-6">
          <label className="mb-1 block text-xs uppercase tracking-wide text-husk/50">
            Location {position && <span className="text-moss">— set</span>}
          </label>
          <div
            className={`h-56 w-full overflow-hidden rounded border transition-shadow duration-500 ${
              justPlaced ? "border-roast-light ring-4 ring-roast-light/30" : "border-husk/10"
            }`}
          >
            <MapContainer
              center={position ?? DEFAULT_CENTER}
              zoom={position ? 14 : 3}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <OpenFreeMapLayer />
              <LocationPicker position={position} onPick={(pos) => placePin(pos, undefined, false)} />
              <RecenterOnMove position={position} />
            </MapContainer>
          </div>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="mt-2 text-xs text-roast-light underline decoration-dotted underline-offset-2 disabled:opacity-50"
          >
            {locating ? "Locating…" : "Use my current location"}
          </button>
          <p className="mt-1 text-xs text-husk/40">
            Selecting a search result above sets this automatically — or tap the map to adjust the pin.
          </p>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-roast-light py-3 text-center font-semibold text-char shadow-lg shadow-roast-light/20 transition-transform active:scale-[0.98]"
        >
          Save Spot
        </button>
      </form>
    </main>
  );
}
