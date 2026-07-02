<?php
// Contact form handler

function contact_submit() {
    $input = get_json_input();
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $subject = trim($input['subject'] ?? '');
    $message = trim($input['message'] ?? '');

    if (!$name || !$email || !$message) {
        json_error('Name, email, and message required');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_error('Invalid email');
    }

    $db = getDB();
    $stmt = $db->prepare(
        "INSERT INTO contact_messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([uuid(), $name, $email, $subject, $message]);

    json_response(['message' => 'Message sent'], 201);
}
