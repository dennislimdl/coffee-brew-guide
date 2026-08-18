interface Props {
  size?: number;
  className?: string;
}

/** A hand-drawn, CSS-animated cup of coffee with rising steam. No photo license needed — pure SVG + Tailwind keyframes. */
export default function SteamingCup({ size = 96, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g className="origin-bottom animate-steam1">
        <path
          d="M38 34c-3 3-3 6 0 9s3 6 0 9"
          stroke="#EDE6DA"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      <g className="origin-bottom animate-steam2">
        <path
          d="M50 30c-3 3-3 6 0 9s3 6 0 9"
          stroke="#EDE6DA"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
      <g className="origin-bottom animate-steam3">
        <path
          d="M62 34c-3 3-3 6 0 9s3 6 0 9"
          stroke="#EDE6DA"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* saucer */}
      <ellipse cx="50" cy="83" rx="30" ry="4.5" fill="#3A2E27" />
      {/* cup body */}
      <path
        d="M25 55h46l-4 20a6 6 0 0 1-6 5H35a6 6 0 0 1-6-5l-4-20Z"
        fill="#C9A66B"
      />
      <path d="M25 55h46l-1.5 7.5H26.5L25 55Z" fill="#EDE6DA" fillOpacity="0.85" />
      {/* handle */}
      <path
        d="M71 60c8-1 12 4 12 9s-4 9-12 9"
        stroke="#C9A66B"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
