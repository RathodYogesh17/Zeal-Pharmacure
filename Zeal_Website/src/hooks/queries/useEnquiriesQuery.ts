import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enquiryService } from '../../api/enquiryService';
import type { IEnquiry, IFranchiseEnquiryPayload } from '../../types';

export const ENQUIRY_QUERY_KEYS = {
  all: ['enquiries'] as const,
  list: (filters: Record<string, any>) => [...ENQUIRY_QUERY_KEYS.all, filters] as const,
};

export const useEnquiriesQuery = (filters: { type?: string; enquiryType?: string; status?: string; search?: string; page?: number; limit?: number } = {}) => {
  return useQuery<{ enquiries: IEnquiry[]; total: number }>({
    queryKey: ENQUIRY_QUERY_KEYS.list(filters),
    queryFn: () => enquiryService.adminGetEnquiries(filters),
  });
};

export const useUpdateEnquiryStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      enquiryService.adminUpdateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENQUIRY_QUERY_KEYS.all });
    },
  });
};

export const useDeleteEnquiryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => enquiryService.adminDeleteEnquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENQUIRY_QUERY_KEYS.all });
    },
  });
};

export const useSubmitFranchiseEnquiryMutation = () => {
  return useMutation({
    mutationFn: (payload: IFranchiseEnquiryPayload) =>
      enquiryService.submitFranchiseEnquiry(payload),
  });
};
