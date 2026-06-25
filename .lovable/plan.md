# GEO Listing Platform — Build Plan

A full replacement of the current engineersTech site with a Clutch/G2-style business listing platform optimized for AI/LLM discovery (GEO). Dark by default with a light toggle, Lovable Cloud backend, AI features, and admin CMS.

Because the scope is large, this ships in **4 phases**. Each phase is independently reviewable so you can course-correct without throwing away work.

---

## Phase 1 — Foundation (this build)

**Goal:** Working dark/light design system, navigation shell, marketing surface, and database scaffolding. No reviews/AI/CMS yet.

### Design system

- New `index.css` tokens from spec: `--bg #050d1a`, `--bg-2 #071526`, `--blue #0058cc`, `--blue-end #2483ff`, `--blue-light #60aaff`, `--text #eef3ff`, `--muted #8da4c0`.
- Light-mode mirror tokens for the toggle. `next-themes`-style provider on `<html>`.
- Fonts via `@fontsource/dm-sans` (display) + `@fontsource/inter` (body), imported in `main.tsx`.
- Utility classes: `.gradient-text`, `.glass-card`, `.btn-gradient`, fluid `clamp()` typography.
- Easing token `cubic-bezier(0.16, 1, 0.3, 1)` standardized in Tailwind config.

### Pages (routed via React Router)

- `/` Homepage — hero, animated badge, trust marquee, services overview, AI Discovery value prop, JSON-LD `Organization` schema.
- `/listings` — filter/search UI, category chips, listing grid (mock data, ready for DB swap).
- `/business/:slug` — full profile shell (About, Services, Portfolio, Reviews stub, Contact). JSON-LD `LocalBusiness` schema.
- `/about`, `/services`, `/pricing`, `/contact`, `/faq`, `/privacy`, `/terms` — static marketing pages.
- `/auth` — sign in / sign up (Lovable Cloud email/password + Google).
- `404` — themed not-found.

### Backend setup (Lovable Cloud)

- Enable Cloud. Tables created in this phase:
  - `businesses` (id, slug, name, logo_url, tagline, description, category, industry, services[], website, location, owner_id, is_verified, geo_score, created_at)
  - `profiles` (id → auth.users, full_name, avatar_url, role)
  - `user_roles` (id, user_id, role) — `app_role` enum: `admin`, `business_owner`, `user`. Plus `has_role()` security-definer function per security guidance.
- RLS + GRANTs on all public tables. Public read on `businesses`; insert/update gated by ownership + role.

**Deliverable:** Browsable site, working theme toggle, auth flow, businesses table populated from a seed migration.

---

## Phase 2 — Listings + Reviews (next chat)

- `reviews` table (rating 1–5, title, body, status, sentiment_summary, reviewer_id, business_id) with RLS.
- Star rating component, review submission form (auth-gated), moderation status.
- Filters wired to DB: category, industry, rating, location.
- Real listing detail page driven by `businesses` + `reviews`.
- "AI-Ready" badge surfaced from `geo_score` field.

---

## Phase 3 — AI & GEO features (next chat)

- Edge function `ai-chat` — conversational discovery using Lovable AI Gateway (`google/gemini-3-flash-preview`), AI Elements composer.
- Edge function `summarize-reviews` — pros/cons + sentiment for a business; cached to `businesses.ai_summary`.
- Edge function `geo-api` — public JSON-LD endpoint at `/functions/v1/geo-api` returning structured business data for LLM ingestion.
- `/ai-discovery` page — embedded chatbot + "How LLMs see your business" explainer.
- Vendor analytics stub on owner dashboard.

---

## Phase 4 — Admin CMS + extras (next chat)

- `/admin` (admin-only, gated by `has_role(uid, 'admin')`) — manage listings, reviews moderation, blog, team, testimonials, services, messages, settings.
- Blog (`posts` table), Team, Testimonials, Case Studies, Career, Data Protection pages.
- Vendor dashboard at `/dashboard` — business owner edits their own listing, sees mention metrics.

---

## Technical details (Phase 1 only)

```text
src/
├── main.tsx                 # font imports, theme provider
├── App.tsx                  # router + layout
├── index.css                # new GEO design tokens (dark + light)
├── layouts/
│   └── SiteLayout.tsx       # nav + footer wrapper
├── components/
│   ├── ThemeToggle.tsx
│   ├── Navbar.tsx           # rebuilt
│   ├── Footer.tsx           # rebuilt
│   ├── BusinessCard.tsx
│   ├── GradientButton.tsx
│   ├── GlassCard.tsx
│   ├── TrustMarquee.tsx
│   └── JsonLd.tsx           # injects structured data
├── pages/
│   ├── Home.tsx
│   ├── Listings.tsx
│   ├── BusinessProfile.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── Pricing.tsx
│   ├── Contact.tsx
│   ├── FAQ.tsx
│   ├── Privacy.tsx
│   ├── Terms.tsx
│   ├── Auth.tsx
│   └── NotFound.tsx
├── data/
│   └── mockBusinesses.ts    # seed data (also inserted via migration)
├── lib/
│   ├── supabase.ts          # client
│   └── theme.ts
└── integrations/...         # auto-generated by Cloud
```

### Out of scope for Phase 1 (explicit)

- Reviews UI/logic — Phase 2
- AI chatbot, sentiment, LLM API — Phase 3
- Admin CMS, blog, team, dashboard, multi-lingual — Phase 4
- Existing engineersTech-specific assets (logo, brochure, products data) — removed

### What gets deleted

All current engineersTech components, sections, assets (`hero-bg.jpg`, `et-logo-white.png`), `data/projects.ts`, `lib/pdfGenerator.ts`, brochure download flow.

---

Generate all in parallel