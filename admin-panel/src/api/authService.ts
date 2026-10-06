import { request } from './apiClient';
import type { IUser } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    const res = await request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Case 1: Direct token returned
    if (res.data?.accessToken || res.data?.token) {
      const token = res.data.accessToken || res.data.token;
      const user = res.data.user;
      localStorage.setItem('zeal_token', token);
      localStorage.setItem('zeal_admin_token', token);
      localStorage.setItem('zeal_user', JSON.stringify(user));
      localStorage.setItem('zeal_admin_user', JSON.stringify(user));
      return { token, user };
    }

    // Case 2: 2FA OTP verification required (for SUPER_ADMIN / ADMIN roles)
    if (res.data?.otp) { const verifyRes = await request<any>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({  email,  otp: res.data.otp,  purpose: 'adminLogin', }),
      });

      const vAny = verifyRes as any;
      const token = vAny.accessToken || vAny.data?.accessToken;
      const user = vAny.user || vAny.data?.user;

      if (token) {
        localStorage.setItem('zeal_token', token);
        localStorage.setItem('zeal_admin_token', token);
        localStorage.setItem('zeal_user', JSON.stringify(user));
        localStorage.setItem('zeal_admin_user', JSON.stringify(user));
        return { token, user };
      }
    }

    throw new Error('Authentication failed. No access token provided.');
  },

  async verifyOtp(email: string, otp: string): Promise<{ token: string; user: IUser }> {  const res = await request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, purpose: 'adminLogin' }),
    });

    const rAny = res as any;
    const token = rAny.accessToken || rAny.data?.accessToken;
    const user = rAny.user || rAny.data?.user;

    if (token) {
      localStorage.setItem('zeal_token', token);
      localStorage.setItem('zeal_admin_token', token);
      localStorage.setItem('zeal_user', JSON.stringify(user));
      localStorage.setItem('zeal_admin_user', JSON.stringify(user));
      return { token, user };
    }

    throw new Error('OTP verification failed.');
  },

  getCurrentUser(): IUser | null {
    try {
      const u = localStorage.getItem('zeal_admin_user') || localStorage.getItem('zeal_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('zeal_admin_token') || localStorage.getItem('zeal_token');
  },

  isAuthenticated(): boolean {
    return !!(localStorage.getItem('zeal_admin_token') || localStorage.getItem('zeal_token'));
  },

  logout(): void {
    localStorage.removeItem('zeal_token');
    localStorage.removeItem('zeal_admin_token');
    localStorage.removeItem('zeal_user');
    localStorage.removeItem('zeal_admin_user');
  },
};
