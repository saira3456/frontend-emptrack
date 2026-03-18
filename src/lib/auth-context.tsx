'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'employee';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication function
function authenticateUser(email: string, password: string): AuthUser | null {
  // Demo credentials
  if (email === 'admin@emptrack.com' && password === 'password') {
    return {
      id: 'admin-1',
      email: 'admin@emptrack.com',
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    };
  }

  if (email === 'employee@emptrack.com' && password === 'password') {
    return {
      id: 'emp-101',
      email: 'employee@emptrack.com',
      name: 'John Smith',
      role: 'employee',
      avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    };
  }

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const authUser = authenticateUser(email, password);
      if (!authUser) {
        throw new Error('Invalid credentials');
      }

      setUser(authUser);
      // Store in sessionStorage for persistence
      sessionStorage.setItem('emptrack-user', JSON.stringify(authUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('emptrack-user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
