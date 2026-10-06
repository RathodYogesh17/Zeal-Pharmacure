import React, { forwardRef } from 'react';
import { FormField } from './FormField';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: React.CSSProperties;
  showCount?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({label, error, helperText, required, id,style, containerStyle, disabled, maxLength, showCount, value, ...props}, ref) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <FormField label={label} required={required} error={error} helperText={helperText} id={textareaId} style={containerStyle}>
        <div style={{ position: 'relative', width: '100%' }}>
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            rows={props.rows || 3}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: error ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1', fontSize: '13.5px',color: '#0F172A', backgroundColor: disabled ? '#F1F5F9' : '#FFFFFF', outline: 'none', resize: 'vertical', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s',...style,}}
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

          {showCount && maxLength && (
            <div style={{ fontSize: '11px', color: currentLength >= maxLength ? '#EF4444' : '#94A3B8', textAlign: 'right', marginTop: '3px', }}>
              {currentLength} / {maxLength}
            </div>
          )}
        </div>
      </FormField>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
