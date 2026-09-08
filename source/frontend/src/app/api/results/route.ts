import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import type { InterviewResultRow, QaHistoryItem } from "@backend/types";
import { fetchLegendFeed, saveInterviewResult } from "@/lib/resultsStore";

const DEFAULT_NICKNAME = "익명의 취준생";
const MAX_NICKNAME_LENGTH = 30;
const DEFAULT_FEED_LIMIT = 20;

function isQaHistoryItem(value: unknown): value is QaHistoryItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.question === "string" &&
    typeof v.answer === "string" &&
    typeof v.score === "number" &&
    typeof v.pass === "boolean" &&
    typeof v.reaction === "string"
  );
}

interface PostBody {
  nickname?: string;
  interviewer: string;
  totalScore: number;
  isPassed: boolean;
  finalVerdict: string;
  qaHistory: QaHistoryItem[];
}

function isValidPostBody(body: unknown): body is PostBody {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.interviewer === "string" &&
    b.interviewer.length > 0 &&
    typeof b.totalScore === "number" &&
    typeof b.isPassed === "boolean" &&
    typeof b.finalVerdict === "string" &&
    Array.isArray(b.qaHistory) &&
    b.qaHistory.every(isQaHistoryItem) &&
    (b.nickname === undefined || typeof b.nickname === "string")
  );
}

/** 클라이언트 식별 없이 어뷰징 흔적만 남기는 단방향 해시 (명세서 6번 ip_hash). */
function hashClientIp(req: Request): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  if (!isValidPostBody(body)) {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const row: InterviewResultRow = {
    nickname: (body.nickname?.trim() || DEFAULT_NICKNAME).slice(0, MAX_NICKNAME_LENGTH),
    interviewer: body.interviewer,
    total_score: Math.max(0, Math.min(100, Math.round(body.totalScore))),
    is_passed: body.isPassed,
    final_verdict: body.finalVerdict,
    qa_history: body.qaHistory,
    ip_hash: hashClientIp(req),
  };

  const saved = await saveInterviewResult(row);
  if (!saved) {
    return NextResponse.json(
      { error: "지금은 박제 기능을 사용할 수 없습니다 (DB 미설정)." },
      { status: 503 }
    );
  }

  return NextResponse.json({ id: saved.id }, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitParam = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) && limitParam > 0
    ? Math.min(limitParam, 50)
    : DEFAULT_FEED_LIMIT;

  const feed = await fetchLegendFeed(limit);
  return NextResponse.json({ results: feed });
}
