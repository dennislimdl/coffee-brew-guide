import { Link, useParams } from "react-router-dom";
import { getRecipeById } from "@/lib/knowledgeBase";
import SteamingCup from "@/components/SteamingCup";

export default function BrewDonePage() {
  const { id } = useParams<{ id: string }>();
  const recipe = id ? getRecipeById(id) : undefined;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <SteamingCup size={110} className="animate-fade-in-up" />
      <h1 className="mt-4 font-display text-3xl font-semibold italic text-husk">
        Enjoy your cup
      </h1>
      <p className="mt-2 text-sm text-husk/60">
        {recipe ? `${recipe.name} is ready.` : "Your coffee is ready."}
      </p>

      <div className="mt-8 flex w-full flex-col gap-2">
        {recipe && (
          <Link
            to={`/recipe/${recipe.id}/brew`}
            className="rounded-xl border border-husk/15 py-3 text-center text-sm text-husk/80"
          >
            Brew again
          </Link>
        )}
        <Link
          to="/brew"
          className="rounded-xl bg-roast-light py-3 text-center font-semibold text-char shadow-lg shadow-roast-light/20"
        >
          Back to recipes
        </Link>
      </div>
    </main>
  );
}
