import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { getAllSpots, deleteSpot, updateSpot } from "@/lib/spotsStore";
import { getPlaceDetails, findPlaceByText } from "@/lib/googlePlaces";
import { CoffeeSpot } from "@/types";

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 }; // fallback: NYC

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-roast-light" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-husk/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

/** Zooms out to fit every spot on screen once there's more than one. */
function FitToSpots({ spots }: { spots: CoffeeSpot[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map || spots.length < 2) return;
    const bounds = new google.maps.LatLngBounds();
    spots.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
    map.fitBounds(bounds, 48);
  }, [map, spots]);
  return null;
}

/** Pans (and zooms in on) whichever spot was just picked from the list, so tapping a card takes you straight to it on the map. */
function PanToSelected({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !position) return;
    map.panTo(position);
    if (map.getZoom() != null && map.getZoom()! < 15) map.setZoom(15);
  }, [map, position]);
  return null;
}

/**
 * Google's Place photo URLs are short-lived and not meant for long-term
 * storage, so a photo saved a while ago can start 404ing. If a spot is
 * linked to a placeId, silently re-fetch fresh photos/reviews the first
 * time one of its images fails, and persist the refresh so it sticks.
 */
function PhotoStrip({ spot, onRefreshed }: { spot: CoffeeSpot; onRefreshed: () => void }) {
  const refreshingRef = useRef(false);

  function handleError() {
    if (!spot.placeId || refreshingRef.current) return;
    refreshingRef.current = true;
    getPlaceDetails(spot.placeId)
      .then((details) => {
        if (!details) return;
        updateSpot(spot.id, { photos: details.photoUrls, reviews: details.reviews });
        onRefreshed();
      })
      .catch(() => {})
      .finally(() => {
        refreshingRef.current = false;
      });
  }

  if (!spot.photos || spot.photos.length === 0) return null;

  return (
    <div className="mt-2.5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {spot.photos.map((url, i) => (
        <img
          key={url}
          src={url}
          alt={`${spot.name} photo ${i + 1}`}
          loading="lazy"
          onError={handleError}
          className="h-20 w-28 shrink-0 rounded-lg object-cover bg-char/40"
        />
      ))}
    </div>
  );
}

