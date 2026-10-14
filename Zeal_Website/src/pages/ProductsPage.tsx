import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Send } from 'lucide-react';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import type { IProduct, ICategory } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useEnquiryAuth } from '../context/EnquiryAuthContext';
import { PreFooterBanner } from '../components/layout/PreFooterBanner';
import { Pagination, SectionHeader, ProductGrid, ProductSkeletonGrid } from '../components/common';
import { SingleProductEnquiryModal, BulkProductEnquiryModal } from '../components/modals';
import {
  ProductListItem,
  BulkEnquiryFloatingBar,
  ProductFilterBar,
  ProductHeroBanners,
  ProductMiddleBanners,
  ProductBottomBanners,
} from '../components/products';

const PRODUCTS_PER_PAGE = 12;
const ALPHABET = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openFranchiseModal } = useSiteSettings();
  const { requireAuth } = useEnquiryAuth();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Single/Bulk Enquiry State
  const [singleEnquiryProduct, setSingleEnquiryProduct] = useState<IProduct | null>(null);
  const [bulkEnquiryList, setBulkEnquiryList] = useState<IProduct[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const handleOpenSingleEnquiry = (p: IProduct) => {
    requireAuth(() => {
      setSingleEnquiryProduct(p);
    }, {
      title: `Inquiry for ${p.name}`,
      subtitle: 'Please sign in or register so your inquiry is verified with the sales manager.',
    });
  };

  const handleOpenBulkModal = () => {
    requireAuth(() => {
      setIsBulkModalOpen(true);
    }, {
      title: 'Bulk Order Wholesale Enquiry',
      subtitle: 'Please sign in or register to submit your wholesale bulk requisition.',
    });
  };

  // Filter states
  const selectedCategory = searchParams.get('category') || 'ALL';
  const selectedLetter = searchParams.get('letter') || 'ALL';
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedDosage, setSelectedDosage] = useState<string>('ALL');
  const [selectedPrescription, setSelectedPrescription] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Date Range Filter
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);

  // SEO Page Title
  useEffect(() => {
    document.title = 'WHO-GMP Pharmaceutical Formulations & Products Catalog | Zeal Pharmacure';
  }, []);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
    fetchProducts();
  }, []);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLetter, searchQuery, selectedDosage, selectedPrescription, sortBy, startDate, endDate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        limit: 1000,
        sort: 'name',
      });
      setProducts(res.products || []);
    } catch (err) {
      console.warn('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'ALL') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    setSearchParams(params);
    scrollToCatalog();
  };

  const handleLetterChange = (letter: string) => {
    const params = new URLSearchParams(searchParams);
    if (letter === 'ALL') {
      params.delete('letter');
    } else {
      params.set('letter', letter);
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setSelectedDosage('ALL');
    setSelectedPrescription('ALL');
    setSortBy('newest');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const scrollToCatalog = () => {
    const catalogElem = document.getElementById('product-catalog-anchor');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Toggle Bulk Selection
  const handleToggleBulk = (p: IProduct) => {
    setBulkEnquiryList(prev => {
      const exists = prev.some(item => item._id === p._id);
      return exists ? prev.filter(item => item._id !== p._id) : [...prev, p];
    });
  };

  const handleRemoveFromBulk = (id: string) => {
    setBulkEnquiryList(prev => prev.filter(p => p._id !== id));
  };

  const handleClearBulk = () => {
    setBulkEnquiryList([]);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'ALL') count++;
    if (selectedLetter !== 'ALL') count++;
    if (selectedDosage !== 'ALL') count++;
    if (selectedPrescription !== 'ALL') count++;
    if (searchQuery.trim()) count++;
    if (startDate || endDate) count++;
    return count;
  }, [selectedCategory, selectedLetter, selectedDosage, selectedPrescription, searchQuery, startDate, endDate]);

  // Client-side search, letter match, date filter, prescription, and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. A-Z Letter Filter
    if (selectedLetter && selectedLetter !== 'ALL') {
      const targetChar = selectedLetter.trim().toUpperCase();
      result = result.filter(p => (p.name || '').trim().toUpperCase().startsWith(targetChar));
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.genericName && p.genericName.toLowerCase().includes(q)) ||
          (p.composition && p.composition.toLowerCase().includes(q)) ||
          (p.dosageForm && p.dosageForm.toLowerCase().includes(q)) ||
          (p.indicationTags && p.indicationTags.some(ind => ind.toLowerCase().includes(q)))
      );
    }

    // 3. Category Filter
    if (selectedCategory !== 'ALL') {
      const target = selectedCategory.toLowerCase().trim();
      result = result.filter(p => {
        if (!p.category) return false;
        if (typeof p.category === 'object') {
          const cat = p.category as any;
          return (
            (cat.slug && cat.slug.toLowerCase().trim() === target) ||
            (cat.name && cat.name.toLowerCase().trim() === target) ||
            (cat._id && String(cat._id) === selectedCategory)
          );
        }
        const pCatStr = String(p.category).toLowerCase().trim();
        if (pCatStr === target) return true;
        const matchingCat = categories.find(
          c => String(c._id) === pCatStr || c.slug.toLowerCase() === target || c.name.toLowerCase() === target
        );
        if (matchingCat) {
          return (
            matchingCat.slug.toLowerCase() === target ||
            matchingCat.name.toLowerCase() === target ||
            String(matchingCat._id) === selectedCategory
          );
        }
        return false;
      });
    }

    // 4. Dosage form filter (matches both singular and plural forms e.g. "Tablets" matches "Tablet")
    if (selectedDosage !== 'ALL') {
      const target = selectedDosage.toLowerCase().trim().replace(/s$/, '');
      result = result.filter(p => {
        const pForm = (p.dosageForm || '').toLowerCase().trim().replace(/s$/, '');
        return pForm === target;
      });
    }

    // 5. Prescription filter
    if (selectedPrescription !== 'ALL') {
      result = result.filter(p => (p.prescriptionType || 'General') === selectedPrescription);
    }

    // 6. Date Range filter
    if (startDate) {
      const startTime = new Date(startDate).setHours(0, 0, 0, 0);
      result = result.filter(p => (p.createdAt ? new Date(p.createdAt).getTime() >= startTime : true));
    }
    if (endDate) {
      const endTime = new Date(endDate).setHours(23, 59, 59, 999);
      result = result.filter(p => (p.createdAt ? new Date(p.createdAt).getTime() <= endTime : true));
    }

    // 7. Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }

    return result;
  }, [products, selectedLetter, searchQuery, selectedCategory, selectedDosage, selectedPrescription, startDate, endDate, sortBy, categories]);

  // Best selling formulations (top 4)
  const bestSellingProducts = useMemo(() => products.slice(0, 4), [products]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    scrollToCatalog();
  };

  const sortOptions = [
    { value: 'newest', label: 'Date: Newest First' },
    { value: 'oldest', label: 'Date: Oldest First' },
    { value: 'name-asc', label: 'Sort: A to Z' },
    { value: 'name-desc', label: 'Sort: Z to A' },
    { value: 'rating-desc', label: 'Highest Rated' },
  ];

  // Dynamic Category Live Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      if (!p.category) continue;
      if (typeof p.category === 'object') {
        const cat = p.category as any;
        if (cat.slug) counts[cat.slug.toLowerCase().trim()] = (counts[cat.slug.toLowerCase().trim()] || 0) + 1;
        if (cat.name) counts[cat.name.toLowerCase().trim()] = (counts[cat.name.toLowerCase().trim()] || 0) + 1;
        if (cat._id) counts[String(cat._id)] = (counts[String(cat._id)] || 0) + 1;
      } else {
        counts[String(p.category).toLowerCase().trim()] = (counts[String(p.category).toLowerCase().trim()] || 0) + 1;
      }
    }
    return counts;
  }, [products]);

  const categoryOptions = useMemo(() => {
    return [
      { value: 'ALL', label: 'All Therapeutic Divisions', count: products.length },
      ...categories.map(c => {
        const liveCount =
          categoryCounts[c.slug.toLowerCase().trim()] ||
          categoryCounts[c.name.toLowerCase().trim()] ||
          categoryCounts[String(c._id)] ||
          c.productCount ||
          0;
        return {
          value: c.slug,
          label: c.name,
          count: liveCount,
        };
      }),
    ];
  }, [categories, products.length, categoryCounts]);

  // Dynamic Dosage Live Counts & Options
  const dosageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      if (p.dosageForm) {
        const norm = p.dosageForm.trim();
        counts[norm] = (counts[norm] || 0) + 1;
      }
    }
    return counts;
  }, [products]);

  const dosageOptions = useMemo(() => {
    const formsInCatalog = Array.from(new Set(products.map(p => p.dosageForm?.trim()).filter(Boolean) as string[]));
    const allKnown = Array.from(new Set([...formsInCatalog, 'Tablet', 'Capsule', 'Cream', 'Gel', 'Sachet', 'Lotion', 'Syrup', 'Injection', 'Ointment', 'Oil']));

    return [
      { value: 'ALL', label: 'All Dosage Forms', count: products.length },
      ...allKnown
        .map(d => {
          const label = d.endsWith('s') ? d : `${d}s`;
          const count = dosageCounts[d] || 0;
          return {
            value: d,
            label,
            count,
          };
        })
        .filter(opt => opt.count > 0 || ['Tablet', 'Capsule', 'Cream', 'Syrup', 'Injection'].includes(opt.value)),
    ];
  }, [products, dosageCounts]);

  const prescriptionOptions = [
    { value: 'ALL', label: 'All Prescription Types' },
    { value: 'Rx Only', label: 'Rx Only (Prescription)' },
    { value: 'General', label: 'General / OTC' },
  ];

  const startIndex = filteredProducts.length === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length);

  const handleViewDossier = (p: IProduct) => {
    navigate(`/products/${p.slug || p._id}`);
  };

  return (
    <div style={{ background: '#FAFAFC', minHeight: '100vh', color: '#0F172A' }}>
      {/* 1. TOP BANNER HERO GRID */}
      <ProductHeroBanners
        products={products}
        onEnquireProduct={handleOpenSingleEnquiry}
        onOpenFranchise={openFranchiseModal}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Anchor for smooth scroll */}
      <div id="product-catalog-anchor" />

      {/* 2. COMPLETE FORMULATIONS CATALOG & FILTER SUITE */}
      <section className="zp-container" style={{ marginTop: '48px', marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '26px' }}>
          <SectionHeader
            title="Pharmaceutical Formulations Portfolio"
            subtitle="Explore WHO-GMP finished formulations ready for wholesale dispatch and authorized stockists distribution"
            align="left"
            style={{ marginBottom: 0 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {bulkEnquiryList.length > 0 && (
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="zp-btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px' }}
              >
                <ShoppingBag size={15} />
                <span>Review Bulk Enquiry ({bulkEnquiryList.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={openFranchiseModal}
              className="zp-btn-primary"
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
                color: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Send size={14} color="#FFFFFF" />
              <span>Full Portfolio Price List</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <ProductFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={sortOptions}
          startDate={startDate}
          endDate={endDate}
          onDateApply={(s, e) => {
            setStartDate(s);
            setEndDate(e);
          }}
          onDateClear={() => {
            setStartDate('');
            setEndDate('');
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categoryOptions={categoryOptions}
          selectedDosage={selectedDosage}
          onDosageChange={setSelectedDosage}
          dosageOptions={dosageOptions}
          selectedPrescription={selectedPrescription}
          onPrescriptionChange={setSelectedPrescription}
          prescriptionOptions={prescriptionOptions}
          alphabet={ALPHABET}
          selectedLetter={selectedLetter}
          onLetterChange={handleLetterChange}
          totalResults={filteredProducts.length}
          startIndex={startIndex}
          endIndex={endIndex}
          activeFiltersCount={activeFiltersCount}
          onClearAll={clearAllFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          categories={categories}
        />

        {/* PRODUCTS RENDER (RESPONSIVE GRID / LIST) */}
        {loading ? (
          <ProductSkeletonGrid count={8} />
        ) : filteredProducts.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '64px 24px',
            textAlign: 'center',
            border: '1.5px solid var(--zp-border)',
            boxShadow: 'var(--zp-shadow-sm)',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--zp-primary-light)',
              color: 'var(--zp-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              No formulations found matching criteria
            </h3>
            <p style={{ color: '#64748B', fontSize: '14.5px', marginBottom: '22px', maxWidth: '440px', margin: '0 auto 22px' }}>
              Try clearing filters or search terms to see the complete catalog.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="zp-btn-primary"
              style={{ margin: '0 auto' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <ProductGrid
                products={paginatedProducts}
                onEnquire={handleOpenSingleEnquiry}
                onViewDossier={handleViewDossier}
                bulkSelectedIds={bulkEnquiryList.map(item => item._id)}
                onToggleBulk={handleToggleBulk}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {paginatedProducts.map(prod => (
                  <ProductListItem
                    key={prod._id}
                    product={prod}
                    onEnquire={handleOpenSingleEnquiry}
                    onViewDossier={handleViewDossier}
                    isBulkSelected={bulkEnquiryList.some(item => item._id === prod._id)}
                    onToggleBulk={handleToggleBulk}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      {/* 3. MIDDLE 3 PROMO BANNERS */}
      <ProductMiddleBanners onOpenFranchise={openFranchiseModal} />

      {/* 4. BOTTOM 2 PROMO BANNERS */}
      <ProductBottomBanners onOpenFranchise={openFranchiseModal} />

      {/* 5. BEST SELLING FORMULATIONS */}
      <section className="zp-container" style={{ marginTop: '56px', marginBottom: '72px' }}>
        <SectionHeader
          title="Best Selling Formulations"
          subtitle="Highest prescribers demand & ready stock wholesale packaging"
          align="left"
          style={{ marginBottom: '22px' }}
          action={
            <button
              type="button"
              onClick={handleOpenBulkModal}
              className="zp-btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              <ShoppingBag size={14} />
              <span>Bulk Order Enquiry</span>
            </button>
          }
        />

        <ProductGrid
          products={bestSellingProducts}
          loading={loading}
          skeletonCount={4}
          onEnquire={handleOpenSingleEnquiry}
          onViewDossier={handleViewDossier}
          bulkSelectedIds={bulkEnquiryList.map(item => item._id)}
          onToggleBulk={handleToggleBulk}
        />
      </section>

      {/* Floating Bulk Enquiry Bar */}
      <BulkEnquiryFloatingBar
        selectedCount={bulkEnquiryList.length}
        onOpenModal={handleOpenBulkModal}
        onClearAll={handleClearBulk}
      />

      {/* Pre-Footer Banner */}
      <PreFooterBanner />

      {/* Single Product Enquiry Modal */}
      <SingleProductEnquiryModal
        product={singleEnquiryProduct}
        onClose={() => setSingleEnquiryProduct(null)}
      />

      {/* Bulk Multi-Product Enquiry Modal */}
      <BulkProductEnquiryModal
        products={bulkEnquiryList}
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onRemoveProduct={handleRemoveFromBulk}
        onClearAll={handleClearBulk}
      />
    </div>
  );
};
