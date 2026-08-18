import { Link } from "react-router-dom";
import PhotoBanner from "@/components/PhotoBanner";
import PhotoThumb from "@/components/PhotoThumb";
import { PHOTOS } from "@/lib/photos";

const TOPICS = [
  {
    to: "/learn/process",
    title: "Cherry to Cup: The Whole Process",
    description: "Growing, harvesting, processing, drying, milling, roasting, grinding, and brewing — animated, start to finish.",
    photo: PHOTOS.coffeeCherries,
  },
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
    to: "/learn/origins",
    title: "Origins & Processing",
    description: "How washed, natural, and honey processing shape what ends up in your cup.",
    photo: PHOTOS.plantationColombia,
  },
  {
    to: "/learn/glossary",
    title: "Brewing Glossary",
    description: "Terms you'll run into across the recipes, explained once.",
    photo: PHOTOS.roasteryHero,
  },
];

export default function LearnHomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12">
      <PhotoBanner photo={PHOTOS.plantationHero} eyebrow="Introduction to Coffee" title="From cherry to cup" />

      <Link to="/" className="mt-4 inline-block text-sm text-husk/50 hover:text-husk/80">
        &larr; Home
      </Link>

      <p className="mt-4 mb-6 text-sm leading-relaxed text-husk/60">
        Coffee starts as the seed inside a coffee cherry, grown on plantations
        like the ones pictured here. Once picked, the seeds are processed to
        remove the fruit, dried, roasted, and finally ground and brewed — and
        a choice made at nearly every one of those steps changes what ends up
        in your cup. The sections below cover the vocabulary for talking
        about that, starting with the part people usually want first: what
        tasting notes actually mean.
      </p>

      <div className="flex flex-col gap-3">
        {TOPICS.map((topic, i) => (
          <Link
            key={topic.to}
            to={topic.to}
            style={{ animationDelay: `${i * 80}ms` }}
            className="flex animate-fade-in-up items-center gap-3 rounded-2xl border border-husk/10 bg-bark p-3 shadow-md shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-husk/30"
          >
            <PhotoThumb photo={topic.photo} />
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold text-husk">{topic.title}</h2>
              <p className="mt-1 text-sm text-husk/60">{topic.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
