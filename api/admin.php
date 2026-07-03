<?php
// Admin endpoints

function admin_dashboard() {
    require_admin();
    $db = getDB();

    $stats = [
        'total_businesses' => (int)$db->query("SELECT COUNT(*) FROM businesses")->fetchColumn(),
        'pending_claims' => (int)$db->query("SELECT COUNT(*) FROM business_claims WHERE status = 'pending'")->fetchColumn(),
        'pending_reviews' => (int)$db->query("SELECT COUNT(*) FROM reviews WHERE status = 'pending'")->fetchColumn(),
        'total_subscribers' => (int)$db->query("SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = 1")->fetchColumn(),
        'total_messages' => (int)$db->query("SELECT COUNT(*) FROM contact_messages")->fetchColumn(),
        'unread_messages' => (int)$db->query("SELECT COUNT(*) FROM contact_messages WHERE is_read = 0")->fetchColumn(),
    ];

    json_response($stats);
}

function admin_users() {
    require_admin();
    $db = getDB();

    $stmt = $db->query(
        "SELECT u.id, u.email, u.created_at,
         GROUP_CONCAT(ur.role) AS roles
         FROM users u
         LEFT JOIN user_roles ur ON u.id = ur.user_id
         GROUP BY u.id
         ORDER BY u.created_at DESC"
    );

    $users = $stmt->fetchAll();
    foreach ($users as &$u) {
        $u['roles'] = $u['roles'] ? explode(',', $u['roles']) : [];
    }

    json_response($users);
}

function admin_set_role(string $user_id_or_email) {
    require_super_admin();
    $input = get_json_input();
    $role = $input['role'] ?? '';
    $action = $input['action'] ?? 'grant'; // 'grant' or 'revoke'
    $db = getDB();

    // Resolve user_id from email if needed
    $user_id = $user_id_or_email;
    if (strpos($user_id_or_email, '@') !== false) {
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$user_id_or_email]);
        $found = $stmt->fetch();
        if (!$found) json_error('User not found');
        $user_id = $found['id'];
    }

    if ($action === 'revoke') {
        $stmt = $db->prepare("DELETE FROM user_roles WHERE user_id = ? AND role = ?");
        $stmt->execute([$user_id, $role]);
    } else {
        $validRoles = ['admin', 'super_admin', 'vendor'];
        if (!in_array($role, $validRoles)) {
            json_error('Invalid role');
        }
        $stmt = $db->prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)");
        $stmt->execute([uuid(), $user_id, $role]);
    }

    json_response(['message' => 'Role assigned']);
}

function admin_get_settings() {
    require_admin();
    $db = getDB();

    $stmt = $db->query("SELECT `key`, value FROM platform_settings");
    $settings = [];
    while ($row = $stmt->fetch()) {
        $settings[$row['key']] = json_decode($row['value'], true);
    }

    json_response($settings);
}

function admin_update_settings() {
    require_admin();
    $input = get_json_input();
    $db = getDB();

    foreach ($input as $key => $value) {
        $stmt = $db->prepare("INSERT INTO platform_settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)");
        $stmt->execute([$key, json_encode($value)]);
    }

    json_response(['message' => 'Settings updated']);
}

function admin_claims() {
    require_admin();
    $db = getDB();

    $stmt = $db->query(
        "SELECT bc.*, b.name AS business_name, u.email AS claimant_email
         FROM business_claims bc
         JOIN businesses b ON bc.business_id = b.id
         JOIN users u ON bc.claimant_id = u.id
         ORDER BY bc.created_at DESC"
    );

    json_response($stmt->fetchAll());
}

function admin_review_claim(string $claim_id) {
    require_admin();
    $input = get_json_input();
    $status = $input['status'] ?? '';
    $db = getDB();

    if (!in_array($status, ['approved', 'rejected'])) {
        json_error('Invalid status');
    }

    $stmt = $db->prepare("UPDATE business_claims SET status = ?, reviewed_at = NOW() WHERE id = ?");
    $stmt->execute([$status, $claim_id]);

    // If approved, assign vendor role
    if ($status === 'approved') {
        $stmt = $db->prepare("SELECT claimant_id, business_id FROM business_claims WHERE id = ?");
        $stmt->execute([$claim_id]);
        $claim = $stmt->fetch();

        if ($claim) {
            $stmt = $db->prepare("UPDATE businesses SET owner_id = ? WHERE id = ?");
            $stmt->execute([$claim['claimant_id'], $claim['business_id']]);

            $stmt = $db->prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'vendor') ON DUPLICATE KEY UPDATE role = VALUES(role)");
            $stmt->execute([uuid(), $claim['claimant_id']]);
        }
    }

    json_response(['message' => 'Claim ' . $status]);
}

