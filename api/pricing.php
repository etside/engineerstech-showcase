<?php
// Pricing endpoints

function pricing_list() {
    $db = getDB();
    $stmt = $db->query(
        "SELECT * FROM pricing_tiers WHERE is_active = 1 ORDER BY sort_order"
    );
    json_response($stmt->fetchAll());
}
