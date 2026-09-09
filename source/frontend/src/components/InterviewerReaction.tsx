"use client";

import { useEffect, useState } from "react";
import { Frown, Loader2, Meh, Smile, type LucideIcon } from "lucide-react";
import SentenceText from "./SentenceText";
import { useTypewriter } from "@/lib/useTypewriter";
import { pickRandomThinkingLine } from "@/data/thinkingLines";
import {
  playFailBuzzer,
  playPassStamp,
  playThinkingTick,
  playTypeClick,
} from "@/lib/sfx";

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

/** 판정 대기가 길어져도 계속 고민하는 것처럼 보이도록 문구를 갈아준다. */
const THINKING_ROTATE_MS = 10_000;

export default function InterviewerReaction({
  interviewerName,
  mood,
  message,
}: InterviewerReactionProps) {
  const style = MOOD_STYLE[mood];
  const Icon = style.icon;

  const [thinkingLine, setThinkingLine] = useState(() => pickRandomThinkingLine());

  // 생각 중인 동안 10초마다 다른 문구로 바꾼다. effect 본문에서 곧바로
  // setState하지 않도록 첫 교체도 setTimeout(0)으로 큐잉한다
  // (react-hooks/set-state-in-effect 회피).
  useEffect(() => {
    if (mood !== "thinking") return;
    const rotate = () => setThinkingLine(pickRandomThinkingLine());
    const kickoff = setTimeout(rotate, 0);
    const interval = setInterval(rotate, THINKING_ROTATE_MS);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
  }, [mood]);

  const textToShow = mood === "thinking" ? thinkingLine : message;
  const displayedMessage = useTypewriter(textToShow ?? "", 22, playTypeClick);

  // 통과/탈락이 확정되는 순간 임팩트 사운드를 한 번 재생한다.
  useEffect(() => {
    if (mood === "pass") playPassStamp();
    if (mood === "fail") playFailBuzzer();
  }, [mood]);

  // 채점 대기 중에는 시계 초침처럼 째깍거리는 소리를 반복한다.
  useEffect(() => {
    if (mood !== "thinking") return;
    const interval = setInterval(playThinkingTick, 550);
    return () => clearInterval(interval);
  }, [mood]);

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
      {textToShow && (
        <p className="max-w-sm rounded-sm border border-paper-dark/30 bg-wood/60 px-4 py-2 text-sm leading-relaxed text-paper">
          &ldquo;
          <SentenceText text={displayedMessage} />
          &rdquo;
        </p>
      )}
    </div>
  );
}
