import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AuthCardLayoutProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconGradient?: string;
  errorMessage?: string | null;
  successMessage?: string | null;
  bannerContent?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  padding?: string;
}

export const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({
  title,
  subtitle,
  icon: Icon = Sparkles,
  iconGradient = 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
  errorMessage,
  successMessage,
  bannerContent,
  children,
  footer,
  maxWidth = '460px',
  padding = '40px 32px 36px',
}) => {
  return (
    <div  style={{ minHeight: 'calc(100vh - 160px)', background: 'linear-gradient(135deg, #F8FAFC 0%, #EDE9FE 50%, #F1F5F9 100%)',  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', }}>
      <div style={{ width: '100%', maxWidth, background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 25px 60px -12px rgba(104, 40, 220, 0.15), 0 2px 10px rgba(0, 0, 0, 0.04)', border: '1.5px solid #EDE9FE', overflow: 'hidden',}}>
        <div style={{ padding }}>
          {/* Header Icon + Title */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: iconGradient,display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 8px 20px rgba(104, 40, 220, 0.28)', marginBottom: '16px', }}>
              <Icon size={28} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '24px', fontWeight: 800, color: '#1E1B4B', letterSpacing: '-0.3px', marginBottom: '6px', }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px',  padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#991B1B', fontSize: '13.5px', marginBottom: '20px', }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#166534', fontSize: '13.5px', marginBottom: '20px',}}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Extra Banner (e.g. dev OTP hint) */}
          {bannerContent}

          {/* Main Form Children */}
          {children}

          {/* Footer Navigation Links */}
          {footer && (
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', textAlign: 'center', fontSize: '13.5px',  color: '#64748B', }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
