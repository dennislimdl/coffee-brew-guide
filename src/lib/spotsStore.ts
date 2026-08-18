import { CoffeeSpot } from "@/types";
import { coffeeSpotSchema } from "@/lib/schema";

const STORAGE_KEY = "brew-guide:coffee-spots";

function readAll(): CoffeeSpot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Skip (rather than crash on) any corrupted entry instead of losing the
    // whole list to one bad record.
    return parsed.flatMap((item) => {
      const result = coffeeSpotSchema.safeParse(item);
      return result.success ? [result.data] : [];
    });
  } catch {
    return [];
  }
}

function writeAll(spots: CoffeeSpot[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
}

export function getAllSpots(): CoffeeSpot[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getSpotById(id: string): CoffeeSpot | undefined {
  return readAll().find((s) => s.id === id);
}

export function addSpot(spot: Omit<CoffeeSpot, "id" | "createdAt">): CoffeeSpot {
  const newSpot: CoffeeSpot = {
    ...spot,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const validated = coffeeSpotSchema.parse(newSpot);
  writeAll([...readAll(), validated]);
  return validated;
}

export function deleteSpot(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}