function admin_mcp_config() {
    require_admin();
    $db = getDB();
    $stmt = $db->query("SELECT * FROM mcp_config ORDER BY created_at DESC LIMIT 1");
    $cfg = $stmt->fetch();
    if ($cfg) {
        $cfg['hidden_tools'] = json_decode($cfg['hidden_tools'] ?? '[]', true) ?: [];
    }
    json_response($cfg ?: null);
}

function admin_update_mcp() {
    require_admin();
    $input = get_json_input();
    $db    = getDB();

    $stmt    = $db->query("SELECT id FROM mcp_config ORDER BY created_at DESC LIMIT 1");
    $existing = $stmt->fetch();

    $allowedFields = ['server_name', 'api_token', 'enabled', 'allow_write', 'rate_limit',
                      'expires_at', 'token_last_rotated_at'];

    if ($existing) {
        $updates = [];
        $params  = [];
        foreach ($allowedFields as $f) {
            if (array_key_exists($f, $input)) {
                $updates[] = "`$f` = ?";
                $params[]  = $input[$f];
            }
        }
        if (isset($input['hidden_tools'])) {
            $updates[] = "hidden_tools = ?";
            $params[]  = json_encode($input['hidden_tools']);
        }
        if (!empty($updates)) {
            $params[] = $existing['id'];
            $db->prepare("UPDATE mcp_config SET " . implode(', ', $updates) . " WHERE id = ?")
               ->execute($params);
        }
    } else {
        $db->prepare(
            "INSERT INTO mcp_config (id, server_name, api_token, enabled, allow_write, rate_limit)
             VALUES (?, ?, ?, ?, ?, ?)"
        )->execute([
            uuid(),
            $input['server_name'] ?? 'engineersTech MCP',
            $input['api_token']   ?? null,
            $input['enabled']     ?? true,
            $input['allow_write'] ?? false,
            $input['rate_limit']  ?? 60,
        ]);
    }

    json_response(['message' => 'MCP config updated']);
}

function admin_mcp_analytics() {
    require_admin();
    $db = getDB();

    $totalCalls = (int)$db->query("SELECT COUNT(*) FROM mcp_call_log")->fetchColumn();

    $stmt = $db->query(
        "SELECT tool_name, COUNT(*) AS calls
         FROM mcp_call_log
         GROUP BY tool_name ORDER BY calls DESC"
    );
    $byTool = $stmt->fetchAll();

    $stmt = $db->query(
        "SELECT client_id, COUNT(*) AS calls
         FROM mcp_call_log
         GROUP BY client_id ORDER BY calls DESC LIMIT 20"
    );
    $byClient = $stmt->fetchAll();

    $stmt = $db->query(
        "SELECT DATE(called_at) AS day, COUNT(*) AS calls
         FROM mcp_call_log
         WHERE called_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         GROUP BY day ORDER BY day ASC"
    );
    $daily = $stmt->fetchAll();

    json_response([
        'total_calls' => $totalCalls,
        'by_tool'     => $byTool,
        'by_client'   => $byClient,
        'daily'       => $daily,
    ]);
}

function admin_mcp_clients() {
    require_admin();
    $db   = getDB();
    $stmt = $db->query("SELECT id, client_name, scopes, redirect_uris, grant_types, token_endpoint_auth_method, created_at FROM mcp_oauth_clients ORDER BY created_at DESC");
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r['redirect_uris'] = json_decode($r['redirect_uris'], true);
        $r['grant_types']   = json_decode($r['grant_types'],   true);
    }
    json_response($rows);
}

function admin_mcp_create_client() {
    require_admin();
    $input = get_json_input();
    $db    = getDB();

    $clientId = uuid();
    $db->prepare(
        "INSERT INTO mcp_oauth_clients (id, client_name, redirect_uris, grant_types, scopes)
         VALUES (?, ?, ?, ?, ?)"
    )->execute([
        $clientId,
        $input['client_name']  ?? 'Unnamed Client',
        json_encode($input['redirect_uris'] ?? []),
        json_encode($input['grant_types']   ?? ['authorization_code']),
        $input['scope']        ?? 'mcp:read',
    ]);

    json_response(['id' => $clientId, 'message' => 'Client registered']);
}

function admin_mcp_delete_client(string $clientId) {
    require_admin();
    $db = getDB();
    $db->prepare("DELETE FROM mcp_oauth_clients WHERE id = ?")->execute([$clientId]);
    json_response(['message' => 'Client deleted']);
}

// ── Vendor MCP key management ────────────────────────────────────────────────

