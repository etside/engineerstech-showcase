<?php
// API Router — dispatches requests to handlers
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip /api prefix if present
$uri = preg_replace('#^/api#', '', $uri);
$uri = rtrim($uri, '/');

// Route table
$routes = [
    // Auth
    'POST /auth/login'          => 'auth.php@login',
    'POST /auth/register'       => 'auth.php@register',
    'POST /auth/logout'         => 'auth.php@logout',
    'GET /auth/me'              => 'auth.php@me',

    // Businesses
    'GET /businesses'           => 'businesses.php@list',
    'GET /businesses/featured'  => 'businesses.php@featured',
    'GET /businesses/search'    => 'businesses.php@search',
    'GET /businesses/stats'     => 'businesses.php@stats',
    'GET /businesses/(.+)'      => 'businesses.php@get',
    'POST /businesses'          => 'businesses.php@create',
    'PUT /businesses/(.+)'      => 'businesses.php@update',
    'DELETE /businesses/(.+)'   => 'businesses.php@delete',

    // Categories
    'GET /categories'           => 'categories.php@list',
    'GET /categories/(.+)'      => 'categories.php@get',

    // Reviews
    'GET /reviews'              => 'reviews.php@list',
    'POST /reviews'             => 'reviews.php@create',
    'PUT /reviews/(.+)'         => 'reviews.php@update',
    'DELETE /reviews/(.+)'      => 'reviews.php@delete',

    // Admin
    'GET /admin/dashboard'      => 'admin.php@dashboard',
    'GET /admin/users'          => 'admin.php@users',
    'PUT /admin/users/(.+)/role' => 'admin.php@set_role',
    'GET /admin/settings'       => 'admin.php@get_settings',
    'PUT /admin/settings'       => 'admin.php@update_settings',
    'GET /admin/claims'         => 'admin.php@claims',
    'PUT /admin/claims/(.+)'    => 'admin.php@review_claim',
    'GET /admin/mcp'            => 'admin.php@mcp_config',
    'PUT /admin/mcp'            => 'admin.php@update_mcp',

    // Claims
    'GET /claims'               => 'claims.php@list',
    'GET /claims/audit'         => 'claims.php@audit_log',
    'POST /claims'              => 'claims.php@create',

    // Pricing
    'GET /pricing'              => 'pricing.php@list',

    // Blog
    'GET /blog'                 => 'blog.php@list',
    'GET /blog/(.+)'            => 'blog.php@get',

    // Contact
    'POST /contact'             => 'contact.php@submit',

    // Newsletter
    'POST /newsletter'          => 'newsletter.php@subscribe',
    'DELETE /newsletter/(.+)'   => 'newsletter.php@unsubscribe',

    // Feed (public)
    'GET /feed'                 => 'feed.php@index',
    'GET /feed/llms'            => 'feed.php@llms',

    // Upload
    'POST /upload'              => 'upload.php@upload',
];

// Find matching route
$matched = false;
foreach ($routes as $pattern => $handler) {
    [$routeMethod, $routePath] = explode(' ', $pattern, 2);

    if ($method !== $routeMethod) continue;

    $regex = '#^' . $routePath . '$#';
    if (preg_match($regex, $uri, $matches)) {
        array_shift($matches); // Remove full match
        [$file, $function] = explode('@', $handler);
        $filePath = __DIR__ . '/' . $file;

        if (!file_exists($filePath)) {
            json_error('Handler not found', 500);
        }

        require_once $filePath;
        call_user_func_array($function, $matches);
        $matched = true;
        break;
    }
}

if (!$matched) {
    json_error('Not found', 404);
}
