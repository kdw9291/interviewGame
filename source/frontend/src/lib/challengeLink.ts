import type { QuestionCategory } from "@/types/interview";

const CATEGORIES: QuestionCategory[] = ["k_boss", "startup", "weirdo"];
const QUESTION_ID_RE = /^q_\d{3}$/;

export interface Challenge {
  interviewerId: QuestionCategory;
  questionIds: string[];
}

/** 도전장 URL 쿼리 파라미터 값 형식: "<면접관카테고리>:<질문id>,<질문id>,..." */
export function encodeChallenge(challenge: Challenge): string {
  return `${challenge.interviewerId}:${challenge.questionIds.join(",")}`;
}

/** 잘못된 형식이거나 조작된 값이면 null을 반환해 일반 대기실로 조용히 폴백한다. */
export function parseChallenge(raw: string | null): Challenge | null {
  if (!raw) return null;

  const [interviewerId, idsPart] = raw.split(":");
  if (!CATEGORIES.includes(interviewerId as QuestionCategory)) return null;
  if (!idsPart) return null;

  const questionIds = idsPart.split(",").filter(Boolean);
  if (questionIds.length < 3 || questionIds.length > 5) return null;
  if (!questionIds.every((id) => QUESTION_ID_RE.test(id))) return null;

  return { interviewerId: interviewerId as QuestionCategory, questionIds };
}

export function buildChallengeUrl(siteUrl: string, challenge: Challenge): string {
  const url = new URL(siteUrl);
  url.searchParams.set("challenge", encodeChallenge(challenge));
  return url.toString();
}
