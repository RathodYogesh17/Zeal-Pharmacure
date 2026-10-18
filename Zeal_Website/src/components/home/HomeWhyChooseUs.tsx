import React from 'react';
import { ShieldCheck, Award, Users, FlaskConical, Smile, Network, Sparkles } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import './HomeStyles.css';

export const HomeWhyChooseUs: React.FC = () => {
  const { productCount } = useSiteSettings();
  const cards = [
    {
      title: 'WHO-GMP & cGMP Compliance',
      desc: 'Formulated under rigorous international pharmaceutical guidelines ensuring zero-defect batch quality.',
      icon: <ShieldCheck size={24} style={{ color: '#2563EB' }} />,
      bg: '#EFF6FF',
      border: '#BFDBFE',
    },
    {
      title: `${productCount}+ DCGI Formulations`,
      desc: 'Broad therapeutic spectrum covering cardiac, derma, respiratory, orthopedic, pediatric, and chronic care.',
      icon: <Award size={24} style={{ color: 'var(--zp-primary, #6828DC)' }} />,
      bg: '#F5F3FF',
      border: '#DDD6FE',
    },
    {
      title: 'Experienced Leadership',
      desc: '15+ years guided by seasoned pharmaceutical executives, formulation scientists, and supply-chain leaders.',
      icon: <Users size={24} style={{ color: '#0284C7' }} />,
      bg: '#F0F9FF',
      border: '#BAE6FD',
    },
    {
      title: 'Modern Testing Laboratories',
      desc: 'Every active formulation undergoes rigorous HPLC testing, microbiological screening, and stability trials.',
      icon: <FlaskConical size={24} style={{ color: '#059669' }} />,
      bg: '#ECFDF5',
      border: '#A7F3D0',
    },
    {
      title: '1000+ Satisfied Partners',
      desc: 'Trusted nationwide by authorized medical practitioners, hospital procurement units, and authorized Stockists / Distribution partners.',
      icon: <Smile size={24} style={{ color: '#D97706' }} />,
      bg: '#FEF3C7',
      border: '#FDE68A',
    },
    {
      title: 'Pan-India Express Distribution Network',
      desc: 'Air-conditioned Surat Central Depot ensures seamless stock availability with zero backorders.',
      icon: <Network size={24} style={{ color: '#DB2777' }} />,
      bg: '#FDF2F8',
      border: '#FCE7F3',
    },
  ];

  return (
    <section style={{ padding: '76px 0', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
      <div className="container">
        {/* Executive Section Header with Right-Side Trust Scorecard */}
        <div className="zp-home-testimonials-header-row">
          <div>
            <div className="zp-home-testimonials-badge">
              <Sparkles size={13} />
              <span>Why Choose Zeal Pharmacure</span>
            </div>

            <h2 className="zp-home-testimonials-title">
              Delivering Trusted <span className="highlight-gradient">Healthcare Solutions</span>
            </h2>

            <p className="zp-home-testimonials-sub">
              Committed to superior clinical efficacy, verified cGMP stability, and genuine stockists distribution partner protection.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div className="zp-home-testimonials-scorecard">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={18} style={{ color: '#D97706' }} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 900,
                      fontSize: '15px',
                      color: '#0F172A',
                    }}
                  >
                    15+ Years
                  </div>
                  <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 700 }}>
                    Pharma Excellence
                  </div>
                </div>
              </div>
              <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }} />
              <div style={{ fontSize: '11.5px', color: '#475569', fontWeight: 700, lineHeight: 1.3 }}>
                <div>1000+ Partners</div>
                <div style={{ color: '#059669', fontSize: '10.5px' }}>Pan-India Network</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '22px' }}>
          {cards.map((c, idx) => (
            <div
              key={idx}
              className="zp-card-subtle"
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '24px 22px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </div>
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#0F172A',
                    marginBottom: '6px',
                    lineHeight: 1.3,
                  }}
                >
                  {c.title}
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
                    fontSize: '13px',
                    color: '#64748B',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
