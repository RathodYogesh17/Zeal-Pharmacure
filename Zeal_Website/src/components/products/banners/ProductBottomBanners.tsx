import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { resolveProductBanners } from '../../../utils/productBannerMatcher';
import type { IProduct } from '../../../types';
import './ProductBanners.css';

export interface ProductBottomBannersProps {
  products?: IProduct[];
  onEnquireProduct?: (p: IProduct) => void;
  onOpenFranchise: () => void;
}

export const ProductBottomBanners: React.FC<ProductBottomBannersProps> = ({
  products = [],
  onEnquireProduct,
  onOpenFranchise,
}) => {
  const { settings } = useSiteSettings();

  const banners = useMemo(() => resolveProductBanners(products, settings), [products, settings]);

  const dynamicBanners = useMemo(() => [
    {
      tag: banners.pediatricDivision.badge,
      tagStyle: { color: '#059669', background: '#FFFFFF', border: '1px solid #A7F3D0' },
      title: banners.pediatricDivision.title,
      desc: banners.pediatricDivision.desc || 'Tested palatable dry syrups, oral drops, and child clinical healthcare range.',
      btnText: 'Enquire Pediatric Range',
      btnBg: '#059669',
      btnShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
      bg: 'linear-gradient(135deg, #ECFDF5 0%, #E6FFFA 100%)',
      border: '#A7F3D0',
      shadow: '0 4px 16px rgba(5, 150, 105, 0.05)',
      image: banners.pediatricDivision.image,
      alt: banners.pediatricDivision.title,
      product: banners.pediatricDivision.product,
    },
    {
      tag: banners.dermaCare.badge,
      tagStyle: { color: '#FFFFFF', background: '#B45309' },
      title: banners.dermaCare.title,
      desc: banners.dermaCare.desc || 'Premium body butters, antifungal creams, and moisturizers.',
      btnText: 'Enquire Derma',
      btnBg: '#B45309',
      btnShadow: '0 2px 8px rgba(180, 83, 9, 0.25)',
      bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
      border: '#FDE68A',
      shadow: '0 4px 16px rgba(245, 158, 11, 0.06)',
      image: banners.dermaCare.image,
      alt: banners.dermaCare.title,
      product: banners.dermaCare.product,
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
                onClick={() => handleBannerAction(banner.product)}
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
