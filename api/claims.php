<?php
// Claim endpoints

function claims_list() {
    $user = require_auth();
    $business_id = $_GET['business_id'] ?? '';
    $db = getDB();

    $where = "bc.claimant_id = ?";
    $params = [$user['id']];

    if ($business_id) {
        $where .= " AND bc.business_id = ?";
        $params[] = $business_id;
    }

    $stmt = $db->prepare(
        "SELECT bc.*, b.name AS business_name
         FROM business_claims bc
         JOIN businesses b ON bc.business_id = b.id
         WHERE $where
         ORDER BY bc.created_at DESC"
    );
    $stmt->execute($params);
    json_response($stmt->fetchAll());
}

function claims_audit_log() {
    require_auth();
    $business_id = $_GET['business_id'] ?? '';
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 20)));
    $db = getDB();

    if (!$business_id) json_error('business_id required');

    $stmt = $db->prepare(
        "SELECT cal.*, u.email AS actor_email
         FROM claim_audit_log cal
         LEFT JOIN users u ON cal.actor_id = u.id
         WHERE cal.claim_id IN (SELECT id FROM business_claims WHERE business_id = ?)
         ORDER BY cal.created_at DESC
         LIMIT ?"
    );
    $stmt->execute([$business_id, $limit]);
    json_response($stmt->fetchAll());
}

function claims_create() {
    $user = require_auth();
    $input = get_json_input();

    if (empty($input['business_id']) || empty($input['evidence'])) {
        json_error('business_id and evidence required');
    }

    $db = getDB();
    $id = uuid();

    $stmt = $db->prepare(
        "INSERT INTO business_claims (id, business_id, claimant_id, evidence, claim_type)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $id, $input['business_id'], $user['id'], $input['evidence'],
        $input['claim_type'] ?? 'ownership',
    ]);

    // Audit log
    $stmt = $db->prepare(
        "INSERT INTO claim_audit_log (id, claim_id, action, actor_id, details)
         VALUES (?, ?, 'submitted', ?, ?)"
    );
    $stmt->execute([uuid(), $id, $user['id'], json_encode(['claim_type' => $input['claim_type'] ?? 'ownership'])]);

    json_response(['id' => $id], 201);
}
