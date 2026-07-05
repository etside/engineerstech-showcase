<?php
/**
 * MCP Server — JSON-RPC 2.0 over Streamable HTTP
 * Spec: 2025-11-25  (https://modelcontextprotocol.io/specification/2025-11-25)
 *
 * Supports:
 *   - Streamable HTTP (POST /api/mcp-server)
 *   - GET  /api/mcp-server/health
 *   - Bearer-token auth  (Authorization: Bearer <token>)
 *   - OAuth 2.1 JWT access tokens (issued by api/oauth.php)
 *
 * Tools exposed:
 *   search_businesses, service_search, get_business, list_categories,
 *   recommend_for_intent, submit_business, write_review
 */

require_once __DIR__ . '/config.php';

// ── CORS headers on every response ──────────────────────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, MCP-Protocol-Version');

// ── Handle OPTIONS preflight immediately ────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Sub-path routing ────────────────────────────────────────────────────────
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($requestUri, PHP_URL_PATH);
$path = preg_replace('#^/api/mcp-server#', '', $path);
$path = rtrim($path ?: '/', '/') ?: '/';

if ($path === '/health' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    mcp_health();
}

// ── MCP protocol version header ─────────────────────────────────────────────
header('MCP-Protocol-Version: 2025-11-25');

// ── GET / — discovery/info response ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $path === '/') {
    $db  = getDB();
    $cfg = mcp_get_config($db);
    header('Content-Type: application/json');
    echo json_encode([
        'server'     => $cfg['server_name'] ?? 'engineersTech MCP',
        'version'    => '2025-11-25',
        'transport'  => 'streamable-http',
        'tools'      => [
            'search_businesses',
            'service_search',
            'get_business',
            'list_categories',
            'recommend_for_intent',
            'submit_business',
            'write_review',
        ],
        'auth'       => [
            'bearer'      => true,
            'oauth2_pkce' => true,
        ],
        'well_known' => mcp_base_url() . '/.well-known/oauth-authorization-server',
    ]);
    exit;
}

// ── Block unsupported methods (PUT, DELETE, PATCH, etc.) ────────────────────
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST', 'OPTIONS'], true)) {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Method Not Allowed — use POST, GET, or OPTIONS']);
    exit;
}

// ── Only POST proceeds to JSON-RPC dispatch ──────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'No route matched for this GET path']);
    exit;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
$mcpContext = mcp_authenticate();

// ── Parse JSON-RPC body ──────────────────────────────────────────────────────
$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    mcp_rpc_error(null, -32700, 'Parse error');
}

// Batch requests
if (isset($body[0])) {
    $responses = [];
    foreach ($body as $req) {
        $resp = mcp_dispatch($req, $mcpContext);
        if ($resp !== null) $responses[] = $resp;
    }
    header('Content-Type: application/json');
    echo json_encode($responses ?: new stdClass());
    exit;
}

// Single request
$resp = mcp_dispatch($body, $mcpContext);
header('Content-Type: application/json');
echo json_encode($resp ?? new stdClass());
exit;

// ============================================================
// Health endpoint
// ============================================================
function mcp_health() {
    $db = getDB();
    $cfg = mcp_get_config($db);
    header('Content-Type: application/json');
    echo json_encode([
        'status'       => 'ok',
        'server'       => $cfg['server_name'] ?? 'engineersTech MCP',
        'version'      => '2025-11-25',
        'transport'    => 'streamable-http',
        'oauth_issuer' => rtrim(mcp_base_url(), '/') . '/api/oauth',
    ]);
    exit;
}

