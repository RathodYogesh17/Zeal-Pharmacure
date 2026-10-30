import React, { createContext, useContext, useState, useEffect } from 'react';
import type { IUser } from '../types';
import { authService, type LoginResult } from '../api/authService';
import { useAppDispatch } from '../store';
import { setCredentials, logout as reduxLogout } from '../store/slices/authSlice';

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
  const dispatch = useAppDispatch();
  // Synchronous initialization prevents any async null-flash redirect on refresh
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [user, setUser] = useState<IUser | null>(() => authService.getCurrentUser());
  const [isAuthReady, setIsAuthReady] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = () => {
      // 1. If 15-day session expired, log out automatically
      if (authService.isSessionExpired()) {
        authService.logout();
        dispatch(reduxLogout());
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
        dispatch(setCredentials({ user: savedUser as any, token: savedToken }));
      } else {
        setUser(null);
        setToken(null);
        dispatch(reduxLogout());
      }
    };

    initAuth();

    // Background sync to fetch fresh profile image & details
    if (authService.getToken() && !authService.isSessionExpired()) {
      authService.getMe().then((fresh) => {
        if (fresh) {
          setUser(fresh);
          const currentTkn = authService.getToken() || '';
          dispatch(setCredentials({ user: fresh as any, token: currentTkn }));
        }
      }).catch(() => {});
    }

    // Periodic check every 30 minutes for 15-day expiration
    const interval = setInterval(() => {
      if (authService.isSessionExpired()) {
        authService.logout();
        dispatch(reduxLogout());
        setUser(null);
        setToken(null);
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    const res = await authService.login(email, pass);
    if (!res.requiresOtp && res.token && res.user) {
      setUser(res.user);
      setToken(res.token);
      dispatch(setCredentials({ user: res.user as any, token: res.token }));
    }
    return res;
  };

  const verifyOtp = async (email: string, otp: string): Promise<void> => {
    const res = await authService.verifyOtp(email, otp);
    setUser(res.user);
    setToken(res.token);
    if (res.user && res.token) {
      dispatch(setCredentials({ user: res.user as any, token: res.token }));
    }
  };

  const logout = () => {
    authService.logout();
    dispatch(reduxLogout());
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem('zeal_user', JSON.stringify(updatedUser));
    localStorage.setItem('zeal_admin_user', JSON.stringify(updatedUser));
    dispatch(setCredentials({ user: updatedUser as any, token: token || authService.getToken() || '' }));
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
