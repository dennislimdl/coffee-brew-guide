import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import {
  PlaceSuggestion,
  PlaceDetails,
  searchPlaces,
  getPlaceDetails,
  reverseGeocode,
} from "@/lib/googlePlaces";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 }; // fallback: NYC

export default function AddSpotPage() {
  const navigate = useNavigate();

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 350);
  const [searchResults, setSearchResults] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);

  // Best-effort device location, used only to bias search results by
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

  const searchBias = position ?? deviceLocation;

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 3) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    searchPlaces(trimmed, searchBias)
      .then((results) => {
        if (!cancelled) {
          setSearchResults(results);
          setSearching(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSearching(false);
          setError("Search failed — check that Places API (New) is enabled.");
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-searching on every pixel of pin movement would be excessive; bias only needs to be "close enough"
  }, [debouncedQuery]);

  function applyPlace(details: PlaceDetails) {
    setPosition([details.lat, details.lng]);
    setName(details.name);
    setAddress(details.address);
    setPhotos(details.photoUrls);
    setError(null);
  }

  async function selectSearchResult(suggestion: PlaceSuggestion) {
    setSearchQuery("");
    setSearchResults([]);
    setResultsOpen(false);
    setPlaceLoading(true);
    try {
      const details = await getPlaceDetails(suggestion.placeId);
      if (details) applyPlace(details);
      else setError("Couldn't load that place — try another result.");
    } catch {
      setError("Couldn't load that place — try another result.");
    } finally {
      setPlaceLoading(false);
    }
  }

  async function placePinManually(pos: [number, number]) {
    setPosition(pos);
    setName(null);
    setAddress(null);
    setPhotos([]);
    setError(null);
    setPlaceLoading(true);
    try {
      const result = await reverseGeocode(pos);
      if (result) {
        setName(result.label);
        setAddress(result.address);
      }
    } finally {
      setPlaceLoading(false);
    }
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
        placePinManually([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location — tap the map to place a pin instead.");
        setLocating(false);
      }
    );
  }

  function reset() {
    setPosition(null);
    setName(null);
    setAddress(null);
    setPhotos([]);
    setError(null);
  }

  function confirmPlace() {
    if (!position) return;
    navigate("/spots/new/details", {
      state: { position, name: name ?? "", address: address ?? "", photos },
    });
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12 pt-8">
      <Link to="/spots" className="text-sm text-husk/50 hover:text-husk/80">
        &larr; Coffee spots
      </Link>

      <header className="mt-4 mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-roast-light">
          Step 1 of 2
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold italic text-husk">
          Find your spot
        </h1>
      </header>

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
          <ul className="absolute inset-x-0 top-full z-[1000] mt-1 max-h-56 overflow-y-auto rounded border border-husk/15 bg-bark shadow-lg shadow-black/30">
            {searchResults.map((result) => (
              <li key={result.placeId}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSearchResult(result)}
                  className="block w-full px-3 py-2 text-left text-sm text-husk/80 hover:bg-char"
                >
                  <span className="block truncate font-medium text-husk">
                    {result.primaryLabel}
                  </span>
                  <span className="block truncate text-xs text-husk/40">
                    {result.secondaryLabel}
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
            <div className="absolute inset-x-0 top-full z-[1000] mt-1 rounded border border-husk/15 bg-bark px-3 py-2 text-xs text-husk/40 shadow-lg shadow-black/30">
              No matches — try a broader search, or place the pin manually below.
            </div>
          )}
      </div>

      <div
        className={`mt-4 w-full overflow-hidden rounded-xl border transition-all duration-300 ${
          position ? "h-64 border-roast-light/40" : "h-56 border-husk/10"
        }`}
      >
        <Map
          center={position ? { lat: position[0], lng: position[1] } : DEFAULT_CENTER}
          zoom={position ? 17 : 3}
          mapId="DEMO_MAP_ID"
          gestureHandling="greedy"
          disableDefaultUI={false}
          streetViewControl={false}
          mapTypeControl={false}
          onClick={(e) => {
            if (e.detail.latLng) {
              placePinManually([e.detail.latLng.lat, e.detail.latLng.lng]);
            }
          }}
        >
          {position && <AdvancedMarker position={{ lat: position[0], lng: position[1] }} />}
        </Map>
      </div>

      {!position ? (
        <>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="mt-2 text-xs text-roast-light underline decoration-dotted underline-offset-2 disabled:opacity-50"
          >
            {locating ? "Locating…" : "Use my current location"}
          </button>
          <p className="mt-1 text-xs text-husk/40">
            Search above, use your location, or tap the map to drop a pin.
          </p>
        </>
      ) : (
        <div className="mt-4 animate-fade-in-up rounded-xl border border-husk/10 bg-bark p-4 shadow-md shadow-black/10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-husk/30">
            Is this the right place?
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-husk">
            {placeLoading ? "Looking up name…" : name || "Unnamed location"}
          </p>
          {address && <p className="mt-0.5 text-xs text-husk/50">{address}</p>}

          {photos.length > 0 && (
            <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {photos.map((url, i) => (
                <img
                  key={url}
                  src={url}
                  alt={`${name ?? "Place"} photo ${i + 1}`}
                  loading="lazy"
                  className="h-24 w-32 shrink-0 rounded-lg object-cover"
                />
              ))}
            </div>
          )}

          <p className="mt-2 text-xs text-husk/40">
            Tap the map above to nudge the pin if it's off.
          </p>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl border border-husk/15 py-2.5 text-center text-sm text-husk/70"
            >
              Search again
            </button>
            <button
              type="button"
              onClick={confirmPlace}
              className="flex-1 rounded-xl bg-roast-light py-2.5 text-center text-sm font-semibold text-char shadow-lg shadow-roast-light/20 transition-transform active:scale-[0.98]"
            >
              This is it &rarr;
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </main>
  );
}
