import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getRecipeById } from "@/lib/knowledgeBase";
import StepTimer from "@/components/StepTimer";
import ProgressBar from "@/components/ProgressBar";
import GlossaryTag from "@/components/GlossaryTag";
import SteamingCup from "@/components/SteamingCup";

export default function BrewFlowPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = id ? getRecipeById(id) : undefined;
  const [stepIndex, setStepIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);

  if (!recipe) return <Navigate to="/brew" replace />;

  const step = recipe.steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === recipe.steps.length - 1;

  function goNext() {
    if (isLast) {
      navigate(`/recipe/${recipe!.id}/brew/done`);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, recipe!.steps.length - 1));
  }

  function goBack() {
    if (isFirst) {
      navigate(`/recipe/${recipe!.id}`);
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <button onClick={goBack} className="text-sm text-husk/50 hover:text-husk/80">
          &larr; Back
        </button>
        <span className="font-mono text-xs text-husk/40">
          Step {stepIndex + 1} / {recipe.steps.length}
        </span>
      </div>

      <div className="mt-4">
        <ProgressBar current={stepIndex} total={recipe.steps.length} />
      </div>

      <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
        <SteamingCup key={step.id} size={72} className="animate-fade-in-up" />

        <h1 className="mt-4 font-display text-2xl font-semibold text-husk">{step.title}</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-husk/70">
          {step.instruction}
        </p>

        {step.glossaryRefs && step.glossaryRefs.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-x-3">
            {step.glossaryRefs.map((refId) => (
              <GlossaryTag key={refId} id={refId} />
            ))}
          </div>
        )}

        {step.durationSeconds !== null ? (
          <div className="mt-8">
            <StepTimer
              key={step.id}
              stepId={step.id}
              durationSeconds={step.durationSeconds}
              onComplete={() => {
                if (autoAdvance) goNext();
              }}
            />
          </div>
        ) : (
          <p className="mt-8 text-xs uppercase tracking-wide text-husk/30">
            Self-paced — tap next when ready
          </p>
        )}

        {step.tip && (
          <p className="mt-6 max-w-xs rounded-xl border border-roast-light/20 bg-roast-light/5 px-3 py-2 text-xs text-roast-light">
            {step.tip}
          </p>
        )}
      </div>

      {step.durationSeconds !== null && (
        <label className="mb-4 flex items-center justify-center gap-2 text-xs text-husk/50">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
            className="accent-roast-light"
          />
          Auto-advance when timer ends
        </label>
      )}

      <button
        onClick={goNext}
        className="w-full rounded-xl bg-roast-light py-3 text-center font-semibold text-char shadow-lg shadow-roast-light/20 transition-transform active:scale-[0.98]"
      >
        {isLast ? "Finish" : "Next Step"}
      </button>

      <Link
        to={`/recipe/${recipe.id}`}
        className="mt-3 text-center text-xs text-husk/30 hover:text-husk/50"
      >
        Exit to recipe
      </Link>
    </main>
  );
}
