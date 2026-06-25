
-- EXTEND businesses
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free','pro','featured','enterprise')),
  ADD COLUMN IF NOT EXISTS claimed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','verified','rejected','suspended')),
  ADD COLUMN IF NOT EXISTS verification_docs text[],
  ADD COLUMN IF NOT EXISTS ai_summary jsonb,
  ADD COLUMN IF NOT EXISTS ai_summary_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION public.businesses_search_vector_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.tagline,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description,'')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.services,' '),'')), 'D');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS businesses_search_vector_trg ON public.businesses;
CREATE TRIGGER businesses_search_vector_trg BEFORE INSERT OR UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.businesses_search_vector_update();

UPDATE public.businesses SET name = name; -- backfill

CREATE INDEX IF NOT EXISTS businesses_search_idx ON public.businesses USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS businesses_tier_idx ON public.businesses (tier);
CREATE INDEX IF NOT EXISTS businesses_category_idx ON public.businesses (category);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, name text NOT NULL,
  description text, icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text, body text,
  verified boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending','approved','hidden','flagged')),
  helpful_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON public.reviews FOR SELECT USING (status='approved' OR auth.uid()=author_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "reviews_insert_self" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid()=author_id);
CREATE POLICY "reviews_update_self" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid()=author_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "reviews_delete_self" ON public.reviews FOR DELETE TO authenticated USING (auth.uid()=author_id OR public.has_role(auth.uid(),'admin'));
CREATE INDEX IF NOT EXISTS reviews_business_idx ON public.reviews (business_id);

CREATE OR REPLACE FUNCTION public.recompute_business_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE bid uuid;
BEGIN
  bid := COALESCE(NEW.business_id, OLD.business_id);
  UPDATE public.businesses SET
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric,2) FROM public.reviews WHERE business_id=bid AND status='approved'),0),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE business_id=bid AND status='approved')
  WHERE id = bid;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS reviews_aggregate_trigger ON public.reviews;
CREATE TRIGGER reviews_aggregate_trigger AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.recompute_business_rating();
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CLAIMS
CREATE TABLE IF NOT EXISTS public.business_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  evidence text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.business_claims TO authenticated;
GRANT ALL ON public.business_claims TO service_role;
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "claims_owner_read" ON public.business_claims FOR SELECT TO authenticated
  USING (auth.uid()=user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "claims_insert_self" ON public.business_claims FOR INSERT TO authenticated WITH CHECK (auth.uid()=user_id);
CREATE POLICY "claims_admin_update" ON public.business_claims FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- PRICING TIERS
CREATE TABLE IF NOT EXISTS public.pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, name text NOT NULL,
  price_usd numeric(10,2) NOT NULL DEFAULT 0,
  price_bdt numeric(10,2),
  billing_period text NOT NULL DEFAULT 'monthly' CHECK (billing_period IN ('monthly','yearly','one_time')),
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  limits jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pricing_tiers TO anon, authenticated;
GRANT ALL ON public.pricing_tiers TO service_role;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pricing_public_read" ON public.pricing_tiers FOR SELECT USING (is_active=true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "pricing_admin_write" ON public.pricing_tiers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.pricing_tiers (slug,name,price_usd,billing_period,features,limits,display_order) VALUES
 ('free','Free',0,'monthly','["Basic listing","1 review per month"]'::jsonb,'{"reviews_per_month":1,"ai_visibility":false}'::jsonb,1),
 ('pro','Pro',29,'monthly','["Full listing","AI discovery","10 reviews per month"]'::jsonb,'{"reviews_per_month":10,"ai_visibility":true}'::jsonb,2),
 ('featured','Featured',99,'monthly','["Priority AI ranking","Unlimited reviews","Dedicated support"]'::jsonb,'{"reviews_per_month":-1,"ai_visibility":true,"priority":true}'::jsonb,3),
 ('enterprise','Enterprise',0,'monthly','["White-label","API access","Account manager"]'::jsonb,'{"reviews_per_month":-1,"api_access":true}'::jsonb,4)
ON CONFLICT (slug) DO NOTHING;

-- SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('free','pro','featured','enterprise')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active','inactive','expired','cancelled','pending')),
  sslcz_tran_id text, sslcz_val_id text,
  amount numeric(10,2), currency text NOT NULL DEFAULT 'BDT',
  valid_from timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz,
  auto_renew boolean NOT NULL DEFAULT true,
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subs_owner_read" ON public.subscriptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id=subscriptions.business_id AND (b.owner_id=auth.uid() OR b.claimed_by=auth.uid())));
CREATE POLICY "subs_admin_write" ON public.subscriptions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- API KEYS
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  key text UNIQUE NOT NULL, name text,
  permissions text[] NOT NULL DEFAULT ARRAY['read'],
  rate_limit int NOT NULL DEFAULT 1000,
  last_used timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "apikeys_owner_all" ON public.api_keys FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id=api_keys.business_id AND (b.owner_id=auth.uid() OR b.claimed_by=auth.uid())))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id=api_keys.business_id AND (b.owner_id=auth.uid() OR b.claimed_by=auth.uid())));

