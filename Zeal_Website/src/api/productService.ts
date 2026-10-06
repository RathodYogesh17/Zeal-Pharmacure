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
  startDate?: string;
  endDate?: string;
}

export const fallbackCategories: ICategory[] = [
  { _id: 'cat-1', name: 'Tablets', slug: 'tablets', description: 'Oral solid formulations', isFeatured: true, productCount: 45 },
  { _id: 'cat-2', name: 'Capsules', slug: 'capsules', description: 'Hard & soft gelatin capsules', isFeatured: true, productCount: 32 },
  { _id: 'cat-3', name: 'Syrups & Suspensions', slug: 'syrups-suspensions', description: 'Liquid oral formulations', isFeatured: true, productCount: 28 },
  { _id: 'cat-4', name: 'Injectables', slug: 'injectables', description: 'Sterile IV & IM injectables', isFeatured: true, productCount: 19 },
  { _id: 'cat-5', name: 'Ointments & Creams', slug: 'ointments-creams', description: 'Dermatological and pain relief topicals', isFeatured: true, productCount: 15 },
  { _id: 'cat-6', name: 'Ayurvedic & Herbal', slug: 'ayurvedic-herbal', description: 'Natural wellness extracts', isFeatured: true, productCount: 24 },
  { _id: 'cat-7', name: 'Pediatric Care', slug: 'pediatric-care', description: 'Gentle pediatric drops & syrups', isFeatured: false, productCount: 12 },
  { _id: 'cat-8', name: 'Derma Care', slug: 'derma-care', description: 'Specialty skin treatments', isFeatured: false, productCount: 14 },
  { _id: 'cat-9', name: 'Cardiac & Diabetic', slug: 'cardiac-diabetic', description: 'Chronic care formulations', isFeatured: false, productCount: 21 },
  { _id: 'cat-10', name: 'Ortho Care', slug: 'ortho-care', description: 'Joint mobility & pain relief', isFeatured: false, productCount: 18 },
];

