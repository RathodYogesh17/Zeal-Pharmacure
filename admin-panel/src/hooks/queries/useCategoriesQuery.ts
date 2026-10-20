import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../api/categoryService';
import { userService } from '../../api/userService';
import type { ICategory, ISubCategory } from '../../types';
import { PRODUCTS_QUERY_KEY } from './useProductsQuery';
import { DASHBOARD_QUERY_KEY } from './useDashboardQuery';

export const ADMIN_CATEGORIES_QUERY_KEY = ['admin_categories'];
export const ADMIN_SUBCATEGORIES_QUERY_KEY = ['admin_subcategories'];
export const ADMIN_USERS_MAP_KEY = ['admin_users_map'];

export const useAdminCategoriesQuery = () => {
  return useQuery<{
    categories: ICategory[];
    subCategories: ISubCategory[];
    usersMap: Record<string, string>;
  }, Error>({
    queryKey: ADMIN_CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const [cats, subs, usersRes] = await Promise.all([
        categoryService.getAdminCategories(),
        categoryService.getAdminSubCategories(),
        userService.getAllUsers({ limit: 100 }).catch(() => ({ users: [], total: 0 })),
      ]);

      const usersMap: Record<string, string> = {};
      if (usersRes?.users?.length) {
        usersRes.users.forEach((u: any) => {
          if (u._id) {
            usersMap[u._id] = u.name || u.fullName || u.email || 'Admin';
          }
        });
      }

      return {
        categories: cats || [],
        subCategories: subs || [],
        usersMap,
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes fresh
    gcTime: 1000 * 60 * 60,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
  };

  const createCategoryMutation = useMutation({
    mutationFn: (payload: Partial<ICategory>) => categoryService.createCategory(payload),
    onSuccess: invalidateAll,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ICategory> }) =>
      categoryService.updateCategory(id, payload),
    onSuccess: invalidateAll,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: invalidateAll,
  });

  const createSubCategoryMutation = useMutation({
    mutationFn: (payload: Partial<ISubCategory>) => categoryService.createSubCategory(payload),
    onSuccess: invalidateAll,
  });

  const updateSubCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ISubCategory> }) =>
      categoryService.updateSubCategory(id, payload),
    onSuccess: invalidateAll,
  });

  const deleteSubCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteSubCategory(id),
    onSuccess: invalidateAll,
  });

  return {
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
    createSubCategoryMutation,
    updateSubCategoryMutation,
    deleteSubCategoryMutation,
    invalidateAll,
  };
};
