import { Link } from "react-router-dom";
import { processingMethods } from "@/lib/knowledgeBase";
import PhotoBanner from "@/components/PhotoBanner";
import { PHOTOS } from "@/lib/photos";

export default function OriginsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12">
      <PhotoBanner
        photo={PHOTOS.plantationColombia}
        eyebrow="Introduction to Coffee"
        title="Origins & processing"
        compact
      />

      <Link to="/learn" className="mt-4 inline-block text-sm text-husk/50 hover:text-husk/80">
        &larr; Learn
      </Link>

      <p className="mt-4 mb-6 text-sm leading-relaxed text-husk/60">
        Before a coffee seed is ever roasted, how it's separated from the
        fruit around it — the "processing method" — already shapes a lot
        of its eventual flavor. It's one of the reasons two coffees from
        the same farm can taste noticeably different.
      </p>

      <ul className="flex flex-col gap-4">
        {processingMethods.map((method, i) => (
          <li
            key={method.id}
            style={{ animationDelay: `${i * 80}ms` }}
            className="animate-fade-in-up rounded-2xl border border-husk/10 bg-bark p-4 shadow-md shadow-black/10"
          >
            <h2 className="font-display text-lg font-semibold text-husk">{method.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-husk/70">{method.description}</p>
            <p className="mt-3 border-t border-husk/10 pt-3 text-xs leading-relaxed text-husk/50">
              <span className="text-roast-light">Flavor impact — </span>
              {method.flavorImpact}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
