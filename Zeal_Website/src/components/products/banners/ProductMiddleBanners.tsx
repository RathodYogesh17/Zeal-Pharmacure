import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { getMediaUrl } from '../../../utils/mediaUtils';
import './ProductBanners.css';

export interface ProductMiddleBannersProps {
  onOpenFranchise: () => void;
}

interface MiddleBannerItem {
  tag: string;
  tagStyle: React.CSSProperties;
  title: string;
  bg: string;
  border: string;
  shadow: string;
  btnBg: string;
  btnShadow: string;
  image: string;
  alt: string;
}

const BANNERS: MiddleBannerItem[] = [
  {
    tag: 'CHRONIC CARE',
    tagStyle: { color: '#059669', background: '#FFFFFF', border: '1px solid #A7F3D0' },
    title: 'Cardiac & Diabetic Care Range',
    bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    border: '#A7F3D0',
    shadow: '0 4px 16px rgba(5, 150, 105, 0.06)',
    btnBg: '#059669',
    btnShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
    image: '/promos/promo_diabetic.jpg',
    alt: 'Cardiac and Diabetic Care',
  },
  {
    tag: 'DERMA TRICHOLOGY',
    tagStyle: { color: '#FFFFFF', background: '#0284C7' },
    title: 'Biotin & Hair Follicle Care',
    bg: 'linear-gradient(135deg, #F0FDF4 0%, #E0F2FE 100%)',
    border: '#BAE6FD',
    shadow: '0 4px 16px rgba(14, 165, 233, 0.06)',
    btnBg: '#0284C7',
    btnShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
    image: '/promos/promo_hair_biotin.jpg',
    alt: 'Hair Health',
  },
  {
    tag: 'RESPIRATORY LINE',
    tagStyle: { color: 'var(--zp-primary)', background: '#FFFFFF', border: '1px solid #DDD6FE' },
    title: 'Cold, Cough & Balm Formulations',
    bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
    border: '#DDD6FE',
    shadow: '0 4px 16px rgba(104, 40, 220, 0.06)',
    btnBg: 'var(--zp-primary)',
    btnShadow: '0 2px 8px rgba(104, 40, 220, 0.25)',
    image: '/promos/promo_respiratory.jpg',
    alt: 'Respiratory Formulations',
  },
];

export const ProductMiddleBanners: React.FC<ProductMiddleBannersProps> = ({ onOpenFranchise }) => {
  const { settings } = useSiteSettings();
  const dynamicBanners = BANNERS.map((banner, idx) => {
    let customImg = banner.image;
    if (idx === 0) customImg = getMediaUrl((settings as any)?.promoBanners?.productDiabetic, banner.image);
    else if (idx === 1) customImg = getMediaUrl((settings as any)?.promoBanners?.productBiotin, banner.image);
    else if (idx === 2) customImg = getMediaUrl((settings as any)?.promoBanners?.productRespiratory, banner.image);
    return { ...banner, image: customImg };
  });

  return (
    <section className="zp-container" style={{ marginTop: '52px' }}>
      <div className="zp-middle-banners-grid">
        {dynamicBanners.map((banner, idx) => (
        <div
          key={idx}
          className="zp-middle-promo-card"
          style={{
            background: banner.bg,
            border: `1.5px solid ${banner.border}`,
            boxShadow: banner.shadow,
          }}
        >
          <div className="zp-middle-promo-content">
            <span className="zp-middle-promo-tag" style={banner.tagStyle}>
              {banner.tag}
            </span>
            <h3 className="zp-middle-promo-title">
              {banner.title}
            </h3>
            <button
              type="button"
              onClick={onOpenFranchise}
              className="zp-middle-promo-btn"
              style={{
                background: banner.btnBg,
                boxShadow: banner.btnShadow,
              }}
            >
              <span>Enquire Now</span>
              <ArrowRight size={13} />
            </button>
          </div>
          <div className="zp-middle-promo-img-wrap">
            <div className="zp-middle-promo-glow" />
            <img
              src={banner.image}
              alt={banner.alt}
              className="zp-middle-promo-img"
            />
          </div>
        </div>
      ))}
    </div>
  </section>
  );
};