export default function SpotsPage() {
  const [spots, setSpots] = useState<CoffeeSpot[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [backfilling, setBackfilling] = useState(false);
  const [backfillStatus, setBackfillStatus] = useState<string | null>(null);

  function refresh() {
    setSpots(getAllSpots());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleDelete(id: string) {
    deleteSpot(id);
    refresh();
  }

  async function backfillSpots() {
    const toBackfill = spots.filter((s) => !s.placeId);
    if (toBackfill.length === 0) return;

    setBackfilling(true);
    let updated = 0;
    for (const [i, spot] of toBackfill.entries()) {
      setBackfillStatus(`Backfilling ${i + 1} of ${toBackfill.length}…`);
      try {
        const query = [spot.name, spot.address].filter(Boolean).join(", ");
        const details = await findPlaceByText(query, [spot.lat, spot.lng]);
        if (details) {
          updateSpot(spot.id, {
            placeId: details.placeId,
            photos: details.photoUrls.length > 0 ? details.photoUrls : undefined,
            reviews: details.reviews.length > 0 ? details.reviews : undefined,
            address: spot.address ?? details.address,
          });
          updated++;
        }
      } catch {
        // skip this one, keep going with the rest
      }
    }
    refresh();
    setBackfilling(false);
    setBackfillStatus(
      updated === toBackfill.length
        ? `Backfilled all ${updated} spot${updated === 1 ? "" : "s"}.`
        : `Backfilled ${updated} of ${toBackfill.length} — the rest couldn't be matched on Google.`
    );
  }

  const center = spots.length > 0 ? { lat: spots[0].lat, lng: spots[0].lng } : DEFAULT_CENTER;
  const selected = spots.find((s) => s.id === selectedId) ?? null;
  const needsBackfill = spots.some((s) => !s.placeId);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  function showOnMap(id: string) {
    setSelectedId(id);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-40 pt-8">
      <header className="mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-roast-light">
          Coffee Spots
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold italic text-husk">
          Places you've tried
        </h1>
        <p className="mt-2 text-sm text-husk/60">
          Saved on this device only — not synced anywhere.
        </p>
      </header>

      {needsBackfill && (
        <div className="mb-5 rounded-xl border border-husk/10 bg-bark p-3">
          <p className="text-xs text-husk/60">
            Some spots were saved before photos & reviews were linked.
          </p>
          <button
            type="button"
            onClick={backfillSpots}
            disabled={backfilling}
            className="mt-2 rounded-lg border border-roast-light/30 px-3 py-1.5 text-xs font-medium text-roast-light disabled:opacity-50"
          >
            {backfilling ? "Backfilling…" : "Backfill photos & reviews"}
          </button>
          {backfillStatus && <p className="mt-2 text-xs text-husk/40">{backfillStatus}</p>}
        </div>
      )}

      <div ref={mapSectionRef} className="h-64 w-full scroll-mt-6 overflow-hidden rounded border border-husk/10">
        <Map
          center={center}
          zoom={spots.length > 0 ? 13 : 3}
          mapId="DEMO_MAP_ID"
          gestureHandling="greedy"
          disableDefaultUI={false}
          streetViewControl={false}
          mapTypeControl={false}
          className="h-full w-full"
        >
          <FitToSpots spots={spots} />
          <PanToSelected position={selected ? { lat: selected.lat, lng: selected.lng } : null} />
          {spots.map((spot) => (
            <AdvancedMarker
              key={spot.id}
              position={{ lat: spot.lat, lng: spot.lng }}
              onClick={() => setSelectedId(spot.id)}
            >
              <Pin
                background={spot.id === selectedId ? "#C9A66B" : "#3E2417"}
                borderColor="#1B1512"
                glyphColor="#EDE6DA"
                scale={spot.id === selectedId ? 1.15 : 1}
              />
            </AdvancedMarker>
          ))}
          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelectedId(null)}
            >
              <div className="text-char">
                <strong>{selected.name}</strong>
                {selected.drinkOrdered && <div>{selected.drinkOrdered}</div>}
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {spots.length === 0 && (
          <p className="py-8 text-center text-sm text-husk/50">
            No spots logged yet — add the first one.
          </p>
        )}
        {spots.map((spot) => (
          <div
            key={spot.id}
            className={`rounded-xl border bg-bark p-3 transition-colors ${
              spot.id === selectedId ? "border-roast-light/50" : "border-husk/10"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={() => showOnMap(spot.id)}
                className="text-left"
              >
                <p className="font-display text-base font-semibold text-husk hover:text-roast-light">
                  {spot.name}
                </p>
                {spot.address && <p className="text-xs text-husk/40">{spot.address}</p>}
              </button>
              <StarRow rating={spot.rating} />
            </div>
            {spot.drinkOrdered && (
              <p className="mt-1.5 text-sm text-husk/70">{spot.drinkOrdered}</p>
            )}
            {spot.notes && <p className="mt-1 text-xs text-husk/50">{spot.notes}</p>}

            <PhotoStrip spot={spot} onRefreshed={refresh} />

            {spot.reviews && spot.reviews.length > 0 && (
              <details className="mt-2.5">
                <summary className="cursor-pointer text-xs text-roast-light underline decoration-dotted underline-offset-2">
                  {spot.reviews.length} Google review{spot.reviews.length > 1 ? "s" : ""}
                </summary>
                <div className="mt-2 flex flex-col gap-2.5 border-t border-husk/10 pt-2.5">
                  {spot.reviews.map((review, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-roast-light"
                          aria-label={`${review.rating} out of 5 stars`}
                        >
                          {"★".repeat(review.rating)}
                          <span className="text-husk/20">{"★".repeat(5 - review.rating)}</span>
                        </span>
                        <span className="text-husk/40">
                          {review.authorName} · {review.relativeTime}
                        </span>
                      </div>
                      <p className="mt-0.5 text-husk/60">{review.text}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}

            <div className="mt-2.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => showOnMap(spot.id)}
                className="text-xs text-roast-light underline decoration-dotted underline-offset-2"
              >
                Show on map
              </button>
              <button
                onClick={() => handleDelete(spot.id)}
                className="text-xs text-husk/30 hover:text-husk/60"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-16 z-10 mx-auto max-w-md border-t border-husk/10 bg-char/95 p-4 backdrop-blur">
        <Link
          to="/spots/new"
          className="block w-full rounded-xl bg-roast-light py-3 text-center font-semibold text-char shadow-lg shadow-roast-light/20"
        >
          Add a Spot
        </Link>
      </div>
    </main>
  );
}
