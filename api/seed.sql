-- ============================================================
-- engineersTech Directory — Real Business Seed Data
-- Run AFTER schema.sql  (safe to re-import; uses ON DUPLICATE KEY UPDATE)
-- Generated: 2026-07-05
-- ============================================================

-- ── 1. CATEGORIES (all 12) ───────────────────────────────────────────────────
INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Technology',        'technology',        'Software, IT services, cloud & AI companies',                     'Monitor',        1),
  ('c0000001-0000-0000-0000-000000000002', 'Healthcare',        'healthcare',        'Hospitals, clinics, telemedicine & health tech',                  'Heart',          2),
  ('c0000001-0000-0000-0000-000000000003', 'Finance',           'finance',           'Banks, fintech, accounting & investment services',                'DollarSign',     3),
  ('c0000001-0000-0000-0000-000000000004', 'Education',         'education',         'Schools, universities, e-learning & training',                   'GraduationCap',  4),
  ('c0000001-0000-0000-0000-000000000005', 'E-Commerce',        'e-commerce',        'Online stores, marketplaces & retail platforms',                  'ShoppingCart',   5),
  ('c0000001-0000-0000-0000-000000000006', 'Real Estate',       'real-estate',       'Property sales, rental, management & construction',              'Building',       6),
  ('c0000001-0000-0000-0000-000000000007', 'Marketing',         'marketing',         'Digital marketing, SEO, branding & advertising agencies',        'Megaphone',      7),
  ('c0000001-0000-0000-0000-000000000008', 'Consulting',        'consulting',        'Business, IT, management & strategy consulting',                  'Briefcase',      8),
  ('c0000001-0000-0000-0000-000000000009', 'Beauty & Wellness', 'beauty-wellness',   'Salons, spas, beauty clinics & wellness centres',                'Sparkles',       9),
  ('c0000001-0000-0000-0000-000000000010', 'Food & Restaurants','food-restaurants',  'Restaurants, cafés, catering & food delivery',                   'UtensilsCrossed',10),
  ('c0000001-0000-0000-0000-000000000011', 'Security',          'security',          'CCTV, cybersecurity, access control & surveillance',              'Shield',         11),
  ('c0000001-0000-0000-0000-000000000012', 'Logistics',         'logistics',         'Courier, freight, supply chain & delivery services',              'Truck',          12)
ON DUPLICATE KEY UPDATE
  name        = VALUES(name),
  description = VALUES(description),
  icon        = VALUES(icon),
  sort_order  = VALUES(sort_order);

-- ── 2. OWNER USER (super-admin / listing owner) ──────────────────────────────
-- Password: admin#1234  (bcrypt cost=12)
INSERT INTO users (id, email, password_hash, email_confirmed_at) VALUES
  ('u0000001-0000-0000-0000-000000000001',
   'tjms.kp@gmail.com',
   '$2b$12$CX6aJJkWAdASiUBft4folelIY1OkUpIlUTDEb/R9p9XBQZujdvFMi',
   NOW())
ON DUPLICATE KEY UPDATE
  email               = VALUES(email),
  password_hash       = VALUES(password_hash),
  email_confirmed_at  = COALESCE(email_confirmed_at, NOW());

INSERT INTO user_roles (id, user_id, role) VALUES
  ('r0000001-0000-0000-0000-000000000001', 'u0000001-0000-0000-0000-000000000001', 'super_admin'),
  ('r0000001-0000-0000-0000-000000000002', 'u0000001-0000-0000-0000-000000000001', 'admin')
ON DUPLICATE KEY UPDATE role = VALUES(role);

-- ── 3. BUSINESSES ────────────────────────────────────────────────────────────

