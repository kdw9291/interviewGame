"use client";

import { useEffect, useState } from "react";
import { Frown, Loader2, Newspaper } from "lucide-react";
import type { InterviewResultRow } from "@backend/types";

type FeedState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; items: InterviewResultRow[] };

/** 메인 화면 [오늘의 레전드 불합격] 피드 (명세서 Phase 4). */
export default function LegendFeed() {
  const [state, setState] = useState<FeedState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/results?limit=20")
      .then((res) => {
        if (!res.ok) throw new Error(`results api ${res.status}`);
        return res.json() as Promise<{ results: InterviewResultRow[] }>;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", items: data.results });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-paper/60">
        <Loader2 size={24} className="animate-spin" />
        <p className="font-typewriter text-xs tracking-widest">불러오는 중...</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-paper/60">
        <p className="font-typewriter text-xs tracking-widest">
          지금은 명예의 전당을 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-paper/60">
        <Newspaper size={24} />
        <p className="font-typewriter text-xs tracking-widest">
          아직 박제된 억까가 없습니다. 첫 주인공이 되어보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {state.items.map((item) => (
        <div
          key={item.id}
          className="paper-texture rounded-sm border border-paper-dark/50 p-4 text-wood shadow"
        >
          <div className="mb-1 flex items-center justify-between font-typewriter text-[11px] tracking-widest text-wood/50">
            <span className="flex items-center gap-1">
              <Frown size={12} className="text-stamp-red" />
              {item.nickname} · {item.interviewer}
            </span>
            <span>{item.total_score}점</span>
          </div>
          <p className="text-sm italic">&ldquo;{item.final_verdict}&rdquo;</p>
        </div>
      ))}
    </div>
  );
}