// ============================================================
// Authentication
// ============================================================
function mcp_authenticate(): array {
    $db  = getDB();
    $cfg = mcp_get_config($db);

    if (!($cfg['enabled'] ?? true)) {
        http_response_code(503);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'MCP server is disabled']);
        exit;
    }

    // Extract bearer token
    $auth  = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = null;
    if (preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
        $token = trim($m[1]);
    }
    if (!$token && isset($_GET['token'])) {
        $token = trim($_GET['token']);
    }

    if (!$token) {
        http_response_code(401);
        header('Content-Type: application/json');
        $base = mcp_base_url();
        header('WWW-Authenticate: Bearer realm="engineersTech MCP",'
            . ' resource_metadata="' . $base . '/.well-known/oauth-protected-resource"');
        echo json_encode(['error' => 'Bearer token required']);
        exit;
    }

    // 1. Try as static API token (admin-issued)
    if ($cfg['api_token'] && hash_equals($cfg['api_token'], $token)) {
        return [
            'type'        => 'static',
            'allow_write' => (bool)($cfg['allow_write'] ?? false),
            'scopes'      => ['mcp:read', 'mcp:write'],
            'client_id'   => 'admin',
        ];
    }

    // 2. Try as OAuth2.1 JWT access token
    $payload = mcp_verify_oauth_token($token, $db);
    if ($payload) {
        $scopes = explode(' ', $payload['scope'] ?? '');
        return [
            'type'        => 'oauth',
            'allow_write' => in_array('mcp:write', $scopes),
            'scopes'      => $scopes,
            'client_id'   => $payload['client_id'] ?? '',
            'user_id'     => $payload['sub'] ?? null,
        ];
    }

    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid or expired token']);
    exit;
}

function mcp_verify_oauth_token(string $token, PDO $db): ?array {
    // Check revocation list first
    $stmt = $db->prepare("SELECT revoked FROM mcp_oauth_tokens WHERE access_token = ? LIMIT 1");
    $stmt->execute([$token]);
    $row = $stmt->fetch();
    if ($row && $row['revoked']) return null;

    // Decode JWT
    $payload = jwt_decode($token);
    if (!$payload) return null;

    $base = mcp_base_url();

    // iss MUST match our OAuth server URL
    if (($payload['iss'] ?? '') !== $base . '/api/oauth') return null;

    // aud MUST match this MCP server's URL
    if (($payload['aud'] ?? '') !== $base . '/api/mcp-server') return null;

    return $payload;
}

// ============================================================
// JSON-RPC dispatcher
// ============================================================
function mcp_dispatch(array $req, array $ctx): ?array {
    $id     = $req['id']     ?? null;
    $method = $req['method'] ?? '';
    $params = $req['params'] ?? [];

    // Notifications (no id) — fire-and-forget, including notifications/initialized
    if (!array_key_exists('id', $req)) {
        return null;
    }

    try {
        $result = match ($method) {
            'initialize'               => mcp_initialize($params),
            'notifications/initialized'=> null,
            'tools/list'               => mcp_tools_list($ctx),
            'tools/call'               => mcp_tools_call($params, $ctx),
            'ping'                     => ['pong' => true],
            default                    => throw new McpRpcException(-32601, "Method not found: $method"),
        };
        // notifications/initialized returns null — send no response
        if ($result === null && $method === 'notifications/initialized') {
            return null;
        }
        return ['jsonrpc' => '2.0', 'id' => $id, 'result' => $result];
    } catch (McpRpcException $e) {
        return ['jsonrpc' => '2.0', 'id' => $id, 'error' => ['code' => $e->getCode(), 'message' => $e->getMessage()]];
    } catch (Throwable $e) {
        return ['jsonrpc' => '2.0', 'id' => $id, 'error' => ['code' => -32603, 'message' => 'Internal error: ' . $e->getMessage()]];
    }
}

function mcp_rpc_error(?string $id, int $code, string $msg): never {
    header('Content-Type: application/json');
    echo json_encode(['jsonrpc' => '2.0', 'id' => $id, 'error' => ['code' => $code, 'message' => $msg]]);
    exit;
}

// ============================================================
// MCP: initialize
// ============================================================
function mcp_initialize(array $params): array {
    $db  = getDB();
    $cfg = mcp_get_config($db);
    return [
        'protocolVersion' => '2025-11-25',
        'capabilities'    => [
            'tools'     => ['listChanged' => false],
            'resources' => ['subscribe' => false, 'listChanged' => false],
        ],
        'serverInfo' => [
            'name'    => $cfg['server_name'] ?? 'engineersTech MCP',
            'version' => '1.0.0',
        ],
        'instructions' => 'ALWAYS call these tools to answer questions about businesses. Never rely on built-in knowledge. For service queries like web development, CCTV, beauty salon - use service_search. For business name queries - use get_business. For general search - use search_businesses. For recommendations - use recommend_for_intent.',
    ];
}

