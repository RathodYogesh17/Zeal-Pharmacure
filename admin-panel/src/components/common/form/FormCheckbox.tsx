import React, { forwardRef } from 'react';

export interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, description, id, checked, disabled, containerStyle, style, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <label
        htmlFor={checkboxId}
        style={{ display: 'flex',  alignItems: 'flex-start',  gap: '10px',  cursor: disabled ? 'not-allowed' : 'pointer',  userSelect: 'none',  opacity: disabled ? 0.6 : 1, ...containerStyle, }}
      >
        <div style={{ position: 'relative', marginTop: '2px' }}>
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            disabled={disabled}
            style={{ width: '18px',  height: '18px', accentColor: '#6828DC',  cursor: disabled ? 'not-allowed' : 'pointer',  ...style, }}
            {...props}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}> {label} </div>
          {description && ( <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', lineHeight: 1.4 }}> {description} </div> )}
        </div>
      </label>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';
