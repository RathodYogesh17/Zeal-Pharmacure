import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children,variant = 'primary', size = 'md', loading = false,leftIcon, rightIcon, fullWidth = false, disabled, style, className = '', ...props}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: '#F1F5F9',
          color: '#334155',
          border: '1.5px solid #CBD5E1',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: '#6828DC',
          border: '1.5px solid #6828DC',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#475569',
          border: '1.5px solid transparent',
        };
      case 'danger':
        return {
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          border: '1.5px solid #EF4444',
          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
        };
      case 'success':
        return {
          backgroundColor: '#059669',
          color: '#FFFFFF',
          border: '1.5px solid #059669',
          boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)',
        };
      case 'primary':
      default:
        return {
          backgroundColor: '#6828DC',
          color: '#FFFFFF',
          border: '1.5px solid #6828DC',
          boxShadow: '0 2px 8px rgba(104, 40, 220, 0.25)',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '12.5px', borderRadius: '6px' };
      case 'lg':
        return { padding: '12px 24px', fontSize: '15px', borderRadius: '10px' };
      case 'md':
      default:
        return { padding: '9px 18px', fontSize: '13.5px', borderRadius: '8px' };
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`btn-common ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, cursor: isDisabled ? 'not-allowed' : 'pointer',opacity: isDisabled ? 0.7 : 1,  transition: 'all 0.15s ease', width: fullWidth ? '100%' : 'auto', textDecoration: 'none', boxSizing: 'border-box', ...getVariantStyles(),  ...getSizeStyles(), ...style,}}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="spinner-icon" style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
};
