import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../../api/contentService';
import type { ICmsItem } from '../../types';

export const CMS_QUERY_KEYS = {
  all: ['cms'] as const,
  key: (key: string) => ['cms', key] as const,
};

export const useAllCmsContentQuery = () => {
  return useQuery<ICmsItem[]>({
    queryKey: CMS_QUERY_KEYS.all,
    queryFn: () => contentService.getAllContentAdmin(),
  });
};

export const useCmsContentByKeyQuery = <T = any>(key: string) => {
  return useQuery<T | null>({
    queryKey: CMS_QUERY_KEYS.key(key),
    queryFn: () => contentService.getContentByKey<T>(key),
    enabled: !!key,
  });
};

export const useUpdateCmsContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: { title?: string; content: any; isActive?: boolean } }) =>
      contentService.updateContent(key, payload),
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.key(key) });
      queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEYS.all });
    },
  });
};