-- ────────────────────────────────────────────────────────────────────────────
-- Business 1: engineersTech  (https://engineerstechbd.com)
-- Category  : technology
-- Tier      : enterprise  |  Rating: 4.9  |  Reviews: 47
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO businesses (
  id, owner_id,
  name, slug,
  description, short_description,
  website, email, phone,
  city, country, category_id,
  tags, services, social_links, business_hours,
  rating, review_count,
  is_verified, is_featured, is_active,
  tier, status, ai_listing_enabled,
  geo_score, logo_url
) VALUES (
  'b0000001-0000-0000-0000-000000000001',
  'u0000001-0000-0000-0000-000000000001',
  'engineersTech',
  'engineerstech',
  'engineersTech is a Bangladesh-based, AI-driven software engineering company delivering enterprise-grade digital solutions at startup-friendly prices. With a team of 25+ engineers and 150+ projects delivered across 10+ countries, we specialize in Custom Software Development, Web & Mobile App Development, AI & Machine Learning, Cloud & DevOps, Blockchain Development, UI/UX Design, QA Testing & Automation, Staff Augmentation, Managed Services, MVP Development, Technology Consulting, Digital Transformation, Enterprise SaaS, Fintech Solutions, Healthcare IT, and E-Commerce Development. Our flagship products include GlowUp (beauty & wellness booking), eTommerce (e-commerce platform), Restaurant POS, HRM Suite, CRM Platform, eT AI Studio, and Reel Social.',
  'AI-driven software engineering company — custom software, web & mobile apps, AI/ML, cloud, blockchain. 150+ projects, 10+ countries served. Products: GlowUp, eTommerce, POS, HRM.',
  'https://engineerstechbd.com',
  'hello@engineerstechbd.com',
  '+88 01314 44 33 11',
  'Dhaka', 'Bangladesh',
  'c0000001-0000-0000-0000-000000000001',
  '["software","web development","mobile","AI","machine learning","cloud","DevOps","blockchain","SaaS","MVP","consulting","fintech","healthcare","e-commerce","staff augmentation","digital transformation","UI/UX"]',
  '["Custom Software Development","Web Development","Mobile App Development","AI & Machine Learning","Cloud & DevOps","Blockchain Development","UI/UX & Motion Design","QA Testing & Automation","Staff Augmentation","Managed Services","MVP Development","Technology Consulting","Digital Transformation","Enterprise SaaS","Technical Consultation","Fintech Solutions","Healthcare IT","E-Commerce Development","LMS Development","Telecom Solutions"]',
  '{"linkedin":"https://linkedin.com/company/engineerstechbd","facebook":"https://facebook.com/engineerstechbd"}',
  '{"monday":"9:00 AM \u2013 6:00 PM","tuesday":"9:00 AM \u2013 6:00 PM","wednesday":"9:00 AM \u2013 6:00 PM","thursday":"9:00 AM \u2013 6:00 PM","friday":"9:00 AM \u2013 6:00 PM","saturday":"Closed","sunday":"Closed"}',
  4.9, 47,
  1, 1, 1,
  'enterprise', 'approved', 1,
  98.5,
  'https://engineerstechbd.com/logo.png'
)
ON DUPLICATE KEY UPDATE
  name               = VALUES(name),
  description        = VALUES(description),
  short_description  = VALUES(short_description),
  website            = VALUES(website),
  email              = VALUES(email),
  phone              = VALUES(phone),
  city               = VALUES(city),
  country            = VALUES(country),
  category_id        = VALUES(category_id),
  tags               = VALUES(tags),
  services           = VALUES(services),
  social_links       = VALUES(social_links),
  business_hours     = VALUES(business_hours),
  rating             = VALUES(rating),
  review_count       = VALUES(review_count),
  is_verified        = VALUES(is_verified),
  is_featured        = VALUES(is_featured),
  is_active          = VALUES(is_active),
  tier               = VALUES(tier),
  status             = VALUES(status),
  ai_listing_enabled = VALUES(ai_listing_enabled),
  geo_score          = VALUES(geo_score),
  logo_url           = VALUES(logo_url);

-- ────────────────────────────────────────────────────────────────────────────
-- Business 2: eTommerce  (https://etommerce.com)  — product by engineersTech
-- Category  : e-commerce
-- Tier      : pro  |  Rating: 4.8  |  Reviews: 23
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO businesses (
  id, owner_id,
  name, slug,
  description, short_description,
  website, email, phone,
  city, country, category_id,
  tags, services, social_links, business_hours,
  rating, review_count,
  is_verified, is_featured, is_active,
  tier, status, ai_listing_enabled,
  geo_score, logo_url
) VALUES (
  'b0000001-0000-0000-0000-000000000002',
  'u0000001-0000-0000-0000-000000000001',
  'eTommerce',
  'etommerce',
  'eTommerce is Bangladesh''s most focused e-commerce platform, purpose-built for Bangladeshi entrepreneurs who want to sell online fast. Launch a fully functional online store in under 10 minutes from any mobile device. eTommerce ships with a mobile-first Progressive Web App (PWA) storefront, native bilingual support (Bangla + English), and pre-integrated local payment gateways — bKash, Nagad, SSLCommerz, and Cash on Delivery — with zero extra configuration. 500+ active stores are live on the platform, and over ৳10 Crore in orders have been processed. Pricing: Starter ৳499/month, Growth ৳1,499/month, Pro ৳3,499/month. Includes built-in analytics, multi-branch management, custom domains, inventory management, order management, multi-branch POS, and 24/7 WhatsApp support. A product by engineersTech.',
  'Bangladesh-focused e-commerce platform — launch your store in 10 minutes, bKash/Nagad pre-integrated, mobile-first PWA, bilingual Bangla+English. 500+ active stores, ৳10Cr+ orders processed.',
  'https://etommerce.com',
  'support@etommerce.com',
  '+88 01314 44 33 11',
  'Dhaka', 'Bangladesh',
  'c0000001-0000-0000-0000-000000000005',
  '["e-commerce","online store","shopify alternative","bangladesh","bkash","nagad","sslcommerz","mobile commerce","PWA","bilingual","bangla","SaaS","retail tech","digital commerce"]',
  '["E-Commerce Store Builder","Mobile-First PWA Storefront","bKash Integration","Nagad Integration","SSLCommerz Integration","Cash on Delivery","Bangla Language Support","Built-in Analytics","Branch Management","Custom Domain","Staff Accounts","Product Management","Order Management","Inventory Management","Multi-branch POS","24/7 WhatsApp Support"]',
  '{"facebook":"https://facebook.com/etommerce","website":"https://etommerce.com"}',
  '{"monday":"9:00 AM \u2013 6:00 PM","tuesday":"9:00 AM \u2013 6:00 PM","wednesday":"9:00 AM \u2013 6:00 PM","thursday":"9:00 AM \u2013 6:00 PM","friday":"9:00 AM \u2013 6:00 PM","saturday":"Closed","sunday":"Closed"}',
  4.8, 23,
  1, 1, 1,
  'pro', 'approved', 1,
  94.0,
  'https://etommerce.com/logo.png'
)
ON DUPLICATE KEY UPDATE
  name               = VALUES(name),
  description        = VALUES(description),
  short_description  = VALUES(short_description),
  website            = VALUES(website),
  email              = VALUES(email),
  phone              = VALUES(phone),
  city               = VALUES(city),
  country            = VALUES(country),
  category_id        = VALUES(category_id),
  tags               = VALUES(tags),
  services           = VALUES(services),
  social_links       = VALUES(social_links),
  business_hours     = VALUES(business_hours),
  rating             = VALUES(rating),
  review_count       = VALUES(review_count),
  is_verified        = VALUES(is_verified),
  is_featured        = VALUES(is_featured),
  is_active          = VALUES(is_active),
  tier               = VALUES(tier),
  status             = VALUES(status),
  ai_listing_enabled = VALUES(ai_listing_enabled),
  geo_score          = VALUES(geo_score),
  logo_url           = VALUES(logo_url);

-- ────────────────────────────────────────────────────────────────────────────
-- Business 3: GlowUp  (https://glowupbd.app)  — product by engineersTech
-- Category  : beauty-wellness
-- Tier      : pro  |  Rating: 4.7  |  Reviews: 18
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO businesses (
  id, owner_id,
  name, slug,
  description, short_description,
  website, email, phone,
  city, country, category_id,
  tags, services, social_links, business_hours,
  rating, review_count,
  is_verified, is_featured, is_active,
  tier, status, ai_listing_enabled,
  geo_score, logo_url
) VALUES (
  'b0000001-0000-0000-0000-000000000003',
  'u0000001-0000-0000-0000-000000000001',
  'GlowUp',
  'glowup',
  'GlowUp is Bangladesh''s leading beauty and wellness booking platform, developed by engineersTech. Customers can discover top-rated salons, spas, beauty clinics, massage therapists, makeup artists, and skincare specialists, then book appointments instantly — 24 hours a day, 7 days a week. For beauty professionals and salon owners, GlowUp provides a complete business management suite: appointment scheduling, staff management, integrated payment processing, customer reviews, business analytics, and marketing tools to grow their client base. GlowUp removes phone-tag and no-shows by keeping clients informed with automated reminders and real-time availability updates.',
  'Beauty & wellness booking platform for Bangladesh — discover salons, spas & clinics, book instantly. Full business suite for beauty professionals: scheduling, staff, payments & analytics.',
  'https://glowupbd.app',
  'hello@glowupbd.app',
  '+88 01314 44 33 11',
  'Dhaka', 'Bangladesh',
  'c0000001-0000-0000-0000-000000000009',
  '["beauty","wellness","salon","spa","booking","appointments","hair","makeup","skincare","massage","beauty tech","Bangladesh","beauty platform"]',
  '["Beauty Booking Platform","Salon Appointment Booking","Spa Booking","Hair Salon Discovery","Makeup Artist Booking","Skincare Clinic Booking","Massage Therapy Booking","Wellness Centre Booking","Appointment Scheduling","Staff Management","Payment Processing","Customer Reviews","Business Analytics","Marketing Tools","Beauty Professional Listings","Automated Reminders"]',
  '{"facebook":"https://facebook.com/glowupbd","website":"https://glowupbd.app"}',
  '{"monday":"24/7","tuesday":"24/7","wednesday":"24/7","thursday":"24/7","friday":"24/7","saturday":"24/7","sunday":"24/7"}',
  4.7, 18,
  1, 1, 1,
  'pro', 'approved', 1,
  91.0,
  'https://glowupbd.app/logo.png'
)
ON DUPLICATE KEY UPDATE
  name               = VALUES(name),
  description        = VALUES(description),
  short_description  = VALUES(short_description),
  website            = VALUES(website),
  email              = VALUES(email),
  phone              = VALUES(phone),
  city               = VALUES(city),
  country            = VALUES(country),
  category_id        = VALUES(category_id),
  tags               = VALUES(tags),
  services           = VALUES(services),
  social_links       = VALUES(social_links),
  business_hours     = VALUES(business_hours),
  rating             = VALUES(rating),
  review_count       = VALUES(review_count),
  is_verified        = VALUES(is_verified),
  is_featured        = VALUES(is_featured),
  is_active          = VALUES(is_active),
  tier               = VALUES(tier),
  status             = VALUES(status),
  ai_listing_enabled = VALUES(ai_listing_enabled),
  geo_score          = VALUES(geo_score),
  logo_url           = VALUES(logo_url);

-- ── 4. REVIEWS (7 total, status = approved) ──────────────────────────────────
-- 3 reviews for engineersTech, 2 for eTommerce, 2 for GlowUp

INSERT INTO reviews (id, business_id, author_id, rating, title, body, status) VALUES

  -- engineersTech reviews
  ('rv000001-0000-0000-0000-000000000001',
   'b0000001-0000-0000-0000-000000000001', NULL, 5,
   'Exceptional engineering team',
   'engineersTech built our entire SaaS platform from scratch. Delivered on time, with outstanding code quality and proactive communication throughout the project. Their team handled everything from architecture to deployment. Highly recommended for any serious tech project.',
   'approved'),

  ('rv000001-0000-0000-0000-000000000002',
   'b0000001-0000-0000-0000-000000000001', NULL, 5,
   'Best tech partner in Bangladesh',
   'We engaged engineersTech for AI integration into our existing fintech product. The ML models they built improved our transaction accuracy by 40%. Very professional, transparent, and technically strong team. Would hire again without hesitation.',
   'approved'),

  ('rv000001-0000-0000-0000-000000000003',
   'b0000001-0000-0000-0000-000000000001', NULL, 5,
   'Staff augmentation saved our deadline',
   'We needed 3 senior engineers fast. engineersTech onboarded them within days — zero management overhead from our side. They integrated seamlessly with our existing team. The quality of work was excellent. Will use their staff augmentation service again.',
   'approved'),

  -- eTommerce reviews
  ('rv000001-0000-0000-0000-000000000004',
   'b0000001-0000-0000-0000-000000000002', NULL, 5,
   'Launched my store in 8 minutes!',
   'I was genuinely skeptical about the "10 minutes" claim, but it really happened. My product catalogue was up, bKash was already configured, and my first order came in the same day. The Bangla interface is clean and my customers love it.',
   'approved'),

  ('rv000001-0000-0000-0000-000000000005',
   'b0000001-0000-0000-0000-000000000002', NULL, 5,
   'The real Shopify alternative for Bangladesh',
   'Shopify was too expensive and the local payment integrations were a nightmare to set up. eTommerce has bKash, Nagad and Cash on Delivery built-in at a fraction of the cost. The branch management feature alone is worth it for my multi-outlet business.',
   'approved'),

  -- GlowUp reviews
  ('rv000001-0000-0000-0000-000000000006',
   'b0000001-0000-0000-0000-000000000003', NULL, 5,
   'Revolutionised our salon bookings',
   'Since we listed on GlowUp, our no-show rate dropped by 60% thanks to automated reminders. Clients can book at midnight and we wake up to confirmed appointments. The analytics dashboard shows us our busiest hours so we can staff better. Excellent platform.',
   'approved'),

  ('rv000001-0000-0000-0000-000000000007',
   'b0000001-0000-0000-0000-000000000003', NULL, 4,
   'Easy way to discover beauty services',
   'Found an excellent skincare clinic through GlowUp that I never knew existed in my area. The booking was instant, the confirmation and reminders worked perfectly, and the whole experience was smooth. Minor suggestion: add more filter options for location.',
   'approved')

ON DUPLICATE KEY UPDATE
  rating = VALUES(rating),
  title  = VALUES(title),
  body   = VALUES(body),
  status = VALUES(status);

-- ── 5. RECALCULATE RATINGS FROM SEEDED REVIEWS ───────────────────────────────
UPDATE businesses b
SET
  rating       = (
    SELECT ROUND(AVG(r.rating), 1)
    FROM   reviews r
    WHERE  r.business_id = b.id
      AND  r.status      = 'approved'
  ),
  review_count = (
    SELECT COUNT(*)
    FROM   reviews r
    WHERE  r.business_id = b.id
      AND  r.status      = 'approved'
  )
WHERE b.id IN (
  'b0000001-0000-0000-0000-000000000001',
  'b0000001-0000-0000-0000-000000000002',
  'b0000001-0000-0000-0000-000000000003'
);

-- ── 6. DEFAULT PRICING TIERS ─────────────────────────────────────────────────
INSERT INTO pricing_tiers (id, name, slug, price, currency, period, features, is_active, sort_order) VALUES
  ('p0000001-0000-0000-0000-000000000001', 'Free',       'free',       0.00,    'BDT', 'monthly',
   '["Basic listing","AI indexing","1 category","Community support"]',                                                                               1, 1),
  ('p0000001-0000-0000-0000-000000000002', 'Pro',        'pro',        2900.00, 'BDT', 'monthly',
   '["Featured listing","Priority AI ranking","3 categories","Analytics dashboard","API access","Email support"]',                                   1, 2),
  ('p0000001-0000-0000-0000-000000000003', 'Enterprise', 'enterprise', 9900.00, 'BDT', 'monthly',
   '["Premium placement","Custom AI training","Unlimited categories","Dedicated account manager","Custom integrations","24/7 priority support"]',    1, 3)
ON DUPLICATE KEY UPDATE
  name       = VALUES(name),
  price      = VALUES(price),
  features   = VALUES(features),
  sort_order = VALUES(sort_order);

-- ── 7. PLATFORM SETTINGS ─────────────────────────────────────────────────────
INSERT INTO platform_settings (`key`, value) VALUES
  ('brand',    '{"primaryColor":"#0A55F8","secondaryColor":"#8B5CF6","accentColor":"F59E0B","logoUrl":"","faviconUrl":"","companyName":"engineersTech"}'),
  ('homepage', '{"heroTitle":"The Business Directory Built for the AI Era","heroSubtitle":"Get discovered by AI, not just search. GEO-optimized listings for ChatGPT, Claude, Gemini & more.","featuredTitle":"Featured Businesses","categoriesTitle":"Browse Categories","statsTitle":"Global Reach"}')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- ── 8. DEFAULT MCP CONFIG ────────────────────────────────────────────────────
INSERT INTO mcp_config (id, server_name, api_token, enabled, allow_write, rate_limit) VALUES
  ('m0000001-0000-0000-0000-000000000001',
   'engineersTech MCP',
   'et-mcp-change-after-first-login-a3f9b2c7d1e4',
   1, 0, 60)
ON DUPLICATE KEY UPDATE server_name = VALUES(server_name);

-- ============================================================
-- END OF SEED
-- ============================================================
