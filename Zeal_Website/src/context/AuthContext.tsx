import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { IUser } from '../types';
import {
  authService,
  type IRegisterPayload,
  type IUpdateProfilePayload,
  type IChangePasswordPayload,
} from '../api/authService';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ otpRequired?: boolean; otp?: string; message?: string }>;
  verifyOtp: (email: string, otp: string, purpose?: string) => Promise<void>;
  register: (payload: IRegisterPayload) => Promise<{ message: string }>;
  updateUserProfile: (payload: IUpdateProfilePayload) => Promise<{ message: string }>;
  changePassword: (payload: IChangePasswordPayload) => Promise<{ message: string }>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto-cleanup or load session on startup
  useEffect(() => {
    try {
      if (authService.isSessionExpired()) {
        authService.logout();
        setToken(null);
        setUser(null);
      } else {
        const savedToken = authService.getToken();
        const savedUser = authService.getCurrentUser();
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    if (res.token && res.user) {
      setUser(res.user);
      setToken(res.token);
    }
    return res;
  };

  const verifyOtp = async (email: string, otp: string, purpose: string = 'adminLogin') => {
    const res = await authService.verifyOtp(email, otp, purpose);
    if (res.token && res.user) {
      setUser(res.user);
      setToken(res.token);
    }
  };

  const register = async (payload: IRegisterPayload) => {
    return authService.register(payload);
  };

  const updateUserProfile = async (payload: IUpdateProfilePayload) => {
    const res = await authService.updateProfile(payload);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const changePassword = async (payload: IChangePasswordPayload) => {
    return authService.changePassword(payload);
  };

  const refreshProfile = useCallback(async () => {
    if (!authService.getToken()) return;
    try {
      const updatedUser = await authService.getProfile();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch {
      // Ignored if offline
    }
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        verifyOtp,
        register,
        updateUserProfile,
        changePassword,
        refreshProfile,
        logout,
      }}
    >
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
