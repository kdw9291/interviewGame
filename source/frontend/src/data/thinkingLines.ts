/** AI 판정을 기다리는 동안 면접관이 "생각 중"인 느낌을 주는 랜덤 문구. */
export const THINKING_LINES: string[] = [
  "흠... 이걸 어떻게 받아들여야 하나.",
  "잠깐, 표정 관리 좀 하고...",
  "허, 이런 답은 처음 보는군.",
  "채점 기준을 다시 훑어보는 중이다.",
  "이걸 통과시켜야 하나, 말아야 하나...",
  "펜으로 책상을 딱딱 두드리는 중.",
  "안경을 고쳐 쓰며 다시 읽는 중...",
  "음... 조금 더 지켜보지.",
  "이 정도 뻔뻔함이면 점수를 줘야 하나.",
  "잠시, 심사숙고 중이다.",
];

export function pickRandomThinkingLine(): string {
  return THINKING_LINES[Math.floor(Math.random() * THINKING_LINES.length)];
}
