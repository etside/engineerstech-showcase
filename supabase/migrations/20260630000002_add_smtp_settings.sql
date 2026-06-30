-- Add SMTP settings keys to platform_settings for SuperAdmin configuration
INSERT INTO public.platform_settings (key, value, description, is_secret) VALUES
  ('smtp_provider', '"sendgrid"'::jsonb, 'SMTP provider: sendgrid | mailgun | postmark', false),
  ('smtp_api_key', '""'::jsonb, 'API key for SMTP provider (SendGrid key)', true),
  ('smtp_from', '"noreply@example.com"'::jsonb, 'From email address for outbound mail', false),
  ('smtp_from_name', '"GeoListed"'::jsonb, 'From display name', false)
ON CONFLICT (key) DO NOTHING;
