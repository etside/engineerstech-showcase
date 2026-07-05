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
    ensure_business_profile_column($db);
    $q = trim($_GET['q'] ?? '');
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 20)));
    $service = trim($_GET['service'] ?? '');

    if (!$q) {
        json_error('Search query required');
    }

    $sql = "SELECT b.*, c.name AS category_name, c.slug AS category_slug
            FROM businesses b
            LEFT JOIN categories c ON b.category_id = c.id
            WHERE b.status = 'approved'
              AND (
                    MATCH(b.name, b.description, b.short_description) AGAINST(? IN BOOLEAN MODE)
                    OR LOWER(CAST(b.profile_data AS CHAR)) LIKE ?
              )";
    $params = [$q . '*', '%' . strtolower($q) . '%'];

    if ($service) {
        $sql .= " AND (LOWER(CAST(b.profile_data AS CHAR)) LIKE ? OR JSON_SEARCH(LOWER(b.services), 'one', ?) IS NOT NULL)";
        $params[] = '%' . strtolower($service) . '%';
        $params[] = '%' . strtolower($service) . '%';
    }

    $sql .= " ORDER BY b.is_featured DESC, b.rating DESC, b.review_count DESC LIMIT ?";
    $params[] = $limit;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
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
    ensure_business_profile_column($db);

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

    $profileData = json_decode($business['profile_data'] ?? 'null', true) ?: [];
    if (!empty($profileData)) {
        $business['profile_data'] = $profileData;
        $business['profile_completeness'] = $profileData['profile_completeness'] ?? calculate_profile_completeness($profileData);
        $business['structured_data'] = $profileData['structured_data'] ?? build_business_structured_data($business, $profileData);
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
    ensure_business_profile_column($db);
    $id = uuid();
    $slug = slugify($input['name']);

    // Ensure unique slug
    $stmt = $db->prepare("SELECT id FROM businesses WHERE slug = ?");
    $stmt->execute([$slug]);
    if ($stmt->fetch()) {
        $slug .= '-' . substr($id, 0, 8);
    }

    $profileData = merge_business_profile_data([
        'name' => $input['name'] ?? null,
        'description' => $input['description'] ?? null,
        'short_description' => $input['short_description'] ?? null,
        'website' => $input['website'] ?? null,
        'email' => $input['email'] ?? null,
        'phone' => $input['phone'] ?? null,
        'address' => $input['address'] ?? null,
        'city' => $input['city'] ?? null,
        'country' => $input['country'] ?? null,
        'categories' => $input['categories'] ?? null,
        'services' => $input['services'] ?? null,
        'industries' => $input['industries'] ?? null,
        'technologies' => $input['technologies'] ?? null,
        'certifications' => $input['certifications'] ?? null,
        'awards' => $input['awards'] ?? null,
        'portfolio' => $input['portfolio'] ?? null,
        'case_studies' => $input['case_studies'] ?? null,
        'testimonials' => $input['testimonials'] ?? null,
        'team_size' => $input['team_size'] ?? null,
        'years_in_business' => $input['years_in_business'] ?? null,
        'pricing' => $input['pricing'] ?? null,
        'minimum_project_size' => $input['minimum_project_size'] ?? null,
        'hourly_rate' => $input['hourly_rate'] ?? null,
        'headquarters' => $input['headquarters'] ?? null,
        'service_locations' => $input['service_locations'] ?? null,
        'languages' => $input['languages'] ?? null,
        'contact_information' => [
            'email' => $input['email'] ?? null,
            'phone' => $input['phone'] ?? null,
            'address' => $input['address'] ?? null,
            'city' => $input['city'] ?? null,
            'country' => $input['country'] ?? null,
        ],
        'social_profiles' => $input['social_profiles'] ?? null,
        'external_links' => $input['external_links'] ?? null,
        'business_attributes' => $input['business_attributes'] ?? null,
        'accessibility_features' => $input['accessibility_features'] ?? null,
        'delivery_methods' => $input['delivery_methods'] ?? null,
        'appointment_options' => $input['appointment_options'] ?? null,
        'verification_status' => $input['verification_status'] ?? 'unverified',
        'seo_metadata' => $input['seo_metadata'] ?? null,
        'structured_data' => $input['structured_data'] ?? null,
    ], []);

    $stmt = $db->prepare(
        "INSERT INTO businesses (id, owner_id, name, slug, description, short_description, website, email, phone, address, city, country, category_id, logo_url, cover_url, tags, services, social_links, status, profile_data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)"
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
        json_encode($profileData),
    ]);

    json_response(['id' => $id, 'slug' => $slug], 201);
}

function businesses_update(string $id) {
    $user = require_auth();
    $input = get_json_input();
    $db = getDB();
    ensure_business_profile_column($db);

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

    $existingProfile = [];
    if (!empty($biz['profile_data'])) {
        $existingProfile = json_decode($biz['profile_data'], true) ?: [];
    }

    $profileData = merge_business_profile_data($input, $existingProfile);

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

    if (!empty($profileData)) {
        $updates[] = "profile_data = ?";
        $params[] = json_encode($profileData);
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
