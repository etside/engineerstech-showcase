<?php
// Services API — service listings from businesses

function services_list() {
    $db = getDB();
    $where = ["s.status = 'active'"];
    $params = [];

    if (!empty($_GET['business_id'])) {
        $where[] = "s.business_id = ?";
        $params[] = $_GET['business_id'];
    }
    if (!empty($_GET['seller_id'])) {
        $where[] = "s.seller_id = ?";
        $params[] = $_GET['seller_id'];
    }
    if (!empty($_GET['search'])) {
        $where[] = "MATCH(s.name, s.description, s.short_description) AGAINST(? IN BOOLEAN MODE)";
        $params[] = $_GET['search'];
    }
    if (isset($_GET['is_featured']) && $_GET['is_featured'] === '1') {
        $where[] = "s.is_featured = 1";
    }

    $page = max(1, (int)($_GET['page'] ?? 1));
    $per_page = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
    $offset = ($page - 1) * $per_page;

    $whereClause = implode(' AND ', $where);

    $countStmt = $db->prepare("SELECT COUNT(*) FROM services s WHERE $whereClause");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $stmt = $db->prepare("
        SELECT s.*, b.name as business_name, b.slug as business_slug, b.logo_url,
               u.email as seller_email
        FROM services s
        LEFT JOIN businesses b ON s.business_id = b.id
        LEFT JOIN users u ON s.seller_id = u.id
        WHERE $whereClause
        ORDER BY s.is_featured DESC, s.created_at DESC
        LIMIT $per_page OFFSET $offset
    ");
    $stmt->execute($params);
    json_response([
        'data' => $stmt->fetchAll(),
        'current_page' => $page,
        'last_page' => ceil($total / $per_page),
        'per_page' => $per_page,
        'total' => $total,
    ]);
}

function services_get($id) {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT s.*, b.name as business_name, b.slug as business_slug, b.logo_url,
               b.description as business_description, u.email as seller_email
        FROM services s
        LEFT JOIN businesses b ON s.business_id = b.id
        LEFT JOIN users u ON s.seller_id = u.id
        WHERE (s.id = ? OR s.slug = ?) AND s.status = 'active'
    ");
    $stmt->execute([$id, $id]);
    $service = $stmt->fetch();
    if (!$service) json_error('Service not found', 404);
    json_response($service);
}

function services_create() {
    $user = require_auth();
    $data = get_json_input();

    if (empty($data['name']) || empty($data['business_id'])) {
        json_error('Name and business_id are required');
    }

    $db = getDB();

    // Verify business ownership
    $bCheck = $db->prepare("SELECT id FROM businesses WHERE id = ? AND owner_id = ?");
    $bCheck->execute([$data['business_id'], $user['id']]);
    if (!$bCheck->fetch() && !in_array('admin', $user['roles'])) {
        json_error('Not authorized to add services to this business', 403);
    }

    $id = uuid();
    $slug = slugify($data['name']) . '-' . substr($id, 0, 8);
    $features = $data['features'] ?? [];

    $db->prepare("
        INSERT INTO services (id, business_id, seller_id, category_id, name, slug, description,
            short_description, price_type, price, price_from, currency, images, featured_image,
            features, delivery_time, revisions, tags, status, is_featured, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ")->execute([
        $id, $data['business_id'], $user['id'], $data['category_id'] ?? null,
        $data['name'], $slug, $data['description'] ?? null,
        $data['short_description'] ?? null, $data['price_type'] ?? 'custom',
        $data['price'] ?? null, $data['price_from'] ?? null, $data['currency'] ?? 'BDT',
        json_encode($data['images'] ?? []), $data['featured_image'] ?? null,
        json_encode($features), $data['delivery_time'] ?? null,
        $data['revisions'] ?? 1, json_encode($data['tags'] ?? []),
        $data['status'] ?? 'draft', $data['is_featured'] ?? 0,
    ]);

    $stmt = $db->prepare("SELECT * FROM services WHERE id = ?");
    $stmt->execute([$id]);
    json_response($stmt->fetch(), 201);
}

function services_update($id) {
    $user = require_auth();
    $data = get_json_input();
    $db = getDB();

    $stmt = $db->prepare("SELECT seller_id FROM services WHERE id = ?");
    $stmt->execute([$id]);
    $service = $stmt->fetch();
    if (!$service) json_error('Service not found', 404);
    if ($service['seller_id'] !== $user['id'] && !in_array('admin', $user['roles'])) {
        json_error('Not authorized', 403);
    }

    $fields = ['name','description','short_description','price_type','price','price_from',
               'currency','featured_image','delivery_time','revisions','status','is_featured','category_id'];
    $sets = [];
    $params = [];
    foreach ($fields as $f) {
        if (array_key_exists($f, $data)) {
            $sets[] = "$f = ?";
            $params[] = $data[$f];
        }
    }
    if (isset($data['images'])) {
        $sets[] = "images = ?";
        $params[] = json_encode($data['images']);
    }
    if (isset($data['features'])) {
        $sets[] = "features = ?";
        $params[] = json_encode($data['features']);
    }
    if (isset($data['tags'])) {
        $sets[] = "tags = ?";
        $params[] = json_encode($data['tags']);
    }

    if (!empty($sets)) {
        $params[] = $id;
        $db->prepare("UPDATE services SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);
    }

    $stmt = $db->prepare("SELECT * FROM services WHERE id = ?");
    $stmt->execute([$id]);
    json_response($stmt->fetch());
}

function services_delete($id) {
    $user = require_auth();
    $db = getDB();

    $stmt = $db->prepare("SELECT seller_id FROM services WHERE id = ?");
    $stmt->execute([$id]);
    $service = $stmt->fetch();
    if (!$service) json_error('Service not found', 404);
    if ($service['seller_id'] !== $user['id'] && !in_array('admin', $user['roles'])) {
        json_error('Not authorized', 403);
    }

    $db->prepare("DELETE FROM services WHERE id = ?")->execute([$id]);
    json_response(['deleted' => true]);
}

// ── Service orders ──
function service_orders_create() {
    $data = get_json_input();
    if (empty($data['service_id']) || empty($data['requirements'])) {
        json_error('service_id and requirements are required');
    }

    $db = getDB();
    $userId = get_user_id();

    $stmt = $db->prepare("SELECT * FROM services WHERE id = ? AND status = 'active'");
    $stmt->execute([$data['service_id']]);
    $service = $stmt->fetch();
    if (!$service) json_error('Service not found');

    $orderId = uuid();
    $orderNumber = 'SVC-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(4)));

    $db->prepare("INSERT INTO service_orders (id, order_number, service_id, buyer_id, buyer_email, buyer_phone, seller_id, status, payment_status, amount, requirements) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid', ?, ?)")
        ->execute([
            $orderId, $orderNumber, $data['service_id'], $userId,
            $data['buyer_email'] ?? null, $data['buyer_phone'] ?? null,
            $service['seller_id'], $service['price'] ?? $service['price_from'] ?? 0,
            $data['requirements'],
        ]);

    // Increment order count
    $db->prepare("UPDATE services SET order_count = order_count + 1 WHERE id = ?")->execute([$data['service_id']]);

    $stmt = $db->prepare("SELECT * FROM service_orders WHERE id = ?");
    $stmt->execute([$orderId]);
    json_response($stmt->fetch(), 201);
}
