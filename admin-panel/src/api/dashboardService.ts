import { request } from './apiClient';

export interface IDashboardActivity {
  id: string;
  type: 'ENQUIRY' | 'APPLICATION' | 'PRODUCT' | 'REVIEW';
  title: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  status?: string;
  meta?: string;
}

export interface IDashboardStats {
  totalProducts: number;
  totalEnquiries: number;
  franchiseEnquiries: number;
  openJobs: number;
  totalApplications: number;
  totalGalleryImages: number;
  yearsInBusiness: number;
  globalReach: number;
  happyClients: number;
  enquiryBreakdowns?: {
    byStatus: Array<{ status: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
    byTopStates: Array<{ state: string; count: number }>;
  };
  trends?: {
    enquiriesLast30Days: Array<{ date: string; count: number }>;
    visitorsLast30Days?: Array<{ date: string; count: number }>;
    engagementLast30Days?: Array<{ date: string; visitors: number; inquiries: number; total: number }>;
    totalVisitors?: number;
    totalEnquiries?: number;
  };
  recentActivities: IDashboardActivity[];
  recentEnquiries: any[];
  recentApplications: any[];
}

export const dashboardService = {
  async getDashboardMetrics(): Promise<IDashboardStats> {
    try {
      const res = await request<any>('/dashboard');
      const data = res.data;
      const summary = data?.summary || {};
      const activities = data?.recentActivities || {};

      return {
        totalProducts: Number(summary.totalProducts ?? 0),
        totalEnquiries: Number(summary.totalEnquiries ?? 0),
        franchiseEnquiries: Number(summary.totalFranchiseEnquiries ?? 0),
        openJobs: Number(summary.totalJobOpenings ?? 0),
        totalApplications: Number(summary.totalApplications ?? 0),
        totalGalleryImages: Number(summary.totalGalleryImages ?? 0),
        yearsInBusiness: Number(summary.yearsInBusiness ?? 15),
        globalReach: Number(summary.globalReach ?? 50),
        happyClients: Number(summary.happyClients ?? 1000),
        enquiryBreakdowns: data?.enquiryBreakdowns,
        trends: data?.trends,
        recentActivities: activities.unifiedActivities || [],
        recentEnquiries: activities.recentEnquiries || [],
        recentApplications: activities.recentApplications || [],
      };
    } catch (err) {
      console.warn('Failed to load dashboard metrics from backend:', err);
      return {
        totalProducts: 1,
        totalEnquiries: 0,
        franchiseEnquiries: 0,
        openJobs: 0,
        totalApplications: 0,
        totalGalleryImages: 0,
        yearsInBusiness: 15,
        globalReach: 50,
        happyClients: 1000,
        enquiryBreakdowns: {
          byStatus: [],
          byType: [],
          byTopStates: [],
        },
        trends: {
          enquiriesLast30Days: [],
        },
        recentActivities: [],
        recentEnquiries: [],
        recentApplications: [],
      };
    }
  },
};

