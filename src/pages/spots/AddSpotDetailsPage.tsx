import { useState } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { addSpot } from "@/lib/spotsStore";

interface LocationState {
  position: [number, number];
  name: string;
  address: string;
}

export default function AddSpotDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [name, setName] = useState(state?.name ?? "");
  const [drinkOrdered, setDrinkOrdered] = useState("");
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(4);
  const [error, setError] = useState<string | null>(null);

  // Landing here directly (refresh, back button after save, bookmarked URL)
  // means there's no chosen location to attach details to — back to step 1.
  if (!state?.position) {
    return <Navigate to="/spots/new" replace />;
  }
  const { position, address } = state;
  const center = { lat: position[0], lng: position[1] };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Give the spot a name.");
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
      <Link to="/spots/new" className="text-sm text-husk/50 hover:text-husk/80">
        &larr; Change location
      </Link>

      <header className="mt-4 mb-5">
        <p className="font-mono text-xs uppercase tracking-widest text-roast-light">
          Step 2 of 2
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold italic text-husk">
          Add the details
        </h1>
      </header>

      <div className="mb-5 flex items-center gap-3 rounded-xl border border-husk/10 bg-bark p-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Map
            center={center}
            zoom={16}
            mapId="DEMO_MAP_ID"
            gestureHandling="none"
            disableDefaultUI
            zoomControl={false}
            className="h-full w-full"
          >
            <AdvancedMarker position={center} />
          </Map>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-husk">
            {name || "Unnamed location"}
          </p>
          {address && <p className="truncate text-xs text-husk/40">{address}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-wide text-husk/50">
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Corvo Coffee"
            className="w-full rounded border border-husk/15 bg-bark px-3 py-2 text-sm text-husk placeholder:text-husk/30"
          />
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
