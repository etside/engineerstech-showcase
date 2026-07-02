REVOKE SELECT ON public.businesses FROM anon;

GRANT SELECT (
  id, slug, name, logo_url, cover_url, tagline, description,
  category, industry, services, website, location, country,
  founded_year, employee_count, min_project_size, hourly_rate,
  rating, review_count, geo_score, is_verified, is_featured,
  is_active, created_at, updated_at, social_links
) ON public.businesses TO anon;

CREATE OR REPLACE VIEW public.businesses_public
  WITH (security_invoker = true) AS
SELECT
  id, slug, name, logo_url, cover_url, tagline, description,
  category, industry, services, website, location, country,
  founded_year, employee_count, min_project_size, hourly_rate,
  rating, review_count, geo_score, is_verified, is_featured,
  is_active, created_at, updated_at, social_links
FROM public.businesses
WHERE is_active = true;

GRANT SELECT ON public.businesses_public TO anon, authenticated;