<?php
// Orders API — buyer orders + seller order management

function generate_order_number(): string {
    return 'ORD-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(4)));
}

function orders_create() {
    $data = get_json_input();
    $db = getDB();
    $userId = get_user_id();

    // Validate required fields
    if (empty($data['items']) || !is_array($data['items'])) {
        json_error('Items are required');
    }
    if (empty($data['shipping_address'])) {
        json_error('Shipping address is required');
    }

    // Get cart items or use provided items
    $sessionId = get_cart_session_id();
    $sql = "SELECT ci.*, p.name as product_name, p.price, p.stock, p.track_inventory, p.status,
                   p.featured_image, p.seller_id, pv.name as variant_name, pv.price as variant_price, pv.stock as variant_stock
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            LEFT JOIN product_variants pv ON ci.variant_id = pv.id
            WHERE " . ($userId ? "ci.user_id = ?" : "ci.session_id = ?");
    $stmt = $db->prepare($sql);
    $stmt->execute([$userId ?: $sessionId]);
    $cartItems = $stmt->fetchAll();

    if (empty($cartItems)) json_error('Cart is empty');

    $orderId = uuid();
    $orderNumber = generate_order_number();
    $subtotal = 0;

    $db->beginTransaction();
    try {
        foreach ($cartItems as $item) {
            $price = $item['variant_price'] ?? $item['price'];
            $stock = $item['variant_stock'] ?? $item['stock'];
            if ($item['track_inventory'] && $stock < $item['quantity']) {
                throw new Exception("Insufficient stock for {$item['product_name']}");
            }
            $lineTotal = $price * $item['quantity'];
            $subtotal += $lineTotal;

            // Deduct stock
            if ($item['track_inventory']) {
                if ($item['variant_id']) {
                    $db->prepare("UPDATE product_variants SET stock = stock - ? WHERE id = ?")->execute([$item['quantity'], $item['variant_id']]);
                } else {
                    $db->prepare("UPDATE products SET stock = stock - ?, sales_count = sales_count + ? WHERE id = ?")->execute([$item['quantity'], $item['quantity'], $item['product_id']]);
                }
            }

            // Create order item
            $itemId = uuid();
            $db->prepare("INSERT INTO order_items (id, order_id, product_id, variant_id, seller_id, product_name, variant_name, quantity, unit_price, total, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
                ->execute([$itemId, $orderId, $item['product_id'], $item['variant_id'], $item['seller_id'], $item['product_name'], $item['variant_name'], $item['quantity'], $price, $lineTotal, $item['featured_image']]);
        }

        $shipping = (float)($data['shipping_amount'] ?? 0);
        $discount = (float)($data['discount_amount'] ?? 0);
        $total = $subtotal + $shipping - $discount;

        $db->prepare("INSERT INTO orders (id, order_number, buyer_id, buyer_email, buyer_phone, buyer_name, status, payment_status, payment_method, subtotal, shipping_amount, discount_amount, total, currency, shipping_address, billing_address, notes, coupon_code) VALUES (?, ?, ?, ?, ?, ?, 'pending', 'unpaid', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            ->execute([
                $orderId, $orderNumber, $userId, $data['buyer_email'] ?? null,
                $data['buyer_phone'] ?? null, $data['buyer_name'] ?? null,
                $data['payment_method'] ?? 'cod',
                $subtotal, $shipping, $discount, $total, $data['currency'] ?? 'BDT',
                json_encode($data['shipping_address']), json_encode($data['billing_address'] ?? null),
                $data['notes'] ?? null, $data['coupon_code'] ?? null,
            ]);

        // Clear cart
        $db->prepare("DELETE FROM cart_items WHERE " . ($userId ? "user_id = ?" : "session_id = ?"))
            ->execute([$userId ?: $sessionId]);

        $db->commit();

        $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        json_response($stmt->fetch(), 201);
    } catch (Exception $e) {
        $db->rollBack();
        json_error($e->getMessage(), 400);
    }
}

function orders_list() {
    $user = require_auth();
    $db = getDB();
    $page = max(1, (int)($_GET['page'] ?? 1));
    $per_page = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
    $offset = ($page - 1) * $per_page;

    $where = "o.buyer_id = ?";
    $params = [$user['id']];

    if (!empty($_GET['status'])) {
        $where .= " AND o.status = ?";
        $params[] = $_GET['status'];
    }

    $countStmt = $db->prepare("SELECT COUNT(*) FROM orders o WHERE $where");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $stmt = $db->prepare("SELECT o.* FROM orders o WHERE $where ORDER BY o.created_at DESC LIMIT $per_page OFFSET $offset");
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    json_response([
        'data' => $orders,
        'current_page' => $page,
        'last_page' => ceil($total / $per_page),
        'per_page' => $per_page,
        'total' => $total,
    ]);
}

function orders_get($id) {
    $user = require_auth();
    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ? AND buyer_id = ?");
    $stmt->execute([$id, $user['id']]);
    $order = $stmt->fetch();
    if (!$order) json_error('Order not found', 404);

    $iStmt = $db->prepare("SELECT oi.*, p.slug as product_slug FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?");
    $iStmt->execute([$id]);
    $order['items'] = $iStmt->fetchAll();

    json_response($order);
}

// ── Seller order management ──
function seller_orders_list() {
    $user = require_auth();
    $db = getDB();
    $page = max(1, (int)($_GET['page'] ?? 1));
    $per_page = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
    $offset = ($page - 1) * $per_page;

    $where = "o.id IN (SELECT order_id FROM order_items WHERE seller_id = ?)";
    $params = [$user['id']];

    if (!empty($_GET['status'])) {
        $where .= " AND o.status = ?";
        $params[] = $_GET['status'];
    }

    $countStmt = $db->prepare("SELECT COUNT(*) FROM orders o WHERE $where");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $stmt = $db->prepare("SELECT o.* FROM orders o WHERE $where ORDER BY o.created_at DESC LIMIT $per_page OFFSET $offset");
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    json_response([
        'data' => $orders,
        'current_page' => $page,
        'last_page' => ceil($total / $per_page),
        'per_page' => $per_page,
        'total' => $total,
    ]);
}

function seller_orders_update($id) {
    $user = require_auth();
    $data = get_json_input();
    $db = getDB();

    // Verify seller has items in this order
    $check = $db->prepare("SELECT 1 FROM order_items WHERE order_id = ? AND seller_id = ? LIMIT 1");
    $check->execute([$id, $user['id']]);
    if (!$check->fetch()) json_error('Not authorized', 403);

    $allowedStatuses = ['confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!empty($data['status']) && in_array($data['status'], $allowedStatuses)) {
        $updates = ['status = ?'];
        $params = [$data['status']];
        if ($data['status'] === 'shipped') {
            $updates[] = "shipped_at = NOW()";
        } elseif ($data['status'] === 'delivered') {
            $updates[] = "delivered_at = NOW()";
        }
        $params[] = $id;
        $db->prepare("UPDATE orders SET " . implode(', ', $updates) . " WHERE id = ?")->execute($params);
    }

    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$id]);
    json_response($stmt->fetch());
}
