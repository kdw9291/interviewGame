import { NextResponse } from "next/server";
import { judgeAnswer } from "@backend/judge";
import type { JudgeRequest, QuestionCategory } from "@backend/types";
import { createSupabaseCacheStore } from "@/lib/supabaseCacheStore";

const MAX_ANSWER_LENGTH = 120;
const CATEGORIES: QuestionCategory[] = ["k_boss", "startup", "weirdo"];

function isValidRequest(body: unknown): body is JudgeRequest {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.questionId === "string" &&
    b.questionId.length > 0 &&
    typeof b.category === "string" &&
    CATEGORIES.includes(b.category as QuestionCategory) &&
    typeof b.interviewer === "string" &&
    typeof b.question === "string" &&
    typeof b.answer === "string" &&
    b.answer.trim().length > 0 &&
    b.answer.length <= MAX_ANSWER_LENGTH
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  if (!isValidRequest(body)) {
    return NextResponse.json(
      { error: `요청 형식이 올바르지 않습니다. (답변은 ${MAX_ANSWER_LENGTH}자 이내)` },
      { status: 400 }
    );
  }

  const cacheStore = createSupabaseCacheStore();

  try {
    const outcome = await judgeAnswer(body, cacheStore);
    return NextResponse.json({
      pass: outcome.pass,
      score: outcome.score,
      reaction: outcome.reaction,
      keyword: outcome.keyword,
    });
  } catch {
    // judgeAnswer는 QuotaExceededError를 내부에서 처리하지만,
    // 예상 못한 오류(네트워크 단절 등)까지 방어해 서비스가 절대 죽지 않게 한다.
    return NextResponse.json(
      {
        pass: Math.random() > 0.4,
        score: 40 + Math.floor(Math.random() * 30),
        reaction: "지금은 정신이 없군... 일단 넘어가지.",
        keyword: "비상 판정",
      },
      { status: 200 }
    );
  }
}
