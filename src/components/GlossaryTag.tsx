import { getGlossaryTerm } from "@/lib/knowledgeBase";

export default function GlossaryTag({ id }: { id: string }) {
  const term = getGlossaryTerm(id);
  if (!term) return null;

  return (
    <details className="group mt-1 inline-block">
      <summary className="cursor-pointer list-none text-xs text-roast-light underline decoration-dotted underline-offset-2">
        {term.term}
      </summary>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-husk/60">
        {term.definition}
      </p>
    </details>
  );
}
