# Brew Guide

A mobile-first coffee app built around three flows from the homepage:

1. **Introduction to Coffee** — tasting notes, roast levels, origins/processing, and a brewing glossary.
2. **Step-by-Step Brewing Guide** — pick a recipe by brew type, see equipment/ingredients, then get walked through it with timers.
3. **Add a Coffee Spot** — log a place you just tried, pinned on a map with your rating and notes.

Built with **React + Vite + TypeScript + Tailwind + React Router + Leaflet**,
deployable to Vercel as an installable PWA.

## Project structure

```
index.html                     Vite entry HTML — fonts, manifest link
src/
  main.tsx                     React root (also imports leaflet.css)
  App.tsx                      Route definitions (react-router-dom)
  index.css                    Tailwind + base styles
  types.ts                     TypeScript schema for the whole knowledge base
  pages/
    HomePage.tsx                 The 3-flow hub
    BrewPage.tsx                 Browse/filter recipes
    RecipeDetailPage.tsx         Equipment, ingredients, steps, troubleshooting
    BrewFlowPage.tsx             Guided step-by-step flow with timers + glossary tags
    BrewDonePage.tsx             Completion screen
    learn/
      LearnHomePage.tsx           Introduction to Coffee hub
      TastingNotesPage.tsx        Tasting dimensions + flavor categories
      RoastLevelsPage.tsx         Light/medium/dark roast guide
      OriginsPage.tsx             Processing methods (washed/natural/honey)
      GlossaryPage.tsx            Browsable brewing-term glossary
    spots/
      SpotsPage.tsx                Map + list of logged coffee spots
      AddSpotPage.tsx               Form with tap-to-pin map / geolocation
  components/
    RecipeCard.tsx, CoffeeTypeFilter.tsx, StepTimer.tsx, ProgressBar.tsx,
    GlossaryTag.tsx              Inline expandable term definition
  lib/
    schema.ts                   Zod schemas — validates every data file
    knowledgeBase.ts             Loads, validates, cross-checks, and exposes
                                  all recipe/equipment/glossary/etc. data
    spotsStore.ts                localStorage-backed CRUD for coffee spots
    leafletIcons.ts               Fixes Leaflet's default marker icon paths
                                   under Vite bundling
  data/
    equipment.json               Master equipment catalog (id, category, description)
    glossary.json                Brewing term definitions
    troubleshooting.json         Common issues per brew method, with cause + fix
    tastingDimensions.json       Acidity / body / sweetness / aftertaste / balance
    tastingNotes.json            Flavor categories (fruity, floral, nutty, etc.)
    roastLevels.json             Light/medium/dark roast characteristics
    processingMethods.json       Washed / natural / honey processing
    recipes/*.json                One file per recipe, referencing equipment
                                  and glossary entries by id
scripts/
  scrape-recipe.ts              Starter template for pulling in new recipes
public/
  manifest.json                 PWA manifest (add icons — see below)
vercel.json                     SPA rewrite rule for client-side routing
```

### How the knowledge base fits together

Recipes don't repeat equipment names or brewing-term explanations inline —
they reference shared entries by id:

- `recipes/*.json` → `equipment: [{ "equipmentId": "v60-dripper" }]` looks
  up its full name/category/description from `data/equipment.json`.
- `steps[].glossaryRefs: ["bloom"]` looks up its definition from
  `data/glossary.json` and renders as a tap-to-expand tag during brewing.
- `troubleshooting.json` is keyed by `coffeeType`, so every recipe of that
  method automatically shows the same "if something's off" section.

`src/lib/schema.ts` defines a Zod schema for every file, and
`src/lib/knowledgeBase.ts` parses all of it on load — including checking
that every `equipmentId` and `glossaryRefs` id actually exists, and that
every `coffeeType` has a troubleshooting guide. If you add a recipe with a
typo'd equipment id, the app throws a clear error immediately instead of
silently rendering a blank line, so mistakes get caught while you're
editing rather than showing up on a phone later.

**Adding a recipe** is just dropping a new JSON file into
`src/data/recipes/` — `import.meta.glob` picks it up automatically, no
other code changes needed. If it needs a new piece of equipment or brewing
term, add that to `equipment.json` / `glossary.json` first and reference
its id.

## Getting started (in VS Code)

```bash
npm install
npm run dev
```

Open http://localhost:5173. Resize your browser to a phone width, or open
it on your phone once deployed, to see the mobile layout.

### Missing pieces to fill in

1. **App icons** — `public/manifest.json` references
   `public/icons/icon-192.png` and `icon-512.png`, which don't exist yet.
   Drop in two square PNGs at those paths (a coffee cup mark, your roast
   palette from `tailwind.config.ts` works well) so the app installs with
   a proper icon on phones.
2. **More recipes** — `src/data/recipes/` ships with six well-known
   methods (V60, French press, AeroPress, moka pot, cold brew, espresso)
   written from scratch in the app's own words, not copied from any
   source. Use `scripts/scrape-recipe.ts` as a starting point to pull in
   more from articles/YouTube — see the comments in that file for the
   recommended pipeline (extract facts, then have an LLM structure them
   into the `Recipe` type, rather than storing scraped prose verbatim).
   `scripts/scrape-recipe.ts` still writes flat recipe objects; point it
   at `src/data/recipes/<id>.json` and reuse ids from `equipment.json`
   where the gear already exists in the catalog.
3. **Coffee spots storage** — spots logged via "Add a Coffee Spot" are
   saved to `localStorage`, so they're per-device and not backed up or
   synced between people. If you want spots to persist across devices or
   be shareable, that's the point to add a small backend (Vercel
   Postgres/Supabase + a couple of serverless functions) and swap
   `src/lib/spotsStore.ts` for calls to it — the page components don't
   need to change, just that one module.
4. **Map tiles** — the map uses OpenStreetMap's free public tile server,
   which is fine for development but asks that production apps either
   self-host tiles or use a provider with a usage policy suited to your
   traffic (e.g. MapTiler, Stadia Maps) once this gets real usage.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **New Project** → import the repo → framework preset
   **Vite** is auto-detected → Deploy.
3. `vercel.json` handles the SPA rewrite so client-side routes like
   `/recipe/v60-pour-over` don't 404 on refresh.
4. No environment variables are required for the current feature set
   (everything reads from the local `src/data/recipes.json`).

Once deployed, opening the Vercel URL on a phone and choosing
"Add to Home Screen" (iOS Safari) or the install prompt (Android Chrome)
installs it like a native app, using `public/manifest.json`.

## Where to extend next

- **Persistent recipe storage**: swap `src/data/recipes.json` for a
  database (Vercel Postgres, Supabase, etc.) once you're adding recipes
  regularly instead of hand-editing JSON — this would mean adding a small
  API layer (e.g. Vercel Serverless Functions) since a plain Vite SPA has
  no server of its own.
- **Search**: a text search over `name`/`summary` on the home page.
- **Grind/dose scaling**: let the user adjust `servings` and scale
  `ingredients` amounts proportionally.
- **Wake lock**: during the brew flow, request the Screen Wake Lock API
  so the phone screen doesn't sleep mid-timer.
- **Offline support**: a service worker (e.g. via `vite-plugin-pwa`) so
  recipes are usable without signal.
