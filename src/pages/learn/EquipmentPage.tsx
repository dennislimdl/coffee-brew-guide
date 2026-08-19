import { Link } from "react-router-dom";
import { equipmentGuide } from "@/lib/knowledgeBase";
import PhotoBanner from "@/components/PhotoBanner";
import { PHOTOS } from "@/lib/photos";

export default function EquipmentPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12">
      <PhotoBanner
        photo={PHOTOS.pourOverHero}
        eyebrow="Choosing Equipment"
        title="What's worth buying"
      />

      <Link to="/learn" className="mt-4 inline-block text-sm text-husk/50 hover:text-husk/80">
        &larr; Learn
      </Link>

      <p className="mt-4 mb-8 text-sm leading-relaxed text-husk/60">
        Six categories, roughly in order of how much difference they actually
        make. Price tiers below are a general guide, not live pricing — check
        current prices before buying. Each entry also carries James
        Hoffmann's take, since he's one of the most-watched voices on home
        coffee gear.
      </p>

      <ul className="flex flex-col gap-5">
        {equipmentGuide.map((item, i) => (
          <li
            key={item.id}
            style={{ animationDelay: `${i * 90}ms` }}
            className="animate-fade-in-up rounded-2xl border border-husk/10 bg-bark p-4 shadow-md shadow-black/10"
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-husk/30">
              {String(item.order).padStart(2, "0")} / {String(equipmentGuide.length).padStart(2, "0")}
            </p>
            <h2 className="mt-0.5 font-display text-lg font-semibold text-husk">{item.name}</h2>
            <p className="mt-0.5 text-sm font-medium text-roast-light">{item.tagline}</p>
            <p className="mt-2 text-sm leading-relaxed text-husk/60">{item.whyItMatters}</p>

            <div className="mt-3 flex flex-col gap-1.5">
              {item.priceTiers.map((tier) => (
                <div
                  key={tier.tier}
                  className="flex items-baseline justify-between gap-3 border-t border-husk/10 pt-1.5 text-xs"
                >
                  <span className="text-husk/70">
                    {tier.tier}
                    <span className="block text-husk/40">{tier.picks.join(", ")}</span>
                  </span>
                  <span className="shrink-0 font-mono text-roast-light">{tier.priceRange}</span>
                </div>
              ))}
            </div>

            <p className="mt-3 rounded-xl border border-roast-light/20 bg-roast-light/5 px-3 py-2 text-xs leading-relaxed text-roast-light">
              <span className="font-semibold">James Hoffmann's take — </span>
              {item.hoffmannTake}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-10 border-t border-husk/10 pt-4 text-xs leading-relaxed text-husk/30">
        Product opinions credited to James Hoffmann are drawn from his
        publicly posted YouTube videos, as documented and summarized by
        third-party coffee-equipment outlets — his own site is explicit that
        he doesn't hand out blanket recommendations directly. Price ranges
        are general guidance, not live pricing.
      </p>
    </main>
  );
}
