import React, { forwardRef } from 'react';
import { FormField } from './FormField';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, error, helperText, required, leftIcon, rightIcon, id, style, containerStyle, disabled,...props },ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <FormField label={label} required={required} error={error} helperText={helperText} id={inputId} style={containerStyle}>
        <div style={{ position: 'relative', width: '100%' }}>
          {leftIcon && (
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex', alignItems: 'center', pointerEvents: 'none',}}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            style={{ width: '100%',paddingTop: '9px', paddingBottom: '9px',paddingLeft: leftIcon ? '38px' : '14px', paddingRight: rightIcon ? '38px' : '14px', borderRadius: '8px', border: error ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1', boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none', fontSize: '13.5px', color: '#0F172A', backgroundColor: disabled ? '#F1F5F9' : '#FFFFFF', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',boxSizing: 'border-box',...style,
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
          />

          {rightIcon && (
            <div style={{ position: 'absolute',right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', display: 'flex', alignItems: 'center',}}>
              {rightIcon}
            </div>
          )} 
        </div>
      </FormField>
    );
  }
);

FormInput.displayName = 'FormInput';
