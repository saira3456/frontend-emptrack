'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  token: string;
  position?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Get API URL from environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userData = localStorage.getItem('user');
    
    if (token && role && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('🔐 Login attempt for:', email);
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      console.log('📥 Login response:', data); // ✅ Check this

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        console.log('✅ Token received, role:', data.role); // ✅ Check role
        
        const newUser: User = { 
          id: data.id || (data.role === 'admin' ? 'admin' : data.id),
          name: data.name || (data.role === 'admin' ? 'Administrator' : data.email.split('@')[0]),
          email: data.email, 
          role: data.role, 
          token: data.token,
          position: data.position,
          department: data.department
        };
        
        console.log('👤 User object created:', newUser); // ✅ Check user object
        
        setUser(newUser);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        console.log('💾 User saved to localStorage');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Separate admin login if needed
  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Admin login failed');
      }

      if (data.token) {
        const newUser: User = { 
          id: 'admin',
          name: 'Administrator',
          email: data.email, 
          role: 'admin', 
          token: data.token 
        };
        
        setUser(newUser);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'admin');
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Separate employee login if needed
  const employeeLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login/employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Employee login failed');
      }

      if (data.token) {
        const newUser: User = { 
          id: data.id,
          name: data.name,
          email: data.email, 
          role: 'employee', 
          token: data.token,
          position: data.position,
          department: data.department
        };
        
        setUser(newUser);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'employee');
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);
    
    // Force a small delay then redirect
    setTimeout(() => {
      window.location.href = '/'; // Use window.location for hard redirect
    }, 100);
  };

  const value = {
    user,
    isLoading,
    login, // Unified login
    logout,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};