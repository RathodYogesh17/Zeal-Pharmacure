import React from 'react';
import {
  TrendingUp,
  FlaskConical,
  Award,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

export const CareerPerksBanner: React.FC = () => {
  const perks = [
    {
      icon: <TrendingUp size={24} color="#6828DC" />,
      title: 'Fast-Track Meritocracy',
      desc: 'Transparent biannual performance evaluations with accelerated promotions for outstanding field performers and formulation scientists.',
    },
    {
      icon: <FlaskConical size={24} color="#059669" />,
      title: 'WHO-GMP Innovation Labs',
      desc: 'Work hands-on with cutting-edge analytical testing, HPLC instrumentation, and fully automated pharmaceutical manufacturing systems.',
    },
    {
      icon: <Award size={24} color="#D97706" />,
      title: 'Uncapped Field Incentives',
      desc: 'Industry-leading daily allowances, quarterly performance bonuses, and annual international leadership conferences for high-achievers.',
    },
    {
      icon: <HeartPulse size={24} color="#2563EB" />,
      title: 'Family Health & Mediclaim',
      desc: 'Comprehensive group mediclaim insurance, annual preventive executive checkups, and wellness assistance for you and your dependents.',
    },
  ];

  return (
    <section
      style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 50%, #ECFDF5 100%)', borderRadius: '24px', border: '1.5px solid #DDD6FE', padding: '40px 32px', margin: '0 auto', boxShadow: '0 8px 30px rgba(104, 40, 220, 0.05)', }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 800, color: '#6828DC', background: '#FFFFFF',  border: '1px solid #DDD6FE', padding: '4px 14px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.04em',  marginBottom: '8px',  }}>
          <Sparkles size={13} color="#6828DC" />
          <span>Workplace Culture &amp; Benefits</span>
        </div>

        <h3 style={{fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.02em',}}>
          Why Build Your Career at Zeal Pharma?
        </h3>

        <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
          We foster an inspiring environment where clinical integrity, scientific curiosity, and commercial leadership thrive together.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', }}>
        {perks.map((p, idx) => (
          <div
            key={idx}
            style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px 20px', border: '1.2px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)', display: 'flex', flexDirection: 'column', gap: '12px', }}>
            <div style={{ width: '46px', height: '46px',  borderRadius: '12px', background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #EDE9FE', }}>
              {p.icon}
            </div>

            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                {p.title}
              </h4>
              <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
