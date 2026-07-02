<?php
// Category endpoints

function categories_list() {
    $db = getDB();
    $stmt = $db->query(
        "SELECT c.*, COUNT(b.id) AS business_count
         FROM categories c
         LEFT JOIN businesses b ON b.category_id = c.id AND b.status = 'approved'
         GROUP BY c.id
         ORDER BY c.sort_order, c.name"
    );
    json_response($stmt->fetchAll());
}

function categories_get(string $slug) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM categories WHERE slug = ? OR id = ?");
    $stmt->execute([$slug, $slug]);
    $cat = $stmt->fetch();

    if (!$cat) json_error('Category not found', 404);

    // Get businesses in this category
    $stmt = $db->prepare(
        "SELECT b.*, c.name AS category_name, c.slug AS category_slug
         FROM businesses b
         LEFT JOIN categories c ON b.category_id = c.id
         WHERE b.category_id = ? AND b.status = 'approved'
         ORDER BY b.rating DESC"
    );
    $stmt->execute([$cat['id']]);
    $cat['businesses'] = $stmt->fetchAll();

    json_response($cat);
}
