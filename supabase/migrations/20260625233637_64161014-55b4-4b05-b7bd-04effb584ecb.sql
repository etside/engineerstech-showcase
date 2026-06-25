
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  is_secret boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_admin_all" ON public.platform_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.platform_settings (key, value, description, is_secret) VALUES
 ('sslcz_store_id', '""'::jsonb, 'SSLCommerz Store ID', true),
 ('sslcz_store_password', '""'::jsonb, 'SSLCommerz Store Password', true),
 ('sslcz_sandbox', 'true'::jsonb, 'Use SSLCommerz sandbox', false),
 ('ai_default_model', '"google/gemini-3-flash-preview"'::jsonb, 'Default Lovable AI model', false),
 ('geo_weights', '{"completeness":0.3,"reviews":0.3,"recency":0.15,"claim":0.1,"tier":0.15}'::jsonb, 'GEO score weights', false),
 ('mcp_global_whitelist', '["chatgpt","claude","deepseek","qwen","gemini"]'::jsonb, 'Default whitelisted LLMs', false)
ON CONFLICT (key) DO NOTHING;