-- MCP CONFIGS (per business)
CREATE TABLE IF NOT EXISTS public.mcp_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL UNIQUE REFERENCES public.businesses(id) ON DELETE CASCADE,
  expose_fields text[] NOT NULL DEFAULT ARRAY['name','tagline','description','services','rating','website'],
  custom_prompt text,
  whitelisted_llms text[] NOT NULL DEFAULT ARRAY[]::text[],
  blacklisted_llms text[] NOT NULL DEFAULT ARRAY[]::text[],
  context_window int NOT NULL DEFAULT 4096,
  include_logo boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mcp_configs TO authenticated;
GRANT SELECT ON public.mcp_configs TO anon;
GRANT ALL ON public.mcp_configs TO service_role;
ALTER TABLE public.mcp_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mcp_public_read_active" ON public.mcp_configs FOR SELECT USING (is_active=true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "mcp_owner_write" ON public.mcp_configs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id=mcp_configs.business_id AND (b.owner_id=auth.uid() OR b.claimed_by=auth.uid())))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id=mcp_configs.business_id AND (b.owner_id=auth.uid() OR b.claimed_by=auth.uid())));

-- AI RECOMMENDATION LOG
CREATE TABLE IF NOT EXISTS public.ai_recommendations_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  intent text, score numeric(4,2), position int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ai_recommendations_log TO authenticated;
GRANT ALL ON public.ai_recommendations_log TO service_role;
ALTER TABLE public.ai_recommendations_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "airec_owner_read" ON public.ai_recommendations_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id=ai_recommendations_log.business_id AND (b.owner_id=auth.uid() OR b.claimed_by=auth.uid())));

-- GEO FEED CACHE
CREATE TABLE IF NOT EXISTS public.geo_feed_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL,
  payload jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '1 hour')
);
GRANT SELECT ON public.geo_feed_cache TO anon, authenticated;
GRANT ALL ON public.geo_feed_cache TO service_role;
ALTER TABLE public.geo_feed_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "geofeed_public_read" ON public.geo_feed_cache FOR SELECT USING (true);

-- CATEGORIES SEED
INSERT INTO public.categories (slug,name,description,icon) VALUES
 ('software','Software Development','Custom apps, web, and SaaS','code'),
 ('ai-ml','AI & Machine Learning','LLMs, agents, data science','brain'),
 ('marketing','Digital Marketing','SEO, GEO, content, ads','megaphone'),
 ('design','Design & UX','Branding, product design','palette'),
 ('cloud','Cloud & DevOps','Infra, deployment, SRE','cloud'),
 ('consulting','Consulting','Strategy and advisory','briefcase')
ON CONFLICT (slug) DO NOTHING;
