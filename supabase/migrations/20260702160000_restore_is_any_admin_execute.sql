-- Restore EXECUTE on is_any_admin for authenticated role.
-- The previous migration (20260702153409) incorrectly revoked EXECUTE from
-- authenticated, but RLS policies on blog_posts, newsletter_subscribers, and
-- contact_messages call is_any_admin(auth.uid()) inside USING / WITH CHECK
-- clauses that run in the context of the authenticated role.
-- The function is SECURITY DEFINER so its body runs as the definer, but the
-- caller still needs EXECUTE privilege to invoke it.
GRANT EXECUTE ON FUNCTION public.is_any_admin(uuid) TO authenticated;
