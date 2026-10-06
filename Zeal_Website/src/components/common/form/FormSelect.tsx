import React, { forwardRef } from 'react';
import { FormField } from './FormField';

export interface FormSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: FormSelectOption[] | string[];
  placeholder?: string;
  containerStyle?: React.CSSProperties;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ( { label, error, helperText, required, options, placeholder, id,style, containerStyle,disabled, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const formattedOptions: FormSelectOption[] = options.map((opt) =>
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    return (
      <FormField label={label} required={required} error={error} helperText={helperText} id={selectId} style={containerStyle}>
        <div style={{ position: 'relative', width: '100%' }}>
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            style={{ width: '100%', paddingTop: '9px', paddingBottom: '9px', paddingLeft: '14px', paddingRight: '36px',  borderRadius: '8px', border: error ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1', fontSize: '13.5px', color: '#0F172A', backgroundColor: disabled ? '#F1F5F9' : '#FFFFFF',outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer', appearance: 'none',boxSizing: 'border-box', ...style,
            }}
            onFocus={(e) => {
              if (!error) {
                e.currentTarget.style.borderColor = '#6828DC';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
              }
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              if (!error) {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.boxShadow = 'none';
              }
              props.onBlur?.(e);
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled> {placeholder} </option>)}
            {formattedOptions.map((opt) => (
              <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Chevron Indicator */}
          <div style={{ position: 'absolute', right: '14px', top: '50%',  transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B', fontSize: '11px', }}>
            ▼
          </div>
        </div>
      </FormField>
    );
  }
);

FormSelect.displayName = 'FormSelect';
