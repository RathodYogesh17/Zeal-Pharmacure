import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export interface SuccessStateViewProps {
  title?: string;
  message: string;
  referenceId?: string;
  actionButtonText?: string;
  onAction?: () => void;
  secondaryButtonText?: string;
  onSecondaryAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SuccessStateView: React.FC<SuccessStateViewProps> = ({
  title = 'Application Successfully Submitted!',
  message,
  referenceId,
  actionButtonText,
  onAction,
  secondaryButtonText,
  onSecondaryAction,
  className,
  style,
}) => {
  return (
    <div className={`zp-success-box ${className || ''}`} style={style}>
      <div className="zp-success-icon">
        <CheckCircle2 size={34} />
      </div>

      <h4 className="zp-success-title">{title}</h4>
      <p className="zp-success-desc">{message}</p>

      {referenceId && (
        <div style={{ display: 'inline-block', margin: '14px auto 0', background: '#FFFFFF', border: '1px solid #BBF7D0', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, color: '#15803D',}}>
          Reference ID: {referenceId}
        </div>
      )}

      {(actionButtonText || secondaryButtonText) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',  gap: '12px', marginTop: '22px', flexWrap: 'wrap', }}>
          {actionButtonText && onAction && (
            <button type="button" onClick={onAction} className="zp-btn-emerald">
              <span>{actionButtonText}</span>
              <ArrowRight size={14} />
            </button>
          )}

          {secondaryButtonText && onSecondaryAction && (
            <button type="button" onClick={onSecondaryAction} className="zp-btn-secondary">
              <span>{secondaryButtonText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
