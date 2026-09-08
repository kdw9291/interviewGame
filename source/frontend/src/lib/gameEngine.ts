import questionsData from "@/data/questions.json";
import type { Question, QuestionCategory, QaHistoryEntry } from "@/types/interview";

const ALL_QUESTIONS = questionsData as Question[];

const MIN_TURNS = 3;
const MAX_TURNS = 5;
const PASSING_AVERAGE = 70;

/** 게임 시작 시 이번 세션의 총 턴 수(3~5)를 랜덤으로 정한다. */
export function pickTurnCount(): number {
  return MIN_TURNS + Math.floor(Math.random() * (MAX_TURNS - MIN_TURNS + 1));
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 선택된 면접관 카테고리의 질문 풀에서 턴 수만큼 비복원 랜덤 추출한다. */
export function pickQuestions(category: QuestionCategory, count: number): Question[] {
  const pool = ALL_QUESTIONS.filter((q) => q.category === category);
  return shuffle(pool).slice(0, count);
}

export interface FinalVerdict {
  isPassed: boolean;
  averageScore: number;
}

/**
 * 전 문항 통과 & 평균 70점 이상일 때만 최종 합격.
 * 도중 탈락(pass:false 발생) 또는 평균 미달이면 불합격 사유서로 처리한다 (명세서 3.1).
 */
export function computeFinalVerdict(
  history: QaHistoryEntry[],
  eliminatedEarly: boolean
): FinalVerdict {
  const averageScore =
    history.length === 0
      ? 0
      : Math.round(
          history.reduce((sum, entry) => sum + entry.result.score, 0) / history.length
        );

  const isPassed = !eliminatedEarly && averageScore >= PASSING_AVERAGE;
  return { isPassed, averageScore };
}
