import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";

export default function RequireAdmin({ children, requireSuper = false }: { children: React.ReactNode; requireSuper?: boolean }) {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();

  if (loading) return <div className="container-tight py-20">Loading…</div>;
  if (!user) return <div className="container-tight py-20 text-center"><h2 className="display-3 mb-2">Sign in required</h2><p className="text-muted-foreground">Please sign in to access this page.</p></div>;

  const ok = requireSuper ? isSuperAdmin : isAdmin;
  if (!ok) return <div className="container-tight py-20 text-center"><h2 className="display-3 mb-2">{requireSuper ? "Super admin only" : "Admin only"}</h2><p className="text-muted-foreground">You don't have access to this page.</p></div>;

  return <>{children}</>;
}
