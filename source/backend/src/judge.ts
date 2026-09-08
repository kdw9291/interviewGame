import { callGemini, QuotaExceededError } from "./gemini";
import { buildFallbackTemplateResult } from "./fallbackTemplates";
import { normalizeAnswer } from "./normalize";
import type { AnswerCacheRow, CacheStore, JudgeOutcome, JudgeRequest } from "./types";

function rowToOutcome(
  row: AnswerCacheRow,
  source: "cache" | "fallback_archive"
): JudgeOutcome {
  return {
    pass: row.pass,
    score: row.score,
    reaction: row.reaction,
    keyword: row.keyword ?? "",
    source,
  };
}

/**
 * 판정 오케스트레이션 (명세서 2.1/2.3 흐름도).
 * 1) 캐시 적중 -> 즉시 반환 (비용 0원)
 * 2) 캐시 미스 -> Gemini 호출, 성공 시 캐시에 백그라운드 저장
 * 3) Gemini 429(할당량 초과) -> 비상 셔터: 과거 아카이브 -> 룰 템플릿 순으로 폴백
 *
 * cacheStore가 없으면(Supabase 미설정) 캐시/아카이브 단계를 건너뛰고
 * Gemini -> 룰 템플릿 순서로만 동작한다. 어떤 경우에도 예외를 던지지 않는다.
 */
export async function judgeAnswer(
  request: JudgeRequest,
  cacheStore?: CacheStore
): Promise<JudgeOutcome> {
  const normalizedAnswer = normalizeAnswer(request.answer);

  if (cacheStore) {
    const cached = await cacheStore.findExact(request.questionId, normalizedAnswer);
    if (cached) return rowToOutcome(cached, "cache");
  }

  try {
    const result = await callGemini(request);
    if (cacheStore) {
      void cacheStore.save({
        question_id: request.questionId,
        user_answer_normalized: normalizedAnswer,
        pass: result.pass,
        score: result.score,
        reaction: result.reaction,
        keyword: result.keyword,
      });
    }
    return { ...result, source: "gemini" };
  } catch (error) {
    if (!(error instanceof QuotaExceededError)) throw error;

    if (cacheStore) {
      const archived = await cacheStore.findArchiveSample(request.questionId);
      if (archived) return rowToOutcome(archived, "fallback_archive");
    }

    return {
      ...buildFallbackTemplateResult(request.category, request.answer),
      source: "fallback_template",
    };
  }
}
