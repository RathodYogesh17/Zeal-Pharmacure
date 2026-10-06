import { request } from './apiClient';
import type { ICategory, ISubCategory } from '../types';

export const categoryService = {
  // Categories
  async getCategories(): Promise<ICategory[]> {
    try {
      const res = await request<{ categories: ICategory[] }>('/categories');
      return res.data?.categories || [];
    } catch {
      return [];
    }
  },

  async getAdminCategories(): Promise<ICategory[]> {
    try {
      const res = await request<{ categories: ICategory[] }>('/categories/admin/all');
      return res.data?.categories || [];
    } catch {
      return this.getCategories();
    }
  },

  async createCategory(payload: Partial<ICategory>): Promise<ICategory> {
    const res = await request<ICategory>('/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateCategory(id: string, payload: Partial<ICategory>): Promise<ICategory> {
    const res = await request<ICategory>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await request(`/categories/${id}`, { method: 'DELETE' });
  },

  // SubCategories
  async getSubCategories(categoryId?: string): Promise<ISubCategory[]> {
    try {
      const query = categoryId ? `?category=${categoryId}` : '';
      const res = await request<{ subCategories: ISubCategory[] }>(`/subcategories${query}`);
      return res.data?.subCategories || [];
    } catch {
      return [];
    }
  },

  async getAdminSubCategories(categoryId?: string): Promise<ISubCategory[]> {
    try {
      const query = categoryId ? `?category=${categoryId}` : '';
      const res = await request<{ subCategories: ISubCategory[] }>(`/subcategories/admin/all${query}`);
      return res.data?.subCategories || [];
    } catch {
      return this.getSubCategories(categoryId);
    }
  },

  async createSubCategory(payload: Partial<ISubCategory>): Promise<ISubCategory> {
    const res = await request<ISubCategory>('/subcategories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateSubCategory(id: string, payload: Partial<ISubCategory>): Promise<ISubCategory> {
    const res = await request<ISubCategory>(`/subcategories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteSubCategory(id: string): Promise<void> {
    await request(`/subcategories/${id}`, { method: 'DELETE' });
  },
};