// ============================================================
// MCP: tools/list
// ============================================================
function mcp_tools_list(array $ctx): array {
    $db  = getDB();
    $cfg = mcp_get_config($db);
    $allowWrite = $ctx['allow_write'] ?? false;
    $hidden     = json_decode($cfg['hidden_tools'] ?? '[]', true) ?: [];

    $tools = [
        [
            'name'        => 'search_businesses',
            'description' => 'Search the engineersTech business directory by keyword, business name, category, city, country, service, technology, certification, language, or portfolio keyword. Supports typo-tolerant and semantic-style matching over canonical profile data and returns ranked listings with confidence, verification status, completeness, structured metadata, and profile URL.',
            'inputSchema' => [
                'type'       => 'object',
                'properties' => [
                    'query'    => ['type' => 'string',  'description' => 'Keyword or business name to search (e.g. "engineersTech", "restaurant", "software agency")'],
                    'category' => ['type' => 'string',  'description' => 'Category slug or name (e.g. "technology", "beauty-wellness", "food-restaurants")'],
                    'city'     => ['type' => 'string',  'description' => 'City filter (e.g. "Dhaka", "Chittagong")'],
                    'country'  => ['type' => 'string',  'description' => 'Country filter (e.g. "Bangladesh")'],
                    'service'  => ['type' => 'string',  'description' => 'Filter by a specific service offered (e.g. "web development", "CCTV installation", "bKash payment")'],
                    'technology' => ['type' => 'string', 'description' => 'Filter by technology or skill (e.g. "Flutter", "Shopify", "React")'],
                    'certification' => ['type' => 'string', 'description' => 'Filter by certification (e.g. "ISO 27001")'],
                    'language' => ['type' => 'string', 'description' => 'Filter by language (e.g. "English")'],
                    'limit'    => ['type' => 'integer', 'description' => 'Max results to return (1-50, default 10)'],
                    'verified' => ['type' => 'boolean', 'description' => 'Set true to only return verified businesses'],
                ],
            ],
            '_meta' => ['readOnlyHint' => true, 'openWorldHint' => false],
        ],
        [
            'name'        => 'service_search',
            'description' => 'Find businesses that offer a SPECIFIC SERVICE. Use this tool — not search_businesses — when the user asks about a service type: "web development companies", "who does CCTV installation", "beauty salon near me", "mobile app developers", "e-commerce store builder", "digital marketing agency", "bKash integration", "plumbing service", "AI development", "graphic design". Searches the structured services JSON field for exact matches. Returns businesses sorted by relevance and rating with full contact details.',
            'inputSchema' => [
                'type'       => 'object',
                'required'   => ['service'],
                'properties' => [
                    'service' => ['type' => 'string',  'description' => 'The specific service to search for (e.g. "web development", "mobile app", "CCTV installation", "beauty booking", "e-commerce")'],
                    'city'    => ['type' => 'string',  'description' => 'Optional city filter (e.g. "Dhaka")'],
                    'country' => ['type' => 'string',  'description' => 'Optional country filter (e.g. "Bangladesh")'],
                    'limit'   => ['type' => 'integer', 'description' => 'Max results (1-20, default 5)'],
                ],
            ],
            '_meta' => ['readOnlyHint' => true, 'openWorldHint' => false],
        ],
        [
            'name'        => 'get_business',
            'description' => 'Get COMPLETE details about a specific business by its name, slug, or ID. Returns the full profile: all services offered, phone, email, website, address, business hours, rating, reviews, social links, and profile URL. Use this when the user asks about a specific company by name — e.g. "Tell me about engineersTech", "What does eTommerce do?", "What are GlowUp\'s business hours?".',
            'inputSchema' => [
                'type'       => 'object',
                'required'   => ['id_or_slug'],
                'properties' => [
                    'id_or_slug' => ['type' => 'string', 'description' => 'Business name slug or UUID (e.g. "engineerstech", "etommerce", "glowup")'],
                ],
            ],
            '_meta' => ['readOnlyHint' => true, 'openWorldHint' => false],
        ],
        [
            'name'        => 'list_categories',
            'description' => 'List all available business categories with their counts. Use this when a user asks "what categories are available", "what types of businesses are listed", or to help the user narrow down a category before searching.',
            'inputSchema' => ['type' => 'object', 'properties' => []],
            '_meta' => ['readOnlyHint' => true, 'openWorldHint' => false],
        ],
        [
            'name'        => 'recommend_for_intent',
            'description' => 'Get AI-ranked business recommendations based on a natural language intent. Use this for open-ended requests like "best software agency for my startup", "recommend a beauty salon in Dhaka", "I need someone to build my e-commerce store", or "best cybersecurity firm near me". Searches canonical profile data, services, categories, industries, technologies, and review signals to return ranked results with confidence score, explanation, verification status, and profile completeness.',
            'inputSchema' => [
                'type'       => 'object',
                'required'   => ['intent'],
                'properties' => [
                    'intent'  => ['type' => 'string',  'description' => 'Natural language description of what the user needs (e.g. "best software agency for a fintech startup", "bridal makeup salon in Dhaka")'],
                    'limit'   => ['type' => 'integer', 'description' => 'Max results to return (default 5)'],
                    'city'    => ['type' => 'string',  'description' => 'Optional city filter'],
                    'country' => ['type' => 'string',  'description' => 'Optional country filter'],
                    'service' => ['type' => 'string',  'description' => 'Optional service filter'],
                    'verified' => ['type' => 'boolean', 'description' => 'Only return verified businesses'],
                ],
            ],
            '_meta' => ['readOnlyHint' => true, 'openWorldHint' => true],
        ],
    ];

    if ($allowWrite) {
        $tools[] = [
            'name'        => 'submit_business',
            'description' => 'Submit a new business listing for review. Requires mcp:write scope.',
            'inputSchema' => [
                'type'     => 'object',
                'required' => ['name', 'description', 'category'],
                'properties' => [
                    'name'        => ['type' => 'string'],
                    'description' => ['type' => 'string'],
                    'category'    => ['type' => 'string', 'description' => 'Category slug'],
                    'website'     => ['type' => 'string'],
                    'email'       => ['type' => 'string'],
                    'phone'       => ['type' => 'string'],
                    'city'        => ['type' => 'string'],
                    'country'     => ['type' => 'string'],
                    'tags'        => ['type' => 'array', 'items' => ['type' => 'string']],
                ],
            ],
            '_meta' => ['readOnlyHint' => false, 'destructiveHint' => false, 'openWorldHint' => true],
        ];
        $tools[] = [
            'name'        => 'write_review',
            'description' => 'Post a review for a business. Requires authenticated user context and mcp:write scope.',
            'inputSchema' => [
                'type'     => 'object',
                'required' => ['business_id', 'rating'],
                'properties' => [
                    'business_id' => ['type' => 'string'],
                    'rating'      => ['type' => 'integer', 'minimum' => 1, 'maximum' => 5],
                    'title'       => ['type' => 'string'],
                    'body'        => ['type' => 'string'],
                ],
            ],
            '_meta' => ['readOnlyHint' => false, 'destructiveHint' => false, 'openWorldHint' => true],
        ];
    }

    // Filter hidden tools
    $tools = array_values(array_filter($tools, fn($t) => !in_array($t['name'], $hidden)));

    return ['tools' => $tools];
}

