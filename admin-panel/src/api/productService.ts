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
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
}

export const fallbackCategories: ICategory[] = [
  { _id: 'cat-cardio', name: 'Cardiology & Blood Pressure', slug: 'cardiology-and-blood-pressure', productCount: 37, isActive: true },
  { _id: 'cat-diabet', name: 'Diabetes & Blood Sugar', slug: 'diabetes-and-blood-sugar', productCount: 27, isActive: true },
  { _id: 'cat-vitamins', name: 'Vitamins, Minerals & Supplements', slug: 'vitamins-minerals-and-supplements', productCount: 15, isActive: true },
  { _id: 'cat-gastro', name: 'Gastroenterology & Digestive Health', slug: 'gastroenterology-and-digestive-health', productCount: 13, isActive: true },
  { _id: 'cat-ortho-pain', name: 'Orthopedics & Pain Management', slug: 'orthopedics-and-pain-management', productCount: 5, isActive: true },
  { _id: 'cat-derma', name: 'Dermatology & Skin Care', slug: 'dermatology-and-skin-care', productCount: 4, isActive: true },
  { _id: 'cat-thyroid', name: 'Endocrinology & Thyroid Care', slug: 'endocrinology-and-thyroid-care', productCount: 4, isActive: true },
  { _id: 'cat-neuro-nerve', name: 'Neurology & Nerve Pain', slug: 'neurology-and-nerve-pain', productCount: 4, isActive: true },
  { _id: 'cat-anti-infect', name: 'Anti-infectives', slug: 'anti-infectives', productCount: 3, isActive: true },
  { _id: 'cat-neuro-brain', name: 'Neurology & Brain Health', slug: 'neurology-and-brain-health', productCount: 3, isActive: true },
  { _id: 'cat-uro', name: 'Urology & Prostate Health', slug: 'urology-and-prostate-health', productCount: 3, isActive: true },
  { _id: 'cat-allergy', name: 'Allergy & Sinus Care', slug: 'allergy-and-sinus-care', productCount: 2, isActive: true },
  { _id: 'cat-ortho-joint', name: 'Orthopedics & Joint Care', slug: 'orthopedics-and-joint-care', productCount: 2, isActive: true },
  { _id: 'cat-resp', name: 'Respiratory & ENT Care', slug: 'respiratory-and-ent-care', productCount: 2, isActive: true },
  { _id: 'cat-rheuma', name: 'Rheumatology & Immunology', slug: 'rheumatology-and-immunology', productCount: 2, isActive: true },
  { _id: 'cat-derma-ano', name: 'Dermatology & Anorectal Care', slug: 'dermatology-and-anorectal-care', productCount: 1, isActive: true },
  { _id: 'cat-gut', name: 'Digestive & Gut Health', slug: 'digestive-and-gut-health', productCount: 1, isActive: true },
  { _id: 'cat-gout', name: 'Gout & Uric Acid Management', slug: 'gout-and-uric-acid-management', productCount: 1, isActive: true },
  { _id: 'cat-mental', name: 'Mental Health', slug: 'mental-health', productCount: 1, isActive: true },
];
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
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);
      if (params.startDate) query.append('startDate', params.startDate);
      if (params.endDate) query.append('endDate', params.endDate);

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
