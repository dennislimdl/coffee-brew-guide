import { useEffect, useRef, useState } from "react";

interface Props {
  durationSeconds: number;
  stepId: string; // used to reset the timer when the step changes
  onComplete?: () => void;
}

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function StepTimer({ durationSeconds, stepId, onComplete }: Props) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Reset whenever we move to a new step
  useEffect(() => {
    setRemaining(durationSeconds);
    setRunning(true);
  }, [stepId, durationSeconds]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      onCompleteRef.current?.();
      return;
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining]);

  const progress = durationSeconds > 0 ? 1 - remaining / durationSeconds : 1;
  const isDone = remaining <= 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-48 w-48 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#3A2E27" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isDone ? "#6B7A4F" : "#C9A66B"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="font-mono text-4xl font-medium text-husk">
          {formatClock(Math.max(remaining, 0))}
        </span>
      </div>

      <button
        onClick={() => setRunning((r) => !r)}
        disabled={isDone}
        className="mt-4 rounded-full border border-husk/20 px-6 py-2 text-sm font-medium text-husk/80 disabled:opacity-30"
      >
        {isDone ? "Done" : running ? "Pause" : "Resume"}
      </button>
    </div>
  );
}
