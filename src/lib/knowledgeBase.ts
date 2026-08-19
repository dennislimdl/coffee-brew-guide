import {
  Recipe,
  CoffeeType,
  Equipment,
  ResolvedEquipment,
  GlossaryTerm,
  TroubleshootingGuide,
  TastingDimension,
  TastingNoteCategory,
  RoastLevelGuide,
  ProcessingMethod,
  CoffeeProcessStage,
  EquipmentGuideEntry,
  BeanSpecies,
  NotableBean,
} from "@/types";
import {
  recipeSchema,
  equipmentSchema,
  glossaryTermSchema,
  troubleshootingGuideSchema,
  tastingDimensionSchema,
  tastingNoteCategorySchema,
  roastLevelGuideSchema,
  processingMethodSchema,
  coffeeProcessStageSchema,
  equipmentGuideEntrySchema,
  beanSpeciesSchema,
  notableBeanSchema,
} from "@/lib/schema";

import equipmentRaw from "@/data/equipment.json";
import glossaryRaw from "@/data/glossary.json";
import troubleshootingRaw from "@/data/troubleshooting.json";
import tastingDimensionsRaw from "@/data/tastingDimensions.json";
import tastingNotesRaw from "@/data/tastingNotes.json";
import roastLevelsRaw from "@/data/roastLevels.json";
import processingMethodsRaw from "@/data/processingMethods.json";
import coffeeProcessRaw from "@/data/coffeeProcess.json";
import equipmentGuideRaw from "@/data/equipmentGuide.json";
import beanSpeciesRaw from "@/data/beanSpecies.json";
import notableBeansRaw from "@/data/notableBeans.json";

// Eagerly import every recipe file — adding a new recipe is just adding a
// new JSON file to src/data/recipes/, no other code changes needed.
const recipeModules = import.meta.glob("../data/recipes/*.json", {
  eager: true,
}) as Record<string, { default: unknown }>;

// ---------------------------------------------------------------------------
// Validate + parse every layer of the knowledge base up front. Throwing here
// means a bad data file fails loudly at dev/build time instead of silently
// rendering broken UI.
// ---------------------------------------------------------------------------

function parseAll<T>(schema: { parse: (v: unknown) => T }, items: unknown[], label: string): T[] {
  return items.map((item, i) => {
    try {
      return schema.parse(item);
    } catch (err) {
      throw new Error(`Invalid ${label} entry at index ${i}: ${(err as Error).message}`);
    }
  });
}

export const equipmentCatalog: Equipment[] = parseAll(
  equipmentSchema,
  equipmentRaw as unknown[],
  "equipment"
);

export const glossary: GlossaryTerm[] = parseAll(
  glossaryTermSchema,
  glossaryRaw as unknown[],
  "glossary term"
);

export const troubleshootingGuides: TroubleshootingGuide[] = parseAll(
  troubleshootingGuideSchema,
  troubleshootingRaw as unknown[],
  "troubleshooting guide"
);

export const tastingDimensions: TastingDimension[] = parseAll(
  tastingDimensionSchema,
  tastingDimensionsRaw as unknown[],
  "tasting dimension"
);

export const tastingNoteCategories: TastingNoteCategory[] = parseAll(
  tastingNoteCategorySchema,
  tastingNotesRaw as unknown[],
  "tasting note category"
);

export const roastLevelGuides: RoastLevelGuide[] = parseAll(
  roastLevelGuideSchema,
  roastLevelsRaw as unknown[],
  "roast level guide"
);

export const processingMethods: ProcessingMethod[] = parseAll(
  processingMethodSchema,
  processingMethodsRaw as unknown[],
  "processing method"
);

export const coffeeProcessStages: CoffeeProcessStage[] = parseAll(
  coffeeProcessStageSchema,
  coffeeProcessRaw as unknown[],
  "coffee process stage"
).sort((a, b) => a.order - b.order);

