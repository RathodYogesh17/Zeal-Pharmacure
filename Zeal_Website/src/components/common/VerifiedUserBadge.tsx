import React, { useState } from 'react';
import { ShieldCheck, Phone, Mail, CheckCircle2 } from 'lucide-react';
import type { IUser } from '../../types';
import { getMediaUrl } from '../../utils/mediaUtils';

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
  const [imageError, setImageError] = useState(false);

  if (!user) return null;

  const profileImg = user.profileImage || (user as any).avatar;
  const avatarUrl = profileImg && !imageError ? getMediaUrl(profileImg) : null;
  const initial = user.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div
      className={className}
      style={{
        background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
        border: '1.5px solid #DDD6FE',
        borderRadius: compact ? '12px' : '16px',
        padding: compact ? '10px 14px' : '14px 18px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        boxShadow: '0 4px 16px rgba(104, 40, 220, 0.06)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* User Profile Avatar with Verified Ring / Fallback Initial */}
        <div
          style={{
            position: 'relative',
            width: compact ? '36px' : '44px',
            height: compact ? '36px' : '44px',
            borderRadius: '50%',
            flexShrink: 0,
            border: '2px solid #8B5CF6',
            boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
            background: 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user.name || 'User Profile'}
              onError={() => setImageError(true)}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <span
              style={{
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: compact ? '14px' : '17px',
                fontFamily: "'Outfit', sans-serif",
                textTransform: 'uppercase',
                userSelect: 'none',
              }}
            >
              {initial}
            </span>
          )}

          {/* Small Verified Check Indicator Badge at bottom right of avatar */}
          <div
            title="Identity Verified"
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={9} color="#FFFFFF" strokeWidth={3} />
          </div>
        </div>

        {/* User Details */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                fontWeight: 800,
                fontSize: compact ? '13.5px' : '15px',
                color: '#1E1B4B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.name}
            </span>

            {/* Verified Account Badge - Theme Styled with Emerald Contrast */}
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                fontSize: compact ? '10px' : '11px',
                fontWeight: 800,
                padding: '2.5px 9px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
                letterSpacing: '0.02em',
              }}
            >
              <ShieldCheck size={12} strokeWidth={2.5} />
              <span>Verified Account</span>
            </span>
          </div>

          <div
            style={{
              fontSize: '12px',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginTop: '3px',
            }}
          >
            {user.phone ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={12} style={{ color: '#8B5CF6' }} />
                <span style={{ fontWeight: 600 }}>{user.phone}</span>
              </span>
            ) : (
              <span style={{ color: '#D97706', fontWeight: 600, fontSize: '11px' }}>Phone not set in profile</span>
            )}

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Mail size={12} style={{ color: '#8B5CF6' }} />
              <span style={{ fontWeight: 600 }}>{user.email}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Auto Link Note with Emerald check icon */}
      <div
        style={{
          fontSize: '11.5px',
          color: '#6828DC',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: '#EDE9FE',
          padding: '4px 10px',
          borderRadius: '8px',
        }}
      >
        <CheckCircle2 size={13} style={{ color: '#059669', flexShrink: 0 }} />
        <span>Enquiry automatically linked to your registered profile</span>
      </div>
    </div>
  );
};
