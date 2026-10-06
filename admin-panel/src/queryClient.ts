import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes fresh cache (instant zero-loading navigation)
      gcTime: 1000 * 60 * 60,    // 1 hour garbage collection
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
