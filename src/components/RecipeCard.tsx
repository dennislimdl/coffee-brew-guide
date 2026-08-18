import { Link } from "react-router-dom";
import { Recipe } from "@/types";
import { formatDuration } from "@/lib/knowledgeBase";
import BrewTypeIcon from "@/components/BrewTypeIcon";

const ROAST_COLOR: Record<Recipe["roastRecommendation"], string> = {
  light: "bg-roast-light",
  medium: "bg-roast-medium",
  dark: "bg-roast-dark",
};

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group block rounded-2xl border border-husk/10 bg-bark p-4 shadow-md shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-husk/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-char/60">
            <BrewTypeIcon type={recipe.coffeeType} size={28} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold leading-snug text-husk">
              {recipe.name}
            </h3>
            <p className="mt-1 text-sm text-husk/60">{recipe.summary}</p>
          </div>
        </div>
        <span
          aria-label={`${recipe.roastRecommendation} roast recommended`}
          title={`${recipe.roastRecommendation} roast recommended`}
          className={`mt-1 h-3 w-3 shrink-0 rounded-full ${ROAST_COLOR[recipe.roastRecommendation]}`}
        />
      </div>
      <div className="mt-4 flex items-center gap-4 font-mono text-xs text-husk/50">
        <span>{formatDuration(recipe.totalTimeSeconds)}</span>
        <span aria-hidden="true">·</span>
        <span className="capitalize">{recipe.difficulty}</span>
        <span aria-hidden="true">·</span>
        <span>
          {recipe.servings} cup{recipe.servings > 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
