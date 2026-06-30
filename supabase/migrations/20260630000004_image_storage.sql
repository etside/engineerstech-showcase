-- Image storage buckets for businesses, reviews, and portfolio
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types, owner, created_at, updated_at)
VALUES 
  ('businesses-logos', 'Business logos and avatars', true, true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[], 'supabase_admin', now(), now()),
  ('businesses-portfolio', 'Portfolio and case studies', false, true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[], 'supabase_admin', now(), now()),
  ('reviews-images', 'Review attached images', true, true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[], 'supabase_admin', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to business logos
CREATE POLICY "Public can read business logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'businesses-logos');

-- Allow authenticated users to upload their own business logos
CREATE POLICY "Business owners can upload logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'businesses-logos' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to read portfolio images for verification
CREATE POLICY "Authenticated users can read portfolio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'businesses-portfolio' 
    AND auth.role() = 'authenticated'
  );

-- Allow business owners to upload portfolio
CREATE POLICY "Business owners can upload portfolio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'businesses-portfolio' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read access to review images
CREATE POLICY "Public can read review images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'reviews-images');

-- Allow authenticated users to upload review images
CREATE POLICY "Authenticated users can upload review images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'reviews-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