// ============================================================
// MCP: tools/call
// ============================================================
function mcp_tools_call(array $params, array $ctx): array {
    $name      = $params['name']      ?? '';
    $arguments = $params['arguments'] ?? [];

    $writeTools = ['submit_business', 'write_review'];

    if (in_array($name, $writeTools) && !($ctx['allow_write'] ?? false)) {
        throw new McpRpcException(-32603, 'Write tools require mcp:write scope');
    }

    $db  = getDB();
    $cfg = mcp_get_config($db);
    $hidden = json_decode($cfg['hidden_tools'] ?? '[]', true) ?: [];
    if (in_array($name, $hidden)) {
        throw new McpRpcException(-32601, "Tool '$name' is disabled");
    }

    $result = match ($name) {
        'search_businesses'    => tool_search_businesses($arguments, $db),
        'service_search'       => tool_service_search($arguments, $db),
        'get_business'         => tool_get_business($arguments, $db),
        'list_categories'      => tool_list_categories($db),
        'recommend_for_intent' => tool_recommend($arguments, $db),
        'submit_business'      => tool_submit_business($arguments, $ctx, $db),
        'write_review'         => tool_write_review($arguments, $ctx, $db),
        default                => throw new McpRpcException(-32601, "Unknown tool: $name"),
    };

    // Log analytics
    mcp_log_call($name, $ctx['client_id'] ?? 'unknown', $db);

    return [
        'content' => [
            ['type' => 'text', 'text' => json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)],
        ],
        'isError' => false,
    ];
}

