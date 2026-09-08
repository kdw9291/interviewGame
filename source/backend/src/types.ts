export type QuestionCategory = "k_boss" | "startup" | "weirdo";

export interface JudgeResult {
  pass: boolean;
  score: number;
  reaction: string;
  keyword: string;
}

/** judgeAnswer가 반환하는 결과. source는 디버깅/로그용이며 클라이언트에는 노출하지 않는다. */
export interface JudgeOutcome extends JudgeResult {
  source: "cache" | "gemini" | "fallback_archive" | "fallback_template";
}

export interface JudgeRequest {
  questionId: string;
  category: QuestionCategory;
  interviewer: string;
  question: string;
  answer: string;
}

/** answer_cache 테이블 행 (명세서 6번 스키마 참고) */
export interface AnswerCacheRow {
  question_id: string;
  user_answer_normalized: string;
  pass: boolean;
  score: number;
  reaction: string;
  keyword: string | null;
}

/** judge.ts가 Supabase 접근에 의존하지 않도록 최소 인터페이스만 정의한다. */
export interface CacheStore {
  findExact(
    questionId: string,
    normalizedAnswer: string
  ): Promise<AnswerCacheRow | null>;
  findArchiveSample(questionId: string): Promise<AnswerCacheRow | null>;
  save(row: AnswerCacheRow): Promise<void>;
}

/** interview_results.qa_history JSONB 배열의 원소 (명세서 6번 스키마 참고) */
export interface QaHistoryItem {
  question: string;
  answer: string;
  score: number;
  pass: boolean;
  reaction: string;
}

/** interview_results 테이블 행 (명세서 6번 스키마 참고) */
export interface InterviewResultRow {
  id?: string;
  created_at?: string;
  nickname: string;
  interviewer: string;
  total_score: number;
  is_passed: boolean;
  final_verdict: string;
  qa_history: QaHistoryItem[];
  upvotes?: number;
  ip_hash?: string | null;
}
