# engineersTech Showcase

> The AI-era business directory — GEO-optimised listings that get discovered by ChatGPT, Claude, Cursor, WeChat AI, and any MCP-connected client.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Public Pages](#public-pages)
5. [Vendor Flow](#vendor-flow)
6. [Admin Flow & CMS Panel](#admin-flow--cms-panel)
7. [MCP Server — AI Integration](#mcp-server--ai-integration)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Environment Variables](#environment-variables)

---

## Project Overview

engineersTech is a full-stack business directory SaaS built on:
- **React + TypeScript + Vite** frontend (this repo)
- **PHP 8 + MySQL** backend (`/api/` folder)
- **MCP (Model Context Protocol) server** exposing listings to AI tools

Businesses pay for Pro/Featured/Enterprise plans to get their listing included in the AI index. Admin can also manually promote any listing regardless of payment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Routing | React Router v6 |
| State | React useState/useEffect + TanStack Query |
| i18n | i18next (English + Bengali) |
| Backend | PHP 8, MySQL (cPanel shared hosting) |
| Auth | JWT (PHP-issued) + cookie sessions |
| Payments | SSLCommerz |
| AI/MCP | MCP spec 2025-11-25, OAuth 2.1 + PKCE |

---

## Project Structure

```
engineerstech-showcase/
├── src/
│   ├── pages/           # All route pages
│   │   ├── Home.tsx              # Public homepage
│   │   ├── Listings.tsx          # Business directory
│   │   ├── BusinessProfile.tsx   # Single business page
│   │   ├── Categories.tsx        # Category list
│   │   ├── CategoryDetail.tsx    # Category → listings
│   │   ├── Auth.tsx              # Login / Register
│   │   ├── Submit.tsx            # Vendor: submit listing
│   │   ├── Dashboard.tsx         # Vendor dashboard
│   │   ├── Pricing.tsx           # Plan selection + payment
│   │   ├── Admin.tsx             # Admin CMS (all tabs)
│   │   ├── AdminMCP.tsx          # MCP server CMS
│   │   ├── SuperAdmin.tsx        # Super admin user management
│   │   ├── Blog.tsx / BlogPost.tsx
│   │   ├── About.tsx, HowItWorks.tsx, ForVendors.tsx
│   │   ├── ApiDocs.tsx           # Public API documentation
│   │   ├── AiDiscover.tsx        # AI discovery showcase
│   │   ├── Leaderboards.tsx      # GEO score leaderboard
│   │   └── ...
│   ├── components/
│   │   ├── Navbar.tsx            # Top navigation
│   │   ├── Footer.tsx            # Site footer
│   │   ├── BrandingEditor.tsx    # Admin: logo/brand CMS
│   │   ├── HomepageEditor.tsx    # Admin: homepage text CMS
│   │   ├── ReviewsModerationUI.tsx
│   │   ├── VerificationPanel.tsx
│   │   ├── OnboardingStepper.tsx
│   │   └── ui/                  # shadcn/ui primitives
│   ├── lib/
│   │   ├── api.ts               # All API calls
│   │   └── use-auth.ts          # Auth hook
│   └── App.tsx                  # Router + all routes
├── api/
│   ├── index.php                # API router
│   ├── config.php               # DB, JWT, helpers
│   ├── auth.php                 # Login/register/me
│   ├── businesses.php           # CRUD listings
│   ├── admin.php                # Admin endpoints + AI listing toggle
│   ├── mcp-server.php           # MCP JSON-RPC 2.0 server
│   ├── oauth.php                # OAuth 2.1 authorization server
│   ├── reviews.php
│   ├── categories.php
│   ├── blog.php
│   ├── pricing.php
│   ├── contact.php
│   ├── newsletter.php
│   ├── feed.php                 # Public LLM feed (JSON-LD + llms.txt)
│   ├── upload.php
│   ├── schema.sql               # Full DB schema + seed data
│   └── config.env               # DB credentials (gitignored)
```

---

## Public Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, featured listings, stats, how-it-works |
| `/listings` | Listings | Full searchable directory |
| `/business/:slug` | BusinessProfile | Single listing with reviews |
| `/categories` | Categories | Browse by category |
| `/categories/:slug` | CategoryDetail | Listings in a category |
| `/ai-discover` | AiDiscover | How AI discovers businesses |
| `/leaderboards` | Leaderboards | GEO score rankings |
| `/blog` | Blog | Articles |
| `/blog/:slug` | BlogPost | Single article |
| `/for-vendors` | ForVendors | Why list with us |
| `/how-it-works` | HowItWorks | Step-by-step guide |
| `/pricing` | Pricing | Plans + payment |
| `/api-docs` | ApiDocs | Public REST API docs |
| `/resources` | Resources | Tools + downloads |
| `/contact` | Contact | Contact form |
| `/faq` | FAQ | Frequently asked questions |
| `/about` | About | Company info |
| `/privacy` | Privacy | Privacy policy |
| `/terms` | Terms | Terms of service |
| `/auth` | Auth | Login / Register |

---

## Vendor Flow

### Step 1 — Register
Go to `/auth` → create account.

### Step 2 — Submit a listing
Go to `/submit`. Fill in:
- **Business name** (required)
- **Tagline** / short description
- **Website**, **Contact email**, **Phone**
- **Location** (city / address)
- **Category** (dropdown from DB)
- **Industry**, **Services** (comma-separated)
- **Full description** (textarea)
- **Founded year**, **Employee count**, **Hourly rate**, **Min project size**
- **Social links** (LinkedIn, Twitter, GitHub)
- **Ownership evidence** (required for verification)

Click **Continue to payment** → listing saved as `pending`.

### Step 3 — Choose a plan
Redirected to `/pricing`. Plans:

| Plan | Price | AI Listing |
|---|---|---|
| Free | BDT 0 | ❌ Not in AI index |
| Pro | BDT 2,900/mo | ✅ Auto-added to AI index |
| Featured | BDT 4,900/mo | ✅ Priority AI ranking |
| Enterprise | BDT 9,900/mo | ✅ Top AI placement |

### Step 4 — Payment
SSLCommerz payment gateway. On success → subscription active.

### Step 5 — Admin verification
Admin reviews evidence and approves. Listing goes live. AI listing enabled automatically for paid tiers.

### Vendor Dashboard (`/dashboard`)
- **Onboarding progress** — submitted → paid → verified → live
- **AI index status** — shows whether the business is in the MCP AI index and how (paid / admin promoted)
- **GEO score** — AI discoverability score
- **Actions** — View listing, Refresh AI summary, Upgrade plan
- **Upgrade prompts** — clear CTA for free-tier businesses explaining AI listing benefits

---

## Admin Flow & CMS Panel

Navigate to `/admin` (requires `admin` or `super_admin` role).

### Admin CMS Tabs

| Tab | What you can do |
|---|---|
| **Overview** | Stats: total listings, pending claims, reviews, subscribers |
| **Listings** | Approve/reject listings, change tier, verify businesses |
| **AI Listings** | Toggle which businesses appear in the MCP AI index. Auto-enabled for paid tiers; admin can override any business |
| **Claims** | Review ownership claims — approve/reject/request more docs |
| **Reviews** | Moderate user reviews — approve/reject |
| **Blog** | Create, edit, publish, delete blog posts |
| **Content** | Edit per-page text blocks (key-value CMS) |
| **Homepage CMS** | Edit all homepage sections: Hero text, Stats, AI Features, Featured section, How It Works, Reviews section, CTA |
| **Branding** | Upload logo, favicon, OG image; edit site name, tagline, meta description, colors, fonts, social handles |
| **Categories** | Create, edit, delete business categories |
| **Pricing** | Edit plan names, prices (USD + BDT), toggle active/inactive |
| **Messages** | Read contact form submissions |
| **Settings** | Platform-wide key-value settings |

### MCP Server Admin (`/admin/mcp`)

| Tab | What you can do |
|---|---|
| **Token & Settings** | View/copy server URL and bearer token, rotate token, toggle server on/off, allow write tools, set rate limit, test connection |
| **Connect Clients** | Ready-to-paste config snippets for ChatGPT, Claude Desktop, VS Code/Copilot, Cursor/Windsurf, WeChat Mini Program, custom cURL |
| **AI Listings** | Same AI listing manager as in the main Admin panel |
| **Tools** | Toggle which MCP tools are exposed (search_businesses, get_business, list_categories, recommend_for_intent, submit_business, write_review) |
| **OAuth Clients** | Register OAuth 2.1 clients for ChatGPT/etc., copy client_id, delete clients |
| **Analytics** | Call counts by tool, by client, daily bar chart |

### Super Admin (`/super-admin`)
Manage user roles (grant/revoke admin, super_admin, vendor roles).

---

## MCP Server — AI Integration

### Endpoint
```
POST https://yourdomain.com/api/mcp-server
```
Protocol: JSON-RPC 2.0, MCP spec 2025-11-25 (Streamable HTTP transport)

### Authentication

**Option A — Bearer token** (Claude Desktop, VS Code, Cursor, Windsurf, cURL):
```
Authorization: Bearer <token>
```
Get token from Admin → MCP Server → Token & Settings.

**Option B — OAuth 2.1 + PKCE** (ChatGPT Apps — required):
```
Authorization server: https://yourdomain.com/api/oauth
Discovery: https://yourdomain.com/api/.well-known/oauth-authorization-server
```
Register client: `POST /api/oauth/register`

### Available Tools

| Tool | Access | Description |
|---|---|---|
| `search_businesses` | read | Full-text search with category/city/country/verified filters |
| `get_business` | read | Full listing + reviews by id or slug |
| `list_categories` | read | All categories with counts |
| `recommend_for_intent` | read | Natural-language intent → ranked businesses |
| `submit_business` | write (opt-in) | Submit a new listing |
| `write_review` | write (opt-in) | Post a review |

> **Only businesses with `ai_listing_enabled = true` appear in search/recommend results.**

### Client Setup Guides

#### ChatGPT Apps
1. Settings → Beta Features → Developer Mode ON
2. Connectors → Add → Remote MCP
3. Server URL: `https://yourdomain.com/api/mcp-server`
4. Auth: OAuth 2.1 (PKCE)
5. Register client at `POST /api/oauth/register` with `redirect_uris` set to ChatGPT callback

#### Claude Desktop
Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "engineerstech": {
      "type": "http",
      "url": "https://yourdomain.com/api/mcp-server",
      "headers": { "Authorization": "Bearer <your-token>" }
    }
  }
}
```

#### VS Code / GitHub Copilot
Add to `.vscode/mcp.json`:
```json
{
  "servers": {
    "engineerstech": {
      "type": "http",
      "url": "https://yourdomain.com/api/mcp-server",
      "headers": { "Authorization": "Bearer <your-token>" }
    }
  }
}
```

#### Cursor / Windsurf
- Cursor: `~/.cursor/mcp.json`
- Windsurf: `~/.codeium/windsurf/mcp_config.json`
```json
{
  "mcpServers": {
    "engineerstech": {
      "url": "https://yourdomain.com/api/mcp-server",
      "headers": { "Authorization": "Bearer <your-token>" }
    }
  }
}
```

#### WeChat Mini Program
Deploy a Cloud Function proxy:
```js
// cloudfunctions/mcp-proxy/index.js
const fetch = require('node-fetch');
exports.main = async (event) => {
  const res = await fetch('https://yourdomain.com/api/mcp-server', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+process.env.MCP_TOKEN },
    body: JSON.stringify({ jsonrpc:'2.0', id:1, method:'tools/call',
      params: { name: event.tool, arguments: event.arguments } }),
  });
  return res.json();
};
```

---

## Database Schema

Key tables (see `api/schema.sql` for full DDL):

| Table | Purpose |
|---|---|
| `users` | Accounts |
| `user_roles` | admin / super_admin / vendor |
| `businesses` | Listings (includes `ai_listing_enabled`, `tier`, `geo_score`) |
| `categories` | Business categories |
| `reviews` | User reviews |
| `business_claims` | Ownership claim requests |
| `subscriptions` | Active billing subscriptions |
| `api_keys` | Per-business API keys |
| `mcp_config` | MCP server settings + bearer token |
| `mcp_oauth_clients` | OAuth 2.1 registered clients |
| `mcp_oauth_codes` | Auth codes (PKCE) |
| `mcp_oauth_tokens` | Access + refresh tokens |
| `mcp_call_log` | Tool call analytics |
| `platform_settings` | Key-value CMS settings |
| `blog_posts` | Blog articles |
| `contact_messages` | Contact form submissions |
| `newsletter_subscribers` | Email list |

---

## Deployment

### cPanel (shared hosting)

1. Upload the `dist/` folder (after `bun run build`) to `public_html/`
2. Upload the `api/` folder to `public_html/api/`
3. Create MySQL database in cPanel, run `api/schema.sql`
4. Edit `api/config.env` with your DB credentials and JWT secret
5. Set `.htaccess` to route all frontend requests to `index.html`

### Local development

```bash
bun install
bun run dev       # Frontend on :5173
# Backend: run PHP built-in server or use XAMPP/MAMP
php -S localhost:8080 api/index.php
```

---

## Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=/api
```

### Backend (`api/config.env`)
```ini
DB_HOST=localhost
DB_NAME=engineerstech
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=change-this-to-a-long-random-string
```

---

## Default Admin Account

After running `schema.sql`, update the admin password:
```sql
UPDATE users
SET password_hash = '$2y$10$...'  -- bcrypt hash of your password
WHERE email = 'tjms.kp@gmail.com';
```

Or use the `/auth` page to register, then grant admin role via SuperAdmin panel.

---

## License

Private — all rights reserved.
