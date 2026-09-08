export type QuestionCategory = "k_boss" | "startup" | "weirdo";

export interface Question {
  id: string;
  category: QuestionCategory;
  interviewer: string;
  question: string;
  trap_hint: string;
}

export interface Interviewer {
  id: QuestionCategory;
  name: string;
  title: string;
  tagline: string;
  description: string;
}

export interface JudgeResult {
  pass: boolean;
  score: number;
  reaction: string;
  keyword: string;
}

export interface QaHistoryEntry {
  question: Question;
  answer: string;
  result: JudgeResult;
}
