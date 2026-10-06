import { request } from './apiClient';
import type { IFranchiseEnquiryPayload, IGeneralEnquiryPayload, IEnquiry } from '../types';

export const enquiryService = {
  async submitFranchiseEnquiry(payload: IFranchiseEnquiryPayload): Promise<any> {
    const res = await request('/enquiries/franchise', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async submitProductEnquiry(payload: any): Promise<any> {
    const res = await request('/enquiries/product', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async submitContactEnquiry(payload: IGeneralEnquiryPayload): Promise<any> {
    const res = await request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async adminGetEnquiries(params: { type?: string; enquiryType?: string; status?: string; search?: string; page?: number; limit?: number } = {}): Promise<{ enquiries: IEnquiry[]; total: number }> {
    try {
      const query = new URLSearchParams();
      const typeVal = params.enquiryType || params.type;
      if (typeVal && typeVal !== 'ALL') query.append('enquiryType', typeVal);
      if (params.status && params.status !== 'ALL') query.append('status', params.status);
      if (params.search && params.search.trim()) query.append('search', params.search.trim());
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));

      const qs = query.toString();
      const res = await request<{ enquiries: IEnquiry[]; total: number }>(`/enquiries${qs ? `?${qs}` : ''}`);
      return res.data;
    } catch {
      return { enquiries: [], total: 0 };
    }
  },

  async adminDeleteEnquiry(id: string): Promise<any> {
    const res = await request(`/enquiries/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  async adminUpdateEnquiryStatus(id: string, status: string): Promise<any> {
    const res = await request(`/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.data;
  },
};
