"use client";

import { useState } from "react";
import { Stamp, ScrollText, Clock, Gauge, Newspaper, DoorOpen, Swords } from "lucide-react";
import InterviewerCard from "@/components/InterviewerCard";
import LegendFeed from "@/components/LegendFeed";
import AdBanner from "@/components/AdBanner";
import SentenceText from "@/components/SentenceText";
import { INTERVIEWERS } from "@/data/interviewers";
import { withJosaWa } from "@/lib/korean";
import type { Interviewer } from "@/types/interview";

type Tab = "room" | "legend";

export interface LobbyChallenge {
  interviewer: Interviewer;
  questionIds: string[];
}

interface LobbyScreenProps {
  onStart: (interviewer: Interviewer, questionIds?: string[]) => void;
  challenge?: LobbyChallenge;
}

export default function LobbyScreen({ onStart, challenge }: LobbyScreenProps) {
  const [selectedId, setSelectedId] = useState<Interviewer["id"] | null>(null);
  const [tab, setTab] = useState<Tab>("room");
  const selected = INTERVIEWERS.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="w-full max-w-4xl">
      {/* 헤더: 면접실 명패 */}
      <header className="mb-10 text-center">
        <p className="font-typewriter text-xs tracking-[0.3em] text-gold-bright/80">
          진실의 면접실 · TRUTH INTERVIEW ROOM
        </p>
        <h1 className="mt-3 text-4xl font-extrabold text-paper drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] sm:text-5xl">
          억까 면접관 살아남기
        </h1>
        <SentenceText
          text="상식과 논리가 통하지 않는 면접실입니다. 정답은 없습니다 — 오직 뻔뻔함과 순발력만이 당신을 합격시킵니다."
          className="mt-4 block text-sm leading-relaxed text-paper/70 sm:text-base"
        />
      </header>

      {/* 친구 도전장 딥링크로 들어온 경우 */}
      {challenge && (
        <section className="mb-8 flex flex-col items-center gap-3 rounded-sm border-2 border-stamp-red bg-wood/60 px-6 py-5 text-center">
          <p className="flex items-center gap-2 font-typewriter text-xs tracking-widest text-stamp-red">
            <Swords size={16} />
            친구의 도전장이 도착했습니다
          </p>
          <p className="text-sm text-paper/80">
            {withJosaWa(challenge.interviewer.name)} 같은 질문 {challenge.questionIds.length}개로 대결합니다.
          </p>
          <button
            type="button"
            onClick={() => onStart(challenge.interviewer, challenge.questionIds)}
            className="flex items-center gap-2 rounded-sm border-2 border-stamp-red bg-stamp-red px-6 py-2.5 font-typewriter text-sm tracking-widest text-paper transition-colors hover:bg-stamp-red/80"
          >
            <Stamp size={16} />
            도전 수락하기
          </button>
        </section>
      )}

      {/* 탭 메뉴 */}
      <div className="mb-8 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setTab("room")}
          className={`flex items-center gap-2 rounded-sm border-2 px-5 py-2 font-typewriter text-xs tracking-widest transition-colors ${
            tab === "room"
              ? "border-gold bg-gold text-wood-dark"
              : "border-paper-dark/30 text-paper/60 hover:border-gold/50"
          }`}
        >
          <DoorOpen size={14} />
          대기실
        </button>
        <button
          type="button"
          onClick={() => setTab("legend")}
          className={`flex items-center gap-2 rounded-sm border-2 px-5 py-2 font-typewriter text-xs tracking-widest transition-colors ${
            tab === "legend"
              ? "border-gold bg-gold text-wood-dark"
              : "border-paper-dark/30 text-paper/60 hover:border-gold/50"
          }`}
        >
          <Newspaper size={14} />
          오늘의 레전드 불합격
        </button>
      </div>

      {tab === "room" ? (
        <>
          {/* 규칙 요약: 서류철 카드 */}
          <section className="paper-texture mb-10 rounded-sm border border-paper-dark/60 px-6 py-5 text-wood shadow-lg">
            <div className="mb-3 flex items-center gap-2 border-b border-wood/20 pb-2">
              <ScrollText size={18} />
              <h2 className="font-typewriter text-sm tracking-widest">
                면접 규정 안내
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <Gauge size={18} className="mt-0.5 shrink-0 text-stamp-red" />
                <p>
                  <span className="font-bold">채점 방식</span>
                  <br />
                  0~100점, 40점 미만은 그 자리에서 즉시 탈락
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={18} className="mt-0.5 shrink-0 text-stamp-red" />
                <p>
                  <span className="font-bold">진행 방식</span>
                  <br />
                  총 3~5턴, 답변은 120자 이내로 작성
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Stamp size={18} className="mt-0.5 shrink-0 text-stamp-red" />
                <p>
                  <span className="font-bold">최종 결과</span>
                  <br />
                  평균 70점 이상 전원 통과 시 &lsquo;합격증&rsquo; 발급
                </p>
              </div>
            </div>
          </section>

          {/* 면접관 선택 */}
          <section>
            <h2 className="mb-4 text-center font-typewriter text-sm tracking-widest text-gold-bright/80">
              오늘 당신을 심문할 면접관을 선택하십시오
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {INTERVIEWERS.map((interviewer) => (
                <InterviewerCard
                  key={interviewer.id}
                  interviewer={interviewer}
                  selected={selectedId === interviewer.id}
                  onSelect={setSelectedId}
                />
              ))}
            </div>
          </section>

          {/* 입장 버튼 */}
          <section className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              disabled={!selected}
              onClick={() => selected && onStart(selected)}
              className="group relative flex items-center gap-2 rounded-sm border-2 border-gold bg-gold px-8 py-3 font-typewriter text-sm tracking-widest text-wood-dark transition-all duration-200 enabled:hover:bg-gold-bright enabled:hover:shadow-[0_0_20px_rgba(232,199,102,0.4)] disabled:cursor-not-allowed disabled:border-paper-dark/30 disabled:bg-transparent disabled:text-paper/30"
            >
              <Stamp size={16} />
              {selected
                ? `${withJosaWa(selected.name)} 면접 시작`
                : "면접관을 선택하세요"}
            </button>
          </section>
        </>
      ) : (
        <section className="mb-10">
          <LegendFeed />
        </section>
      )}

      <div className="mt-10 flex justify-center">
        <AdBanner slot="lobby" />
      </div>
    </div>
  );
}
