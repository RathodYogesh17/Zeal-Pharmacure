import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import type { IProduct, ICategory } from '../types';
import { SingleProductEnquiryModal } from '../components/modals/SingleProductEnquiryModal';
import { PreFooterBanner } from '../components/layout/PreFooterBanner';
import { FaqAccordion, StatsBar } from '../components/common';
import {
  HomeHeroSlider,
  HomeCategoriesGrid,
  HomeFeaturedProducts,
  HomeWhyChooseUs,
  HomeCertifications,
  HomeTestimonialsSlider,
  HomeShowcaseCards,
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
    title: 'Partner with India’s Most Trusted Stockist Distribution Network',
    subtitle: `Direct depot access to ${productCount}+ DCGI-approved pharmaceutical formulations with protected district margins, transparent wholesale pricing, and dedicated stockist support.`,
    badge: 'WHO-GMP & DCGI COMPLIANT BULK DISTRIBUTION',
    ctaText: 'Apply for Stockists Distribution',
    ctaLink: '/contact',
    image: DEFAULT_HERO_IMAGES[0],
  },
  {
    title: 'Ready Bulk Stock with Pan-India Distribution Network',
    subtitle: 'Equipped with modern temperature-controlled warehousing at Surat (7015, BTM Market) ensuring computerized FEFO batch management, zero stockouts, and seamless transit across all states.',
    badge: 'CENTRAL LOGISTICS DEPOT • SURAT, GUJARAT',
    ctaText: 'Explore Product Catalog',
    ctaLink: '/products',
    image: DEFAULT_HERO_IMAGES[1],
  },
  {
    title: 'Accelerate Prescriptions with Free Visual Aids & Detailing Kits',
    subtitle: 'Empower your field network with premium doctor visual aids, clinical LBLs, reminder cards, scientific product glossaries, and physician sample kits provided at zero cost.',
    badge: 'COMPREHENSIVE B2B MARKETING COLLATERALS',
    ctaText: 'Request Stockist Kit',
    ctaLink: '/contact',
    image: DEFAULT_HERO_IMAGES[2],
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
    const CAT_CACHE_KEY = 'zeal_home_categories';
    const PROD_CACHE_KEY = 'zeal_home_featured';
    const TTL = 10 * 60 * 1000; // 10 minutes

    const loadFromCache = <T,>(key: string): T | null => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const { ts, data } = JSON.parse(raw);
          if (Date.now() - ts < TTL && data) return data as T;
        }
      } catch {}
      return null;
    };

    const saveToCache = (key: string, data: any) => {
      try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
    };

    // Load categories (from cache first, then API)
    const cachedCats = loadFromCache<ICategory[]>(CAT_CACHE_KEY);
    if (cachedCats && cachedCats.length > 0) {
      if (isMounted) { setCategories(cachedCats); setCategoriesLoading(false); }
    }
    categoryService.getCategories()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setCategories(data);
          setCategoriesLoading(false);
          saveToCache(CAT_CACHE_KEY, data);
        }
      })
      .catch(() => { if (isMounted) { setCategories([]); setCategoriesLoading(false); } });

    // Load featured products (from cache first, then API)
    const cachedProds = loadFromCache<IProduct[]>(PROD_CACHE_KEY);
    if (cachedProds && cachedProds.length > 0) {
      if (isMounted) { setRealProducts(cachedProds); setProductsLoading(false); }
    }
    productService.getProducts({ limit: 4 })
      .then((res) => {
        const prods = res?.products || [];
        if (isMounted) {
          setRealProducts(prods);
          setProductsLoading(false);
          if (prods.length > 0) saveToCache(PROD_CACHE_KEY, prods);
        }
      })
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
      <StatsBar variant="cards" />

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
      <FaqAccordion
        faqs={faqs}
        headerType="executive"
        subtitle="Transparent answers regarding authorized stockists distribution, minimum order requirements, and marketing collaterals."
      />

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
