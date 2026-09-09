"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Loader2, RotateCcw, Send, Stamp, Swords } from "lucide-react";
import type { QaHistoryEntry, QuestionCategory } from "@/types/interview";
import type { FinalVerdict } from "@/lib/gameEngine";
import { withJosaWa } from "@/lib/korean";
import { inlineComputedColors } from "@/lib/captureUtils";
import { buildChallengeUrl } from "@/lib/challengeLink";
import AdBanner from "./AdBanner";
import SentenceText from "./SentenceText";

const MAX_NICKNAME_LENGTH = 30;
const MIN_CHALLENGE_QUESTIONS = 3;
type StampStatus = "idle" | "loading" | "done" | "error";
type ChallengeShareStatus = "idle" | "copied" | "shared" | "error";

interface ResultCardProps {
  interviewerName: string;
  interviewerId: QuestionCategory;
  verdict: FinalVerdict;
  history: QaHistoryEntry[];
  onRestart: () => void;
}

export default function ResultCard({
  interviewerName,
  interviewerId,
  verdict,
  history,
  onRestart,
}: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [stampStatus, setStampStatus] = useState<StampStatus>("idle");
  const [challengeStatus, setChallengeStatus] = useState<ChallengeShareStatus>("idle");

  const lastReaction = history[history.length - 1]?.result.reaction ?? "";
  const today = new Date().toLocaleDateString("ko-KR");

  useEffect(() => {
    if (!verdict.isPassed) return;
    let cancelled = false;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#c9a227", "#e8c766", "#f4ecd8"],
      });
    });
    return () => {
      cancelled = true;
    };
  }, [verdict.isPassed]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const target = cardRef.current;
      const canvas = await html2canvas(target, {
        backgroundColor: null,
        scale: 2,
        onclone: (_doc, clonedElement) => {
          inlineComputedColors(target, clonedElement);
        },
      });
      const link = document.createElement("a");
      link.download = verdict.isPassed
        ? "억까면접_합격증.png"
        : "억까면접_불합격사유서.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleStamp = async () => {
    setStampStatus("loading");
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim() || undefined,
          interviewer: interviewerName,
          totalScore: verdict.averageScore,
          isPassed: verdict.isPassed,
          finalVerdict: lastReaction,
          qaHistory: history.map((entry) => ({
            question: entry.question.question,
            answer: entry.answer,
            score: entry.result.score,
            pass: entry.result.pass,
            reaction: entry.result.reaction,
          })),
        }),
      });
      if (!res.ok) throw new Error(`results api ${res.status}`);
      setStampStatus("done");
    } catch {
      setStampStatus("error");
    }
  };

  const handleChallengeShare = async () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const url = buildChallengeUrl(siteUrl, {
      interviewerId,
      questionIds: history.map((entry) => entry.question.id),
    });
    const shareText = `${withJosaWa(interviewerName)} 같은 질문으로 대결! 너라면 통과할 수 있겠어?`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "억까 면접관 살아남기", text: shareText, url });
        setChallengeStatus("shared");
        return;
      }
      await navigator.clipboard.writeText(url);
      setChallengeStatus("copied");
    } catch (error) {
      // 유저가 공유 시트를 그냥 닫은 경우까지 에러로 취급하지 않는다.
      if (error instanceof DOMException && error.name === "AbortError") return;
      setChallengeStatus("error");
    }
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6">
      <div
        ref={cardRef}
        className={`paper-texture w-full rounded-sm border-[6px] p-8 text-wood shadow-2xl ${
          verdict.isPassed ? "border-gold" : "border-stamp-red"
        }`}
      >
        <p className="text-center font-typewriter text-xs tracking-[0.3em] text-wood/50">
          진실의 면접실 · TRUTH INTERVIEW ROOM
        </p>

        <h2
          className={`mt-3 text-center text-3xl font-extrabold ${
            verdict.isPassed ? "text-stamp-red" : "text-stamp-red"
          }`}
        >
          {verdict.isPassed ? "기적의 합격증" : "억까 불합격 사유서"}
        </h2>

        <div className="my-5 flex justify-center">
          <div
            className={`flex h-24 w-24 rotate-[-8deg] items-center justify-center rounded-full border-4 ${
              verdict.isPassed
                ? "border-gold text-gold"
                : "border-stamp-red text-stamp-red"
            }`}
          >
            <Stamp size={40} strokeWidth={1.5} />
          </div>
        </div>

        <p className="text-center text-sm leading-relaxed">
          {verdict.isPassed ? (
            <>
              지원자는 <b>{withJosaWa(interviewerName)}</b>의 면접에서 평균{" "}
              <b>{verdict.averageScore}점</b>으로 모든 질문을 통과하여
              <br />
              최종 합격하였음을 이에 증명함.
            </>
          ) : (
            <>
              지원자는 <b>{withJosaWa(interviewerName)}</b>의 면접에서 평균{" "}
              <b>{verdict.averageScore}점</b>을 기록, 아래 사유로 불합격하였음을
              통보함.
              <br />
              <span className="mt-2 block italic text-stamp-red">
                &ldquo;{lastReaction}&rdquo;
              </span>
            </>
          )}
        </p>

        <div className="mt-6 space-y-2 border-t border-wood/20 pt-4">
          {history.map((entry, idx) => (
            <div key={entry.question.id} className="text-xs">
              <span className="font-typewriter text-wood/50">
                Q{idx + 1}. <SentenceText text={entry.question.question} />
              </span>
              <span className="text-wood/80">→ &ldquo;{entry.answer}&rdquo;</span>{" "}
              <span
                className={entry.result.pass ? "text-emerald-700" : "text-stamp-red"}
              >
                ({entry.result.score}점)
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-right font-typewriter text-[10px] tracking-widest text-wood/40">
          발급일 {today}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 rounded-sm border-2 border-gold bg-gold px-5 py-2.5 font-typewriter text-xs tracking-widest text-wood-dark transition-colors hover:bg-gold-bright disabled:opacity-60"
        >
          <Download size={14} />
          {downloading ? "이미지 생성 중..." : "PNG로 저장·공유하기"}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-sm border-2 border-paper-dark/40 px-5 py-2.5 font-typewriter text-xs tracking-widest text-paper transition-colors hover:border-paper"
        >
          <RotateCcw size={14} />
          다시 도전하기
        </button>
      </div>

      {history.length >= MIN_CHALLENGE_QUESTIONS && (
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={handleChallengeShare}
            className="flex items-center gap-2 rounded-sm border-2 border-stamp-red px-5 py-2.5 font-typewriter text-xs tracking-widest text-stamp-red transition-colors hover:bg-stamp-red hover:text-paper"
          >
            <Swords size={14} />
            친구에게 도전장 보내기
          </button>
          {challengeStatus === "copied" && (
            <p className="font-typewriter text-[11px] text-gold-bright">
              링크가 복사됐어요! 친구에게 붙여넣기 해보세요.
            </p>
          )}
          {challengeStatus === "error" && (
            <p className="font-typewriter text-[11px] text-stamp-red">
              지금은 공유 링크를 만들 수 없어요.
            </p>
          )}
        </div>
      )}

      {!verdict.isPassed && (
        <div className="flex w-full max-w-md flex-col items-center gap-2 border-t border-paper-dark/20 pt-5">
          {stampStatus === "done" ? (
            <p className="font-typewriter text-xs tracking-widest text-gold-bright">
              박제 완료! 명예의 전당 &lsquo;오늘의 레전드 불합격&rsquo;에서 확인하세요.
            </p>
          ) : (
            <>
              <div className="flex w-full gap-2">
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value.slice(0, MAX_NICKNAME_LENGTH))}
                  placeholder="닉네임 (선택, 기본: 익명의 취준생)"
                  className="min-w-0 flex-1 rounded-sm border border-paper-dark/40 bg-wood-dark/40 px-3 py-2 text-xs text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleStamp}
                  disabled={stampStatus === "loading"}
                  className="flex shrink-0 items-center gap-2 rounded-sm border-2 border-stamp-red bg-stamp-red px-4 py-2 font-typewriter text-xs tracking-widest text-paper transition-colors hover:bg-stamp-red/80 disabled:opacity-60"
                >
                  {stampStatus === "loading" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  이 억까를 세상에 박제하기
                </button>
              </div>
              {stampStatus === "error" && (
                <p className="font-typewriter text-[11px] text-stamp-red">
                  지금은 박제할 수 없어요. 잠시 후 다시 시도해주세요.
                </p>
              )}
            </>
          )}
        </div>
      )}

      <AdBanner slot="resultCard" />
    </div>
  );
}