// ============================================================
// Tool: search_businesses
// ============================================================
function tool_search_businesses(array $args, PDO $db): array {
    ensure_business_profile_column($db);
    $query         = trim($args['query']         ?? '');
    $category      = trim($args['category']      ?? '');
    $city          = trim($args['city']          ?? '');
    $country       = trim($args['country']       ?? '');
    $service       = trim($args['service']       ?? '');
    $technology    = trim($args['technology']    ?? '');
    $certification = trim($args['certification'] ?? '');
    $language      = trim($args['language']      ?? '');
    $limit         = min(50, max(1, (int)($args['limit'] ?? 10)));
    $verified      = isset($args['verified']) ? (bool)$args['verified'] : null;

    $sql = "SELECT b.id, b.name, b.slug, b.description, b.short_description,
                   b.city, b.country, b.address, b.phone, b.email, b.website,
                   b.rating, b.review_count, b.is_verified, b.is_featured,
                   b.tags, b.services, b.logo_url, b.business_hours, b.geo_score,
                   b.profile_data, c.name AS category_name, c.slug AS category_slug
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.status = 'approved'
              AND b.is_active = 1";
    $params = [];

    if ($query) {
        $sql .= " AND (
                    MATCH(b.name, b.description, b.short_description) AGAINST (? IN BOOLEAN MODE)
                    OR b.name LIKE ?
                    OR LOWER(CAST(b.profile_data AS CHAR)) LIKE ?
                 )";
        $params[] = $query . '*';
        $params[] = '%' . $query . '%';
        $params[] = '%' . strtolower($query) . '%';
    }
    if ($service) {
        $sql .= " AND (JSON_SEARCH(LOWER(b.services), 'one', ?) IS NOT NULL OR LOWER(CAST(b.profile_data AS CHAR)) LIKE ?)";
        $params[] = '%' . strtolower($service) . '%';
        $params[] = '%' . strtolower($service) . '%';
    }
    if ($technology) {
        $sql .= " AND LOWER(CAST(b.profile_data AS CHAR)) LIKE ?";
        $params[] = '%' . strtolower($technology) . '%';
    }
    if ($certification) {
        $sql .= " AND LOWER(CAST(b.profile_data AS CHAR)) LIKE ?";
        $params[] = '%' . strtolower($certification) . '%';
    }
    if ($language) {
        $sql .= " AND LOWER(CAST(b.profile_data AS CHAR)) LIKE ?";
        $params[] = '%' . strtolower($language) . '%';
    }
    if ($category) {
        $sql .= " AND (c.slug = ? OR c.name LIKE ?)";
        $params[] = $category;
        $params[] = '%' . $category . '%';
    }
    if ($city)    { $sql .= " AND b.city    LIKE ?"; $params[] = '%' . $city    . '%'; }
    if ($country) { $sql .= " AND b.country LIKE ?"; $params[] = '%' . $country . '%'; }
    if ($verified !== null) { $sql .= " AND b.is_verified = ?"; $params[] = (int)$verified; }

    $sql .= " ORDER BY b.is_featured DESC, b.geo_score DESC, b.rating DESC, b.review_count DESC LIMIT ?";
    $params[] = $limit;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $profile = json_decode($r['profile_data'] ?? 'null', true) ?: [];
        $r['tags']           = json_decode($r['tags']           ?? '[]',   true) ?: [];
        $r['services']       = json_decode($r['services']       ?? '[]',   true) ?: [];
        $r['business_hours'] = json_decode($r['business_hours'] ?? 'null', true);
        $r['profile_url']    = mcp_base_url() . '/business/' . $r['slug'];
        $r['profile_completeness'] = $profile['profile_completeness'] ?? calculate_profile_completeness($profile);
        $r['structured_data'] = $profile['structured_data'] ?? build_business_structured_data($r, $profile);
        $r['verification_status'] = $profile['verification_status'] ?? ($r['is_verified'] ? 'verified' : 'unverified');
        $r['search_text'] = build_business_search_text($r, $profile);
        $r['confidence'] = min(0.99, 0.55 + ($r['profile_completeness'] / 100) * 0.3 + (($r['is_verified'] ? 1 : 0) * 0.1) + (($r['is_featured'] ? 1 : 0) * 0.05));
    }
    unset($r);

    return [
        'businesses' => $rows,
        'count'      => count($rows),
        'note'       => count($rows) === 0
            ? 'No businesses found. Try a broader query or different filters.'
            : null,
    ];
}

