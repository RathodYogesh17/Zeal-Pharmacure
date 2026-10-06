import React from 'react';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, error, helperText, children, className = '', style, id}) => {
  return (
    <div className={`form-field-group ${className}`} style={{ marginBottom: '14px', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={id}
          style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', }}
        >
          {label} {required && <span style={{ color: '#EF4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      {children}
      {error && (<p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}> <span>•</span> {error} </p> )}
      {!error && helperText && (<p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}> {helperText}</p>)}
    </div>
  );
};
