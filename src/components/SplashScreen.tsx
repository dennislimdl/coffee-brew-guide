import { useEffect, useState } from "react";
import SteamingCup from "@/components/SteamingCup";

const HOLD_MS = 900;
const FADE_MS = 350;

/** Plays once when the app first boots — the home-screen icon itself can't animate (a hard OS limitation), so this is the closest thing: a brief branded moment right after launch, before the app underneath fades in. */
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
      <SteamingCup size={104} className="animate-fade-in-up" />
      <p
        className="mt-4 animate-fade-in-up font-display text-xl font-semibold italic text-husk"
        style={{ animationDelay: "120ms" }}
      >
        Brew Guide
      </p>
    </div>
  );
}