export const fallbackProducts: IProduct[] = [
  {
    _id: 'prod-1',
    name: 'ZEAL-ORTHO OIL',
    slug: 'zeal-ortho-oil',
    genericName: 'Ayurvedic Pain Relief Oil with Gandhapura, Mahanarayan & Nilgiri Oil',
    composition: 'Each 100ml contains: Gandhapura Tel 20%, Mahanarayan Tel 30%, Nilgiri Tel 10%, Kapur 5%, Pudina Satva 5%',
    dosageForm: 'Oil',
    packaging: '100ml Bottle with Carton',
    category: 'Ayurvedic & Herbal',
    indicationTags: ['Joint Pain', 'Rheumatoid Arthritis', 'Knee Pain', 'Back Pain', 'Morning Stiffness'],
    prescriptionType: 'General',
    averageRating: 5,
    totalReviews: 2,
    isFeatured: true,
    isNewLaunch: true,
    isActive: true,
  },
  {
    _id: 'prod-2',
    name: 'ZEAL-LIV DS SYRUP',
    slug: 'zeal-liv-ds-syrup',
    genericName: 'Double Strength Ayurvedic Liver Corrective Tonic',
    composition: 'Each 10ml contains herbal extracts: Bhringraj 400mg, Kalmegh 200mg, Punarnava 300mg, Kasni 250mg, Giloy 150mg',
    dosageForm: 'Syrup',
    packaging: '200ml Amber PET Bottle with Carton',
    category: 'Ayurvedic & Herbal',
    indicationTags: ['Fatty Liver', 'Indigestion', 'Loss of Appetite', 'Sluggish Liver', 'Liver Care'],
    prescriptionType: 'General',
    averageRating: 4.8,
    totalReviews: 12,
    isFeatured: true,
    isNewLaunch: true,
    isActive: true,
  },
  {
    _id: 'prod-3',
    name: 'ZEAL-CEF 1GM',
    slug: 'zeal-cef-1gm',
    genericName: 'Ceftriaxone Injection IP 1000mg',
    composition: 'Sterile Ceftriaxone Sodium IP equivalent to anhydrous Ceftriaxone 1000mg with Sterile Water for Injection IP 10ml',
    dosageForm: 'Injection',
    packaging: '10ml Vial with WFI in Mono Carton',
    category: 'Injectables',
    indicationTags: ['Severe Bacterial Infections', 'Septicemia', 'Surgical Prophylaxis', 'Meningitis'],
    prescriptionType: 'Schedule H1',
    averageRating: 4.9,
    totalReviews: 8,
    isFeatured: true,
    isNewLaunch: false,
    isActive: true,
  },
  {
    _id: 'prod-4',
    name: 'CAL-ZEAL 500 TABLETS',
    slug: 'cal-zeal-500-tablets',
    genericName: 'Calcium Carbonate with Vitamin D3 Tablets IP',
    composition: 'Calcium Carbonate IP 1250mg (eq. to elemental Calcium 500mg) + Vitamin D3 250 IU',
    dosageForm: 'Tablets',
    packaging: '10 x 15 Blister Pack',
    category: 'Tablets',
    indicationTags: ['Osteoporosis', 'Calcium Deficiency', 'Pregnancy & Lactation', 'Bone Health'],
    prescriptionType: 'General',
    averageRating: 4.7,
    totalReviews: 15,
    isFeatured: true,
    isNewLaunch: false,
    isActive: true,
  },
  {
    _id: 'prod-5',
    name: 'ZEAL-PAN 40 DSR CAPSULES',
    slug: 'zeal-pan-40-dsr-capsules',
    genericName: 'Pantoprazole Gastro-resistant & Domperidone Prolonged-release Capsules IP',
    composition: 'Pantoprazole Sodium IP eq. to Pantoprazole 40mg + Domperidone IP 30mg (SR)',
    dosageForm: 'Capsules',
    packaging: '10 x 10 Alu-Alu Pack',
    category: 'Capsules',
    indicationTags: ['GERD', 'Acidity', 'Heartburn', 'Dyspepsia', 'Nausea'],
    prescriptionType: 'Schedule H',
    averageRating: 4.9,
    totalReviews: 24,
    isFeatured: true,
    isNewLaunch: false,
    isActive: true,
  },
  {
    _id: 'prod-6',
    name: 'ZEAL-CLAV 625 TABLETS',
    slug: 'zeal-clav-625-tablets',
    genericName: 'Amoxycillin and Potassium Clavulanate Tablets IP',
    composition: 'Amoxicillin Trihydrate IP eq. to Amoxicillin 500mg + Potassium Clavulanate Diluted IP eq. to Clavulanic Acid 125mg',
    dosageForm: 'Tablets',
    packaging: '10 x 1 x 10 Alu-Alu Strip',
    category: 'Tablets',
    indicationTags: ['Respiratory Tract Infections', 'ENT Infections', 'Skin Infections', 'Dental Infections'],
    prescriptionType: 'Schedule H1',
    averageRating: 5.0,
    totalReviews: 31,
    isFeatured: true,
    isNewLaunch: true,
    isActive: true,
  },
];

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
      if (params.startDate) query.append('startDate', params.startDate);
      if (params.endDate) query.append('endDate', params.endDate);

      const qs = query.toString();
      const res = await request<any>(`/products${qs ? `?${qs}` : ''}`);
      const anyRes = res as any;
      return (anyRes?.data?.products ? anyRes.data : (anyRes?.products ? anyRes : anyRes?.data)) as IProductsResponse;
    } catch {
      // Filter fallback
      let filtered = [...fallbackProducts];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.genericName.toLowerCase().includes(q) || p.composition.toLowerCase().includes(q));
      }
      if (params.dosageForm) {
        filtered = filtered.filter(p => p.dosageForm.toLowerCase() === params.dosageForm?.toLowerCase());
      }
      if (params.letter && params.letter !== 'ALL') {
        filtered = filtered.filter(p => p.name.toUpperCase().startsWith(params.letter!));
      }
      if (params.isFeatured) {
        filtered = filtered.filter(p => p.isFeatured);
      }
      return {
        products: filtered,
        total: filtered.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
    }
  },

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    try {
      const res = await request<any>(`/products/${slug}`);
      const prod = res?.data?.product ?? res?.data ?? res;
      if (prod && (prod._id || prod.name)) {
        return prod as IProduct;
      }
      return fallbackProducts.find(p => p.slug?.toLowerCase() === slug.toLowerCase() || p._id === slug) || null;
    } catch {
      return fallbackProducts.find(p => p.slug?.toLowerCase() === slug.toLowerCase() || p._id === slug) || null;
    }
  },

  async adminGetProductById(idOrSlug: string): Promise<IProduct | null> {
    return this.getProductBySlug(idOrSlug);
  },

  async adminToggleStatus(id: string): Promise<any> {
    const res = await request(`/products/${id}/toggle-status`, {
      method: 'PATCH',
    });
    return res.data;
  },

  async getRelatedProducts(slugOrId: string, limit: number = 5): Promise<IProduct[]> {
    try {
      const res = await request<any>(`/products/related/${slugOrId}?limit=${limit}`);
      if (Array.isArray(res.data)) return res.data;
      if (res.data && Array.isArray(res.data.data)) return res.data.data;
      return [];
    } catch {
      return [];
    }
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

  async adminDeleteProduct(id: string): Promise<void> {
    await request(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
