import { request } from './apiClient';
import type { ICategory, ISubCategory } from '../types';

export const PRIMARY_12_CATEGORIES: ICategory[] = [
  { _id: 'cat-cardio', name: 'Cardiology & Blood Pressure', slug: 'cardiology-and-blood-pressure', productCount: 37, isActive: true },
  { _id: 'cat-diabet', name: 'Diabetes & Blood Sugar', slug: 'diabetes-and-blood-sugar', productCount: 27, isActive: true },
  { _id: 'cat-vitamins', name: 'Vitamins, Minerals & Supplements', slug: 'vitamins-minerals-and-supplements', productCount: 15, isActive: true },
  { _id: 'cat-gastro', name: 'Gastroenterology & Digestive Health', slug: 'gastroenterology-and-digestive-health', productCount: 13, isActive: true },
  { _id: 'cat-ortho-pain', name: 'Orthopedics & Pain Management', slug: 'orthopedics-and-pain-management', productCount: 5, isActive: true },
  { _id: 'cat-derma', name: 'Dermatology & Skin Care', slug: 'dermatology-and-skin-care', productCount: 4, isActive: true },
  { _id: 'cat-thyroid', name: 'Endocrinology & Thyroid Care', slug: 'endocrinology-and-thyroid-care', productCount: 4, isActive: true },
  { _id: 'cat-neuro-nerve', name: 'Neurology & Nerve Pain', slug: 'neurology-and-nerve-pain', productCount: 4, isActive: true },
  { _id: 'cat-neuro-brain', name: 'Neurology & Brain Health', slug: 'neurology-and-brain-health', productCount: 3, isActive: true },
  { _id: 'cat-anti-infect', name: 'Anti-infectives', slug: 'anti-infectives', productCount: 3, isActive: true },
  { _id: 'cat-uro', name: 'Urology & Prostate Health', slug: 'urology-and-prostate-health', productCount: 3, isActive: true },
  { _id: 'cat-resp', name: 'Respiratory & ENT Care', slug: 'respiratory-and-ent-care', productCount: 2, isActive: true },
];

export const categoryService = {
  // Categories
  async getCategories(): Promise<ICategory[]> {
    try {
      const res = await request<any>('/categories');
      const list = res.data?.categories || (Array.isArray(res.data) ? res.data : []);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
      return PRIMARY_12_CATEGORIES;
    } catch {
      return PRIMARY_12_CATEGORIES;
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

  async createCategory(payload: {
    name: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
    isFeatured?: boolean;
    isActive?: boolean;
  }): Promise<ICategory> {
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
    await request(`/categories/${id}`, {
      method: 'DELETE',
    });
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

  async createSubCategory(payload: {
    name: string;
    category: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<ISubCategory> {
    const res = await request<ISubCategory>('/subcategories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteSubCategory(id: string): Promise<void> {
    await request(`/subcategories/${id}`, {
      method: 'DELETE',
    });
  },
};
