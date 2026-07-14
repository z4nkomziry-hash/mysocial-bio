import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetMe, User } from '@workspace/api-client-react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('peywend_token');
    } catch (e) {
      return null;
    }
  });

  const { data: meData, isLoading: isMeLoading } = useGetMe({
    query: {
      enabled: !!token,
      retry: false,
    }
  });

  const user = meData || null;

  const login = (newUser: User, newToken: string) => {
    setToken(newToken);
    localStorage.setItem('peywend_token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('peywend_token');
  };

  const isLoading = !!token && isMeLoading;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
