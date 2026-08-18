import { CoffeeType } from "@/types";

interface Props {
  type: CoffeeType;
  size?: number;
  className?: string;
}

/** Small looping animation per brew method — a drip for pour-over, bubbles for immersion/moka, a steam burst for espresso, a still icicle for cold brew. */
export default function BrewTypeIcon({ type, size = 40, className = "" }: Props) {
  const common = { width: size, height: size, viewBox: "0 0 40 40", "aria-hidden": true as const };

  switch (type) {
    case "pour-over":
      return (
        <svg {...common} className={className}>
          <path d="M10 6h20l-6 12v3h-8v-3L10 6Z" fill="none" stroke="#C9A66B" strokeWidth="2" />
          <circle className="animate-drip" cx="20" cy="23" r="1.6" fill="#C9A66B" />
          <rect x="15" y="30" width="10" height="6" rx="1" fill="#3A2E27" />
        </svg>
      );
    case "immersion":
      return (
        <svg {...common} className={className}>
          <rect x="11" y="14" width="18" height="18" rx="2" fill="none" stroke="#C9A66B" strokeWidth="2" />
          <circle className="animate-bubble1" cx="17" cy="27" r="1.4" fill="#C9A66B" />
          <circle className="animate-bubble2" cx="21" cy="27" r="1.1" fill="#C9A66B" />
          <circle className="animate-bubble3" cx="24" cy="27" r="1.3" fill="#C9A66B" />
        </svg>
      );
    case "espresso-based":
      return (
        <svg {...common} className={className}>
          <path d="M12 18h16l-2 12a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3l-2-12Z" fill="#3A2E27" stroke="#C9A66B" strokeWidth="1.5" />
          <path className="animate-steam1 origin-bottom" d="M17 12c-2 2-2 3.5 0 5.5" stroke="#EDE6DA" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" />
          <path className="animate-steam2 origin-bottom" d="M22 10c-2 2-2 3.5 0 5.5" stroke="#EDE6DA" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "moka":
      return (
        <svg {...common} className={className}>
          <path d="M13 24h14l-2 8a2 2 0 0 1-2 1.5h-6A2 2 0 0 1 15 32l-2-8Z" fill="none" stroke="#C9A66B" strokeWidth="2" />
          <path d="M14 24l3-10h6l3 10" fill="none" stroke="#C9A66B" strokeWidth="2" />
          <circle className="animate-bubble1" cx="18" cy="17" r="1.1" fill="#C9A66B" />
          <circle className="animate-bubble3" cx="22" cy="17" r="1" fill="#C9A66B" />
        </svg>
      );
    case "cold":
      return (
        <svg {...common} className={className}>
          <rect x="11" y="10" width="6" height="6" rx="1" fill="none" stroke="#8FB0D9" strokeWidth="1.5" opacity="0.8" />
          <rect x="20" y="16" width="6" height="6" rx="1" fill="none" stroke="#8FB0D9" strokeWidth="1.5" opacity="0.8" />
          <rect x="13" y="22" width="6" height="6" rx="1" fill="none" stroke="#8FB0D9" strokeWidth="1.5" opacity="0.8" />
          <path d="M12 32h16" stroke="#C9A66B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
