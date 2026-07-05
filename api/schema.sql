-- engineersTech MySQL Schema
-- Run this in phpMyAdmin (select your database first)

-- ============================================================
-- USERS (replaces Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    email_confirmed_at TIMESTAMP NULL
) ENGINE=InnoDB;

-- ============================================================
-- USER ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    role ENUM('admin','super_admin','vendor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_role (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- BUSINESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS businesses (
    id CHAR(36) PRIMARY KEY,
    owner_id CHAR(36),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    website VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    category_id CHAR(36),
    logo_url VARCHAR(500),
    cover_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    tags JSON,
    services JSON,
    social_links JSON,
    business_hours JSON,
    geo_metadata JSON,
    tier ENUM('free','pro','featured','enterprise') DEFAULT 'free',
    ai_listing_enabled BOOLEAN DEFAULT FALSE COMMENT 'Paid AI/GEO SEO listing or admin-promoted',
    ai_listing_source ENUM('paid','admin') DEFAULT NULL COMMENT 'How AI listing was granted',
    ai_listing_updated_at TIMESTAMP NULL,
    verification_status ENUM('unverified','pending','verified') DEFAULT 'unverified',
    geo_score DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_ai_listing (ai_listing_enabled),
    FULLTEXT INDEX idx_search (name, description, short_description)
) ENGINE=InnoDB;

