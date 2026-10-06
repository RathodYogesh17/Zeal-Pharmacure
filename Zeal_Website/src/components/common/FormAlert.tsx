import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface FormAlertProps {
  type: 'error' | 'success' | 'info';
  message: string | null | undefined;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const FormAlert: React.FC<FormAlertProps> = ({ type, message, onClose, className, style}) => {
  if (!message) return null;

  const config = {
    error: {
      className: 'zp-alert-error',
      icon: <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />,
    },
    success: {
      className: 'zp-alert-success',
      icon: <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />,
    },
    info: {
      className: 'zp-alert-info',
      icon: <Info size={18} style={{ color: '#6828DC', flexShrink: 0 }} />,
    },
  }[type];

  return (
    <div className={`${config.className} ${className || ''}`} style={style} role="alert">
      {config.icon}
      <div style={{ flex: 1, minWidth: 0 }}>{message}</div>
      {onClose && (
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', opacity: 0.7, color: 'inherit',}} title="Dismiss">
          <X size={15} />
        </button>
      )}
    </div>
  );
};