export const equipmentGuide: EquipmentGuideEntry[] = parseAll(
  equipmentGuideEntrySchema,
  equipmentGuideRaw as unknown[],
  "equipment guide entry"
).sort((a, b) => a.order - b.order);

export const beanSpeciesList: BeanSpecies[] = parseAll(
  beanSpeciesSchema,
  beanSpeciesRaw as unknown[],
  "bean species"
).sort((a, b) => a.order - b.order);

export const notableBeans: NotableBean[] = parseAll(
  notableBeanSchema,
  notableBeansRaw as unknown[],
  "notable bean"
).sort((a, b) => a.order - b.order);

const recipes: Recipe[] = Object.entries(recipeModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([filePath, mod]) => {
    try {
      return recipeSchema.parse(mod.default);
    } catch (err) {
      throw new Error(`Invalid recipe in ${filePath}: ${(err as Error).message}`);
    }
  });

// ---------------------------------------------------------------------------
// Referential integrity: catch typos and stale references between files.
// ---------------------------------------------------------------------------

const equipmentIds = new Set(equipmentCatalog.map((e) => e.id));
const glossaryIds = new Set(glossary.map((g) => g.id));
const coffeeTypesWithGuides = new Set(troubleshootingGuides.map((g) => g.coffeeType));

const ALL_COFFEE_TYPES: CoffeeType[] = [
  "pour-over",
  "immersion",
  "espresso-based",
  "cold",
  "moka",
];

for (const type of ALL_COFFEE_TYPES) {
  if (!coffeeTypesWithGuides.has(type)) {
    throw new Error(`Missing troubleshooting guide for coffee type "${type}"`);
  }
}

for (const recipe of recipes) {
  for (const ref of recipe.equipment) {
    if (!equipmentIds.has(ref.equipmentId)) {
      throw new Error(
        `Recipe "${recipe.id}" references unknown equipment id "${ref.equipmentId}"`
      );
    }
  }
  for (const step of recipe.steps) {
    for (const ref of step.glossaryRefs ?? []) {
      if (!glossaryIds.has(ref)) {
        throw new Error(
          `Recipe "${recipe.id}" step "${step.id}" references unknown glossary id "${ref}"`
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Public accessors
// ---------------------------------------------------------------------------

export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function getRecipesByType(type: CoffeeType | "all"): Recipe[] {
  if (type === "all") return recipes;
  return recipes.filter((r) => r.coffeeType === type);
}

export function getEquipmentById(id: string): Equipment | undefined {
  return equipmentCatalog.find((e) => e.id === id);
}

/** Resolves a recipe's equipment references into full catalog entries, in order. */
export function getEquipmentForRecipe(recipe: Recipe): ResolvedEquipment[] {
  return recipe.equipment.map((ref) => {
    const entry = getEquipmentById(ref.equipmentId);
    if (!entry) {
      // Should be unreachable due to the integrity check above, but keeps
      // this function safe to call in isolation (e.g. in tests).
      throw new Error(`Unknown equipment id "${ref.equipmentId}"`);
    }
    return { ...entry, optional: ref.optional };
  });
}

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return glossary.find((g) => g.id === id);
}

export function getAllGlossaryTerms(): GlossaryTerm[] {
  return [...glossary].sort((a, b) => a.term.localeCompare(b.term));
}

export function getTroubleshootingForType(type: CoffeeType): TroubleshootingGuide | undefined {
  return troubleshootingGuides.find((g) => g.coffeeType === type);
}

export const COFFEE_TYPE_LABELS: Record<CoffeeType, string> = {
  "pour-over": "Pour Over",
  immersion: "Immersion",
  "espresso-based": "Espresso",
  cold: "Cold Brew",
  moka: "Moka Pot",
};

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds >= 3600) {
    const hrs = Math.round(totalSeconds / 3600);
    return `${hrs} hr${hrs > 1 ? "s" : ""}`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins} min`;
  return `${mins}m ${secs}s`;
}
