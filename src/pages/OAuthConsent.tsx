/**
 * OAuth 2.1 Consent / Authorization Page
 *
 * ChatGPT (and any OAuth client) is redirected here by /api/oauth/authorize.
 * URL: /oauth/consent?client_id=...&redirect_uri=...&scope=...&state=...
 *       &code_challenge=...&code_challenge_method=S256
 *
 * Flow:
 *   1. If already logged in → auto-approve (no extra click needed for MCP tools)
 *   2. If not logged in → show login form → then approve
 *   3. POST /api/oauth/authorize → get redirect URL → navigate to it
 *      (redirect goes back to ChatGPT with ?code=...)
 */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, Lock, ArrowRight, Loader2 } from "lucide-react";
import { authApi, setAuthToken, getAuthToken } from "@/lib/api";
import { setPageMeta } from "@/lib/seo";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const clientId     = params.get("client_id")             || "";
  const redirectUri  = params.get("redirect_uri")          || "";
  const scope        = params.get("scope")                 || "mcp:read";
  const state        = params.get("state")                 || "";
  const challenge    = params.get("code_challenge")        || "";
  const challengeMethod = params.get("code_challenge_method") || "S256";

  const [step, setStep]           = useState<"check" | "login" | "approve" | "done" | "error">("check");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [busy, setBusy]           = useState(false);
  const [clientName, setClientName] = useState("MCP Client");

  useEffect(() => {
    setPageMeta(
      "Authorize Access — engineersTech",
      "Authorize an application to access your engineersTech account."
    );
  }, []);

  // On mount: if already authenticated → go straight to approve step
  useEffect(() => {
    if (!clientId) {
      setStep("error");
      setError("Missing client_id parameter.");
      return;
    }
    const token = getAuthToken();
    if (token) {
      setStep("approve");
    } else {
      setStep("login");
    }
    // Try to get the client name from the registration URI
    fetch(`${BASE_URL}/oauth/register/${clientId}`)
      .then(r => r.json())
      .then(d => { if (d.client_name) setClientName(d.client_name); })
      .catch(() => {});
  }, [clientId]);

  // ── Login ────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await authApi.login(email, password) as { token?: string };
      if (data.token) {
        setAuthToken(data.token);
        setStep("approve");
      } else {
        setError("Login failed — no token received.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  // ── Approve ──────────────────────────────────────────────────────────────
  async function handleApprove() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/oauth/authorize`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        },
        body: JSON.stringify({
          client_id:            clientId,
          redirect_uri:         redirectUri,
          scope,
          state,
          code_challenge:       challenge,
          code_challenge_method: challengeMethod,
        }),
      });
      const data = await res.json();
      if (data.redirect) {
        setStep("done");
        // Small delay so user sees "redirecting" before we leave
        setTimeout(() => { window.location.href = data.redirect; }, 400);
      } else {
        setError(data.error || "Authorization failed.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authorization request failed.");
    } finally {
      setBusy(false);
    }
  }

  // ── Deny ─────────────────────────────────────────────────────────────────
  function handleDeny() {
    if (redirectUri) {
      const sep = redirectUri.includes("?") ? "&" : "?";
      window.location.href = `${redirectUri}${sep}error=access_denied&state=${encodeURIComponent(state)}`;
    } else {
      navigate("/");
    }
  }

  // ── Scope labels ─────────────────────────────────────────────────────────
  const scopeDescriptions: Record<string, { label: string; desc: string }> = {
    "mcp:read":  { label: "Read access",  desc: "Search businesses, view listings and categories" },
    "mcp:write": { label: "Write access", desc: "Submit listings and post reviews on your behalf" },
    "openid":    { label: "Identity",     desc: "Know who you are (email, profile)" },
    "profile":   { label: "Profile",      desc: "Access your public profile information" },
  };
  const requestedScopes = scope.split(" ").filter(Boolean);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl border border-border/60 shadow-xl">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-1">
              Authorize <span className="text-primary">{clientName}</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              This app wants to connect to your engineersTech account
            </p>
          </div>

          {/* Permissions */}
          <div className="mb-6 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Permissions requested
            </p>
            {requestedScopes.map(s => {
              const info = scopeDescriptions[s];
              return info ? (
                <div key={s} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/40">
                  <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{info.label}</p>
                    <p className="text-xs text-muted-foreground">{info.desc}</p>
                  </div>
                </div>
              ) : (
                <div key={s} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/40">
                  <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{s}</p>
                </div>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* ── Step: checking ── */}
          {step === "check" && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {/* ── Step: login ── */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Sign in to authorize this connection
              </p>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="btn-gradient w-full flex items-center justify-center gap-2"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Sign in & Continue
              </button>
              <button
                type="button"
                onClick={handleDeny}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Cancel
              </button>
            </form>
          )}

          {/* ── Step: approve ── */}
          {step === "approve" && (
            <div className="space-y-3">
              <button
                onClick={handleApprove}
                disabled={busy}
                className="btn-gradient w-full flex items-center justify-center gap-2"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Authorize Access
              </button>
              <button
                onClick={handleDeny}
                disabled={busy}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Deny
              </button>
            </div>
          )}

          {/* ── Step: done ── */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm font-medium text-foreground">Authorized! Redirecting…</p>
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          )}

          {/* ── Step: error ── */}
          {step === "error" && (
            <div className="text-center py-4">
              <p className="text-sm text-destructive mb-4">{error || "Invalid authorization request."}</p>
              <button onClick={() => navigate("/")} className="btn-ghost text-sm">
                Go home
              </button>
            </div>
          )}

        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          engineersTech · OAuth 2.1 · <a href="/privacy" className="underline underline-offset-2">Privacy</a>
        </p>
      </div>
    </div>
  );
}
