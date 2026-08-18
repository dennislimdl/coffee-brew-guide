import { Link } from "react-router-dom";
import { getAllGlossaryTerms } from "@/lib/knowledgeBase";
import { GlossaryCategory } from "@/types";
import PhotoBanner from "@/components/PhotoBanner";
import { PHOTOS } from "@/lib/photos";

const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  technique: "Technique",
  measurement: "Measurement",
  equipment: "Equipment",
};

export default function GlossaryPage() {
  const terms = getAllGlossaryTerms();
  const categories: GlossaryCategory[] = ["technique", "measurement", "equipment"];

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12">
      <PhotoBanner
        photo={PHOTOS.roasteryHero}
        eyebrow="Introduction to Coffee"
        title="Brewing glossary"
        compact
      />

      <Link to="/learn" className="mt-4 inline-block text-sm text-husk/50 hover:text-husk/80">
        &larr; Learn
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-sm text-husk/60">
          Terms you'll run into across the recipes, explained once.
        </p>
      </header>

      {categories.map((category) => {
        const inCategory = terms.filter((t) => t.category === category);
        if (inCategory.length === 0) return null;
        return (
          <section key={category} className="mb-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-husk/40">
              {CATEGORY_LABELS[category]}
            </h2>
            <ul className="mt-2 flex flex-col gap-3">
              {inCategory.map((term) => (
                <li key={term.id} className="rounded border border-husk/10 bg-bark p-3">
                  <p className="text-sm font-medium text-husk/90">{term.term}</p>
                  <p className="mt-1 text-xs leading-relaxed text-husk/60">
                    {term.definition}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
