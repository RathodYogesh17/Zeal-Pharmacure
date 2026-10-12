import { request } from './apiClient';
import type { IUser } from '../types';

export interface IStaffUser extends IUser {
  phone: string;
  isActive: boolean;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: any;
  updatedBy?: any;
}

export const userService = {
  async getAllUsers(params: { role?: string; page?: number; limit?: number } = {}): Promise<{ users: IStaffUser[]; total: number }> {
    try {
      const query = new URLSearchParams();
      if (params.role) query.append('role', params.role);
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit || 50));

      const qs = query.toString();
      const res = await request<{ users: any[]; total: number }>(`/users${qs ? `?${qs}` : ''}`);
      const rawUsers = res.data?.users || [];
      const normalizedUsers: IStaffUser[] = rawUsers.map((u: any) => ({
        ...u,
        role: typeof u.role === 'object' && u.role !== null ? (u.role.name || u.role.code || 'USER') : String(u.role || 'USER'),
      }));
      return { users: normalizedUsers, total: res.data?.total ?? normalizedUsers.length };
    } catch {
      return { users: [], total: 0 };
    }
  },

  async createStaff(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    isActive?: boolean;
  }): Promise<IStaffUser> {
    const res = await request<IStaffUser>('/users/staff', { method: 'POST', body: JSON.stringify(payload),});
    return res.data;
  },

  async toggleActive(userId: string, currentlyActive: boolean): Promise<void> {
    const endpoint = currentlyActive ? `/users/${userId}/deactivate` : `/users/${userId}/activate`;
    await request(endpoint, { method: 'PUT',});
  },

  async deleteUser(userId: string): Promise<void> {
    await request(`/users/${userId}`, { method: 'DELETE',});
  },

  async getUserPermissions(userId: string): Promise<{ permissions: string[]; effectivePermissions?: string[] }> {
    try {
      const res = await request<{ permissions: string[]; effectivePermissions?: string[] }>(`/settings/users/${userId}/permissions`);
      return res.data;
    } catch {
      return { permissions: [] };
    }
  },

  async assignUserPermissions(userId: string, permissions: string[]): Promise<any> {
    try {
      const res = await request(`/settings/users/${userId}/permissions`, { method: 'PUT', body: JSON.stringify({ permissions }),});
      return res.data;
    } catch {
      const res = await request(`/users/${userId}`, { method: 'PUT', body: JSON.stringify({ permissions }), });
      return res.data;
    }
  },
};
