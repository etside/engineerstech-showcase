# engineersTech — AI-Ready Business Directory

The business directory built for the LLM era. Get discovered by AI, not just search.

## Features

- **AI Discovery** — GEO-optimized listings for ChatGPT, Claude, DeepSeek, Qwen
- **Business Directory** — Browse verified tech businesses with ratings, reviews, and GEO scores
- **MCP Server** — Model Context Protocol integration for ChatGPT Apps and Claude
- **Business Dashboard** — Manage listings, track analytics, respond to reviews
- **Admin CMS** — Full content management for listings, categories, blog, and platform settings
- **Payment Integration** — SSLCommerz payment gateway for subscription plans
- **Review System** — Moderated reviews with AI sentiment analysis

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions + Storage)
- **Payments:** SSLCommerz
- **Deployment:** Netlify

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_URL=your_supabase_url
```

## Deployment

### Netlify (Recommended)

1. Connect your GitHub repo to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy

### Manual

```bash
bun run build
# Upload dist/ folder to your hosting provider
```

## Database Setup

Run all migrations in order via Supabase SQL Editor:

```bash
# See supabase/migrations/ for all migration files
# Key migrations:
# - 20260627212739: Super admin role for kptjms991@gmail.com
# - 20260701000000: Fix super_admin RLS policy
```

## MCP Server

The MCP server runs as a Supabase Edge Function. Deploy with:

```bash
supabase functions deploy mcp-server
```

Then configure the API token via `/admin/mcp` in the app.

## Project Structure

```
src/
  components/     # Reusable UI components
  pages/          # Route components
  hooks/          # Custom React hooks
  integrations/   # Supabase client and types
  i18n/           # Internationalization (en, bn)
  data/           # Mock data and constants
supabase/
  migrations/     # Database migrations
  functions/      # Edge functions (MCP server, payments, etc.)
```

## License

MIT
