// API client — replaces Supabase client with PHP+MySQL backend

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

let authToken: string | null = localStorage.getItem('auth_token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

async function request<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    credentials: 'include', // Send cookies for session auth
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Add JWT if available
  if (authToken) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API error ${res.status}`);
  }

  return data as T;
}

// ============================================================
// Auth API
// ============================================================
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (email: string, password: string) =>
    request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: { email, password },
    }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  me: () => request<{ user: User | null }>('/auth/me'),
};

// ============================================================
// Business API
// ============================================================
export interface Business {
  id: string;
  owner_id?: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  logo_url?: string;
  cover_url?: string;
  rating: number;
  review_count: number;
  status: string;
  is_verified: boolean;
  is_featured: boolean;
  tags?: string[];
  services?: string[];
  social_links?: Record<string, string>;
  business_hours?: Record<string, string>;
  reviews?: Review[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  author_id?: string;
  author_email?: string;
  rating: number;
  title?: string;
  body?: string;
  status: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  roles: string[];
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  business_count?: number;
  businesses?: Business[];
}

export const businessApi = {
  list: (params?: { page?: number; limit?: number; category?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.category) qs.set('category', params.category);
    if (params?.status) qs.set('status', params.status);
    return request<{ data: Business[]; total: number; page: number; limit: number }>(`/businesses?${qs}`);
  },

  featured: (limit = 6) =>
    request<Business[]>(`/businesses/featured?limit=${limit}`),

  search: (q: string, limit = 20) =>
    request<Business[]>(`/businesses/search?q=${encodeURIComponent(q)}&limit=${limit}`),

  stats: () =>
    request<{ total_businesses: number; countries: number; categories: number; total_reviews: number }>('/businesses/stats'),

  get: (slug: string) =>
    request<Business & { reviews: Review[] }>(`/businesses/${slug}`),

  create: (data: Partial<Business>) =>
    request<{ id: string; slug: string }>('/businesses', { method: 'POST', body: data }),

  update: (id: string, data: Partial<Business>) =>
    request(`/businesses/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request(`/businesses/${id}`, { method: 'DELETE' }),
};

// ============================================================
// Category API
// ============================================================
export const categoryApi = {
  list: () => request<Category[]>('/categories'),
  get: (slug: string) => request<Category>(`/categories/${slug}`),
};

