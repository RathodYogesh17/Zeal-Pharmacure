import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  Clock,
  MessageCircle,
  Play,
  Layers,
  Award
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { getMediaUrl } from '../../utils/mediaUtils';
import './HomeStyles.css';

export interface HeroSlideItem {
  title?: string;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
}

export interface HomeHeroSliderProps {
  slides?: HeroSlideItem[];
  onOpenFranchiseModal: () => void;
  onOpenStoryModal: () => void;
}

interface HomeSlideConfig {
  id: number;
  theme: string;
  badgeText: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  bgGradient: string;
  glow1: string;
  glow2: string;
  highlightGradient: string;
  highlightWord: string;
  titlePrefix: string;
  titleSuffix: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  btnGradient: string;
  btnShadow: string;
  dotColor: string;
  image: string;
  imageAlt: string;
  cardBorder: string;
  cardGlow: string;
  statusDot: string;
  statusText: string;
  bottomBarTitle: string;
  bottomBarSub: string;
  floatTopIcon: React.ReactNode;
  floatTopTitle: string;
  floatTopSub: string;
  floatTopBorder: string;
  floatBottomIcon: React.ReactNode;
  floatBottomTitle: string;
  floatBottomSub: string;
  floatBottomBorder: string;
}

const getHomeHeroSlides = (productCount: number): HomeSlideConfig[] => [
  {
    id: 0,
    theme: 'violet',
    badgeText: 'WHO-GMP & DCGI COMPLIANT BULK DISTRIBUTION',
    badgeColor: '#DDD6FE',
    badgeBg: 'rgba(30, 27, 75, 0.72)',
    badgeBorder: 'rgba(139, 92, 246, 0.45)',
    bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 45%, #2E1065 80%, #3B0764 100%)',
    glow1: 'rgba(104, 40, 220, 0.35)',
    glow2: 'rgba(139, 92, 246, 0.25)',
    highlightGradient: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 50%, #A78BFA 100%)',
    highlightWord: 'Trusted Pharma Network',
    titlePrefix: "Partner with India's Most ",
    titleSuffix: ' Across India',
    subtitle: `Procure ${productCount}+ DCGI-approved formulations directly from accredited manufacturing lines with guaranteed monopoly territorial rights, zero market competition, and transparent wholesale pricing.`,
    ctaText: 'Apply for Stockists / Distribution',
    ctaLink: '/contact',
    btnGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6828DC 100%)',
    btnShadow: '0 8px 24px -4px rgba(104, 40, 220, 0.65)',
    dotColor: '#A78BFA',
    image: '/banners/home_animated_world.jpg',
    imageAlt: 'Zeal Pharmacure Healthcare World & Global Stockist Network',
    cardBorder: 'rgba(139, 92, 246, 0.4)',
    cardGlow: 'rgba(104, 40, 220, 0.25)',
    statusDot: '#A78BFA',
    statusText: 'Global Supply Network: Active Dispatching',
    bottomBarTitle: 'Zeal Pharmacure Healthcare World',
    bottomBarSub: 'WHO-GMP & ISO 9001:2015 Certified Hub',
    floatTopIcon: <Award size={18} style={{ color: '#8B5CF6' }} />,
    floatTopTitle: 'Monopoly Rights',
    floatTopSub: 'Zero Territory Conflict',
    floatTopBorder: '#DDD6FE',
    floatBottomIcon: <ShieldCheck size={18} style={{ color: '#8B5CF6' }} />,
    floatBottomTitle: `${productCount}+ Ready Formulations`,
    floatBottomSub: '100% DCGI Approved Batch Stock',
    floatBottomBorder: '#DDD6FE',
  },
  {
    id: 1,
    theme: 'cyan',
    badgeText: 'AIR-CONDITIONED SURAT CENTRAL DEPOT',
    badgeColor: '#BAE6FD',
    badgeBg: 'rgba(12, 74, 110, 0.72)',
    badgeBorder: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'linear-gradient(135deg, #082F49 0%, #0C4A6E 40%, #075985 75%, #0284C7 100%)',
    glow1: 'rgba(2, 132, 199, 0.35)',
    glow2: 'rgba(56, 189, 248, 0.25)',
    highlightGradient: 'linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 50%, #38BDF8 100%)',
    highlightWord: '24-48h Rapid Dispatch',
    titlePrefix: 'Ready Wholesale Stock & ',
    titleSuffix: ' Pan-India',
    subtitle: `State-of-the-art Surat Central Logistics Depot with ${productCount}+ formulations under strict temperature-controlled storage, computerized batch tracking, and guaranteed zero stockout fulfillment.`,
    ctaText: 'Explore Catalog Formulations',
    ctaLink: '/products',
    btnGradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    btnShadow: '0 8px 24px -4px rgba(2, 132, 199, 0.65)',
    dotColor: '#38BDF8',
    image: '/banners/home_animated_depot.jpg',
    imageAlt: 'Zeal Pharmacure Wholesale Stockist Supply & Rapid Dispatch Depot',
    cardBorder: 'rgba(56, 189, 248, 0.4)',
    cardGlow: 'rgba(2, 132, 199, 0.25)',
    statusDot: '#38BDF8',
    statusText: 'Surat Central Depot: Active Dispatch',
    bottomBarTitle: 'Surat Central Logistics Depot',
    bottomBarSub: '7015, BTM Market • 24-48h Dispatch',
    floatTopIcon: <Building2 size={18} style={{ color: '#0284C7' }} />,
    floatTopTitle: 'Surat Central Depot',
    floatTopSub: '7015, BTM Textile Market',
    floatTopBorder: '#BAE6FD',
    floatBottomIcon: <Clock size={18} style={{ color: '#0284C7' }} />,
    floatBottomTitle: '24-48h Pan-India Dispatch',
    floatBottomSub: 'Computerized Inventory Stock',
    floatBottomBorder: '#BAE6FD',
  },
  {
    id: 2,
    theme: 'emerald',
    badgeText: 'COMPREHENSIVE B2B MARKETING SUPPORT',
    badgeColor: '#A7F3D0',
    badgeBg: 'rgba(6, 78, 59, 0.72)',
    badgeBorder: 'rgba(52, 211, 153, 0.45)',
    bgGradient: 'linear-gradient(135deg, #022C22 0%, #064E3B 40%, #065F46 75%, #047857 100%)',
    glow1: 'rgba(16, 185, 129, 0.35)',
    glow2: 'rgba(52, 211, 153, 0.22)',
    highlightGradient: 'linear-gradient(135deg, #A7F3D0 0%, #6EE7B7 50%, #34D399 100%)',
    highlightWord: '100% Free Promotional Tools',
    titlePrefix: 'Accelerate Growth with ',
    titleSuffix: ' & Visual Aids',
    subtitle: 'Accelerate medical practitioner adoption with customized MR bags, doctor catch covers, visual aids, scientific product glossaries, and physician sample kits provided at zero cost.',
    ctaText: 'Apply for Stockists / Distribution',
    ctaLink: '/contact',
    btnGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    btnShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.65)',
    dotColor: '#34D399',
    image: '/banners/home_animated_marketing.jpg',
    imageAlt: 'Zeal Pharmacure Stockists / Distribution Promotional Toolkit & Visual Aids',
    cardBorder: 'rgba(52, 211, 153, 0.4)',
    cardGlow: 'rgba(16, 185, 129, 0.25)',
    statusDot: '#10B981',
    statusText: 'Stockist Distribution Portal: Active Support',
    bottomBarTitle: `${productCount}+ Approved Formulations`,
    bottomBarSub: 'Doctor Visual Aids & Samples Kit',
    floatTopIcon: <Award size={18} style={{ color: '#059669' }} />,
    floatTopTitle: 'Stockists / Distribution Certificate',
    floatTopSub: '100% Territory Monopoly Rights',
    floatTopBorder: '#A7F3D0',
    floatBottomIcon: <ShieldCheck size={18} style={{ color: '#059669' }} />,
    floatBottomTitle: 'Doctor Visual Aids & Samples',
    floatBottomSub: 'Zero Cost Promotional Supply',
    floatBottomBorder: '#A7F3D0',
  },
];