-- ============================================================
-- BUSINESSES PUBLIC VIEW
-- ============================================================
CREATE OR REPLACE VIEW businesses_public AS
SELECT b.*, c.name AS category_name, c.slug AS category_slug
FROM businesses b
LEFT JOIN categories c ON b.category_id = c.id
WHERE b.status = 'approved';

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id CHAR(36) PRIMARY KEY,
    business_id CHAR(36) NOT NULL,
    author_id CHAR(36),
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    body TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_business (business_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- PRICING TIERS
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BDT',
    period VARCHAR(20) DEFAULT 'monthly',
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    business_id CHAR(36),
    tier_id CHAR(36) NOT NULL,
    status ENUM('active','cancelled','expired') DEFAULT 'active',
    starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE SET NULL,
    FOREIGN KEY (tier_id) REFERENCES pricing_tiers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- API KEYS
-- ============================================================
CREATE TABLE IF NOT EXISTS api_keys (
    id CHAR(36) PRIMARY KEY,
    business_id CHAR(36) NOT NULL,
    name VARCHAR(100),
    `key` VARCHAR(255) UNIQUE NOT NULL,
    permissions JSON,
    rate_limit INT DEFAULT 100,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    last_used TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id CHAR(36) PRIMARY KEY,
    author_id CHAR(36),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    body MEDIUMTEXT,
    cover_url VARCHAR(500),
    status ENUM('draft','published') DEFAULT 'draft',
    tags JSON,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- PLATFORM SETTINGS (key-value)
-- ============================================================
CREATE TABLE IF NOT EXISTS platform_settings (
    `key` VARCHAR(255) PRIMARY KEY,
    value JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- MCP CONFIG (updated for spec 2025-11-25)
-- ============================================================
CREATE TABLE IF NOT EXISTS mcp_config (
    id CHAR(36) PRIMARY KEY,
    server_name VARCHAR(255) DEFAULT 'engineersTech MCP',
    api_token VARCHAR(255),
    enabled BOOLEAN DEFAULT TRUE,
    allow_write BOOLEAN DEFAULT FALSE,
    hidden_tools JSON,
    rate_limit INT DEFAULT 60,
    expires_at TIMESTAMP NULL,
    token_last_rotated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- MCP OAUTH CLIENTS (dynamic registration RFC 7591)
-- ============================================================
CREATE TABLE IF NOT EXISTS mcp_oauth_clients (
    id CHAR(36) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    redirect_uris JSON NOT NULL,
    grant_types JSON NOT NULL,
    scopes VARCHAR(500) DEFAULT 'mcp:read',
    client_secret VARCHAR(255),
    token_endpoint_auth_method VARCHAR(50) DEFAULT 'none',
    logo_uri VARCHAR(500),
    tos_uri VARCHAR(500),
    policy_uri VARCHAR(500),
    contacts JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- MCP OAUTH AUTHORIZATION CODES
-- ============================================================
CREATE TABLE IF NOT EXISTS mcp_oauth_codes (
    id CHAR(36) PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    client_id CHAR(36) NOT NULL,
    user_id CHAR(36),
    redirect_uri VARCHAR(500),
    scope VARCHAR(500),
    code_challenge VARCHAR(255) NOT NULL,
    code_challenge_method VARCHAR(10) DEFAULT 'S256',
    used TINYINT DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES mcp_oauth_clients(id) ON DELETE CASCADE,
    INDEX idx_code (code)
) ENGINE=InnoDB;

-- ============================================================
-- MCP OAUTH TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS mcp_oauth_tokens (
    id CHAR(36) PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token VARCHAR(255),
    client_id CHAR(36) NOT NULL,
    user_id CHAR(36),
    scope VARCHAR(500),
    revoked TINYINT DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    refresh_expires_at TIMESTAMP NULL COMMENT '30-day refresh token lifetime for one-time connection',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES mcp_oauth_clients(id) ON DELETE CASCADE,
    INDEX idx_access (access_token(64)),
    INDEX idx_refresh (refresh_token)
) ENGINE=InnoDB;

-- ============================================================
-- MCP CALL LOG (analytics)
-- ============================================================
CREATE TABLE IF NOT EXISTS mcp_call_log (
    id CHAR(36) PRIMARY KEY,
    tool_name VARCHAR(100) NOT NULL,
    client_id VARCHAR(255),
    called_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tool (tool_name),
    INDEX idx_client (client_id),
    INDEX idx_called (called_at)
) ENGINE=InnoDB;

-- ============================================================
-- AI RECOMMENDATIONS LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_recommendations_log (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    business_id CHAR(36),
    intent TEXT,
    score DECIMAL(5,2),
    position INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- BUSINESS CLAIMS
-- ============================================================
CREATE TABLE IF NOT EXISTS business_claims (
    id CHAR(36) PRIMARY KEY,
    business_id CHAR(36) NOT NULL,
    claimant_id CHAR(36) NOT NULL,
    evidence TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    reviewed_by CHAR(36),
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (claimant_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- CLAIM AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS claim_audit_log (
    id CHAR(36) PRIMARY KEY,
    claim_id CHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    actor_id CHAR(36),
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES business_claims(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- GEO FEED CACHE
-- ============================================================
CREATE TABLE IF NOT EXISTS geo_feed_cache (
    id CHAR(36) PRIMARY KEY,
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    data LONGTEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default categories
INSERT INTO categories (id, name, slug, icon, sort_order) VALUES
('c0000001-0000-0000-0000-000000000001', 'Technology', 'technology', 'Monitor', 1),
('c0000001-0000-0000-0000-000000000002', 'Healthcare', 'healthcare', 'Heart', 2),
('c0000001-0000-0000-0000-000000000003', 'Finance', 'finance', 'DollarSign', 3),
('c0000001-0000-0000-0000-000000000004', 'Education', 'education', 'GraduationCap', 4),
('c0000001-0000-0000-0000-000000000005', 'E-Commerce', 'e-commerce', 'ShoppingCart', 5),
('c0000001-0000-0000-0000-000000000006', 'Real Estate', 'real-estate', 'Building', 6),
('c0000001-0000-0000-0000-000000000007', 'Marketing', 'marketing', 'Megaphone', 7),
('c0000001-0000-0000-0000-000000000008', 'Consulting', 'consulting', 'Briefcase', 8)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Default pricing tiers
INSERT INTO pricing_tiers (id, name, slug, price, features, sort_order) VALUES
('p0000001-0000-0000-0000-000000000001', 'Free', 'free', 0.00, '["Basic listing","AI indexing","1 category"]', 1),
('p0000001-0000-0000-0000-000000000002', 'Pro', 'pro', 2900.00, '["Featured listing","Priority AI ranking","3 categories","Analytics","API access"]', 2),
('p0000001-0000-0000-0000-000000000003', 'Enterprise', 'enterprise', 9900.00, '["Premium placement","Custom AI training","Unlimited categories","Dedicated support","Custom integrations"]', 3)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Platform settings
INSERT INTO platform_settings (`key`, `value`) VALUES
('brand', '{"primaryColor":"#0A55F8","secondaryColor":"#8B5CF6","accentColor":"#F59E0B","logoUrl":"","faviconUrl":"","companyName":"engineersTech"}'),
('homepage', '{"heroTitle":"The Business Directory Built for the AI Era","heroSubtitle":"Get discovered by AI, not just search. GEO-optimized listings for ChatGPT, Claude, Gemini & more.","featuredTitle":"Featured Businesses","categoriesTitle":"Browse Categories","statsTitle":"Global Reach"}')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- Super admin user: tjms.kp@gmail.com / admin#1234
-- Password hash: bcrypt cost=12 of 'admin#1234'
INSERT INTO users (id, email, password_hash, email_confirmed_at) VALUES
('u0000001-0000-0000-0000-000000000001', 'tjms.kp@gmail.com', '$2b$12$CX6aJJkWAdASiUBft4folelIY1OkUpIlUTDEb/R9p9XBQZujdvFMi', NOW())
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    password_hash = VALUES(password_hash),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW());

-- Grant super_admin AND admin roles
INSERT INTO user_roles (id, user_id, role) VALUES
('r0000001-0000-0000-0000-000000000001', 'u0000001-0000-0000-0000-000000000001', 'super_admin'),
('r0000001-0000-0000-0000-000000000002', 'u0000001-0000-0000-0000-000000000001', 'admin')
ON DUPLICATE KEY UPDATE role = VALUES(role);

-- Seed default MCP config with a random token (rotate after first login)
INSERT INTO mcp_config (id, server_name, api_token, enabled, allow_write, rate_limit) VALUES
('m0000001-0000-0000-0000-000000000001', 'engineersTech MCP', 'et-mcp-change-after-first-login-a3f9b2c7d1e4', TRUE, FALSE, 60)
ON DUPLICATE KEY UPDATE server_name = VALUES(server_name);
