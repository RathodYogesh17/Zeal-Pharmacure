import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Edit2,
  Trash2,
  CheckCircle2,
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
} from 'lucide-react';
import { productService } from '../api/productService';
import { categoryService } from '../api/categoryService';
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

  const [activeTab, setActiveTab] = useState<'clinical' | 'safety' | 'regulatory' | 'seo'>('clinical');

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
      setActionFeedback(`Formulation duplicated as draft!`);
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
      <div style={{ padding: '80px', textAlign: 'center', color: '#6828DC', fontWeight: 600 }}>
        Loading clinical formulation dossier from database...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', color: '#0F172A', marginBottom: '8px' }}>Formulation Not Found</h2>
        <p style={{ color: '#64748B', marginBottom: '20px', fontSize: '14px' }}>
          The requested pharmaceutical formulation could not be loaded.
        </p>
        <Link to="/admin/products" className="btn btn-primary">
          <ArrowLeft size={16} />
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

  return (
    <div>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
            <Link to="/admin/products" style={{ color: '#6828DC', fontWeight: 600 }}>
              Products
            </Link>{' '}
            &gt; Catalog &gt; <strong style={{ color: '#0F172A' }}>{p.name}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{p.name}</h1>
            {p.productCode && (
              <span
                style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                {p.productCode}
              </span>
            )}
            <span
              style={{
                background: p.isActive ? '#ECFDF5' : '#FEF2F2',
                color: p.isActive ? '#065F46' : '#991B1B',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {p.isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
            <span
              style={{
                background: p.status === 'PUBLISHED' ? '#EDE9FE' : '#F1F5F9',
                color: p.status === 'PUBLISHED' ? '#5B21B6' : '#64748B',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {p.status || 'PUBLISHED'}
            </span>
            <span
              style={{
                background: '#FEF3C7',
                color: '#92400E',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {p.prescriptionType || 'Rx'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to="/admin/products"
            className="btn btn-secondary"
            style={{ borderRadius: '8px', padding: '9px 16px', fontSize: '13px' }}
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </Link>

          <Link
            to={`/admin/products/edit/${p._id}`}
            className="btn btn-primary"
            style={{ borderRadius: '8px', padding: '9px 18px', fontSize: '13px' }}
          >
            <Edit2 size={14} />
            <span>Edit Formulation</span>
          </Link>

          <button
            type="button"
            disabled={duplicateLoading}
            onClick={handleDuplicate}
            className="btn btn-secondary"
            style={{ borderRadius: '8px', padding: '9px 16px', fontSize: '13px' }}
          >
            <Copy size={14} />
            <span>{duplicateLoading ? 'Cloning...' : 'Duplicate'}</span>
          </button>

          <a
            href={productService.getVisualAidUrl(p._id)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ borderRadius: '8px', padding: '9px 16px', fontSize: '13px', color: '#6828DC' }}
          >
            <Download size={14} />
            <span>Visual Aid PDF</span>
          </a>

          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-secondary"
            style={{ borderRadius: '8px', padding: '9px 16px', fontSize: '13px', color: '#EF4444', borderColor: '#FECACA' }}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 18px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13.5px',
            fontWeight: 600,
          }}
        >
          {actionFeedback}
        </div>
      )}

      {/* Main 3-Column Dossier Layout */}
      <div
        className="responsive-dossier-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1.4fr 290px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ==================================================== */}
        {/* 1. LEFT COLUMN: VISUAL PACKAGING & SPECS */}
        {/* ==================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Packaging Box Image */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div
              style={{
                height: '240px',
                borderRadius: '12px',
                background: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
              }}
            >
              {currentDisplayImage ? (
                <img
                  src={currentDisplayImage}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                  <Package size={48} style={{ color: '#CBD5E1', marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px' }}>No Product Image</div>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '12px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                }}
              >
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGalleryImg(img)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: currentDisplayImage === img ? '2px solid #6828DC' : '1px solid #E2E8F0',
                      padding: 0,
                      background: '#F8FAFC',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', margin: 0 }}>
              Formulation Attributes
            </h3>

            <div>
              <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Generic Name (API)</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{p.genericName}</span>
            </div>

            {p.brandName && (
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Brand Name</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{p.brandName}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Dosage Form</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{p.dosageForm}</span>
              </div>
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Strength</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{p.strength || 'N/A'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Packaging</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{p.packaging}</span>
              </div>
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Pack Size</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  {p.packSize?.value ? `${p.packSize.value} ${p.packSize.unit || ''}` : p.packaging}
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Category / Division</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#6828DC' }}>
                {categoryName} {subCategoryName ? `> ${subCategoryName}` : ''}
              </span>
            </div>

            {p.manufacturer && (
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Manufacturer</span>
                <span style={{ fontSize: '12.5px', color: '#334155' }}>{p.manufacturer}</span>
              </div>
            )}

            {p.licenseNumber && (
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block' }}>Drug Mfg License No.</span>
                <span style={{ fontSize: '12.5px', color: '#334155', fontFamily: 'monospace' }}>{p.licenseNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* 2. CENTER COLUMN: CLINICAL & REGULATORY DOSSIER TABS */}
        {/* ==================================================== */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          }}
        >
          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1.5px solid #E2E8F0',
              background: '#F8FAFC',
              overflowX: 'auto',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('clinical')}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: activeTab === 'clinical' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'clinical' ? '#6828DC' : '#64748B',
                fontWeight: 700,
                fontSize: '13.5px',
                borderBottom: activeTab === 'clinical' ? '2.5px solid #6828DC' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Pill size={15} />
              <span>Clinical Specifications</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('safety')}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: activeTab === 'safety' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'safety' ? '#6828DC' : '#64748B',
                fontWeight: 700,
                fontSize: '13.5px',
                borderBottom: activeTab === 'safety' ? '2.5px solid #6828DC' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <AlertTriangle size={15} />
              <span>Safety & Warnings</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('regulatory')}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: activeTab === 'regulatory' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'regulatory' ? '#6828DC' : '#64748B',
                fontWeight: 700,
                fontSize: '13.5px',
                borderBottom: activeTab === 'regulatory' ? '2.5px solid #6828DC' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={15} />
              <span>Regulatory & Files</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: activeTab === 'seo' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'seo' ? '#6828DC' : '#64748B',
                fontWeight: 700,
                fontSize: '13.5px',
                borderBottom: activeTab === 'seo' ? '2.5px solid #6828DC' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Globe size={15} />
              <span>SEO & Web Tags</span>
            </button>
          </div>

          {/* Tab Body */}
          <div style={{ padding: '24px' }}>
            {/* CLINICAL TAB */}
            {activeTab === 'clinical' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Active Pharmaceutical Composition
                  </h4>
                  <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', color: '#0F172A', border: '1px solid #E2E8F0', lineHeight: 1.6 }}>
                    {p.composition}
                  </div>
                </div>

                {p.therapeuticClass && (
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Therapeutic Class
                    </h4>
                    <span style={{ background: '#EDE9FE', color: '#5B21B6', padding: '4px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
                      {p.therapeuticClass}
                    </span>
                  </div>
                )}

                {/* Indications */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Clinical Indications & Target Conditions
                  </h4>
                  {Array.isArray(p.indicationTags) && p.indicationTags.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {p.indicationTags.map((tag, idx) => (
                        <span key={idx} style={{ background: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : Array.isArray(p.indications) && p.indications.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {p.indications.map((ind: any, idx) => (
                        <span key={idx} style={{ background: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 600 }}>
                          {typeof ind === 'object' ? ind.name : ind}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#94A3B8', fontSize: '13px' }}>No specific indication tags recorded.</span>
                  )}
                </div>

                {p.shortDescription && (
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Synopsis / Doctor Aid Overview
                    </h4>
                    <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, margin: 0 }}>{p.shortDescription}</p>
                  </div>
                )}

                {p.description && (
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Detailed Medical Pharmacology
                    </h4>
                    <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>{p.description}</p>
                  </div>
                )}

                {p.howToUse && (
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Dosage & Administration Guidelines
                    </h4>
                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', color: '#166534' }}>
                      {p.howToUse}
                    </div>
                  </div>
                )}

                {p.storage && (
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Recommended Storage Conditions
                    </h4>
                    <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>{p.storage}</p>
                  </div>
                )}
              </div>
            )}

            {/* SAFETY & WARNINGS TAB */}
            {activeTab === 'safety' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Known Side Effects
                  </h4>
                  <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', color: '#92400E' }}>
                    {p.sideEffects || 'No common adverse side effects recorded.'}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Precautions & Clinical Vigilance
                  </h4>
                  <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                    {p.precautions || 'Standard pharmaceutical caution applies.'}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    Contraindications
                  </h4>
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', color: '#991B1B' }}>
                    {p.contraindications || 'Hypersensitivity to the active pharmaceutical ingredient or any formulation excipients.'}
                  </div>
                </div>

                {p.warnings && (
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Black Box Warning
                    </h4>
                    <div style={{ background: '#FEF2F2', border: '1.5px solid #F87171', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', color: '#7F1D1D', fontWeight: 600 }}>
                      {p.warnings}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>Pregnancy Safety</h4>
                    <span style={{ fontSize: '13px', color: '#334155' }}>{p.pregnancyInfo || 'Consult doctor before use.'}</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>Lactation Safety</h4>
                    <span style={{ fontSize: '13px', color: '#334155' }}>{p.lactationInfo || 'Consult doctor before use.'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* REGULATORY TAB */}
            {activeTab === 'regulatory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>Prescription Type</h4>
                    <span style={{ background: '#EDE9FE', color: '#5B21B6', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 700 }}>
                      {p.prescriptionType || 'Schedule H'}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>Country of Origin</h4>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{p.countryOfOrigin || 'India'}</span>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>Regulatory Information / DCGI</h4>
                  <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>
                    {p.regulatoryInfo || 'Manufactured in WHO-GMP certified facility conforming to Indian Pharmacopoeia standards.'}
                  </p>
                </div>

                {/* Brochure / Download */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                    Visual Aid & Collateral Downloads
                  </h4>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a
                      href={productService.getVisualAidUrl(p._id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ borderRadius: '6px' }}
                    >
                      <Download size={14} />
                      <span>Download Monograph PDF</span>
                    </a>

                    {p.brochureUrl && (
                      <a
                        href={p.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: '6px' }}
                      >
                        <ExternalLink size={14} />
                        <span>{p.brochureName || 'Open Official Brochure'}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SEO TAB */}
            {activeTab === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>URL Slug</span>
                  <span style={{ fontSize: '13.5px', fontFamily: 'monospace', color: '#6828DC', fontWeight: 600 }}>
                    /products/{p.slug}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Meta Title</span>
                  <span style={{ fontSize: '13.5px', color: '#0F172A', fontWeight: 600 }}>
                    {p.seo?.metaTitle || `${p.name} - Zeal Pharma`}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Meta Description</span>
                  <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>
                    {p.seo?.metaDescription || p.shortDescription || 'High quality pharmaceutical formulation by Zeal Pharmaceuticals.'}
                  </p>
                </div>

                {Array.isArray(p.seo?.keywords) && p.seo.keywords.length > 0 && (
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '4px' }}>Meta Keywords</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {p.seo.keywords.map((kw, i) => (
                        <span key={i} style={{ background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* 3. RIGHT COLUMN: COMMERCIAL & STATS */}
        {/* ==================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Availability Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', margin: 0 }}>
              Commercial & Supply Status
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Stock Supply</span>
              <span
                style={{
                  background: p.availabilityStatus === 'AVAILABLE' ? '#ECFDF5' : '#FEF2F2',
                  color: p.availabilityStatus === 'AVAILABLE' ? '#065F46' : '#991B1B',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {p.availabilityStatus || 'AVAILABLE'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Stockist Distribution Enquiry</span>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: p.allowEnquiry ? '#10B981' : '#EF4444' }}>
                {p.allowEnquiry ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Featured Product</span>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: p.isFeatured ? '#6828DC' : '#94A3B8' }}>
                {p.isFeatured ? 'YES (HOME)' : 'NO'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>New Launch</span>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: p.isNewLaunch ? '#F59E0B' : '#94A3B8' }}>
                {p.isNewLaunch ? 'NEW LAUNCH' : 'NO'}
              </span>
            </div>
          </div>

          {/* Performance & Views */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', margin: 0 }}>
              Doctor Ratings & Engagement
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Average Rating</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={15} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                  {p.averageRating ? p.averageRating.toFixed(1) : '5.0'}
                </span>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>({p.totalReviews || 0})</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Catalog Views</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{p.viewCount || 0}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>B2B Lead Enquiries</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#6828DC' }}>{p.enquiryCount || 0}</span>
            </div>
          </div>

          {/* Audit Timestamps */}
          <div
            style={{
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '16px',
              fontSize: '12px',
              color: '#64748B',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div>
              <strong>Created:</strong>{' '}
              {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
            </div>
            {p.updatedAt && (
              <div>
                <strong>Updated:</strong> {new Date(p.updatedAt).toLocaleDateString()}
              </div>
            )}
            <div>
              <strong>MongoDB ID:</strong> <span style={{ fontFamily: 'monospace' }}>{p._id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
