import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  bg?: string;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  link?: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  bg = '#F5F3FF',
  trend,
  link,
  onClick,
  active = false,
  className = '',
  style,
}) => {
  const content = (
    <div
      className={`zp-stat-card ${active ? 'is-active' : ''} ${className}`}
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: active ? '1.5px solid #6828DC' : '1px solid #E2E8F0',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        boxShadow: active ? '0 8px 24px rgba(104, 40, 220, 0.12)' : '0 1px 3px rgba(15, 23, 42, 0.05)',
        cursor: link || onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (link || onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(15, 23, 42, 0.08)';
        }
      }}
      onMouseLeave={(e) => {
        if (link || onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = active ? '0 8px 24px rgba(104, 40, 220, 0.12)' : '0 1px 3px rgba(15, 23, 42, 0.05)';
        }
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: '0 0 4px 0',
            fontSize: '12.5px',
            fontWeight: 600,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 900,
              color: '#0F172A',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {value}
          </h3>

          {trend && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '11px',
                fontWeight: 700,
                color: trend.isPositive ? '#059669' : '#DC2626',
                background: trend.isPositive ? '#ECFDF5' : '#FEF2F2',
                padding: '2px 6px',
                borderRadius: '6px',
              }}
            >
              {trend.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trend.value}
            </span>
          )}
        </div>

        {sublabel && (
          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '11.5px',
              fontWeight: 500,
              color: '#94A3B8',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {sublabel}
          </p>
        )}
      </div>

      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to={link} style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
        {content}
      </Link>
    );
  }

  return content;
};
