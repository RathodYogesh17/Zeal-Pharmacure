import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface IAuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  permissions?: string[];
}

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'dashboard:view',
    'product:view', 'product:create', 'product:update', 'product:delete', 'product:publish',
    'category:view', 'category:create', 'category:update', 'category:delete',
    'product_enquiry:view', 'product_enquiry:update', 'product_enquiry:delete', 'product_enquiry:assign',
    'sales_enquiry:view', 'sales_enquiry:update', 'sales_enquiry:delete', 'sales_enquiry:assign',
    'job:view', 'job:create', 'job:update', 'job:delete',
    'application:view', 'application:update', 'application:download_resume',
    'gallery:view', 'gallery:create', 'gallery:update', 'gallery:delete',
    'cms:view', 'cms:create', 'cms:update', 'cms:delete', 'page:view', 'page:update',
    'user:view', 'user:create', 'user:update', 'user:delete',
    'settings:view', 'permission:view', 'permission:assign'
  ],
  HR_MANAGER: [
    'dashboard:view',
    'job:view', 'job:create', 'job:update', 'job:delete',
    'application:view', 'application:update', 'application:download_resume'
  ],
  SALES_MANAGER: [
    'dashboard:view',
    'product:view', 'product:create', 'product:update',
    'category:view',
  ],
  CONTENT_MANAGER: [
    'dashboard:view',
    'cms:view', 'cms:create', 'cms:update', 'cms:delete',
    'gallery:view', 'gallery:create', 'gallery:update', 'gallery:delete',
    'page:view', 'page:update'
  ],
  EMPLOYEE: [
    'dashboard:view',
    'product:view',
    'category:view'
  ]
};

interface AuthState {
  user: IAuthUser | null;
  token: string | null;
  simulatedRole: string | null; // For Super Admin to test other roles like HR_MANAGER live
  customRolePermissions: Record<string, string[]>;
  userPermissionOverrides: Record<string, string[]>; // Map of userId -> permissions array
}

// Load token and initial user from localStorage if present
const storedToken = localStorage.getItem('zeal_admin_token') || 'mock-admin-token';
const storedUserStr = localStorage.getItem('zeal_admin_user');
let initialUser: IAuthUser | null = null;

if (storedUserStr) {
  try {
    initialUser = JSON.parse(storedUserStr);
  } catch {
    initialUser = null;
  }
}

if (!initialUser) {
  initialUser = {
    _id: 'admin-001',
    name: 'Dr. Amit Shah',
    email: 'admin@zealpharma.com',
    role: 'SUPER_ADMIN',
    phone: '+91 93162 27576',
    permissions: ['*'],
  };
}

const storedRolePermsStr = localStorage.getItem('zeal_role_permissions');
let initialRolePermissions = { ...DEFAULT_ROLE_PERMISSIONS };
if (storedRolePermsStr) {
  try {
    const parsed = JSON.parse(storedRolePermsStr);
    initialRolePermissions = { ...DEFAULT_ROLE_PERMISSIONS, ...parsed };
  } catch {
    // fallback
  }
}

const initialState: AuthState = {
  user: initialUser,
  token: storedToken,
  simulatedRole: null,
  customRolePermissions: initialRolePermissions,
  userPermissionOverrides: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: IAuthUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.simulatedRole = null;
      localStorage.setItem('zeal_admin_token', action.payload.token);
      localStorage.setItem('zeal_admin_user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.simulatedRole = null;
      localStorage.removeItem('zeal_admin_token');
      localStorage.removeItem('zeal_admin_user');
    },
    setSimulatedRole: (state, action: PayloadAction<string | null>) => {
      state.simulatedRole = action.payload;
    },
    updateRolePermissions: (
      state,
      action: PayloadAction<{ role: string; permissions: string[] }>
    ) => {
      state.customRolePermissions[action.payload.role] = action.payload.permissions;
      try {
        localStorage.setItem('zeal_role_permissions', JSON.stringify(state.customRolePermissions));
      } catch {
        // storage fallback
      }
    },
    updateUserPermissions: (
      state,
      action: PayloadAction<{ userId: string; permissions: string[] }>
    ) => {
      state.userPermissionOverrides[action.payload.userId] = action.payload.permissions;
      if (state.user && state.user._id === action.payload.userId) {
        state.user.permissions = action.payload.permissions;
        localStorage.setItem('zeal_admin_user', JSON.stringify(state.user));
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  setSimulatedRole,
  updateRolePermissions,
  updateUserPermissions,
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectCurrentRole = (state: RootState): string => {
  const role = state.auth.simulatedRole || state.auth.user?.role || 'SUPER_ADMIN';
  if (typeof role === 'object' && role !== null) {
    const code = (role as any).code || (role as any).name || '';
    if (code && !/^[0-9a-fA-F]{24}$/.test(code)) return String(code).toUpperCase();
    return 'SUPER_ADMIN';
  }
  const str = String(role);
  if (/^[0-9a-fA-F]{24}$/.test(str)) {
    return 'SUPER_ADMIN';
  }
  return str.toUpperCase();
};

const ALL_PERMISSIONS: string[] = ['*'];
const EMPTY_PERMISSIONS: string[] = [];

export const selectEffectivePermissions = createSelector(
  [
    (state: RootState): string => selectCurrentRole(state),
    (state: RootState): string | null => state.auth.simulatedRole,
    (state: RootState): Record<string, string[]> => state.auth.customRolePermissions,
    (state: RootState): string | undefined => state.auth.user?._id,
    (state: RootState): Record<string, string[]> => state.auth.userPermissionOverrides,
    (state: RootState): string[] | undefined => state.auth.user?.permissions,
  ],
  (
    activeRole: string,
    simulatedRole: string | null,
    customRolePermissions: Record<string, string[]>,
    userId: string | undefined,
    userPermissionOverrides: Record<string, string[]>,
    userPermissions: string[] | undefined
  ): string[] => {
    if (activeRole === 'SUPER_ADMIN') {
      return ALL_PERMISSIONS;
    }

    if (simulatedRole) {
      if (customRolePermissions[simulatedRole]) {
        return customRolePermissions[simulatedRole];
      }
      return DEFAULT_ROLE_PERMISSIONS[simulatedRole] || EMPTY_PERMISSIONS;
    }

    if (userId && userPermissionOverrides[userId]) {
      return userPermissionOverrides[userId];
    }

    if (userPermissions && Array.isArray(userPermissions) && userPermissions.length > 0) {
      return userPermissions;
    }

    if (customRolePermissions[activeRole]) {
      return customRolePermissions[activeRole];
    }

    return DEFAULT_ROLE_PERMISSIONS[activeRole] || EMPTY_PERMISSIONS;
  }
);

export const selectHasPermission = (permissionKey: string) => (state: RootState): boolean => {
  const permissions = selectEffectivePermissions(state);
  if (permissions.includes('*')) return true;
  return permissions.includes(permissionKey);
};

export default authSlice.reducer;
