-- Fix RLS gap: super_admin can manage user_roles (not just admin)
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

-- Ensure super_admin also has admin role for full RLS access
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
  FROM auth.users WHERE lower(email) = 'kptjms991@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
