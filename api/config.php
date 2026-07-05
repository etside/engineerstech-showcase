<?php
// PHP API config — MySQL + JWT + CORS
// For cPanel shared hosting deployment

// --- Error handling: always return JSON ---
ini_set('display_errors', '0');
error_reporting(E_ERROR | E_PARSE);
set_error_handler(function($errno, $errstr) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => $errstr]);
    exit;
});
set_exception_handler(function($e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
    exit;
});

// --- CORS: whitelist specific origins, never wildcard with credentials ---
$allowedOrigins = [
    'https://biz.engineerstechbd.com',
    'http://biz.engineerstechbd.com',
    'https://www.biz.engineerstechbd.com',
    'https://engineerstechbd.com',
    'https://www.engineerstechbd.com',
    'http://localhost:5173',
    'http://localhost:3000',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
} else {
    // Unknown origin — allow reads without credentials (public API)
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, MCP-Protocol-Version');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- Session ---
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// --- Database (edit config.env on cPanel) ---
$configFile = __DIR__ . '/config.env';
$cfg = [];
if (file_exists($configFile)) {
    $parsed = parse_ini_file($configFile);
    if ($parsed !== false) {
        $cfg = $parsed;
    }
}

define('DB_HOST',    $cfg['DB_HOST']    ?? 'localhost');
define('DB_NAME',    $cfg['DB_NAME']    ?? 'engineerstech');
define('DB_USER',    $cfg['DB_USER']    ?? 'root');
define('DB_PASS',    $cfg['DB_PASS']    ?? '');
define('DB_CHARSET', 'utf8mb4');

// --- JWT: hard-fail if secret is missing or still the placeholder ---
$jwtSecret = $cfg['JWT_SECRET'] ?? '';
if (empty($jwtSecret) || $jwtSecret === 'engineerstech-showcase-secret-change-in-production') {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Server misconfiguration: JWT_SECRET not set in config.env']);
    exit;
}
define('JWT_SECRET', $jwtSecret);
define('JWT_EXPIRY', 86400 * 7); // 7 days

// --- Site URL (used by OAuth endpoints for issuer/audience) ---
// Priority: config.env → HTTPS detection → fallback
$siteUrl = $cfg['SITE_URL'] ?? '';
if (empty($siteUrl)) {
    $scheme  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host    = $_SERVER['HTTP_HOST'] ?? 'biz.engineerstechbd.com';
    $siteUrl = $scheme . '://' . $host;
}
define('SITE_URL', rtrim($siteUrl, '/'));

// --- Upload ---
$uploadDir = $cfg['UPLOAD_DIR'] ?? (__DIR__ . '/uploads/');
define('UPLOAD_DIR',       rtrim($uploadDir, '/') . '/');
define('MAX_UPLOAD_SIZE',  5 * 1024 * 1024); // 5MB

// --- DB Connection ---
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

// --- JWT Helpers ---
function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function jwt_encode(array $payload): string {
    $header          = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload['iat']  = time();
    $payload['exp']  = time() + JWT_EXPIRY;
    $payloadEncoded  = base64url_encode(json_encode($payload));
    $signature       = base64url_encode(hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true));
    return "$header.$payloadEncoded.$signature";
}

function jwt_decode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $payload, $signature] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    if (!hash_equals($expected, $signature)) return null;
    $data = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
    if (!$data || ($data['exp'] ?? 0) < time()) return null;
    return $data;
}

// --- Auth Helpers ---
function get_user_id(): ?string {
    if (!empty($_SESSION['user_id'])) return $_SESSION['user_id'];
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.+)/i', $auth, $m)) {
        $payload = jwt_decode(trim($m[1]));
        if ($payload && !empty($payload['sub'])) return $payload['sub'];
    }
    return null;
}

