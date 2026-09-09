"use client";

import { useMemo, useState } from "react";
import { ArrowRight, FileCheck2 } from "lucide-react";
import QuestionPanel from "./QuestionPanel";
import ScoreGauge from "./ScoreGauge";
import InterviewerReaction, { type ReactionMood } from "./InterviewerReaction";
import { findQuestionsByIds, pickQuestions, pickTurnCount } from "@/lib/gameEngine";
import type { Interviewer, JudgeResult, QaHistoryEntry } from "@/types/interview";

interface InterviewSessionProps {
  interviewer: Interviewer;
  onFinish: (history: QaHistoryEntry[], eliminatedEarly: boolean) => void;
  /** 친구 도전장 딥링크로 들어온 경우, 랜덤 대신 이 질문 세트를 그대로 쓴다. */
  fixedQuestionIds?: string[];
}

async function requestJudge(params: {
  questionId: string;
  category: Interviewer["id"];
  interviewer: string;
  question: string;
  answer: string;
}): Promise<JudgeResult> {
  try {
    const res = await fetch("/api/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`judge api ${res.status}`);
    return (await res.json()) as JudgeResult;
  } catch {
    // 네트워크 자체가 끊긴 최악의 경우에도 게임이 멈추지 않도록 방어한다.
    return {
      pass: true,
      score: 50,
      reaction: "연결이 불안정하지만... 일단 통과시켜주지.",
      keyword: "임시 통과",
    };
  }
}

export default function InterviewSession({
  interviewer,
  onFinish,
  fixedQuestionIds,
}: InterviewSessionProps) {
  const turnCount = useMemo(() => pickTurnCount(), []);
  const questions = useMemo(() => {
    if (fixedQuestionIds && fixedQuestionIds.length > 0) {
      const fixed = findQuestionsByIds(fixedQuestionIds);
      if (fixed.length > 0) return fixed;
    }
    return pickQuestions(interviewer.id, turnCount);
  }, [interviewer.id, turnCount, fixedQuestionIds]);

  const [turnIndex, setTurnIndex] = useState(0);
  const [history, setHistory] = useState<QaHistoryEntry[]>([]);
  const [mood, setMood] = useState<ReactionMood>("idle");
  const [message, setMessage] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  // 판정 결과가 나온 뒤: 대표가 직접 "다음"을 눌러야 넘어간다 (자동으로 사라지지 않음).
  const [awaitingNext, setAwaitingNext] = useState(false);
  const [pendingResultEntry, setPendingResultEntry] = useState<{
    history: QaHistoryEntry[];
    eliminated: boolean;
  } | null>(null);

  const averageScore =
    history.length === 0
      ? 0
      : Math.round(
          history.reduce((sum, e) => sum + e.result.score, 0) / history.length
        );

  const currentQuestion = questions[turnIndex];
  const isLastTurn = turnIndex + 1 >= questions.length;

  const handleSubmit = async (answer: string) => {
    setSubmitting(true);
    setMood("thinking");
    // 생각 중 문구는 InterviewerReaction이 자체적으로 순환시킨다.
    setMessage(undefined);

    const result = await requestJudge({
      questionId: currentQuestion.id,
      category: interviewer.id,
      interviewer: interviewer.name,
      question: currentQuestion.question,
      answer,
    });

    const nextHistory = [...history, { question: currentQuestion, answer, result }];
    setHistory(nextHistory);
    setMood(result.pass ? "pass" : "fail");
    setMessage(result.reaction);
    setPendingResultEntry({ history: nextHistory, eliminated: !result.pass });
    setAwaitingNext(true);
  };

  const handleAdvance = () => {
    if (!pendingResultEntry) return;
    const { history: finalHistory, eliminated } = pendingResultEntry;

    if (eliminated || isLastTurn) {
      onFinish(finalHistory, eliminated);
      return;
    }

    setTurnIndex((prev) => prev + 1);
    setMood("idle");
    setMessage(undefined);
    setSubmitting(false);
    setAwaitingNext(false);
    setPendingResultEntry(null);
  };

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <ScoreGauge
        currentTurn={turnIndex + 1}
        totalTurns={questions.length}
        averageScore={averageScore}
      />
      <InterviewerReaction
        interviewerName={interviewer.name}
        mood={mood}
        message={message}
      />
      {awaitingNext ? (
        <button
          type="button"
          onClick={handleAdvance}
          className="flex items-center gap-2 rounded-sm border-2 border-gold bg-gold px-6 py-3 font-typewriter text-sm tracking-widest text-wood-dark transition-colors hover:bg-gold-bright"
        >
          {pendingResultEntry?.eliminated || isLastTurn ? (
            <>
              <FileCheck2 size={16} />
              결과 확인하기
            </>
          ) : (
            <>
              다음 질문으로
              <ArrowRight size={16} />
            </>
          )}
        </button>
      ) : (
        <QuestionPanel
          key={currentQuestion.id}
          question={currentQuestion}
          disabled={submitting}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
