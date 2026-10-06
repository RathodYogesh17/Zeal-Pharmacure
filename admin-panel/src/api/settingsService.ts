import { request } from './apiClient';

export interface IAuditLogItem {
  _id: string;
  userId: {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  action: string;
  module: string;
  targetType: string | null;
  targetId: string | null;
  status: 'SUCCESS' | 'FAILED';
  reason?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: any;
  createdAt: string;
}

export interface IAuditLogResponse {
  logs: IAuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IRoleItem {
  _id: string;
  name: string;
  code: string;
  description?: string;
  permissions?: string[];
  isSystem?: boolean;
}

export const settingsService = {
  // Audit Logs
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    module?: string;
    action?: string;
    status?: string;
    search?: string;
  } = {}): Promise<IAuditLogResponse> {
    try {
      const query = new URLSearchParams();
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
      if (params.module && params.module !== 'ALL') query.append('module', params.module);
      if (params.action && params.action !== 'ALL') query.append('action', params.action);
      if (params.status && params.status !== 'ALL') query.append('status', params.status);
      if (params.search) query.append('search', params.search.trim());

      const qs = query.toString();
      const res = await request<IAuditLogResponse>(`/audit-logs${qs ? `?${qs}` : ''}`);
      return res.data || { logs: [], total: 0, page: 1, limit: 20, totalPages: 1 };
    } catch {
      return { logs: [], total: 0, page: 1, limit: 20, totalPages: 1 };
    }
  },

  async getAuditStats(): Promise<any> {
    try {
      const res = await request<any>('/audit-logs/stats');
      return res.data;
    } catch {
      return null;
    }
  },

  async getAuditOptions(): Promise<{ modules: string[]; actions: string[] }> {
    try {
      const res = await request<{ modules: string[]; actions: string[] }>('/audit-logs/options');
      return res.data || { modules: [], actions: [] };
    } catch {
      return { modules: [], actions: [] };
    }
  },

  // Roles CRUD
  async getAllRoles(): Promise<IRoleItem[]> {
    try {
      const res = await request<{ roles: IRoleItem[] }>('/settings/roles');
      return res.data?.roles || [];
    } catch {
      return [];
    }
  },

  async createRole(payload: { name: string; code: string; description?: string; permissions?: string[] }): Promise<IRoleItem> {
    const res = await request<IRoleItem>('/settings/roles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateRole(id: string, payload: { name?: string; description?: string }): Promise<IRoleItem> {
    const res = await request<IRoleItem>(`/settings/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteRole(id: string): Promise<void> {
    await request(`/settings/roles/${id}`, { method: 'DELETE' });
  },

  async assignRolePermissions(id: string, permissions: string[]): Promise<any> {
    const res = await request(`/settings/roles/${id}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
    return res.data;
  },
};