function require_auth(): array {
    $user_id = get_user_id();
    if (!$user_id) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }
    // Fetch roles so callers can use $user['roles']
    $db   = getDB();
    $stmt = $db->prepare("SELECT role FROM user_roles WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);
    return ['id' => $user_id, 'roles' => $roles];
}

function require_admin(): array {
    $user = require_auth();
    if (!in_array('admin', $user['roles']) && !in_array('super_admin', $user['roles'])) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Admin access required']);
        exit;
    }
    return $user;
}

function require_super_admin(): array {
    $user = require_auth();
    if (!in_array('super_admin', $user['roles'])) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Super admin access required']);
        exit;
    }
    return $user;
}

// --- JSON Response ---
function json_response($data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $status = 400): never {
    json_response(['error' => $message], $status);
}

// --- Input ---
function get_json_input(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

function slugify(string $text): string {
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9-]/', '-', $text);
    $text = preg_replace('/-+/', '-', $text);
    return trim($text, '-');
}

function ensure_business_profile_column(PDO $db): void {
    try {
        $db->query('SELECT profile_data FROM businesses LIMIT 1');
    } catch (PDOException $e) {
        if (stripos($e->getMessage(), 'Unknown column') !== false) {
            $db->exec('ALTER TABLE businesses ADD COLUMN profile_data JSON NULL AFTER social_links');
        } else {
            throw $e;
        }
    }
}

function decode_json_field($value): array {
    if (is_array($value)) return $value;
    if ($value === null || $value === '') return [];
    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : [];
}

function normalize_array_value($value): array {
    if (is_array($value)) {
        return array_values(array_filter($value, fn($item) => $item !== null && $item !== ''));
    }

    if (is_string($value)) {
        $parts = preg_split('/[;,]+/', $value) ?: [];
        return array_values(array_filter(array_map('trim', $parts), 'strlen'));
    }

    return [];
}

function calculate_profile_completeness(array $profile): int {
    $score = 0;
    $checks = [
        ['business_description', 15],
        ['categories', 10],
        ['services', 15],
        ['industries', 10],
        ['technologies', 10],
        ['certifications', 5],
        ['awards', 5],
        ['portfolio', 5],
        ['case_studies', 5],
        ['testimonials', 5],
        ['team_size', 3],
        ['years_in_business', 3],
        ['pricing', 3],
        ['minimum_project_size', 3],
        ['hourly_rate', 3],
        ['headquarters', 3],
        ['service_locations', 5],
        ['languages', 3],
        ['contact_information', 5],
        ['website', 5],
        ['social_profiles', 3],
        ['media_gallery', 3],
        ['videos', 3],
        ['faqs', 3],
        ['seo_metadata', 3],
        ['structured_data', 3],
        ['external_links', 3],
    ];

    foreach ($checks as [$field, $weight]) {
        $value = $profile[$field] ?? null;
        if (is_array($value)) {
            if (!empty($value)) $score += $weight;
        } elseif (is_string($value) && trim($value) !== '') {
            $score += $weight;
        } elseif ($value !== null && $value !== '') {
            $score += $weight;
        }
    }

    return min(100, (int)round($score));
}

function build_business_structured_data(array $business, array $profile): array {
    $name = $business['name'] ?? ($profile['company_information']['name'] ?? 'Business');
    $description = $business['description'] ?? ($profile['business_description'] ?? '');
    $website = $business['website'] ?? ($profile['website'] ?? null);
    $city = $business['city'] ?? ($profile['headquarters']['city'] ?? null);
    $country = $business['country'] ?? ($profile['headquarters']['country'] ?? null);
    $address = $business['address'] ?? ($profile['headquarters']['address'] ?? null);

    $data = [
        '@context' => 'https://schema.org',
        '@type' => 'LocalBusiness',
        'name' => $name,
        'description' => $description,
    ];

    if ($website) $data['url'] = $website;
    if ($address || $city || $country) {
        $location = [];
        if ($address) $location['streetAddress'] = $address;
        if ($city) $location['addressLocality'] = $city;
        if ($country) $location['addressCountry'] = $country;
        $data['address'] = $location;
    }

    $services = $profile['services'] ?? [];
    if (!empty($services)) {
        $data['keywords'] = is_array($services) ? implode($services, ', ') : (string)$services;
    }

    if (!empty($business['rating'])) {
        $data['aggregateRating'] = [
            '@type' => 'AggregateRating',
            'ratingValue' => (string)$business['rating'],
            'reviewCount' => (int)($business['review_count'] ?? 0),
        ];
    }

    return $data;
}

