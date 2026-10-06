import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import type { IProduct, ICategory } from '../types';
import { SingleProductEnquiryModal } from '../components/modals/SingleProductEnquiryModal';
import { PreFooterBanner } from '../components/layout/PreFooterBanner';
import {
  HomeHeroSlider,
  HomeStatsBar,
  HomeCategoriesGrid,
  HomeFeaturedProducts,
  HomeWhyChooseUs,
  HomeCertifications,
  HomeTestimonialsSlider,
  HomeShowcaseCards,
  HomeFaqAccordion,
  HomeStoryModal,
} from '../components/home';

const DEFAULT_HERO_IMAGES = [
  '/banners/banner_franchise_meeting.jpg',
  '/banners/banner_monopoly_handshake.jpg',
  '/banners/banner_bulk_stockist.jpg',
  '/banners/banner_promotional_kit.jpg',
];

const getFallbackSlides = (productCount: number) => [
  {
    title: 'Grow Your Business with India’s Leading Stockists Distribution Network',
    subtitle: `Get ${productCount}+ DCGI-approved formulations procured directly from certified manufacturers with high profit margins and authorized stockists distribution rights.`,
    badge: 'Top Stockists Distribution Network & Bulk Supply',
    ctaText: 'Apply for Stockists Distribution',
    ctaLink: '/contact',
    image: DEFAULT_HERO_IMAGES[0],
  },
  {
    title: 'Guaranteed Stockists Distribution Rights with Direct Factory Pricing',
    subtitle: 'Become our authorized stockist partner. Zero market competition, transparent B2B wholesale pricing, and verified cGMP formulation quality.',
    badge: 'Stockists Distribution Rights',
    ctaText: 'Apply for Territory',
    ctaLink: '/contact',
    image: DEFAULT_HERO_IMAGES[1],
  },
  {
    title: 'Ready Wholesale Stock & 24-48 Hours Rapid Pan-India Dispatch',
    subtitle: `Air-conditioned wholesale stockist warehouse with ${productCount}+ formulations in ready stock. Real-time batch tracking and zero supply shortages.`,
    badge: 'Wholesale Bulk Supply & Rapid Dispatch',
    ctaText: 'Explore Catalog',
    ctaLink: '/products',
    image: DEFAULT_HERO_IMAGES[2],
  },
  {
    title: 'Complete Free Promotional & Marketing Support for Stockist Partners',
    subtitle: 'Boost doctor prescribing with premium Visual Aids, Product Glossaries, Reminder Cards, MR Bags, Doctor Catch Covers, and Sample Kits.',
    badge: '100% Free Promotional Tools',
    ctaText: 'Request Stockist Kit',
    ctaLink: '/contact',
    image: DEFAULT_HERO_IMAGES[3],
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { openFranchiseModal, banners, certifications, faqs, testimonials, productCount } = useSiteSettings();

  const [enquiryProduct, setEnquiryProduct] = useState<IProduct | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [realProducts, setRealProducts] = useState<IProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Combine CMS banners with default slides
  const heroSlides = useMemo(() => {
    const fallback = getFallbackSlides(productCount);
    if (!banners || banners.length === 0) return fallback;
    return banners.map((b, i) => ({
      title: b.title || fallback[0].title,
      subtitle: b.subtitle ? b.subtitle.replace(/500\+/g, `${productCount}+`).replace(/250\+/g, `${productCount}+`) : fallback[0].subtitle,
      badge: b.badge || fallback[0].badge,
      ctaText: b.ctaText || 'Apply for Stockists Distribution',
      ctaLink: b.ctaLink || '/contact',
      image: b.imageUrl && !b.imageUrl.includes('unsplash') && (b.imageUrl.startsWith('http') || b.imageUrl.startsWith('/'))
        ? b.imageUrl
        : DEFAULT_HERO_IMAGES[i % DEFAULT_HERO_IMAGES.length],
    }));
  }, [banners, productCount]);

  useEffect(() => {
    let isMounted = true;
    categoryService.getCategories()
      .then((data) => { if (isMounted) { setCategories(data || []); setCategoriesLoading(false); } })
      .catch(() => { if (isMounted) { setCategories([]); setCategoriesLoading(false); } });

    productService.getProducts({ limit: 4 })
      .then((res) => { if (isMounted) { setRealProducts(res?.products || []); setProductsLoading(false); } })
      .catch(() => { if (isMounted) { setRealProducts([]); setProductsLoading(false); } });

    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ background: '#FFFFFF', color: '#1E293B', overflowX: 'hidden' }}>
      {/* 1. Hero Section Slider */}
      <HomeHeroSlider
        slides={heroSlides}
        onOpenFranchiseModal={openFranchiseModal}
        onOpenStoryModal={() => setShowStoryModal(true)}
      />

      {/* 2. Key Trust & Statistics Floating Bar */}
      <HomeStatsBar />

      {/* 3. Therapeutic Segments Categories Grid */}
      <HomeCategoriesGrid categories={categories} loading={categoriesLoading} />

      {/* 4. Featured Formulations */}
      <HomeFeaturedProducts
        products={realProducts}
        loading={productsLoading}
        onEnquire={p => setEnquiryProduct(p)}
        onViewDossier={p => navigate(`/products/${p.slug || p._id}`)}
      />

      {/* 5. Why Choose Zeal Pharma Benefit Cards */}
      <HomeWhyChooseUs />

      {/* 6. Manufacturing Standards & Quality Accreditations */}
      <HomeCertifications certifications={certifications} />

      {/* 7. Doctor & Franchisee Testimonials Carousel */}
      <HomeTestimonialsSlider testimonials={testimonials} />

      {/* 8. B2B Monopoly & Distribution Showcase Cards */}
      <HomeShowcaseCards onOpenFranchiseModal={openFranchiseModal} />

      {/* 9. Franchise FAQ Accordion */}
      <HomeFaqAccordion faqs={faqs} />

      {/* 10. Pre-Footer Monopoly Call-to-Action */}
      <PreFooterBanner />

      {/* Modals */}
      <SingleProductEnquiryModal
        product={enquiryProduct}
        onClose={() => setEnquiryProduct(null)}
      />

      <HomeStoryModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onOpenFranchiseModal={openFranchiseModal}
      />
    </div>
  );
};
