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
      tagStyle: banners.chronicCare.theme.tagStyle,
      title: banners.chronicCare.title,
      bg: banners.chronicCare.theme.bg,
      border: banners.chronicCare.theme.border,
      shadow: banners.chronicCare.theme.shadow,
      btnBg: banners.chronicCare.theme.btnBg,
      btnShadow: banners.chronicCare.theme.btnShadow,
      image: banners.chronicCare.image,
      alt: banners.chronicCare.title,
      product: banners.chronicCare.product,
    },
    {
      tag: banners.dermaTrichology.badge,
      tagStyle: banners.dermaTrichology.theme.tagStyle,
      title: banners.dermaTrichology.title,
      bg: banners.dermaTrichology.theme.bg,
      border: banners.dermaTrichology.theme.border,
      shadow: banners.dermaTrichology.theme.shadow,
      btnBg: banners.dermaTrichology.theme.btnBg,
      btnShadow: banners.dermaTrichology.theme.btnShadow,
      image: banners.dermaTrichology.image,
      alt: banners.dermaTrichology.title,
      product: banners.dermaTrichology.product,
    },
    {
      tag: banners.respiratoryLine.badge,
      tagStyle: banners.respiratoryLine.theme.tagStyle,
      title: banners.respiratoryLine.title,
      bg: banners.respiratoryLine.theme.bg,
      border: banners.respiratoryLine.theme.border,
      shadow: banners.respiratoryLine.theme.shadow,
      btnBg: banners.respiratoryLine.theme.btnBg,
      btnShadow: banners.respiratoryLine.theme.btnShadow,
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
              transition: 'background 0.35s ease, border-color 0.35s ease',
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
