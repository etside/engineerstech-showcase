<?php
// One-time setup script — run once to create admin user
// Usage: php api/setup.php  (CLI) or visit /api/setup.php in browser

require_once __DIR__ . '/config.php';

$email = 'tjms.kp@gmail.com';
$password = 'admin@1234';

$db = getDB();

// Check if user exists
$stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$existing = $stmt->fetch();

if ($existing) {
    echo "User $email already exists (id: {$existing['id']})\n";
    // Update password just in case
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
    $stmt->execute([$hash, $email]);
    $user_id = $existing['id'];
    echo "Password updated.\n";
} else {
    $user_id = uuid();
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (id, email, password_hash, email_confirmed_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$user_id, $email, $hash]);
    echo "Created user $email (id: $user_id)\n";
}

// Assign super_admin + admin roles
foreach (['super_admin', 'admin'] as $role) {
    $stmt = $db->prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)");
    $stmt->execute([uuid(), $user_id, $role]);
    echo "Assigned role: $role\n";
}

echo "\nDone! Sign in at /auth with $email / $password\n";