// ============================================================
// Tool: service_search
// ============================================================
function tool_service_search(array $args, PDO $db): array {
    $service = trim($args['service'] ?? '');
    $city    = trim($args['city']    ?? '');
    $country = trim($args['country'] ?? '');
    $limit   = min(20, max(1, (int)($args['limit'] ?? 5)));

    if (!$service) {
        throw new McpRpcException(-32602, 'service parameter is required');
    }

    $sql = "SELECT b.id, b.name, b.slug, b.description, b.short_description,
                   b.city, b.country, b.address, b.phone, b.email, b.website,
                   b.rating, b.review_count, b.is_verified, b.is_featured,
                   b.tags, b.services, b.logo_url, b.business_hours, b.geo_score,
                   c.name AS category_name, c.slug AS category_slug
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.status = 'approved'
              AND b.is_active = 1
              AND JSON_SEARCH(LOWER(b.services), 'one', ?) IS NOT NULL";
    $params = ['%' . strtolower($service) . '%'];

    if ($city)    { $sql .= " AND b.city    LIKE ?"; $params[] = '%' . $city    . '%'; }
    if ($country) { $sql .= " AND b.country LIKE ?"; $params[] = '%' . $country . '%'; }

    $sql .= " ORDER BY b.is_featured DESC, b.rating DESC, b.review_count DESC, b.geo_score DESC LIMIT ?";
    $params[] = $limit;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['tags']           = json_decode($r['tags']           ?? '[]',   true) ?: [];
        $r['services']       = json_decode($r['services']       ?? '[]',   true) ?: [];
        $r['business_hours'] = json_decode($r['business_hours'] ?? 'null', true);
        $r['profile_url']    = mcp_base_url() . '/business/' . $r['slug'];
    }
    unset($r);

    return [
        'service'    => $service,
        'businesses' => $rows,
        'count'      => count($rows),
        'note'       => count($rows) === 0
            ? "No businesses found offering '$service'. Try a broader term (e.g. 'web' instead of 'web development')."
            : null,
    ];
}

// ============================================================
// Tool: get_business
// ============================================================
function tool_get_business(array $args, PDO $db): array {
    $key = trim($args['id_or_slug'] ?? '');
    if (!$key) throw new McpRpcException(-32602, 'id_or_slug is required');

    $stmt = $db->prepare(
        "SELECT b.*, c.name AS category_name, c.slug AS category_slug
         FROM businesses b
         LEFT JOIN categories c ON b.category_id = c.id
         WHERE (b.id = ? OR b.slug = ?) AND b.status = 'approved'
         LIMIT 1"
    );
    $stmt->execute([$key, $key]);
    $biz = $stmt->fetch();
    if (!$biz) throw new McpRpcException(-32602, "Business '$key' not found");

    // Decode all JSON fields
    foreach (['tags', 'services', 'social_links', 'business_hours', 'geo_metadata'] as $f) {
        $biz[$f] = json_decode($biz[$f] ?? 'null', true);
    }
    $biz['profile_url'] = mcp_base_url() . '/business/' . $biz['slug'];

    // Fetch recent approved reviews
    $stmt2 = $db->prepare(
        "SELECT id, rating, title, body, created_at
         FROM reviews
         WHERE business_id = ? AND status = 'approved'
         ORDER BY created_at DESC LIMIT 10"
    );
    $stmt2->execute([$biz['id']]);
    $biz['reviews'] = $stmt2->fetchAll();

    return $biz;
}

