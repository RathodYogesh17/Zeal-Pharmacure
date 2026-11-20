import React, { useState, useMemo } from 'react';
import { Sparkles, Send, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { getMediaUrl } from '../../../utils/mediaUtils';
import { resolveProductBanners, THEME_PALETTES } from '../../../utils/productBannerMatcher';
import type { IProduct } from '../../../types';
import './ProductBanners.css';

export interface ProductHeroBannersProps {
  products: IProduct[];
  onEnquireProduct: (p: IProduct) => void;
  onOpenFranchise: () => void;
  onScrollToCatalog: () => void;
}

export const ProductHeroBanners: React.FC<ProductHeroBannersProps> = ({
  products,
  onEnquireProduct,
  onOpenFranchise,
  onScrollToCatalog,
}) => {
  const { settings } = useSiteSettings();
  const [activeBannerDot, setActiveBannerDot] = useState(0);

  // Dynamic banner resolution with product-matched color themes
  const banners = useMemo(() => resolveProductBanners(products, settings), [products, settings]);

  const dynamicHeroSlides = useMemo(() => [
    {
      badge: banners.multivitamin.badge,
      title: banners.multivitamin.title,
      subtitle: banners.multivitamin.subtitle || 'High-Bioavailability Formulations Ready for Authorized Stockists Distribution.',
      image: banners.multivitamin.image,
      product: banners.multivitamin.product,
      theme: banners.multivitamin.theme,
    },
    {
      badge: 'PREMIUM EXTRACTION THERAPEUTICS',
      title: 'Herbal Wellness &\nImmunity Boosters',
      subtitle: 'Certified Active Formulations with Exclusive Territorial Distribution Protection.',
      image: getMediaUrl((settings as any)?.promoBanners?.productHeroSlide2 || (settings as any)?.promoBanners?.productWellness, '/promos/promo_wellness.jpg'),
      product: banners.nutraceuticals.product,
      theme: banners.nutraceuticals.theme || THEME_PALETTES.pink,
    },
  ], [banners, settings]);

  const dynamicPromoCards = useMemo(() => [
    {
      tag: banners.gynecology.badge,
      tagStyle: {
        ...banners.gynecology.theme.tagStyle,
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '9.5px',
        fontWeight: 900,
      },
      bg: banners.gynecology.theme.bg,
      border: banners.gynecology.theme.border,
      title: banners.gynecology.title,
      image: banners.gynecology.image,
      alt: banners.gynecology.title,
      product: banners.gynecology.product,
      btnColor: banners.gynecology.theme.accentColor,
    },
    {
      tag: banners.nutraceuticals.badge,
      tagStyle: {
        ...banners.nutraceuticals.theme.tagStyle,
        padding: '3px 8px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: 900,
      },
      bg: banners.nutraceuticals.theme.bg,
      border: banners.nutraceuticals.theme.border,
      title: banners.nutraceuticals.title,
      image: banners.nutraceuticals.image,
      alt: banners.nutraceuticals.title,
      product: banners.nutraceuticals.product,
      btnColor: banners.nutraceuticals.theme.accentColor,
    },
  ], [banners]);

  const rackBgImg = getMediaUrl((settings as any)?.promoBanners?.warehouseRack, '/banners/stockist_warehouse_rack.jpg');
  const currentSlide = dynamicHeroSlides[activeBannerDot] || dynamicHeroSlides[0];

  const handleEnquireSlide = () => {
    if (currentSlide.product) {
      onEnquireProduct(currentSlide.product);
    } else {
      onOpenFranchise();
    }
  };

  const handleEnquireCard = (p: IProduct | null) => {
    if (p) {
      onEnquireProduct(p);
    } else {
      onOpenFranchise();
    }
  };

  return (
    <section className="zp-container" style={{ paddingTop: '24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px',
        alignItems: 'stretch',
      }}>

        {/* LEFT LARGE HERO BANNER (Matched to Product Palette) */}
        <div style={{
          background: currentSlide.theme?.bg || 'linear-gradient(135deg, #F8FAFC 0%, #EDE9FE 100%)',
          borderRadius: '24px',
          border: `1.5px solid ${currentSlide.theme?.border || 'var(--zp-primary-border)'}`,
          padding: '40px 36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '380px',
          boxShadow: currentSlide.theme?.shadow || '0 8px 30px rgba(124, 58, 237, 0.06)',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}>
          <div style={{ zIndex: 2, maxWidth: '380px', position: 'relative' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 900,
              color: currentSlide.theme?.accentColor || 'var(--zp-primary)',
              letterSpacing: '1.2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '999px',
              marginBottom: '12px',
              border: `1px solid ${currentSlide.theme?.border || 'var(--zp-primary-border)'}`,
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            }}>
              <Sparkles size={12} color={currentSlide.theme?.accentColor || 'var(--zp-primary)'} />
              {currentSlide.badge}
            </span>

            <h2 style={{
              fontSize: 'clamp(28px, 3.4vw, 42px)',
              fontWeight: 900,
              color: 'var(--zp-text-dark)',
              lineHeight: 1.15,
              letterSpacing: '-0.8px',
              marginBottom: '10px',
              whiteSpace: 'pre-line',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            }}>
              {currentSlide.title}
            </h2>

            <p style={{
              fontSize: '14.5px',
              color: '#475569',
              fontWeight: 600,
              lineHeight: 1.5,
              marginBottom: '26px',
            }}>
              {currentSlide.subtitle}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleEnquireSlide}
                className="zp-btn-primary"
                style={{
                  padding: '12px 26px',
                  borderRadius: '999px',
                  fontSize: '13.5px',
                  background: currentSlide.theme?.btnBg || undefined,
                  boxShadow: currentSlide.theme?.btnShadow || undefined,
                }}
              >
                <Send size={14} />
                <span>Enquire For Stockists</span>
              </button>

              <button
                type="button"
                onClick={onScrollToCatalog}
                className="zp-btn-pill-outline"
                style={{
                  padding: '12px 24px',
                  fontSize: '13.5px',
                  borderRadius: '999px',
                  borderColor: currentSlide.theme?.border || '#E2E8F0',
                  color: '#0F172A',
                  background: '#FFFFFF',
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                }}
              >
                View Formulations
              </button>
            </div>
          </div>

          {/* Large Image on Right - Seamless Full-Height Studio Showcase */}
          <div className="zp-hero-image-stage">
            <div
              className="zp-hero-image-fade-overlay"
              style={{
                background: `linear-gradient(to right, ${currentSlide.theme?.bgFade || '#F0FDF4'} 0%, rgba(240, 253, 244, 0.45) 45%, transparent 100%)`,
              }}
            />
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="zp-hero-image"
            />
          </div>

          {/* Slider Dots */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '20px', zIndex: 2 }}>
            {dynamicHeroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveBannerDot(idx)}
                style={{
                  width: activeBannerDot === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: activeBannerDot === idx
                    ? (currentSlide.theme?.accentColor || 'var(--zp-primary)')
                    : '#CBD5E1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: TOP BANNER + BOTTOM 2 CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Top Card: Stockists / Distribution Supply Chain */}
          <div style={{
            backgroundImage: `linear-gradient(90deg, rgba(245, 243, 255, 0.96) 0%, rgba(245, 243, 255, 0.88) 45%, rgba(245, 243, 255, 0.15) 75%, transparent 100%), url('${rackBgImg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            borderRadius: '20px',
            border: '1.5px solid var(--zp-primary-border)',
            padding: '26px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '190px',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.05)',
          }}>
            <div style={{ zIndex: 2, maxWidth: '340px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 900,
                color: 'var(--zp-primary)',
                display: 'inline-block',
                background: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: '6px',
                marginBottom: '8px',
                border: '1px solid #E9D5FF',
                letterSpacing: '0.5px',
              }}>
                STOCKISTS DISTRIBUTION
              </span>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 900,
                color: 'var(--zp-text-dark)',
                lineHeight: 1.25,
                marginBottom: '8px',
                letterSpacing: '-0.2px',
              }}>
                Pan-India Pharmaceutical Supply Chain
              </h3>
              <p style={{
                fontSize: '12.5px',
                color: '#64748B',
                margin: '0 0 14px',
                lineHeight: 1.4,
                fontWeight: 500,
              }}>
                Exclusive territorial Stockists Distribution network with promotional support.
              </p>
              <button
                type="button"
                onClick={onOpenFranchise}
                className="zp-btn-emerald"
              >
                <Send size={12} />
                <span>Apply for Stockists / Distribution</span>
              </button>
            </div>
          </div>

          {/* Bottom Split 2 Cards (Calcizeal-D3 Sachet & Foot Cure Cream with Product-Matched Themes) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {dynamicPromoCards.map((card, idx) => (
              <div
                key={idx}
                style={{
                  background: card.bg,
                  borderRadius: '18px',
                  border: `1.5px solid ${card.border}`,
                  padding: '18px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '140px',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                }}
              >
                <div style={{ zIndex: 2, flex: 1, minWidth: 0, paddingRight: '4px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      marginBottom: '6px',
                      ...card.tagStyle,
                    }}
                  >
                    {card.tag}
                  </span>
                  <h4 style={{
                    fontSize: '13.5px',
                    fontWeight: 900,
                    color: 'var(--zp-text-dark)',
                    lineHeight: 1.25,
                    marginBottom: '8px',
                    letterSpacing: '-0.2px',
                    wordBreak: 'break-word',
                  }}>
                    {card.title}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleEnquireCard(card.product)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: card.btnColor || 'var(--zp-primary)',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    <span>Enquire Now</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
                <div style={{
                  width: '94px',
                  height: '94px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                  <img
                    src={card.image}
                    alt={card.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
