import type { JudgeRequest, JudgeResult } from "./types";

const MODEL = "gemini-2.0-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/** Gemini 무료 키 풀이 전부 소진(429)됐거나 키가 하나도 없을 때 던진다. */
export class QuotaExceededError extends Error {
  constructor(message = "Gemini API 키 풀이 모두 할당량을 초과했습니다.") {
    super(message);
    this.name = "QuotaExceededError";
  }
}

/** 환경변수 GEMINI_API_KEYS="key1,key2,key3" 를 라운드로빈으로 순회하기 위한 커서. */
let rotationCursor = 0;

function getKeyPool(): string[] {
  const raw = process.env.GEMINI_API_KEYS ?? "";
  return raw
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

function buildSystemPrompt(interviewer: string): string {
  return `당신은 지독한 B급 블랙코미디 풍자 게임의 [AI 억까 면접관]입니다.
유저가 지원자로서 당신의 억지스럽고 황당한 질문에 답변을 제출했습니다.

[면접관 페르소나]
- 이름: ${interviewer}
- 성격: 오만하고 변덕스러우며, 상식적인 모범 답안을 극도로 혐오함.
- 선호하는 답변: 뻔뻔한 철판, 기상천외한 궤변, 허를 찌르는 순발력, 아첨을 예술로 승화시킨 답변.
- 싫어하는 답변: 교과서적인 정답, 진지하고 지루한 답변, 변명, 말문이 막힌 답변.

[채점 가이드라인 (0~100점)]
- 0 ~ 39점 (즉시 탈락): 지루함, 평범함, 교과서적 답변, 정색하고 따짐. -> pass: false
- 40 ~ 69점 (턱걸이 통과): 약간의 뻔뻔함이나 재치가 있음. 아슬아슬하게 다음 턴 진행. -> pass: true
- 70 ~ 100점 (대만족): 면접관의 허를 찌르는 미친 발상, 완벽한 뻔뻔함, 기립박수 감. -> pass: true

[출력 규칙]
반드시 아래 JSON 형식으로만 출력하십시오. 마크다운 백틱(\`\`\`json) 없이 순수 JSON 문자열만 반환하세요.
토큰 낭비를 막기 위해 reaction은 반드시 한국어 1~2문장(80자 이내)으로 강렬하게 작성하십시오.

{
  "pass": true,
  "score": 75,
  "reaction": "표정 하나 안 바꾸고 이런 헛소리를 늘어놓다니... 제법이군. 다음 질문으로 넘어가지.",
  "keyword": "뻔뻔한 순발력"
}`;
}

function isJudgeResult(value: unknown): value is JudgeResult {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.pass === "boolean" &&
    typeof v.score === "number" &&
    typeof v.reaction === "string" &&
    typeof v.keyword === "string"
  );
}

function parseJudgeResponse(rawText: string): JudgeResult {
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  const parsed: unknown = JSON.parse(cleaned);
  if (!isJudgeResult(parsed)) {
    throw new Error("Gemini 응답이 JudgeResult 스키마와 일치하지 않습니다.");
  }
  const score = Math.max(0, Math.min(100, Math.round(parsed.score)));
  return { ...parsed, score };
}

async function callGeminiWithKey(
  apiKey: string,
  request: JudgeRequest
): Promise<{ status: number; result?: JudgeResult }> {
  const userPrompt = `[면접 질문]\n${request.question}\n\n[지원자 답변]\n${request.answer}`;

  const response = await fetch(
    `${API_BASE}/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: buildSystemPrompt(request.interviewer) }],
        },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.9,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (response.status === 429) {
    return { status: 429 };
  }
  if (!response.ok) {
    throw new Error(`Gemini API 오류: HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini 응답에서 텍스트를 찾을 수 없습니다.");
  }

  return { status: 200, result: parseJudgeResponse(text) };
}

/**
 * 무료 키 풀을 라운드로빈으로 순회하며 Gemini를 호출한다.
 * 모든 키가 429(할당량 초과)를 반환하면 QuotaExceededError를 던져
 * 호출부(judge.ts)가 비상 셔터 모드로 전환하게 한다.
 */
export async function callGemini(request: JudgeRequest): Promise<JudgeResult> {
  const keys = getKeyPool();
  if (keys.length === 0) {
    throw new QuotaExceededError("등록된 Gemini API 키가 없습니다.");
  }

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const key = keys[(rotationCursor + attempt) % keys.length];
    const { status, result } = await callGeminiWithKey(key, request);
    if (status === 429) continue;
    rotationCursor = (rotationCursor + attempt + 1) % keys.length;
    if (result) return result;
  }

  throw new QuotaExceededError();
}
