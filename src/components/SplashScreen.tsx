import { useEffect, useState } from "react";
import BrewAnimation from "@/components/BrewAnimation";

// Matches BrewAnimation's own internal timeline (last steam wisp finishes
// around 2960ms) so the fade-out doesn't cut the sequence off mid-story.
const HOLD_MS = 2500;
const FADE_MS = 400;

/** Plays once when the app first boots — the home-screen icon itself can't animate (a hard OS limitation), so this is the closest thing: beans → grinder → machine → cup, then fade into the app underneath. */
export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), HOLD_MS);
    const doneTimer = setTimeout(onDone, HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-char transition-opacity ease-out"
      style={{ transitionDuration: `${FADE_MS}ms`, opacity: fadingOut ? 0 : 1 }}
    >
      <BrewAnimation />
      <p className="mt-2 font-display text-xl font-semibold italic text-husk">Brew Guide</p>
    </div>
  );
}
