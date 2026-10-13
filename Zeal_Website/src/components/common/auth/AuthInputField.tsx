import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AuthInputFieldProps {
  label: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  icon?: LucideIcon;
  iconColor?: string;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  pattern?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}

export const AuthInputField: React.FC<AuthInputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  icon: Icon,
  iconColor = '#8B5CF6',
  disabled = false,
  error,
  autoFocus = false,
  onKeyDown,
  maxLength,
  pattern,
  style,
  compact = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '4px' : '6px', ...style }}>
      <label
        style={{
          display: 'block',
          fontSize: compact ? '12.5px' : '13px',
          fontWeight: 700,
          color: '#334155',
          fontFamily: 'inherit',
        }}
      >
        {label}
        {required && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
      </label>

      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <Icon
            size={compact ? 16 : 18}
            style={{
              position: 'absolute',
              left: compact ? '12px' : '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isFocused ? '#6828DC' : iconColor,
              transition: 'color 0.2s ease',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}

        <input
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          pattern={pattern}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: compact
              ? `${Icon ? '10px 14px 10px 38px' : '10px 14px'}`
              : `${Icon ? '12px 14px 12px 42px' : '12px 14px'}`,
            paddingRight: isPassword ? '42px' : '14px',
            fontSize: compact ? '13.5px' : '14px',
            borderRadius: '12px',
            border: error
              ? '1.5px solid #EF4444'
              : isFocused
                ? '1.5px solid #6828DC'
                : '1.5px solid #E2E8F0',
            background: isFocused ? '#FFFFFF' : '#F8FAFC',
            color: '#0F172A',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: error
              ? '0 0 0 3px rgba(239, 68, 68, 0.12)'
              : isFocused
                ? '0 0 0 3px rgba(104, 40, 220, 0.12)'
                : 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: '4px',
              cursor: 'pointer',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'color 0.15s ease',
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <span
          style={{
            fontSize: '12px',
            color: '#DC2626',
            fontWeight: 500,
            lineHeight: 1.35,
            marginTop: '2px',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};
