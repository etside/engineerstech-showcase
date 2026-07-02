<?php
// Blog endpoints

function blog_list() {
    $db = getDB();
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 48)));

    $stmt = $db->prepare(
        "SELECT id, slug, title, excerpt, cover_url, published_at, tags
         FROM blog_posts
         WHERE status = 'published'
         ORDER BY published_at DESC
         LIMIT ?"
    );
    $stmt->execute([$limit]);
    $posts = $stmt->fetchAll();

    // Decode JSON fields
    foreach ($posts as &$p) {
        $p['tags'] = $p['tags'] ? json_decode($p['tags'], true) : [];
    }

    json_response($posts);
}

function blog_get(string $slug) {
    $db = getDB();
    $stmt = $db->prepare(
        "SELECT title, excerpt, body_md AS body, cover_url, published_at, tags
         FROM blog_posts
         WHERE slug = ? AND status = 'published'"
    );
    $stmt->execute([$slug]);
    $post = $stmt->fetch();

    if (!$post) json_error('Post not found', 404);

    $post['tags'] = $post['tags'] ? json_decode($post['tags'], true) : [];
    json_response($post);
}
