import { Link } from "react-router-dom";
import { beanSpeciesList, notableBeans } from "@/lib/knowledgeBase";
import PhotoBanner from "@/components/PhotoBanner";
import { PHOTOS } from "@/lib/photos";

export default function BeansPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12">
      <PhotoBanner photo={PHOTOS.coffeeCherries} eyebrow="Beans of the World" title="Not all beans are alike" />

      <Link to="/learn" className="mt-4 inline-block text-sm text-husk/50 hover:text-husk/80">
        &larr; Learn
      </Link>

      <p className="mt-4 mb-6 text-sm leading-relaxed text-husk/60">
        "Coffee bean" actually covers four distinct plant species, and within
        just one of them — arabica — thousands of regional varieties. Here's
        what separates the species, then a tour of specific origins worth
        knowing by name.
      </p>

      <section className="mb-9">
        <header className="mb-3">
          <p className="font-mono text-xs uppercase tracking-widest text-husk/30">Species</p>
          <h2 className="mt-0.5 font-display text-xl font-semibold italic text-husk">
            The four coffee species
          </h2>
        </header>

        <ul className="flex flex-col gap-3">
          {beanSpeciesList.map((species, i) => (
            <li
              key={species.id}
              style={{ animationDelay: `${i * 90}ms` }}
              className="animate-fade-in-up rounded-2xl border border-husk/10 bg-bark p-4 shadow-md shadow-black/10"
            >
              <h3 className="font-display text-lg font-semibold text-husk">{species.name}</h3>
              <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-husk/50">
                <div>
                  <dt className="uppercase tracking-wide">Share</dt>
                  <dd className="mt-0.5 text-husk/80">{species.shareOfProduction}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wide">Caffeine</dt>
                  <dd className="mt-0.5 text-husk/80">{species.caffeineContent}</dd>
                </div>
              </dl>
              <p className="mt-2 text-sm leading-relaxed text-husk/70">{species.flavorProfile}</p>
              <p className="mt-2 text-xs leading-relaxed text-husk/50">{species.notes}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <header className="mb-3">
          <p className="font-mono text-xs uppercase tracking-widest text-husk/30">Origins</p>
          <h2 className="mt-0.5 font-display text-xl font-semibold italic text-husk">
            Interesting beans around the world
          </h2>
          <p className="mt-1 text-xs text-husk/50">
            A tour of specific origins worth recognizing by name — from
            everyday workhorses to the most expensive coffee ever sold.
          </p>
        </header>

        <ul className="flex flex-col gap-3">
          {notableBeans.map((bean, i) => (
            <li
              key={bean.id}
              style={{ animationDelay: `${i * 90}ms` }}
              className="animate-fade-in-up rounded-2xl border border-husk/10 bg-bark p-4 shadow-md shadow-black/10"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-husk">{bean.name}</h3>
                <span className="shrink-0 font-mono text-[11px] text-roast-light">
                  {String(bean.order).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-husk/40">{bean.origin}</p>
              <p className="mt-2 text-sm leading-relaxed text-husk/70">{bean.description}</p>
              <p className="mt-2 border-t border-husk/10 pt-2 text-xs text-husk/50">
                <span className="text-roast-light">Price — </span>
                {bean.priceNote}
              </p>
              {bean.caveat && (
                <p className="mt-2 rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs leading-relaxed text-red-300/80">
                  {bean.caveat}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 border-t border-husk/10 pt-4 text-xs leading-relaxed text-husk/30">
        Prices are general market guidance from recent reporting, not live
        pricing — specialty coffee prices shift with each harvest.
      </p>
    </main>
  );
}