export const HomeHeroSlider: React.FC<HomeHeroSliderProps> = ({
  slides,
  onOpenFranchiseModal,
  onOpenStoryModal,
}) => {
  const { productCount } = useSiteSettings();
  const BASE_SLIDES = useMemo(() => getHomeHeroSlides(productCount), [productCount]);

  const HOME_HERO_SLIDES = useMemo(() => {
    if (!slides || slides.length === 0) return BASE_SLIDES;

    return slides.map((customSlide, idx) => {
      const template = BASE_SLIDES[idx % BASE_SLIDES.length];
      const customImage = customSlide.image
        ? getMediaUrl(customSlide.image, template.image)
        : template.image;

      let titlePrefix = template.titlePrefix;
      let highlightWord = template.highlightWord;
      let titleSuffix = template.titleSuffix;

      if (customSlide.title && customSlide.title.trim()) {
        const fullTitle = customSlide.title.trim();
        const words = fullTitle.split(' ');
        if (words.length > 2) {
          titlePrefix = words.slice(0, words.length - 2).join(' ') + ' ';
          highlightWord = words.slice(words.length - 2, words.length - 1).join(' ');
          titleSuffix = ' ' + words[words.length - 1];
        } else {
          titlePrefix = '';
          highlightWord = fullTitle;
          titleSuffix = '';
        }
      }

      return {
        ...template,
        id: idx,
        badgeText: customSlide.badge || template.badgeText,
        titlePrefix,
        highlightWord,
        titleSuffix,
        subtitle: customSlide.subtitle || template.subtitle,
        ctaText: customSlide.ctaText || template.ctaText,
        ctaLink: customSlide.ctaLink || template.ctaLink,
        image: customImage,
      };
    });
  }, [slides, BASE_SLIDES]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const activeSlideData = HOME_HERO_SLIDES[currentSlide] || HOME_HERO_SLIDES[0];

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HOME_HERO_SLIDES.length);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, HOME_HERO_SLIDES.length]);

  return (
    <section
      className="zp-home-hero-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        borderBottomColor: activeSlideData.dotColor,
      }}
    >
      {/* Background Color Shade Layers based on Logo Colors - Crossfade 0.85s */}
      {HOME_HERO_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className="zp-home-hero-bg-layer"
          style={{
            background: slide.bgGradient,
            opacity: currentSlide === idx ? 1 : 0,
          }}
        />
      ))}

      {/* High-tech Subtle Grid Overlay */}
      <div className="zp-home-hero-grid-pattern" />

      {/* Dynamic Radial Ambient Glows matching active logo color */}
      <div className="zp-home-hero-glow-layer">
        <div
          className="zp-home-hero-glow-1"
          style={{
            background: `radial-gradient(circle, ${activeSlideData.glow1} 0%, rgba(0, 0, 0, 0) 70%)`,
          }}
        />
        <div
          className="zp-home-hero-glow-2"
          style={{
            background: `radial-gradient(circle, ${activeSlideData.glow2} 0%, rgba(0, 0, 0, 0) 70%)`,
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
        <div className="zp-home-hero-grid">
          {/* Left Column: High-Impact Typography & Clear CTAs */}
          <div>
            {/* Pill Badge */}
            <div
              className="zp-home-badge"
              style={{
                color: activeSlideData.badgeColor,
                background: activeSlideData.badgeBg,
                borderColor: activeSlideData.badgeBorder,
              }}
            >
              <Sparkles size={13} style={{ color: activeSlideData.badgeColor }} />
              <span>{activeSlideData.badgeText}</span>
            </div>

            {/* Title with dynamic colored highlight */}
            <h1 className="zp-home-hero-title">
              {activeSlideData.titlePrefix}
              <span
                style={{
                  backgroundImage: activeSlideData.highlightGradient,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {activeSlideData.highlightWord}
              </span>
              {activeSlideData.titleSuffix}
            </h1>

            <p className="zp-home-hero-sub">
              {activeSlideData.subtitle}
            </p>

            {/* Quick Value Metric Chips */}
            <div className="zp-home-chips-row">
              <div className="zp-home-chip">
                <Building2 size={14} style={{ color: activeSlideData.dotColor }} />
                <span>Surat Central Depot (7015, BTM)</span>
              </div>
              <div className="zp-home-chip">
                <ShieldCheck size={14} style={{ color: '#34D399' }} />
                <span>{productCount}+ DCGI Formulations</span>
              </div>
              <div className="zp-home-chip">
                <Clock size={14} style={{ color: '#FBBF24' }} />
                <span>24-48h Rapid Dispatch</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="zp-home-hero-actions">
              <button
                type="button"
                onClick={onOpenFranchiseModal}
                className="zp-home-hero-btn-primary"
                style={{
                  background: activeSlideData.btnGradient,
                  boxShadow: activeSlideData.btnShadow,
                }}
              >
                <span>{activeSlideData.ctaText}</span>
                <ArrowRight size={15} />
              </button>

              <Link
                to="/products"
                className="zp-home-hero-btn-outline"
              >
                <Layers size={15} style={{ color: activeSlideData.dotColor }} />
                <span>Explore Catalog</span>
              </Link>

              <a
                href="https://wa.me/919714327776?text=Hello%20Zeal%20Pharmaceuticals%2C%20I%20am%20interested%20in%20becoming%20a%20Stockist%20Partner."
                target="_blank"
                rel="noopener noreferrer"
                className="zp-home-hero-btn-wa"
                title="Direct WhatsApp Support"
              >
                <MessageCircle size={15} />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Slide Pagination Dots matching Logo Colors */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
              {HOME_HERO_SLIDES.map((slide, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    style={{
                      width: isActive ? '28px' : '8px',
                      height: '8px',
                      borderRadius: '999px',
                      background: isActive ? activeSlideData.dotColor : 'rgba(255, 255, 255, 0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Column: Multi-Layer Luxury 3D Animated Visual Showcase */}
          <div>
            <div
              className="zp-home-visual-card"
              style={{
                borderColor: activeSlideData.cardBorder,
                boxShadow: `0 24px 50px -12px rgba(0, 0, 0, 0.5), 0 0 35px ${activeSlideData.cardGlow}`,
              }}
            >
              {/* Floating Pill Top */}
              <div
                className="zp-home-floating-card-1"
                style={{ borderColor: activeSlideData.floatTopBorder }}
              >
                {activeSlideData.floatTopIcon}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                    {activeSlideData.floatTopTitle}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    {activeSlideData.floatTopSub}
                  </div>
                </div>
              </div>

              {/* Central Media Container with 3D Animated CGI Visuals */}
              <div className="zp-home-visual-media">
                {HOME_HERO_SLIDES.map((slide, idx) => (
                  <img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.imageAlt}
                    className={`zp-home-card-img ${currentSlide === idx ? 'is-active' : 'is-inactive'}`}
                  />
                ))}

                <div className="zp-home-visual-overlay" />

                {/* Top Left Live Status */}
                <div className="zp-home-visual-badge-top">
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: activeSlideData.statusDot,
                      display: 'inline-block',
                      boxShadow: `0 0 8px ${activeSlideData.statusDot}`,
                    }}
                  />
                  <span>{activeSlideData.statusText}</span>
                </div>

                {/* Bottom Bar Info */}
                <div className="zp-home-visual-bottom-bar">
                  <div>
                    <div className="zp-home-visual-bottom-title">
                      {activeSlideData.bottomBarTitle}
                    </div>
                    <div className="zp-home-visual-bottom-sub">
                      {activeSlideData.bottomBarSub}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenStoryModal}
                    className="zp-home-visual-play-btn"
                    style={{
                      background: activeSlideData.btnGradient,
                    }}
                  >
                    <Play size={12} fill="#FFFFFF" />
                    <span>Watch Story</span>
                  </button>
                </div>
              </div>

              {/* Floating Pill Bottom */}
              <div
                className="zp-home-floating-card-2"
                style={{ borderColor: activeSlideData.floatBottomBorder }}
              >
                {activeSlideData.floatBottomIcon}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                    {activeSlideData.floatBottomTitle}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    {activeSlideData.floatBottomSub}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
