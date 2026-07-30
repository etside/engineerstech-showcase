-- Marketplace schema extension for engineersTech
-- Adds product listings, orders, cart, and services

-- ============================================================
-- PRODUCT CATEGORIES (separate from business directory categories)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_categories (
    id CHAR(36) PRIMARY KEY,
    parent_id CHAR(36) NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB;

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id CHAR(36) PRIMARY KEY,
    seller_id CHAR(36) NOT NULL COMMENT 'user_id of the vendor',
    business_id CHAR(36) COMMENT 'linked business listing',
    category_id CHAR(36),
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    description MEDIUMTEXT,
    short_description VARCHAR(1000),
    price DECIMAL(12,2) NOT NULL,
    compare_at_price DECIMAL(12,2) NULL COMMENT 'original price for discount display',
    currency VARCHAR(3) DEFAULT 'BDT',
    sku VARCHAR(100),
    barcode VARCHAR(100),
    stock INT DEFAULT 0,
    track_inventory BOOLEAN DEFAULT TRUE,
    weight DECIMAL(8,2) NULL,
    images JSON COMMENT 'array of image URLs',
    featured_image VARCHAR(500),
    tags JSON COMMENT 'array of tag strings',
    status ENUM('draft','active','archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_seller (seller_id),
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    FULLTEXT INDEX idx_search (name, description, short_description)
) ENGINE=InnoDB;

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL COMMENT 'e.g. "Red / XL"',
    sku VARCHAR(100),
    price DECIMAL(12,2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(500),
    options JSON COMMENT 'key-value pairs like {"color":"Red","size":"XL"}',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id)
) ENGINE=InnoDB;

-- ============================================================
-- PRODUCT REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    user_id CHAR(36),
    order_id CHAR(36),
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    body TEXT,
    images JSON,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id CHAR(36) COMMENT 'null for guest checkout',
    buyer_email VARCHAR(255),
    buyer_phone VARCHAR(50),
    buyer_name VARCHAR(255),
    status ENUM('pending','confirmed','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
    payment_status ENUM('unpaid','paid','refunded','partial') DEFAULT 'unpaid',
    payment_method VARCHAR(50) COMMENT 'cod, bkash, nagad, rocket, sslcommerz',
    payment_reference VARCHAR(255),
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    shipping_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'BDT',
    shipping_address JSON,
    billing_address JSON,
    notes TEXT,
    coupon_code VARCHAR(50),
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_buyer (buyer_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    variant_id CHAR(36),
    seller_id CHAR(36) NOT NULL,
    product_name VARCHAR(500) NOT NULL,
    variant_name VARCHAR(255),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id),
    INDEX idx_seller (seller_id)
) ENGINE=InnoDB;

-- ============================================================
-- CART ITEMS (server-side cart)
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id CHAR(36) PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL COMMENT 'browser session or user_id',
    user_id CHAR(36) NULL,
    product_id CHAR(36) NOT NULL,
    variant_id CHAR(36),
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_session (session_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- SERVICES (service listings from businesses)
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
    id CHAR(36) PRIMARY KEY,
    business_id CHAR(36) NOT NULL,
    seller_id CHAR(36) NOT NULL,
    category_id CHAR(36),
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    description MEDIUMTEXT,
    short_description VARCHAR(1000),
    price_type ENUM('fixed','hourly','custom') DEFAULT 'custom',
    price DECIMAL(12,2) NULL,
    price_from DECIMAL(12,2) NULL COMMENT 'starting price for custom quotes',
    currency VARCHAR(3) DEFAULT 'BDT',
    images JSON,
    featured_image VARCHAR(500),
    features JSON COMMENT 'array of included feature strings',
    delivery_time VARCHAR(100) COMMENT 'e.g. "3-5 days"',
    revisions INT DEFAULT 1,
    tags JSON,
    status ENUM('draft','active','archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    order_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_seller (seller_id),
    INDEX idx_business (business_id),
    INDEX idx_status (status),
    FULLTEXT INDEX idx_search (name, description, short_description)
) ENGINE=InnoDB;

-- ============================================================
-- SERVICE ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS service_orders (
    id CHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    service_id CHAR(36) NOT NULL,
    buyer_id CHAR(36),
    buyer_email VARCHAR(255),
    buyer_phone VARCHAR(50),
    seller_id CHAR(36) NOT NULL,
    status ENUM('pending','in_progress','revision','completed','cancelled','refunded') DEFAULT 'pending',
    payment_status ENUM('unpaid','paid','refunded') DEFAULT 'unpaid',
    payment_method VARCHAR(50),
    amount DECIMAL(12,2) NOT NULL,
    requirements TEXT COMMENT 'buyer requirements/brief',
    delivery_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order_number (order_number),
    INDEX idx_seller (seller_id),
    INDEX idx_buyer (buyer_id)
) ENGINE=InnoDB;
