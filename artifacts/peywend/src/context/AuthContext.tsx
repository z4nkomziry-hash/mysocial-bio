import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetMe, User } from '@workspace/api-client-react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem('peywend_token'); }
    catch { return null; }
  });

  const [user, setUser] = useState<User | null>(null);

  // Hydrate user from server on page load / refresh if a token exists
  const {
    data: meData,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useGetMe({
    query: {
      enabled: !!token && !user,
      retry: false,
    },
  });

  // Populate user once the /me response arrives
  useEffect(() => {
    if (meData) setUser(meData);
  }, [meData]);

  // Auto-logout if the stored token is rejected (401 / expired)
  useEffect(() => {
    if (isMeError && token) {
      try { localStorage.removeItem('peywend_token'); } catch { /* ignore */ }
      setToken(null);
      setUser(null);
    }
  }, [isMeError]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (newUser: User, newToken: string) => {
    try { localStorage.setItem('peywend_token', newToken); } catch { /* ignore */ }
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    try { localStorage.removeItem('peywend_token'); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  };

  // isLoading is true only while we're waiting for the /me hydration call
  const isLoading = !!token && !user && isMeLoading;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
