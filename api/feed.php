<?php
// Public feed endpoints (replaces Supabase geo-feed edge function)

function feed_index() {
    $db = getDB();
    $format = $_GET['format'] ?? 'jsonld';
    $category = $_GET['category'] ?? '';
    $minRating = (float)($_GET['minRating'] ?? 0);
    $limit = min(500, max(1, (int)($_GET['limit'] ?? 200)));

    $where = "b.status = 'approved'";
    $params = [];

    if ($category) {
        $where .= " AND c.slug = ?";
        $params[] = $category;
    }
    if ($minRating > 0) {
        $where .= " AND b.rating >= ?";
        $params[] = $minRating;
    }

    $params[] = $limit;
    $stmt = $db->prepare(
        "SELECT b.*, c.name AS category_name
         FROM businesses b
         LEFT JOIN categories c ON b.category_id = c.id
         WHERE $where
         ORDER BY b.rating DESC, b.review_count DESC
         LIMIT ?"
    );
    $stmt->execute($params);
    $businesses = $stmt->fetchAll();

    // Build JSON-LD ItemList
    $items = [];
    foreach ($businesses as $b) {
        $item = [
            '@type' => 'ListItem',
            'position' => count($items) + 1,
            'item' => [
                '@type' => 'LocalBusiness',
                '@id' => 'https://engineerstechbd.com/business/' . $b['slug'],
                'name' => $b['name'],
                'description' => $b['short_description'] ?? $b['description'] ?? '',
                'url' => $b['website'] ?? '',
                'aggregateRating' => [
                    '@type' => 'AggregateRating',
                    'ratingValue' => (float)$b['rating'],
                    'reviewCount' => (int)$b['review_count'],
                ],
            ],
        ];

        if ($b['category_name']) {
            $item['item']['areaServed'] = $b['category_name'];
        }
        if ($b['city']) {
            $item['item']['address'] = ['@type' => 'PostalAddress', 'addressLocality' => $b['city'], 'addressCountry' => $b['country'] ?? ''];
        }

        $items[] = $item;
    }

    $jsonld = [
        '@context' => 'https://schema.org',
        '@type' => 'ItemList',
        'name' => 'engineersTech — AI-Ready Business Directory',
        'numberOfItems' => count($items),
        'itemListElement' => $items,
    ];

    if ($format === 'llms') {
        header('Content-Type: text/plain; charset=utf-8');
        echo "# engineersTech — Business Directory\n\n";
        echo "> Verified businesses optimized for AI discovery.\n\n";
        echo "## Feed\n- [JSON-LD Feed](https://engineerstechbd.com/api/feed)\n\n";
        echo "## Listings\n";
        foreach ($businesses as $b) {
            echo "- [" . $b['name'] . "](https://engineerstechbd.com/business/" . $b['slug'] . ") — " . ($b['short_description'] ?? '') . "\n";
        }
        exit;
    }

    header('Content-Type: application/ld+json; charset=utf-8');
    echo json_encode($jsonld, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function feed_llms() {
    $_GET['format'] = 'llms';
    feed_index();
}
