import { Link } from "react-router-dom";
import SteamingCup from "@/components/SteamingCup";

const HIGHLIGHTS = [
  { label: "Learn", detail: "how beans become a cup" },
  { label: "Brew", detail: "guided recipes with timers" },
  { label: "Log", detail: "the spots you love" },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-12 text-center">
      <SteamingCup size={128} className="animate-fade-in-up" />

      <p className="mt-6 animate-fade-in-up font-mono text-xs uppercase tracking-[0.25em] text-roast-light" style={{ animationDelay: "80ms" }}>
        Welcome to
      </p>
      <h1
        className="mt-2 animate-fade-in-up font-display text-5xl font-semibold italic leading-[1.05] text-husk"
        style={{ animationDelay: "140ms" }}
      >
        Brew Guide
      </h1>

      <p
        className="mt-5 max-w-xs animate-fade-in-up text-sm leading-relaxed text-husk/60"
        style={{ animationDelay: "220ms" }}
      >
        Your pocket companion for better coffee — understand what's actually
        in your cup, get walked step by step through brewing it well, and
        keep a running list of the coffee spots worth going back to.
      </p>

      <div
        className="mt-7 flex animate-fade-in-up flex-wrap items-center justify-center gap-2"
        style={{ animationDelay: "300ms" }}
      >
        {HIGHLIGHTS.map((h, i) => (
          <span key={h.label} className="flex items-center gap-2">
            <span className="rounded-full border border-husk/10 bg-bark/70 px-3 py-1.5 text-xs text-husk/70">
              <span className="font-semibold text-roast-light">{h.label}</span> — {h.detail}
            </span>
            {i < HIGHLIGHTS.length - 1 && (
              <span className="text-husk/20" aria-hidden="true">
                ·
              </span>
            )}
          </span>
        ))}
      </div>

      <Link
        to="/learn"
        className="mt-9 w-full max-w-xs animate-fade-in-up rounded-xl bg-roast-light py-3.5 text-center font-semibold text-char shadow-lg shadow-roast-light/20 transition-transform active:scale-[0.98]"
        style={{ animationDelay: "380ms" }}
      >
        Get Started
      </Link>
      <Link
        to="/brew"
        className="mt-3 animate-fade-in-up text-xs text-husk/40 hover:text-husk/70"
        style={{ animationDelay: "440ms" }}
      >
        or jump straight to brewing &rarr;
      </Link>
    </main>
  );
}