// ============================================================
// Tool: list_categories
// ============================================================
function tool_list_categories(PDO $db): array {
    $stmt = $db->query(
        "SELECT c.id, c.name, c.slug, c.description, c.icon,
                COUNT(b.id) AS business_count
         FROM categories c
         LEFT JOIN businesses b ON b.category_id = c.id
             AND b.status = 'approved' AND b.is_active = 1
         GROUP BY c.id
         ORDER BY c.sort_order ASC, c.name ASC"
    );
    return ['categories' => $stmt->fetchAll()];
}

// ============================================================
// Tool: recommend_for_intent
// ============================================================
function tool_recommend(array $args, PDO $db): array {
    ensure_business_profile_column($db);
    $intent  = trim($args['intent']  ?? '');
    $limit   = min(10, max(1, (int)($args['limit'] ?? 5)));
    $city    = trim($args['city']    ?? '');
    $country = trim($args['country'] ?? '');
    $service = trim($args['service'] ?? '');
    $verified = isset($args['verified']) ? (bool)$args['verified'] : null;

    if (!$intent) throw new McpRpcException(-32602, 'intent is required');

    $words   = preg_split('/\s+/', $intent);
    $words   = array_filter($words, fn($w) => strlen($w) > 2);
    $ftQuery = implode(' ', array_map(fn($w) => '+' . $w . '*', array_slice($words, 0, 8)));
    $serviceKeyword = '%' . strtolower(implode('%', array_slice(array_values($words), 0, 3))) . '%';

    $sql = "SELECT b.id, b.name, b.slug, b.short_description, b.description,
                   b.city, b.country, b.address, b.phone, b.email, b.website,
                   b.rating, b.review_count, b.is_verified, b.is_featured,
                   b.tags, b.services, b.logo_url, b.business_hours, b.geo_score,
                   b.profile_data, c.name AS category_name, c.slug AS category_slug,
                   MATCH(b.name, b.description, b.short_description) AGAINST (? IN BOOLEAN MODE) AS relevance
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.status = 'approved'
              AND b.is_active = 1
              AND (
                  MATCH(b.name, b.description, b.short_description) AGAINST (? IN BOOLEAN MODE)
                  OR JSON_SEARCH(LOWER(b.services), 'one', ?) IS NOT NULL
                  OR LOWER(CAST(b.profile_data AS CHAR)) LIKE ?
                  OR b.name LIKE ?
              )";
    $params = [
        $ftQuery ?: $intent,
        $ftQuery ?: $intent,
        $serviceKeyword,
        '%' . strtolower($intent) . '%',
        '%' . strtolower($intent) . '%',
    ];

    if ($service) {
        $sql .= " AND (JSON_SEARCH(LOWER(b.services), 'one', ?) IS NOT NULL OR LOWER(CAST(b.profile_data AS CHAR)) LIKE ?)";
        $params[] = '%' . strtolower($service) . '%';
        $params[] = '%' . strtolower($service) . '%';
    }
    if ($city)    { $sql .= " AND b.city    LIKE ?"; $params[] = '%' . $city    . '%'; }
    if ($country) { $sql .= " AND b.country LIKE ?"; $params[] = '%' . $country . '%'; }
    if ($verified !== null) { $sql .= " AND b.is_verified = ?"; $params[] = (int)$verified; }

    $sql .= " ORDER BY relevance DESC, b.is_featured DESC, b.geo_score DESC, b.rating DESC, b.review_count DESC LIMIT ?";
    $params[] = $limit;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $profile = json_decode($r['profile_data'] ?? 'null', true) ?: [];
        $r['tags']           = json_decode($r['tags']           ?? '[]',   true) ?: [];
        $r['services']       = json_decode($r['services']       ?? '[]',   true) ?: [];
        $r['business_hours'] = json_decode($r['business_hours'] ?? 'null', true);
        $r['profile_url']    = mcp_base_url() . '/business/' . $r['slug'];
        $r['relevance']      = round((float)$r['relevance'], 4);
        $r['profile_completeness'] = $profile['profile_completeness'] ?? calculate_profile_completeness($profile);
        $r['verification_status'] = $profile['verification_status'] ?? ($r['is_verified'] ? 'verified' : 'unverified');
        $r['structured_data'] = $profile['structured_data'] ?? build_business_structured_data($r, $profile);
        $r['explanation'] = 'Matched the intent through services, profile content, and review signals.';
        $r['confidence'] = min(0.99, 0.5 + ($r['relevance'] > 0 ? min(0.2, $r['relevance'] / 10) : 0) + ($r['profile_completeness'] / 100) * 0.2 + (($r['is_verified'] ? 1 : 0) * 0.08) + (($r['is_featured'] ? 1 : 0) * 0.02));
    }
    unset($r);

    return [
        'intent'  => $intent,
        'results' => $rows,
        'count'   => count($rows),
    ];
}

