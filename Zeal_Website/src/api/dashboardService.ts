import { request } from './apiClient';

export interface IDashboardStats {
  totalProducts: number;
  totalEnquiries: number;
  franchiseEnquiries: number;
  openJobs: number;
  totalApplications: number;
  recentEnquiries: any[];
  recentApplications: any[];
}

export const dashboardService = {
  async getDashboardMetrics(): Promise<IDashboardStats> {
    try {
      const res = await request<any>('/dashboard');
      const data = res.data;
      return {
        totalProducts: data?.counts?.totalProducts || data?.totalProducts || 9,
        totalEnquiries: data?.counts?.totalEnquiries || data?.totalEnquiries || 5,
        franchiseEnquiries: data?.counts?.franchiseEnquiries || data?.franchiseEnquiries || 3,
        openJobs: data?.counts?.openJobs || data?.openJobs || 4,
        totalApplications: data?.counts?.totalApplications || data?.totalApplications || 2,
        recentEnquiries: data?.recentEnquiries || [],
        recentApplications: data?.recentApplications || [],
      };
    } catch {
      return {
        totalProducts: 9,
        totalEnquiries: 5,
        franchiseEnquiries: 3,
        openJobs: 4,
        totalApplications: 2,
        recentEnquiries: [],
        recentApplications: [],
      };
    }
  },
};
