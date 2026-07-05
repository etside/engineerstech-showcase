/**
 * ProtectedRoute — gate any route behind authentication (and optionally a role).
 *
 * Usage:
 *   <ProtectedRoute />            → any signed-in user
 *   <ProtectedRoute role="admin" />       → admin or super_admin
 *   <ProtectedRoute role="super_admin" /> → super_admin only
 *
 * On failure the component stores the attempted URL in sessionStorage so Auth.tsx
 * can redirect back after a successful login.
 */
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/use-auth";
import { ShieldAlert, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type AllowedRole = "user" | "vendor" | "admin" | "super_admin";

interface ProtectedRouteProps {
  /** Minimum required role. Omit for "any authenticated user". */
  role?: AllowedRole;
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // While loading auth state, show a spinner (avoids flash of login prompt)
  if (loading) {
    return (
      <div className="container-tight py-24 flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not authenticated → redirect to /auth preserving return URL
  if (!user) {
    // Store attempted path so auth page can redirect back
    sessionStorage.setItem("auth_redirect", location.pathname + location.search);
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Role check
  if (role === "super_admin" && !isSuperAdmin) {
    return <AccessDenied message="Only super admins can access this page." onBack={() => navigate("/")} />;
  }

  if (role === "admin" && !isAdmin) {
    return <AccessDenied message="Admin or super admin privileges are required." onBack={() => navigate("/")} />;
  }

  // "vendor" and "user" roles — any authenticated user qualifies for now
  // (extend this when you add role-based vendor checks to the User type)

  return <Outlet />;
}

// ── Inline access-denied card ─────────────────────────────────────────────────
function AccessDenied({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="container-tight py-20 max-w-md mx-auto">
      <Card className="glass-card border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-destructive" />
            Access denied
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={onBack}>
            Back to home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Re-export a convenience wrapper that mirrors RequireAdmin API ─────────────
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container-tight py-24 flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    sessionStorage.setItem("auth_redirect", location.pathname + location.search);
    return (
      <div className="container-tight py-20 max-w-md mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="size-5 text-primary-light" /> Sign in required
            </CardTitle>
            <CardDescription>Please sign in to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="btn-gradient w-full" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
