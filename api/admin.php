<?php
// Admin endpoints

function admin_dashboard() {
    require_admin();
    $db = getDB();

    $stats = [
        'total_businesses' => (int)$db->query("SELECT COUNT(*) FROM businesses")->fetchColumn(),
        'pending_businesses' => (int)$db->query("SELECT COUNT(*) FROM businesses WHERE status = 'pending'")->fetchColumn(),
        'total_users' => (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn(),
        'total_reviews' => (int)$db->query("SELECT COUNT(*) FROM reviews")->fetchColumn(),
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

function admin_set_role(string $user_id) {
    require_super_admin();
    $input = get_json_input();
    $role = $input['role'] ?? '';
    $db = getDB();

    $validRoles = ['admin', 'super_admin', 'vendor'];
    if (!in_array($role, $validRoles)) {
        json_error('Invalid role');
    }

    $stmt = $db->prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)");
    $stmt->execute([uuid(), $user_id, $role]);

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
    json_response($stmt->fetch() ?: null);
}

function admin_update_mcp() {
    require_admin();
    $input = get_json_input();
    $db = getDB();

    $stmt = $db->query("SELECT id FROM mcp_config ORDER BY created_at DESC LIMIT 1");
    $existing = $stmt->fetch();

    if ($existing) {
        $updates = [];
        $params = [];
        foreach (['project_name', 'api_key', 'rate_limit', 'is_active'] as $f) {
            if (array_key_exists($f, $input)) {
                $updates[] = "$f = ?";
                $params[] = $input[$f];
            }
        }
        if (isset($input['enabled_endpoints'])) {
            $updates[] = "enabled_endpoints = ?";
            $params[] = json_encode($input['enabled_endpoints']);
        }
        if (!empty($updates)) {
            $params[] = $existing['id'];
            $stmt = $db->prepare("UPDATE mcp_config SET " . implode(', ', $updates) . " WHERE id = ?");
            $stmt->execute($params);
        }
    } else {
        $stmt = $db->prepare(
            "INSERT INTO mcp_config (id, project_name, api_key, enabled_endpoints, rate_limit, is_active)
             VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            uuid(),
            $input['project_name'] ?? 'engineersTech',
            $input['api_key'] ?? null,
            json_encode($input['enabled_endpoints'] ?? []),
            $input['rate_limit'] ?? 60,
            $input['is_active'] ?? true,
        ]);
    }

    json_response(['message' => 'MCP config updated']);
}
