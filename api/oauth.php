<?php
/**
 * OAuth 2.1 Authorization Server for MCP + ChatGPT
 * Spec: RFC 6749 + OAuth 2.1 + PKCE (RFC 7636) + Dynamic Registration (RFC 7591)
 *       + OAuth Server Metadata (RFC 8414) + Resource Metadata (RFC 9396)
 *       + JWKS (RFC 7517) for token verification
 *
 * Deployed on: https://biz.h-tv.online
 *
 * Endpoints served by this file (called from api/index.php AND directly via .htaccess):
 *
 *   GET  /.well-known/oauth-authorization-server  → OAuth server metadata (ChatGPT discovery)
 *   GET  /.well-known/oauth-protected-resource    → Resource server metadata
 *   POST /api/oauth/register                      → Dynamic client registration (RFC 7591)
 *   GET  /api/oauth/authorize                     → Authorization endpoint
 *   POST /api/oauth/token                         → Token endpoint
 *   POST /api/oauth/revoke                        → Token revocation (RFC 7009)
 *   GET  /api/oauth/jwks                          → JWKS public key endpoint
 */

require_once __DIR__ . '/config.php';

// ── CORS — needed for browser-based OAuth clients ───────────────────────────
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Normalize: strip both /api prefix and trailing slash
$uri = preg_replace('#^/api#', '', $uri);
$uri = rtrim($uri, '/') ?: '/';

// ── Routing ──────────────────────────────────────────────────────────────────
match (true) {
    // Well-known discovery endpoints — served at root (/.well-known/...)
    // These come via .htaccess direct rewrite, so uri starts with /.well-known
    str_starts_with($uri, '/.well-known/oauth-authorization-server')
        => oauth_well_known_as(),
    str_starts_with($uri, '/.well-known/oauth-protected-resource')
        => oauth_well_known_resource(),

    // OAuth endpoints under /api/oauth/...
    $uri === '/oauth/register' && $method === 'POST'
        => oauth_register(),
    str_starts_with($uri, '/oauth/authorize')
        => oauth_authorize(),
    $uri === '/oauth/token' && $method === 'POST'
        => oauth_token(),
    $uri === '/oauth/revoke' && $method === 'POST'
        => oauth_revoke(),
    $uri === '/oauth/jwks' && $method === 'GET'
        => oauth_jwks(),

    // Also handle when called through api/index.php which passes /.well-known paths
    str_starts_with($uri, '/.well-known')
        => oauth_well_known_as(), // fallback

    default
        => oauth_error('not_found', 'Endpoint not found', 404),
};

