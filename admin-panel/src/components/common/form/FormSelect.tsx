import React, { forwardRef } from 'react';
import { FormField } from './FormField';
import { ThemeSelect } from '../tableTheme';

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
  ({ label, error, helperText, required, options, placeholder, id, style, containerStyle, disabled, value, onChange, ...props }, _ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    const formattedOptions: FormSelectOption[] = options.map((opt) =>
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    return (
      <FormField label={label} required={required} error={error} helperText={helperText} id={selectId} style={containerStyle}>
        <ThemeSelect
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          options={formattedOptions}
          style={{ width: '100%', borderColor: error ? '#EF4444' : undefined, ...style }}
          containerStyle={{ width: '100%' }}
          {...props}
        />
      </FormField>
    );
  }
);

FormSelect.displayName = 'FormSelect';
