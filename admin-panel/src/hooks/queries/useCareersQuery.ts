import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { careerService } from '../../api/careerService';
import { productService } from '../../api/productService';
import type { IJobOpening, ICareerApplication } from '../../types';
import { DASHBOARD_QUERY_KEY } from './useDashboardQuery';

export const CAREERS_QUERY_KEY = ['careers_data'];

export const useCareersDataQuery = () => {
  return useQuery<{
    jobs: IJobOpening[];
    applications: ICareerApplication[];
    reviews: any[];
  }, Error>({
    queryKey: CAREERS_QUERY_KEY,
    queryFn: async () => {
      const [jobsData, appsData, reviewsData] = await Promise.all([
        careerService.getJobs(),
        careerService.adminGetApplications(),
        productService.adminGetReviews({ limit: 50 }).catch(() => ({ reviews: [] })),
      ]);
      return {
        jobs: jobsData || [],
        applications: appsData || [],
        reviews: reviewsData?.reviews || [],
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    gcTime: 1000 * 60 * 30,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export const useCareerMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: CAREERS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
  };

  const updateApplicationStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notifyCandidate,
      customWhatsAppMessage,
    }: {
      id: string;
      status: string;
      notifyCandidate?: boolean;
      customWhatsAppMessage?: string;
    }) =>
      careerService.adminUpdateApplicationStatus(id, status, notifyCandidate, customWhatsAppMessage),
    onSuccess: invalidate,
  });

  return {
    updateApplicationStatusMutation,
    invalidate,
  };
};
