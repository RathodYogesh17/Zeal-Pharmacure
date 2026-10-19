import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pill, ArrowLeft, Share2, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../api/productService';
import { enquiryService } from '../api/enquiryService';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useAuth } from '../context/AuthContext';
import type { IProduct } from '../types';
import {
  ProductDetailGallery,
  ProductDetailInfo,
  ProductDetailTabs,
  ProductDetailSidebar,
  ProductDetailLeadForm,
  ProductDetailPromoBanner,
  ProductDetailRelated,
} from '../components/product-detail';
import '../components/product-detail/ProductDetailStyles.css';
import { SingleProductEnquiryModal } from '../components/modals/SingleProductEnquiryModal';
import { BulkProductEnquiryModal } from '../components/modals/BulkProductEnquiryModal';
import { BulkEnquiryFloatingBar } from '../components/products/BulkEnquiryFloatingBar';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openFranchiseModal } = useSiteSettings();
  const { user } = useAuth();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'clinical' | 'commercial' | 'reviews'>('clinical');
  const [copiedLink, setCopiedLink] = useState(false);

  // Related & Sibling Products
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<IProduct[]>([]);

  // Enquiry Modals
  const [enquiryProduct, setEnquiryProduct] = useState<IProduct | null>(null);
  const [bulkProducts, setBulkProducts] = useState<IProduct[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Reviews state
  const [reviewForm, setReviewForm] = useState({
    doctorName: user?.name || '',
    clinicName: '',
    qualification: 'MBBS / MD / B.Pharm',
    rating: 5,
    reviewText: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Quick Inline Lead Form
  const [leadForm, setLeadForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: '',
    state: '',
    drugLicenseNumber: '',
    message: '',
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState('');
  const [leadError, setLeadError] = useState('');

  useEffect(() => {
    if (user) {
      setLeadForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
      }));
      setReviewForm((prev) => ({
        ...prev,
        doctorName: prev.doctorName || user.name || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (slug) {
      loadProduct(slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug]);

  const loadProduct = async (productSlug: string) => {
    let hadCached = false;

    // 1. Instant Cache Look-up: check if product is already in localStorage catalog cache
    try {
      const rawCache = localStorage.getItem('zeal_products_cache');
      if (rawCache) {
        const parsed = JSON.parse(rawCache);
        const list: IProduct[] = Array.isArray(parsed) ? parsed : parsed?.data;
        if (Array.isArray(list) && list.length > 0) {
          const found = list.find(
            (p) =>
              (p.slug && p.slug.toLowerCase() === productSlug.toLowerCase()) ||
              p._id === productSlug
          );
          if (found) {
            setProduct(found);
            setActiveImage(found.featuredImage || '');
            setLoading(false);
            hadCached = true;

            // Pre-populate sibling list for instant Prev / Next buttons
            const catId = typeof found.category === 'object' && found.category ? (found.category as any)._id : found.category;
            const sameCat = list.filter((p) => {
              const pCatId = typeof p.category === 'object' && p.category ? (p.category as any)._id : p.category;
              return pCatId && pCatId === catId;
            });
            if (sameCat.length > 1) {
              setCategoryProducts(sameCat);
            }
          }
        }
      }
    } catch {}

    if (!hadCached) {
      setLoading(true);
    }

    try {
      // 2. Fetch fresh full product dossier
      const data = await productService.getProductBySlug(productSlug);
      if (data) {
        setProduct((prev) => (prev ? { ...prev, ...data } : data));
        setActiveImage((prev) => prev || data.featuredImage || '');
        setLoading(false);

        // 3. Fetch Related & Category siblings in parallel in the background (NON-BLOCKING)
        const catSlug =
          typeof data.category === 'object' && data.category?.slug
            ? data.category.slug
            : typeof data.category === 'string' && !data.category.match(/^[0-9a-fA-F]{24}$/)
              ? data.category
              : '';

        Promise.allSettled([
          productService.getRelatedProducts(data.slug || data._id, 8),
          productService.getProducts({ category: catSlug || undefined, limit: 30 }),
        ]).then(([relatedRes, catRes]) => {
          if (relatedRes.status === 'fulfilled' && Array.isArray(relatedRes.value)) {
            setRelatedProducts(relatedRes.value);
          }
          if (catRes.status === 'fulfilled' && catRes.value?.products) {
            setCategoryProducts(catRes.value.products);
          }
        });
      } else if (!hadCached) {
        setProduct(null);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      if (!hadCached) {
        setLoading(false);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleToggleBulk = (p: IProduct) => {
    setBulkProducts((prev) => {
      const exists = prev.some((item) => item._id === p._id);
      if (exists) {
        return prev.filter((item) => item._id !== p._id);
      } else {
        return [...prev, p];
      }
    });
  };

  const handleOpenSingleEnquiry = () => {
    if (!product) return;
    setEnquiryProduct(product);
  };

  const handleOpenBulkModal = () => {
    setIsBulkModalOpen(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmittingLead(true);
    setLeadSuccess('');
    setLeadError('');

    try {
      await enquiryService.submitFranchiseEnquiry({
        ...leadForm,
        fullName: leadForm.fullName.trim() || user?.name || '',
        phone: leadForm.phone.trim() || user?.phone || '',
        email: leadForm.email.trim() || user?.email || '',
        message: `Inquiry regarding ${product.name} (${product.genericName || ''}). ${leadForm.message}`.trim(),
      });
      setLeadSuccess('Your Stockists Distribution inquiry has been registered! Our Regional Business Manager will contact you shortly.');
      setLeadForm({
        fullName: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        city: '',
        state: '',
        drugLicenseNumber: '',
        message: '',
      });
    } catch (err: any) {
      console.error('Failed to submit lead:', err);
      setLeadError(err?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewForm.doctorName.trim() || !reviewForm.reviewText.trim()) return;

    setSubmittingReview(true);
    setReviewSuccess('');
    setReviewError('');

    try {
      await productService.submitReview(product.slug || product._id, {
        doctorName: reviewForm.doctorName.trim(),
        clinicName: reviewForm.clinicName.trim() || undefined,
        qualification: reviewForm.qualification.trim() || undefined,
        rating: reviewForm.rating,
        reviewText: reviewForm.reviewText.trim(),
      });

      setReviewSuccess('Thank you! Your clinical review has been submitted for moderation and will appear once approved by the QA team.');
      setReviewForm({
        doctorName: '',
        clinicName: '',
        qualification: 'MBBS / MD / B.Pharm',
        rating: 5,
        reviewText: '',
      });
      setTimeout(() => setReviewSuccess(''), 5000);
    } catch (err: any) {
      setReviewError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--zp-primary)' }}>
        <Pill size={42} className="pulse-dot" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A' }}>Loading Formulation Dossier...</h3>
        <p style={{ fontSize: '13.5px', color: '#64748B' }}>Fetching clinical pharmacology specifications</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: '40px 20px' }}>
        <AlertCircle size={48} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Formulation Not Found</h2>
        <p style={{ color: '#64748B', marginBottom: '24px' }}>The requested product dossier may have been moved or updated.</p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Product Catalog</span>
        </Link>
      </div>
    );
  }

  const categoryName = typeof product.category === 'object' && product.category?.name
    ? product.category.name
    : product.subCategoryName
      ? product.subCategoryName
      : product.therapeuticClass
        ? product.therapeuticClass
        : typeof product.category === 'string' && product.category && !product.category.match(/^[0-9a-fA-F]{24}$/)
          ? product.category
          : product.dosageForm
            ? `${product.dosageForm} Formulation`
            : 'Therapeutic Formulations';

  const categorySlug = typeof product.category === 'object' && product.category?.slug
    ? product.category.slug
    : typeof product.category === 'string' && !product.category.match(/^[0-9a-fA-F]{24}$/)
      ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : product.subCategoryName
        ? product.subCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : '';

  const isCurrentInBulk = bulkProducts.some((p) => p._id === product._id);

  // Compute Prev & Next Product
  const siblingList = categoryProducts.length > 0 ? categoryProducts : relatedProducts;
  const currentIndex = siblingList.findIndex((p) => p._id === product._id || p.slug === product.slug);
  const prevProduct = currentIndex > 0 ? siblingList[currentIndex - 1] : siblingList[siblingList.length - 1];
  const nextProduct = currentIndex >= 0 && currentIndex < siblingList.length - 1 ? siblingList[currentIndex + 1] : siblingList[0];

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* 1. Top Breadcrumbs Bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1.5px solid #E2E8F0', padding: '14px 24px' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }}>
            <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to="/products" style={{ color: '#64748B', textDecoration: 'none' }}>Formulations</Link>
            <span>/</span>
            <Link
              to={`/products${categorySlug ? `?category=${categorySlug}` : ''}`}
              style={{ color: 'var(--zp-primary)', fontWeight: 600, textDecoration: 'none' }}
            >
              {categoryName}
            </Link>
            <span>/</span>
            <strong style={{ color: '#0F172A' }}>{product.name}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleCopyLink}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: '6px', fontSize: '12.5px' }}
            >
              {copiedLink ? <Check size={14} style={{ color: '#10B981' }} /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <Link to="/products" className="btn btn-secondary btn-sm" style={{ borderRadius: '6px', fontSize: '12.5px' }}>
              <ArrowLeft size={14} />
              <span>Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Page Layout Container */}
      <div className="zp-product-detail-container">

        {/* 2. Top Hero Stage: Balanced 2-Column Showcase (Gallery Left + Info Right) */}
        <div className="product-hero-2col">
          {/* Gallery Showcase Stage */}
          <ProductDetailGallery
            product={product}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />

          {/* Product Header, Salt, Specs, and B2B CTAs */}
          <ProductDetailInfo
            product={product}
            categoryName={categoryName}
            onEnquire={handleOpenSingleEnquiry}
            isBulkSelected={isCurrentInBulk}
            onToggleBulk={() => handleToggleBulk(product)}
          />
        </div>

        {/* 3. 2-Column Section: Left 3 Tabs + Right Sidebar */}
        <div className="product-lower-2col">
          {/* LEFT: 3 Detailed Clinical Information Tabs & Shifted Enquiry Form Below It */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: 0, width: '100%' }}>
            <ProductDetailTabs
              product={product}
              categoryName={categoryName}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              reviewForm={reviewForm}
              setReviewForm={setReviewForm}
              submittingReview={submittingReview}
              reviewSuccess={reviewSuccess}
              reviewError={reviewError}
              handleReviewSubmit={handleReviewSubmit}
            />

            {/* Shifted below review/tabs parent box: B2B Stockist Monopoly Inquiry Form */}
            <ProductDetailLeadForm
              product={product}
              leadForm={leadForm}
              setLeadForm={setLeadForm}
              submittingLead={submittingLead}
              leadSuccess={leadSuccess}
              leadError={leadError}
              handleLeadSubmit={handleLeadSubmit}
            />
          </div>

          {/* RIGHT SIDEBAR STREAM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ProductDetailSidebar
              currentProduct={product}
              relatedProducts={relatedProducts}
              categoryName={categoryName}
              onOpenFranchise={openFranchiseModal}
            />
          </div>
        </div>

        {/* 4. FULL WIDTH SECTION 1: Gamified Promo Banner (Win Your District Stockist Monopoly in 4 Moves) */}
        <div style={{ width: '100%', marginBottom: '40px' }}>
          <ProductDetailPromoBanner
            onClaimMonopoly={handleOpenSingleEnquiry}
            categoryName={categoryName}
          />
        </div>

        {/* 5. FULL WIDTH SECTION 2: Dynamic Related Formulations (Related Formulations in Dental & Oral Care) */}
        <div style={{ width: '100%', marginBottom: '40px' }}>
          <ProductDetailRelated
            currentProduct={product}
            categoryName={categoryName}
            categorySlug={categorySlug}
            onEnquireProduct={(p) => setEnquiryProduct(p)}
            bulkSelectedIds={bulkProducts.map((b) => b._id)}
            onToggleBulk={handleToggleBulk}
          />
        </div>

        {/* 6. FULL WIDTH SECTION 3: Bottom Prev / Next Formulation Navigation Links */}
        <div className="zp-product-nav-row">
          {prevProduct && (
            <Link
              to={`/products/${prevProduct.slug || prevProduct._id}`}
              className="zp-product-nav-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#334155',
                fontSize: '13.5px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--zp-primary)';
                e.currentTarget.style.color = 'var(--zp-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.color = '#334155';
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous: <strong>{prevProduct.name}</strong></span>
            </Link>
          )}

          {nextProduct && (
            <Link
              to={`/products/${nextProduct.slug || nextProduct._id}`}
              className="zp-product-nav-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#334155',
                fontSize: '13.5px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--zp-primary)';
                e.currentTarget.style.color = 'var(--zp-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.color = '#334155';
              }}
            >
              <span>Next: <strong>{nextProduct.name}</strong></span>
              <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* Single Product Enquiry Modal */}
      <SingleProductEnquiryModal
        product={enquiryProduct}
        onClose={() => setEnquiryProduct(null)}
      />

      {/* Bulk Product Enquiry Modal */}
      <BulkProductEnquiryModal
        products={bulkProducts}
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onRemoveProduct={(id) => setBulkProducts((prev) => prev.filter((p) => p._id !== id))}
        onClearAll={() => setBulkProducts([])}
      />

      {/* Floating Bulk Enquiry Bar */}
      <BulkEnquiryFloatingBar
        selectedCount={bulkProducts.length}
        onOpenModal={handleOpenBulkModal}
        onClearAll={() => setBulkProducts([])}
      />
    </div>
  );
};
