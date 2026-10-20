import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, type IProductFilterParams } from '../../api/productService';
import type { IProductsResponse, ICategory } from '../../types';
import { DASHBOARD_QUERY_KEY } from './useDashboardQuery';

export const PRODUCTS_QUERY_KEY = ['products'];
export const CATEGORIES_QUERY_KEY = ['categories'];

export const useAdminProductsQuery = (params: IProductFilterParams = {}) => {
  return useQuery<IProductsResponse, Error>({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn: () => productService.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    gcTime: 1000 * 60 * 30,    // 30 minutes in memory
    placeholderData: (previousData) => previousData, // Seamless transitions without layout jump
    refetchOnWindowFocus: false,
  });
};

export const useCategoriesQuery = () => {
  return useQuery<ICategory[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => productService.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes fresh
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};

export const useToggleProductStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus?: boolean }) =>
      productService.adminToggleStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
};

export const useDuplicateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.adminDuplicateProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.adminDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
};
