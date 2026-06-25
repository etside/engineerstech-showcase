import { supabase } from "@/integrations/supabase/client";

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID as string;
export const fnBase = `https://${projectId}.functions.supabase.co`;

export async function invokeFn<T = unknown>(name: string, body?: unknown): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${fnBase}/${name}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Function ${name} failed (${res.status})`);
  }
  return res.json();
}