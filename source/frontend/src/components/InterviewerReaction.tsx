"use client";

import { Frown, Loader2, Meh, Smile, type LucideIcon } from "lucide-react";

export type ReactionMood = "idle" | "thinking" | "pass" | "fail";

interface InterviewerReactionProps {
  interviewerName: string;
  mood: ReactionMood;
  message?: string;
}

const MOOD_STYLE: Record<
  ReactionMood,
  { icon: LucideIcon; ring: string; iconColor: string; spin?: boolean }
> = {
  idle: { icon: Meh, ring: "border-paper-dark/40", iconColor: "text-paper/70" },
  thinking: {
    icon: Loader2,
    ring: "border-gold/60",
    iconColor: "text-gold-bright",
    spin: true,
  },
  pass: { icon: Smile, ring: "border-gold", iconColor: "text-gold-bright" },
  fail: { icon: Frown, ring: "border-stamp-red", iconColor: "text-stamp-red" },
};

export default function InterviewerReaction({
  interviewerName,
  mood,
  message,
}: InterviewerReactionProps) {
  const style = MOOD_STYLE[mood];
  const Icon = style.icon;

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span
        className={`flex h-20 w-20 items-center justify-center rounded-full border-4 bg-wood-dark/60 transition-colors duration-300 ${style.ring}`}
      >
        <Icon
          size={38}
          strokeWidth={1.5}
          className={`${style.iconColor} ${style.spin ? "animate-spin" : ""}`}
        />
      </span>
      <p className="font-typewriter text-xs tracking-widest text-paper/60">
        {interviewerName}
      </p>
      {message && (
        <p className="max-w-sm rounded-sm border border-paper-dark/30 bg-wood/60 px-4 py-2 text-sm leading-relaxed text-paper">
          &ldquo;{message}&rdquo;
        </p>
      )}
    </div>
  );
}
