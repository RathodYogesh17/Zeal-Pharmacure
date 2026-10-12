import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { getMediaUrl } from '../../../utils/mediaUtils';
import './ProductBanners.css';

export interface ProductBottomBannersProps {
  onOpenFranchise: () => void;
}

interface BottomBannerItem {
  tag: string;
  tagStyle: React.CSSProperties;
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
}

const BOTTOM_BANNERS: BottomBannerItem[] = [
  {
    tag: 'PEDIATRIC DIVISION',
    tagStyle: { color: '#059669', background: '#FFFFFF', border: '1px solid #A7F3D0' },
    title: 'Pediatric Healthcare & Infant Therapeutics',
    desc: 'Tested palatable dry syrups, oral drops, and child clinical healthcare range.',
    btnText: 'Enquire Pediatric Range',
    btnBg: '#059669',
    btnShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #E6FFFA 100%)',
    border: '#A7F3D0',
    shadow: '0 4px 16px rgba(5, 150, 105, 0.05)',
    image: '/promos/promo_pediatric.jpg',
    alt: 'Pediatric Care Range',
  },
  {
    tag: 'DERMA CARE',
    tagStyle: { color: '#FFFFFF', background: '#B45309' },
    title: 'Dermatology & Barrier Formulations',
    desc: 'Premium body butters, antifungal creams, and moisturizers.',
    btnText: 'Enquire Derma',
    btnBg: '#B45309',
    btnShadow: '0 2px 8px rgba(180, 83, 9, 0.25)',
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    border: '#FDE68A',
    shadow: '0 4px 16px rgba(245, 158, 11, 0.06)',
    image: '/promos/promo_derma_barrier.jpg',
    alt: 'Dermatology Range',
  },
];

export const ProductBottomBanners: React.FC<ProductBottomBannersProps> = ({ onOpenFranchise }) => {
  const { settings } = useSiteSettings();
  const dynamicBanners = BOTTOM_BANNERS.map((banner, idx) => {
    let customImg = banner.image;
    if (idx === 0) customImg = getMediaUrl((settings as any)?.promoBanners?.productPediatric, banner.image);
    else if (idx === 1) customImg = getMediaUrl((settings as any)?.promoBanners?.productDerma, banner.image);
    return { ...banner, image: customImg };
  });

  return (
    <section className="zp-container" style={{ marginTop: '52px' }}>
      <div className="zp-bottom-banners-grid">
        {dynamicBanners.map((banner, idx) => (
        <div
          key={idx}
          className="zp-bottom-promo-card"
          style={{
            background: banner.bg,
            border: `1.5px solid ${banner.border}`,
            boxShadow: banner.shadow,
          }}
        >
          <div className="zp-bottom-promo-content">
            <span className="zp-bottom-promo-tag" style={banner.tagStyle}>
              {banner.tag}
            </span>
            <h3 className="zp-bottom-promo-title">
              {banner.title}
            </h3>
            <p className="zp-bottom-promo-desc">
              {banner.desc}
            </p>
            <button
              type="button"
              onClick={onOpenFranchise}
              className="zp-bottom-promo-btn"
              style={{
                background: banner.btnBg,
                boxShadow: banner.btnShadow,
              }}
            >
              <span>{banner.btnText}</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="zp-bottom-promo-img-wrap">
            <div className="zp-bottom-promo-glow" />
            <img
              src={banner.image}
              alt={banner.alt}
              className="zp-bottom-promo-img"
            />
          </div>
        </div>
      ))}
    </div>
  </section>
  );
};