function build_business_search_text(array $business, array $profile = []): string {
    $parts = [];
    $parts[] = $business['name'] ?? '';
    $parts[] = $business['description'] ?? '';
    $parts[] = $business['short_description'] ?? '';
    $parts[] = $business['category_name'] ?? '';
    $parts[] = $profile['business_description'] ?? '';
    $parts[] = implode(' ', normalize_array_value($profile['services'] ?? []));
    $parts[] = implode(' ', normalize_array_value($profile['industries'] ?? []));
    $parts[] = implode(' ', normalize_array_value($profile['technologies'] ?? []));
    $parts[] = implode(' ', normalize_array_value($profile['certifications'] ?? []));
    $parts[] = $business['city'] ?? '';
    $parts[] = $business['country'] ?? '';
    return mb_strtolower(implode(' ', array_filter($parts, 'strlen')), 'UTF-8');
}

function merge_business_profile_data(array $input, array $existing = []): array {
    $profile = is_array($existing) ? $existing : [];
    $fields = [
        'company_information', 'business_description', 'categories', 'services', 'industries',
        'technologies', 'certifications', 'awards', 'portfolio', 'case_studies',
        'testimonials', 'team_size', 'years_in_business', 'pricing', 'minimum_project_size',
        'hourly_rate', 'headquarters', 'service_locations', 'languages', 'contact_information',
        'website', 'social_profiles', 'media_gallery', 'videos', 'faqs', 'seo_metadata',
        'structured_data', 'external_links', 'business_attributes', 'accessibility_features',
        'delivery_methods', 'appointment_options', 'verification_status',
    ];

    foreach ($fields as $field) {
        if (array_key_exists($field, $input)) {
            $value = $input[$field];
            if (in_array($field, ['categories','services','industries','technologies','certifications','awards','portfolio','case_studies','testimonials','service_locations','languages','social_profiles','media_gallery','videos','faqs','external_links','business_attributes','accessibility_features','delivery_methods','appointment_options'], true)) {
                $profile[$field] = normalize_array_value($value);
            } else {
                $profile[$field] = $value;
            }
        }
    }

    if (array_key_exists('profile_data', $input) && is_array($input['profile_data'])) {
        foreach ($input['profile_data'] as $field => $value) {
            if (in_array($field, ['categories','services','industries','technologies','certifications','awards','portfolio','case_studies','testimonials','service_locations','languages','social_profiles','media_gallery','videos','faqs','external_links','business_attributes','accessibility_features','delivery_methods','appointment_options'], true)) {
                $profile[$field] = normalize_array_value($value);
            } else {
                $profile[$field] = $value;
            }
        }
    }

    if (empty($profile['business_description']) && !empty($input['description'])) {
        $profile['business_description'] = $input['description'];
    }

    if (empty($profile['company_information']) && !empty($input['company_info'])) {
        $profile['company_information'] = $input['company_info'];
    }

    if (empty($profile['verification_status'])) {
        $profile['verification_status'] = 'unverified';
    }

    if (empty($profile['structured_data'])) {
        $profile['structured_data'] = build_business_structured_data($input, $profile);
    }

    $profile['profile_completeness'] = calculate_profile_completeness($profile);
    return $profile;
}

// --- Cryptographically secure UUID v4 ---
function uuid(): string {
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40); // version 4
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80); // variant bits
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
}
