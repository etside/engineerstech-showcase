
REVOKE EXECUTE ON FUNCTION public.grant_super_admin_for_email() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_any_admin(uuid) FROM PUBLIC, anon;

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
