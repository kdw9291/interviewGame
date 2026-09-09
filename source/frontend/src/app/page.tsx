"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import LobbyScreen from "@/components/LobbyScreen";
import InterviewSession from "@/components/InterviewSession";
import ResultCard from "@/components/ResultCard";
import { computeFinalVerdict, type FinalVerdict } from "@/lib/gameEngine";
import { parseChallenge } from "@/lib/challengeLink";
import { INTERVIEWERS } from "@/data/interviewers";
import type { Interviewer, QaHistoryEntry } from "@/types/interview";

type Phase = "lobby" | "playing" | "result";

interface ResultState {
  interviewer: Interviewer;
  history: QaHistoryEntry[];
  verdict: FinalVerdict;
}

function HomeContent() {
  const searchParams = useSearchParams();
  const challenge = parseChallenge(searchParams.get("challenge"));

  const [phase, setPhase] = useState<Phase>("lobby");
  const [interviewer, setInterviewer] = useState<Interviewer | null>(null);
  const [fixedQuestionIds, setFixedQuestionIds] = useState<string[] | undefined>();
  const [result, setResult] = useState<ResultState | null>(null);

  const handleStart = (chosen: Interviewer, questionIds?: string[]) => {
    setInterviewer(chosen);
    setFixedQuestionIds(questionIds);
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
    setFixedQuestionIds(undefined);
    setResult(null);
    setPhase("lobby");
  };

  const challengeInterviewer = challenge
    ? INTERVIEWERS.find((i) => i.id === challenge.interviewerId)
    : undefined;

  return (
    <div className="flex flex-1 flex-col items-center bg-wood-dark px-4 py-10 sm:py-16">
      {phase === "lobby" && (
        <LobbyScreen
          onStart={handleStart}
          challenge={
            challenge && challengeInterviewer
              ? { interviewer: challengeInterviewer, questionIds: challenge.questionIds }
              : undefined
          }
        />
      )}

      {phase === "playing" && interviewer && (
        <InterviewSession
          interviewer={interviewer}
          onFinish={handleFinish}
          fixedQuestionIds={fixedQuestionIds}
        />
      )}

      {phase === "result" && result && (
        <ResultCard
          interviewerName={result.interviewer.name}
          interviewerId={result.interviewer.id}
          verdict={result.verdict}
          history={result.history}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