function vendor_mcp_keys() {
    $user = require_auth();
    $db   = getDB();

    $stmt = $db->prepare(
        "SELECT id, name, LEFT(`key`, 8) AS key_prefix, scopes,
                is_active, expires_at, last_used, created_at
         FROM api_keys
         WHERE business_id IN (SELECT id FROM businesses WHERE owner_id = ?)
         ORDER BY created_at DESC"
    );
    $stmt->execute([$user['id']]);
    json_response($stmt->fetchAll());
}

function vendor_mcp_create_key() {
    $user  = require_auth();
    $input = get_json_input();
    $db    = getDB();

    // Verify the business belongs to this vendor
    $bizId = $input['business_id'] ?? '';
    $stmt  = $db->prepare("SELECT id FROM businesses WHERE id = ? AND owner_id = ?");
    $stmt->execute([$bizId, $user['id']]);
    if (!$stmt->fetch()) json_error('Business not found or not owned by you', 403);

    $keyValue = 'mcp_' . bin2hex(random_bytes(24));
    $keyId    = uuid();

    $db->prepare(
        "INSERT INTO api_keys (id, business_id, name, `key`, permissions, is_active)
         VALUES (?, ?, ?, ?, ?, 1)"
    )->execute([
        $keyId, $bizId,
        $input['name'] ?? 'MCP Key',
        $keyValue,
        json_encode(['mcp:read']),
    ]);

    json_response(['id' => $keyId, 'key' => $keyValue, 'message' => 'Save this key — it will not be shown again.']);
}

function vendor_mcp_revoke_key(string $keyId) {
    $user = require_auth();
    $db   = getDB();

    // Ensure ownership
    $stmt = $db->prepare(
        "SELECT k.id FROM api_keys k
         JOIN businesses b ON k.business_id = b.id
         WHERE k.id = ? AND b.owner_id = ?"
    );
    $stmt->execute([$keyId, $user['id']]);
    if (!$stmt->fetch()) json_error('Key not found or access denied', 403);

    $db->prepare("UPDATE api_keys SET is_active = 0 WHERE id = ?")->execute([$keyId]);
    json_response(['message' => 'Key revoked']);
}

// ── AI Listing management ─────────────────────────────────────────────────────

/**
 * GET /admin/ai-listings
 * Returns all businesses with their ai_listing_enabled status + tier.
 */
function admin_ai_listings() {
    require_admin();
    $db = getDB();

    $stmt = $db->query(
        "SELECT b.id, b.name, b.slug, b.tier, b.status,
                b.is_verified, b.is_featured,
                b.ai_listing_enabled, b.ai_listing_source, b.ai_listing_updated_at,
                b.rating, b.review_count,
                c.name AS category_name,
                u.email AS owner_email
         FROM businesses b
         LEFT JOIN categories c ON b.category_id = c.id
         LEFT JOIN users u ON b.owner_id = u.id
         ORDER BY b.ai_listing_enabled DESC, b.is_featured DESC, b.rating DESC"
    );
    json_response($stmt->fetchAll());
}

/**
 * PUT /admin/ai-listings/<business_id>
 * Toggle ai_listing_enabled. Admin can set it regardless of payment.
 */
function admin_toggle_ai_listing(string $businessId) {
    require_admin();
    $input   = get_json_input();
    $enabled = isset($input['enabled']) ? (bool)$input['enabled'] : null;
    if ($enabled === null) json_error('enabled (bool) is required');

    $db   = getDB();
    $stmt = $db->prepare("SELECT id FROM businesses WHERE id = ?");
    $stmt->execute([$businessId]);
    if (!$stmt->fetch()) json_error('Business not found', 404);

    $db->prepare(
        "UPDATE businesses
         SET ai_listing_enabled    = ?,
             ai_listing_source     = 'admin',
             ai_listing_updated_at = NOW()
         WHERE id = ?"
    )->execute([(int)$enabled, $businessId]);

    json_response(['message' => $enabled ? 'AI listing enabled' : 'AI listing disabled']);
}

/**
 * Called from payment webhook — auto-enables AI listing for paid tiers.
 */
function auto_enable_ai_listing_on_payment(string $businessId, string $tier) {
    $aiTiers = ['pro', 'featured', 'enterprise'];
    if (!in_array($tier, $aiTiers, true)) return;
    $db = getDB();
    $db->prepare(
        "UPDATE businesses
         SET ai_listing_enabled    = 1,
             ai_listing_source     = 'paid',
             tier                  = ?,
             ai_listing_updated_at = NOW()
         WHERE id = ?"
    )->execute([$tier, $businessId]);
}
