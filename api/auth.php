<?php
// Auth endpoints: login, register, logout, me

function auth_login() {
    $input = get_json_input();
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        json_error('Email and password required');
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT id, email, password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_error('Invalid credentials', 401);
    }

    // Get roles
    $stmt = $db->prepare("SELECT role FROM user_roles WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Set session
    $_SESSION['user_id'] = $user['id'];

    // Generate JWT
    $token = jwt_encode(['sub' => $user['id'], 'email' => $user['email'], 'roles' => $roles]);

    json_response([
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'roles' => $roles,
        ],
        'token' => $token,
    ]);
}

function auth_register() {
    $input = get_json_input();
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        json_error('Email and password required');
    }

    if (strlen($password) < 6) {
        json_error('Password must be at least 6 characters');
    }

    $db = getDB();

    // Check existing
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        json_error('Email already registered', 409);
    }

    $id = uuid();
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare("INSERT INTO users (id, email, password_hash, email_confirmed_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$id, $email, $hash]);

    // Assign default vendor role
    $stmt = $db->prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'vendor')");
    $stmt->execute([uuid(), $id]);

    // Set session
    $_SESSION['user_id'] = $id;

    // Generate JWT
    $token = jwt_encode(['sub' => $id, 'email' => $email, 'roles' => ['vendor']]);

    json_response([
        'user' => [
            'id' => $id,
            'email' => $email,
            'roles' => ['vendor'],
        ],
        'token' => $token,
    ], 201);
}

function auth_logout() {
    session_destroy();
    json_response(['message' => 'Logged out']);
}

function auth_me() {
    $user_id = get_user_id();
    if (!$user_id) {
        json_response(['user' => null]);
        return;
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT id, email, created_at FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response(['user' => null]);
        return;
    }

    $stmt = $db->prepare("SELECT role FROM user_roles WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);

    json_response([
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'roles' => $roles,
            'created_at' => $user['created_at'],
        ],
    ]);
}
