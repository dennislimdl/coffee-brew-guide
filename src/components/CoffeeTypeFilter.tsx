import { CoffeeType } from "@/types";
import { COFFEE_TYPE_LABELS } from "@/lib/knowledgeBase";

interface Props {
  active: CoffeeType | "all";
  onChange: (value: CoffeeType | "all") => void;
}

const TYPES: (CoffeeType | "all")[] = [
  "all",
  "pour-over",
  "immersion",
  "espresso-based",
  "moka",
  "cold",
];

export default function CoffeeTypeFilter({ active, onChange }: Props) {
  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
      role="tablist"
      aria-label="Filter recipes by brew type"
    >
      {TYPES.map((type) => {
        const label = type === "all" ? "All" : COFFEE_TYPE_LABELS[type];
        const isActive = active === type;
        return (
          <button
            key={type}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(type)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-roast-light bg-roast-light text-char"
                : "border-husk/15 text-husk/70 hover:border-husk/30"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
