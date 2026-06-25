
CREATE TABLE public.mcp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_name TEXT NOT NULL DEFAULT 'geoListed MCP',
  api_token TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  allow_write BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mcp_config TO authenticated;
GRANT ALL ON public.mcp_config TO service_role;

ALTER TABLE public.mcp_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read mcp_config" ON public.mcp_config
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert mcp_config" ON public.mcp_config
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update mcp_config" ON public.mcp_config
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete mcp_config" ON public.mcp_config
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_mcp_config_updated_at
  BEFORE UPDATE ON public.mcp_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.mcp_config (api_token)
VALUES (encode(gen_random_bytes(32), 'hex'));
