"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import LobbyScreen from "@/components/LobbyScreen";
import InterviewSession from "@/components/InterviewSession";
import ResultCard from "@/components/ResultCard";
import AdBanner from "@/components/AdBanner";
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
    <div className="flex flex-1 justify-center gap-6 bg-wood-dark px-4 py-10 sm:py-16">
      {/* PC(lg 이상)에서만 보이는 좌측 사이드 레일. 모바일은 각 화면 하단 배너로 대체한다. */}
      <aside className="sticky top-16 hidden h-[600px] w-40 shrink-0 lg:block">
        <AdBanner slot="sideLeft" className="h-[600px] w-40" fullWidthResponsive={false} />
      </aside>

      <div className="flex w-full max-w-4xl flex-col items-center">
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

      {/* PC(lg 이상)에서만 보이는 우측 사이드 레일. */}
      <aside className="sticky top-16 hidden h-[600px] w-40 shrink-0 lg:block">
        <AdBanner slot="sideRight" className="h-[600px] w-40" fullWidthResponsive={false} />
      </aside>
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
