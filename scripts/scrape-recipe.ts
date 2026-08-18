/**
 * scrape-recipe.ts
 * ------------------------------------------------------------------
 * Starter template for pulling coffee recipes into src/data/recipes/.
 *
 * This is NOT wired up to run automatically — it's a starting point for you
 * to finish in VS Code, since it needs live internet access this sandbox
 * doesn't have.
 *
 * Usage (after `npm install`):
 *   npm run scrape -- --url=https://example.com/some-coffee-recipe
 *
 * Two source types are stubbed below:
 *   1. Article pages  — fetched + parsed with cheerio
 *   2. YouTube videos — you'll want the official captions/transcript,
 *      not the video file. A couple of options:
 *        - `youtube-transcript` npm package (unofficial, easy) for public
 *          caption tracks
 *        - YouTube Data API (official, needs an API key) for metadata
 *
 * IMPORTANT — before scraping a given site:
 *   - Check its robots.txt and Terms of Service. Some sites explicitly
 *     disallow scraping.
 *   - Don't store or redistribute long verbatim text from the source.
 *     Extract the *structured facts* (equipment, grams, times, steps)
 *     and rewrite instructions in your own words — that's also what
 *     keeps this app's content original rather than copied.
 *   - Keep the `source` field so you always credit where a recipe's
 *     technique came from.
 *
 * Suggested pipeline for turning messy scraped text into the app's
 * schema: paste the raw extracted text into Claude (via the API or the
 * app) with a prompt like "structure this into the Recipe TypeScript
 * interface below" and paste src/types.ts as context. That's usually
 * far more reliable than regex-parsing free-form recipe prose.
 *
 * Recipes reference shared equipment/glossary entries by id (see
 * src/data/equipment.json and src/data/glossary.json) rather than
 * repeating full descriptions — check those files first and reuse an
 * existing id where the gear or term already exists, only adding a new
 * catalog entry when it genuinely doesn't.
 */

import * as cheerio from "cheerio";
import { writeFile } from "fs/promises";
import path from "path";
import { Recipe } from "../src/types";

const RECIPES_DIR = path.join(__dirname, "../src/data/recipes");

async function fetchArticleText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "coffee-brew-guide-scraper/0.1 (personal project)" },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  // Strip obviously irrelevant elements before extracting text.
  $("script, style, nav, footer, header, aside").remove();

  // Adjust this selector per-site — recipe content is often inside
  // <article>, a `.recipe` container, or similar. Fall back to <body>.
  const container = $("article").length ? $("article") : $("body");
  return container.text().replace(/\s+/g, " ").trim();
}

/**
 * Placeholder for turning raw scraped text into a structured Recipe.
 * Fill this in — e.g. call the Anthropic API here with the extracted
 * text and src/types.ts as context, and parse the JSON it returns.
 */
async function structureIntoRecipe(rawText: string, sourceUrl: string): Promise<Recipe> {
  throw new Error(
    "Not implemented: feed `rawText` to an LLM (or write manual parsing rules) " +
      "and return an object matching the Recipe interface in src/types.ts."
  );
}

async function main() {
  const url = process.argv.find((a) => a.startsWith("--url="))?.split("=")[1];
  if (!url) {
    console.error("Usage: npm run scrape -- --url=https://example.com/recipe");
    process.exit(1);
  }

  console.log(`Fetching ${url} ...`);
  const rawText = await fetchArticleText(url);

  const recipe = await structureIntoRecipe(rawText, url);

  const outPath = path.join(RECIPES_DIR, `${recipe.id}.json`);
  await writeFile(outPath, JSON.stringify(recipe, null, 2));

  console.log(`Wrote ${outPath}`);
  console.log(
    "Reminder: double-check every equipmentId and glossaryRefs id in the new " +
      "file matches an entry in equipment.json / glossary.json — the app " +
      "will throw a clear error on load if any don't."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
