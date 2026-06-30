-- Tighten businesses INSERT policy: require owner_id matches auth.uid()
-- Run this migration to replace the overly-permissive WITH CHECK
ALTER POLICY "Authenticated users can create businesses" ON public.businesses
  FOR INSERT
  TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Ensure row-level security remains enabled
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
