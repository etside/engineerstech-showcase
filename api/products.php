<?php
// Products API — marketplace product CRUD

function products_list() {
    $db = getDB();
    $params = [];
    $where = ["p.status = 'active'"];

    // Filters
    if (!empty($_GET['category_id'])) {
        $where[] = "p.category_id = ?";
        $params[] = $_GET['category_id'];
    }
    if (!empty($_GET['seller_id'])) {
        $where[] = "p.seller_id = ?";
        $params[] = $_GET['seller_id'];
    }
    if (!empty($_GET['search'])) {
        $where[] = "MATCH(p.name, p.description, p.short_description) AGAINST(? IN BOOLEAN MODE)";
        $params[] = $_GET['search'];
    }
    if (!empty($_GET['min_price'])) {
        $where[] = "p.price >= ?";
        $params[] = $_GET['min_price'];
    }
    if (!empty($_GET['max_price'])) {
        $where[] = "p.price <= ?";
        $params[] = $_GET['max_price'];
    }
    if (isset($_GET['is_featured']) && $_GET['is_featured'] === '1') {
        $where[] = "p.is_featured = 1";
    }

    $page = max(1, (int)($_GET['page'] ?? 1));
    $per_page = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
    $offset = ($page - 1) * $per_page;

    $sort = $_GET['sort'] ?? 'newest';
    $orderBy = match($sort) {
        'price_asc'  => 'p.price ASC',
        'price_desc' => 'p.price DESC',
        'popular'    => 'p.sales_count DESC',
        'rating'     => 'p.rating DESC',
        default      => 'p.created_at DESC',
    };

    $whereClause = implode(' AND ', $where);

    // Count
    $countStmt = $db->prepare("SELECT COUNT(*) FROM products p WHERE $whereClause");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // Fetch
    $sql = "SELECT p.*, pc.name as category_name, pc.slug as category_slug,
                   u.email as seller_email
            FROM products p
            LEFT JOIN product_categories pc ON p.category_id = pc.id
            LEFT JOIN users u ON p.seller_id = u.id
            WHERE $whereClause
            ORDER BY $orderBy
            LIMIT $per_page OFFSET $offset";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    json_response([
        'data' => $products,
        'current_page' => $page,
        'last_page' => ceil($total / $per_page),
        'per_page' => $per_page,
        'total' => $total,
    ]);
}

function products_get($id) {
    $db = getDB();
    $stmt = $db->prepare("
        SELECT p.*, pc.name as category_name, pc.slug as category_slug,
               u.email as seller_email
        FROM products p
        LEFT JOIN product_categories pc ON p.category_id = pc.id
        LEFT JOIN users u ON p.seller_id = u.id
        WHERE (p.id = ? OR p.slug = ?) AND p.status = 'active'
    ");
    $stmt->execute([$id, $id]);
    $product = $stmt->fetch();
    if (!$product) json_error('Product not found', 404);

    // Get variants
    $vStmt = $db->prepare("SELECT * FROM product_variants WHERE product_id = ? AND is_active = 1 ORDER BY sort_order");
    $vStmt->execute([$product['id']]);
    $product['variants'] = $vStmt->fetchAll();

    // Get reviews
    $rStmt = $db->prepare("SELECT pr.*, u.email as reviewer_email FROM product_reviews pr LEFT JOIN users u ON pr.user_id = u.id WHERE pr.product_id = ? AND pr.status = 'approved' ORDER BY pr.created_at DESC LIMIT 10");
    $rStmt->execute([$product['id']]);
    $product['reviews'] = $rStmt->fetchAll();

    json_response($product);
}

function products_create() {
    $user = require_auth();
    $data = get_json_input();

    if (empty($data['name']) || !isset($data['price'])) {
        json_error('Name and price are required');
    }

    $db = getDB();
    $id = uuid();
    $slug = slugify($data['name']) . '-' . substr($id, 0, 8);

    $images = $data['images'] ?? [];
    $tags = $data['tags'] ?? [];

    $stmt = $db->prepare("
        INSERT INTO products (id, seller_id, business_id, category_id, name, slug, description,
            short_description, price, compare_at_price, currency, sku, barcode, stock,
            track_inventory, weight, images, featured_image, tags, status, is_featured,
            meta_title, meta_description, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $id, $user['id'], $data['business_id'] ?? null, $data['category_id'] ?? null,
        $data['name'], $slug, $data['description'] ?? null,
        $data['short_description'] ?? null, $data['price'], $data['compare_at_price'] ?? null,
        $data['currency'] ?? 'BDT', $data['sku'] ?? null, $data['barcode'] ?? null,
        $data['stock'] ?? 0, $data['track_inventory'] ?? 1, $data['weight'] ?? null,
        json_encode($images), $data['featured_image'] ?? null, json_encode($tags),
        $data['status'] ?? 'draft', $data['is_featured'] ?? 0,
        $data['meta_title'] ?? null, $data['meta_description'] ?? null,
    ]);

    $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    json_response($stmt->fetch(), 201);
}

function products_update($id) {
    $user = require_auth();
    $data = get_json_input();
    $db = getDB();

    // Verify ownership
    $stmt = $db->prepare("SELECT seller_id FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    if (!$product) json_error('Product not found', 404);
    if ($product['seller_id'] !== $user['id'] && !in_array('admin', $user['roles'])) {
        json_error('Not authorized', 403);
    }

    $fields = ['name','description','short_description','price','compare_at_price','currency',
               'sku','barcode','stock','track_inventory','weight','featured_image','status',
               'is_featured','category_id','business_id','meta_title','meta_description'];
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
    if (isset($data['tags'])) {
        $sets[] = "tags = ?";
        $params[] = json_encode($data['tags']);
    }

    if (!empty($sets)) {
        $params[] = $id;
        $db->prepare("UPDATE products SET " . implode(', ', $sets) . " WHERE id = ?")->execute($params);
    }

    $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    json_response($stmt->fetch());
}

function products_delete($id) {
    $user = require_auth();
    $db = getDB();

    $stmt = $db->prepare("SELECT seller_id FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    if (!$product) json_error('Product not found', 404);
    if ($product['seller_id'] !== $user['id'] && !in_array('admin', $user['roles'])) {
        json_error('Not authorized', 403);
    }

    $db->prepare("DELETE FROM products WHERE id = ?")->execute([$id]);
    json_response(['deleted' => true]);
}

// ── Product categories ──
function product_categories_list() {
    $db = getDB();
    $stmt = $db->query("SELECT pc.*, (SELECT COUNT(*) FROM products WHERE category_id = pc.id AND status = 'active') as product_count FROM product_categories pc WHERE pc.is_active = 1 ORDER BY pc.sort_order, pc.name");
    json_response($stmt->fetchAll());
}

// ── Seller products (dashboard) ──
function seller_products_list() {
    $user = require_auth();
    $db = getDB();
    $stmt = $db->prepare("SELECT p.*, pc.name as category_name FROM products p LEFT JOIN product_categories pc ON p.category_id = pc.id WHERE p.seller_id = ? ORDER BY p.created_at DESC");
    $stmt->execute([$user['id']]);
    json_response($stmt->fetchAll());
}
