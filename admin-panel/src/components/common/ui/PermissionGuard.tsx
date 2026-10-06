import React from 'react';
import { useAppSelector } from '../../../store';
import { selectEffectivePermissions } from '../../../store/slices/authSlice';
import { ShieldAlert } from 'lucide-react';

export interface PermissionGuardProps {
  permission: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ permission, requireAll = false,fallback = null, children,}) => {
  const effectivePermissions = useAppSelector(selectEffectivePermissions);

  if (effectivePermissions.includes('*')) {
    return <>{children}</>;
  }

  const requestedPermissions = Array.isArray(permission) ? permission : [permission];

  const hasAccess = requireAll
    ? requestedPermissions.every((p) => effectivePermissions.includes(p))
    : requestedPermissions.some((p) => effectivePermissions.includes(p));

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const PermissionRestrictedFallback: React.FC<{ moduleName?: string }> = ({ moduleName = 'This feature' }) => {
  return (
    <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '12px', padding: '32px 24px', textAlign: 'center', margin: '20px 0', }}>
      <ShieldAlert size={36} style={{ color: '#D97706', margin: '0 auto 12px' }} />
      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#92400E', marginBottom: '6px' }}>
        Access Restricted
      </h3>
      <p style={{ fontSize: '13.5px', color: '#B45309', maxWidth: '440px', margin: '0 auto' }}>
        {moduleName} requires explicit administrator permission. Please contact your Super Admin to enable this module for your role.
      </p>
    </div>
  );
};
