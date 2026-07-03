<?php
// API Router — dispatches requests to handlers
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip /api prefix if present
$uri = preg_replace('#^/api#', '', $uri);
$uri = rtrim($uri, '/');
if ($uri === '') $uri = '/';

// ── MCP Streamable HTTP (all sub-paths under /mcp-server) ───────────────────
if (preg_match('#^/mcp-server(/.*)?$#', $uri)) {
    require_once __DIR__ . '/mcp-server.php';
    exit;
}

// ── OAuth2.1 Authorization Server ───────────────────────────────────────────
if (preg_match('#^/oauth(/.*)?$#', $uri) || preg_match('#^/\.well-known/#', $uri)) {
    require_once __DIR__ . '/oauth.php';
    exit;
}

// Route table
$routes = [
    // Auth
    'POST /auth/login'          => 'auth.php@auth_login',
    'POST /auth/register'       => 'auth.php@auth_register',
    'POST /auth/logout'         => 'auth.php@auth_logout',
    'GET /auth/me'              => 'auth.php@auth_me',

    // Businesses
    'GET /businesses'           => 'businesses.php@businesses_list',
    'GET /businesses/featured'  => 'businesses.php@businesses_featured',
    'GET /businesses/search'    => 'businesses.php@businesses_search',
    'GET /businesses/stats'     => 'businesses.php@businesses_stats',
    'GET /businesses/(.+)'      => 'businesses.php@businesses_get',
    'POST /businesses'          => 'businesses.php@businesses_create',
    'PUT /businesses/(.+)'      => 'businesses.php@businesses_update',
    'DELETE /businesses/(.+)'   => 'businesses.php@businesses_delete',

    // Categories
    'GET /categories'           => 'categories.php@categories_list',
    'GET /categories/(.+)'      => 'categories.php@categories_get',

    // Reviews
    'GET /reviews'              => 'reviews.php@reviews_list',
    'POST /reviews'             => 'reviews.php@reviews_create',
    'PUT /reviews/(.+)'         => 'reviews.php@reviews_update',
    'DELETE /reviews/(.+)'      => 'reviews.php@reviews_delete',

    // Admin
    'GET /admin/dashboard'              => 'admin.php@admin_dashboard',
    'GET /admin/users'                  => 'admin.php@admin_users',
    'PUT /admin/users/(.+)/role'        => 'admin.php@admin_set_role',
    'GET /admin/settings'               => 'admin.php@admin_get_settings',
    'PUT /admin/settings'               => 'admin.php@admin_update_settings',
    'GET /admin/claims'                 => 'admin.php@admin_claims',
    'PUT /admin/claims/(.+)'            => 'admin.php@admin_review_claim',

    // MCP admin config
    'GET /admin/mcp'                    => 'admin.php@admin_mcp_config',
    'PUT /admin/mcp'                    => 'admin.php@admin_update_mcp',
    'GET /admin/mcp/analytics'          => 'admin.php@admin_mcp_analytics',
    'GET /admin/mcp/clients'            => 'admin.php@admin_mcp_clients',
    'POST /admin/mcp/clients'           => 'admin.php@admin_mcp_create_client',
    'DELETE /admin/mcp/clients/(.+)'    => 'admin.php@admin_mcp_delete_client',

    // AI Listing management
    'GET /admin/ai-listings'            => 'admin.php@admin_ai_listings',
    'PUT /admin/ai-listings/(.+)'       => 'admin.php@admin_toggle_ai_listing',

    // Vendor MCP keys
    'GET /vendor/mcp-keys'              => 'admin.php@vendor_mcp_keys',
    'POST /vendor/mcp-keys'             => 'admin.php@vendor_mcp_create_key',
    'DELETE /vendor/mcp-keys/(.+)'      => 'admin.php@vendor_mcp_revoke_key',

    // Claims
    'GET /claims'               => 'claims.php@claims_list',
    'GET /claims/audit'         => 'claims.php@claims_audit_log',
    'POST /claims'              => 'claims.php@claims_create',

    // Pricing
    'GET /pricing'              => 'pricing.php@pricing_list',

    // Blog
    'GET /blog'                 => 'blog.php@blog_list',
    'GET /blog/(.+)'            => 'blog.php@blog_get',

    // Contact
    'POST /contact'             => 'contact.php@contact_submit',

    // Newsletter
    'POST /newsletter'          => 'newsletter.php@newsletter_subscribe',
    'DELETE /newsletter/(.+)'   => 'newsletter.php@newsletter_unsubscribe',

    // Feed (public)
    'GET /feed'                 => 'feed.php@feed_index',
    'GET /feed/llms'            => 'feed.php@feed_llms',

    // Upload
    'POST /upload'              => 'upload.php@upload_upload',
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
