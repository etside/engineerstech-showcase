<?php
// Review endpoints

function reviews_list() {
    $db = getDB();
    $business_id = $_GET['business_id'] ?? '';
    $status = $_GET['status'] ?? 'approved';
    $limit = min(100, max(1, (int)($_GET['limit'] ?? 50)));

    $where = "r.status = ?";
    $params = [$status];

    if ($business_id) {
        $where .= " AND r.business_id = ?";
        $params[] = $business_id;
    }

    $params[] = $limit;
    $stmt = $db->prepare(
        "SELECT r.*, u.email AS author_email
         FROM reviews r
         LEFT JOIN users u ON r.author_id = u.id
         WHERE $where
         ORDER BY r.created_at DESC
         LIMIT ?"
    );
    $stmt->execute($params);
    json_response($stmt->fetchAll());
}

function reviews_create() {
    $user = require_auth();
    $input = get_json_input();

    if (empty($input['business_id']) || empty($input['rating'])) {
        json_error('business_id and rating required');
    }

    $rating = max(1, min(5, (int)$input['rating']));
    $db = getDB();
    $id = uuid();

    $stmt = $db->prepare(
        "INSERT INTO reviews (id, business_id, author_id, rating, title, body, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')"
    );
    $stmt->execute([
        $id, $input['business_id'], $user['id'], $rating,
        $input['title'] ?? null, $input['body'] ?? null,
    ]);

    // Update business average rating
    $stmt = $db->prepare(
        "UPDATE businesses SET
         rating = (SELECT AVG(rating) FROM reviews WHERE business_id = ? AND status = 'approved'),
         review_count = (SELECT COUNT(*) FROM reviews WHERE business_id = ? AND status = 'approved')
         WHERE id = ?"
    );
    $stmt->execute([$input['business_id'], $input['business_id'], $input['business_id']]);

    json_response(['id' => $id], 201);
}

function reviews_update(string $id) {
    $user = require_auth();
    $input = get_json_input();
    $db = getDB();

    // Admin only
    $stmt = $db->prepare("SELECT role FROM user_roles WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('admin', $roles) && !in_array('super_admin', $roles)) {
        json_error('Admin access required', 403);
    }

    $updates = [];
    $params = [];

    if (isset($input['status'])) {
        $updates[] = "status = ?";
        $params[] = $input['status'];
    }

    if (empty($updates)) json_error('No fields to update');

    $params[] = $id;
    $stmt = $db->prepare("UPDATE reviews SET " . implode(', ', $updates) . " WHERE id = ?");
    $stmt->execute($params);

    json_response(['message' => 'Updated']);
}

function reviews_delete(string $id) {
    $user = require_auth();
    $db = getDB();

    $stmt = $db->prepare("SELECT role FROM user_roles WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('super_admin', $roles)) {
        json_error('Super admin access required', 403);
    }

    $stmt = $db->prepare("DELETE FROM reviews WHERE id = ?");
    $stmt->execute([$id]);

    json_response(['message' => 'Deleted']);
}
