import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import './ContactStyles.css';

export interface ContactFeatureBannersProps {
  onOpenFranchise: () => void;
  onScrollToForm: () => void;
}

interface ContactSeamlessFeatureItem {
  badgeIcon: React.ReactNode;
  badgeText: string;
  badgeColor: string;
  title: string;
  desc: string;
  btnText: string;
  btnBg: string;
  btnShadow: string;
  bg: string;
  border: string;
  shadow: string;
  image: string;
  alt: string;
  action: 'franchise' | 'form';
}

const getSeamlessFeatures = (productCount: number): ContactSeamlessFeatureItem[] => [
  {
    badgeIcon: <Sparkles size={14} style={{ color: '#059669' }} />,
    badgeText: 'STOCKIST PARTNERSHIP MONOPOLY',
    badgeColor: '#059669',
    title: 'Exclusive Territory\nMonopoly Rights',
    desc: 'Secure guaranteed territorial monopoly for your district with direct depot margins, promotional bags, visual aids, and zero intra-brand territory conflict.',
    btnText: 'Apply For Stockist Monopoly',
    btnBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    btnShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #E6FFFA 100%)',
    border: '#A7F3D0',
    shadow: '0 8px 24px rgba(5, 150, 105, 0.08)',
    image: '/banners/card_monopoly_formulations.jpg',
    alt: 'Zeal Pharma Stockist Formulations and Physician Sample Kit',
    action: 'franchise',
  },
  {
    badgeIcon: <ShieldCheck size={14} style={{ color: 'var(--zp-primary)' }} />,
    badgeText: 'WHO-GMP INSTITUTIONAL SUPPLY',
    badgeColor: 'var(--zp-primary)',
    title: 'Institutional Supply &\nContract Formulations',
    desc: `State-of-the-art automated formulation plant with ${productCount}+ DCGI-approved molecules ready for bulk commercial batch production and hospital tenders.`,
    btnText: 'Request Institutional RFQ',
    btnBg: 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
    btnShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)',
    border: '#DDD6FE',
    shadow: '0 8px 24px rgba(104, 40, 220, 0.08)',
    image: '/banners/card_institutional_formulations.jpg',
    alt: 'Hospital Grade Injectable Vials and Clinical Formulations',
    action: 'form',
  },
];

export const ContactFeatureBanners: React.FC<ContactFeatureBannersProps> = ({
  onOpenFranchise,
  onScrollToForm,
}) => {
  const { productCount } = useSiteSettings();
  const SEAMLESS_FEATURES = getSeamlessFeatures(productCount);
  return (
    <section className="container" style={{ marginTop: '48px', marginBottom: '16px' }}>
      <div className="zp-contact-features-grid">
        {SEAMLESS_FEATURES.map((feat, idx) => (
          <div
            key={idx}
            className="zp-contact-seamless-card"
            style={{
              background: feat.bg,
              border: `1.5px solid ${feat.border}`,
              boxShadow: feat.shadow,
            }}
          >
            {/* Left Content (Text, Badges, CTAs) */}
            <div className="zp-contact-seamless-content">
              <span className="zp-contact-seamless-badge" style={{ color: feat.badgeColor }}>
                {feat.badgeIcon}
                <span>{feat.badgeText}</span>
              </span>

              <h3 className="zp-contact-seamless-title" style={{ whiteSpace: 'pre-line' }}>
                {feat.title}
              </h3>

              <p className="zp-contact-seamless-desc">
                {feat.desc}
              </p>

              <button
                type="button"
                onClick={feat.action === 'franchise' ? onOpenFranchise : onScrollToForm}
                className="zp-contact-seamless-btn"
                style={{
                  background: feat.btnBg,
                  boxShadow: feat.btnShadow,
                }}
              >
                <span>{feat.btnText}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Right Side Seamless Bleed Image (Exactly like Product Hero Banner) */}
            <div className="zp-contact-seamless-img-wrap">
              <img
                src={feat.image}
                alt={feat.alt}
                className="zp-contact-seamless-img"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
