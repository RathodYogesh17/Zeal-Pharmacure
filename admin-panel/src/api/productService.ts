import { request, API_BASE } from './apiClient';
import type { IProduct, IProductsResponse, ICategory } from '../types';

export interface IProductFilterParams {
  category?: string;
  dosageForm?: string;
  search?: string;
  letter?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export const fallbackCategories: ICategory[] = [];
export const fallbackProducts: IProduct[] = [];

export const productService = {
  async getCategories(): Promise<ICategory[]> {
    try {
      const res = await request<{ categories: ICategory[] }>('/categories');
      return res.data?.categories || fallbackCategories;
    } catch {
      return fallbackCategories;
    }
  },

  async getProducts(params: IProductFilterParams = {}): Promise<IProductsResponse> {
    try {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.dosageForm) query.append('dosageForm', params.dosageForm);
      if (params.search) query.append('search', params.search);
      if (params.letter) query.append('letter', params.letter);
      if (params.isFeatured !== undefined) query.append('isFeatured', String(params.isFeatured));
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
      if (params.sort) query.append('sort', params.sort);

      const qs = query.toString();
      const res = await request<IProductsResponse>(`/products/admin/all${qs ? `?${qs}` : ''}`).catch(async () => {
        return request<IProductsResponse>(`/products${qs ? `?${qs}` : ''}`);
      });
      return res.data;
    } catch (err) {
      console.warn('Failed to load products from database:', err);
      return {
        products: [],
        total: 0,
        page: 1,
        limit: params.limit || 20,
        totalPages: 1,
      };
    }
  },

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    try {
      const res = await request<any>(`/products/${slug}`);
      return res.data?.product || res.data || null;
    } catch {
      return null;
    }
  },

  async adminGetProductById(idOrSlug: string): Promise<IProduct | null> {
    return this.getProductBySlug(idOrSlug);
  },

  async adminToggleStatus(id: string, currentStatus?: boolean): Promise<any> {
    const res = await request(`/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !currentStatus }),
    }).catch(async () => {
      return request(`/products/${id}/toggle-status`, {
        method: 'PATCH',
      });
    });
    return res.data;
  },

  getVisualAidUrl(slugOrId: string): string {
    return `${API_BASE}/products/${slugOrId}/visual-aid`;
  },

  async submitReview(slugOrId: string, payload: { doctorName: string; clinicName?: string; qualification?: string; rating: number; reviewText: string }): Promise<any> {
    const res = await request(`/products/${slugOrId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // Admin Reviews Moderation
  async adminGetReviews(params: { page?: number; limit?: number; search?: string; isApproved?: boolean } = {}): Promise<any> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.search) query.append('search', params.search);
    if (params.isApproved !== undefined) query.append('isApproved', String(params.isApproved));
    const qs = query.toString();
    const res = await request<any>(`/products/admin/reviews${qs ? `?${qs}` : ''}`);
    return res.data;
  },

  async adminApproveReview(id: string, isApproved: boolean): Promise<any> {
    const res = await request(`/products/admin/reviews/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    });
    return res.data;
  },

  async adminToggleReviewFeature(id: string, isFeatured: boolean): Promise<any> {
    const res = await request(`/products/admin/reviews/${id}/feature`, {
      method: 'PATCH',
      body: JSON.stringify({ isFeatured }),
    });
    return res.data;
  },

  async adminToggleReviewVerification(id: string, isVerified: boolean): Promise<any> {
    const res = await request(`/products/admin/reviews/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ isVerified }),
    });
    return res.data;
  },

  async adminReplyReview(id: string, adminReply: string): Promise<any> {
    const res = await request(`/products/admin/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ adminReply }),
    });
    return res.data;
  },

  async adminDeleteReview(id: string): Promise<any> {
    const res = await request(`/products/admin/reviews/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  // Admin Operations
  async adminCreateProduct(payload: any): Promise<IProduct> {
    const res = await request<IProduct>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async adminUpdateProduct(id: string, payload: any): Promise<IProduct> {
    const res = await request<IProduct>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async adminDuplicateProduct(id: string): Promise<IProduct> {
    const res = await request<any>(`/products/${id}/duplicate`, {
      method: 'POST',
    });
    return res.data?.product || res.data;
  },

  async adminDeleteProduct(id: string): Promise<void> {
    await request(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
