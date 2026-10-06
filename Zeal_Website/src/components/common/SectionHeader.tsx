import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  badgeStyle?: React.CSSProperties;
  title: string;
  titleLevel?: 'h1' | 'h2' | 'h3';
  titleStyle?: React.CSSProperties;
  subtitle?: React.ReactNode;
  actionLink?: string;
  actionText?: string;
  action?: React.ReactNode;
  rightContent?: React.ReactNode;
  centered?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  badgeIcon,
  badgeStyle,
  title,
  titleLevel = 'h2',
  titleStyle,
  subtitle,
  actionLink,
  actionText,
  action,
  rightContent,
  centered = false,
  align,
  className = '',
  style,
}) => {
  const isCentered = centered || align === 'center';
  const TitleTag = titleLevel;

  return (
    <div
      className={`section-header-wrap ${className}`}
      style={{
        display: 'flex',
        alignItems: isCentered ? 'center' : 'flex-end',
        justifyContent: isCentered ? 'center' : 'space-between',
        textAlign: isCentered ? 'center' : align === 'right' ? 'right' : 'left',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '36px',
        ...style,
      }}
    >
      <div style={{ maxWidth: isCentered ? '720px' : '640px', margin: isCentered ? '0 auto' : undefined }}>
        {badge && (
          <div style={{ marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11.5px',
                fontWeight: 800,
                color: 'var(--zp-primary, #6828DC)',
                background: 'var(--zp-primary-light, #F5F3FF)',
                padding: '4px 12px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                ...badgeStyle,
              }}
            >
              {badgeIcon}
              <span>{badge}</span>
            </span>
          </div>
        )}

        <TitleTag
          style={{
            fontSize: titleLevel === 'h3' ? 'clamp(20px, 2.5vw, 24px)' : 'clamp(24px, 3.5vw, 32px)',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.25,
            margin: '0 0 6px 0',
            fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            ...titleStyle,
          }}
        >
          {title}
        </TitleTag>

        {subtitle && (
          typeof subtitle === 'string' ? (
            <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
              {subtitle}
            </p>
          ) : (
            <div style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.55 }}>
              {subtitle}
            </div>
          )
        )}
      </div>

      {(action || rightContent || (actionLink && actionText)) && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {action}
          {rightContent}
          {actionLink && actionText && (
            <Link
              to={actionLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--zp-primary, #6828DC)',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
            >
              <span>{actionText}</span>
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
