import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { resolveProductBanners } from '../../../utils/productBannerMatcher';
import type { IProduct } from '../../../types';
import './ProductBanners.css';

export interface ProductMiddleBannersProps {
  products?: IProduct[];
  onEnquireProduct?: (p: IProduct) => void;
  onOpenFranchise: () => void;
}

export const ProductMiddleBanners: React.FC<ProductMiddleBannersProps> = ({
  products = [],
  onEnquireProduct,
  onOpenFranchise,
}) => {
  const { settings } = useSiteSettings();

  const banners = useMemo(() => resolveProductBanners(products, settings), [products, settings]);

  const dynamicBanners = useMemo(() => [
    {
      tag: banners.chronicCare.badge,
      tagStyle: { color: '#059669', background: '#FFFFFF', border: '1px solid #A7F3D0' },
      title: banners.chronicCare.title,
      bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      border: '#A7F3D0',
      shadow: '0 4px 16px rgba(5, 150, 105, 0.06)',
      btnBg: '#059669',
      btnShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
      image: banners.chronicCare.image,
      alt: banners.chronicCare.title,
      product: banners.chronicCare.product,
    },
    {
      tag: banners.dermaTrichology.badge,
      tagStyle: { color: '#FFFFFF', background: '#0284C7' },
      title: banners.dermaTrichology.title,
      bg: 'linear-gradient(135deg, #F0FDF4 0%, #E0F2FE 100%)',
      border: '#BAE6FD',
      shadow: '0 4px 16px rgba(14, 165, 233, 0.06)',
      btnBg: '#0284C7',
      btnShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
      image: banners.dermaTrichology.image,
      alt: banners.dermaTrichology.title,
      product: banners.dermaTrichology.product,
    },
    {
      tag: banners.respiratoryLine.badge,
      tagStyle: { color: 'var(--zp-primary)', background: '#FFFFFF', border: '1px solid #DDD6FE' },
      title: banners.respiratoryLine.title,
      bg: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
      border: '#DDD6FE',
      shadow: '0 4px 16px rgba(124, 58, 237, 0.06)',
      btnBg: 'var(--zp-primary)',
      btnShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
      image: banners.respiratoryLine.image,
      alt: banners.respiratoryLine.title,
      product: banners.respiratoryLine.product,
    },
  ], [banners]);

  const handleBannerAction = (product: IProduct | null) => {
    if (product && onEnquireProduct) {
      onEnquireProduct(product);
    } else {
      onOpenFranchise();
    }
  };

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
                onClick={() => handleBannerAction(banner.product)}
                className="zp-middle-promo-btn"
                style={{
                  background: banner.btnBg,
                  boxShadow: banner.btnShadow,
                }}
              >
                <span>Apply for Stockists / Distribution</span>
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