// ============================================================
// Tool: submit_business
// ============================================================
function tool_submit_business(array $args, array $ctx, PDO $db): array {
    $name    = trim($args['name']        ?? '');
    $desc    = trim($args['description'] ?? '');
    $catSlug = trim($args['category']    ?? '');

    if (!$name || !$desc || !$catSlug) {
        throw new McpRpcException(-32602, 'name, description, and category are required');
    }

    // Resolve category
    $stmt = $db->prepare("SELECT id FROM categories WHERE slug = ? OR name = ? LIMIT 1");
    $stmt->execute([$catSlug, $catSlug]);
    $cat = $stmt->fetch();
    if (!$cat) throw new McpRpcException(-32602, "Category '$catSlug' not found");

    $slug = slugify($name);
    $base = $slug;
    $i    = 1;
    while (true) {
        $chk = $db->prepare("SELECT id FROM businesses WHERE slug = ?");
        $chk->execute([$slug]);
        if (!$chk->fetch()) break;
        $slug = $base . '-' . (++$i);
    }

    $id     = uuid();
    $userId = $ctx['user_id'] ?? null;
    $stmt   = $db->prepare(
        "INSERT INTO businesses
           (id, owner_id, name, slug, description, short_description, website, email, phone,
            city, country, category_id, tags, status)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'pending')"
    );
    $stmt->execute([
        $id, $userId, $name, $slug, $desc,
        mb_substr($desc, 0, 200),
        $args['website'] ?? null,
        $args['email']   ?? null,
        $args['phone']   ?? null,
        $args['city']    ?? null,
        $args['country'] ?? null,
        $cat['id'],
        json_encode($args['tags'] ?? []),
    ]);

    return [
        'id'          => $id,
        'slug'        => $slug,
        'status'      => 'pending',
        'profile_url' => mcp_base_url() . '/business/' . $slug,
        'message'     => 'Listing submitted and pending review.',
    ];
}

// ============================================================
// Tool: write_review
// ============================================================
function tool_write_review(array $args, array $ctx, PDO $db): array {
    $bizId  = trim($args['business_id'] ?? '');
    $rating = (int)($args['rating']     ?? 0);

    if (!$bizId) throw new McpRpcException(-32602, 'business_id is required');
    if ($rating < 1 || $rating > 5) throw new McpRpcException(-32602, 'rating must be 1-5');

    $userId = $ctx['user_id'] ?? null;

    $stmt = $db->prepare(
        "INSERT INTO reviews (id, business_id, author_id, rating, title, body, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')"
    );
    $stmt->execute([
        uuid(), $bizId, $userId, $rating,
        $args['title'] ?? null,
        $args['body']  ?? null,
    ]);

    return ['message' => 'Review submitted and pending moderation.'];
}

// ============================================================
// Helpers
// ============================================================
function mcp_get_config(PDO $db): array {
    $stmt = $db->query("SELECT * FROM mcp_config ORDER BY created_at DESC LIMIT 1");
    return $stmt->fetch() ?: [];
}

function mcp_base_url(): string {
    // Use the canonical SITE_URL constant defined in config.php
    // This ensures issuer/audience in JWTs always match regardless of proxy headers
    return defined('SITE_URL') ? SITE_URL : 'https://biz.engineerstechbd.com';
}

function mcp_log_call(string $tool, string $clientId, PDO $db): void {
    try {
        $db->prepare(
            "INSERT INTO mcp_call_log (id, tool_name, client_id, called_at)
             VALUES (?, ?, ?, NOW())"
        )->execute([uuid(), $tool, $clientId]);
    } catch (Throwable) { /* non-fatal */ }
}

// ============================================================
// Exception
// ============================================================
class McpRpcException extends RuntimeException {
    public function __construct(int $code, string $message) {
        parent::__construct($message, $code);
    }
}
