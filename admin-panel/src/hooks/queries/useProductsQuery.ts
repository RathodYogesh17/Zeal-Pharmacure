import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../api/productService';
import type { IProduct, IProductsResponse, ICategory } from '../../types';

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...PRODUCT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
  categories: ['categories'] as const,
};

export const useProductsQuery = (filters: Record<string, any> = {}) => {
  return useQuery<IProductsResponse>({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: () => productService.getProducts(filters),
  });
};

export const useProductDetailQuery = (idOrSlug?: string) => {
  return useQuery<IProduct | null>({
    queryKey: PRODUCT_QUERY_KEYS.detail(idOrSlug || ''),
    queryFn: () => {
      if (!idOrSlug) return Promise.resolve(null);
      return productService.adminGetProductById(idOrSlug);
    },
    enabled: !!idOrSlug,
  });
};

export const useProductCategoriesQuery = () => {
  return useQuery<ICategory[]>({
    queryKey: PRODUCT_QUERY_KEYS.categories,
    queryFn: () => productService.getCategories(),
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<IProduct>) => productService.adminCreateProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
  });
};

export const useToggleProductStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.adminToggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.adminDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
    },
  });
};
