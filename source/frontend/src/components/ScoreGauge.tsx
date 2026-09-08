"use client";

interface ScoreGaugeProps {
  currentTurn: number;
  totalTurns: number;
  averageScore: number;
}

const PASSING_LINE = 70;

export default function ScoreGauge({
  currentTurn,
  totalTurns,
  averageScore,
}: ScoreGaugeProps) {
  const fillPercent = Math.min(100, averageScore);

  return (
    <div className="w-full max-w-md">
      <div className="mb-1 flex items-center justify-between font-typewriter text-[11px] tracking-widest text-paper/60">
        <span>
          TURN {currentTurn} / {totalTurns}
        </span>
        <span>평균 {averageScore}점 (합격선 {PASSING_LINE}점)</span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full border border-paper-dark/30 bg-wood-dark/70">
        <div
          className="h-full bg-gradient-to-r from-stamp-red via-gold to-gold-bright transition-all duration-500"
          style={{ width: `${fillPercent}%` }}
        />
        <div
          className="absolute top-0 h-full w-[2px] bg-paper/70"
          style={{ left: `${PASSING_LINE}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
