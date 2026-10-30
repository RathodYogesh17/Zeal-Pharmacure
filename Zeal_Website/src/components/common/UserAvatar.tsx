import React, { useState } from 'react';

interface UserAvatarProps {
  image?: string | null;
  src?: string | null;
  name?: string | null;
  size?: number;
  fontSize?: number;
  className?: string;
  style?: React.CSSProperties;
  border?: string;
  showBadge?: boolean;
  badgeColor?: string;
  alt?: string;
}

// Gmail & Google Accounts authentic vibrant color palette
const GMAIL_PALETTE = [
  { bg: '#1A73E8', text: '#FFFFFF' }, // Google Blue
  { bg: '#00897B', text: '#FFFFFF' }, // Google Teal
  { bg: '#8E24AA', text: '#FFFFFF' }, // Purple
  { bg: '#E64A19', text: '#FFFFFF' }, // Deep Orange
  { bg: '#00ACC1', text: '#FFFFFF' }, // Cyan
  { bg: '#2E7D32', text: '#FFFFFF' }, // Forest Green
  { bg: '#3949AB', text: '#FFFFFF' }, // Indigo
  { bg: '#D81B60', text: '#FFFFFF' }, // Pink / Berry
  { bg: '#F57C00', text: '#FFFFFF' }, // Amber
  { bg: '#6828DC', text: '#FFFFFF' }, // Zeal Brand Violet
  { bg: '#C2185B', text: '#FFFFFF' }, // Rose
  { bg: '#0288D1', text: '#FFFFFF' }, // Light Blue
];

export const getGmailColorForName = (name?: string | null) => {
  const clean = (name || 'User').trim();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GMAIL_PALETTE.length;
  return GMAIL_PALETTE[index];
};

export const resolveImageUrl = (url?: string | null): string => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const backendBase = (import.meta.env.VITE_API_URL || 'https://zeal-pharmacure-backend.vercel.app/api').replace(
    /\/api\/?$/,
    ''
  );
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendBase}${cleanPath}`;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({image, src, name, size = 40, fontSize, className = '', style = {}, border, showBadge = false, badgeColor = '#10B981', alt = 'User Avatar',}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Compute first character like Gmail (Single initial, Uppercase)
  const firstChar = (name && name.trim().length > 0)
    ? name.trim().charAt(0).toUpperCase()
    : 'U';

  const colorScheme = getGmailColorForName(name);
  const calculatedFontSize = fontSize || Math.max(13, Math.round(size * 0.46));
  const candidateImage = image || src;
  const fullImageUrl = candidateImage && !imageFailed ? resolveImageUrl(candidateImage) : null;

  return (
    <div
      className={className}
      style={{ position: 'relative', width: `${size}px`, height: `${size}px`, borderRadius: '50%', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', border: border || 'none', ...style, }}>
      {fullImageUrl ? (
        <img
          src={fullImageUrl}
          alt={alt || name || 'User profile'}
          onError={() => setImageFailed(true)}
          style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block', }}/>
      ) : (
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: colorScheme.bg, color: colorScheme.text, fontSize: `${calculatedFontSize}px`, fontWeight: 700, fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', textTransform: 'uppercase', boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 2px 6px rgba(0, 0, 0, 0.12)', letterSpacing: '-0.5px',}}>
          {firstChar}
        </div>
      )}

      {/* Optional Online / Verified Indicator Badge */}
      {showBadge && (
        <span style={{ position: 'absolute', bottom: '1px', right: '1px', width: `${Math.max(8, Math.round(size * 0.26))}px`, height: `${Math.max(8, Math.round(size * 0.26))}px`, borderRadius: '50%', background: badgeColor, border: '2px solid #FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', }}/>
      )}
    </div>
  );
};
