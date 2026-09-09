"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import SentenceText from "./SentenceText";
import { useTypewriter } from "@/lib/useTypewriter";
import { playTypeClick } from "@/lib/sfx";
import type { Question } from "@/types/interview";

const MAX_LENGTH = 120;

interface QuestionPanelProps {
  question: Question;
  disabled: boolean;
  onSubmit: (answer: string) => void;
}

export default function QuestionPanel({
  question,
  disabled,
  onSubmit,
}: QuestionPanelProps) {
  const [answer, setAnswer] = useState("");
  const displayedQuestion = useTypewriter(question.question, 14, playTypeClick);

  const handleSubmit = () => {
    const trimmed = answer.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setAnswer("");
  };

  return (
    <div className="paper-texture w-full max-w-xl rounded-sm border border-paper-dark/60 p-5 text-wood shadow-lg">
      <p className="mb-1 font-typewriter text-[11px] tracking-widest text-stamp-red">
        Q. {question.category === "k_boss" ? "꼰대형" : question.category === "startup" ? "열정페이형" : "괴짜형"} 질문
      </p>
      <SentenceText
        text={displayedQuestion}
        className="mb-4 block text-lg font-bold leading-snug"
      />

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value.slice(0, MAX_LENGTH))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
        }}
        disabled={disabled}
        placeholder="뻔뻔하게, 궤변을 담아 120자 이내로 답하세요..."
        rows={3}
        className="w-full resize-none rounded-sm border border-wood/20 bg-white/60 p-3 text-sm text-wood placeholder:text-wood/40 focus:border-stamp-red focus:outline-none disabled:opacity-60"
      />

      <div className="mt-2 flex items-center justify-between">
        <span className="font-typewriter text-xs text-wood/50">
          {answer.length} / {MAX_LENGTH}
        </span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || answer.trim().length === 0}
          className="flex items-center gap-2 rounded-sm border-2 border-wood bg-wood px-4 py-2 font-typewriter text-xs tracking-widest text-paper transition-colors enabled:hover:bg-stamp-red enabled:hover:border-stamp-red disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} />
          제출
        </button>
      </div>
    </div>
  );
}
