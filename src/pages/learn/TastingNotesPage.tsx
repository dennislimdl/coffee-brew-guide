import { Link } from "react-router-dom";
import { tastingDimensions, tastingNoteCategories } from "@/lib/knowledgeBase";
import PhotoBanner from "@/components/PhotoBanner";
import { PHOTOS } from "@/lib/photos";

export default function TastingNotesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12">
      <PhotoBanner
        photo={PHOTOS.plantationKaratu}
        eyebrow="Appreciation of Coffee"
        title="Reading tasting notes"
        compact
      />

      <Link to="/learn" className="mt-4 inline-block text-sm text-husk/50 hover:text-husk/80">
        &larr; Learn
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-sm leading-relaxed text-husk/60">
          A tasting note like "blueberry, brown sugar, medium body" isn't
          claiming the coffee has anything added to it — it's describing
          which flavor compounds naturally developed from the bean's origin,
          processing, and roast. Two things go into a note: the{" "}
          <em>dimensions</em> below, and the specific <em>flavors</em> within
          them.
        </p>
      </header>

      <section className="mb-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-husk/40">
          The dimensions
        </h2>
        <ul className="mt-2 flex flex-col gap-3">
          {tastingDimensions.map((dim) => (
            <li key={dim.id} className="rounded border border-husk/10 bg-bark p-3">
              <p className="text-sm font-medium text-husk/90">{dim.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-husk/60">{dim.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-mono text-xs uppercase tracking-widest text-husk/40">
          Flavor categories
        </h2>
        <ul className="mt-2 flex flex-col gap-3">
          {tastingNoteCategories.map((cat) => (
            <li key={cat.id} className="rounded border border-husk/10 bg-bark p-3">
              <p className="text-sm font-medium text-husk/90">{cat.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-husk/60">{cat.description}</p>
              <p className="mt-2 flex flex-wrap gap-1.5">
                {cat.examples.map((ex) => (
                  <span
                    key={ex}
                    className="rounded-full border border-roast-light/30 px-2 py-0.5 text-xs text-roast-light"
                  >
                    {ex}
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
