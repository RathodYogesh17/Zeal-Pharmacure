import { request } from './apiClient';
import type { IJobOpening, ICareerApplication } from '../types';

export interface IJobFilterParams { department?: string; location?: string; search?: string;}
export const fallbackJobs: IJobOpening[] = [];

export const careerService = {
  async getJobs(params: IJobFilterParams = {}): Promise<IJobOpening[]> {
    try {
      const query = new URLSearchParams();
      if (params.department) query.append('department', params.department);
      if (params.location) query.append('location', params.location);
      if (params.search) query.append('search', params.search);

      const qs = query.toString();
      const res = await request<{ jobs: IJobOpening[] }>(`/careers/jobs${qs ? `?${qs}` : ''}`);
      return res.data?.jobs || fallbackJobs;
    } catch {
      let filtered = [...fallbackJobs];
      if (params.department && params.department !== 'ALL') {
        filtered = filtered.filter(j => j.department === params.department);
      }
      if (params.location && params.location !== 'ALL') {
        filtered = filtered.filter(j => j.location.toLowerCase().includes(params.location!.toLowerCase()));
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(j => j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q));
      }
      return filtered;
    }
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

  async adminUpdateApplicationStatus(
    id: string,
    status: string,
    notifyCandidate?: boolean,
    customWhatsAppMessage?: string
  ): Promise<any> {
    const payload: { status: string; notifyCandidate?: boolean; customWhatsAppMessage?: string } = { status };
    if (notifyCandidate !== undefined) payload.notifyCandidate = notifyCandidate;
    if (customWhatsAppMessage) payload.customWhatsAppMessage = customWhatsAppMessage;

    const res = await request(`/careers/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }).catch(async () => {
      return request(`/careers/admin/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    });
    return res.data;
  },

  async adminScheduleInterviewRound(applicationId: string, roundData: {
    roundName: string;
    interviewDate?: string | Date;
    mode?: 'ONLINE' | 'OFFLINE' | 'PHONE';
    meetingLink?: string;
    interviewer?: string;
    status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
    feedback?: string;
    rating?: number;
    notes?: string;
    notifyCandidate?: boolean;
    customWhatsAppMessage?: string;
  }): Promise<any> {
    const res = await request(`/careers/applications/${applicationId}/interview-rounds`, {
      method: 'POST',
      body: JSON.stringify(roundData),
    });
    return res.data;
  },

  async adminAddApplicationNote(applicationId: string, note: string): Promise<any> {
    const res = await request(`/careers/applications/${applicationId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
    return res.data;
  },

  async adminAssignApplication(applicationId: string, assignedTo: string): Promise<any> {
    const res = await request(`/careers/applications/${applicationId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo }),
    });
    return res.data;
  },

  async adminDeleteApplication(applicationId: string): Promise<void> {
    await request(`/careers/applications/${applicationId}`, {
      method: 'DELETE',
    });
  },

  async adminCreateJob(jobData: any): Promise<IJobOpening> {
    const res = await request<IJobOpening>('/careers/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    return res.data;
  },

  async adminUpdateJob(id: string, jobData: any): Promise<IJobOpening> {
    const res = await request<IJobOpening>(`/careers/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
    return res.data;
  },

  async adminDeleteJob(id: string): Promise<void> {
    await request(`/careers/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};
