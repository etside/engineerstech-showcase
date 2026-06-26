
-- Audit trail + rejection workflow for business claims
ALTER TABLE public.business_claims
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS additional_docs_requested text,
  ADD COLUMN IF NOT EXISTS evidence_docs text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS claim_type text NOT NULL DEFAULT 'initial',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.claim_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id uuid NOT NULL REFERENCES public.business_claims(id) ON DELETE CASCADE,
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role text NOT NULL DEFAULT 'system',
  action text NOT NULL,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.claim_audit_log TO authenticated;
GRANT ALL ON public.claim_audit_log TO service_role;

ALTER TABLE public.claim_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all audit"
  ON public.claim_audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners view their audit"
  ON public.claim_audit_log FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.owner_id = auth.uid() OR b.claimed_by = auth.uid())));

CREATE POLICY "Admins insert audit"
  ON public.claim_audit_log FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners insert audit for their business"
  ON public.claim_audit_log FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.owner_id = auth.uid() OR b.claimed_by = auth.uid())));

CREATE INDEX IF NOT EXISTS claim_audit_log_business_idx ON public.claim_audit_log(business_id, created_at DESC);

-- Activation helper: set businesses.is_active when active subscription AND verified
CREATE OR REPLACE FUNCTION public.refresh_business_active(_business_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_active_sub boolean;
  is_verified_now boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
     WHERE business_id = _business_id
       AND status = 'active'
       AND (valid_until IS NULL OR valid_until > now())
  ) INTO has_active_sub;

  SELECT (verification_status = 'verified') INTO is_verified_now
    FROM public.businesses WHERE id = _business_id;

  UPDATE public.businesses
     SET is_active = (COALESCE(has_active_sub,false) AND COALESCE(is_verified_now,false)),
         updated_at = now()
   WHERE id = _business_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.refresh_business_active(uuid) FROM PUBLIC, anon, authenticated;
