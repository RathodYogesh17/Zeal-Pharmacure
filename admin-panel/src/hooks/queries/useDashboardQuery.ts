import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../api/dashboardService';
import type { IDashboardStats } from '../../api/dashboardService';

export const useDashboardMetricsQuery = () => {
  return useQuery<IDashboardStats>({
    queryKey: ['dashboardMetrics'],
    queryFn: () => dashboardService.getDashboardMetrics(),
    refetchInterval: 1000 * 60 * 2, // Auto refresh every 2 mins
  });
};
