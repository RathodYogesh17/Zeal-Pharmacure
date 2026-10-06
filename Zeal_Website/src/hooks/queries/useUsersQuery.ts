import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../api/userService';
import type { IStaffUser } from '../../api/userService';
import { useAppDispatch } from '../../store';
import { updateUserPermissions as setReduxUserPermissions } from '../../store/slices/authSlice';

export const USER_QUERY_KEYS = {
  all: ['staffUsers'] as const,
  list: (role?: string) => [...USER_QUERY_KEYS.all, role || 'all'] as const,
  userPermissions: (userId: string) => ['userPermissions', userId] as const,
};

export const useStaffUsersQuery = (role?: string) => {
  return useQuery<{ users: IStaffUser[]; total: number }>({
    queryKey: USER_QUERY_KEYS.list(role),
    queryFn: () => userService.getAllUsers({ role }),
  });
};

export const useUserPermissionsQuery = (userId?: string) => {
  return useQuery<{ permissions: string[]; effectivePermissions?: string[] }>({
    queryKey: USER_QUERY_KEYS.userPermissions(userId || ''),
    queryFn: () => {
      if (!userId) return Promise.resolve({ permissions: [] });
      return userService.getUserPermissions(userId);
    },
    enabled: !!userId,
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      name: string;
      email: string;
      phone: string;
      password: string;
      role: string;
      isActive?: boolean;
    }) => userService.createStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
};

export const useToggleUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, currentlyActive }: { userId: string; currentlyActive: boolean }) =>
      userService.toggleActive(userId, currentlyActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
};

export const useAssignUserPermissionsMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ userId, permissions }: { userId: string; permissions: string[] }) =>
      userService.assignUserPermissions(userId, permissions),
    onSuccess: (_, { userId, permissions }) => {
      // Sync local redux state immediately
      dispatch(setReduxUserPermissions({ userId, permissions }));
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.userPermissions(userId) });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
};
