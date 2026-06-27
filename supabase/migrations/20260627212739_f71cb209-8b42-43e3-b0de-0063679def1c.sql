
-- Grant super_admin to designated email retroactively
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::public.app_role
  FROM auth.users WHERE lower(email) = 'kptjms991@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Trigger: on user creation, if email matches, grant super_admin
CREATE OR REPLACE FUNCTION public.grant_super_admin_for_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'kptjms991@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS on_auth_user_grant_super_admin ON auth.users;
CREATE TRIGGER on_auth_user_grant_super_admin
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_super_admin_for_email();

-- Convenience: any-admin check
CREATE OR REPLACE FUNCTION public.is_any_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
     WHERE user_id = _user_id AND role IN ('admin','super_admin')
  )
$$;

-- Blog posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  body_md text NOT NULL,
  cover_url text,
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  language text NOT NULL DEFAULT 'en',
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON public.blog_posts
  FOR SELECT USING (published = true OR public.is_any_admin(auth.uid()));
CREATE POLICY "Admins manage posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING (public.is_any_admin(auth.uid()))
  WITH CHECK (public.is_any_admin(auth.uid()));
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  language text NOT NULL DEFAULT 'en',
  confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read subscribers" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (public.is_any_admin(auth.uid()));
CREATE POLICY "Admins manage subscribers" ON public.newsletter_subscribers
  FOR ALL TO authenticated USING (public.is_any_admin(auth.uid())) WITH CHECK (public.is_any_admin(auth.uid()));

-- Allow super_admin to manage platform_settings (in addition to existing admin policy)
DROP POLICY IF EXISTS "Super admins manage platform settings" ON public.platform_settings;
CREATE POLICY "Super admins manage platform settings" ON public.platform_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Super-admin override: can flip any business live without payment
DROP POLICY IF EXISTS "Super admins manage businesses" ON public.businesses;
CREATE POLICY "Super admins manage businesses" ON public.businesses
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Seed default platform setting keys for CMS-managed billing & gateway creds metadata
INSERT INTO public.platform_settings (key, value, description, is_secret)
VALUES
  ('billing_visible', 'false'::jsonb, 'Show pricing publicly', false),
  ('billing_margin_pct', '20'::jsonb, 'Markup % applied on top of AI/processing costs', false),
  ('ai_default_model', '"google/gemini-3-flash-preview"'::jsonb, 'Default Lovable AI model', false),
  ('sslcz_store_id', '""'::jsonb, 'SSLCommerz store id (set via super admin)', true),
  ('sslcz_store_passwd', '""'::jsonb, 'SSLCommerz store password (set via super admin)', true),
  ('sslcz_sandbox', 'true'::jsonb, 'Use SSLCommerz sandbox', false)
ON CONFLICT (key) DO NOTHING;
