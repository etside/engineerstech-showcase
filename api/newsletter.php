<?php
// Newsletter endpoints

function newsletter_subscribe() {
    $input = get_json_input();
    $email = trim($input['email'] ?? '');

    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_error('Valid email required');
    }

    $db = getDB();
    $stmt = $db->prepare(
        "INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE is_active = 1"
    );
    $stmt->execute([uuid(), $email]);

    json_response(['message' => 'Subscribed']);
}

function newsletter_unsubscribe(string $email) {
    $db = getDB();
    $stmt = $db->prepare("UPDATE newsletter_subscribers SET is_active = 0 WHERE email = ?");
    $stmt->execute([urldecode($email)]);

    json_response(['message' => 'Unsubscribed']);
}
