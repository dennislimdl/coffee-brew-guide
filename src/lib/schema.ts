import { z } from "zod";

export const coffeeTypeSchema = z.enum([
  "pour-over",
  "immersion",
  "espresso-based",
  "cold",
  "moka",
]);

export const roastLevelSchema = z.enum(["light", "medium", "dark"]);

export const equipmentCategorySchema = z.enum([
  "brewer",
  "filter",
  "measuring",
  "heating",
  "grinding",
  "accessory",
]);

export const glossaryCategorySchema = z.enum([
  "technique",
  "measurement",
  "equipment",
]);

export const equipmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: equipmentCategorySchema,
  description: z.string().min(1),
});

export const equipmentRefSchema = z.object({
  equipmentId: z.string().min(1),
  optional: z.boolean().optional(),
});

export const glossaryTermSchema = z.object({
  id: z.string().min(1),
  term: z.string().min(1),
  category: glossaryCategorySchema,
  definition: z.string().min(1),
});

export const troubleshootingIssueSchema = z.object({
  id: z.string().min(1),
  symptom: z.string().min(1),
  likelyCause: z.string().min(1),
  fix: z.string().min(1),
});

export const troubleshootingGuideSchema = z.object({
  coffeeType: coffeeTypeSchema,
  issues: z.array(troubleshootingIssueSchema).min(1),
});

export const ingredientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  amount: z.string().min(1),
  note: z.string().optional(),
});

export const brewStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  instruction: z.string().min(1),
  durationSeconds: z.number().int().nonnegative().nullable(),
  tip: z.string().optional(),
  glossaryRefs: z.array(z.string()).optional(),
});

export const recipeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  coffeeType: coffeeTypeSchema,
  roastRecommendation: roastLevelSchema,
  summary: z.string().min(1),
  totalTimeSeconds: z.number().int().positive(),
  servings: z.number().int().positive(),
  difficulty: z.enum(["easy", "medium", "advanced"]),
  equipment: z.array(equipmentRefSchema).min(1),
  ingredients: z.array(ingredientSchema).min(1),
  steps: z.array(brewStepSchema).min(1),
  source: z.object({
    label: z.string().min(1),
    url: z.string().url().optional(),
    type: z.enum(["youtube", "article", "original"]),
  }),
});

export const tastingDimensionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
});

export const tastingNoteCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  examples: z.array(z.string().min(1)).min(1),
});

export const roastLevelGuideSchema = z.object({
  id: roastLevelSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  acidity: z.string().min(1),
  body: z.string().min(1),
  commonFlavors: z.array(z.string().min(1)).min(1),
});

export const processingMethodSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  flavorImpact: z.string().min(1),
});

export const processStageIdSchema = z.enum([
  "growing",
  "harvesting",
  "processing",
  "drying",
  "milling",
  "roasting",
  "grinding",
  "brewing",
]);

export const coffeeProcessStageSchema = z.object({
  id: processStageIdSchema,
  order: z.number().int().positive(),
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
});

export const equipmentPriceTierSchema = z.object({
  tier: z.string().min(1),
  priceRange: z.string().min(1),
  picks: z.array(z.string().min(1)).min(1),
});

export const equipmentGuideEntrySchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  name: z.string().min(1),
  tagline: z.string().min(1),
  whyItMatters: z.string().min(1),
  priceTiers: z.array(equipmentPriceTierSchema).min(1),
  hoffmannTake: z.string().min(1),
});

export const beanSpeciesSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  name: z.string().min(1),
  shareOfProduction: z.string().min(1),
  caffeineContent: z.string().min(1),
  flavorProfile: z.string().min(1),
  notes: z.string().min(1),
});

export const notableBeanSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  name: z.string().min(1),
  origin: z.string().min(1),
  description: z.string().min(1),
  priceNote: z.string().min(1),
  caveat: z.string().optional(),
});

export const placeReviewSchema = z.object({
  authorName: z.string().min(1),
  authorPhotoUrl: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1),
  relativeTime: z.string().min(1),
});

export const coffeeSpotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  drinkOrdered: z.string().optional(),
  notes: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().optional(),
  placeId: z.string().optional(),
  photos: z.array(z.string()).optional(),
  reviews: z.array(placeReviewSchema).optional(),
  createdAt: z.string().min(1),
});

export type RecipeParsed = z.infer<typeof recipeSchema>;
