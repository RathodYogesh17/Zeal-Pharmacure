import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children,  footer, maxWidth = '580px',}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,  backgroundColor: 'rgba(15, 23, 42, 0.65)',  backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',  zIndex: 9999, padding: '16px',}}
      onClick={onClose}
    >
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%',  maxWidth, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', animation: 'fadeInScale 0.2s ease-out', overflow: 'hidden',}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex',alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', }}>
            <div>
              {title && (
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                  {subtitle}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F1F5F9', border: 'none', color: '#64748B', display: 'flex',alignItems: 'center',  justifyContent: 'center', cursor: 'pointer', flexShrink: 0, }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>{children}</div>

        {/* Footer */}
        {footer && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC',  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px',}}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
