<?php
// Business endpoints

function businesses_list() {
    $db = getDB();
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(100, max(1, (int)($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    $category = $_GET['category'] ?? '';
    $status = $_GET['status'] ?? '';
    $owner_id = $_GET['owner_id'] ?? '';

    // Admin/super_admin can see all statuses; others see only approved
    $user = null;
    $isPrivileged = false;
    $uid = get_user_id();
    if ($uid) {
        $stmt = $db->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$uid]);
        $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $isPrivileged = in_array('admin', $roles) || in_array('super_admin', $roles);
    }

    if (!$status) {
        $status = $isPrivileged ? '' : 'approved';
    }

    $where = "1=1";
    $params = [];

    if ($status) {
        $where .= " AND b.status = ?";
        $params[] = $status;
    }

    if ($category) {
        $where .= " AND c.slug = ?";
        $params[] = $category;
    }

    if ($owner_id) {
        $where .= " AND b.owner_id = ?";
        $params[] = $owner_id;
    }

    $sql = "SELECT b.*, c.name AS category_name, c.slug AS category_slug
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE $where
            ORDER BY b.is_featured DESC, b.created_at DESC
            LIMIT $limit OFFSET $offset";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $businesses = $stmt->fetchAll();

    // Count total
    $countSql = "SELECT COUNT(*) FROM businesses b LEFT JOIN categories c ON b.category_id = c.id WHERE $where";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    json_response([
        'data' => $businesses,
        'total' => $total,
        'page' => $page,
        'limit' => $limit,
    ]);
}

function businesses_featured() {
    $db = getDB();
    $limit = min(20, max(1, (int)($_GET['limit'] ?? 6)));

    $stmt = $db->prepare(
        "SELECT b.*, c.name AS category_name, c.slug AS category_slug
         FROM businesses b
         LEFT JOIN categories c ON b.category_id = c.id
         WHERE b.status = 'approved' AND b.is_featured = 1
         ORDER BY b.rating DESC
         LIMIT ?"
    );
    $stmt->execute([$limit]);
    json_response($stmt->fetchAll());
}

function businesses_search() {
    $db = getDB();
    $q = trim($_GET['q'] ?? '');
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 20)));

    if (!$q) {
        json_error('Search query required');
    }

    $stmt = $db->prepare(
        "SELECT b.*, c.name AS category_name, c.slug AS category_slug
         FROM businesses b
         LEFT JOIN categories c ON b.category_id = c.id
         WHERE b.status = 'approved'
         AND MATCH(b.name, b.description, b.short_description) AGAINST(? IN BOOLEAN MODE)
         ORDER BY b.rating DESC
         LIMIT ?"
    );
    $stmt->execute([$q . '*', $limit]);
    json_response($stmt->fetchAll());
}

function businesses_stats() {
    $db = getDB();

    $total = (int)$db->query("SELECT COUNT(*) FROM businesses WHERE status = 'approved'")->fetchColumn();
    $countries = (int)$db->query("SELECT COUNT(DISTINCT country) FROM businesses WHERE status = 'approved' AND country IS NOT NULL")->fetchColumn();
    $categories = (int)$db->query("SELECT COUNT(*) FROM categories")->fetchColumn();
    $reviews = (int)$db->query("SELECT COUNT(*) FROM reviews WHERE status = 'approved'")->fetchColumn();

    json_response([
        'total_businesses' => $total,
        'countries' => $categories,
        'categories' => $categories,
        'total_reviews' => $reviews,
    ]);
}

function businesses_get(string $identifier) {
    $db = getDB();

    // Try by slug first, then by ID
    $stmt = $db->prepare(
        "SELECT b.*, c.name AS category_name, c.slug AS category_slug
         FROM businesses b
         LEFT JOIN categories c ON b.category_id = c.id
         WHERE (b.slug = ? OR b.id = ?) AND b.status = 'approved'"
    );
    $stmt->execute([$identifier, $identifier]);
    $business = $stmt->fetch();

    if (!$business) {
        json_error('Business not found', 404);
    }

    // Get reviews
    $stmt = $db->prepare(
        "SELECT r.*, u.email AS author_email
         FROM reviews r
         LEFT JOIN users u ON r.author_id = u.id
         WHERE r.business_id = ? AND r.status = 'approved'
         ORDER BY r.created_at DESC"
    );
    $stmt->execute([$business['id']]);
    $business['reviews'] = $stmt->fetchAll();

    json_response($business);
}

