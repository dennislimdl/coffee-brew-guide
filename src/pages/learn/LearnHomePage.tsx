import { Link } from "react-router-dom";
import PhotoBanner from "@/components/PhotoBanner";
import PhotoThumb from "@/components/PhotoThumb";
import { PHOTOS } from "@/lib/photos";

const SECTIONS = [
  {
    id: "made",
    title: "How Coffee Is Made",
    description: "From the farm to the roaster — the process behind every bag.",
    topics: [
      {
        to: "/learn/process",
        title: "Cherry to Cup: The Whole Process",
        description: "Growing, harvesting, processing, drying, milling, roasting, grinding, and brewing — animated, start to finish.",
        photo: PHOTOS.coffeeCherries,
      },
      {
        to: "/learn/origins",
        title: "Origins & Processing",
        description: "How washed, natural, and honey processing shape what ends up in your cup.",
        photo: PHOTOS.plantationColombia,
      },
    ],
  },
  {
    id: "beans",
    title: "Beans of the World",
    description: "The four coffee species, and origins worth knowing by name.",
    topics: [
      {
        to: "/learn/beans",
        title: "Not All Beans Are Alike",
        description: "Arabica, robusta, liberica, and excelsa — plus a tour of famous origins, from Ethiopian Yirgacheffe to the world's most expensive coffee.",
        photo: PHOTOS.plantationHero,
      },
    ],
  },
  {
    id: "appreciation",
    title: "Appreciation of Coffee",
    description: "How to taste it, talk about it, and choose what you'll like.",
    topics: [
      {
        to: "/learn/tasting-notes",
        title: "Reading Tasting Notes",
        description: "What acidity, body, and sweetness actually mean, and how to spot fruity, floral, and nutty notes.",
        photo: PHOTOS.plantationKaratu,
      },
      {
        to: "/learn/roast-levels",
        title: "Roast Levels",
        description: "How light, medium, and dark roasts differ in flavor, acidity, and body.",
        photo: PHOTOS.roasteryMachine,
      },
      {
        to: "/learn/glossary",
        title: "Brewing Glossary",
        description: "Terms you'll run into across the recipes, explained once.",
        photo: PHOTOS.roasteryHero,
      },
    ],
  },
  {
    id: "equipment",
    title: "Choosing Equipment",
    description: "What's worth buying, at what price, and why.",
    topics: [
      {
        to: "/learn/equipment",
        title: "What's Worth Buying",
        description: "Grinders, kettles, scales, brewers, filters, and espresso machines — quality tiers, price ranges, and James Hoffmann's take on each.",
        photo: PHOTOS.pourOverHero,
      },
    ],
  },
];

export default function LearnHomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12">
      <PhotoBanner photo={PHOTOS.plantationHero} eyebrow="Introduction to Coffee" title="From cherry to cup" />

      <Link to="/" className="mt-4 inline-block text-sm text-husk/50 hover:text-husk/80">
        &larr; Home
      </Link>

      <p className="mt-4 mb-8 text-sm leading-relaxed text-husk/60">
        Coffee starts as the seed inside a coffee cherry, grown on plantations
        like the ones pictured here. Once picked, the seeds are processed to
        remove the fruit, dried, roasted, and finally ground and brewed — and
        a choice made at nearly every one of those steps changes what ends up
        in your cup. Four angles on it below: how it's made, what kinds of
        beans exist, how to taste and talk about it, and what to actually buy.
      </p>

      <div className="flex flex-col gap-9">
        {SECTIONS.map((section, sectionIndex) => (
          <section key={section.id}>
            <header className="mb-3">
              <p className="font-mono text-xs uppercase tracking-widest text-husk/30">
                {String(sectionIndex + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-0.5 font-display text-xl font-semibold italic text-husk">
                {section.title}
              </h2>
              <p className="mt-1 text-xs text-husk/50">{section.description}</p>
            </header>

            <div className="flex flex-col gap-3">
              {section.topics.map((topic, i) => (
                <Link
                  key={topic.to}
                  to={topic.to}
                  style={{ animationDelay: `${(sectionIndex * 3 + i) * 80}ms` }}
                  className="flex animate-fade-in-up items-center gap-3 rounded-2xl border border-husk/10 bg-bark p-3 shadow-md shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-husk/30"
                >
                  <PhotoThumb photo={topic.photo} />
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-husk">{topic.title}</h3>
                    <p className="mt-1 text-sm text-husk/60">{topic.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
