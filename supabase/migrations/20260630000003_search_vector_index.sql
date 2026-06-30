-- Optimize search_vector for businesses table
CREATE OR REPLACE FUNCTION public.tsvector_update_trigger_businesses()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.name, '') || ' ' || COALESCE(NEW.tagline, '') || ' ' || COALESCE(NEW.description, '') || ' ' || COALESCE(NEW.category, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

DROP TRIGGER IF EXISTS businesses_search_vector_update ON public.businesses;
CREATE TRIGGER businesses_search_vector_update
  BEFORE INSERT OR UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.tsvector_update_trigger_businesses();

-- Create GIN index for full-text search if not exists
CREATE INDEX IF NOT EXISTS businesses_search_vector_gin_idx ON public.businesses USING GIN(search_vector);

-- Optimize businesses queries with composite indexes
CREATE INDEX IF NOT EXISTS businesses_active_verified_idx ON public.businesses(is_active, is_verified) WHERE is_active = true AND is_verified = true;
CREATE INDEX IF NOT EXISTS businesses_geo_score_idx ON public.businesses(geo_score DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS businesses_category_active_idx ON public.businesses(category, is_active) WHERE is_active = true;

-- Backfill search_vector for existing records
UPDATE public.businesses SET search_vector = to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(tagline, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(category, '')) WHERE search_vector IS NULL OR search_vector = ''::tsvector;