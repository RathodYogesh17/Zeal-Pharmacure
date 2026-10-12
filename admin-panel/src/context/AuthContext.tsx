import React, { createContext, useContext, useState, useEffect } from 'react';
import type { IUser } from '../types';
import { authService, type LoginResult } from '../api/authService';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (email: string, pass: string) => Promise<LoginResult>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: IUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronous initialization prevents any async null-flash redirect on refresh
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [user, setUser] = useState<IUser | null>(() => authService.getCurrentUser());
  const [isAuthReady, setIsAuthReady] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = () => {
      // 1. If 15-day session expired, log out automatically
      if (authService.isSessionExpired()) {
        authService.logout();
        setUser(null);
        setToken(null);
        return;
      }

      // 2. Refresh state if needed
      const savedToken = authService.getToken();
      const savedUser = authService.getCurrentUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
      } else {
        setUser(null);
        setToken(null);
      }
    };

    initAuth();

    // Background sync to fetch fresh profile image & details
    if (authService.getToken() && !authService.isSessionExpired()) {
      authService.getMe().then((fresh) => {
        if (fresh) {
          setUser(fresh);
        }
      }).catch(() => {});
    }

    // Periodic check every 30 minutes for 15-day expiration
    const interval = setInterval(() => {
      if (authService.isSessionExpired()) {
        authService.logout();
        setUser(null);
        setToken(null);
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    const res = await authService.login(email, pass);
    if (!res.requiresOtp && res.token && res.user) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const verifyOtp = async (email: string, otp: string): Promise<void> => {
    const res = await authService.verifyOtp(email, otp);
    setUser(res.user);
    setToken(res.token);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem('zeal_user', JSON.stringify(updatedUser));
    localStorage.setItem('zeal_admin_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isAuthReady, login, verifyOtp, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {throw new Error('useAuth must be used within an AuthProvider');}
  return context;
};
