import { ProcessStageId } from "@/types";
import SteamingCup from "@/components/SteamingCup";

interface Props {
  stage: ProcessStageId;
  size?: number;
  className?: string;
}

/** One small looping animation per stage of the coffee journey, growing → cup. Pure SVG + CSS, no photo needed. */
export default function ProcessStageIcon({ stage, size = 56, className = "" }: Props) {
  const common = { width: size, height: size, viewBox: "0 0 56 56", "aria-hidden": true as const };

  switch (stage) {
    case "growing":
      return (
        <svg {...common} className={className}>
          <path d="M28 46V22" stroke="#6B7A4F" strokeWidth="2.5" strokeLinecap="round" />
          <g className="origin-bottom animate-sway" style={{ transformOrigin: "28px 46px" }}>
            <path d="M28 30c-8-2-11-9-11-9s9-1 11 7" fill="#6B7A4F" />
            <path d="M28 26c8-2 11-9 11-9s-9-1-11 7" fill="#6B7A4F" />
            <circle className="animate-pulse-grow" cx="28" cy="18" r="4" fill="#C0392B" />
          </g>
        </svg>
      );
    case "harvesting":
      return (
        <svg {...common} className={className}>
          <path d="M14 40c0-9 6-16 14-16s14 7 14 16" fill="none" stroke="#3A2E27" strokeWidth="2" />
          <circle cx="20" cy="34" r="2.6" fill="#C0392B" />
          <circle cx="34" cy="30" r="2.6" fill="#C0392B" />
          <circle cx="28" cy="38" r="2.6" fill="#C0392B" />
          <g className="animate-pick" style={{ transformOrigin: "28px 12px" }}>
            <path d="M28 12v10" stroke="#EDE6DA" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M22 12c2-3 10-3 12 0" fill="none" stroke="#EDE6DA" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "processing":
      return (
        <svg {...common} className={className}>
          <path d="M18 16h20l-3 10a3 3 0 0 1-2.9 2.2h-8.2A3 3 0 0 1 21 26l-3-10Z" fill="none" stroke="#C9A66B" strokeWidth="2" />
          <rect x="16" y="30" width="24" height="12" rx="2" fill="none" stroke="#C9A66B" strokeWidth="2" />
          <circle className="animate-bubble1" cx="24" cy="38" r="1.4" fill="#8FB0D9" />
          <circle className="animate-bubble2" cx="28" cy="38" r="1.1" fill="#8FB0D9" />
          <circle className="animate-bubble3" cx="32" cy="38" r="1.3" fill="#8FB0D9" />
        </svg>
      );
    case "drying":
      return (
        <svg {...common} className={className}>
          <circle cx="28" cy="16" r="6" fill="#C9A66B" />
          <path className="animate-ray-pulse-1" d="M28 4v4M40 16h-4M16 16h4" stroke="#C9A66B" strokeWidth="2" strokeLinecap="round" />
          <path className="animate-ray-pulse-2" d="M36.5 7.5l-2.8 2.8M22.3 21.7l-2.8 2.8" stroke="#C9A66B" strokeWidth="2" strokeLinecap="round" />
          <path className="animate-ray-pulse-3" d="M19.5 7.5l2.8 2.8" stroke="#C9A66B" strokeWidth="2" strokeLinecap="round" />
          <rect x="12" y="34" width="32" height="8" rx="1.5" fill="none" stroke="#3A2E27" strokeWidth="2" />
          <circle cx="18" cy="38" r="1.6" fill="#3A2E27" />
          <circle cx="24" cy="38" r="1.6" fill="#3A2E27" />
          <circle cx="30" cy="38" r="1.6" fill="#3A2E27" />
          <circle cx="36" cy="38" r="1.6" fill="#3A2E27" />
        </svg>
      );
    case "milling":
      return (
        <svg {...common} className={className}>
          <g className="animate-spin" style={{ transformOrigin: "28px 26px", animationDuration: "4s" }}>
            <circle cx="28" cy="26" r="12" fill="none" stroke="#C9A66B" strokeWidth="2" />
            <path d="M28 14v4M28 34v4M16 26h4M36 26h4M19.5 17.5l2.8 2.8M33.7 33.7l2.8 2.8M36.5 17.5l-2.8 2.8M22.3 33.7l-2.8 2.8" stroke="#C9A66B" strokeWidth="2" strokeLinecap="round" />
          </g>
          <circle cx="28" cy="26" r="3" fill="#EDE6DA" />
        </svg>
      );
    case "roasting":
      return (
        <svg {...common} className={className}>
          <g className="animate-spin" style={{ transformOrigin: "28px 30px", animationDuration: "3s" }}>
            <ellipse cx="28" cy="30" rx="14" ry="9" fill="#3A2E27" stroke="#C9A66B" strokeWidth="1.5" />
            <path d="M18 30h20" stroke="#C9A66B" strokeWidth="1.2" opacity="0.6" />
          </g>
          <path className="animate-steam1 origin-bottom" d="M22 15c-2 2-2 3.5 0 5.5" stroke="#EDE6DA" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" />
          <path className="animate-steam2 origin-bottom" d="M28 12c-2 2-2 3.5 0 5.5" stroke="#EDE6DA" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" />
          <path className="animate-steam3 origin-bottom" d="M34 15c-2 2-2 3.5 0 5.5" stroke="#EDE6DA" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "grinding":
      return (
        <svg {...common} className={className}>
          <path d="M18 12h20l-3 12H21l-3-12Z" fill="none" stroke="#C9A66B" strokeWidth="2" />
          <g className="animate-spin" style={{ transformOrigin: "28px 18px", animationDuration: "1.2s" }}>
            <circle cx="28" cy="18" r="3" fill="#C9A66B" />
          </g>
          <circle className="animate-fall1" cx="24" cy="28" r="1.2" fill="#3A2E27" />
          <circle className="animate-fall2" cx="28" cy="28" r="1.2" fill="#3A2E27" />
          <circle className="animate-fall3" cx="32" cy="28" r="1.2" fill="#3A2E27" />
          <rect x="19" y="38" width="18" height="6" rx="1" fill="#3A2E27" />
        </svg>
      );
    case "brewing":
      return <SteamingCup size={size} className={className} />;
  }
}
