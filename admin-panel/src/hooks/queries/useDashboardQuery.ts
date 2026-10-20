import { useQuery } from '@tanstack/react-query';
import { dashboardService, type IDashboardStats } from '../../api/dashboardService';

export const DASHBOARD_QUERY_KEY = ['dashboard', 'metrics'];

export const useDashboardMetricsQuery = () => {
  return useQuery<IDashboardStats, Error>({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => dashboardService.getDashboardMetrics(),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh in cache
    gcTime: 1000 * 60 * 30,    // 30 minutes memory persistence
    refetchOnWindowFocus: false,
  });
};
