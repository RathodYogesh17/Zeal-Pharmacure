import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService, type IGalleryResponse } from '../../api/galleryService';

export const GALLERY_QUERY_KEY = ['gallery'];

export const useGalleryImagesQuery = (params?: {
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<IGalleryResponse, Error>({
    queryKey: [...GALLERY_QUERY_KEY, params?.tag || 'ALL', params?.search || '', params?.page || 1],
    queryFn: () => galleryService.getImages(params),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });
};

export const useUploadGalleryImagesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ files, tag }: { files: File[]; tag?: string }) =>
      galleryService.uploadImages(files, tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY });
    },
  });
};

export const useDeleteGalleryImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => galleryService.deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEY });
    },
  });
};
