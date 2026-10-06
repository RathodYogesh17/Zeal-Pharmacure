import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../api/categoryService';
import type { ICategory, ISubCategory } from '../../types';

export const CATEGORY_QUERY_KEYS = {
  all: ['categories'] as const,
  subCategories: (catId?: string) => ['subCategories', catId || 'all'] as const,
};

export const useCategoriesQuery = () => {
  return useQuery<ICategory[]>({
    queryKey: CATEGORY_QUERY_KEYS.all,
    queryFn: () => categoryService.getCategories(),
  });
};

export const useSubCategoriesQuery = (categoryId?: string) => {
  return useQuery<ISubCategory[]>({
    queryKey: CATEGORY_QUERY_KEYS.subCategories(categoryId),
    queryFn: () => categoryService.getSubCategories(categoryId),
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; sortOrder?: number; isFeatured?: boolean }) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.all });
    },
  });
};

export const useCreateSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; category: string; description?: string }) =>
      categoryService.createSubCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subCategories'] });
    },
  });
};

export const useDeleteSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteSubCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subCategories'] });
    },
  });
};
