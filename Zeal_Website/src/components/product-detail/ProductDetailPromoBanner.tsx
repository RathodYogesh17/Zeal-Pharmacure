import React from 'react';
import { Award, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { getMediaUrl } from '../../utils/mediaUtils';

interface ProductDetailPromoBannerProps {
  onClaimMonopoly: () => void;
  categoryName?: string;
}

export const ProductDetailPromoBanner: React.FC<ProductDetailPromoBannerProps> = ({
  onClaimMonopoly,
  categoryName = 'Therapeutic',
}) => {
  const { settings } = useSiteSettings();
  const bannerImg = getMediaUrl((settings as any)?.promoBanners?.cardMonopoly, '/banners/card_monopoly_formulations.jpg');
  return (
    <div
      className="zp-product-promo-banner"
      style={{
        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        border: '1.5px solid #A7F3D0',
        position: 'relative',
        boxShadow: '0 10px 30px -8px rgba(5, 150, 105, 0.12)',
        margin: '32px 0',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '620px' }}>
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div
            style={{
              background: '#059669',
              color: '#FFFFFF',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            }}
          >
            <Award size={14} />
            <span>EXCLUSIVE TERRITORY MONOPOLY RIGHTS</span>
          </div>

          <span
            style={{
              background: '#FFFFFF',
              border: '1px solid #A7F3D0',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#065F46',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            }}
          >
            High Margin {categoryName} Range
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            fontSize: 'clamp(22px, 3vw, 30px)',
            fontWeight: 900,
            color: '#064E3B',
            lineHeight: 1.2,
            letterSpacing: '-0.5px',
            marginBottom: '10px',
          }}
        >
          Secure Exclusive Distribution Rights for Your District
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
            fontSize: '14px',
            color: '#047857',
            lineHeight: 1.6,
            marginBottom: '20px',
          }}
        >
          Partner directly with Zeal Pharmacure. Enjoy 100% territorial price protection, zero internal competition, full promotional visual aids, and guaranteed 24-48h dispatch from our Surat Central Depot.
        </p>

        {/* Key Feature Checks */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#065F46' }}>
            <CheckCircle2 size={15} style={{ color: '#059669' }} />
            <span>Zero Competitor Guarantee</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#065F46' }}>
            <CheckCircle2 size={15} style={{ color: '#059669' }} />
            <span>Direct Manufacturer B2B Pricing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#065F46' }}>
            <ShieldCheck size={15} style={{ color: '#059669' }} />
            <span>WHO-GMP &amp; DCGI Approved</span>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <button
            type="button"
            onClick={onClaimMonopoly}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 26px',
              borderRadius: '999px',
              background: '#059669',
              color: '#FFFFFF',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              fontSize: '14px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(5, 150, 105, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Apply for Monopoly Territory</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Right Side Formulation Image with Mask */}
      <div
        className="zp-product-promo-banner-bg-img"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '45%',
          zIndex: 1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <img
          src={bannerImg}
          alt="Zeal Pharma Monopoly Formulations"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 12%, rgba(0,0,0,0.8) 40%, #000000 70%)',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.1) 12%, rgba(0,0,0,0.8) 40%, #000000 70%)',
          }}
        />
      </div>
    </div>
  );
};
