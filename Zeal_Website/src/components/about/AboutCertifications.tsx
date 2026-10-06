import React from 'react';
import { FileCheck, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../common';

export const AboutCertifications: React.FC = () => {
  const certificationsList = [
    { title: 'WHO-GMP Sourced', desc: 'All medicines sourced from WHO-GMP certified formulation plants.' },
    { title: 'ISO 9001:2015 Certified', desc: 'Accredited Quality Management for pharma marketing & storage.' },
    { title: '100% DCGI Approved', desc: 'Every therapeutic molecule and combination approved by DCGI & CDSCO.' },
    { title: 'Valid Drug License', desc: 'Licensed under Drug & Cosmetics Act (Form 20B / Form 21B).' },
    { title: 'FSSAI Registered', desc: 'Compliant nutraceutical, herbal & food supplement range.' },
  ];

  return (
    <section style={{ background: '#FFFFFF', padding: '70px 0', borderTop: '1.5px solid #E2E8F0', borderBottom: '1.5px solid #E2E8F0' }}>
      <div className="container">
        <SectionHeader
          badge="Quality Assurances"
          badgeIcon={<ShieldCheck size={13} />}
          title="Certifications & Regulatory Compliance"
          centered={true}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {certificationsList.map((cert, ci) => (
            <div
              key={ci}
              className="zp-card-subtle"
              style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px 20px', border: '1.5px solid #E2E8F0', textAlign: 'center', }}>
              <div
                style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#EDE9FE', color: 'var(--zp-primary, #6828DC)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', }}>
                <FileCheck size={22} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                {cert.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>
                {cert.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
