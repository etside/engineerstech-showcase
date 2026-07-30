<?php
// Cart API — server-side session/user cart

function get_cart_session_id() {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['cart_session_id'])) {
        $_SESSION['cart_session_id'] = 'cart_' . bin2hex(random_bytes(16));
    }
    return $_SESSION['cart_session_id'];
}

function cart_show() {
    $db = getDB();
    $userId = get_user_id();
    $sessionId = get_cart_session_id();

    $sql = "SELECT ci.*, p.name, p.slug, p.price, p.compare_at_price, p.featured_image,
                   p.stock, p.track_inventory, p.status,
                   pv.name as variant_name, pv.price as variant_price, pv.stock as variant_stock, pv.image as variant_image,
                   pc.name as category_name
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_variants pv ON ci.variant_id = pv.id
            LEFT JOIN product_categories pc ON p.category_id = pc.id
            WHERE " . ($userId ? "ci.user_id = ?" : "ci.session_id = ?") . "
            ORDER BY ci.created_at";

    $stmt = $db->prepare($sql);
    $stmt->execute([$userId ?: $sessionId]);
    $items = $stmt->fetchAll();

    $subtotal = 0;
    foreach ($items as &$item) {
        $price = $item['variant_price'] ?? $item['price'];
        $item['unit_price'] = $price;
        $item['line_total'] = $price * $item['quantity'];
        $subtotal += $item['line_total'];
    }

    json_response([
        'items' => $items,
        'item_count' => count($items),
        'subtotal' => $subtotal,
        'currency' => 'BDT',
    ]);
}

function cart_add() {
    $data = get_json_input();
    if (empty($data['product_id']) || empty($data['quantity'])) {
        json_error('product_id and quantity are required');
    }

    $db = getDB();
    $userId = get_user_id();
    $sessionId = get_cart_session_id();

    // Verify product exists and is active
    $stmt = $db->prepare("SELECT id, stock, track_inventory, status FROM products WHERE id = ?");
    $stmt->execute([$data['product_id']]);
    $product = $stmt->fetch();
    if (!$product || $product['status'] !== 'active') json_error('Product not found or unavailable');

    // Check stock
    if ($product['track_inventory'] && $product['stock'] < $data['quantity']) {
        json_error('Insufficient stock');
    }

    // Check if item already in cart
    $checkSql = "SELECT id, quantity FROM cart_items WHERE " . ($userId ? "user_id = ?" : "session_id = ?") . " AND product_id = ? AND " . ($data['variant_id'] ? "variant_id = ?" : "variant_id IS NULL");
    $checkParams = [$userId ?: $sessionId, $data['product_id']];
    if ($data['variant_id']) $checkParams[] = $data['variant_id'];

    $checkStmt = $db->prepare($checkSql);
    $checkStmt->execute($checkParams);
    $existing = $checkStmt->fetch();

    if ($existing) {
        $newQty = $existing['quantity'] + $data['quantity'];
        $db->prepare("UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?")->execute([$newQty, $existing['id']]);
    } else {
        $id = uuid();
        $db->prepare("INSERT INTO cart_items (id, session_id, user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?, ?)")
            ->execute([$id, $sessionId, $userId, $data['product_id'], $data['variant_id'] ?? null, $data['quantity']]);
    }

    cart_show();
}

function cart_update($itemId) {
    $data = get_json_input();
    $quantity = (int)($data['quantity'] ?? 1);
    if ($quantity < 1) json_error('Quantity must be at least 1');

    $db = getDB();
    $userId = get_user_id();
    $sessionId = get_cart_session_id();

    $stmt = $db->prepare("UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ? AND " . ($userId ? "user_id = ?" : "session_id = ?"));
    $stmt->execute([$quantity, $itemId, $userId ?: $sessionId]);

    cart_show();
}

function cart_remove($itemId) {
    $db = getDB();
    $userId = get_user_id();
    $sessionId = get_cart_session_id();

    $db->prepare("DELETE FROM cart_items WHERE id = ? AND " . ($userId ? "user_id = ?" : "session_id = ?"))
        ->execute([$itemId, $userId ?: $sessionId]);

    cart_show();
}

function cart_clear() {
    $db = getDB();
    $userId = get_user_id();
    $sessionId = get_cart_session_id();

    $db->prepare("DELETE FROM cart_items WHERE " . ($userId ? "user_id = ?" : "session_id = ?"))
        ->execute([$userId ?: $sessionId]);

    cart_show();
}
