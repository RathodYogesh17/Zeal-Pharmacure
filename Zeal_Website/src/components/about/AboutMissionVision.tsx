import React from 'react';
import { Target, Eye } from 'lucide-react';
import { SectionHeader } from '../common';

export interface AboutMissionVisionProps {
  mission?: string;
  vision?: string;
}

export const AboutMissionVision: React.FC<AboutMissionVisionProps> = ({ mission, vision }) => {
  return (
    <section style={{ background: '#FFFFFF', padding: '70px 0' }}>
      <div className="container">
        <SectionHeader
          badge="Our Guiding Principles"
          badgeIcon={<Target size={13} />}
          title="Mission & Vision for Ethical Distribution"
          subtitle="Building sustainable prosperity for pharma entrepreneurs while delivering quality therapeutics patients can rely on."
          centered={true}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {/* Mission Card */}
          <div
            className="zp-card-subtle"
            style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%)', borderRadius: '20px', padding: '36px', border: '1.5px solid #DDD6FE', boxShadow: '0 8px 24px rgba(104, 40, 220, 0.04)', }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--zp-primary, #6828DC)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 4px 14px rgba(104, 40, 220, 0.25)', }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              Our Distribution Mission
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
              {mission || 'To market and distribute clinically tested, affordable, and top-quality allopathic and herbal formulations across every Indian district by fostering strong, ethical partnerships with local stockists and medical professionals.'}
            </p>
          </div>

          {/* Vision Card */}
          <div
            className="zp-card-subtle"
            style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)', borderRadius: '20px', padding: '36px', border: '1.5px solid #BBF7D0', boxShadow: '0 8px 24px rgba(5, 150, 105, 0.04)', }}>
            <div
              style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)', }}>
              <Eye size={24} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              Our Stockist Vision
            </h3>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
              {vision || 'To establish Zeal Pharmacure as the most dependable and stockist-centric distribution network across all 28 Indian states, distinguished by transparent business ethics, rapid supply, and monopoly protection.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
