import React from 'react';

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  subtext?: string;
  colorScheme?: 'green' | 'purple' | 'amber' | 'blue' | 'slate';
  className?: string;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subtext, colorScheme = 'purple', className, style}) => {
  const schemeStyles = {
    purple: { bg: '#FAF5FF', text: 'var(--zp-primary, #6828DC)', border: '#EDE9FE' },
    green: { bg: '#F0FDF4', text: '#16A34A', border: '#DCFCE7' },
    amber: { bg: '#FFFBEB', text: '#D97706', border: '#FEF3C7' },
    blue: { bg: '#F0F9FF', text: '#0284C7', border: '#E0F2FE' },
    slate: { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
  }[colorScheme];

  return (
    <div className={`zp-stat-card ${className || ''}`} style={style}>
      <div className="zp-stat-icon-wrap" style={{ background: schemeStyles.bg, color: schemeStyles.text, border: `1px solid ${schemeStyles.border}`, }}>
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="zp-stat-label">{label}</div>
        <div className="zp-stat-value">{value}</div>
        {subtext && (<div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}> {subtext} </div> )}
      </div>
    </div>
  );
};
