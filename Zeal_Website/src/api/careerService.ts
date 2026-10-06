import { request } from './apiClient';
import type { IJobOpening, ICareerApplication } from '../types';

export interface IJobFilterParams {
  department?: string;
  location?: string;
  search?: string;
}

export const fallbackJobs: IJobOpening[] = [];

export const careerService = {
  async getJobs(params: IJobFilterParams = {}): Promise<IJobOpening[]> {
    try {
      const query = new URLSearchParams();
      if (params.department && params.department !== 'ALL') query.append('department', params.department);
      if (params.location && params.location !== 'ALL') query.append('location', params.location);
      if (params.search) query.append('search', params.search);

      const qs = query.toString();
      const res = await request<{ jobs: IJobOpening[] }>(`/careers/jobs${qs ? `?${qs}` : ''}`);
      if (res.data?.jobs && Array.isArray(res.data.jobs)) {
        return res.data.jobs;
      }
      return [];
    } catch {
      return [];
    }
  },

  async getJobBySlug(slugOrId: string): Promise<IJobOpening> {
    const res = await request<IJobOpening>(`/careers/jobs/${slugOrId}`);
    return res.data;
  },

  async applyForJob(formData: FormData): Promise<{ applicationId: string; message: string }> {
    const res = await request<{ applicationId: string; message: string }>('/careers/apply', {
      method: 'POST',
      body: formData,
    });
    return res.data;
  },

  // Admin APIs
  async adminGetApplications(): Promise<ICareerApplication[]> {
    try {
      const res = await request<{ applications: ICareerApplication[] }>('/careers/applications').catch(async () => {
        return request<{ applications: ICareerApplication[] }>('/careers/admin/applications');
      });
      return res.data?.applications || [];
    } catch {
      return [];
    }
  },

  async adminUpdateApplicationStatus(id: string, status: string): Promise<any> {
    const res = await request(`/careers/admin/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  async adminCreateJob(jobData: any): Promise<IJobOpening> {
    const res = await request<IJobOpening>('/careers/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    return res.data;
  },

  async adminUpdateJob(id: string, jobData: any): Promise<IJobOpening> {
    const res = await request<IJobOpening>(`/careers/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
    return res.data;
  },

  async adminDeleteJob(id: string): Promise<void> {
    await request(`/careers/admin/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};
