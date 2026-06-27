import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function RequireAdmin({ children, requireSuper = false }: { children: React.ReactNode; requireSuper?: boolean }) {
  const [state, setState] = useState<"loading" | "ok" | "no">("loading");
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setState("no");
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const roles = (data || []).map((r) => r.role);
      const ok = requireSuper
        ? roles.includes("super_admin")
        : roles.includes("admin") || roles.includes("super_admin");
      setState(ok ? "ok" : "no");
    })();
  }, [requireSuper]);
  if (state === "loading") return <div className="container-tight py-20">Loading…</div>;
  if (state === "no") return <div className="container-tight py-20 text-center"><h2 className="display-3 mb-2">{requireSuper ? "Super admin only" : "Admin only"}</h2><p className="text-muted-foreground">You don't have access to this page.</p></div>;
  return <>{children}</>;
}