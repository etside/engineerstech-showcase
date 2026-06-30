-- Add expiry and rotation metadata to mcp_config
ALTER TABLE public.mcp_config
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS token_last_rotated_at timestamptz;

-- No default; admin rotates token via Admin UI which will set these fields.
