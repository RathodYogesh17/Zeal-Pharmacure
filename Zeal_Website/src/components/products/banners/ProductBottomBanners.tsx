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
      tagStyle: banners.pediatricDivision.theme.tagStyle,
      title: banners.pediatricDivision.title,
      desc: banners.pediatricDivision.desc || 'Tested palatable dry syrups, oral drops, and child clinical healthcare range.',
      btnText: banners.pediatricDivision.product?.name?.toUpperCase().includes('ACLOZ')
        ? 'Enquire Formulation'
        : 'Enquire Pediatric Range',
      btnBg: banners.pediatricDivision.theme.btnBg,
      btnShadow: banners.pediatricDivision.theme.btnShadow,
      bg: banners.pediatricDivision.theme.bg,
      border: banners.pediatricDivision.theme.border,
      shadow: banners.pediatricDivision.theme.shadow,
      image: banners.pediatricDivision.image,
      alt: banners.pediatricDivision.title,
      product: banners.pediatricDivision.product,
    },
    {
      tag: banners.dermaCare.badge,
      tagStyle: banners.dermaCare.theme.tagStyle,
      title: banners.dermaCare.title,
      desc: banners.dermaCare.desc || 'Premium body butters, antifungal creams, and moisturizers.',
      btnText: 'Enquire Derma',
      btnBg: banners.dermaCare.theme.btnBg,
      btnShadow: banners.dermaCare.theme.btnShadow,
      bg: banners.dermaCare.theme.bg,
      border: banners.dermaCare.theme.border,
      shadow: banners.dermaCare.theme.shadow,
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
              transition: 'background 0.35s ease, border-color 0.35s ease',
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