// ============================================================
// Review API
// ============================================================
export const reviewApi = {
  list: (params?: { business_id?: string; status?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.business_id) qs.set('business_id', params.business_id);
    if (params?.status) qs.set('status', params.status);
    if (params?.limit) qs.set('limit', String(params.limit));
    return request<Review[]>(`/reviews?${qs}`);
  },

  create: (data: { business_id: string; rating: number; title?: string; body?: string }) =>
    request<{ id: string }>('/reviews', { method: 'POST', body: data }),

  update: (id: string, data: { status: string }) =>
    request(`/reviews/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request(`/reviews/${id}`, { method: 'DELETE' }),
};

// ============================================================
// Admin API
// ============================================================

// AI Listing type — must be defined before adminApi uses it
export interface AiListing {
  id: string;
  name: string;
  slug: string;
  tier: string;
  status: string;
  is_verified: boolean;
  is_featured: boolean;
  ai_listing_enabled: boolean;
  ai_listing_source: 'paid' | 'admin' | null;
  ai_listing_updated_at: string | null;
  rating: number;
  review_count: number;
  category_name: string;
  owner_email: string;
}

export const adminApi = {
  dashboard: () =>
    request<{
      total_businesses: number;
      pending_businesses: number;
      total_users: number;
      total_reviews: number;
      pending_reviews: number;
      total_subscribers: number;
      total_messages: number;
      unread_messages: number;
    }>('/admin/dashboard'),

  users: () => request<(User & { roles: string[] })[]>('/admin/users'),

  setRole: (userId: string, role: string, action: string = 'grant') =>
    request(`/admin/users/${userId}/role`, { method: 'PUT', body: { role, action } }),

  getSettings: () => request<Record<string, unknown>>('/admin/settings'),

  updateSettings: (settings: Record<string, unknown>) =>
    request('/admin/settings', { method: 'PUT', body: settings }),

  claims: () => request('/admin/claims'),

  reviewClaim: (claimId: string, status: string) =>
    request(`/admin/claims/${claimId}`, { method: 'PUT', body: { status } }),

  mcpConfig: () => request('/admin/mcp'),

  updateMcp: (config: Record<string, unknown>) =>
    request('/admin/mcp', { method: 'PUT', body: config }),

  mcpAnalytics: () =>
    request<{
      total_calls: number;
      by_tool: { tool_name: string; calls: number }[];
      by_client: { client_id: string; calls: number }[];
      daily: { day: string; calls: number }[];
    }>('/admin/mcp/analytics'),

  mcpClients: () => request('/admin/mcp/clients'),

  mcpCreateClient: (data: {
    client_name: string;
    redirect_uris: string[];
    scope: string;
    grant_types: string[];
  }) => request('/admin/mcp/clients', { method: 'POST', body: data }),

  mcpDeleteClient: (clientId: string) =>
    request(`/admin/mcp/clients/${clientId}`, { method: 'DELETE' }),

  // AI Listing — admin controls which businesses appear in MCP/AI results
  aiListings: () =>
    request<AiListing[]>('/admin/ai-listings'),

  toggleAiListing: (businessId: string, enabled: boolean) =>
    request(`/admin/ai-listings/${businessId}`, { method: 'PUT', body: { enabled } }),
};

// ============================================================
// Vendor MCP Key API
// ============================================================
export interface VendorMcpKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string;
  is_active: boolean;
  expires_at: string | null;
  last_used: string | null;
  created_at: string;
}

export const vendorMcpApi = {
  listKeys: () => request<VendorMcpKey[]>('/vendor/mcp-keys'),
  createKey: (data: { business_id: string; name: string }) =>
    request<{ id: string; key: string; message: string }>('/vendor/mcp-keys', { method: 'POST', body: data }),
  revokeKey: (keyId: string) =>
    request(`/vendor/mcp-keys/${keyId}`, { method: 'DELETE' }),
};

// ============================================================
// Contact API
// ============================================================
export const contactApi = {
  submit: (data: { name: string; email: string; subject?: string; message: string }) =>
    request('/contact', { method: 'POST', body: data }),
};

// ============================================================
// Newsletter API
// ============================================================
export const newsletterApi = {
  subscribe: (email: string) =>
    request('/newsletter', { method: 'POST', body: { email } }),

  unsubscribe: (email: string) =>
    request(`/newsletter/${encodeURIComponent(email)}`, { method: 'DELETE' }),
};

// ============================================================
// Upload API
// ============================================================
export const uploadApi = {
  upload: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
};

// ============================================================
// Claim API (public, authenticated)
// ============================================================
export interface Claim {
  id: string;
  business_id: string;
  status: string;
  evidence: string;
  rejection_reason: string | null;
  additional_docs_requested: string | null;
  claim_type: string;
  created_at: string;
  reviewed_at: string | null;
}

export interface AuditLog {
  id: string;
  action: string;
  actor_role: string;
  notes: string | null;
  created_at: string;
}

export const claimApi = {
  listByBusiness: (businessId: string) =>
    request<Claim[]>(`/claims?business_id=${businessId}`),

  auditLog: (businessId: string, limit = 20) =>
    request<AuditLog[]>(`/claims/audit?business_id=${businessId}&limit=${limit}`),

  submit: (data: { business_id: string; evidence: string; claim_type: string }) =>
    request<{ id: string }>('/claims', { method: 'POST', body: data }),
};

// ============================================================
// Pricing API (public)
// ============================================================
export interface PricingTier {
  id: string;
  slug: string;
  name: string;
  price_usd: number;
  price_bdt: number | null;
  billing_period: string;
  features: string[];
  display_order: number;
  is_active: boolean;
}

export const pricingApi = {
  list: () => request<PricingTier[]>('/pricing'),
};

// ============================================================
// Blog API (public)
// ============================================================
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  cover_url?: string;
  published_at?: string;
  tags?: string[];
}

export const blogApi = {
  list: (limit = 48) => request<BlogPost[]>(`/blog?limit=${limit}`),
  get: (slug: string) => request<BlogPost>(`/blog/${slug}`),
};

// ============================================================
// Feed API (public)
// ============================================================
export const feedApi = {
  jsonLd: (params?: { category?: string; minRating?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.minRating) qs.set('minRating', String(params.minRating));
    if (params?.limit) qs.set('limit', String(params.limit));
    return fetch(`${BASE_URL}/feed?${qs}`).then(r => r.json());
  },

  llmsTxt: () => fetch(`${BASE_URL}/feed/llms`).then(r => r.text()),
};

// ============================================================
// Marketplace — Products API
// ============================================================
export interface Product {
  id: string;
  seller_id: string;
  business_id?: string;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  seller_email?: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_at_price?: number | null;
  currency: string;
  sku?: string;
  barcode?: string;
  stock: number;
  track_inventory: boolean;
  weight?: number | null;
  images: string[];
  featured_image?: string;
  tags: string[];
  status: 'draft' | 'active' | 'archived';
  is_featured: boolean;
  rating: number;
  review_count: number;
  sales_count: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  image?: string;
  options?: Record<string, string>;
  is_active: boolean;
  sort_order: number;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id?: string;
  reviewer_email?: string;
  rating: number;
  title?: string;
  body?: string;
  images?: string[];
  is_verified_purchase: boolean;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  product_count?: number;
}

export interface ProductListParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating';
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const productApi = {
  list: (params?: ProductListParams) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.search) qs.set('search', params.search);
    if (params?.category_id) qs.set('category_id', params.category_id);
    if (params?.min_price) qs.set('min_price', String(params.min_price));
    if (params?.max_price) qs.set('max_price', String(params.max_price));
    if (params?.is_featured) qs.set('is_featured', '1');
    if (params?.sort) qs.set('sort', params.sort);
    return request<PaginatedResponse<Product>>(`/products?${qs}`);
  },

  get: (idOrSlug: string) => request<Product>(`/products/${idOrSlug}`),

  categories: () => request<ProductCategory[]>('/products/categories'),

  create: (data: Partial<Product>) =>
    request<Product>('/products', { method: 'POST', body: data }),

  update: (id: string, data: Partial<Product>) =>
    request<Product>(`/products/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request<{ deleted: boolean }>(`/products/${id}`, { method: 'DELETE' }),

  sellerProducts: () => request<Product[]>('/products/seller'),
};

// ============================================================
// Marketplace — Cart API
// ============================================================
export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string | null;
  quantity: number;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  featured_image?: string;
  variant_name?: string;
  variant_price?: number;
  variant_image?: string;
  category_name?: string;
  unit_price: number;
  line_total: number;
}

