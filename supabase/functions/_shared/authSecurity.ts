// Auth rate limiting and security helpers
import { checkRateLimit } from "./rateLimit.ts";

// Rate limit auth attempts per IP: 10 attempts per 15 minutes
export async function checkAuthRateLimit(ipAddress: string) {
  return checkRateLimit(`auth:${ipAddress}`, 10, 900);
}

// Rate limit signup per email: 5 attempts per hour (prevent enumeration)
export async function checkSignupRateLimit(email: string) {
  return checkRateLimit(`signup:${email.toLowerCase()}`, 5, 3600);
}

// Rate limit password reset per email: 3 attempts per hour
export async function checkPasswordResetRateLimit(email: string) {
  return checkRateLimit(`pwreset:${email.toLowerCase()}`, 3, 3600);
}

// Rate limit login failures per email: 5 failures then lockout for 15 min
export async function checkLoginFailureCount(email: string) {
  return checkRateLimit(`login_fail:${email.toLowerCase()}`, 5, 900);
}

// Check if password has been compromised via HIBP
export async function checkPasswordBreach(password: string): Promise<{ pwned: boolean; count: number }> {
  try {
    const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/hibp-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      return await response.json();
    }
    return { pwned: false, count: 0 };
  } catch {
    // Fail safely: allow signup if HIBP check fails
    return { pwned: false, count: 0 };
  }
}

export default checkAuthRateLimit;
