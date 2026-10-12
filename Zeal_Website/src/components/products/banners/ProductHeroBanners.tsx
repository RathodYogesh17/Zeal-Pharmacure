import React, { useState } from 'react';
import { Sparkles, Send, ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { getMediaUrl } from '../../../utils/mediaUtils';
import type { IProduct } from '../../../types';

export interface ProductHeroBannersProps {
  products: IProduct[];
  onEnquireProduct: (p: IProduct) => void;
  onOpenFranchise: () => void;
  onScrollToCatalog: () => void;
}

const PROMO_CARDS = [
  {
    tag: 'GYNECOLOGY',
    tagStyle: { background: '#854D0E', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontSize: '9.5px' },
    bg: '#FEF9C3',
    border: '#FEF08A',
    title: "Women's Health Formulations",
    image: '/promos/promo_gummies.jpg',
    alt: 'Women Health',
    productIndex: 2,
  },
  {
    tag: 'NUTRACEUTICALS',
    tagStyle: { color: 'var(--zp-primary)', fontSize: '10px' },
    bg: '#F5F3FF',
    border: 'var(--zp-primary-border)',
    title: 'Premium Wellness Extracts',
    image: '/promos/promo_wellness.jpg',
    alt: 'Premium Wellness',
    productIndex: 3,
  },
];

const HERO_SLIDES = [
  {
    badge: 'DCGI & WHO-GMP APPROVED',
    title: 'Multivitamin &\nWellness Range',
    subtitle: 'High-Bioavailability Formulations Ready for Authorized Stockists Distribution.',
    image: '/promos/promo_multivitamin.jpg',
    productIndex: 0,
  },
  {
    badge: 'PREMIUM EXTRACTION THERAPEUTICS',
    title: 'Herbal Wellness &\nImmunity Boosters',
    subtitle: 'Certified Active Formulations with Exclusive Territorial Distribution Protection.',
    image: '/promos/promo_wellness.jpg',
    productIndex: 1,
  },
];

export const ProductHeroBanners: React.FC<ProductHeroBannersProps> = ({
  products,
  onEnquireProduct,
  onOpenFranchise,
  onScrollToCatalog,
}) => {
  const { settings } = useSiteSettings();
  const [activeBannerDot, setActiveBannerDot] = useState(0);

  const dynamicPromoCards = PROMO_CARDS.map((card, idx) => ({
    ...card,
    image: idx === 0
      ? getMediaUrl((settings as any)?.promoBanners?.productGummies, card.image)
      : getMediaUrl((settings as any)?.promoBanners?.productWellness, card.image),
  }));

  const dynamicHeroSlides = HERO_SLIDES.map((slide, idx) => ({
    ...slide,
    image: idx === 0
      ? getMediaUrl((settings as any)?.promoBanners?.productHeroSlide1 || (settings as any)?.promoBanners?.productMultivitamin, slide.image)
      : getMediaUrl((settings as any)?.promoBanners?.productHeroSlide2 || (settings as any)?.promoBanners?.productWellness, slide.image),
  }));

  const rackBgImg = getMediaUrl((settings as any)?.promoBanners?.warehouseRack, '/banners/stockist_warehouse_rack.jpg');
  const currentSlide = dynamicHeroSlides[activeBannerDot] || dynamicHeroSlides[0];

  const handleEnquire = (idx: number) => {
    if (products.length > idx) {
      onEnquireProduct(products[idx]);
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

        {/* LEFT LARGE HERO BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EDE9FE 100%)',
          borderRadius: '24px',
          border: '1.5px solid var(--zp-primary-border)',
          padding: '40px 36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '380px',
          boxShadow: '0 8px 30px rgba(104, 40, 220, 0.06)',
        }}>
          <div style={{ zIndex: 2, maxWidth: '380px', position: 'relative' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 900,
              color: 'var(--zp-primary)',
              letterSpacing: '1.2px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '999px',
              marginBottom: '12px',
              border: '1px solid var(--zp-primary-border)',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            }}>
              <Sparkles size={12} color="var(--zp-primary)" />
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
                onClick={() => handleEnquire(currentSlide.productIndex)}
                className="zp-btn-primary"
                style={{ padding: '12px 26px', borderRadius: '999px', fontSize: '13.5px' }}
              >
                <Send size={14} />
                <span>Enquire For Stockists</span>
              </button>

              <button
                type="button"
                onClick={onScrollToCatalog}
                className="zp-btn-pill-outline"
                style={{ padding: '12px 22px', fontSize: '13.5px' }}
              >
                View Formulations
              </button>
            </div>
          </div>

          {/* Large Image on Right - Seamless Full-Height with Soft Gradient Mask */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '56%',
            zIndex: 1,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}>
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              key={currentSlide.image}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 35%',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.08) 8%, rgba(0, 0, 0, 0.6) 24%, #000000 45%)',
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.08) 8%, rgba(0, 0, 0, 0.6) 24%, #000000 45%)',
              }}
            />
            {/* Ambient tone gradient overlay to blend into card */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, rgba(248, 250, 252, 0.95) 0%, rgba(237, 233, 254, 0.4) 25%, rgba(237, 233, 254, 0) 60%)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Carousel Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '30px', zIndex: 2, position: 'relative' }}>
            {HERO_SLIDES.map((_, dot) => (
              <span
                key={dot}
                onClick={() => setActiveBannerDot(dot)}
                style={{
                  width: activeBannerDot === dot ? '22px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: activeBannerDot === dot ? 'var(--zp-primary)' : '#CBD5E1',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: TOP BANNER + BOTTOM 2 CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Top Card: PCD Supply Chain */}
          <div style={{
            backgroundImage: `linear-gradient(90deg, rgba(245, 243, 255, 0.97) 0%, rgba(245, 243, 255, 0.92) 52%, rgba(245, 243, 255, 0.55) 78%, rgba(245, 243, 255, 0.15) 100%), url('${rackBgImg}')`,
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
            boxShadow: '0 4px 16px rgba(104, 40, 220, 0.05)',
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
                <span>Apply for Stockists Distribution</span>
              </button>
            </div>
          </div>

          {/* Bottom Split 2 Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {dynamicPromoCards.map((card, idx) => (
              <div
                key={idx}
                style={{
                  background: card.bg,
                  borderRadius: '18px',
                  border: `1.2px solid ${card.border}`,
                  padding: '20px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '140px',
                }}
              >
                <div style={{ zIndex: 2, maxWidth: '140px' }}>
                  <span
                    style={{
                      fontWeight: 900,
                      display: 'inline-block',
                      marginBottom: '6px',
                      ...card.tagStyle,
                    }}
                  >
                    {card.tag}
                  </span>
                  <h4 style={{
                    fontSize: '14.5px',
                    fontWeight: 900,
                    color: 'var(--zp-text-dark)',
                    lineHeight: 1.25,
                    marginBottom: '8px',
                  }}>
                    {card.title}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleEnquire(card.productIndex)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--zp-primary)',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <span>Enquire Now</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
                <div style={{ width: '95px', height: '95px', flexShrink: 0 }}>
                  <img
                    src={card.image}
                    alt={card.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
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
