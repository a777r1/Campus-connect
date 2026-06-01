import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: User['role'], name?: string, email?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: User['role'], name?: string, email?: string) => {
    setUser({
      id: 'mock-user-id',
      name: name || (role === 'admin' ? 'Admin Faculty' : 'John Student'),
      email: email || (role === 'admin' ? 'admin@college.edu' : 'john@college.edu'),
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || role}`,
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'faculty'
    }}>
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
