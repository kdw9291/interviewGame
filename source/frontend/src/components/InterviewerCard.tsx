"use client";

import { Briefcase, Rocket, Skull, type LucideIcon } from "lucide-react";
import SentenceText from "./SentenceText";
import type { Interviewer } from "@/types/interview";

const ICONS: Record<Interviewer["id"], LucideIcon> = {
  k_boss: Briefcase,
  startup: Rocket,
  weirdo: Skull,
};

interface InterviewerCardProps {
  interviewer: Interviewer;
  selected: boolean;
  onSelect: (id: Interviewer["id"]) => void;
}

export default function InterviewerCard({
  interviewer,
  selected,
  onSelect,
}: InterviewerCardProps) {
  const Icon = ICONS[interviewer.id];

  return (
    <button
      type="button"
      onClick={() => onSelect(interviewer.id)}
      className={`group relative flex flex-col items-center gap-3 rounded-sm border-2 px-5 py-6 text-center transition-all duration-200 ${
        selected
          ? "border-gold bg-paper text-wood shadow-[0_0_0_3px_rgba(201,162,39,0.35)] -translate-y-1"
          : "border-paper-dark/30 bg-wood-dark/40 text-paper hover:border-gold/60 hover:-translate-y-0.5"
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 rotate-6 rounded-full border-2 border-stamp-red bg-paper px-2 py-0.5 font-typewriter text-[10px] tracking-widest text-stamp-red">
          선택됨
        </span>
      )}
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${
          selected
            ? "border-wood bg-gold-bright/20 text-wood"
            : "border-gold/50 bg-wood/60 text-gold-bright"
        }`}
      >
        <Icon size={30} strokeWidth={1.5} />
      </span>
      <div>
        <p className="font-typewriter text-xs tracking-widest opacity-70">
          {interviewer.title}
        </p>
        <p className="mt-1 text-2xl font-bold">{interviewer.name}</p>
      </div>
      <p className="text-sm italic opacity-80">&ldquo;{interviewer.tagline}&rdquo;</p>
      <SentenceText
        text={interviewer.description}
        className="text-xs leading-relaxed opacity-70"
      />
    </button>
  );
}
