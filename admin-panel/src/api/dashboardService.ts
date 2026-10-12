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
  activeProducts: number;
  inactiveProducts: number;
  totalCategories: number;
  totalDivisions: number;
  totalIndications: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  contactedEnquiries: number;
  documentsPendingEnquiries: number;
  quotedEnquiries: number;
  approvedEnquiries: number;
  closedEnquiries: number;
  franchiseEnquiries: number;
  openJobs: number;
  totalApplications: number;
  newApplications: number;
  shortlistedApplications: number;
  totalGalleryImages: number;
  yearsInBusiness: number;
  globalReach: number;
  happyClients: number;
  enquiryBreakdowns?: {
    byStatus: Array<{ status: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
    byTopStates: Array<{ state: string; count: number }>;
  };
  productBreakdowns?: {
    byDosageForm: Array<{ dosageForm: string; count: number }>;
    byCategory: Array<{ category: string; count: number }>;
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
        activeProducts: Number(summary.activeProducts ?? 0),
        inactiveProducts: Number(summary.inactiveProducts ?? 0),
        totalCategories: Number(summary.totalCategories ?? 0),
        totalDivisions: Number(summary.totalDivisions ?? 0),
        totalIndications: Number(summary.totalIndications ?? 0),
        totalEnquiries: Number(summary.totalEnquiries ?? 0),
        pendingEnquiries: Number(summary.pendingEnquiries ?? 0),
        contactedEnquiries: Number(summary.contactedEnquiries ?? 0),
        documentsPendingEnquiries: Number(summary.documentsPendingEnquiries ?? 0),
        quotedEnquiries: Number(summary.quotedEnquiries ?? 0),
        approvedEnquiries: Number(summary.approvedEnquiries ?? 0),
        closedEnquiries: Number(summary.closedEnquiries ?? 0),
        franchiseEnquiries: Number(summary.totalFranchiseEnquiries ?? 0),
        openJobs: Number(summary.totalJobOpenings ?? 0),
        totalApplications: Number(summary.totalApplications ?? 0),
        newApplications: Number(summary.newApplications ?? 0),
        shortlistedApplications: Number(summary.shortlistedApplications ?? 0),
        totalGalleryImages: Number(summary.totalGalleryImages ?? 0),
        yearsInBusiness: Number(summary.yearsInBusiness ?? 15),
        globalReach: Number(summary.globalReach ?? 50),
        happyClients: Number(summary.happyClients ?? 1000),
        enquiryBreakdowns: data?.enquiryBreakdowns,
        productBreakdowns: data?.productBreakdowns,
        trends: data?.trends,
        recentActivities: activities.unifiedActivities || [],
        recentEnquiries: activities.recentEnquiries || [],
        recentApplications: activities.recentApplications || [],
      };
    } catch (err) {
      console.warn('Failed to load dashboard metrics from backend:', err);
      return {
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        totalCategories: 0,
        totalDivisions: 0,
        totalIndications: 0,
        totalEnquiries: 0,
        pendingEnquiries: 0,
        contactedEnquiries: 0,
        documentsPendingEnquiries: 0,
        quotedEnquiries: 0,
        approvedEnquiries: 0,
        closedEnquiries: 0,
        franchiseEnquiries: 0,
        openJobs: 0,
        totalApplications: 0,
        newApplications: 0,
        shortlistedApplications: 0,
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

