import React from 'react';
import { Quote, Award } from 'lucide-react';

export interface AboutLeadershipProps {
  directorMessage?: string;
  directorName?: string;
  directorTitle?: string;
}

export const AboutLeadership: React.FC<AboutLeadershipProps> = ({ directorMessage, directorName, directorTitle,}) => {
  return (
    <section style={{ background: '#FAF5FF', padding: '80px 0' }}>
      <div className="container">
        <div
          style={{ background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #DDD6FE', padding: 'clamp(28px, 5vw, 44px)', boxShadow: '0 16px 40px rgba(104, 40, 220, 0.08)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center', }}>
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 800, color: 'var(--zp-primary, #6828DC)', background: 'var(--zp-primary-light, #F5F3FF)', padding: '4px 12px',  borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.06em',  fontFamily: 'var(--font-heading, "Outfit", sans-serif)', }}>
                <Quote size={13} />
                <span>Leadership Perspective</span>
              </span>
            </div>

            <h3
              style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 900, color: '#0F172A', marginBottom: '16px', lineHeight: 1.25, fontFamily: 'var(--font-heading, "Outfit", sans-serif)', }}>
              A Message from the Directorate
            </h3>

            <div style={{ position: 'relative', paddingLeft: '18px', borderLeft: '3px solid #8B5CF6', marginBottom: '22px' }}>
              {directorMessage ? (
                <div
                  style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.75, fontStyle: 'italic' }}
                  dangerouslySetInnerHTML={{ __html: directorMessage }}
                />
              ) : (
                <p style={{ fontSize: '15.5px', color: '#334155', lineHeight: 1.75, fontStyle: 'italic', margin: 0 }}>
                  &ldquo;Our commitment is simple: empowering ambitious pharma distributors with monopoly-backed quality medicines and rapid delivery from our central Surat hub so that doctor trust and patient health always remain uncompromised.&rdquo;
                </p>
              )}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                {directorName || 'Board of Executive Directors'}
              </div>
              <div style={{ fontSize: '13.5px', color: 'var(--zp-primary, #6828DC)', fontWeight: 700, marginTop: '2px' }}>
                {directorTitle || 'Managing Directorate, Zeal Pharmacure'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                WHO-GMP Sourced Formulations &bull; Surat Central Logistics Depot
              </div>
            </div>
          </div>

          {/* Right Image Card: Indian Pharma Directorate & Stockist Meeting */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.08)', border: '3px solid #FFFFFF', background: '#FFFFFF' }}>
              <img
                src="/banners/banner_franchise_meeting.jpg"
                alt="Zeal Pharmacure Executive Directorate & Stockist Franchise Strategy Meeting"
                style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div
              style={{ marginTop: '14px', background: '#FFFFFF', borderRadius: '12px', padding: '12px 16px', border: '1px solid #E9D5FF', display: 'flex', alignItems: 'center', gap: '10px', }}>
              <Award size={18} style={{ color: 'var(--zp-primary, #6828DC)', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#4C1D95', fontWeight: 700 }}>
                Empowering exclusive stockist partners across all Indian territories with zero-defect formulations.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
