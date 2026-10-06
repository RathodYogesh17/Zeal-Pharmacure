import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AuthSubmitButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  showArrow?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'submit' | 'button';
  compact?: boolean;
}

export const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({
  label,
  loading = false,
  disabled = false,
  icon: Icon,
  showArrow = true,
  style,
  onClick,
  type = 'submit',
  compact = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      style={{
        width: '100%',
        padding: compact ? '12px' : '14px',
        borderRadius: '12px',
        border: 'none',
        background: 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
        color: '#FFFFFF',
        fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
        fontSize: compact ? '14px' : '15px',
        fontWeight: 800,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 8px 24px -4px rgba(104, 40, 220, 0.38)',
        transition: 'all 0.2s ease',
        opacity: isDisabled ? 0.75 : 1,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      <span>{loading ? 'Processing...' : label}</span>
      {!loading && showArrow && <ArrowRight size={16} />}
    </button>
  );
};
