// ---------------------------------------------------------------------------
// Core enums
// ---------------------------------------------------------------------------

export type CoffeeType =
  | "pour-over"
  | "immersion"
  | "espresso-based"
  | "cold"
  | "moka";

export type RoastLevel = "light" | "medium" | "dark";

export type EquipmentCategory =
  | "brewer"
  | "filter"
  | "measuring"
  | "heating"
  | "grinding"
  | "accessory";

export type GlossaryCategory = "technique" | "measurement" | "equipment";

// ---------------------------------------------------------------------------
// Equipment catalog — the single source of truth for every piece of gear.
// Recipes reference these by id instead of repeating name/description.
// ---------------------------------------------------------------------------

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
}

/** How a recipe references an item from the equipment catalog. */
export interface EquipmentRef {
  equipmentId: string;
  optional?: boolean;
}

/** Equipment resolved against the catalog, ready for display. */
export interface ResolvedEquipment extends Equipment {
  optional?: boolean;
}

// ---------------------------------------------------------------------------
// Glossary — brewing terms explained once, linked from wherever they're used.
// ---------------------------------------------------------------------------

export interface GlossaryTerm {
  id: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
}

// ---------------------------------------------------------------------------
// Troubleshooting — common problems per brew method, with cause and fix.
// ---------------------------------------------------------------------------

export interface TroubleshootingIssue {
  id: string;
  symptom: string;
  likelyCause: string;
  fix: string;
}

export interface TroubleshootingGuide {
  coffeeType: CoffeeType;
  issues: TroubleshootingIssue[];
}

// ---------------------------------------------------------------------------
// Coffee 101 content — tasting notes, roast level guides, processing methods
// ---------------------------------------------------------------------------

export interface TastingNoteCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

export interface TastingDimension {
  id: string;
  name: string;
  description: string;
}

export interface RoastLevelGuide {
  id: RoastLevel;
  name: string;
  description: string;
  acidity: string;
  body: string;
  commonFlavors: string[];
}

export interface ProcessingMethod {
  id: string;
  name: string;
  description: string;
  flavorImpact: string;
}

export type ProcessStageId =
  | "growing"
  | "harvesting"
  | "processing"
  | "drying"
  | "milling"
  | "roasting"
  | "grinding"
  | "brewing";

export interface CoffeeProcessStage {
  id: ProcessStageId;
  order: number;
  title: string;
  summary: string;
  description: string;
}

export interface EquipmentPriceTier {
  tier: string;
  priceRange: string;
  picks: string[];
}

export interface EquipmentGuideEntry {
  id: string;
  order: number;
  name: string;
  tagline: string;
  whyItMatters: string;
  priceTiers: EquipmentPriceTier[];
  hoffmannTake: string;
}

export interface BeanSpecies {
  id: string;
  order: number;
  name: string;
  shareOfProduction: string;
  caffeineContent: string;
  flavorProfile: string;
  notes: string;
}

export interface NotableBean {
  id: string;
  order: number;
  name: string;
  origin: string;
  description: string;
  priceNote: string;
  caveat?: string;
}

// ---------------------------------------------------------------------------
// Coffee spots — places the user has tried, logged with a map location
// ---------------------------------------------------------------------------

/** A Google review, captured at the time the spot was added — a snapshot, not a live sync. */
export interface PlaceReview {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number; // 1-5
  text: string;
  relativeTime: string; // e.g. "2 months ago", as supplied by Google
}

export interface CoffeeSpot {
  id: string;
  name: string;
  drinkOrdered?: string;
  notes?: string;
  rating: number; // 1-5
  lat: number;
  lng: number;
  address?: string;
  /** The Google Place this spot is linked to — lets photos/reviews be refreshed later, since Google's photo URLs expire. */
  placeId?: string;
  /** Google Place photo URIs, captured when the spot was added or last refreshed. These expire after a while — see placeId. */
  photos?: string[];
  /** A few Google reviews, captured when the spot was added or last refreshed. */
  reviews?: PlaceReview[];
  createdAt: string; // ISO timestamp
}

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------

export interface Ingredient {
  id: string;
  name: string;
  amount: string; // e.g. "22g", "350ml"
  note?: string;
}

export interface BrewStep {
  id: string;
  title: string;
  instruction: string;
  durationSeconds: number | null; // null = untimed / self-paced step
  tip?: string;
  glossaryRefs?: string[]; // ids into glossary.json, e.g. ["bloom"]
}

export interface Recipe {
  id: string;
  name: string;
  coffeeType: CoffeeType;
  roastRecommendation: RoastLevel;
  summary: string;
  totalTimeSeconds: number;
  servings: number;
  difficulty: "easy" | "medium" | "advanced";
  equipment: EquipmentRef[];
  ingredients: Ingredient[];
  steps: BrewStep[];
  source: {
    label: string;
    url?: string;
    type: "youtube" | "article" | "original";
  };
}
