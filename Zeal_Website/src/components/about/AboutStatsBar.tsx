import React from 'react';
import { Clock, FlaskConical, Users, Truck } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const AboutStatsBar: React.FC = () => {
  const { productCount } = useSiteSettings();
  const stats = [
    { label: 'Distribution Legacy', value: '15+', sub: 'Established in 2010', icon: <Clock size={22} style={{ color: 'var(--zp-primary, #6828DC)' }} /> },
    { label: 'DCGI Formulations', value: `${productCount}+`, sub: 'Marketed & Distributed', icon: <FlaskConical size={22} style={{ color: 'var(--zp-primary, #6828DC)' }} /> },
    { label: 'Monopoly Partners', value: '200+', sub: 'Across 12+ States', icon: <Users size={22} style={{ color: 'var(--zp-primary, #6828DC)' }} /> },
    { label: 'Express Dispatch', value: '24-48h', sub: 'Central Warehouse Hub', icon: <Truck size={22} style={{ color: 'var(--zp-primary, #6828DC)' }} /> },
  ];

  return (
    <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
      <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '24px 32px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)', border: '1.5px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', }}>
        {stats.map((item, idx) => (
          <div
            key={idx}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', borderRight: idx !== stats.length - 1 ? '1px solid #F1F5F9' : 'none', paddingRight: '10px', }}>
            <div
              style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                {item.value}
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
};
