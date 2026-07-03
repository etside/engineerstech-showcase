<?php
/**
 * OAuth 2.1 Authorization Server for MCP
 * Spec: RFC 6749 + OAuth 2.1 + PKCE (RFC 7636) + Dynamic Registration (RFC 7591)
 *
 * Endpoints:
 *   GET  /.well-known/oauth-authorization-server  → server metadata
 *   GET  /.well-known/oauth-protected-resource    → resource metadata
 *   POST /oauth/register                          → dynamic client registration
 *   GET  /oauth/authorize                         → authorization endpoint
 *   POST /oauth/token                             → token endpoint
 *   POST /oauth/revoke                            → token revocation
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = preg_replace('#^/api#', '', $uri);
$uri    = rtrim($uri, '/') ?: '/';

match (true) {
    $uri === '/.well-known/oauth-authorization-server'
        => oauth_well_known_as(),
    $uri === '/.well-known/oauth-protected-resource'
        => oauth_well_known_resource(),
    $uri === '/oauth/register' && $method === 'POST'
        => oauth_register(),
    $uri === '/oauth/authorize'
        => oauth_authorize(),
    $uri === '/oauth/token' && $method === 'POST'
        => oauth_token(),
    $uri === '/oauth/revoke' && $method === 'POST'
        => oauth_revoke(),
    default
        => oauth_error('not_found', 'Endpoint not found', 404),
};

// ============================================================
// Server metadata (RFC 8414)
// ============================================================
function oauth_well_known_as(): never {
    $base = oauth_base();
    header('Content-Type: application/json');
    echo json_encode([
        'issuer'                               => $base . '/api/oauth',
        'authorization_endpoint'               => $base . '/api/oauth/authorize',
        'token_endpoint'                       => $base . '/api/oauth/token',
        'revocation_endpoint'                  => $base . '/api/oauth/revoke',
        'registration_endpoint'                => $base . '/api/oauth/register',
        'jwks_uri'                             => $base . '/api/oauth/jwks',
        'scopes_supported'                     => ['mcp:read', 'mcp:write', 'openid', 'profile'],
        'response_types_supported'             => ['code'],
        'grant_types_supported'                => ['authorization_code', 'refresh_token'],
        'token_endpoint_auth_methods_supported'=> ['none', 'client_secret_post'],
        'code_challenge_methods_supported'     => ['S256'],
        'subject_types_supported'              => ['public'],
        'service_documentation'                => $base . '/api-docs',
    ]);
    exit;
}

function oauth_well_known_resource(): never {
    $base = oauth_base();
    header('Content-Type: application/json');
    echo json_encode([
        'resource'                     => $base . '/api/mcp-server',
        'authorization_servers'        => [$base . '/api/oauth'],
        'scopes_supported'             => ['mcp:read', 'mcp:write'],
        'bearer_methods_supported'     => ['header', 'query'],
        'resource_documentation'       => $base . '/api-docs',
    ]);
    exit;
}

// ============================================================
// Dynamic Client Registration (RFC 7591)
// ============================================================
function oauth_register(): never {
    $input       = get_json_input();
    $db          = getDB();

    $clientName  = trim($input['client_name']      ?? '');
    $redirectUris= $input['redirect_uris']          ?? [];
    $grantTypes  = $input['grant_types']            ?? ['authorization_code'];
    $scopes      = trim($input['scope']             ?? 'mcp:read');
    $clientType  = $input['token_endpoint_auth_method'] ?? 'none'; // public client

    if (!$clientName) oauth_error('invalid_request', 'client_name is required');
    if (empty($redirectUris)) oauth_error('invalid_request', 'redirect_uris is required');

    $clientId     = uuid();
    $clientSecret = $clientType !== 'none' ? bin2hex(random_bytes(32)) : null;
    $now          = date('Y-m-d H:i:s');

    $stmt = $db->prepare(
        "INSERT INTO mcp_oauth_clients
           (id, client_name, redirect_uris, grant_types, scopes, client_secret,
            token_endpoint_auth_method, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $clientId,
        $clientName,
        json_encode(array_values($redirectUris)),
        json_encode($grantTypes),
        $scopes,
        $clientSecret ? password_hash($clientSecret, PASSWORD_BCRYPT) : null,
        $clientType,
        $now,
    ]);

    $base = oauth_base();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode(array_filter([
        'client_id'                      => $clientId,
        'client_secret'                  => $clientSecret, // only returned once
        'client_name'                    => $clientName,
        'redirect_uris'                  => $redirectUris,
        'grant_types'                    => $grantTypes,
        'scope'                          => $scopes,
        'token_endpoint_auth_method'     => $clientType,
        'registration_access_token'      => null,
        'registration_client_uri'        => $base . '/api/oauth/register/' . $clientId,
    ]));
    exit;
}

// ============================================================
// Authorization Endpoint
// ============================================================
function oauth_authorize(): never {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        // Show consent page or redirect to front-end auth
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
        oauth_validate_redirect($params['redirect_uri'], $client);

        // Redirect to the front-end consent UI
        $base    = oauth_base();
        $qs      = http_build_query($params);
        header('Location: ' . $base . '/oauth/consent?' . $qs);
        exit;
    }

    if ($method === 'POST') {
        // Front-end POSTs here after user consents
        $input          = get_json_input() ?: $_POST;
        $clientId       = $input['client_id']             ?? '';
        $redirectUri    = $input['redirect_uri']           ?? '';
        $scope          = $input['scope']                  ?? 'mcp:read';
        $state          = $input['state']                  ?? '';
        $challenge      = $input['code_challenge']         ?? '';
        $challengeMethod= $input['code_challenge_method']  ?? 'S256';
        $userId         = null;

        // Require the user to be authenticated (JWT or session)
        $userId = get_user_id();
        if (!$userId) oauth_error('access_denied', 'User not authenticated');

        $db     = getDB();
        $client = oauth_get_client($clientId, $db);
        oauth_validate_redirect($redirectUri, $client);

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
        echo json_encode(['redirect' => $redirectUri . $sep . http_build_query(['code' => $code, 'state' => $state])]);
        exit;
    }

    oauth_error('invalid_request', 'Method not allowed');
}

// ============================================================
// Token Endpoint
// ============================================================
function oauth_token(): never {
    $input     = get_json_input() ?: $_POST;
    $grantType = $input['grant_type'] ?? '';

    match ($grantType) {
        'authorization_code' => oauth_token_auth_code($input),
        'refresh_token'      => oauth_token_refresh($input),
        default              => oauth_error('unsupported_grant_type', 'Unsupported grant type'),
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

    // Validate redirect_uri
    if ($row['redirect_uri'] && $row['redirect_uri'] !== $redirectUri) {
        oauth_error('invalid_grant', 'redirect_uri mismatch');
    }

    // Verify PKCE S256
    $expectedChallenge = rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '=');
    if (!hash_equals($row['code_challenge'], $expectedChallenge)) {
        oauth_error('invalid_grant', 'PKCE code_verifier invalid');
    }

    // Mark code used
    $db->prepare("UPDATE mcp_oauth_codes SET used = 1 WHERE id = ?")->execute([$row['id']]);

    // Issue tokens
    $base         = oauth_base();
    $accessToken  = oauth_issue_jwt($row, $base);
    $refreshToken = bin2hex(random_bytes(32));
    $expiresIn    = 3600;

    $db->prepare(
        "INSERT INTO mcp_oauth_tokens
           (id, access_token, refresh_token, client_id, user_id, scope,
            expires_at, revoked)
         VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND), 0)"
    )->execute([
        uuid(), $accessToken, $refreshToken,
        $row['client_id'], $row['user_id'], $row['scope'],
        $expiresIn,
    ]);

    header('Content-Type: application/json');
    header('Cache-Control: no-store');
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
         LIMIT 1"
    );
    $stmt->execute([$refreshToken, $clientId]);
    $row = $stmt->fetch();
    if (!$row) oauth_error('invalid_grant', 'Invalid refresh token');

    // Revoke old token
    $db->prepare("UPDATE mcp_oauth_tokens SET revoked = 1 WHERE id = ?")->execute([$row['id']]);

    $base        = oauth_base();
    $accessToken = oauth_issue_jwt($row, $base);
    $newRefresh  = bin2hex(random_bytes(32));
    $expiresIn   = 3600;

    $db->prepare(
        "INSERT INTO mcp_oauth_tokens
           (id, access_token, refresh_token, client_id, user_id, scope,
            expires_at, revoked)
         VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND), 0)"
    )->execute([
        uuid(), $accessToken, $newRefresh,
        $row['client_id'], $row['user_id'], $row['scope'],
        $expiresIn,
    ]);

    header('Content-Type: application/json');
    header('Cache-Control: no-store');
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
    header('Content-Type: application/json');
    echo json_encode(['revoked' => true]);
    exit;
}

// ============================================================
// Helpers
// ============================================================
function oauth_issue_jwt(array $row, string $base): string {
    $payload = [
        'iss'       => $base . '/api/oauth',
        'aud'       => $base . '/api/mcp-server',
        'sub'       => $row['user_id'] ?? $row['client_id'],
        'client_id' => $row['client_id'],
        'scope'     => $row['scope'],
        'iat'       => time(),
        'exp'       => time() + 3600,
    ];
    return jwt_encode($payload);
}

function oauth_get_client(string $clientId, PDO $db): array {
    $stmt = $db->prepare("SELECT * FROM mcp_oauth_clients WHERE id = ?");
    $stmt->execute([$clientId]);
    $client = $stmt->fetch();
    if (!$client) oauth_error('invalid_client', 'Unknown client_id');
    return $client;
}

function oauth_validate_redirect(string $uri, array $client): void {
    if (!$uri) return;
    $allowed = json_decode($client['redirect_uris'] ?? '[]', true) ?: [];
    if (!in_array($uri, $allowed, true)) {
        oauth_error('invalid_request', 'redirect_uri not registered for this client');
    }
}

function oauth_base(): string {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
    return $scheme . '://' . $host;
}

function oauth_error(string $code, string $description, int $status = 400): never {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(['error' => $code, 'error_description' => $description]);
    exit;
}
