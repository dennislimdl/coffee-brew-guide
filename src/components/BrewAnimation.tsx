/**
 * A one-shot choreographed sequence for the launch splash: beans drop into
 * a grinder, ground coffee falls into the machine, it drips into a cup,
 * and the cup steams once full. Pure SVG + CSS keyframes, no assets.
 *
 * Rough timeline (ms from mount):
 *   0    – beans start falling into the hopper
 *   500  – grinder spins/shakes, grounds start falling out the bottom
 *   1150 – machine "activates"
 *   1250 – coffee drips down into the cup, liquid level rises
 *   1900 – steam rises off the finished cup
 */
export default function BrewAnimation({ className = "" }: { className?: string }) {
  return (
    <div className={`brew-anim ${className}`}>
      <style>{`
        .brew-anim .bean {
          opacity: 0;
          animation: brewBeanFall 420ms ease-in forwards;
        }
        .brew-anim .bean1 { animation-delay: 0ms; }
        .brew-anim .bean2 { animation-delay: 110ms; }
        .brew-anim .bean3 { animation-delay: 220ms; }
        .brew-anim .bean4 { animation-delay: 330ms; }
        @keyframes brewBeanFall {
          0%   { transform: translateY(-26px); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(30px); opacity: 0; }
        }

        .brew-anim .grinder-body {
          animation: brewGrinderShake 550ms ease-in-out;
          animation-delay: 500ms;
          animation-fill-mode: backwards;
        }
        @keyframes brewGrinderShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-1.4px); }
          40% { transform: translateX(1.4px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        .brew-anim .grinder-wheel {
          transform-origin: 101px 56px;
          animation: brewGrinderSpin 550ms linear;
          animation-delay: 500ms;
          animation-fill-mode: backwards;
        }
        @keyframes brewGrinderSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .brew-anim .ground {
          opacity: 0;
          animation: brewGroundFall 400ms ease-in forwards;
        }
        .brew-anim .ground1 { animation-delay: 700ms; }
        .brew-anim .ground2 { animation-delay: 800ms; }
        .brew-anim .ground3 { animation-delay: 900ms; }
        @keyframes brewGroundFall {
          0%   { transform: translateY(-4px); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(26px); opacity: 0; }
        }

        .brew-anim .machine-light {
          opacity: 0;
          animation: brewFadeIn 300ms ease-out forwards;
          animation-delay: 1150ms;
        }
        @keyframes brewFadeIn {
          to { opacity: 1; }
        }

        .brew-anim .drip {
          opacity: 0;
          stroke-dasharray: 34;
          stroke-dashoffset: 34;
          animation: brewDrip 500ms ease-in forwards;
          animation-delay: 1250ms;
        }
        @keyframes brewDrip {
          0%   { stroke-dashoffset: 34; opacity: 0; }
          15%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        .brew-anim .coffee-fill {
          transform: scaleY(0);
          transform-origin: 101px 190px;
          animation: brewFillCup 550ms ease-out forwards;
          animation-delay: 1300ms;
        }
        @keyframes brewFillCup {
          to { transform: scaleY(1); }
        }

        .brew-anim .steam-line {
          opacity: 0;
          animation: brewSteamRise 900ms ease-in-out forwards;
        }
        .brew-anim .steam1 { animation-delay: 1900ms; }
        .brew-anim .steam2 { animation-delay: 1980ms; }
        .brew-anim .steam3 { animation-delay: 2060ms; }
        @keyframes brewSteamRise {
          0%   { transform: translateY(0); opacity: 0; }
          25%  { opacity: 0.7; }
          70%  { opacity: 0.4; }
          100% { transform: translateY(-14px); opacity: 0; }
        }
      `}</style>

      <svg viewBox="0 0 202 200" width="176" height="174" aria-hidden="true">
        {/* falling beans */}
        <ellipse className="bean bean1" cx="89" cy="8" rx="4" ry="3" fill="#8B5A2B" transform="rotate(-20 89 8)" />
        <ellipse className="bean bean2" cx="101" cy="5" rx="4" ry="3" fill="#8B5A2B" transform="rotate(12 101 5)" />
        <ellipse className="bean bean3" cx="113" cy="8" rx="4" ry="3" fill="#8B5A2B" transform="rotate(-10 113 8)" />
        <ellipse className="bean bean4" cx="96" cy="3" rx="4" ry="3" fill="#8B5A2B" transform="rotate(16 96 3)" />

        {/* hopper + grinder body */}
        <g className="grinder-body">
          <path d="M79 18 L123 18 L109 43 L93 43 Z" fill="#3A2E27" stroke="#EDE6DA" strokeOpacity="0.15" />
          <rect x="86" y="43" width="30" height="22" rx="4" fill="#2A211C" stroke="#EDE6DA" strokeOpacity="0.15" />
          <g className="grinder-wheel">
            <circle cx="101" cy="54" r="6" fill="none" stroke="#C9A66B" strokeWidth="2" />
            <path d="M101 49v10M96 54h10" stroke="#C9A66B" strokeWidth="1.5" />
          </g>
        </g>

        {/* ground coffee falling from grinder to machine */}
        <circle className="ground ground1" cx="97" cy="68" r="1.5" fill="#3A2E27" />
        <circle className="ground ground2" cx="101" cy="68" r="1.3" fill="#3A2E27" />
        <circle className="ground ground3" cx="105" cy="68" r="1.5" fill="#3A2E27" />

        {/* coffee machine */}
        <rect x="71" y="93" width="60" height="26" rx="4" fill="#2A211C" stroke="#EDE6DA" strokeOpacity="0.15" />
        <rect className="machine-light" x="95" y="97" width="12" height="6" rx="2" fill="#C9A66B" />
        <rect x="97" y="119" width="8" height="10" fill="#2A211C" />

        {/* drip stream */}
        <line className="drip" x1="101" y1="129" x2="101" y2="163" stroke="#C9A66B" strokeWidth="2" strokeLinecap="round" />

        {/* cup */}
        <ellipse cx="101" cy="193" rx="28" ry="4.5" fill="#3A2E27" />
        <path
          d="M78 165h46l-4 20a6 6 0 0 1-6 5H88a6 6 0 0 1-6-5l-4-20Z"
          fill="none"
          stroke="#EDE6DA"
          strokeOpacity="0.35"
          strokeWidth="2"
        />
        <clipPath id="brewCupClip">
          <path d="M78 165h46l-4 20a6 6 0 0 1-6 5H88a6 6 0 0 1-6-5l-4-20Z" />
        </clipPath>
        <rect
          className="coffee-fill"
          x="78"
          y="165"
          width="46"
          height="25"
          fill="#4A2E1A"
          clipPath="url(#brewCupClip)"
        />
        <path
          d="M124 170c8-1 12 4 12 9s-4 9-12 9"
          stroke="#EDE6DA"
          strokeOpacity="0.35"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* steam */}
        <path className="steam-line steam1" d="M90 158c-2 2-2 3.5 0 5.5" stroke="#EDE6DA" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path className="steam-line steam2" d="M101 155c-2 2-2 3.5 0 5.5" stroke="#EDE6DA" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path className="steam-line steam3" d="M112 158c-2 2-2 3.5 0 5.5" stroke="#EDE6DA" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
