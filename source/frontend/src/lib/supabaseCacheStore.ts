import type { AnswerCacheRow, CacheStore } from "@backend/types";
import { getSupabaseServerClient } from "./supabaseServerClient";

const TABLE = "answer_cache";
const ARCHIVE_SAMPLE_POOL = 20;

/**
 * Supabase 환경변수가 설정된 경우에만 캐시 스토어를 만든다.
 * 설정이 없으면 undefined를 반환해 judge.ts가 캐시 단계를 건너뛰고
 * Gemini -> 룰 템플릿 순서로 동작하게 한다 (서비스는 계속 살아있어야 함).
 */
export function createSupabaseCacheStore(): CacheStore | undefined {
  const client = getSupabaseServerClient();
  if (!client) return undefined;

  return {
    async findExact(questionId, normalizedAnswer) {
      const { data } = await client
        .from(TABLE)
        .select("question_id, user_answer_normalized, pass, score, reaction, keyword")
        .eq("question_id", questionId)
        .eq("user_answer_normalized", normalizedAnswer)
        .limit(1)
        .maybeSingle();
      return (data as AnswerCacheRow | null) ?? null;
    },

    async findArchiveSample(questionId) {
      const { data } = await client
        .from(TABLE)
        .select("question_id, user_answer_normalized, pass, score, reaction, keyword")
        .eq("question_id", questionId)
        .order("created_at", { ascending: false })
        .limit(ARCHIVE_SAMPLE_POOL);
      const rows = (data as AnswerCacheRow[] | null) ?? [];
      if (rows.length === 0) return null;
      return rows[Math.floor(Math.random() * rows.length)];
    },

    async save(row) {
      await client.from(TABLE).insert(row);
    },
  };
}
