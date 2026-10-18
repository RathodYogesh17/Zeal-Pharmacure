import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { ICertificationItem } from '../../types';

export interface HomeCertificationsProps {
  certifications?: ICertificationItem[];
}

export const HomeCertifications: React.FC<HomeCertificationsProps> = ({ certifications }) => {
  if (!certifications || certifications.length === 0) return null;

  return (
    <section style={{ padding: '64px 0 72px', background: '#FAF8FF', borderTop: '1px solid #EDE9FE' }}>
      <div className="container">
        {/* Executive Section Header with Right-Side Quality Scorecard */}
        <div className="zp-home-testimonials-header-row">
          <div>
            <div className="zp-home-testimonials-badge">
              <ShieldCheck size={13} />
              <span>Quality Assurance &amp; Accreditations</span>
            </div>

            <h2 className="zp-home-testimonials-title">
              Manufacturing Standards &amp; <span className="highlight-gradient">Certifications</span>
            </h2>

            <p className="zp-home-testimonials-sub">
              Formulated in state-of-the-art cGMP cleanrooms under strict international quality validation protocols.
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
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: '#059669' }} />
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
                    100% cGMP &amp; ISO
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                    Certified Cleanrooms
                  </div>
                </div>
              </div>
              <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }} />
              <div style={{ fontSize: '11.5px', color: '#475569', fontWeight: 700, lineHeight: 1.3 }}>
                <div>Zero Defect Batch</div>
                <div style={{ color: '#6828DC', fontSize: '10.5px' }}>WHO-GMP Compliant</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '20px' }}>
          {certifications.map((c, idx) => (
            <div
              key={(c as any).id || (c as any)._id || idx}
              className="zp-card-interactive"
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div
                    style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--zp-primary-light, #F5F3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                    <ShieldCheck size={26} style={{ color: 'var(--zp-primary, #6828DC)' }} />
                  </div>
                  <span
                    style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', }}>
                    <CheckCircle2 size={12} />
                    Verified Active
                  </span>
                </div>

                <h4 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  {c.title}
                </h4>

                {((c as any).code || (c as any).certificateNumber) && (
                  <div style={{ fontSize: '11.5px', color: 'var(--zp-primary, #6828DC)', fontWeight: 700, marginBottom: '8px' }}>
                    Code: {(c as any).code || (c as any).certificateNumber}
                  </div>
                )}

                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55 }}>
                  {c.description}
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', fontSize: '11px', color: '#94A3B8', display: 'flex', justifyContent: 'space-between', }}>
                <span>Issuer: <strong style={{ color: '#475569' }}>{c.issuer || 'Accredited Authority'}</strong></span>
                <span>Valid: <strong style={{ color: '#475569' }}>{(c as any).validUntil || 'Current'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
