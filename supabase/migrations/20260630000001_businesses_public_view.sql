-- Create a public view exposing non-sensitive business fields (no email/phone)
-- and update grants so anonymous users read from the view instead of the table.

CREATE OR REPLACE VIEW public.businesses_public AS
SELECT
  id, owner_id, slug, name, logo_url, cover_url, tagline, description,
  category, industry, services, website, location, country, founded_year,
  employee_count, min_project_size, hourly_rate, rating, review_count,
  geo_score, is_verified, is_featured, is_active, created_at, updated_at
FROM public.businesses;

REVOKE SELECT ON public.businesses FROM anon;
GRANT SELECT ON public.businesses_public TO anon;

-- Keep service_role with full access
GRANT SELECT ON public.businesses TO service_role;
