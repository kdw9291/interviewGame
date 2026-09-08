import type { JudgeResult, QuestionCategory } from "./types";

interface ReactionTemplate {
  reaction: string;
  keyword: string;
}

/** 캐시도 Gemini도 쓸 수 없을 때 사용하는 B급 독설 템플릿 풀 (명세서 2.3 방어막2 2순위). */
const PASS_TEMPLATES: Record<QuestionCategory, ReactionTemplate[]> = {
  k_boss: [
    { reaction: "이 정도 뻔뻔함이면 임원 승진 각이군. 다음 질문으로 넘어가지.", keyword: "임원급 철판" },
    { reaction: "허허, 말은 청산유수로군. 마음에 안 들지만 마음에 든다.", keyword: "청산유수 아부" },
    { reaction: "예상치 못한 답이지만... 회식 자리에선 통할 것 같군.", keyword: "회식용 순발력" },
  ],
  startup: [
    { reaction: "그 텐션, 우리 회사 비전 슬로건에 넣어도 되겠는데?", keyword: "비전 텐션" },
    { reaction: "근거는 없지만 확신이 느껴져. 투자자들이 좋아하겠어.", keyword: "근자감 프레젠테이션" },
    { reaction: "열정 하나는 스톡옵션으로 환산해줄 만하군.", keyword: "열정 페이 정신" },
  ],
  weirdo: [
    { reaction: "저승 장부에도 이런 답은 처음 보는군. 통과.", keyword: "저승급 발상" },
    { reaction: "논리는 없지만... 왠지 설득됐다. 다음 질문.", keyword: "초자연적 설득력" },
    { reaction: "그림자도 고개를 끄덕이는군. 인정하지.", keyword: "4차원 순발력" },
  ],
};

const FAIL_TEMPLATES: Record<QuestionCategory, ReactionTemplate[]> = {
  k_boss: [
    { reaction: "교과서 읽는 줄 알았네. 그런 정답은 필요 없어.", keyword: "모범생 답변" },
    { reaction: "너무 정색하는군. 여긴 그런 진지함을 원하는 자리가 아니야.", keyword: "지루한 진지함" },
  ],
  startup: [
    { reaction: "그 텐션으로는 시드 투자도 못 받아. 다시 생각해봐.", keyword: "텐션 부족" },
    { reaction: "너무 현실적이잖아. 여긴 꿈과 열정을 파는 곳이라고.", keyword: "과도한 현실감각" },
  ],
  weirdo: [
    { reaction: "상식으로 답하다니... 저승 장부에 탈락 도장 찍었다.", keyword: "상식적 오답" },
    { reaction: "설명하려 들지 마. 이곳엔 논리가 통하지 않아.", keyword: "논리적 접근 실패" },
  ],
};

const CONFIDENT_MARKERS = [
  "사실은",
  "오히려",
  "제 잘못이 아니라",
  "당연히",
  "원래",
  "ㅋㅋ",
  "ㅎㅎ",
];

/** 답변의 길이와 뻔뻔함 마커를 보고 대략적인 점수를 매기는 룰 기반 휴리스틱. */
function estimateScore(answer: string): number {
  const trimmed = answer.trim();
  if (trimmed.length < 5) return 20 + Math.floor(Math.random() * 15);

  let score = 45 + Math.floor(Math.random() * 20);
  const markerHits = CONFIDENT_MARKERS.filter((m) => trimmed.includes(m)).length;
  score += markerHits * 8;
  if (trimmed.length > 60) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function buildFallbackTemplateResult(
  category: QuestionCategory,
  answer: string
): JudgeResult {
  const score = estimateScore(answer);
  const pass = score >= 40;
  const pool = pass ? PASS_TEMPLATES[category] : FAIL_TEMPLATES[category];
  const picked = pool[Math.floor(Math.random() * pool.length)];

  return { pass, score, reaction: picked.reaction, keyword: picked.keyword };
}
