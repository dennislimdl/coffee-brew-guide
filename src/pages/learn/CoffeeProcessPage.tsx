import { Link } from "react-router-dom";
import { coffeeProcessStages } from "@/lib/knowledgeBase";
import PhotoBanner from "@/components/PhotoBanner";
import ProcessStageIcon from "@/components/ProcessStageIcon";
import { PHOTOS } from "@/lib/photos";

export default function CoffeeProcessPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12">
      <PhotoBanner
        photo={PHOTOS.coffeeCherries}
        eyebrow="How Coffee Is Made"
        title="Cherry to cup"
      />

      <Link to="/learn" className="mt-4 inline-block text-sm text-husk/50 hover:text-husk/80">
        &larr; Learn
      </Link>

      <p className="mt-4 mb-8 text-sm leading-relaxed text-husk/60">
        Every cup of coffee is the end of an eight-stage journey that starts
        on a tree in the tropics. Here's the whole thing, start to finish —
        the version of it framed the way James Hoffmann lays it out in{" "}
        <em>The World Atlas of Coffee</em>: growing, harvesting, processing,
        drying, milling, roasting, grinding, brewing.
      </p>

      <ol className="relative flex flex-col gap-8">
        <div
          className="absolute bottom-6 left-7 top-6 w-px bg-gradient-to-b from-roast-light/40 via-husk/15 to-transparent"
          aria-hidden="true"
        />

        {coffeeProcessStages.map((stage, i) => (
          <li
            key={stage.id}
            style={{ animationDelay: `${i * 90}ms` }}
            className="relative flex animate-fade-in-up gap-4"
          >
            <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-husk/10 bg-bark shadow-md shadow-black/20">
              <ProcessStageIcon stage={stage.id} size={40} />
            </div>
            <div className="pt-1">
              <p className="font-mono text-[11px] uppercase tracking-widest text-husk/30">
                Stage {stage.order} / {coffeeProcessStages.length}
              </p>
              <h2 className="mt-0.5 font-display text-lg font-semibold text-husk">
                {stage.title}
              </h2>
              <p className="mt-1 text-sm font-medium text-roast-light">{stage.summary}</p>
              <p className="mt-2 text-sm leading-relaxed text-husk/60">{stage.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-10 border-t border-husk/10 pt-4 text-xs leading-relaxed text-husk/30">
        Sourced from{" "}
        <a
          href="https://en.wikipedia.org/wiki/Coffee_production"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-husk/50"
        >
          Wikipedia — Coffee production
        </a>
        , framed around the growing-to-brewing structure of James Hoffmann's{" "}
        <a
          href="https://www.jameshoffmann.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-husk/50"
        >
          <em>The World Atlas of Coffee</em>
        </a>
        .
      </p>
    </main>
  );
}
