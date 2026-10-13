import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Edit2,
  Trash2,
  Clock,
  ArrowLeft,
  Pill,
  ShieldCheck,
  Package,
  Copy,
  Download,
  Eye,
  FileText,
  AlertTriangle,
  Globe,
  Tag,
  Star,
  ExternalLink,
  CheckCircle2,
  Building2,
  Award,
  Sparkles,
  Check,
  Share2,
  Thermometer,
  Stethoscope,
  BookOpen,
  Info,
  Calendar,
  Activity,
  HeartPulse,
  Baby,
  FileCheck,
  AlertOctagon,
  TrendingUp,
  Users,
} from 'lucide-react';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { ZealLoader } from '../components/common';
import type { IProduct, ICategory } from '../types';

export const AdminProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState('');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'clinical' | 'safety' | 'commercial' | 'regulatory' | 'seo'>('clinical');

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const loadProduct = () => {
    if (id) {
      setLoading(true);
      productService
        .getProductBySlug(id)
        .then((res) => {
          setProduct(res);
          if (res?.featuredImage) {
            setSelectedGalleryImg(res.featuredImage);
          }
        })
        .catch(() => setProduct(null))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!window.confirm(`Are you sure you want to delete formulation "${product.name}" from the database?`)) return;
    try {
      await productService.adminDeleteProduct(product._id);
      navigate('/admin/products');
    } catch {
      alert('Failed to delete formulation.');
    }
  };

  const handleDuplicate = async () => {
    if (!product) return;
    try {
      setDuplicateLoading(true);
      const duplicated = await productService.adminDuplicateProduct(product._id);
      setActionFeedback(`Formulation duplicated as draft! Navigating...`);
      setTimeout(() => {
        navigate(`/admin/products/edit/${duplicated._id}`);
      }, 1000);
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate product.');
    } finally {
      setDuplicateLoading(false);
    }
  };

  if (loading) {
    return (
      <ZealLoader
        title="Loading Pharmaceutical Dossier"
        subtitle="Fetching clinical specifications, pharmacology & commercial records..."
        size="lg"
        minHeight="420px"
      />
    );
  }

  if (!product) {
    return (
      <div className="dossier-card max-w-md mx-auto my-10 text-center p-10">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertTriangle size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Formulation Not Found</h2>
        <p className="text-slate-500 text-xs mb-6 leading-relaxed">
          The requested pharmaceutical formulation could not be loaded or may have been deleted.
        </p>
        <Link to="/admin/products" className="btn btn-primary inline-flex text-xs px-5 py-2.5">
          <ArrowLeft size={15} />
          <span>Back to Product Catalog</span>
        </Link>
      </div>
    );
  }

  const p = product;
  const categoryName =
    typeof p.category === 'object' && p.category
      ? p.category.name || 'General'
      : typeof p.category === 'string' && p.category
      ? p.category
      : 'General';
  const subCategoryName =
    p.subCategoryName || (typeof p.subCategory === 'object' && p.subCategory?.name ? p.subCategory.name : '');

  const galleryItems = Array.isArray(p.mediaGallery)
    ? p.mediaGallery.map((m: any) => (typeof m === 'object' && m?.url ? m.url : String(m)))
    : [];

  const allImages = p.featuredImage ? [p.featuredImage, ...galleryItems.filter((url) => url !== p.featuredImage)] : galleryItems;
  const currentDisplayImage = selectedGalleryImg || p.featuredImage || allImages[0];
  const websiteBase = (import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173').replace(/\/$/, '');

  return (
    <div className="dossier-page-container">
      {/* ========================================================= */}
      {/* 1. HERO HEADER: IDENTITY, STATUS PILLS, MRP & ACTIONS */}
      {/* ========================================================= */}
      <div className="dossier-hero-card">
        {/* Top Breadcrumb & Live Website Preview */}
        <div className="dossier-hero-top">
          <nav className="dossier-breadcrumb">
            <Link to="/admin/products" className="text-brand-purple font-bold inline-flex items-center gap-1 hover:underline">
              <Package size={13} />
              <span>Products</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span>Catalog</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">{p.name}</span>
          </nav>

          <a
            href={`${websiteBase}/products/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="dossier-preview-link"
          >
            <ExternalLink size={12} />
            <span>Public Website Preview</span>
          </a>
        </div>

        {/* Hero Identity & Commercial MRP Box */}
        <div className="dossier-hero-main">
          <div className="dossier-hero-identity">
            <div className="dossier-title-row">
              <h1 className="dossier-title">{p.name}</h1>

              {p.productCode && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(p.productCode || '', 'code')}
                  className="dossier-sku-btn"
                  title="Click to copy SKU"
                >
                  <span>{p.productCode}</span>
                  {copiedField === 'code' ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} className="text-slate-400" />}
                </button>
              )}
            </div>

            <p className="dossier-subtitle">
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                {p.genericName}
              </span>
              <span className="text-slate-300">•</span>
              <span>Brand: <strong className="text-slate-900">{p.brandName || 'Zeal Pharma'}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-brand-purple font-bold">
                {categoryName} {subCategoryName ? `› ${subCategoryName}` : ''}
              </span>
            </p>

            <div className="dossier-badge-row">
              <span className={p.isActive ? 'dossier-badge-active' : 'dossier-badge-inactive'}>
                <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {p.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>

              <span className={p.status === 'PUBLISHED' ? 'dossier-badge-published' : 'dossier-badge-draft'}>
                {p.status || 'PUBLISHED'}
              </span>

              <span className="dossier-badge-rx">
                {p.prescriptionType || 'Rx'}
              </span>

              <span className="dossier-badge-stock">
                {p.availabilityStatus === 'AVAILABLE' ? 'IN STOCK' : p.availabilityStatus || 'AVAILABLE'}
              </span>

              {p.isNewLaunch && (
                <span className="dossier-badge-launch">
                  <Sparkles size={11} className="text-amber-500" />
                  <span>NEW LAUNCH</span>
                </span>
              )}

              {p.isFeatured && (
                <span className="dossier-badge-featured">
                  <Star size={11} className="text-purple-600 fill-purple-600" />
                  <span>FEATURED</span>
                </span>
              )}
            </div>
          </div>

          {/* Dedicated MRP Commercial Badge */}
          <div className="dossier-mrp-box">
            <span className="dossier-mrp-label">Maximum Retail Price</span>
            <div className="dossier-mrp-value">
              {p.mrp !== undefined && p.mrp !== null ? `₹${p.mrp}` : 'Price on Request'}
            </div>
            <span className="dossier-mrp-sub">Incl. of all taxes & margins</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="dossier-hero-actions">
          <div className="dossier-action-btn-group">
            <Link to="/admin/products" className="dossier-action-btn dossier-action-btn-secondary">
              <ArrowLeft size={14} />
              <span>Back to Catalog</span>
            </Link>

            <Link to={`/admin/products/edit/${p._id}`} className="dossier-action-btn dossier-action-btn-primary">
              <Edit2 size={13} />
              <span>Edit Formulation</span>
            </Link>

            <button
              type="button"
              disabled={duplicateLoading}
              onClick={handleDuplicate}
              className="dossier-action-btn dossier-action-btn-secondary"
            >
              <Copy size={13} />
              <span>{duplicateLoading ? 'Cloning...' : 'Duplicate'}</span>
            </button>

            <a
              href={productService.getVisualAidUrl(p._id)}
              target="_blank"
              rel="noopener noreferrer"
              className="dossier-action-btn dossier-action-btn-brand"
            >
              <Download size={13} />
              <span>Visual Aid PDF</span>
            </a>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="dossier-action-btn dossier-action-btn-danger"
          >
            <Trash2 size={13} />
            <span>Delete Formulation</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. FOUR-METRIC QUICK STATS STRIP */}
      {/* ========================================================= */}
      <div className="dossier-metric-grid">
        <div className="dossier-metric-item">
          <div className="dossier-metric-icon bg-purple-50 text-brand-purple shrink-0">
            <Building2 size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 font-semibold block whitespace-nowrap">Supply Distribution</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">
              {p.allowEnquiry ? 'Enquiries Open' : 'Enquiry Disabled'}
            </span>
          </div>
        </div>

        <div className="dossier-metric-item">
          <div className="dossier-metric-icon bg-amber-50 text-amber-600 shrink-0">
            <Star size={20} className="fill-amber-500" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 font-semibold block whitespace-nowrap">Doctor Rating</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">
              {p.averageRating ? p.averageRating.toFixed(1) : '5.0'} / 5.0{' '}
              <span className="text-[11px] text-slate-400 font-normal">({p.totalReviews || 0} reviews)</span>
            </span>
          </div>
        </div>

        <div className="dossier-metric-item">
          <div className="dossier-metric-icon bg-sky-50 text-sky-600 shrink-0">
            <Eye size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 font-semibold block whitespace-nowrap">Doctor & Stockist Views</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">{p.viewCount || 0} Catalog Views</span>
          </div>
        </div>

        <div className="dossier-metric-item">
          <div className="dossier-metric-icon bg-emerald-50 text-emerald-600 shrink-0">
            <Activity size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 font-semibold block whitespace-nowrap">B2B Stockists / Distribution Leads</span>
            <span className="text-xs sm:text-sm font-bold text-brand-purple truncate block">{p.enquiryCount || 0} Inquiries Received</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN DOSSIER LAYOUT (LEFT 360px + RIGHT EXPANDED) */}
      {/* ========================================================= */}
      <div className="dossier-main-grid">
        {/* ========================================================= */}
        {/* LEFT COLUMN: VISUAL PACKAGING & SPECS BLUEPRINT */}
        {/* ========================================================= */}
        <div className="dossier-col-left">
          {/* Packaging Showcase */}
          <div className="dossier-card">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-extrabold uppercase text-slate-400 tracking-wider whitespace-nowrap">
                Product Visual Aid
              </span>
              <span className="dossier-pill-clinical">
                <Sparkles size={11} className="text-brand-purple" />
                <span>Clinical Grade</span>
              </span>
            </div>

            {/* Main Visual Image Box */}
            <div className="dossier-img-box">
              {currentDisplayImage ? (
                <img
                  src={currentDisplayImage}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <Package size={48} className="text-slate-300 mx-auto mb-2" />
                  <span className="text-xs font-semibold">No Packaging Image</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="dossier-thumb-strip">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGalleryImg(img)}
                    className={`dossier-thumb-btn ${currentDisplayImage === img ? 'dossier-thumb-active' : 'dossier-thumb-inactive'}`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Technical Blueprint Specifications */}
          <div className="dossier-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 m-0 flex items-center gap-2 whitespace-nowrap">
                <Pill size={15} className="text-brand-purple shrink-0" />
                <span>Technical Blueprint</span>
              </h3>
              <span className="dossier-pill-verified">
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span>Verified Specs</span>
              </span>
            </div>

            <div className="dossier-blueprint-grid">
              {/* Generic Molecule (API) */}
              <div className="dossier-api-card">
                <div className="flex flex-col min-w-0">
                  <span className="dossier-blueprint-label whitespace-nowrap">Generic Molecule (API)</span>
                  <span className="dossier-api-text truncate" title={p.genericName}>{p.genericName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(p.genericName, 'api')}
                  className="p-1.5 rounded-lg bg-white border border-purple-200 text-brand-purple hover:bg-purple-50 transition-colors cursor-pointer shrink-0"
                  title="Copy API name"
                >
                  {copiedField === 'api' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-400" />}
                </button>
              </div>

              {p.brandName && (
                <div className="dossier-blueprint-item">
                  <span className="dossier-blueprint-label whitespace-nowrap">Brand / Trademark</span>
                  <span className="dossier-blueprint-val text-brand-purple truncate">{p.brandName}</span>
                </div>
              )}

              <div className="dossier-grid-2">
                <div className="dossier-blueprint-item">
                  <span className="dossier-blueprint-label whitespace-nowrap">Dosage Form</span>
                  <span className="dossier-blueprint-val truncate">{p.dosageForm}</span>
                </div>
                <div className="dossier-blueprint-item">
                  <span className="dossier-blueprint-label whitespace-nowrap">Strength</span>
                  <span className="dossier-blueprint-val truncate">{p.strength || 'N/A'}</span>
                </div>
              </div>

              <div className="dossier-grid-2">
                <div className="dossier-blueprint-item">
                  <span className="dossier-blueprint-label whitespace-nowrap">Packaging</span>
                  <span className="dossier-blueprint-val truncate">{p.packaging}</span>
                </div>
                <div className="dossier-blueprint-item">
                  <span className="dossier-blueprint-label whitespace-nowrap">Pack Size</span>
                  <span className="dossier-blueprint-val truncate">
                    {p.packSize?.value ? `${p.packSize.value} ${p.packSize.unit || ''}` : p.packaging}
                  </span>
                </div>
              </div>

              <div className="dossier-blueprint-item">
                <span className="dossier-blueprint-label whitespace-nowrap">Therapeutic Division</span>
                <span className="text-xs font-extrabold text-brand-purple break-words">
                  {categoryName} {subCategoryName ? `› ${subCategoryName}` : ''}
                </span>
              </div>

              <div className="dossier-blueprint-item">
                <span className="dossier-blueprint-label whitespace-nowrap">Manufacturing Facility</span>
                <span className="dossier-blueprint-val break-words">{p.manufacturer || 'Zeal Pharmacure'}</span>
              </div>

              {p.licenseNumber && (
                <div className="dossier-blueprint-item">
                  <span className="dossier-blueprint-label whitespace-nowrap">Drug Mfg License No.</span>
                  <div className="mt-0.5">
                    <span className="font-mono text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md font-extrabold text-slate-800 inline-block whitespace-nowrap">
                      {p.licenseNumber}
                    </span>
                  </div>
                </div>
              )}

              <div className="dossier-blueprint-item">
                <span className="dossier-blueprint-label whitespace-nowrap">Country of Origin</span>
                <span className="dossier-blueprint-val whitespace-nowrap">{p.countryOfOrigin || 'India'}</span>
              </div>
            </div>
          </div>

          {/* Official Collateral Downloads */}
          <div className="dossier-card">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5 m-0 flex items-center gap-2 whitespace-nowrap">
              <FileCheck size={15} className="text-brand-purple shrink-0" />
              <span>Collateral Downloads</span>
            </h3>

            <div className="flex flex-col gap-2.5">
              <a
                href={productService.getVisualAidUrl(p._id)}
                target="_blank"
                rel="noopener noreferrer"
                className="dossier-collateral-btn"
              >
                <div className="flex items-center gap-2.5">
                  <Download size={15} />
                  <span>Visual Aid Monograph PDF</span>
                </div>
                <span className="bg-white border border-purple-200 px-2 py-0.5 rounded text-[10px] text-brand-purple font-extrabold">PDF</span>
              </a>

              {p.brochureUrl && (
                <a
                  href={p.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dossier-collateral-btn"
                >
                  <div className="flex items-center gap-2.5">
                    <ExternalLink size={15} />
                    <span>{p.brochureName || 'Official Product Brochure'}</span>
                  </div>
                  <span className="bg-white border border-purple-200 px-2 py-0.5 rounded text-[10px] text-brand-purple font-extrabold">DOC</span>
                </a>
              )}
            </div>
          </div>

          {/* Database System Audit Card */}
          <div className="dossier-card">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5 m-0 flex items-center gap-2">
              <Clock size={15} className="text-brand-purple" />
              <span>Audit Trail & System Metadata</span>
            </h3>

            <div className="dossier-audit-box">
              <div className="dossier-audit-row">
                <span className="text-slate-500 font-semibold">Database ID:</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(p._id, 'id')}
                  className="font-mono text-[11px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-800 flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors font-bold"
                  title="Copy MongoDB ID"
                >
                  <span>{p._id}</span>
                  {copiedField === 'id' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} className="text-slate-400" />}
                </button>
              </div>

              <div className="dossier-audit-row">
                <span className="text-slate-500 font-semibold">Created:</span>
                <span className="font-bold text-slate-800">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>

              {p.updatedAt && (
                <div className="dossier-audit-row">
                  <span className="text-slate-500 font-semibold">Last Modified:</span>
                  <span className="font-bold text-slate-800">{new Date(p.updatedAt).toLocaleDateString()}</span>
                </div>
              )}

              {p.publishedAt && (
                <div className="dossier-audit-row">
                  <span className="text-slate-500 font-semibold">Published Date:</span>
                  <span className="font-bold text-slate-800">{new Date(p.publishedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 5 DEDICATED CLINICAL DOSSIER TABS */}
        {/* ========================================================= */}
        <div className="dossier-col-right">
          <div className="dossier-tab-card">
            {/* Elegant 5-Tab Bar (All Details Removed) */}
            <div className="dossier-tab-bar">
              <button
                type="button"
                onClick={() => setActiveTab('clinical')}
                className={`dossier-tab-btn ${activeTab === 'clinical' ? 'brand-tab-active' : 'brand-tab-inactive'}`}
              >
                <Pill size={14} />
                <span>Clinical Specs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('safety')}
                className={`dossier-tab-btn ${activeTab === 'safety' ? 'brand-tab-active' : 'brand-tab-inactive'}`}
              >
                <AlertTriangle size={14} />
                <span>Safety & Warnings</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('commercial')}
                className={`dossier-tab-btn ${activeTab === 'commercial' ? 'brand-tab-active' : 'brand-tab-inactive'}`}
              >
                <Building2 size={14} />
                <span>Commercial & Supply</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('regulatory')}
                className={`dossier-tab-btn ${activeTab === 'regulatory' ? 'brand-tab-active' : 'brand-tab-inactive'}`}
              >
                <ShieldCheck size={14} />
                <span>Regulatory</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`dossier-tab-btn ${activeTab === 'seo' ? 'brand-tab-active' : 'brand-tab-inactive'}`}
              >
                <Globe size={14} />
                <span>SEO & Web Tags</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="dossier-tab-body">
              {/* ========================================================= */}
              {/* TAB 1: CLINICAL PHARMACOLOGY */}
              {/* ========================================================= */}
              {activeTab === 'clinical' && (
                <div className="dossier-section-content">
                  <div className="dossier-section-header">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center shrink-0">
                      <Pill size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 m-0">Clinical Pharmacology & Composition</h3>
                      <p className="text-xs text-slate-400 m-0 mt-0.5">Chemical constitution, pharmacokinetics, and therapeutic actions</p>
                    </div>
                  </div>

                  {/* Active Composition Box */}
                  <div className="dossier-composition-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11.5px] font-extrabold text-brand-purple uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={13} />
                        <span>Active Pharmaceutical Composition (API)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(p.composition, 'comp')}
                        className="text-xs font-bold text-brand-purple flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copiedField === 'comp' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        <span>{copiedField === 'comp' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="dossier-composition-text">{p.composition}</div>
                  </div>

                  {/* Therapeutic Class & Indication Tags */}
                  <div className="dossier-grid-2">
                    <div className="dossier-highlight-card">
                      <span className="dossier-info-title">
                        <Tag size={14} className="text-brand-purple" />
                        <span>Therapeutic Classification</span>
                      </span>
                      <div>
                        <span className="dossier-badge-pill">
                          {p.therapeuticClass || 'General Therapeutics'}
                        </span>
                      </div>
                    </div>

                    <div className="dossier-highlight-card">
                      <span className="dossier-info-title">
                        <Activity size={14} className="text-brand-purple" />
                        <span>Clinical Indications & Conditions</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(p.indicationTags) && p.indicationTags.length > 0 ? (
                          p.indicationTags.map((tag, idx) => (
                            <span key={idx} className="dossier-tag-pill">
                              {tag}
                            </span>
                          ))
                        ) : Array.isArray(p.indications) && p.indications.length > 0 ? (
                          p.indications.map((ind: any, idx) => (
                            <span key={idx} className="dossier-tag-pill">
                              {typeof ind === 'object' ? ind.name : ind}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic">No specific indication tags recorded.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Doctor Aid Synopsis Overview */}
                  {p.shortDescription && (
                    <div className="dossier-quote-card">
                      <span className="dossier-info-title">
                        <Stethoscope size={14} className="text-brand-purple" />
                        <span>Doctor Aid Synopsis / Clinical Overview</span>
                      </span>
                      <p className="text-sm font-medium text-slate-800 m-0 leading-relaxed italic">
                        "{p.shortDescription}"
                      </p>
                    </div>
                  )}

                  {/* Detailed Pharmacology */}
                  {p.description && (
                    <div className="dossier-highlight-card">
                      <span className="dossier-info-title">
                        <BookOpen size={14} className="text-brand-purple" />
                        <span>In-Depth Medical Pharmacology & Mechanism</span>
                      </span>
                      <div className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-100">
                        {p.description}
                      </div>
                    </div>
                  )}

                  {/* Dosage & Administration */}
                  {p.howToUse && (
                    <div className="dossier-emerald-box">
                      <span className="dossier-emerald-title">
                        <Activity size={14} />
                        <span>Dosage & Clinical Administration Guidelines</span>
                      </span>
                      <p className="dossier-emerald-text">{p.howToUse}</p>
                    </div>
                  )}

                  {/* Storage Conditions */}
                  {p.storage && (
                    <div className="dossier-slate-box">
                      <span className="dossier-slate-title">
                        <Thermometer size={14} className="text-slate-600" />
                        <span>Recommended Storage & Environmental Stability</span>
                      </span>
                      <p className="dossier-slate-text">{p.storage}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: SAFETY & WARNINGS */}
              {/* ========================================================= */}
              {activeTab === 'safety' && (
                <div className="dossier-section-content">
                  <div className="dossier-section-header">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 m-0">Safety, Vigilance & Contraindications</h3>
                      <p className="text-xs text-slate-400 m-0 mt-0.5">Side effects, medical cautions, toxicology, and pregnancy safety</p>
                    </div>
                  </div>

                  {/* Mandatory Black Box Warning */}
                  {p.warnings && (
                    <div className="dossier-blackbox-card">
                      <div className="dossier-blackbox-header">
                        <AlertOctagon size={15} />
                        <span>Mandatory Black Box Clinical Warning</span>
                      </div>
                      <div className="dossier-blackbox-body">
                        {p.warnings}
                      </div>
                    </div>
                  )}

                  {/* Known Adverse Reactions */}
                  <div className="dossier-amber-box">
                    <span className="dossier-amber-title">
                      <AlertTriangle size={14} />
                      <span>Known Adverse Reactions & Side Effects</span>
                    </span>
                    <p className="dossier-amber-text">
                      {p.sideEffects || 'No common adverse side effects recorded.'}
                    </p>
                  </div>

                  {/* Precautions & Clinical Vigilance */}
                  <div className="dossier-slate-box">
                    <span className="dossier-slate-title">
                      <ShieldCheck size={14} className="text-slate-600" />
                      <span>Precautions & Clinical Vigilance</span>
                    </span>
                    <p className="dossier-slate-text">
                      {p.precautions || 'Standard pharmaceutical precautions apply. Follow prescribed dosage.'}
                    </p>
                  </div>

                  {/* Contraindications */}
                  <div className="dossier-rose-box">
                    <span className="dossier-rose-title">
                      <AlertOctagon size={14} />
                      <span>Medical Contraindications</span>
                    </span>
                    <p className="dossier-rose-text">
                      {p.contraindications || 'Hypersensitivity to the active pharmaceutical ingredient or any excipients.'}
                    </p>
                  </div>

                  {/* Pregnancy & Lactation Safety Grid */}
                  <div className="dossier-grid-2">
                    <div className="dossier-advisory-card">
                      <div className="dossier-advisory-icon">
                        <Baby size={20} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="dossier-info-title">Pregnancy Safety Advisory</span>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 m-0 leading-snug">
                          {p.pregnancyInfo || 'Consult physician before administration during pregnancy.'}
                        </p>
                      </div>
                    </div>

                    <div className="dossier-advisory-card">
                      <div className="dossier-advisory-icon">
                        <HeartPulse size={20} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="dossier-info-title">Lactation Safety Advisory</span>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 m-0 leading-snug">
                          {p.lactationInfo || 'Consult physician before use while nursing.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: COMMERCIAL & SUPPLY CHAIN */}
              {/* ========================================================= */}
              {activeTab === 'commercial' && (
                <div className="dossier-section-content">
                  <div className="dossier-section-header">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 m-0">Commercial & Supply Chain Status</h3>
                      <p className="text-xs text-slate-400 m-0 mt-0.5">Stock availability, distribution enquiry channels, and pricing matrix</p>
                    </div>
                  </div>

                  <div className="dossier-grid-3">
                    <div className="dossier-metric-card">
                      <div className="dossier-metric-header">
                        <Package size={14} className="text-emerald-600" />
                        <span>Stock Supply Status</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="dossier-metric-val text-emerald-700">
                          {p.availabilityStatus || 'AVAILABLE'}
                        </span>
                      </div>
                    </div>

                    <div className="dossier-metric-card">
                      <div className="dossier-metric-header">
                        <Users size={14} className={p.allowEnquiry ? 'text-emerald-600' : 'text-red-500'} />
                        <span>B2B Stockists / Distribution Enquiries</span>
                      </div>
                      <span className={`dossier-metric-val ${p.allowEnquiry ? 'text-emerald-600' : 'text-red-500'}`}>
                        {p.allowEnquiry ? 'Accepting Inquiries' : 'Enquiries Disabled'}
                      </span>
                    </div>

                    <div className="dossier-metric-card">
                      <div className="dossier-metric-header">
                        <Star size={14} className={p.isFeatured ? 'text-amber-500' : 'text-slate-400'} />
                        <span>Homepage Showcase</span>
                      </div>
                      <span className="dossier-metric-val">
                        {p.isFeatured ? `Featured (Order: ${p.featuredOrder || 0})` : 'Standard Catalog'}
                      </span>
                    </div>

                    <div className="dossier-metric-card">
                      <div className="dossier-metric-header">
                        <Sparkles size={14} className="text-brand-purple" />
                        <span>Commercial Stage</span>
                      </div>
                      <span className="dossier-metric-val">
                        {p.isNewLaunch ? 'New Commercial Launch' : 'Established Formulation'}
                      </span>
                    </div>

                    <div className="dossier-metric-card">
                      <div className="dossier-metric-header">
                        <Calendar size={14} className="text-slate-500" />
                        <span>Launch Date</span>
                      </div>
                      <span className="dossier-metric-val">
                        {p.launchDate ? new Date(p.launchDate).toLocaleDateString() : 'Active in Circulation'}
                      </span>
                    </div>

                    <div className="dossier-metric-card">
                      <div className="dossier-metric-header">
                        <TrendingUp size={14} className="text-brand-purple" />
                        <span>Doctor Inquiries</span>
                      </div>
                      <span className="dossier-metric-val text-brand-purple">
                        {p.enquiryCount || 0} Lead Conversions
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 4: REGULATORY & COMPLIANCE */}
              {/* ========================================================= */}
              {activeTab === 'regulatory' && (
                <div className="dossier-section-content">
                  <div className="dossier-section-header">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 m-0">Regulatory & Quality Compliance</h3>
                      <p className="text-xs text-slate-400 m-0 mt-0.5">DCGI approval status, pharmacopoeia standards, and legal certifications</p>
                    </div>
                  </div>

                  <div className="dossier-grid-2">
                    <div className="dossier-highlight-card">
                      <span className="dossier-info-title">
                        <Award size={14} className="text-brand-purple" />
                        <span>Drug Schedule Classification</span>
                      </span>
                      <div>
                        <span className="dossier-badge-pill">
                          {p.prescriptionType || 'Schedule H'}
                        </span>
                      </div>
                    </div>

                    <div className="dossier-highlight-card">
                      <span className="dossier-info-title">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span>Manufacturing Standards</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-sm font-extrabold text-slate-900">
                          WHO-GMP Certified Facility
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="dossier-highlight-card">
                    <span className="dossier-info-title">
                      <FileText size={14} className="text-brand-purple" />
                      <span>DCGI & Regulatory Monograph Declarations</span>
                    </span>
                    <div className="text-sm font-medium text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                      {p.regulatoryInfo ||
                        'Manufactured and packaged in WHO-GMP conforming facility. Strictly conforms to Indian Pharmacopoeia (IP) and British Pharmacopoeia (BP) specifications with full batch test records.'}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 5: SEO & WEB METADATA */}
              {/* ========================================================= */}
              {activeTab === 'seo' && (
                <div className="dossier-section-content">
                  <div className="dossier-section-header">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Globe size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 m-0">Search Engine Visibility & Meta Tags</h3>
                      <p className="text-xs text-slate-400 m-0 mt-0.5">Google SERP preview, crawler keywords, and OpenGraph tags</p>
                    </div>
                  </div>

                  {/* Google Search Result Simulation Card */}
                  <div className="dossier-highlight-card">
                    <span className="text-[10.5px] font-extrabold uppercase text-slate-400 tracking-wider mb-0.5">
                      Google Search Result Snippet Simulation
                    </span>
                    <div className="text-xs text-slate-500 font-medium">
                      https://zealpharma.com › products › {p.slug}
                    </div>
                    <a
                      href={`${websiteBase}/products/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg font-bold text-blue-700 hover:underline block leading-snug"
                    >
                      {p.seo?.metaTitle || `${p.name} - Zeal Pharmaceuticals`}
                    </a>
                    <p className="text-xs text-slate-600 m-0 leading-relaxed">
                      {p.seo?.metaDescription ||
                        p.shortDescription ||
                        `${p.name} (${p.genericName}) by Zeal Pharma. Premium pharmaceutical formulation conforming to WHO-GMP standards.`}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="dossier-highlight-card">
                      <span className="dossier-info-title mb-1">Permanent Canonical Slug</span>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-brand-purple bg-purple-50 border border-purple-200 px-3.5 py-2 rounded-lg font-bold">
                          /products/{p.slug}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`/products/${p.slug}`, 'slug')}
                          className="text-brand-purple text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:underline bg-white border border-purple-200 px-3 py-2 rounded-lg"
                        >
                          {copiedField === 'slug' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          <span>{copiedField === 'slug' ? 'Copied' : 'Copy Slug'}</span>
                        </button>
                      </div>
                    </div>

                    {Array.isArray(p.seo?.keywords) && p.seo.keywords.length > 0 && (
                      <div className="dossier-highlight-card">
                        <span className="dossier-info-title mb-1">Target SEO Keywords</span>
                        <div className="flex flex-wrap gap-2">
                          {p.seo.keywords.map((kw, i) => (
                            <span key={i} className="dossier-tag-pill">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
