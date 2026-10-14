import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Plus,
  Image as ImageIcon,
  X,
  Copy,
  ArrowLeft,
  ShieldCheck,
  Pill,
  Save,
  Eye,
  Trash2,
  ChevronDown,
  Sparkles,
  Layers,
  FileText,
  Package,
  Activity,
  Check,
} from 'lucide-react';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
import { galleryService } from '../api/galleryService';
import { MediaGalleryModal, ThemeSelect, ThemeQuillEditor, ZealLoader } from '../components/common';
import { useAppSelector } from '../store';
import { selectEffectivePermissions, selectCurrentRole } from '../store/slices/authSlice';
import type { ICategory, ISubCategory, IProduct } from '../types';

const DOSAGE_FORMS = [
  'Tablets',
  'Capsules',
  'Syrup',
  'Suspension',
  'Toothpaste',
  'Paste',
  'Injection',
  'Ointment',
  'Gel',
  'Dry Syrup',
  'Drops',
  'Softgel',
  'Powder / Sachet',
  'Eye Drops',
  'Nasal Spray',
  'Inhaler',
];

const PRESCRIPTION_TYPES = [
  { value: 'Schedule H', label: 'Schedule H (Prescription Required)', badge: 'Rx Required', color: '#EF4444' },
  { value: 'Rx', label: 'Rx (Medical Prescription)', badge: 'Prescription', color: '#DC2626' },
  { value: 'OTC', label: 'OTC (Over The Counter)', badge: 'OTC', color: '#10B981' },
  { value: 'OTC / General', label: 'OTC / General (Over The Counter)', badge: 'OTC / General', color: '#10B981' },
  { value: 'Schedule H1', label: 'Schedule H1 (Controlled Rx)', badge: 'Strict Rx', color: '#B91C1C' },
  { value: 'General', label: 'General / Consumer Healthcare', badge: 'General', color: '#6828DC' },
];

