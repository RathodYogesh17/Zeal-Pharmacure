import React from 'react';
import { Pill, Sparkles } from 'lucide-react';

export interface ZealLoaderProps {
  /** Main message text displayed below the loader */
  title?: string;
  /** Subtitle message text with additional details */
  subtitle?: string;
  /** Size of the spinner & overall loader */
  size?: 'sm' | 'md' | 'lg';
  /** Presentation variant */
  variant?: 'card' | 'fullscreen' | 'inline' | 'table-row';
  /** Number of table columns to span (when variant='table-row') */
  colSpan?: number;
  /** Custom minimum height for card/fullscreen containers */
  minHeight?: string | number;
  /** Optional extra CSS class name */
  className?: string;
  /** Optional inline CSS styles */
  style?: React.CSSProperties;
  /** Show subtle enterprise badge */
  showBadge?: boolean;
}

export const ZealLoader: React.FC<ZealLoaderProps> = ({
  title = 'Loading data...',
  subtitle = 'Syncing with Zeal Pharmacure Cloud ERP',
  size = 'md',
  variant = 'card',
  colSpan = 1,
  minHeight,
  className = '',
  style = {},
  showBadge = true,
}) => {
  // Size metrics
  const spinnerSizes = {
    sm: { diameter: 28, stroke: 3, icon: 13, titleSize: '12.5px', subSize: '11px', gap: '8px' },
    md: { diameter: 48, stroke: 4, icon: 20, titleSize: '14.5px', subSize: '12.5px', gap: '14px' },
    lg: { diameter: 64, stroke: 4.5, icon: 26, titleSize: '16.5px', subSize: '13px', gap: '18px' },
  };

  const currentSize = spinnerSizes[size];

  // Inline variant (compact horizontal representation for dropdowns or inline elements)
  if (variant === 'inline') {
    return (
      <div
        className={`zeal-inline-loader ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#6828DC',
          fontSize: currentSize.titleSize,
          fontWeight: 600,
          padding: '6px 10px',
          borderRadius: '8px',
          background: 'rgba(104, 40, 220, 0.05)',
          border: '1px solid rgba(104, 40, 220, 0.12)',
          ...style,
        }}
      >
        <svg
          viewBox="0 0 50 50"
          style={{
            width: `${currentSize.diameter * 0.7}px`,
            height: `${currentSize.diameter * 0.7}px`,
            animation: 'zealSpinAnimation 1.1s linear infinite',
          }}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#EDE9FE"
            strokeWidth={currentSize.stroke}
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#6828DC"
            strokeWidth={currentSize.stroke}
            strokeDasharray="90 150"
            strokeLinecap="round"
          />
        </svg>
        <span>{title}</span>
      </div>
    );
  }

  // Loader Body (the spinner, pill icon, glowing pulse, and typography)
  const loaderBody = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: currentSize.gap,
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      <style>{`
        @keyframes zealSpinAnimation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes zealPulseGlowRing {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(104, 40, 220, 0.28);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 24px 6px rgba(104, 40, 220, 0.18);
            transform: scale(1.04);
          }
        }
        @keyframes zealPillBreath {
          0%, 100% {
            transform: translateY(0px) rotate(-15deg);
          }
          50% {
            transform: translateY(-2.5px) rotate(15deg);
          }
        }
        @keyframes zealDotFlashing {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.25); }
        }
      `}</style>

      {/* Spinner Ring + Floating Pharma Pill Centerpiece */}
      <div
        style={{
          position: 'relative',
          width: `${currentSize.diameter}px`,
          height: `${currentSize.diameter}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Ambient Glowing Halo */}
        <div
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(104, 40, 220, 0.15) 0%, rgba(139, 92, 246, 0.04) 70%, transparent 100%)',
            animation: 'zealPulseGlowRing 2.4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* SVG Dual-Track Gradient Rotating Ring */}
        <svg
          viewBox="0 0 50 50"
          style={{
            width: '100%',
            height: '100%',
            animation: 'zealSpinAnimation 1.15s cubic-bezier(0.4, 0.1, 0.3, 0.9) infinite',
            transformOrigin: 'center center',
          }}
        >
          <defs>
            <linearGradient id="zealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6828DC" />
              <stop offset="60%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
          {/* Base track */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#EDE9FE"
            strokeWidth={currentSize.stroke}
          />
          {/* Active spinning gradient arc */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="url(#zealGrad)"
            strokeWidth={currentSize.stroke}
            strokeDasharray="95 150"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Pharmaceutical Pill Badge */}
        <div
          style={{
            position: 'absolute',
            width: `${currentSize.diameter * 0.54}px`,
            height: `${currentSize.diameter * 0.54}px`,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 100%)',
            border: '1px solid #DDD6FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(104, 40, 220, 0.14)',
          }}
        >
          <Pill
            size={currentSize.icon}
            style={{
              color: '#6828DC',
              animation: 'zealPillBreath 2.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Typography: Title + Subtitle */}
      <div>
        <h4
          style={{
            margin: 0,
            fontSize: currentSize.titleSize,
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.015em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span>{title}</span>
          <span
            style={{
              display: 'inline-flex',
              gap: '3px',
              marginLeft: '2px',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#6828DC',
                display: 'inline-block',
                animation: 'zealDotFlashing 1.2s infinite ease-in-out',
                animationDelay: '0s',
              }}
            />
            <span
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#6828DC',
                display: 'inline-block',
                animation: 'zealDotFlashing 1.2s infinite ease-in-out',
                animationDelay: '0.2s',
              }}
            />
            <span
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#6828DC',
                display: 'inline-block',
                animation: 'zealDotFlashing 1.2s infinite ease-in-out',
                animationDelay: '0.4s',
              }}
            />
          </span>
        </h4>

        {subtitle && size !== 'sm' && (
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: currentSize.subSize,
              fontWeight: 500,
              color: '#64748B',
              letterSpacing: '0.01em',
              maxWidth: '380px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Enterprise Security Pill Badge */}
      {showBadge && size === 'lg' && (
        <div
          style={{
            marginTop: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            padding: '3px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#64748B',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10B981',
              display: 'inline-block',
            }}
          />
          <span>Zeal Pharmacure Secure Portal</span>
        </div>
      )}
    </div>
  );

  // Table row representation
  if (variant === 'table-row') {
    return (
      <tr className={`zeal-table-loader-row ${className}`}>
        <td
          colSpan={colSpan}
          style={{
            padding: minHeight ? `${minHeight} 24px` : '54px 24px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            ...style,
          }}
        >
          {loaderBody}
        </td>
      </tr>
    );
  }

  // Fullscreen overlay variant
  if (variant === 'fullscreen') {
    return (
      <div
        className={`zeal-fullscreen-loader ${className}`}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(248, 250, 252, 0.88)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          ...style,
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 20px 45px -10px rgba(104, 40, 220, 0.15)',
            padding: '40px 48px',
            maxWidth: '460px',
            width: '100%',
          }}
        >
          {loaderBody}
        </div>
      </div>
    );
  }

  // Default: Card Container
  return (
    <div
      className={`zeal-card-loader ${className}`}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
        padding: '56px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: minHeight || (size === 'lg' ? '340px' : '260px'),
        boxSizing: 'border-box',
        width: '100%',
        ...style,
      }}
    >
      {loaderBody}
    </div>
  );
};
