// Auth hook — replaces Supabase auth with PHP session + JWT

import { useState, useEffect, useCallback } from 'react';
import { authApi, setAuthToken, getAuthToken, type User } from './api';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const { user: u } = await authApi.me();
      setUser(u);
    } catch {
      setUser(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const { user: u, token } = await authApi.login(email, password);
    setAuthToken(token);
    setUser(u);
  };

  const register = async (email: string, password: string) => {
    const { user: u, token } = await authApi.register(email, password);
    setAuthToken(token);
    setUser(u);
  };

  const logout = async () => {
    await authApi.logout();
    setAuthToken(null);
    setUser(null);
  };

  const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('super_admin') || false;
  const isSuperAdmin = user?.roles?.includes('super_admin') || false;

  return { user, loading, isAdmin, isSuperAdmin, login, register, logout, refresh };
}
