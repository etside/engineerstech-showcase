<?php
// File upload handler

function upload_upload() {
    $user = require_auth();

    if (empty($_FILES['file'])) {
        json_error('No file uploaded');
    }

    $file = $_FILES['file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        json_error('Upload error: ' . $file['error']);
    }

    if ($file['size'] > MAX_UPLOAD_SIZE) {
        json_error('File too large (max 5MB)');
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!in_array($file['type'], $allowedTypes)) {
        json_error('Invalid file type');
    }

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uuid() . '.' . strtolower($ext);
    $dest = UPLOAD_DIR . $filename;

    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        json_error('Failed to save file', 500);
    }

    $url = '/api/uploads/' . $filename;
    json_response(['url' => $url, 'filename' => $filename], 201);
}
