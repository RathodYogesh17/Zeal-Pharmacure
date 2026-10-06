import { request } from './apiClient';
import type { IFranchiseEnquiryPayload, IGeneralEnquiryPayload, IEnquiry } from '../types';

export interface IEnquiriesQueryParams {
  category?: 'all' | 'franchise' | 'product' | string;
  enquiryType?: string;
  type?: string;
  status?: string;
  search?: string;
  city?: string;
  state?: string;
  district?: string;
  page?: number;
  limit?: number;
}

export interface IEnquiriesListResponse {
  enquiries: IEnquiry[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  productTotal?: number;
  franchiseTotal?: number;
}

export const enquiryService = {
  async submitFranchiseEnquiry(payload: IFranchiseEnquiryPayload): Promise<any> {
    const res = await request('/enquiries/franchise', {
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

  async adminGetEnquiries(params: IEnquiriesQueryParams = {}): Promise<IEnquiriesListResponse> {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') {
        query.append('category', params.category);
      }
      const typeVal = params.enquiryType || params.type;
      if (typeVal && typeVal !== 'ALL') {
        query.append('enquiryType', typeVal);
      }
      if (params.status && params.status !== 'ALL') {
        query.append('status', params.status);
      }
      if (params.search && params.search.trim()) {
        query.append('search', params.search.trim());
      }
      if (params.city && params.city.trim()) {
        query.append('city', params.city.trim());
      }
      if (params.state && params.state.trim()) {
        query.append('state', params.state.trim());
      }
      if (params.district && params.district.trim()) {
        query.append('district', params.district.trim());
      }
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));

      const qs = query.toString();
      const res = await request<IEnquiriesListResponse>(`/enquiries${qs ? `?${qs}` : ''}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching admin enquiries:', err);
      return { enquiries: [], total: 0 };
    }
  },

  async adminGetEnquiryById(id: string): Promise<IEnquiry> {
    const res = await request<IEnquiry>(`/enquiries/${id}`);
    return res.data;
  },

  async adminUpdateEnquiryStatus(
    id: string,
    status: string,
    note?: string,
    nextFollowUpAt?: string | null,
    notifyClient?: boolean,
    customWhatsAppMessage?: string
  ): Promise<IEnquiry> {
    const payload: {
      status: string;
      note?: string;
      nextFollowUpAt?: string | null;
      notifyClient?: boolean;
      customWhatsAppMessage?: string;
    } = { status };
    if (note && note.trim()) payload.note = note.trim();
    if (nextFollowUpAt) payload.nextFollowUpAt = nextFollowUpAt;
    if (notifyClient !== undefined) payload.notifyClient = notifyClient;
    if (customWhatsAppMessage) payload.customWhatsAppMessage = customWhatsAppMessage;

    const res = await request<IEnquiry>(`/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async adminAddEnquiryNote(id: string, note: string): Promise<IEnquiry> {
    const res = await request<IEnquiry>(`/enquiries/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note: note.trim() }),
    });
    return res.data;
  },

  async adminAssignEnquiry(id: string, assignedTo: string, note?: string): Promise<IEnquiry> {
    const payload: { assignedTo: string; note?: string } = { assignedTo };
    if (note && note.trim()) payload.note = note.trim();

    const res = await request<IEnquiry>(`/enquiries/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async adminValidateDrugLicense(drugLicenseNumber: string, state?: string): Promise<{ isValid: boolean; normalized?: string; error?: string }> {
    const res = await request<{ isValid: boolean; normalized?: string; error?: string }>(
      '/enquiries/validate-dl',
      {
        method: 'POST',
        body: JSON.stringify({ drugLicenseNumber, state }),
      }
    );
    return res.data;
  },

  async adminDeleteEnquiry(id: string): Promise<any> {
    const res = await request(`/enquiries/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },
};
