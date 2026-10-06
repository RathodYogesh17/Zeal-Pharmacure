import React from 'react';

export interface FormSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({ checked, onChange, label, description, disabled = false, style,}) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none', opacity: disabled ? 0.6 : 1, gap: '12px', ...style, }}
    >
      {(label || description) && (
        <div>
          {label && <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>{label}</div>}
          {description && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{description}</div>}
        </div>
      )}

      {/* Switch Track */}
      <div style={{ width: '44px', height: '24px', borderRadius: '999px', backgroundColor: checked ? '#6828DC' : '#CBD5E1', position: 'relative', transition: 'background-color 0.25s', flexShrink: 0,}}>
        {/* Switch Thumb */}
        <div style={{  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF', position: 'absolute', top: '3px',left: checked ? '23px' : '3px', transition: 'left 0.25s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', }}/>
      </div>
    </div>
  );
};
