import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ok" | "no">("loading");
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setState("no");
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      setState((data || []).some((r) => r.role === "admin") ? "ok" : "no");
    })();
  }, []);
  if (state === "loading") return <div className="container-tight py-20">Loading…</div>;
  if (state === "no") return <div className="container-tight py-20 text-center"><h2 className="display-3 mb-2">Admin only</h2><p className="text-muted-foreground">You need admin role to access this page.</p></div>;
  return <>{children}</>;
}