function businesses_create() {
    $user = require_auth();
    $input = get_json_input();

    if (empty($input['name'])) {
        json_error('Business name required');
    }

    $db = getDB();
    $id = uuid();
    $slug = slugify($input['name']);

    // Ensure unique slug
    $stmt = $db->prepare("SELECT id FROM businesses WHERE slug = ?");
    $stmt->execute([$slug]);
    if ($stmt->fetch()) {
        $slug .= '-' . substr($id, 0, 8);
    }

    $stmt = $db->prepare(
        "INSERT INTO businesses (id, owner_id, name, slug, description, short_description, website, email, phone, address, city, country, category_id, logo_url, cover_url, tags, services, social_links, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')"
    );
    $stmt->execute([
        $id, $user['id'], $input['name'], $slug,
        $input['description'] ?? null,
        $input['short_description'] ?? null,
        $input['website'] ?? null,
        $input['email'] ?? null,
        $input['phone'] ?? null,
        $input['address'] ?? null,
        $input['city'] ?? null,
        $input['country'] ?? null,
        $input['category_id'] ?? null,
        $input['logo_url'] ?? null,
        $input['cover_url'] ?? null,
        !empty($input['tags']) ? json_encode($input['tags']) : null,
        !empty($input['services']) ? json_encode($input['services']) : null,
        !empty($input['social_links']) ? json_encode($input['social_links']) : null,
    ]);

    json_response(['id' => $id, 'slug' => $slug], 201);
}

function businesses_update(string $id) {
    $user = require_auth();
    $input = get_json_input();
    $db = getDB();

    // Check ownership or admin
    $stmt = $db->prepare("SELECT owner_id FROM businesses WHERE id = ?");
    $stmt->execute([$id]);
    $biz = $stmt->fetch();

    if (!$biz) json_error('Business not found', 404);

    $isOwner = $biz['owner_id'] === $user['id'];
    $isAdmin = in_array('admin', $user['roles'] ?? []) || in_array('super_admin', $user['roles'] ?? []);

    if (!$isOwner && !$isAdmin) {
        json_error('Not authorized', 403);
    }

    $fields = ['name', 'description', 'short_description', 'website', 'email', 'phone', 'address', 'city', 'country', 'category_id', 'logo_url', 'cover_url'];
    $updates = [];
    $params = [];

    foreach ($fields as $f) {
        if (array_key_exists($f, $input)) {
            $updates[] = "$f = ?";
            $params[] = $input[$f];
        }
    }

    // JSON fields
    foreach (['tags', 'services', 'social_links'] as $f) {
        if (array_key_exists($f, $input)) {
            $updates[] = "$f = ?";
            $params[] = json_encode($input[$f]);
        }
    }

    // Admin-only fields
    if ($isAdmin) {
        foreach (['status', 'is_verified', 'is_featured'] as $f) {
            if (array_key_exists($f, $input)) {
                $updates[] = "$f = ?";
                $params[] = $input[$f];
            }
        }
    }

    if (empty($updates)) {
        json_error('No fields to update');
    }

    $params[] = $id;
    $stmt = $db->prepare("UPDATE businesses SET " . implode(', ', $updates) . " WHERE id = ?");
    $stmt->execute($params);

    json_response(['message' => 'Updated']);
}

function businesses_delete(string $id) {
    $user = require_auth();
    $db = getDB();

    $stmt = $db->prepare("SELECT owner_id FROM businesses WHERE id = ?");
    $stmt->execute([$id]);
    $biz = $stmt->fetch();

    if (!$biz) json_error('Business not found', 404);

    $isOwner = $biz['owner_id'] === $user['id'];
    $isSuperAdmin = in_array('super_admin', $user['roles'] ?? []);

    if (!$isOwner && !$isSuperAdmin) {
        json_error('Not authorized', 403);
    }

    $stmt = $db->prepare("DELETE FROM businesses WHERE id = ?");
    $stmt->execute([$id]);

    json_response(['message' => 'Deleted']);
}
