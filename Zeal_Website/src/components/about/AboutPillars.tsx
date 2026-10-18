import React from 'react';
import { CheckCircle2, ShieldCheck, Award, Package, Zap } from 'lucide-react';
import { SectionHeader } from '../common';

export const AboutPillars: React.FC = () => {
  const distributionPillars = [
    {
      title: 'WHO-GMP Certified Sourcing',
      desc: 'We procure all pharmaceutical finished dosage forms exclusively from top-tier, WHO-GMP, ISO, and Schedule M accredited manufacturing units.',
      icon: <ShieldCheck size={26} style={{ color: 'var(--zp-primary, #6828DC)' }} />,
      bg: '#F5F3FF',
      border: '#DDD6FE',
    },
    {
      title: 'Stockists Distribution Exclusivity',
      desc: 'We provide 100% legal territory protection, zero cross-border selling, and protected wholesale rates for all our authorized stockists.',
      icon: <Award size={26} style={{ color: '#059669' }} />,
      bg: '#ECFDF5',
      border: '#A7F3D0',
    },
    {
      title: 'Complete Promotional Material',
      desc: 'Every stockist partner is equipped with free visual aids, MR working bags, product glossaries, catch covers, sample kits, and reminder cards.',
      icon: <Package size={26} style={{ color: '#D97706' }} />,
      bg: '#FFFBEB',
      border: '#FDE68A',
    },
    {
      title: 'Pan-India Distribution Network',
      desc: 'Our expansive inventory buffer and tie-ups with premium logistics carriers ensure seamless Pan-India distribution without stockouts.',
      icon: <Zap size={26} style={{ color: '#DC2626' }} />,
      bg: '#FEF2F2',
      border: '#FECACA',
    },
  ];

  return (
    <section style={{ background: '#F8FAFC', padding: '80px 0' }}>
      <div className="container">
        <SectionHeader
          badge="Ethical Distribution Standards"
          badgeIcon={<CheckCircle2 size={13} />}
          title="The Four Pillars of Zeal Excellence"
          subtitle="How we protect, empower, and deliver value to our stockists, distribution partners, and prescribing doctors."
          centered={true}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {distributionPillars.map((v, idx) => (
            <div
              key={idx}
              className="zp-card-subtle"
              style={{ background: '#FFFFFF', borderRadius: '18px', padding: '28px', border: `1.5px solid ${v.border}`, boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)', }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', }}>
                {v.icon}
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                {v.title}
              </h4>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
