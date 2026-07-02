import { getAuthToken } from "./api";

export async function invokeFn<T = unknown>(name: string, body?: unknown): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`/api/fn/${name}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Function ${name} failed (${res.status})`);
  }
  return res.json();
}