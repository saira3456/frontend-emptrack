'use client';

import { useEffect } from 'react';
import { useAuth } from './auth-context';

export function AuthRestorer() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) return;

    // Restore user from sessionStorage on mount
    const stored = sessionStorage.getItem('emptrack-user');
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        sessionStorage.setItem('emptrack-user', JSON.stringify(parsedUser));
      } catch {
        sessionStorage.removeItem('emptrack-user');
      }
    }
  }, [user]);

  return null;
}
