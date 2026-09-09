import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

/**
 * 서버(API Route)에서만 쓰는 Supabase 클라이언트.
 * SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY가 없으면 null을 반환해
 * 호출부가 해당 기능을 조용히 건너뛸 수 있게 한다 (서비스는 계속 살아있어야 함).
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  cachedClient = url && publishableKey ? createClient(url, publishableKey) : null;
  return cachedClient;
}
