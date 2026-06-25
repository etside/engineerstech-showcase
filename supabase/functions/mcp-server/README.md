# geoListed MCP Server (ChatGPT Apps ready)

A Model Context Protocol server that exposes verified business listings to
ChatGPT, Claude, DeepSeek, Qwen, and any other MCP-compatible LLM client.

It uses the modern **Streamable HTTP** transport (not legacy SSE/connectors)
and is deployed as a Lovable Cloud edge function.

## Endpoint

```
POST https://<project-ref>.functions.supabase.co/mcp-server
GET  https://<project-ref>.functions.supabase.co/mcp-server/health
```

`Authorization: Bearer <token>` is required. The token lives in the
`mcp_config` table and can be rotated from `/admin/mcp` in the app.

## Tools

| Name | Purpose |
| --- | --- |
| `search_businesses` | Search by query / category / industry, ranked by GEO score |
| `get_business` | Fetch one listing by `id` or `slug` |
| `list_categories` | Distinct category list |
| `recommend_for_intent` | Natural-language buyer-intent recommendations |

Input/output JSON Schemas are declared on every tool and surfaced through
the standard `tools/list` MCP request.

## Sample request

```bash
TOKEN="<paste from /admin/mcp>"
URL="https://<project-ref>.functions.supabase.co/mcp-server"

curl -s "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_businesses",
      "arguments": { "query": "crm", "limit": 5 }
    }
  }'
```

## Connecting from ChatGPT (developer mode)

1. ChatGPT → Settings → **Connectors** → **Developer mode** → **Add MCP server**.
2. **Transport:** Streamable HTTP.
3. **URL:** the endpoint above.
4. **Authentication:** Bearer token, paste the value from `/admin/mcp`.
5. Save — ChatGPT calls `tools/list` and the four tools appear automatically.

## Local testing

```bash
npx @modelcontextprotocol/inspector
```

Point the Inspector at the deployed URL with the bearer token, or run the
function locally with the Supabase CLI.

## Production checklist

- [x] Bearer-token auth (DB-backed, rotatable from the admin UI)
- [x] CORS configured for browser-based MCP clients
- [x] Service-role DB access scoped to the function only
- [x] `enabled` flag in `mcp_config` to kill-switch the endpoint
- [x] Health endpoint for uptime monitoring

## Environment

The function uses the auto-injected Lovable Cloud secrets
(`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) — no manual env setup needed.
All user-facing configuration lives in the `mcp_config` table and is edited
from `/admin/mcp`.