import React from 'react';
import { Pill, Award, Users, MapPin } from 'lucide-react';

export const HomeStatsBar: React.FC = () => {
  const stats = [
    {
      icon: <Pill size={24} style={{ color: 'var(--zp-primary, #6828DC)' }} />,
      bg: '#F5F3FF',
      border: '#DDD6FE',
      number: '500',
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
      sub: 'Prompt 24-48 Hours Dispatch',
    },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 10, marginTop: '-38px', marginBottom: '16px' }}>
      <div className="container">
        <div style={{ background: '#FFFFFF', borderRadius: '22px', border: '1.5px solid var(--zp-primary-light, #F5F3FF)', boxShadow: '0 20px 40px -12px rgba(104, 40, 220, 0.12), 0 4px 16px rgba(15, 23, 42, 0.04)', padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '20px', }}>
          {stats.map((s, idx) => (
            <div
              key={idx} className="zp-card-subtle"
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 14px', borderRadius: '14px', }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '30px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                  {s.number}<span style={{ color: s.plusColor }}>+</span>
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