export const AdminAddProductPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const activeRole = useAppSelector(selectCurrentRole);
  const effectivePermissions = useAppSelector(selectEffectivePermissions);

  const hasPerm = (perm: string) => {
    if (activeRole === 'SUPER_ADMIN') return true;
    if (!effectivePermissions || effectivePermissions.length === 0) return false;
    if (effectivePermissions.includes('*')) return true;
    return effectivePermissions.includes(perm);
  };

  const canAccess = isEditMode ? hasPerm('product:update') : hasPerm('product:create');

  // Categories & SubCategories from Database
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  // Page state
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Media
  const [primaryImage, setPrimaryImage] = useState<string>('');
  const [mediaGallery, setMediaGallery] = useState<Array<{ url: string; title: string; altText: string }>>([]);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [activeGallerySlot, setActiveGallerySlot] = useState<'primary' | 'gallery'>('primary');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Optional Section Toggle (Keeps form clean & not overwhelmed)
  const [showAdvancedSafety, setShowAdvancedSafety] = useState(false);

  // Main Form Data
  const [formData, setFormData] = useState({
    // Core Identity
    name: '',
    slug: '',
    productCode: '',
    brandName: '',
    genericName: '',
    composition: '',
    strength: '',

    // Classification
    category: '',
    subCategory: '',
    subCategoryName: '',
    dosageForm: 'Tablets',
    packaging: '10 x 10 Tablets',
    prescriptionType: 'Schedule H',

    // Clinical & Usage Overview
    shortDescription: '',
    indications: '',
    howToUse: '',
    storage: 'Store in a cool, dry & dark place below 25°C. Protect from moisture & direct sunlight.',

    // Advanced Safety (Optional / Collapsible)
    sideEffects: '',
    precautions: '',
    contraindications: '',
    warnings: '',
    licenseNumber: '',
    countryOfOrigin: 'India',

    // Commercial & Publishing
    mrp: '',
    status: 'PUBLISHED',
    availabilityStatus: 'AVAILABLE',
    isFeatured: false,
    isNewLaunch: false,
    allowEnquiry: true,
  });

  // Load Categories & Product (if Edit mode)
  useEffect(() => {
    const initData = async () => {
      try {
        setLoadingCategories(true);
        const cats = await categoryService.getCategories();
        setCategories(cats);

        if (isEditMode && id) {
          setInitialLoading(true);
          const prod = await productService.getProductBySlug(id);
          if (prod) {
            populateForm(prod, cats);
          } else {
            setErrorMsg('Could not find formulation details to edit.');
          }
        } else if (cats.length > 0) {
          const defaultCatId = cats[0]._id;
          setFormData((prev) => ({ ...prev, category: defaultCatId }));
          loadSubCategories(defaultCatId);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load categories or formulation details.');
      } finally {
        setLoadingCategories(false);
        setInitialLoading(false);
      }
    };

    initData();
  }, [id, isEditMode]);

  const loadSubCategories = async (catId: string) => {
    if (!catId) {
      setSubCategories([]);
      return;
    }
    try {
      setLoadingSubCategories(true);
      const subs = await categoryService.getSubCategories(catId);
      setSubCategories(subs);
    } catch {
      setSubCategories([]);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const populateForm = async (prod: IProduct, catsList: ICategory[]) => {
    const catId =
      typeof prod.category === 'object' && prod.category?._id
        ? prod.category._id
        : typeof prod.category === 'string'
          ? prod.category
          : catsList[0]?._id || '';

    const subCatId =
      typeof prod.subCategory === 'object' && prod.subCategory?._id
        ? prod.subCategory._id
        : typeof prod.subCategory === 'string'
          ? prod.subCategory
          : '';

    if (catId) {
      await loadSubCategories(catId);
    }

    const indicationsStr =
      Array.isArray(prod.indicationTags) && prod.indicationTags.length > 0
        ? prod.indicationTags.join(', ')
        : Array.isArray(prod.indications)
          ? prod.indications.map((i: any) => (typeof i === 'object' ? i.name : i)).join(', ')
          : '';

    const formattedGallery = Array.isArray(prod.mediaGallery)
      ? prod.mediaGallery.map((m: any) => {
        if (typeof m === 'object' && m?.url) {
          return { url: m.url, title: m.title || '', altText: m.altText || '' };
        }
        return { url: String(m), title: '', altText: '' };
      })
      : [];

    setPrimaryImage(prod.featuredImage || '');
    setMediaGallery(formattedGallery);

    // If advanced fields have data, open the accordion automatically
    if (prod.sideEffects || prod.precautions || prod.contraindications || prod.warnings || prod.licenseNumber) {
      setShowAdvancedSafety(true);
    }

    setFormData({
      name: prod.name || '',
      slug: prod.slug || '',
      productCode: prod.productCode || '',
      brandName: prod.brandName || '',
      genericName: prod.genericName || '',
      composition: prod.composition || '',
      strength: prod.strength || '',
      category: catId,
      subCategory: subCatId,
      subCategoryName: prod.subCategoryName || '',
      dosageForm: prod.dosageForm || 'Tablets',
      packaging: prod.packaging || '10 x 10 Tablets',
      prescriptionType: prod.prescriptionType || 'Schedule H',
      shortDescription: prod.shortDescription || '',
      indications: indicationsStr,
      howToUse: prod.howToUse || '',
      storage: prod.storage || 'Store in a cool, dry & dark place below 25°C. Protect from moisture & direct sunlight.',
      sideEffects: prod.sideEffects || '',
      precautions: prod.precautions || '',
      contraindications: prod.contraindications || '',
      warnings: prod.warnings || '',
      licenseNumber: prod.licenseNumber || '',
      countryOfOrigin: prod.countryOfOrigin || 'India',
      mrp: prod.mrp !== undefined && prod.mrp !== null ? String(prod.mrp) : '',
      status: prod.status || (prod.isActive ? 'PUBLISHED' : 'DRAFT'),
      availabilityStatus: prod.availabilityStatus || 'AVAILABLE',
      isFeatured: Boolean(prod.isFeatured),
      isNewLaunch: Boolean(prod.isNewLaunch),
      allowEnquiry: prod.allowEnquiry !== false,
    });
  };

  const handleCategoryChange = (catId: string) => {
    setFormData((prev) => ({ ...prev, category: catId, subCategory: '' }));
    clearFieldError('category');
    loadSubCategories(catId);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    clearFieldError(name);
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };
        // Auto-generate clean slug from name if adding new product and slug wasn't manually edited
        if (name === 'name' && !isEditMode) {
          next.slug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        }
        return next;
      });
    }
  };

  // Direct File Upload from Computer
  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      setErrorMsg('');
      const uploaded = await galleryService.uploadImages(Array.from(files), 'PRODUCT');
      if (uploaded.length > 0) {
        const formattedUrl = galleryService.formatUrl(uploaded[0].url);
        if (activeGallerySlot === 'primary') {
          setPrimaryImage(formattedUrl);
        } else {
          setMediaGallery((prev) => [...prev, { url: formattedUrl, title: '', altText: '' }]);
        }
        setSuccessMsg('Product packshot uploaded successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleSelectFromGallery = (url: string) => {
    const formattedUrl = galleryService.formatUrl(url);
    if (activeGallerySlot === 'primary') {
      setPrimaryImage(formattedUrl);
    } else {
      setMediaGallery((prev) => [...prev, { url: formattedUrl, title: '', altText: '' }]);
    }
    setGalleryModalOpen(false);
  };

  const handleRemoveGalleryItem = (index: number) => {
    setMediaGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDuplicate = async () => {
    if (!id) return;
    if (!window.confirm(`Create a duplicated draft copy of "${formData.name}"?`)) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const duplicated = await productService.adminDuplicateProduct(id);
      setSuccessMsg('Formulation duplicated successfully as draft! Loading copy...');
      setTimeout(() => {
        navigate(`/admin/products/edit/${duplicated._id}`);
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to duplicate formulation.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (saveAsDraft = false) => {
    setErrorMsg('');
    setSuccessMsg('');

    // Field-level Validations
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = 'Product / Brand Name is required.';
    }
    if (!formData.composition.trim()) {
      errs.composition = 'Active Pharmaceutical Composition is required.';
    }
    if (!formData.category) {
      errs.category = 'Please select a Therapeutic Category.';
    }
    if (!formData.packaging.trim()) {
      errs.packaging = 'Packaging details are required (e.g. 10 x 10 Tablets).';
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});

    setLoading(true);

    try {
      const indicationsList = formData.indications
        ? formData.indications
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        : [];

      const payload: any = {
        name: formData.name.trim(),
        brandName: formData.brandName.trim() || formData.name.trim(),
        genericName: formData.genericName.trim() || undefined,
        composition: formData.composition.trim(),
        strength: formData.strength.trim() || undefined,
        productCode: formData.productCode.trim() || undefined,
        category: formData.category,
        subCategory: formData.subCategory || undefined,
        dosageForm: formData.dosageForm,
        packaging: formData.packaging.trim(),
        prescriptionType: formData.prescriptionType || 'Schedule H',
        shortDescription: formData.shortDescription.trim() || undefined,
        indications: indicationsList,
        indicationTags: indicationsList,
        howToUse: formData.howToUse.trim() || undefined,
        storage: formData.storage.trim() || undefined,
        featuredImage: primaryImage || undefined,
        mediaGallery: mediaGallery.map((m) => ({
          url: m.url,
          title: m.title || '',
          altText: m.altText || '',
        })),
        sideEffects: formData.sideEffects.trim() || undefined,
        precautions: formData.precautions.trim() || undefined,
        contraindications: formData.contraindications.trim() || undefined,
        warnings: formData.warnings.trim() || undefined,
        licenseNumber: formData.licenseNumber.trim() || undefined,
        countryOfOrigin: formData.countryOfOrigin.trim() || 'India',
        mrp: formData.mrp !== '' && formData.mrp !== null ? Number(formData.mrp) : null,
        status: saveAsDraft ? 'DRAFT' : formData.status || 'PUBLISHED',
        isActive: saveAsDraft ? false : formData.status === 'PUBLISHED',
        availabilityStatus: formData.availabilityStatus || 'AVAILABLE',
        isFeatured: Boolean(formData.isFeatured),
        isNewLaunch: Boolean(formData.isNewLaunch),
        allowEnquiry: Boolean(formData.allowEnquiry),
      };

      if (formData.slug && formData.slug.trim()) {
        payload.slug = formData.slug.trim().toLowerCase();
      }

      if (isEditMode && id) {
        await productService.adminUpdateProduct(id, payload);
        setSuccessMsg('Pharmaceutical formulation updated successfully in live catalog!');
      } else {
        await productService.adminCreateProduct(payload);
        setSuccessMsg('New pharmaceutical formulation published successfully!');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save formulation. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  if (!canAccess) {
    return (
      <div style={{ maxWidth: '640px', margin: '60px auto', padding: '36px 32px', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #FECACA', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <AlertCircle size={30} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
          Access Restricted
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
          Your current staff role (<strong>{activeRole}</strong>) does not have permission to {isEditMode ? 'modify or update products' : 'create or add new formulations to the catalog'}. Please contact your administrator if you need access.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/admin')}
            style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#334155', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/admin/products')}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6828DC', color: '#FFFFFF', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}
          >
            View Products
          </button>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#6828DC', fontWeight: 700, fontSize: '15px' }}>
        <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid #EDE9FE', borderTopColor: '#6828DC', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '12px' }} />
        <div>Loading formulation specifications from database...</div>
      </div>
    );
  }

  return (
    <div className="add-product-container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div
        className="page-header-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '5px' }}>
            <Link to="/admin/products" style={{ color: '#6828DC', fontWeight: 700, textDecoration: 'none' }}>
              Products Catalog
            </Link>{' '}
            &gt; <span style={{ color: '#0F172A', fontWeight: 600 }}>{isEditMode ? 'Edit Product' : 'Add Formulation'}</span>
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 900,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: 0,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#F5F3FF',
                border: '1.5px solid #DDD6FE',
                color: '#6828DC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Pill size={20} />
            </div>
            <span>{isEditMode ? `Edit: ${formData.name || 'Formulation'}` : 'Add Pharmaceutical Formulation'}</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
            {isEditMode
              ? 'Update technical product parameters, composition, and commercial visibility.'
              : 'Add a new formulation with real database categories, composition, and packshot assets.'}
          </p>
        </div>

        {/* Action Buttons Top Bar */}
        <div className="header-actions-wrap" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to="/admin/products"
            className="btn btn-secondary"
            style={{
              borderRadius: '9px',
              padding: '9px 16px',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              background: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              color: '#475569',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={15} />
            <span>Cancel</span>
          </Link>

          {isEditMode && id && (
            <button
              type="button"
              onClick={handleDuplicate}
              disabled={loading}
              title="Duplicate formulation"
              style={{
                borderRadius: '9px',
                padding: '9px 14px',
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#475569',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Copy size={15} />
              <span>Duplicate</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            style={{
              borderRadius: '9px',
              padding: '9px 16px',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F1F5F9',
              border: '1.5px solid #E2E8F0',
              color: '#334155',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(false)}
            style={{
              borderRadius: '9px',
              padding: '10px 22px',
              fontSize: '13.5px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(104, 40, 220, 0.28)',
              transition: 'all 0.15s ease',
            }}
          >
            <Save size={16} />
            <span>{loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* 2. NOTIFICATION ALERTS */}
      {successMsg && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1.5px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 18px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            fontSize: '13.5px',
            fontWeight: 600,
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.08)',
          }}
        >
          <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0 }} />
          <div>{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1.5px solid #FECACA',
            color: '#991B1B',
            padding: '12px 18px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            fontSize: '13.5px',
            fontWeight: 600,
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)',
          }}
        >
          <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* 3. STREAMLINED 2-COLUMN LAYOUT (No 5 Confusing Tabs!) */}
      <div className="responsive-product-layout">
        {/* ============================================================== */}
        {/* LEFT COLUMN: PRIMARY FORMULATION & CLINICAL SPECIFICATIONS     */}
        {/* ============================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* CARD 1: PRIMARY FORMULATION IDENTITY */}
          <div className="product-form-card">
            <h2 className="product-form-card-title">
              <Pill size={18} style={{ color: '#6828DC' }} />
              <span>1. Primary Formulation Identity</span>
            </h2>

            <div className="form-grid-2">
              {/* Product Brand Name */}
              <div className="field-group">
                <label className="field-label">
                  Product / Brand Name <span className="required-dot">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. ZEALOX-OZ"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-base"
                  style={{
                    borderColor: fieldErrors.name ? '#EF4444' : undefined,
                    boxShadow: fieldErrors.name ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : undefined,
                  }}
                />
                {fieldErrors.name && (
                  <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Generic / Scientific Name */}
              <div className="field-group">
                <label className="field-label">
                  Generic / Scientific Name
                </label>
                <input
                  type="text"
                  name="genericName"
                  placeholder="e.g. Ofloxacin & Ornidazole Tablets"
                  value={formData.genericName}
                  onChange={handleChange}
                  className="input-base"
                  style={{
                    borderColor: fieldErrors.genericName ? '#EF4444' : undefined,
                    boxShadow: fieldErrors.genericName ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : undefined,
                  }}
                />
                {fieldErrors.genericName && (
                  <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                    {fieldErrors.genericName}
                  </p>
                )}
              </div>
            </div>

            {/* Active Composition */}
            <div className="field-group">
              <label className="field-label">
                Active Pharmaceutical Composition <span className="required-dot">*</span>
              </label>
              <textarea
                name="composition"
                rows={2}
                placeholder="e.g. Each film coated tablet contains: Ofloxacin IP 200 mg, Ornidazole IP 500 mg, Excipients q.s."
                value={formData.composition}
                onChange={handleChange}
                className="input-base"
                style={{
                  resize: 'vertical',
                  minHeight: '60px',
                  borderColor: fieldErrors.composition ? '#EF4444' : undefined,
                  boxShadow: fieldErrors.composition ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : undefined,
                }}
              />
              {fieldErrors.composition && (
                <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                  {fieldErrors.composition}
                </p>
              )}
            </div>

            <div className="form-grid-3">
              {/* Strength */}
              <div className="field-group">
                <label className="field-label">Strength</label>
                <input
                  type="text"
                  name="strength"
                  placeholder="e.g. 200mg + 500mg"
                  value={formData.strength}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>

              {/* Product Code / SKU */}
              <div className="field-group">
                <label className="field-label">Product Code / SKU</label>
                <input
                  type="text"
                  name="productCode"
                  placeholder="e.g. ZL-OX-02"
                  value={formData.productCode}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>

              {/* URL Slug Preview */}
              <div className="field-group">
                <label className="field-label">URL Slug</label>
                <input
                  type="text"
                  name="slug"
                  placeholder="e.g. zealox-oz"
                  value={formData.slug}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>
            </div>

            {/* Short Medical Overview */}
            <div className="field-group">
              <ThemeQuillEditor
                label={
                  <span className="field-label" style={{ marginBottom: 0 }}>
                    Short Medical Overview &amp; Clinical Description
                  </span>
                }
                toolbarPreset="standard"
                placeholder="Brief summary of the formulation for product catalog and doctors' visual aid..."
                value={formData.shortDescription}
                onChange={(val) => setFormData((prev) => ({ ...prev, shortDescription: val }))}
                minHeight="110px"
              />
            </div>
          </div>

          {/* CARD 2: CLASSIFICATION & PACKAGING */}
          <div className="product-form-card">
            <h2 className="product-form-card-title">
              <Layers size={18} style={{ color: '#6828DC' }} />
              <span>2. Classification & Packaging</span>
            </h2>

            <div className="form-grid-2">
              {/* Real DB Therapeutic Category */}
              <div className="field-group">
                <label className="field-label">
                  Therapeutic Category <span className="required-dot">*</span>
                </label>
                {loadingCategories ? (
                  <ZealLoader variant="inline" size="sm" title="Loading categories..." />
                ) : (
                  <ThemeSelect
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    options={categories.map((c) => ({ value: c._id, label: c.name }))}
                    placeholder="Select Category"
                    style={{
                      borderColor: fieldErrors.category ? '#EF4444' : undefined,
                      boxShadow: fieldErrors.category ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : undefined,
                    }}
                  />
                )}
                {fieldErrors.category && (
                  <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                    {fieldErrors.category}
                  </p>
                )}
              </div>

              {/* Real DB SubCategory / Division */}
              <div className="field-group">
                <label className="field-label">Sub-Category / Division</label>
                {loadingSubCategories ? (
                  <ZealLoader variant="inline" size="sm" title="Loading divisions..." />
                ) : (
                  <ThemeSelect
                    value={formData.subCategory}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subCategory: e.target.value }))}
                    options={[
                      { value: '', label: 'General / Main Division' },
                      ...subCategories.map((s) => ({ value: s._id, label: s.name })),
                    ]}
                    placeholder="Select Subcategory"
                  />
                )}
              </div>
            </div>

            <div className="form-grid-3">
              {/* Dosage Form */}
              <div className="field-group">
                <label className="field-label">
                  Dosage Form <span className="required-dot">*</span>
                </label>
                <ThemeSelect
                  value={formData.dosageForm}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dosageForm: e.target.value }))}
                  options={DOSAGE_FORMS.map((d) => ({ value: d, label: d }))}
                />
              </div>

              {/* Packaging Details */}
              <div className="field-group">
                <label className="field-label">
                  Packaging Details <span className="required-dot">*</span>
                </label>
                <input
                  type="text"
                  name="packaging"
                  placeholder="e.g. 10 x 10 Alu-Alu Blister, 100 ml Bottle"
                  value={formData.packaging}
                  onChange={handleChange}
                  className="input-base"
                  style={{
                    borderColor: fieldErrors.packaging ? '#EF4444' : undefined,
                    boxShadow: fieldErrors.packaging ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : undefined,
                  }}
                />
                {fieldErrors.packaging && (
                  <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                    {fieldErrors.packaging}
                  </p>
                )}
              </div>

              {/* Maximum Retail Price (MRP) */}
              <div className="field-group">
                <label className="field-label">
                  MRP (Maximum Retail Price ₹)
                </label>
                <input
                  type="number"
                  name="mrp"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 150.00"
                  value={formData.mrp}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>
            </div>

            {/* Prescription Class */}
            <div className="field-group">
              <label className="field-label">Prescription Class</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {PRESCRIPTION_TYPES.map((pt) => {
                  const isSelected = formData.prescriptionType === pt.value;
                  return (
                    <button
                      key={pt.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, prescriptionType: pt.value }))}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid',
                        borderColor: isSelected ? '#6828DC' : '#E2E8F0',
                        background: isSelected ? '#F5F3FF' : '#FFFFFF',
                        color: isSelected ? '#6828DC' : '#475569',
                        fontSize: '12.5px',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSelected && <Check size={14} style={{ color: '#6828DC' }} />}
                      <span>{pt.value}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CARD 3: CLINICAL USAGE & STORAGE GUIDELINES */}
          <div className="product-form-card">
            <h2 className="product-form-card-title">
              <Activity size={18} style={{ color: '#6828DC' }} />
              <span>3. Clinical Usage & Storage</span>
            </h2>

            {/* Indications & Uses */}
            <div className="field-group">
              <label className="field-label">
                Indications / Key Therapeutic Uses
              </label>
              <input
                type="text"
                name="indications"
                placeholder="e.g. Bacterial Infections, Dental Infection, Diarrhea & Dysentery (comma separated)"
                value={formData.indications}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="form-grid-2">
              {/* Directions / Dosage */}
              <div className="field-group">
                <label className="field-label">Dosage & Administration</label>
                <input
                  type="text"
                  name="howToUse"
                  placeholder="e.g. As directed by the physician"
                  value={formData.howToUse}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>

              {/* Storage Instructions */}
              <div className="field-group">
                <label className="field-label">Storage Instructions</label>
                <input
                  type="text"
                  name="storage"
                  placeholder="e.g. Store below 25°C in a dry place"
                  value={formData.storage}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>
            </div>

            {/* Expandable Advanced Clinical Section Toggle */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                onClick={() => setShowAdvancedSafety(!showAdvancedSafety)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6828DC',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 0',
                }}
              >
                <span>{showAdvancedSafety ? '− Hide' : '+ Show'} Advanced Safety & Regulatory Info (Optional)</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: showAdvancedSafety ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {showAdvancedSafety && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
                  <div className="form-grid-2">
                    <div className="field-group">
                      <label className="field-label">Side Effects</label>
                      <input
                        type="text"
                        name="sideEffects"
                        placeholder="e.g. Nausea, headache, dizziness (rare)"
                        value={formData.sideEffects}
                        onChange={handleChange}
                        className="input-base"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Contraindications</label>
                      <input
                        type="text"
                        name="contraindications"
                        placeholder="e.g. Hypersensitivity to fluoroquinolones"
                        value={formData.contraindications}
                        onChange={handleChange}
                        className="input-base"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="field-group">
                      <label className="field-label">Manufacturing Drug License No.</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        placeholder="e.g. G/25/1820"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="input-base"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Country of Origin</label>
                      <input
                        type="text"
                        name="countryOfOrigin"
                        placeholder="e.g. India"
                        value={formData.countryOfOrigin}
                        onChange={handleChange}
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: PACKSHOT MEDIA, STATUS & ACTION PANEL            */}
        {/* ============================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* CARD 4: PRODUCT PACKSHOT / MEDIA */}
          <div className="product-form-card">
            <h2 className="product-form-card-title">
              <ImageIcon size={18} style={{ color: '#6828DC' }} />
              <span>Product Packshot</span>
            </h2>

            {/* Featured Image Stage */}
            <div className={`image-preview-stage ${primaryImage ? 'has-image' : ''}`}>
              {primaryImage ? (
                <>
                  <img
                    src={primaryImage}
                    alt="Product Packshot Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '12px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPrimaryImage('')}
                    title="Remove packshot"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: '#EDE9FE',
                      color: '#6828DC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px',
                    }}
                  >
                    <UploadCloud size={24} />
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B', marginBottom: '3px' }}>
                    {uploadingImage ? 'Uploading Packshot...' : 'No Packshot Selected'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Upload PNG / JPG packshot with transparent background
                  </div>
                </div>
              )}
            </div>

            {/* Upload & Gallery Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <label
                style={{
                  padding: '9px 10px',
                  borderRadius: '9px',
                  background: '#F5F3FF',
                  border: '1.5px solid #DDD6FE',
                  color: '#6828DC',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <UploadCloud size={15} />
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDirectFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setActiveGallerySlot('primary');
                  setGalleryModalOpen(true);
                }}
                style={{
                  padding: '9px 10px',
                  borderRadius: '9px',
                  background: '#FFFFFF',
                  border: '1.5px solid #CBD5E1',
                  color: '#334155',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <ImageIcon size={15} />
                <span>Media Gallery</span>
              </button>
            </div>

            {/* Extra Packshots / Gallery */}
            <div style={{ paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  Additional Packshots ({mediaGallery.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveGallerySlot('gallery');
                    setGalleryModalOpen(true);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#6828DC',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  + Add View
                </button>
              </div>

              {mediaGallery.length > 0 ? (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {mediaGallery.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        width: '54px',
                        height: '54px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: '#FFFFFF',
                      }}
                    >
                      <img src={m.url} alt={`Gallery view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(idx)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '11.5px', color: '#94A3B8', fontStyle: 'italic' }}>
                  No extra blister or packaging angles added.
                </div>
              )}
            </div>
          </div>

          {/* CARD 5: VISIBILITY & COMMERCIAL CONTROLS */}
          <div className="product-form-card">
            <h2 className="product-form-card-title">
              <ShieldCheck size={18} style={{ color: '#6828DC' }} />
              <span>Publishing & Commercial Status</span>
            </h2>

            {/* Catalog Status */}
            <div className="field-group">
              <label className="field-label">Catalog Status</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: 'PUBLISHED' }))}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: formData.status === 'PUBLISHED' ? '#10B981' : '#E2E8F0',
                    background: formData.status === 'PUBLISHED' ? '#ECFDF5' : '#FFFFFF',
                    color: formData.status === 'PUBLISHED' ? '#065F46' : '#64748B',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                  }}
                >
                  ● Published
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: 'DRAFT' }))}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: formData.status === 'DRAFT' ? '#F59E0B' : '#E2E8F0',
                    background: formData.status === 'DRAFT' ? '#FFFBEB' : '#FFFFFF',
                    color: formData.status === 'DRAFT' ? '#B45309' : '#64748B',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                  }}
                >
                  ○ Draft
                </button>
              </div>
            </div>

            {/* Availability */}
            <div className="field-group">
              <label className="field-label">Stock Availability</label>
              <ThemeSelect
                value={formData.availabilityStatus}
                onChange={(e) => setFormData((prev) => ({ ...prev, availabilityStatus: e.target.value }))}
                options={[
                  { value: 'AVAILABLE', label: 'In Stock / Available' },
                  { value: 'OUT_OF_STOCK', label: 'Temporarily Out of Stock' },
                  { value: 'COMING_SOON', label: 'Under R&D / Coming Soon' },
                  { value: 'DISCONTINUED', label: 'Discontinued' },
                ]}
              />
            </div>

            {/* Interactive Feature Switches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Featured Switch */}
              <label className="switch-toggle-row" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} style={{ color: formData.isFeatured ? '#F59E0B' : '#94A3B8' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Featured Formulation</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Promote on homepage showcase</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                />
              </label>

              {/* New Launch Switch */}
              <label className="switch-toggle-row" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} style={{ color: formData.isNewLaunch ? '#10B981' : '#94A3B8' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>New Launch Tag</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Display "NEW" badge on product card</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="isNewLaunch"
                  checked={formData.isNewLaunch}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                />
              </label>

              {/* Allow Enquiry Switch */}
              <label className="switch-toggle-row" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} style={{ color: formData.allowEnquiry ? '#6828DC' : '#94A3B8' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Allow Stockists Inquiries</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Show Stockists enquiry button for distributors</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="allowEnquiry"
                  checked={formData.allowEnquiry}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          {/* CARD 6: PROMINENT SUBMIT ACTION BUTTONS */}
          <div
            className="product-form-card"
            style={{
              background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
              border: '1.5px solid #DDD6FE',
            }}
          >
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit(false)}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '11px',
                background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(104, 40, 220, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              <Save size={18} />
              <span>{loading ? 'Processing Formulation...' : isEditMode ? 'Update Product' : 'Publish Product'}</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSubmit(true)}
              style={{
                width: '100%',
                padding: '11px 20px',
                borderRadius: '11px',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#334155',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>Save as Draft</span>
            </button>
          </div>
        </div>
      </div>

      {/* Media Gallery Modal Component */}
      <MediaGalleryModal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        onSelect={handleSelectFromGallery}
        defaultTag="PRODUCT"
        title="Select Product Packshot from Media Gallery"
      />
    </div>
  );
};
