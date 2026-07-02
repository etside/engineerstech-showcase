
-- Replace overly permissive SELECT policy
DROP POLICY IF EXISTS mcp_public_read_active ON public.mcp_configs;

CREATE POLICY mcp_owner_or_admin_read
  ON public.mcp_configs
  FOR SELECT
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = mcp_configs.business_id
        AND (b.owner_id = auth.uid() OR b.claimed_by = auth.uid())
    )
  );

-- Revoke direct anon access
REVOKE SELECT ON public.mcp_configs FROM anon;

-- Safe public projection (no prompt or LLM whitelists)
CREATE OR REPLACE VIEW public.mcp_configs_public
  WITH (security_invoker = true) AS
  SELECT id, business_id, expose_fields, context_window, include_logo, is_active, updated_at
  FROM public.mcp_configs
  WHERE is_active = true;

GRANT SELECT ON public.mcp_configs_public TO anon, authenticated;
