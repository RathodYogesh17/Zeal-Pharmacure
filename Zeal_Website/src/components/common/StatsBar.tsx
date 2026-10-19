import React from 'react';
import { Pill, Award, Users, MapPin, Clock, FlaskConical, Truck } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export interface IStatItem {
  icon: React.ReactNode;
  value?: string | number;
  number?: string | number;
  plusColor?: string;
  label: string;
  sub: string;
  bg?: string;
  border?: string;
}

export interface StatsBarProps {
  variant?: 'cards' | 'inline';
  items?: IStatItem[];
  style?: React.CSSProperties;
  className?: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  variant = 'cards',
  items,
  style,
  className = '',
}) => {
  const { productCount } = useSiteSettings();

  if (variant === 'inline') {
    const defaultAboutStats: IStatItem[] = [
      { label: 'Distribution Legacy', value: '15+', sub: 'Established in 2010', icon: <Clock size={22} style={{ color: 'var(--zp-primary, #6828DC)' }} /> },
      { label: 'DCGI Formulations', value: `${productCount || 500}+`, sub: 'Marketed & Distributed', icon: <FlaskConical size={22} style={{ color: 'var(--zp-primary, #6828DC)' }} /> },
      { label: 'Stockist Partners', value: '200+', sub: 'Across 12+ States', icon: <Users size={22} style={{ color: 'var(--zp-primary, #6828DC)' }} /> },
      { label: 'Distribution Reach', value: 'Pan-India', sub: 'Central Warehouse Hub', icon: <Truck size={22} style={{ color: 'var(--zp-primary, #6828DC)' }} /> },
    ];
    const displayItems = items || defaultAboutStats;

    return (
      <div className={`container ${className}`} style={{ marginTop: '-40px', position: 'relative', zIndex: 10, ...style }}>
        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '24px 32px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)', border: '1.5px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {displayItems.map((item, idx) => (
            <div
              key={idx}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', borderRight: idx !== displayItems.length - 1 ? '1px solid #F1F5F9' : 'none', paddingRight: '10px' }}
            >
              <div
                style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                  {item.value || item.number}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginTop: '3px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // variant === 'cards' (Home standard)
  const defaultHomeStats: IStatItem[] = [
    {
      icon: <Pill size={24} style={{ color: 'var(--zp-primary, #6828DC)' }} />,
      bg: '#F5F3FF',
      border: '#DDD6FE',
      number: productCount ? `${productCount}` : '500',
      plusColor: 'var(--zp-primary, #6828DC)',
      label: 'Formulation Products',
      sub: 'DCGI & Schedule M Approved',
    },
    {
      icon: <Award size={24} style={{ color: '#059669' }} />,
      bg: '#ECFDF5',
      border: '#A7F3D0',
      number: '15',
      plusColor: '#059669',
      label: 'Years of Experience',
      sub: 'Dedicated Pharma Leadership',
    },
    {
      icon: <Users size={24} style={{ color: '#2563EB' }} />,
      bg: '#EFF6FF',
      border: '#BFDBFE',
      number: '1000',
      plusColor: '#2563EB',
      label: 'Happy Clients & Partners',
      sub: 'Distributors & Stockists',
    },
    {
      icon: <MapPin size={24} style={{ color: '#EA580C' }} />,
      bg: '#FFF7ED',
      border: '#FED7AA',
      number: '100',
      plusColor: '#EA580C',
      label: 'Cities Served',
      sub: 'Pan-India Distribution Network',
    },
  ];
  const displayItems = items || defaultHomeStats;

  return (
    <section className={className} style={{ position: 'relative', zIndex: 10, marginTop: '-38px', marginBottom: '16px', ...style }}>
      <div className="container">
        <div style={{ background: '#FFFFFF', borderRadius: '22px', border: '1.5px solid var(--zp-primary-light, #F5F3FF)', boxShadow: '0 20px 40px -12px rgba(104, 40, 220, 0.12), 0 4px 16px rgba(15, 23, 42, 0.04)', padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '20px' }}>
          {displayItems.map((s, idx) => (
            <div
              key={idx}
              className="zp-card-subtle"
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 14px', borderRadius: '14px' }}
            >
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '30px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                  {s.number || s.value}
                  <span style={{ color: s.plusColor || 'var(--zp-primary, #6828DC)' }}>+</span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500, marginTop: '1px' }}>
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
