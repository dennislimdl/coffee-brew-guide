export default function ProgressBar({
  current,
  total,
}: {
  current: number; // 0-indexed current step
  total: number;
}) {
  return (
    <div
      className="flex gap-1"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i <= current ? "bg-roast-light" : "bg-husk/15"
          }`}
        />
      ))}
    </div>
  );
}
