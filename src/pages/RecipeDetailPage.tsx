import { Link, useParams, Navigate } from "react-router-dom";
import {
  getRecipeById,
  getEquipmentForRecipe,
  getTroubleshootingForType,
  formatDuration,
  COFFEE_TYPE_LABELS,
} from "@/lib/knowledgeBase";
import BrewTypeIcon from "@/components/BrewTypeIcon";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const recipe = id ? getRecipeById(id) : undefined;

  if (!recipe) return <Navigate to="/brew" replace />;

  const equipment = getEquipmentForRecipe(recipe);
  const troubleshooting = getTroubleshootingForType(recipe.coffeeType);

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-8">
      <Link to="/brew" className="text-sm text-husk/50 hover:text-husk/80">
        &larr; All recipes
      </Link>

      <header className="mt-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bark">
          <BrewTypeIcon type={recipe.coffeeType} size={44} />
        </div>
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-roast-light">
          {COFFEE_TYPE_LABELS[recipe.coffeeType]}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold italic text-husk">
          {recipe.name}
        </h1>
        <p className="mt-2 text-sm text-husk/60">{recipe.summary}</p>

        <dl className="mt-4 flex gap-6 font-mono text-xs text-husk/50">
          <div>
            <dt className="uppercase tracking-wide">Time</dt>
            <dd className="mt-0.5 text-husk/80">{formatDuration(recipe.totalTimeSeconds)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Difficulty</dt>
            <dd className="mt-0.5 capitalize text-husk/80">{recipe.difficulty}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Yields</dt>
            <dd className="mt-0.5 text-husk/80">
              {recipe.servings} cup{recipe.servings > 1 ? "s" : ""}
            </dd>
          </div>
        </dl>
      </header>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-husk">Equipment</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {equipment.map((item) => (
            <li key={item.id}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-husk/80">
                  <span className="h-1 w-1 rounded-full bg-roast-light" aria-hidden="true" />
                  {item.name}
                  {item.optional && <span className="text-husk/40">(optional)</span>}
                  <span className="ml-auto text-husk/30 transition-transform group-open:rotate-180">
                    ⌄
                  </span>
                </summary>
                <p className="ml-3 mt-1 max-w-xs text-xs leading-relaxed text-husk/50">
                  {item.description}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-semibold text-husk">Ingredients</h2>
        <ul className="mt-2 flex flex-col gap-1.5">
          {recipe.ingredients.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between text-sm text-husk/80">
              <span>{item.name}</span>
              <span className="font-mono text-husk/50">{item.amount}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-semibold text-husk">Steps</h2>
        <ol className="mt-2 flex flex-col gap-2">
          {recipe.steps.map((step, i) => (
            <li key={step.id} className="text-sm text-husk/70">
              <span className="font-mono text-husk/40">{String(i + 1).padStart(2, "0")}</span>{" "}
              {step.title}
            </li>
          ))}
        </ol>
      </section>

      {troubleshooting && (
        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold text-husk">
            If something's off
          </h2>
          <ul className="mt-2 flex flex-col gap-3">
            {troubleshooting.issues.map((issue) => (
              <li key={issue.id} className="rounded-xl border border-husk/10 bg-bark p-3 shadow-md shadow-black/10">
                <p className="text-sm font-medium text-husk/90">{issue.symptom}</p>
                <p className="mt-1 text-xs text-husk/50">{issue.likelyCause}</p>
                <p className="mt-1.5 text-xs text-moss">{issue.fix}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-6 text-xs text-husk/30">Source: {recipe.source.label}</p>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-husk/10 bg-char/95 p-4 backdrop-blur">
        <Link
          to={`/recipe/${recipe.id}/brew`}
          className="block w-full rounded-xl bg-roast-light py-3 text-center font-semibold text-char shadow-lg shadow-roast-light/20 transition-transform active:scale-[0.98]"
        >
          Start Brewing
        </Link>
      </div>
    </main>
  );
}
