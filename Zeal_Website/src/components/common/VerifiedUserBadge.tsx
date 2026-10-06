import React from 'react';
import { ShieldCheck, User, Phone, Mail } from 'lucide-react';
import type { IUser } from '../../types';

interface VerifiedUserBadgeProps {
  user: IUser | null;
  compact?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const VerifiedUserBadge: React.FC<VerifiedUserBadgeProps> = ({
  user,
  compact = false,
  style,
  className,
}) => {
  if (!user) return null;

  return (
    <div
      className={className}
      style={{
        background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
        border: '1.5px solid #DDD6FE',
        borderRadius: compact ? '10px' : '14px',
        padding: compact ? '8px 12px' : '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: compact ? '32px' : '38px',
            height: compact ? '32px' : '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6828DC 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: compact ? '13px' : '15px',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(104, 40, 220, 0.25)',
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                fontWeight: 800,
                fontSize: compact ? '13px' : '14px',
                color: '#1E1B4B',
              }}
            >
              {user.name}
            </span>
            <span
              style={{
                background: '#DCFCE7',
                color: '#15803D',
                fontSize: '10.5px',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <ShieldCheck size={11} />
              <span>Verified Account</span>
            </span>
          </div>

          <div
            style={{
              fontSize: '11.5px',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '2px',
            }}
          >
            {user.phone ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={11} style={{ color: '#8B5CF6' }} />
                <span>{user.phone}</span>
              </span>
            ) : (
              <span style={{ color: '#D97706', fontWeight: 600 }}>Phone not set in profile</span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={11} style={{ color: '#8B5CF6' }} />
              <span>{user.email}</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: '#6828DC', fontWeight: 700 }}>
        Enquiry automatically linked to your registered profile
      </div>
    </div>
  );
};
