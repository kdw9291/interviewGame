import type { InterviewResultRow } from "@backend/types";
import { getSupabaseServerClient } from "./supabaseServerClient";

const TABLE = "interview_results";
const FEED_COLUMNS =
  "id, created_at, nickname, interviewer, total_score, is_passed, final_verdict, qa_history, upvotes";

/** 탈락 화면의 [이 억까를 세상에 박제하기] 버튼용 저장. Supabase 미설정 시 null. */
export async function saveInterviewResult(
  row: InterviewResultRow
): Promise<{ id: string } | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  const { data, error } = await client
    .from(TABLE)
    .insert(row)
    .select("id")
    .single();
  if (error || !data) return null;
  return { id: data.id as string };
}

/** 메인 화면 [오늘의 레전드 불합격] 피드. 최신순, 불합격 건만. */
export async function fetchLegendFeed(limit = 20): Promise<InterviewResultRow[]> {
  const client = getSupabaseServerClient();
  if (!client) return [];

  const { data } = await client
    .from(TABLE)
    .select(FEED_COLUMNS)
    .eq("is_passed", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as InterviewResultRow[] | null) ?? [];
}
