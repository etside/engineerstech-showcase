
DROP POLICY IF EXISTS "Authenticated users can create businesses" ON public.businesses;
CREATE POLICY "Users can create their own business"
  ON public.businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

REVOKE SELECT ON public.businesses FROM anon;
GRANT SELECT (
  id, owner_id, slug, name, logo_url, cover_url, tagline, description,
  category, industry, services, website, location, country,
  founded_year, employee_count, min_project_size, hourly_rate,
  rating, review_count, geo_score, is_verified, is_featured,
  created_at, updated_at, tier, claimed_by, verification_status,
  ai_summary, ai_summary_updated_at, is_active, search_vector
) ON public.businesses TO anon;

GRANT SELECT ON public.businesses TO authenticated;
