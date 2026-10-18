import React from 'react';
import { Layers, Store, ShieldCheck, Briefcase, Truck, TrendingUp } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SectionHeader } from '../common';

export const AboutTimeline: React.FC = () => {
  const { productCount } = useSiteSettings();
  const timelineMilestones = [
    {
      year: '2010',
      title: 'Foundation in Ahmedabad, Gujarat',
      desc: 'Commenced operations as a dedicated ethical pharmaceutical marketing and stockist distribution firm with 15 core general formulations.',
      badge: 'Inception',
      side: 'left',
      icon: <Store size={20} />,
    },
    {
      year: '2014',
      title: 'WHO-GMP Certified Supply Alliances',
      desc: 'Forged long-term contract manufacturing partnerships with leading WHO-GMP and ISO 9001 accredited production facilities across India.',
      badge: 'Quality Sourcing',
      side: 'right',
      icon: <ShieldCheck size={20} />,
    },
    {
      year: '2018',
      title: 'Pan-India Stockist Monopoly Distribution Rollout',
      desc: 'Launched legal district-wise monopoly stockist model, empowering 150+ pharma stockists and distributors across 12 Indian states.',
      badge: 'Stockist Network',
      side: 'left',
      icon: <Briefcase size={20} />,
    },
    {
      year: '2022',
      title: 'Centralized Barcoded Warehousing',
      desc: 'Commissioned modern temperature-controlled central distribution hub in Gujarat with computerized inventory management and Pan-India distribution network.',
      badge: 'Supply Chain',
      side: 'right',
      icon: <Truck size={20} />,
    },
    {
      year: '2025–2026',
      title: `${productCount}+ Formulations & Central Surat Logistics Hub`,
      desc: `Expanded portfolio to over ${productCount}+ DCGI-approved products across specialized therapeutic divisions, operated from our centralized Surat logistics warehouse depot.`,
      badge: 'Current Era',
      side: 'left',
      icon: <TrendingUp size={20} />,
    },
  ];

  return (
    <section style={{ background: '#FFFFFF', padding: '90px 0', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        <SectionHeader
          badge="Growth Story"
          badgeIcon={<Layers size={13} />}
          title="Milestones of Excellence (2010 – 2026)"
          subtitle="Follow our snake-path journey from a localized Gujarat distributor to a pan-India pharmaceutical network."
          centered={true}
        />

        <div style={{ position: 'relative', marginTop: '48px' }}>
          {/* Center Spine Line */}
          <div style={{ position: 'absolute', left: '50%', top: '40px',  bottom: '40px', width: '4px', background: 'linear-gradient(180deg, var(--zp-primary, #6828DC) 0%, #A855F7 50%, #059669 100%)', transform: 'translateX(-50%)', borderRadius: '999px',}}
            className="hidden md:block"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {timelineMilestones.map((item, idx) => {
              const isLeft = item.side === 'left';
              return (
                <div
                  key={idx}
                  style={{ display: 'flex', alignItems: 'center', position: 'relative', justifyContent: isLeft ? 'flex-start' : 'flex-end',  }}>
                  {/* Center Node Badge */}
                  <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '44px', height: '44px', borderRadius: '50%', background: idx === timelineMilestones.length - 1 ? '#059669' : 'var(--zp-primary, #6828DC)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, zIndex: 5, boxShadow: '0 0 0 6px #FAF5FF, 0 4px 12px rgba(104, 40, 220, 0.3)', }}>
                    {item.icon}
                  </div>

                  {/* Milestone Card */}
                  <div
                    className="zp-card-subtle"
                    style={{
                      width: 'calc(50% - 36px)',
                      background: isLeft
                        ? 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)'
                        : 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
                      borderRadius: '20px',
                      border: isLeft ? '1.5px solid #DDD6FE' : '1.5px solid #BBF7D0',
                      padding: '24px 28px',
                      boxShadow: '0 6px 20px rgba(15, 23, 42, 0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '22px', fontWeight: 900, color: isLeft ? 'var(--zp-primary, #6828DC)' : '#059669', letterSpacing: '-0.5px' }}>
                        {item.year}
                      </span>
                      <span
                        style={{ background: isLeft ? '#EDE9FE' : '#DCFCE7', color: isLeft ? 'var(--zp-primary, #6828DC)' : '#15803D', fontSize: '11px',  fontWeight: 800, padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase', }}>
                        {item.badge}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
