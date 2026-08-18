import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup } from "react-leaflet";
import { getAllSpots, deleteSpot } from "@/lib/spotsStore";
import { fixLeafletIcons } from "@/lib/leafletIcons";
import OpenFreeMapLayer from "@/components/OpenFreeMapLayer";
import { CoffeeSpot } from "@/types";

fixLeafletIcons();

const DEFAULT_CENTER: [number, number] = [40.7128, -74.006]; // fallback: NYC

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="text-roast-light" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-husk/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function SpotsPage() {
  const [spots, setSpots] = useState<CoffeeSpot[]>([]);

  useEffect(() => {
    setSpots(getAllSpots());
  }, []);

  function handleDelete(id: string) {
    deleteSpot(id);
    setSpots(getAllSpots());
  }

  const center: [number, number] =
    spots.length > 0 ? [spots[0].lat, spots[0].lng] : DEFAULT_CENTER;

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

      <div className="h-64 w-full overflow-hidden rounded border border-husk/10">
        <MapContainer
          center={center}
          zoom={spots.length > 0 ? 12 : 3}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <OpenFreeMapLayer />
          {spots.map((spot) => (
            <Marker key={spot.id} position={[spot.lat, spot.lng]}>
              <Popup>
                <strong>{spot.name}</strong>
                {spot.drinkOrdered && <div>{spot.drinkOrdered}</div>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {spots.length === 0 && (
          <p className="py-8 text-center text-sm text-husk/50">
            No spots logged yet — add the first one.
          </p>
        )}
        {spots.map((spot) => (
          <div key={spot.id} className="rounded border border-husk/10 bg-bark p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-base font-semibold text-husk">{spot.name}</p>
                {spot.address && <p className="text-xs text-husk/40">{spot.address}</p>}
              </div>
              <StarRow rating={spot.rating} />
            </div>
            {spot.drinkOrdered && (
              <p className="mt-1.5 text-sm text-husk/70">{spot.drinkOrdered}</p>
            )}
            {spot.notes && <p className="mt-1 text-xs text-husk/50">{spot.notes}</p>}
            <button
              onClick={() => handleDelete(spot.id)}
              className="mt-2 text-xs text-husk/30 hover:text-husk/60"
            >
              Remove
            </button>
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
