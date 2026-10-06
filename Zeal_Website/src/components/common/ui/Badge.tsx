import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'green' | 'blue' | 'amber' | 'red' | 'gray';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  size = 'md',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'green':
        return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' };
      case 'blue':
        return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
      case 'amber':
        return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' };
      case 'red':
        return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' };
      case 'gray':
        return { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' };
      case 'purple':
      default:
        return { bg: '#F5F3FF', color: '#6828DC', border: '#DDD6FE' };
    }
  };

  const colors = getColors();

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px',backgroundColor: colors.bg, color: colors.color, border: `1px solid ${colors.border}`, fontWeight: 700, fontSize: size === 'sm' ? '11px' : '12px', padding: size === 'sm' ? '2px 6px' : '3px 10px',  borderRadius: '6px', lineHeight: 1.2, whiteSpace: 'nowrap', ...style,}}>
      {children}
    </span>
  );
};