// ============================================================
// RFC 8414 — OAuth Server Metadata
// ChatGPT reads this to discover all OAuth endpoints automatically
// ============================================================
function oauth_well_known_as(): never {
    $base = SITE_URL;
    header('Content-Type: application/json');
    header('Cache-Control: public, max-age=3600');
    echo json_encode([
        // Issuer — MUST match the iss claim in issued JWTs
        'issuer'                                => $base . '/api/oauth',

        // Core OAuth endpoints
        'authorization_endpoint'                => $base . '/api/oauth/authorize',
        'token_endpoint'                        => $base . '/api/oauth/token',
        'revocation_endpoint'                   => $base . '/api/oauth/revoke',

        // Dynamic Client Registration (RFC 7591) — key for ChatGPT one-time setup
        'registration_endpoint'                 => $base . '/api/oauth/register',

        // JWKS for token verification
        'jwks_uri'                              => $base . '/api/oauth/jwks',

        // Supported scopes — ChatGPT will request these
        'scopes_supported'                      => ['mcp:read', 'mcp:write', 'openid', 'profile'],

        // Response types
        'response_types_supported'              => ['code'],

        // Grant types
        'grant_types_supported'                 => ['authorization_code', 'refresh_token'],

        // PKCE — mandatory for public clients (ChatGPT is a public client)
        'code_challenge_methods_supported'      => ['S256'],

        // Token endpoint auth methods — 'none' = public client (PKCE-only)
        'token_endpoint_auth_methods_supported' => ['none', 'client_secret_post'],

        // Introspection
        'subject_types_supported'               => ['public'],
        'id_token_signing_alg_values_supported' => ['HS256'],

        // Documentation
        'service_documentation'                 => $base . '/api-docs',
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

// ============================================================
// RFC 9396 — OAuth Resource Metadata
// Tells clients which auth server protects the MCP resource
// ============================================================
function oauth_well_known_resource(): never {
    $base = SITE_URL;
    header('Content-Type: application/json');
    header('Cache-Control: public, max-age=3600');
    echo json_encode([
        // Resource server identifier
        'resource'                  => $base . '/api/mcp-server',

        // Which authorization server issues tokens for this resource
        'authorization_servers'     => [$base . '/api/oauth'],

        // Scopes this resource accepts
        'scopes_supported'          => ['mcp:read', 'mcp:write'],

        // How bearer tokens are transmitted
        'bearer_methods_supported'  => ['header'],

        'resource_documentation'    => $base . '/api-docs',
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

// ============================================================
// RFC 7517 — JWKS Endpoint
// Allows token consumers (including ChatGPT) to verify JWTs
// ============================================================
function oauth_jwks(): never {
    // We use HMAC-SHA256 (symmetric), so we expose a dummy symmetric JWK.
    // For production, switch to RS256 and publish the real RSA public key here.
    // ChatGPT primarily uses this to confirm the issuer, not to verify symmetric keys.
    header('Content-Type: application/json');
    header('Cache-Control: public, max-age=86400');

    // Get the JWT secret key ID (stable hash of the secret for the kid claim)
    $kid = substr(hash('sha256', JWT_SECRET . 'kid'), 0, 16);

    echo json_encode([
        'keys' => [
            [
                'kty' => 'oct',      // symmetric key (HMAC-SHA256)
                'use' => 'sig',
                'alg' => 'HS256',
                'kid' => $kid,
                // 'k'  intentionally omitted — symmetric keys are private
            ],
        ],
    ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

// ============================================================
// RFC 7591 — Dynamic Client Registration
//
// ChatGPT calls this automatically when you add an MCP connection.
// It does NOT require redirect_uris to be pre-registered — ChatGPT
// provides them dynamically in the registration request.
// ============================================================
function oauth_register(): never {
    $input = get_json_input();
    $db    = getDB();

    $clientName   = trim($input['client_name']              ?? '');
    $redirectUris = $input['redirect_uris']                  ?? [];
    $grantTypes   = $input['grant_types']                    ?? ['authorization_code'];
    $scope        = trim($input['scope']                     ?? 'mcp:read');
    $authMethod   = $input['token_endpoint_auth_method']     ?? 'none';
    $contacts     = $input['contacts']                       ?? [];
    $logoUri      = trim($input['logo_uri']                  ?? '');
    $tosUri       = trim($input['tos_uri']                   ?? '');
    $policyUri    = trim($input['policy_uri']                ?? '');

    // client_name is optional for ChatGPT — default gracefully
    if (!$clientName) {
        $clientName = 'OAuth Client ' . substr(bin2hex(random_bytes(4)), 0, 8);
    }

    // Validate: redirect_uris must be HTTPS (except localhost for testing)
    foreach ($redirectUris as $uri) {
        if (!filter_var($uri, FILTER_VALIDATE_URL)) {
            oauth_error('invalid_redirect_uri', "Invalid redirect_uri: $uri");
        }
        $scheme = parse_url($uri, PHP_URL_HOST);
        if ($scheme !== 'localhost' && !str_starts_with($uri, 'https://')) {
            oauth_error('invalid_redirect_uri', "redirect_uri must use HTTPS: $uri");
        }
    }

    // Validate requested scopes (only allow known scopes)
    $allowedScopes = ['mcp:read', 'mcp:write', 'openid', 'profile'];
    $requestedScopes = array_filter(explode(' ', $scope));
    $grantedScopes   = array_intersect($requestedScopes, $allowedScopes);
    if (empty($grantedScopes)) {
        $grantedScopes = ['mcp:read']; // default
    }
    $grantedScope = implode(' ', $grantedScopes);

    $clientId     = uuid();
    $clientSecret = ($authMethod !== 'none') ? bin2hex(random_bytes(32)) : null;
    $now          = date('Y-m-d H:i:s');

    $stmt = $db->prepare(
        "INSERT INTO mcp_oauth_clients
           (id, client_name, redirect_uris, grant_types, scopes, client_secret,
            token_endpoint_auth_method, logo_uri, tos_uri, policy_uri, contacts, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $clientId,
        $clientName,
        json_encode(array_values($redirectUris)),
        json_encode($grantTypes),
        $grantedScope,
        $clientSecret ? password_hash($clientSecret, PASSWORD_BCRYPT) : null,
        $authMethod,
        $logoUri  ?: null,
        $tosUri   ?: null,
        $policyUri?: null,
        json_encode($contacts),
        $now,
    ]);

    $base = SITE_URL;
    http_response_code(201);
    header('Content-Type: application/json');

    // RFC 7591 §3.2.1 — response MUST include client_id, MAY include client_secret
    $response = [
        'client_id'                      => $clientId,
        'client_name'                    => $clientName,
        'redirect_uris'                  => $redirectUris,
        'grant_types'                    => $grantTypes,
        'scope'                          => $grantedScope,
        'token_endpoint_auth_method'     => $authMethod,
        'client_id_issued_at'            => time(),
    ];
    if ($clientSecret) {
        $response['client_secret']            = $clientSecret;
        $response['client_secret_expires_at'] = 0; // 0 = never expires
    }
    // Registration management URI (RFC 7592)
    $response['registration_client_uri'] = $base . '/api/oauth/register/' . $clientId;

    echo json_encode($response, JSON_UNESCAPED_SLASHES);
    exit;
}

// ============================================================
// Authorization Endpoint (RFC 6749 §3.1)
// ============================================================
function oauth_authorize(): never {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $params = [
            'client_id'             => $_GET['client_id']             ?? '',
            'redirect_uri'          => $_GET['redirect_uri']          ?? '',
            'response_type'         => $_GET['response_type']         ?? 'code',
            'scope'                 => $_GET['scope']                 ?? 'mcp:read',
            'state'                 => $_GET['state']                 ?? '',
            'code_challenge'        => $_GET['code_challenge']        ?? '',
            'code_challenge_method' => $_GET['code_challenge_method'] ?? 'S256',
        ];

        if (!$params['client_id'])      oauth_error('invalid_request', 'client_id required');
        if (!$params['code_challenge']) oauth_error('invalid_request', 'code_challenge required (PKCE mandatory)');

        $db     = getDB();
        $client = oauth_get_client($params['client_id'], $db);
        if ($params['redirect_uri']) {
            oauth_validate_redirect($params['redirect_uri'], $client);
        }

        // Redirect to front-end consent page
        $base = SITE_URL;
        $qs   = http_build_query($params);
        header('Location: ' . $base . '/oauth/consent?' . $qs);
        exit;
    }

    if ($method === 'POST') {
        $input          = get_json_input() ?: $_POST;
        $clientId       = $input['client_id']             ?? '';
        $redirectUri    = $input['redirect_uri']           ?? '';
        $scope          = $input['scope']                  ?? 'mcp:read';
        $state          = $input['state']                  ?? '';
        $challenge      = $input['code_challenge']         ?? '';
        $challengeMethod= $input['code_challenge_method']  ?? 'S256';

        $userId = get_user_id();
        if (!$userId) oauth_error('access_denied', 'User not authenticated');

        $db     = getDB();
        $client = oauth_get_client($clientId, $db);
        if ($redirectUri) {
            oauth_validate_redirect($redirectUri, $client);
        }

        $code = bin2hex(random_bytes(20));
        $stmt = $db->prepare(
            "INSERT INTO mcp_oauth_codes
               (id, code, client_id, user_id, redirect_uri, scope,
                code_challenge, code_challenge_method, expires_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))"
        );
        $stmt->execute([
            uuid(), $code, $clientId, $userId,
            $redirectUri, $scope, $challenge, $challengeMethod,
        ]);

        $sep = strpos($redirectUri, '?') !== false ? '&' : '?';
        header('Content-Type: application/json');
        echo json_encode([
            'redirect' => $redirectUri . $sep . http_build_query(['code' => $code, 'state' => $state]),
        ]);
        exit;
    }

    oauth_error('invalid_request', 'Method not allowed');
}

// ============================================================
// Token Endpoint (RFC 6749 §3.2)
// ============================================================
function oauth_token(): never {
    $input     = get_json_input() ?: $_POST;
    $grantType = $input['grant_type'] ?? '';

    match ($grantType) {
        'authorization_code' => oauth_token_auth_code($input),
        'refresh_token'      => oauth_token_refresh($input),
        default              => oauth_error('unsupported_grant_type', 'Supported: authorization_code, refresh_token'),
    };
}

function oauth_token_auth_code(array $input): never {
    $code        = trim($input['code']          ?? '');
    $clientId    = trim($input['client_id']     ?? '');
    $redirectUri = trim($input['redirect_uri']  ?? '');
    $verifier    = trim($input['code_verifier'] ?? '');

    if (!$code || !$clientId || !$verifier) {
        oauth_error('invalid_request', 'code, client_id, and code_verifier are required');
    }

    $db   = getDB();
    $stmt = $db->prepare(
        "SELECT * FROM mcp_oauth_codes
         WHERE code = ? AND client_id = ? AND used = 0 AND expires_at > NOW()
         LIMIT 1"
    );
    $stmt->execute([$code, $clientId]);
    $row = $stmt->fetch();
    if (!$row) oauth_error('invalid_grant', 'Authorization code invalid or expired');

    // Validate redirect_uri (only if provided by client)
    if ($row['redirect_uri'] && $redirectUri && $row['redirect_uri'] !== $redirectUri) {
        oauth_error('invalid_grant', 'redirect_uri mismatch');
    }

    // PKCE S256 verification
    $expectedChallenge = rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '=');
    if (!hash_equals($row['code_challenge'], $expectedChallenge)) {
        oauth_error('invalid_grant', 'PKCE code_verifier invalid');
    }

    // Mark code as used (one-time use)
    $db->prepare("UPDATE mcp_oauth_codes SET used = 1 WHERE id = ?")->execute([$row['id']]);

    // Issue JWT access token + long-lived refresh token
    $accessToken  = oauth_issue_jwt($row);
    $refreshToken = bin2hex(random_bytes(32));
    $expiresIn    = 3600;               // 1 hour access token
    $refreshTTL   = 30 * 24 * 3600;    // 30 days refresh token

    $db->prepare(
        "INSERT INTO mcp_oauth_tokens
           (id, access_token, refresh_token, client_id, user_id, scope,
            expires_at, refresh_expires_at, revoked)
         VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND),
                 DATE_ADD(NOW(), INTERVAL ? SECOND), 0)"
    )->execute([
        uuid(), $accessToken, $refreshToken,
        $row['client_id'], $row['user_id'], $row['scope'],
        $expiresIn, $refreshTTL,
    ]);

    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    header('Pragma: no-cache');
    echo json_encode([
        'access_token'  => $accessToken,
        'token_type'    => 'Bearer',
        'expires_in'    => $expiresIn,
        'refresh_token' => $refreshToken,
        'scope'         => $row['scope'],
    ]);
    exit;
}

function oauth_token_refresh(array $input): never {
    $refreshToken = trim($input['refresh_token'] ?? '');
    $clientId     = trim($input['client_id']     ?? '');

    if (!$refreshToken || !$clientId) {
        oauth_error('invalid_request', 'refresh_token and client_id required');
    }

    $db   = getDB();
    $stmt = $db->prepare(
        "SELECT * FROM mcp_oauth_tokens
         WHERE refresh_token = ? AND client_id = ? AND revoked = 0
           AND (refresh_expires_at IS NULL OR refresh_expires_at > NOW())
         LIMIT 1"
    );
    $stmt->execute([$refreshToken, $clientId]);
    $row = $stmt->fetch();
    if (!$row) oauth_error('invalid_grant', 'Invalid or expired refresh token');

    // Revoke old token pair (token rotation)
    $db->prepare("UPDATE mcp_oauth_tokens SET revoked = 1 WHERE id = ?")->execute([$row['id']]);

    // Issue new token pair
    $accessToken  = oauth_issue_jwt($row);
    $newRefresh   = bin2hex(random_bytes(32));
    $expiresIn    = 3600;
    $refreshTTL   = 30 * 24 * 3600;

    $db->prepare(
        "INSERT INTO mcp_oauth_tokens
           (id, access_token, refresh_token, client_id, user_id, scope,
            expires_at, refresh_expires_at, revoked)
         VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND),
                 DATE_ADD(NOW(), INTERVAL ? SECOND), 0)"
    )->execute([
        uuid(), $accessToken, $newRefresh,
        $row['client_id'], $row['user_id'], $row['scope'],
        $expiresIn, $refreshTTL,
    ]);

    header('Content-Type: application/json');
    header('Cache-Control: no-store');
    header('Pragma: no-cache');
    echo json_encode([
        'access_token'  => $accessToken,
        'token_type'    => 'Bearer',
        'expires_in'    => $expiresIn,
        'refresh_token' => $newRefresh,
        'scope'         => $row['scope'],
    ]);
    exit;
}

// ============================================================
// Token Revocation (RFC 7009)
// ============================================================
function oauth_revoke(): never {
    $input = get_json_input() ?: $_POST;
    $token = trim($input['token'] ?? '');
    if (!$token) oauth_error('invalid_request', 'token required');
    $db = getDB();
    $db->prepare("UPDATE mcp_oauth_tokens SET revoked = 1 WHERE access_token = ? OR refresh_token = ?")
       ->execute([$token, $token]);
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['revoked' => true]);
    exit;
}

// ============================================================
// JWT Issue Helper
// Issuer and audience MUST match what mcp-server.php verifies
// ============================================================
function oauth_issue_jwt(array $row): string {
    $base = SITE_URL;
    $kid  = substr(hash('sha256', JWT_SECRET . 'kid'), 0, 16);

    $payload = [
        'iss'       => $base . '/api/oauth',           // matches mcp_verify_oauth_token
        'aud'       => $base . '/api/mcp-server',       // matches mcp-server audience check
        'sub'       => $row['user_id'] ?? $row['client_id'],
        'client_id' => $row['client_id'],
        'scope'     => $row['scope'],
        'jti'       => bin2hex(random_bytes(16)),       // unique token ID (anti-replay)
        'iat'       => time(),
        'exp'       => time() + 3600,
        'kid'       => $kid,
    ];
    return jwt_encode($payload);
}

// ============================================================
// Helpers
// ============================================================
function oauth_get_client(string $clientId, PDO $db): array {
    $stmt = $db->prepare("SELECT * FROM mcp_oauth_clients WHERE id = ? LIMIT 1");
    $stmt->execute([$clientId]);
    $client = $stmt->fetch();
    if (!$client) oauth_error('invalid_client', 'Unknown client_id');
    return $client;
}

function oauth_validate_redirect(string $uri, array $client): void {
    if (!$uri) return;
    $allowed = json_decode($client['redirect_uris'] ?? '[]', true) ?: [];
    if (!empty($allowed) && !in_array($uri, $allowed, true)) {
        oauth_error('invalid_request', 'redirect_uri not registered for this client');
    }
}

function oauth_error(string $code, string $description, int $status = 400): never {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(['error' => $code, 'error_description' => $description]);
    exit;
}
