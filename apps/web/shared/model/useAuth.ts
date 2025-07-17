'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from './authStore';

export function useAuth() {
  const { user, setUser, logout } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (isError) {
      logout();
    }
  }, [data, isError, setUser, logout]);

  return {
    user: user || null,
    isLoading,
    isError,
    isAuthenticated: !!user,
  };
}
