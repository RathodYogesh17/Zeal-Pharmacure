import { request } from './apiClient';
import type { IUser } from '../types';

// 15 Days Session Expiration in milliseconds
const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;
const TOKEN_KEY = 'zeal_token';
const USER_KEY = 'zeal_user';
const LOGIN_TIME_KEY = 'zeal_login_time';

export interface IRegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  profileImage?: string | null;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUpdateProfilePayload {
  name?: string;
  phone?: string;
  designation?: string;
  department?: string;
  profileImage?: string | null;
  profileImageFile?: File | null;
}

export const authService = {
  /**
   * Check if session has exceeded 15 days
   */
  isSessionExpired(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return true;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          return true;
        }
      }
    } catch {
      // Fallback if parsing fails
    }

    const loginTimeStr = localStorage.getItem(LOGIN_TIME_KEY);
    if (!loginTimeStr) return false;
    const loginTime = parseInt(loginTimeStr, 10);
    if (isNaN(loginTime)) return true;
    return Date.now() - loginTime > FIFTEEN_DAYS_MS;
  },

  /**
   * Save session data with timestamp
   */
  setSession(token: string, user: IUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
  },

  /**
   * User login (handles direct token and 2FA OTP if required)
   */
  async login(email: string, password: string): Promise<{ token?: string; user?: IUser; otpRequired?: boolean; otp?: string; message?: string }> {
    const res = await request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    // Case 1: Direct token returned (Standard for regular USER role)
    if (res.data?.accessToken || res.data?.token) {
      const token = res.data.accessToken || res.data.token;
      const user = res.data.user;
      this.setSession(token, user);
      return { token, user, message: res.message || 'Login successful' };
    }

    // Case 2: 2FA OTP required
    if (res.data?.otp || res.data?.otpSent) {
      return {
        otpRequired: true,
        otp: res.data.otp,
        message: res.message || 'OTP verification code has been sent',
      };
    }

    throw new Error(res.message || 'Authentication failed. Please check your credentials.');
  },

  /**
   * User Registration
   */
  async register(payload: IRegisterPayload): Promise<{ user: IUser; message: string }> {
    const rawDigits = payload.phone.replace(/[\s\-\(\)\+]/g, '');
    const cleanPhone = rawDigits.length > 10 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;

    const res = await request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: cleanPhone || payload.phone.trim(),
        password: payload.password,
        confirmPassword: payload.confirmPassword || payload.password,
        profileImage: payload.profileImage || null,
      }),
    });

    return {
      user: res.data?.user || res.data,
      message: res.message || 'Account created successfully! You can now log in.',
    };
  },

  /**
   * Verify OTP (for login or general verification)
   */
  async verifyOtp(email: string, otp: string, purpose: string = 'adminLogin'): Promise<{ token?: string; user?: IUser; message?: string }> {
    const res = await request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim(), purpose }),
    });

    const rAny = res as any;
    const token = rAny.accessToken || rAny.data?.accessToken;
    const user = rAny.user || rAny.data?.user;

    if (token && user) {
      this.setSession(token, user);
      return { token, user, message: res.message || 'OTP verified successfully' };
    }

    return { message: res.message || 'OTP verified successfully' };
  },

  /**
   * Forgot Password - send OTP
   */
  async forgotPassword(email: string): Promise<{ message: string; otp?: string; otpSent?: boolean }> {
    const res = await request<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    return {
      message: res.message || 'If an account exists, a password reset OTP has been sent.',
      otp: (res as any).otp || (res as any).data?.otp,
      otpSent: (res as any).otpSent || (res as any).data?.otpSent,
    };
  },

  /**
   * Reset Password with OTP
   */
  async resetPassword(payload: IResetPasswordPayload): Promise<{ message: string }> {
    const res = await request<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        otp: payload.otp.trim(),
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword,
      }),
    });

    return {
      message: res.message || 'Password reset successfully. You can now login with your new password.',
    };
  },

  /**
   * Change Password (Authenticated)
   */
  async changePassword(payload: IChangePasswordPayload): Promise<{ message: string }> {
    const res = await request<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword,
      }),
    });

    return {
      message: res.message || 'Password changed successfully',
    };
  },

  /**
   * Get Current User Profile from API
   */
  async getProfile(): Promise<IUser> {
    const res = await request<any>('/auth/me');
    const user = res.data?.user || res.data;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return user;
  },

  /**
   * Update Profile (Name, Phone, Profile Image)
   */
  async updateProfile(payload: IUpdateProfilePayload): Promise<{ user: IUser; message: string }> {
    let res: any;

    if (payload.profileImageFile) {
      // Use FormData to upload profile image
      const formData = new FormData();
      if (payload.name) formData.append('name', payload.name);
      if (payload.phone !== undefined) formData.append('phone', payload.phone || '');
      if (payload.designation !== undefined) formData.append('designation', payload.designation || '');
      if (payload.department !== undefined) formData.append('department', payload.department || '');
      formData.append('profileImage', payload.profileImageFile);

      const token = localStorage.getItem('zeal_token');
      const headers: HeadersInit = { Accept: 'application/json' };
      if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers,
        body: formData,
      });
      res = await response.json();
      if (!response.ok) throw new Error(res?.message || 'Failed to update profile');
    } else {
      // JSON update for text fields
      res = await request<any>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: payload.name,
          phone: payload.phone,
          designation: payload.designation,
          department: payload.department,
          profileImage: payload.profileImage,
        }),
      });
    }

    const user = res.data?.user || res.data;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return {
      user,
      message: res.message || 'Profile updated successfully',
    };
  },

  getCurrentUser(): IUser | null {
    if (this.isSessionExpired()) {
      this.logout();
      return null;
    }
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    if (this.isSessionExpired()) {
      this.logout();
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    if (this.isSessionExpired()) {
      this.logout();
      return false;
    }
    return !!localStorage.getItem(TOKEN_KEY);
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LOGIN_TIME_KEY);
  },
};
