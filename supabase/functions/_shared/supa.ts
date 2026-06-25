import { createClient } from "npm:@supabase/supabase-js@2";

export const supaService = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

export async function getSetting<T = unknown>(key: string, fallback: T): Promise<T> {
  const s = supaService();
  const { data } = await s.from("platform_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value ?? fallback) as T;
}

export async function getUserFromAuthHeader(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const s = supaService();
  const { data } = await s.auth.getUser(token);
  return data.user;
}