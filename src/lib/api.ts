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
