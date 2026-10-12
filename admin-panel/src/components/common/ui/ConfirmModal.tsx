import React from 'react';
import { AlertTriangle, Trash2, CheckCircle2, Info, X } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Trash2 size={22} />
          </div>
        );
      case 'warning':
        return (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#FFFBEB',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>
        );
      case 'success':
        return (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={22} />
          </div>
        );
      case 'info':
      default:
        return (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Info size={22} />
          </div>
        );
    }
  };

  const getButtonVariant = () => {
    if (variant === 'danger') return 'danger';
    if (variant === 'success') return 'primary';
    return 'primary';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div style={{ padding: '6px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
          {getIcon()}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: '0 0 6px 0',
                fontSize: '17px',
                fontWeight: 800,
                color: '#0F172A',
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              }}
            >
              {title}
            </h3>
            <div
              style={{
                fontSize: '13px',
                color: '#64748B',
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
            paddingTop: '14px',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={getButtonVariant() as any} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
