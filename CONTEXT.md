# Project notes — for picking this back up in VS Code

This file exists because the Claude.ai conversation that built this project
doesn't travel with the code automatically. If you're continuing this build
with Claude Code (or just your own memory), this is the "what happened and
why" record.

## What this is

A mobile-first coffee app with three flows off the homepage:

1. **Introduction to Coffee** (`/learn`) — tasting notes, roast levels,
   origins/processing, glossary.
2. **Step-by-Step Brewing Guide** (`/brew` → `/recipe/:id` → `/recipe/:id/brew`)
   — pick a recipe, see equipment/ingredients, get walked through steps
   with timers.
3. **Add a Coffee Spot** (`/spots`, `/spots/new`) — log a place you tried,
   pinned on a Leaflet/OpenStreetMap map, saved to `localStorage`.

Stack: React + Vite + TypeScript + Tailwind + React Router + Leaflet + Zod.
Target host: Vercel (SPA, `vercel.json` has the rewrite rule already).

## How we got here (chronological)

1. Started as a Next.js app; rebuilt as plain Vite + React per request —
   simpler client-only setup, still deploys to Vercel fine.
2. Recipe data started as one flat `recipes.json`, then got restructured
   into a proper normalized knowledge base:
   - `src/data/equipment.json` — shared equipment catalog, recipes
     reference entries by id instead of repeating name/description.
   - `src/data/glossary.json` — brewing terms, linked from specific
     recipe steps via `glossaryRefs`.
   - `src/data/troubleshooting.json` — one guide per coffee type
     (pour-over, immersion, espresso-based, moka, cold).
   - `src/data/recipes/*.json` — one file per recipe (was one array),
     auto-discovered via `import.meta.glob`.
   - `src/lib/schema.ts` (Zod) + `src/lib/knowledgeBase.ts` — validates
     every file on load AND checks cross-references (e.g. a recipe can't
     reference an equipment id that doesn't exist) — throws a clear error
     immediately if data is inconsistent, rather than silently breaking UI.
3. Homepage was originally the recipe browser; restructured into a hub
   linking to the three flows above once that was requested. The old
   recipe-browsing content moved to `BrewPage.tsx` at `/brew`.
4. Added the "Introduction to Coffee" content as its own mini knowledge
   base: `tastingDimensions.json`, `tastingNotes.json`, `roastLevels.json`,
   `processingMethods.json` — same Zod-validated pattern as recipes.
5. Added coffee spots: `src/lib/spotsStore.ts` (localStorage CRUD),
   Leaflet map components, tap-to-pin + geolocation on the add-spot form.

## Known gaps / explicit next steps

These were flagged along the way and are still open:

- **App icons don't exist yet.** `public/manifest.json` points at
  `public/icons/icon-192.png` and `icon-512.png` — need actual PNGs there
  or the PWA install icon will be broken.
- **Coffee spots are device-local only** (`localStorage`, no backend). If
  spots should sync across devices, that means adding a small backend
  (Vercel Postgres/Supabase + serverless functions) and swapping out
  `src/lib/spotsStore.ts` — the page components shouldn't need to change.
- **Map tiles** use OpenStreetMap's free public tile server — fine for
  dev, but their usage policy expects production apps with real traffic
  to self-host tiles or use a paid provider (MapTiler, Stadia Maps, etc.).
- **No live scraping happened.** I don't have internet access in the
  sandbox that built this, so all 6 seed recipes were written from
  scratch (not scraped) and `scripts/scrape-recipe.ts` is a documented
  starting template, not a working scraper — the `structureIntoRecipe()`
  function in it deliberately throws "not implemented."
- **Never ran an actual `npm install` / build.** The sandbox that built
  this has no network access to the npm registry, so nothing here has
  been through a real TypeScript compile or `vite build` — only manual
  JSON validation and import-path resolution checks. Worth running
  `npm run dev` early after cloning to catch anything that slipped
  through (dependency version mismatches are the most likely culprit).

## If you want an AI assistant to keep helping on this in VS Code

Claude Code (VS Code extension or CLI) can read this file plus the rest of
the repo directly and pick up from here with full file access — that's
generally a better fit than pasting this conversation into a new chat,
since it can actually run `npm install`, the dev server, etc. itself.
