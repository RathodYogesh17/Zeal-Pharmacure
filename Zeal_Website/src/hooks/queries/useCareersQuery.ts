import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { careerService } from '../../api/careerService';
import type { IJobFilterParams } from '../../api/careerService';
import type { IJobOpening, ICareerApplication } from '../../types';

export const CAREER_QUERY_KEYS = {
  jobs: (params?: IJobFilterParams) => ['jobs', params || {}] as const,
  applications: ['careerApplications'] as const,
};

export const useJobOpeningsQuery = (params?: IJobFilterParams) => {
  return useQuery<IJobOpening[]>({
    queryKey: CAREER_QUERY_KEYS.jobs(params),
    queryFn: () => careerService.getJobs(params),
  });
};

export const useCareerApplicationsQuery = () => {
  return useQuery<ICareerApplication[]>({
    queryKey: CAREER_QUERY_KEYS.applications,
    queryFn: () => careerService.adminGetApplications(),
  });
};

export const useCreateJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobData: any) => careerService.adminCreateJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => careerService.adminDeleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useUpdateApplicationStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      careerService.adminUpdateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAREER_QUERY_KEYS.applications });
    },
  });
};

export const useApplyForJobMutation = () => {
  return useMutation({
    mutationFn: (formData: FormData) => careerService.applyForJob(formData),
  });
};
