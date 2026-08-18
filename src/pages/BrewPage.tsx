import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CoffeeType } from "@/types";
import { getRecipesByType } from "@/lib/knowledgeBase";
import RecipeCard from "@/components/RecipeCard";
import CoffeeTypeFilter from "@/components/CoffeeTypeFilter";
import SteamingCup from "@/components/SteamingCup";

export default function BrewPage() {
  const [activeType, setActiveType] = useState<CoffeeType | "all">("all");
  const recipes = useMemo(() => getRecipesByType(activeType), [activeType]);

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-12 pt-8">
      <Link to="/" className="text-sm text-husk/50 hover:text-husk/80">
        &larr; Home
      </Link>

      <header className="mt-4 mb-6 flex items-center gap-3">
        <SteamingCup size={52} />
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-roast-light">
            Step-by-Step Brewing
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold italic text-husk">
            What are you brewing?
          </h1>
        </div>
      </header>

      <div className="mb-5">
        <CoffeeTypeFilter active={activeType} onChange={setActiveType} />
      </div>

      <div className="flex flex-col gap-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
        {recipes.length === 0 && (
          <p className="py-12 text-center text-sm text-husk/50">
            No recipes in this category yet.
          </p>
        )}
      </div>
    </main>
  );
}