export interface CartResponse {
  items: CartItem[];
  item_count: number;
  subtotal: number;
  currency: string;
}

export const cartApi = {
  show: () => request<CartResponse>('/cart'),

  add: (data: { product_id: string; variant_id?: string | null; quantity: number }) =>
    request<CartResponse>('/cart', { method: 'POST', body: data }),

  update: (itemId: string, quantity: number) =>
    request<CartResponse>(`/cart/${itemId}`, { method: 'PATCH', body: { quantity } }),

  remove: (itemId: string) =>
    request<CartResponse>(`/cart/${itemId}`, { method: 'DELETE' }),

  clear: () => request<CartResponse>('/cart', { method: 'DELETE' }),
};

// ============================================================
// Marketplace — Orders API
// ============================================================
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  total: number;
  image?: string;
  product_slug?: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id?: string;
  buyer_email?: string;
  buyer_phone?: string;
  buyer_name?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'partial';
  payment_method?: string;
  subtotal: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
  currency: string;
  shipping_address?: Record<string, unknown>;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export const orderApi = {
  list: (params?: { page?: number; per_page?: number; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.status) qs.set('status', params.status);
    return request<PaginatedResponse<Order>>(`/orders?${qs}`);
  },

  get: (id: string) => request<Order>(`/orders/${id}`),

  create: (data: {
    shipping_address: Record<string, unknown>;
    buyer_email?: string;
    buyer_phone?: string;
    buyer_name?: string;
    payment_method?: string;
    notes?: string;
  }) => request<Order>('/orders', { method: 'POST', body: data }),

  sellerOrders: (params?: { page?: number; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.status) qs.set('status', params.status);
    return request<PaginatedResponse<Order>>(`/seller/orders?${qs}`);
  },

  sellerUpdate: (id: string, data: { status?: string }) =>
    request<Order>(`/seller/orders/${id}`, { method: 'PUT', body: data }),
};

// ============================================================
// Marketplace — Services API
// ============================================================
export interface Service {
  id: string;
  business_id: string;
  seller_id: string;
  category_id?: string;
  business_name?: string;
  business_slug?: string;
  business_description?: string;
  logo_url?: string;
  seller_email?: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price_type: 'fixed' | 'hourly' | 'custom';
  price?: number | null;
  price_from?: number | null;
  currency: string;
  images?: string[];
  featured_image?: string;
  features?: string[];
  delivery_time?: string;
  revisions?: number;
  tags?: string[];
  status: 'draft' | 'active' | 'archived';
  is_featured: boolean;
  rating: number;
  review_count: number;
  order_count: number;
  created_at: string;
}

export const serviceApi = {
  list: (params?: { page?: number; per_page?: number; search?: string; business_id?: string; is_featured?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.search) qs.set('search', params.search);
    if (params?.business_id) qs.set('business_id', params.business_id);
    if (params?.is_featured) qs.set('is_featured', '1');
    return request<PaginatedResponse<Service>>(`/services?${qs}`);
  },

  get: (idOrSlug: string) => request<Service>(`/services/${idOrSlug}`),

  create: (data: Partial<Service>) =>
    request<Service>('/services', { method: 'POST', body: data }),

  update: (id: string, data: Partial<Service>) =>
    request<Service>(`/services/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request<{ deleted: boolean }>(`/services/${id}`, { method: 'DELETE' }),

  createOrder: (data: { service_id: string; requirements: string; buyer_email?: string; buyer_phone?: string }) =>
    request<Order>('/service-orders', { method: 'POST', body: data }),
};
