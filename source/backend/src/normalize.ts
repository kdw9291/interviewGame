/** 캐시 조회/저장을 위해 답변에서 공백·특수문자를 제거하고 소문자로 정규화한다. */
export function normalizeAnswer(answer: string): string {
  return answer
    .trim()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]/gu, "");
}
