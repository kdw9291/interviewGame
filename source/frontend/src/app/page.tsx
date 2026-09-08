"use client";

import { useState } from "react";
import LobbyScreen from "@/components/LobbyScreen";
import InterviewSession from "@/components/InterviewSession";
import ResultCard from "@/components/ResultCard";
import { computeFinalVerdict, type FinalVerdict } from "@/lib/gameEngine";
import type { Interviewer, QaHistoryEntry } from "@/types/interview";

type Phase = "lobby" | "playing" | "result";

interface ResultState {
  interviewer: Interviewer;
  history: QaHistoryEntry[];
  verdict: FinalVerdict;
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("lobby");
  const [interviewer, setInterviewer] = useState<Interviewer | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);

  const handleStart = (chosen: Interviewer) => {
    setInterviewer(chosen);
    setPhase("playing");
  };

  const handleFinish = (history: QaHistoryEntry[], eliminatedEarly: boolean) => {
    if (!interviewer) return;
    setResult({
      interviewer,
      history,
      verdict: computeFinalVerdict(history, eliminatedEarly),
    });
    setPhase("result");
  };

  const handleRestart = () => {
    setInterviewer(null);
    setResult(null);
    setPhase("lobby");
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-wood-dark px-4 py-10 sm:py-16">
      {phase === "lobby" && <LobbyScreen onStart={handleStart} />}

      {phase === "playing" && interviewer && (
        <InterviewSession interviewer={interviewer} onFinish={handleFinish} />
      )}

      {phase === "result" && result && (
        <ResultCard
          interviewerName={result.interviewer.name}
          verdict={result.verdict}
          history={result.history}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
