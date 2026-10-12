import { request } from './apiClient';
import type { IUser } from '../types';

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

export interface LoginResult {
  requiresOtp?: boolean;
  otp?: string;
  message?: string;
  token?: string;
  user?: IUser;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    const res = await request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = res.data || {};

    // 1. If Admin/SuperAdmin requires OTP verification
    if (data.requiresOtp || (data.otp && !data.accessToken && !data.token)) {
      return {
        requiresOtp: true,
        otp: data.otp,
        message: res.message || 'Verification code sent to your registered email.',
      };
    }

    // 2. Direct token returned (for non-admin staff)
    if (data.accessToken || data.token) {
      const token = data.accessToken || data.token;
      const user = data.user;
      localStorage.setItem('zeal_token', token);
      localStorage.setItem('zeal_admin_token', token);
      localStorage.setItem('zeal_user', JSON.stringify(user));
      localStorage.setItem('zeal_admin_user', JSON.stringify(user));
      localStorage.setItem('zeal_admin_login_at', Date.now().toString());
      return { token, user };
    }

    throw new Error(res.message || 'Authentication failed. Please verify credentials.');
  },

  async verifyOtp(email: string, otp: string): Promise<{ token: string; user: IUser }> {
    const res = await request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp: otp.trim(), purpose: 'adminLogin' }),
    });

    const rAny = (res.data || res) as any;
    const token = rAny.accessToken || rAny.token;
    const user = rAny.user;

    if (token && user) {
      localStorage.setItem('zeal_token', token);
      localStorage.setItem('zeal_admin_token', token);
      localStorage.setItem('zeal_user', JSON.stringify(user));
      localStorage.setItem('zeal_admin_user', JSON.stringify(user));
      localStorage.setItem('zeal_admin_login_at', Date.now().toString());
      return { token, user };
    }

    throw new Error(res.message || 'Invalid or expired OTP code.');
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; otp?: string }> {
    const res = await request<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = (res.data || res) as any;
    return {
      success: true,
      message: res.message || 'Password reset OTP has been sent.',
      otp: data?.otp,
    };
  },

  async verifyResetOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const res = await request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), otp: otp.trim(), purpose: 'passwordReset' }),
    });
    return {
      success: true,
      message: res.message || 'OTP verified successfully.',
    };
  },

  async resetPassword(body: { email: string; otp: string; newPassword: string; confirmPassword: string }): Promise<{ success: boolean; message: string }> {
    const res = await request<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: body.email.trim(),
        otp: body.otp.trim(),
        newPassword: body.newPassword,
        confirmPassword: body.confirmPassword,
      }),
    });
    return {
      success: true,
      message: res.message || 'Password has been reset successfully.',
    };
  },

  isSessionExpired(): boolean {
    const token = localStorage.getItem('zeal_admin_token') || localStorage.getItem('zeal_token');
    if (!token) return true;

    const loginAtStr = localStorage.getItem('zeal_admin_login_at');
    if (!loginAtStr) {
      // If user is currently logged in, grant the full 15-day window from current time
      localStorage.setItem('zeal_admin_login_at', Date.now().toString());
      return false;
    }

    const loginAt = Number(loginAtStr);
    // Auto-logout ONLY after 15 full days have passed
    if (!isNaN(loginAt) && Date.now() - loginAt >= FIFTEEN_DAYS_MS) {
      return true;
    }

    return false;
  },

  getCurrentUser(): IUser | null {
    if (this.isSessionExpired()) {
      this.logout();
      return null;
    }
    try {
      const u = localStorage.getItem('zeal_admin_user') || localStorage.getItem('zeal_user');
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
    return localStorage.getItem('zeal_admin_token') || localStorage.getItem('zeal_token');
  },

  isAuthenticated(): boolean {
    if (this.isSessionExpired()) {
      this.logout();
      return false;
    }
    return !!(localStorage.getItem('zeal_admin_token') || localStorage.getItem('zeal_token'));
  },

  async getMe(): Promise<IUser | null> {
    try {
      const res = await request<any>('/auth/me');
      const user = res.data?.user || res.data;
      if (user && user._id) {
        localStorage.setItem('zeal_user', JSON.stringify(user));
        localStorage.setItem('zeal_admin_user', JSON.stringify(user));
        return user;
      }
      return null;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('zeal_token');
    localStorage.removeItem('zeal_admin_token');
    localStorage.removeItem('zeal_user');
    localStorage.removeItem('zeal_admin_user');
    localStorage.removeItem('zeal_admin_login_at');
  },
};
