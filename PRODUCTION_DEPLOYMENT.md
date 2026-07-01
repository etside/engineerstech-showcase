# Production Deployment Checklist

## Database Migrations (Required)
```bash
# Run in order:
supabase migration up 20260630000000_fix_businesses_rls
supabase migration up 20260630000001_businesses_public_view
supabase migration up 20260630000002_add_smtp_settings
supabase migration up 20260630000003_search_vector_index
supabase migration up 20260630000004_image_storage
```

## Environment Variables (Required)
```
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key

# Payment (SSLCommerz)
SSLCZ_STORE_ID=your_store_id
SSLCZ_STORE_PASSWORD=your_store_password

# Rate Limiting (Optional but recommended)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Optional: Analytics, Error tracking
SENTRY_DSN=your_sentry_dsn
POSTHOG_API_KEY=your_posthog_key
```

## Platform Settings (Configure in Super Admin)

### SMTP Configuration
- `smtp_provider`: sendgrid
- `smtp_api_key`: <SendGrid API key>
- `smtp_from`: noreply@yourdomain.com
- `smtp_from_name`: engineersTech

### Payment Gateway
- `sslcz_store_id`: <SSLCommerz Store ID>
- `sslcz_store_password`: <SSLCommerz Store Password>
- `sslcz_sandbox`: false (for production)

### MCP Configuration (Set initial)
- `mcp_enabled`: true
- `mcp_rate_limit`: 1000 (requests per hour)
- Generate initial API token in Admin → MCP Config

### GEO Scoring Weights (Optional tuning)
- `geo_weight_verification`: 0.3
- `geo_weight_reviews`: 0.2
- `geo_weight_recency`: 0.15
- `geo_weight_completeness`: 0.35

## Security Checklist

### Authentication
- [ ] Enable MFA for super admin accounts
- [ ] Set strong passwords for initial admin users
- [ ] Configure HIBP password breach checking (automatic on signup)
- [ ] Enable auth rate limiting (automatic)

### Data Security
- [ ] Configure Row Level Security (RLS) policies ✅
- [ ] Set up SSL/TLS certificates
- [ ] Enable database backups (Supabase handles automatically)
- [ ] Configure API rate limits per endpoint

### Payment Security
- [ ] Verify SSLCommerz HMAC signatures (automatic on IPN) ✅
- [ ] Test payment flow in sandbox first
- [ ] Monitor transaction logs
- [ ] Keep store credentials secure

### API & Edge Functions
- [ ] Enable rate limiting via Upstash Redis
- [ ] Set up error tracking (Sentry)
- [ ] Enable request logging
- [ ] Configure CORS properly

## Feature Verification

### Public Directory
- [ ] Listings page loads live data from `businesses_public` ✅
- [ ] Search and filters work correctly
- [ ] GEO scores display properly
- [ ] Verified badge shows for verified businesses

### Business Profile
- [ ] Profile loads from `businesses_public` view
- [ ] Contact info only visible when appropriate
- [ ] Reviews display correctly
- [ ] AI summary shows
- [ ] Image uploads work

### Admin Dashboard
- [ ] Overview stats display
- [ ] Business moderation works
- [ ] Claim management functional
- [ ] **Reviews moderation UI active** ✅
- [ ] Settings update properly

### MCP Server
- [ ] Token authentication working ✅
- [ ] Token expiry validation active ✅
- [ ] Tools return correct results
- [ ] Rate limiting enforced
- [ ] Works with ChatGPT, Claude, etc.

### Email System
- [ ] SendGrid integration configured ✅
- [ ] Verification emails send
- [ ] Password reset emails send
- [ ] Transactional email templates render ✅
- [ ] Email headers/branding correct

### Payment Processing
- [ ] SSLCommerz IPN handler receives webhooks
- [ ] HMAC signature verification works ✅
- [ ] Subscription status updates on payment
- [ ] Business listing activates after payment

## Performance & Monitoring

### Database
- [ ] Search vector GIN index created ✅
- [ ] Composite indexes on frequently queried columns ✅
- [ ] Query performance under load acceptable

### Caching
- [ ] Redis configured for rate limits
- [ ] Edge function responses cached appropriately

### Logging & Monitoring
- [ ] Application logs go to stdout (Vercel/Railway captures)
- [ ] Error tracking via Sentry (if configured)
- [ ] Analytics events tracked
- [ ] Server status monitoring enabled

## Deployment Steps

1. **Prepare Database**
   - Run all migrations
   - Seed initial categories
   - Configure platform settings

2. **Environment Setup**
   - Set all required env vars
   - Configure Supabase RLS
   - Set up storage buckets

3. **Deploy Frontend**
   - Build: `npm run build`
   - Deploy to Vercel/Netlify
   - Test all pages load correctly

4. **Deploy Edge Functions**
   - Deploy to Supabase: `supabase functions deploy`
   - Verify function URLs accessible
   - Test MCP server connectivity

5. **Configure Admin**
   - Create super admin user
   - Configure SMTP settings
   - Configure payment gateway
   - Generate MCP API token

6. **Testing**
   - Test signup → HIBP check → verification email
   - Test business submission → claim → approval
   - Test payment flow (sandbox)
   - Test reviews moderation
   - Test MCP server endpoints

7. **Launch**
   - Enable production features
   - Monitor error logs
   - Set up uptime monitoring
   - Announce to users

## Post-Launch Monitoring

### First 24 Hours
- Monitor error rates
- Check database query performance
- Verify email delivery
- Test API rate limits

### Weekly
- Review error logs
- Check database backups
- Verify MCP token usage
- Monitor subscription payments

### Monthly
- Performance optimization review
- Security audit
- Feature usage analytics
- User feedback review

## Rollback Plan

If issues arise:
1. Scale down requests (rate limit tighter)
2. Disable new features temporarily
3. Restore from backup if data corruption
4. Notify users of issues via status page
5. Debug and fix before re-enabling

## Contact & Support

- Supabase Support: https://supabase.com/support
- SendGrid Support: https://sendgrid.com/support
- SSLCommerz Support: https://help.sslcommerz.com/
- Monitoring Dashboards: (configure links to your services)
