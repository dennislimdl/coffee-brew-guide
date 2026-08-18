import { Link } from "react-router-dom";
import { roastLevelGuides } from "@/lib/knowledgeBase";
import PhotoBanner from "@/components/PhotoBanner";
import { PHOTOS } from "@/lib/photos";

const ROAST_DOT: Record<string, string> = {
  light: "bg-roast-light",
  medium: "bg-roast-medium",
  dark: "bg-roast-dark",
};

export default function RoastLevelsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12">
      <PhotoBanner
        photo={PHOTOS.roasteryMachine}
        eyebrow="Introduction to Coffee"
        title="Roast levels"
        compact
      />

      <Link to="/learn" className="mt-4 inline-block text-sm text-husk/50 hover:text-husk/80">
        &larr; Learn
      </Link>

      <p className="mt-4 mb-6 text-sm leading-relaxed text-husk/60">
        Roasting is what turns green, grassy-smelling coffee seeds into the
        fragrant brown beans you grind. How far a roast is taken changes
        the balance between the bean's own origin character and the
        flavors created by roasting itself.
      </p>

      <ul className="flex flex-col gap-4">
        {roastLevelGuides.map((roast, i) => (
          <li
            key={roast.id}
            style={{ animationDelay: `${i * 80}ms` }}
            className="animate-fade-in-up rounded-2xl border border-husk/10 bg-bark p-4 shadow-md shadow-black/10"
          >
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${ROAST_DOT[roast.id]}`} aria-hidden="true" />
              <h2 className="font-display text-lg font-semibold text-husk">{roast.name}</h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-husk/70">{roast.description}</p>
            <dl className="mt-3 flex gap-6 font-mono text-xs text-husk/50">
              <div>
                <dt className="uppercase tracking-wide">Acidity</dt>
                <dd className="mt-0.5 text-husk/80">{roast.acidity}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">Body</dt>
                <dd className="mt-0.5 text-husk/80">{roast.body}</dd>
              </div>
            </dl>
            <p className="mt-3 flex flex-wrap gap-1.5">
              {roast.commonFlavors.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-roast-light/30 px-2 py-0.5 text-xs text-roast-light"
                >
                  {f}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
