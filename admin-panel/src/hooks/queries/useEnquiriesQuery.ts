import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enquiryService } from '../../api/enquiryService';
import { careerService } from '../../api/careerService';
import type { IEnquiry, EnquiryStatus } from '../../types';
import { DASHBOARD_QUERY_KEY } from './useDashboardQuery';

export const ENQUIRIES_QUERY_KEY = ['enquiries'];

export const useAdminEnquiriesQuery = (pageMode: string = 'all') => {
  return useQuery<IEnquiry[], Error>({
    queryKey: [...ENQUIRIES_QUERY_KEY, pageMode],
    queryFn: async () => {
      const categoryParam =
        pageMode === 'franchise'
          ? 'franchise'
          : pageMode === 'product'
            ? 'product'
            : undefined;

      const shouldLoadCareers = pageMode === 'all' || pageMode === 'career';

      const [res, careerApps] = await Promise.all([
        enquiryService.adminGetEnquiries({
          limit: 300,
          category: categoryParam,
        }),
        shouldLoadCareers
          ? careerService.adminGetApplications().catch(() => [])
          : Promise.resolve([]),
      ]);

      const standardEnquiries = res?.enquiries || [];
      const mappedCareers: IEnquiry[] = (careerApps || []).map((app: any) => ({
        _id: app._id,
        enquiryType: 'CAREER',
        enquiryCategory: 'CAREER',
        name: app.fullName,
        fullName: app.fullName,
        email: app.email,
        phone: app.phone,
        whatsappNumber: app.whatsappNumber || app.phone,
        city: app.currentCity,
        state: app.currentState,
        preferredTerritory: app.preferredLocation,
        positionAppliedFor: app.positionAppliedFor || app.jobTitle || 'Candidate',
        department: app.department || 'Operations',
        qualification: app.qualification,
        totalExperienceYears: app.totalExperienceYears,
        currentCompany: app.currentCompany,
        currentDesignation: app.currentDesignation,
        currentCtc: app.currentCtc,
        expectedCtc: app.expectedCtc,
        noticePeriod: app.noticePeriod,
        resumeUrl: app.resumeUrl,
        coverLetter: app.coverLetter || app.coverNote,
        skills: app.skills,
        interviewRounds: app.interviewRounds,
        internalNotes: app.internalNotes,
        status: (app.status || 'NEW') as EnquiryStatus,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        message: app.coverLetter || `Applied for position: ${app.positionAppliedFor || 'Candidate'}`,
      }));

      return [...standardEnquiries, ...mappedCareers].sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    },
    staleTime: 1000 * 60 * 3, // 3 minutes fresh in cache
    gcTime: 1000 * 60 * 30,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateEnquiryStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
      nextFollowUpAt,
      isCareer,
    }: {
      id: string;
      status: string;
      note?: string;
      nextFollowUpAt?: string | null;
      isCareer?: boolean;
    }) => {
      if (isCareer) {
        return careerService.adminUpdateApplicationStatus(id, status);
      }
      return enquiryService.adminUpdateEnquiryStatus(id, status, note, nextFollowUpAt);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENQUIRIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
};
