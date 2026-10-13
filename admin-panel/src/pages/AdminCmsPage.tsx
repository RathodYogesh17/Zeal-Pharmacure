import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  AlertCircle,
  Palette,
  Phone,
  Building,
  Image,
  MousePointerClick,
  UploadCloud,
  Sparkles,
  Clock,
  Mail,
  MapPin,
  ShieldCheck,
  FileText,
  Globe,
  ExternalLink,
  Eye,
  RefreshCw,
  Users,
  Award,
  Layers,
  MessageSquare,
  Trash2,
  Check,
  HelpCircle,
  Plus,
  Edit3,
  ChevronUp,
  ChevronDown,
  X,
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { contentService } from '../api/contentService';
import { galleryService } from '../api/galleryService';
import { MediaGalleryModal, ThemeQuillEditor } from '../components/common';
import type { ISiteSettings, IBannerItem, IAboutContent, IFaqItem, ICertificationItem } from '../types';

export const AdminCmsPage: React.FC = () => {
  const { settings, banners, about, faqs, certifications, refreshSettings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'hero' | 'about' | 'faqs' | 'certifications' | 'promos'>('branding');
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [aboutMediaPickerField, setAboutMediaPickerField] = useState<string | null>(null);

  // Form States
  const [formSettings, setFormSettings] = useState<ISiteSettings>(settings);
  const [bannerList, setBannerList] = useState<IBannerItem[]>(banners);
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(0);
  const [aboutForm, setAboutForm] = useState<IAboutContent>(about);

  // FAQs State
  const [faqList, setFaqList] = useState<IFaqItem[]>(faqs);
  const [faqFilter, setFaqFilter] = useState<string>('ALL');
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<IFaqItem | null>(null);

  // Certifications State
  const [certList, setCertList] = useState<ICertificationItem[]>(certifications);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<ICertificationItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setFormSettings(settings);
    if (banners && banners.length > 0) {
      setBannerList(banners);
    }
    setAboutForm(about);
    if (faqs && faqs.length > 0) {
      setFaqList(faqs);
    }
    if (certifications && certifications.length > 0) {
      setCertList(certifications);
    }
  }, [settings, banners, about, faqs, certifications]);

  const currentBanner = bannerList[activeBannerIdx] || {
    id: `banner-${Date.now()}`,
    title: '',
    subtitle: '',
    badge: '',
    imageUrl: '',
    sortOrder: 1,
  };

  const bannerItem = currentBanner;

  const setBannerItem = (updater: any) => {
    setBannerList((prev) => {
      const copy = [...prev];
      if (!copy[activeBannerIdx]) return prev;
      const updated = typeof updater === 'function' ? updater(copy[activeBannerIdx]) : updater;
      copy[activeBannerIdx] = updated;
      return copy;
    });
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBannerList((prev) => {
      const copy = [...prev];
      if (!copy[activeBannerIdx]) return prev;
      copy[activeBannerIdx] = { ...copy[activeBannerIdx], [name]: value };
      return copy;
    });
  };

  const handleAddNewBanner = () => {
    const newB: IBannerItem = {
      id: `banner-${Date.now()}`,
      title: 'New Pharmaceutical Formulation Range',
      subtitle: 'Authorized stockists distribution rights across key therapeutic sectors.',
      badge: 'New Division',
      imageUrl: '',
      ctaText: 'Enquire for Stockists',
      ctaLink: '/contact',
      isActive: true,
      sortOrder: bannerList.length + 1,
    };
    setBannerList((prev) => [...prev, newB]);
    setActiveBannerIdx(bannerList.length);
  };
  const handleAddBannerSlide = handleAddNewBanner;

  const handleDeleteBanner = (idx: number) => {
    if (bannerList.length <= 1) {
      alert('You must have at least one hero banner.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this hero banner?')) return;
    setBannerList((prev) => prev.filter((_, i) => i !== idx));
    setActiveBannerIdx(0);
  };
  const handleDeleteBannerSlide = handleDeleteBanner;

  const filteredFaqs = faqList.filter((f) => {
    if (faqFilter === 'ALL') return true;
    return f.category === faqFilter;
  });

  // FAQ Handlers
  const handleOpenAddFaq = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      category: 'Stockists Distribution',
      question: '',
      answer: '',
      sortOrder: faqList.length + 1,
    });
    setIsFaqModalOpen(true);
  };

  const handleEditFaq = (item: IFaqItem) => {
    setEditingFaq({ ...item });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaqModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question.trim() || !editingFaq.answer.trim()) return;

    setFaqList((prev) => {
      const exists = prev.some((f) => f.id === editingFaq.id);
      if (exists) {
        return prev.map((f) => (f.id === editingFaq.id ? editingFaq : f));
      }
      return [...prev, editingFaq];
    });
    setIsFaqModalOpen(false);
    setEditingFaq(null);
  };

  const handleDeleteFaq = (id: string) => {
    if (!window.confirm('Are you sure you want to remove this FAQ?')) return;
    setFaqList((prev) => prev.filter((f) => f.id !== id));
  };

  // Certification Handlers
  const handleOpenAddCert = () => {
    setEditingCert({
      id: `cert-${Date.now()}`,
      title: '',
      code: 'GMP/FDCA/WHO-COMPLIANT',
      issuer: 'Food and Drugs Control Administration (FDCA)',
      validUntil: 'Permanent / Ongoing Compliance',
      description: '',
    });
    setIsCertModalOpen(true);
  };

  const handleEditCert = (item: ICertificationItem) => {
    setEditingCert({ ...item });
    setIsCertModalOpen(true);
  };

  const handleSaveCertModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title.trim() || !editingCert.description.trim()) return;

    setCertList((prev) => {
      const exists = prev.some((c) => c.id === editingCert.id);
      if (exists) {
        return prev.map((c) => (c.id === editingCert.id ? editingCert : c));
      }
      return [...prev, editingCert];
    });
    setIsCertModalOpen(false);
    setEditingCert(null);
  };

  const handleDeleteCert = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this manufacturing certification?')) return;
    setCertList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAboutForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      // 1. Update Contact Info & Site Branding
      await contentService.updateContent('contact-info', {
        title: 'Corporate & Contact Information',
        content: formSettings,
        isActive: true,
      });

      // 2. Update Hero Banners (Array)
      await contentService.updateContent('banners', {
        title: 'Homepage Hero Banners',
        content: bannerList,
        isActive: true,
      });

      // 3. Update About Content
      await contentService.updateContent('about-us', {
        title: 'About Zeal Pharmaceuticals',
        content: aboutForm,
        isActive: true,
      });

      // 4. Update FAQs
      await contentService.updateContent('faqs', {
        title: 'Frequently Asked Questions (Stockists Distribution)',
        content: { items: faqList },
        isActive: true,
      });

      // 5. Update Certifications
      await contentService.updateContent('certifications', {
        title: 'Manufacturing Standards & Certifications',
        content: { items: certList },
        isActive: true,
      });

      // 6. Sync to local storage for instant browser cache
      try {
        localStorage.setItem('zeal_cms_contact-info', JSON.stringify(formSettings));
        localStorage.setItem('zeal_cms_banners', JSON.stringify(bannerList));
        localStorage.setItem('zeal_cms_about-us', JSON.stringify(aboutForm));
        localStorage.setItem('zeal_cms_faqs', JSON.stringify(faqList));
        localStorage.setItem('zeal_cms_certifications', JSON.stringify(certList));
      } catch {}

      // 7. Refresh site settings in reactive context
      await refreshSettings();

      setSaveSuccess(
        'All changes saved successfully! Branding, contact lines, hero banners, about story, FAQs, and certifications have been updated in the live database.'
      );
      setTimeout(() => setSaveSuccess(''), 5000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save CMS updates to backend.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-purple" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Real-Time CMS</span>
            <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600 }}>WHO-GMP Compliant</span>
          </div>
          <h1 className="admin-page-title">Site Customizer &amp; CMS Content Editor</h1>
          <p className="admin-page-subtitle">Modify website branding, logos, button labels, phone numbers, and pharma copy without editing any code.</p>
        </div>
        <button className="btn-primary-action" onClick={handleSaveAll} disabled={saving} style={{ opacity: saving ? 0.75 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{saving ? 'Publishing to Database...' : 'Save & Publish Changes'}</span>
        </button>
      </div>

      {/* Success / Error Banners */}
      {saveSuccess && (
        <div className="alert-banner alert-success">
          <CheckCircle size={20} style={{ color: '#10B981', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>{saveSuccess}</div>
        </div>
      )}
      {saveError && (
        <div className="alert-banner alert-error">
          <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>{saveError}</div>
        </div>
      )}

      {/* Navigation Tabs (Smooth Horizontal Scroll on 320px) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1.5px solid #E2E8F0',
          marginBottom: '22px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          paddingBottom: '2px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {[
          { id: 'branding', label: 'Logo & Buttons', icon: <Palette size={15} /> },
          { id: 'contact', label: 'Topbar & Contact Helpline', icon: <Phone size={15} /> },
          { id: 'hero', label: 'Hero Banners & Headlines', icon: <Image size={15} /> },
          { id: 'about', label: 'About Story & Media', icon: <Building size={15} /> },
          { id: 'promos', label: 'Promo & Showcase Banners', icon: <Layers size={15} /> },
          { id: 'faqs', label: 'Pharma FAQs', icon: <HelpCircle size={15} /> },
          { id: 'certifications', label: 'Manufacturing Certifications', icon: <ShieldCheck size={15} /> },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 16px',
                borderBottom: isSelected ? '2.5px solid #6828DC' : '2.5px solid transparent',
                color: isSelected ? '#6828DC' : '#64748B',
                fontWeight: isSelected ? 800 : 600,
                fontSize: '13.5px',
                background: isSelected ? '#FAF5FF' : 'transparent',
                borderRadius: '8px 8px 0 0',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
            >
              <span style={{ color: isSelected ? '#6828DC' : '#94A3B8' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BRANDING, LOGO & BUTTON LABELS */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Form Container */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #EDE9FE',
              padding: 'clamp(16px, 3.5vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              boxShadow: '0 4px 16px rgba(104, 40, 220, 0.04)',
            }}
          >
            {/* Section Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#EDE9FE',
                  color: '#6828DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Palette size={19} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Logo, Brand Name & Buttons Configuration
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
                  Update your global corporate identity, vector logo, and primary navbar action button.
                </p>
              </div>
            </div>

            {/* Row 1: Brand Name & Tagline */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label className="cms-label">
                  <Building size={14} style={{ color: '#6828DC' }} />
                  <span>Company Brand Name</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="e.g. Zeal Pharmaceuticals"
                  value={formSettings.companyName || ''}
                  onChange={handleSettingsChange}
                  className="cms-input"
                />
              </div>

              <div>
                <label className="cms-label">
                  <Sparkles size={14} style={{ color: '#6828DC' }} />
                  <span>Company Tagline</span>
                </label>
                <input
                  type="text"
                  name="tagline"
                  placeholder="e.g. A Legacy of Better Healthcare"
                  value={formSettings.tagline || ''}
                  onChange={handleSettingsChange}
                  className="cms-input"
                />
              </div>
            </div>

            {/* Row 2: Company Logo via Media Gallery */}
            <div
              style={{
                background: '#FAF5FF',
                border: '1.5px solid #EDE9FE',
                padding: 'clamp(14px, 3vw, 20px)',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#6828DC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Image size={15} />
                  <span>Official Company Logo (Media Gallery)</span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0' }}>
                  Upload a high-resolution transparent PNG/SVG logo or pick an existing asset from the Media Gallery.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Logo Preview Tile */}
                <div
                  style={{
                    width: '150px',
                    height: '74px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    border: '1.5px dashed #DDD6FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  {formSettings.logoUrl ? (
                    <img
                      src={galleryService.formatUrl(formSettings.logoUrl)}
                      alt="Company Logo"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#6828DC', fontWeight: 800, display: 'block' }}>
                        ZEAL PHARMA
                      </span>
                      <span style={{ fontSize: '9.5px', color: '#94A3B8' }}>Vector Default</span>
                    </div>
                  )}
                </div>

                {/* Upload & Reset Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setLogoModalOpen(true)}
                    style={{
                      background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '9px 16px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 2px 8px rgba(104, 40, 220, 0.25)',
                    }}
                  >
                    <UploadCloud size={15} />
                    <span>{formSettings.logoUrl ? 'Change Logo via Gallery' : 'Upload / Choose Logo'}</span>
                  </button>

                  {formSettings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormSettings((prev) => ({ ...prev, logoUrl: '' }))}
                      style={{
                        background: '#FFFFFF',
                        color: '#EF4444',
                        border: '1.5px solid #FECACA',
                        borderRadius: '8px',
                        padding: '9px 14px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Reset to Default</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Row 3: Buttons Customization */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                padding: 'clamp(14px, 3vw, 20px)',
                borderRadius: '14px',
              }}
            >
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <MousePointerClick size={16} style={{ color: '#6828DC' }} />
                <span>Navbar & Pre-Footer Button Settings</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label className="cms-label">
                    <MousePointerClick size={14} style={{ color: '#6828DC' }} />
                    <span>Primary CTA Button Label</span>
                  </label>
                  <input
                    type="text"
                    name="primaryCtaText"
                    placeholder="e.g. Enquire Now"
                    value={formSettings.primaryCtaText || 'Enquire Now'}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>

                <div>
                  <label className="cms-label">
                    <Globe size={14} style={{ color: '#6828DC' }} />
                    <span>Button Target Route / Link</span>
                  </label>
                  <input
                    type="text"
                    name="primaryCtaLink"
                    placeholder="e.g. /contact or opens Stockists / Distribution Modal"
                    value={formSettings.primaryCtaLink || '/contact'}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Website Navbar Preview Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: 'clamp(16px, 3vw, 24px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={15} style={{ color: '#6828DC' }} />
                <span>Live Website Navbar & Header Preview</span>
              </div>
              <span style={{ fontSize: '11px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                Dynamic Simulation
              </span>
            </div>

            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1.5px solid #EDE9FE',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(104, 40, 220, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: '#FAF5FF',
                    border: '1px solid #DDD6FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {formSettings.logoUrl ? (
                    <img
                      src={galleryService.formatUrl(formSettings.logoUrl)}
                      alt="Logo"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#6828DC' }}>Z</span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em' }}>
                    {formSettings.companyName || 'Zeal Pharmaceuticals'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6828DC', fontWeight: 600 }}>
                    {formSettings.tagline || 'A Legacy of Better Healthcare'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', display: 'none', md: 'inline' } as any}>
                  Home Â· Products Â· Divisions Â· Certifications
                </span>
                <button
                  type="button"
                  style={{
                    background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(104, 40, 220, 0.25)',
                  }}
                >
                  {formSettings.primaryCtaText || 'Enquire Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TOPBAR & CONTACT HELPLINES */}
      {/* ========================================================================= */}
      {activeTab === 'contact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: 'clamp(22px, 4vw, 36px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '36px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 20px rgba(0, 0, 0, 0.02)',
            }}
          >
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Phone size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Helpline Phone Numbers, WhatsApp &amp; Physical Addresses
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '3px 0 0' }}>
                  Manage corporate contact lines, direct sales desks, WhatsApp routing, and pharmaceutical facility addresses.
                </p>
              </div>
            </div>

            {/* Direct Helplines Grid */}
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} style={{ color: '#64748B' }} />
                <span>Customer Helplines &amp; Lead Dispatch Numbers</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
                <div>
                  <label className="cms-label">
                    <Phone size={14} style={{ color: '#64748B' }} />
                    <span>Main Hotline Phone (Topbar &amp; Cards)</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="e.g. +91 9316227576"
                    value={formSettings.phone || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>

                <div>
                  <label className="cms-label">
                    <Phone size={14} style={{ color: '#64748B' }} />
                    <span>Sales &amp; Stockists Helpline</span>
                  </label>
                  <input
                    type="text"
                    name="salesHelpline"
                    placeholder="e.g. +91 9316227576"
                    value={formSettings.salesHelpline || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>

                <div>
                  <label className="cms-label">
                    <Users size={14} style={{ color: '#64748B' }} />
                    <span>HR &amp; Recruitment Helpline</span>
                  </label>
                  <input
                    type="text"
                    name="hrHelpline"
                    placeholder="e.g. +91 9316227576"
                    value={formSettings.hrHelpline || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>

                <div>
                  <label className="cms-label">
                    <MessageSquare size={14} style={{ color: '#10B981' }} />
                    <span>WhatsApp Lead Alert Number</span>
                  </label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    placeholder="e.g. +91 9316227576"
                    value={formSettings.whatsappNumber || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>
              </div>
            </div>

            {/* Email Addresses & Hours */}
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} style={{ color: '#64748B' }} />
                <span>Official Inboxes &amp; Operational Hours</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
                <div>
                  <label className="cms-label">
                    <Mail size={14} style={{ color: '#64748B' }} />
                    <span>Primary Corporate Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. info@zealpharma.com"
                    value={formSettings.email || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>

                <div>
                  <label className="cms-label">
                    <Mail size={14} style={{ color: '#64748B' }} />
                    <span>Sales &amp; Orders Email</span>
                  </label>
                  <input
                    type="email"
                    name="salesEmail"
                    placeholder="e.g. sales@zealpharma.com"
                    value={formSettings.salesEmail || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>

                <div>
                  <label className="cms-label">
                    <Clock size={14} style={{ color: '#64748B' }} />
                    <span>Customer Support &amp; Working Hours</span>
                  </label>
                  <input
                    type="text"
                    name="workingHours"
                    placeholder="e.g. Monday - Saturday: 9:30 AM - 6:30 PM"
                    value={formSettings.workingHours || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} style={{ color: '#64748B' }} />
                <span>Corporate Headquarters &amp; Formulation Facility</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
                <div>
                  <label className="cms-label">
                    <Building size={14} style={{ color: '#64748B' }} />
                    <span>Corporate Head Office Address</span>
                  </label>
                  <input
                    type="text"
                    name="headOfficeAddress"
                    placeholder="e.g. Corporate Heights, S.G. Highway, Ahmedabad, Gujarat 380054, India"
                    value={formSettings.headOfficeAddress || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>

                <div>
                  <label className="cms-label">
                    <Building size={14} style={{ color: '#64748B' }} />
                    <span>Manufacturing Plant / Formulation Unit</span>
                  </label>
                  <input
                    type="text"
                    name="plantAddress"
                    placeholder="e.g. Sanand GIDC Industrial Estate, Phase II, Ahmedabad, Gujarat 382110, India"
                    value={formSettings.plantAddress || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>
              </div>
            </div>

            {/* Regulatory Credentials */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                padding: 'clamp(18px, 3.5vw, 24px)',
                borderRadius: '14px',
              }}
            >
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <ShieldCheck size={17} style={{ color: '#475569' }} />
                <span>Statutory Pharma Credentials &amp; Wholesale Licensing</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
                <div>
                  <label className="cms-label">
                    <ShieldCheck size={14} style={{ color: '#64748B' }} />
                    <span>GSTIN Registration Number</span>
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    placeholder="e.g. 24AAACZ1234F1Z5"
                    value={formSettings.gstNumber || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>

                <div>
                  <label className="cms-label">
                    <FileText size={14} style={{ color: '#64748B' }} />
                    <span>Wholesale Drug License No. (Form 20B / 21B)</span>
                  </label>
                  <input
                    type="text"
                    name="drugLicenseNumber"
                    placeholder="e.g. 20B-123456 / 21B-123456"
                    value={formSettings.drugLicenseNumber || ''}
                    onChange={handleSettingsChange}
                    className="cms-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Topbar Preview */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: 'clamp(16px, 3vw, 24px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={15} style={{ color: '#6828DC' }} />
                <span>Live Topbar Contact Strip Preview</span>
              </div>
              <span style={{ fontSize: '11px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                Desktop & Mobile Strip
              </span>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #1E1B4B 0%, #31104B 100%)',
                color: '#E2E8F0',
                borderRadius: '10px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={13} style={{ color: '#A78BFA' }} />
                  <strong>Hotline:</strong> {formSettings.phone || '+91 9316227576'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mail size={13} style={{ color: '#A78BFA' }} />
                  {formSettings.email || 'info@zealpharma.com'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                {formSettings.workingHours ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#CBD5E1' }}>
                    <Clock size={13} style={{ color: '#A78BFA' }} />
                    {formSettings.workingHours}
                  </span>
                ) : null}
                <span style={{ background: '#10B981', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800 }}>
                  GST: {formSettings.gstNumber || '24AAACZ1234F1Z5'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HERO BANNER & HEADLINES */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #EDE9FE',
              padding: 'clamp(16px, 3.5vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              boxShadow: '0 4px 16px rgba(104, 40, 220, 0.04)',
            }}
          >
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#EDE9FE',
                  color: '#6828DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Image size={19} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Homepage Hero Headline, Subtitles & Background Media
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
                  Craft the first visual impression doctors, chemists, and stockist partners see on the homepage. Supports multi-slide rotation.
                </p>
              </div>
            </div>

            {/* Slide Selector Pill Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '12px 14px',
                background: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', marginRight: '4px' }}>
                  Slides ({bannerList.length}):
                </span>
                {bannerList.map((b, idx) => (
                  <button
                    key={b._id || b.id || idx}
                    type="button"
                    onClick={() => setActiveBannerIdx(idx)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: idx === activeBannerIdx ? '1.5px solid #6828DC' : '1px solid #CBD5E1',
                      background: idx === activeBannerIdx ? '#6828DC' : '#FFFFFF',
                      color: idx === activeBannerIdx ? '#FFFFFF' : '#475569',
                      transition: 'all 0.15s ease',
                      boxShadow: idx === activeBannerIdx ? '0 2px 8px rgba(104, 40, 220, 0.25)' : 'none',
                    }}
                  >
                    Slide {idx + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleAddBannerSlide}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1.5px dashed #6828DC',
                    background: '#EDE9FE',
                    color: '#6828DC',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={14} /> Add Slide
                </button>
              </div>

              {bannerList.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteBannerSlide(activeBannerIdx)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid #FCA5A5',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Trash2 size={13} /> Delete Slide {activeBannerIdx + 1}
                </button>
              )}
            </div>

            {/* Headline Inputs */}
            <div>
              <label className="cms-label">
                <Sparkles size={14} style={{ color: '#64748B' }} />
                <span>Badge Text (Top Pill Highlight)</span>
              </label>
              <input
                type="text"
                name="badge"
                placeholder="e.g. Leading Stockists Distribution in India"
                value={bannerItem.badge || ''}
                onChange={handleBannerChange}
                className="cms-input"
              />
            </div>

            <div>
              <label className="cms-label">
                <Layers size={14} style={{ color: '#64748B' }} />
                <span>Main Heading Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Partner with Indiaâ€™s Most Trusted Stockists Distribution Network"
                value={bannerItem.title || ''}
                onChange={handleBannerChange}
                className="cms-input" style={{ fontSize: '14.5px', fontWeight: 700 }}
              />
            </div>

            <div>
              <label className="cms-label">
                <FileText size={14} style={{ color: '#64748B' }} />
                <span>Subtitle Description</span>
              </label>
              <textarea
                name="subtitle"
                rows={3}
                placeholder="Outline WHO-GMP formulation breadth, distribution terms, and partner growth..."
                value={bannerItem.subtitle || ''}
                onChange={handleBannerChange}
                className="cms-input" style={{ resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            {/* CTA Button Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div>
                <label className="cms-label">
                  <MousePointerClick size={14} style={{ color: '#64748B' }} />
                  <span>Hero CTA Button Text</span>
                </label>
                <input
                  type="text"
                  name="ctaText"
                  placeholder="e.g. Apply for Stockists Distribution"
                  value={bannerItem.ctaText || ''}
                  onChange={handleBannerChange}
                  className="cms-input"
                />
              </div>

              <div>
                <label className="cms-label">
                  <Globe size={14} style={{ color: '#6828DC' }} />
                  <span>Hero CTA Button Link</span>
                </label>
                <input
                  type="text"
                  name="ctaLink"
                  placeholder="e.g. /contact or opens Stockists / Distribution Modal"
                  value={bannerItem.ctaLink || ''}
                  onChange={handleBannerChange}
                  className="cms-input"
                />
              </div>
            </div>

            {/* Banner Background Image (Media Gallery Integration) */}
            <div
              style={{
                background: '#FAF5FF',
                border: '1.5px solid #EDE9FE',
                padding: 'clamp(14px, 3vw, 20px)',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#6828DC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Image size={15} />
                  <span>Hero Banner Background Image (Media Gallery)</span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0' }}>
                  Select an ultra-wide pharmaceutical background or scientific laboratory graphic from your Media Gallery.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '180px',
                    height: '80px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    border: '1.5px dashed #DDD6FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    overflow: 'hidden',
                  }}
                >
                  {bannerItem.imageUrl ? (
                    <img
                      src={galleryService.formatUrl(bannerItem.imageUrl)}
                      alt="Banner Background"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#6828DC', fontWeight: 700 }}>Default Pharma Art</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setBannerModalOpen(true)}
                    style={{
                      background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '9px 16px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      boxShadow: '0 2px 8px rgba(104, 40, 220, 0.25)',
                    }}
                  >
                    <UploadCloud size={15} />
                    <span>{bannerItem.imageUrl ? 'Change Banner Image' : 'Pick Banner Image'}</span>
                  </button>

                  {bannerItem.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setBannerItem((prev: any) => ({ ...prev, imageUrl: '' }))}
                      style={{
                        background: '#FFFFFF',
                        color: '#EF4444',
                        border: '1.5px solid #FECACA',
                        borderRadius: '8px',
                        padding: '9px 14px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Remove Custom Image</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Hero Banner Mockup Preview */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: 'clamp(16px, 3vw, 24px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={15} style={{ color: '#6828DC' }} />
                <span>Live Hero Banner Visual Simulation</span>
              </div>
              <span style={{ fontSize: '11px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                Homepage Fold Preview
              </span>
            </div>

            <div
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #31104B 50%, #4C1D95 100%)',
                color: '#FFFFFF',
                padding: 'clamp(20px, 4vw, 36px)',
                boxShadow: '0 8px 24px rgba(104, 40, 220, 0.2)',
              }}
            >
              {bannerItem.imageUrl && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${galleryService.formatUrl(bannerItem.imageUrl)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.22,
                    pointerEvents: 'none',
                  }}
                />
              )}

              <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    color: '#DDD6FE',
                    border: '1px solid rgba(221, 214, 254, 0.3)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    marginBottom: '12px',
                  }}
                >
                  <Sparkles size={12} style={{ color: '#FBBF24' }} />
                  {bannerItem.badge || 'Leading Stockists Distribution in India'}
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(18px, 3.5vw, 26px)',
                    fontWeight: 900,
                    lineHeight: 1.25,
                    margin: '0 0 10px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {bannerItem.title || 'Partner with Indiaâ€™s Most Trusted Stockists Distribution Network'}
                </h2>

                {bannerItem.subtitle ? (
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#E2E8F0',
                      lineHeight: 1.5,
                      margin: '0 0 18px',
                      opacity: 0.95,
                    }}
                    dangerouslySetInnerHTML={{ __html: bannerItem.subtitle }}
                  />
                ) : (
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#E2E8F0',
                      lineHeight: 1.5,
                      margin: '0 0 18px',
                      opacity: 0.9,
                    }}
                  >
                    Over 250+ WHO-GMP &amp; ISO certified pharmaceutical formulations with authorized stockists distribution rights.
                  </p>
                )}

                <button
                  type="button"
                  style={{
                    background: '#FFFFFF',
                    color: '#6828DC',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '9px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  }}
                >
                  {bannerItem.ctaText || 'Apply for Stockists Distribution'} â†’
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ABOUT STORY & LEADERSHIP */}
      {/* ========================================================================= */}
      {activeTab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #EDE9FE',
              padding: 'clamp(16px, 3.5vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              boxShadow: '0 4px 16px rgba(104, 40, 220, 0.04)',
            }}
          >
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#EDE9FE',
                  color: '#6828DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building size={19} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Company Legacy Story, Mission & Executive Leadership
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
                  Articulate the pharmaceutical vision, R&D formulation dedication, and inspiring message from executive leadership.
                </p>
              </div>
            </div>

            {/* Company Story (Quill Rich Text Editor) */}
            <div>
              <ThemeQuillEditor
                label={
                  <>
                    <Award size={14} style={{ color: '#64748B' }} />
                    <span>Company Story Narrative (A Legacy of Better Healthcare)</span>
                  </>
                }
                toolbarPreset="standard"
                placeholder="Narrate company history, manufacturing standards, and clinical milestones..."
                value={aboutForm.companyStory || ''}
                onChange={(val) => setAboutForm((prev) => ({ ...prev, companyStory: val }))}
                minHeight="140px"
              />
            </div>

            {/* Mission & Vision Side by Side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
              <div>
                <label className="cms-label">
                  <Sparkles size={14} style={{ color: '#64748B' }} />
                  <span>Mission Statement</span>
                </label>
                <textarea
                  name="mission"
                  rows={3}
                  placeholder="State the core pharmaceutical objective and patient care ethos..."
                  value={aboutForm.mission || ''}
                  onChange={handleAboutChange}
                  className="cms-input" style={{ resize: 'vertical', lineHeight: 1.55 }}
                />
              </div>

              <div>
                <label className="cms-label">
                  <Globe size={14} style={{ color: '#64748B' }} />
                  <span>Vision Statement</span>
                </label>
                <textarea
                  name="vision"
                  rows={3}
                  placeholder="State the future nationwide stockists distribution leadership target..."
                  value={aboutForm.vision || ''}
                  onChange={handleAboutChange}
                  className="cms-input" style={{ resize: 'vertical', lineHeight: 1.55 }}
                />
              </div>
            </div>

            {/* Executive Leadership Section */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                padding: 'clamp(18px, 3.5vw, 24px)',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: '#475569' }} />
                <span>Executive Directorâ€™s Quote &amp; Attributions</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                  <label className="cms-label">
                    <Users size={14} style={{ color: '#64748B' }} />
                    <span>Director / Leader Name</span>
                  </label>
                  <input
                    type="text"
                    name="directorName"
                    placeholder="e.g. Board of Directors / Managing Director"
                    value={aboutForm.directorName || ''}
                    onChange={handleAboutChange}
                    className="cms-input"
                  />
                </div>

                <div>
                  <label className="cms-label">
                    <Award size={14} style={{ color: '#64748B' }} />
                    <span>Designation / Title</span>
                  </label>
                  <input
                    type="text"
                    name="directorTitle"
                    placeholder="e.g. Executive Leadership, Zeal Pharmaceuticals"
                    value={aboutForm.directorTitle || ''}
                    onChange={handleAboutChange}
                    className="cms-input"
                  />
                </div>
              </div>

              <div>
                <label className="cms-label">
                  <MessageSquare size={14} style={{ color: '#64748B' }} />
                  <span>Executive Directorâ€™s Quote / Message</span>
                </label>
                <textarea
                  name="directorMessage"
                  rows={3}
                  placeholder="Share a vision quote welcoming stockist partners..."
                  value={aboutForm.directorMessage || ''}
                  onChange={handleAboutChange}
                  className="cms-input" style={{ resize: 'vertical', lineHeight: 1.55 }}
                />
              </div>
            </div>

            {/* Visual Media & Facility Photos */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                padding: 'clamp(18px, 3.5vw, 24px)',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image size={16} style={{ color: '#6828DC' }} />
                <span>About Us Page Media &amp; Facility Photos</span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '-8px 0 6px 0' }}>
                Upload or select real photos of your Surat Central Depot, promotional kits, executive team, and formulation racks.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {/* 1. Depot Image */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>About Page (Corporate Profile Section)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Surat Central Depot Photo</div>
                  <div style={{ height: '120px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl((aboutForm as any).depotImage) || '/banners/pharma_warehouse_depot.jpg'}
                      alt="Depot"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('depotImage')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {(aboutForm as any).depotImage && (
                      <button
                        type="button"
                        onClick={() => setAboutForm((prev: any) => ({ ...prev, depotImage: '' }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Marketing Kit Image */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>About Page (Promotional Support Kit Section)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Promotional Support &amp; Visual Aids</div>
                  <div style={{ height: '120px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl((aboutForm as any).marketingKitImage) || '/banners/banner_promotional_kit.jpg'}
                      alt="Kit"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('marketingKitImage')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {(aboutForm as any).marketingKitImage && (
                      <button
                        type="button"
                        onClick={() => setAboutForm((prev: any) => ({ ...prev, marketingKitImage: '' }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Leadership Meeting Image */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>About Page (Executive Directorate Section)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>Executive Directorate Meeting</div>
                  <div style={{ height: '120px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl((aboutForm as any).leadershipImage) || '/banners/banner_franchise_meeting.jpg'}
                      alt="Meeting"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('leadershipImage')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {(aboutForm as any).leadershipImage && (
                      <button
                        type="button"
                        onClick={() => setAboutForm((prev: any) => ({ ...prev, leadershipImage: '' }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. About Hero Image */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>About Page (Top Hero Formulations Visual)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>About Page Hero Formulations</div>
                  <div style={{ height: '120px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl((aboutForm as any).heroImage) || '/banners/about_animated_formulations.jpg'}
                      alt="Hero"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('heroImage')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {(aboutForm as any).heroImage && (
                      <button
                        type="button"
                        onClick={() => setAboutForm((prev: any) => ({ ...prev, heroImage: '' }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Leadership Quote Simulation Preview */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: 'clamp(16px, 3vw, 24px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={15} style={{ color: '#6828DC' }} />
                <span>Live Leadership Quote & About Card Preview</span>
              </div>
              <span style={{ fontSize: '11px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                About Section Preview
              </span>
            </div>

            <div
              style={{
                background: '#FAF5FF',
                border: '1.5px solid #EDE9FE',
                borderRadius: '14px',
                padding: '20px',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: '36px', color: '#DDD6FE', lineHeight: 1, fontFamily: 'serif', marginBottom: '-10px' }}>
                â€œ
              </div>
              {aboutForm.directorMessage ? (
                <div
                  style={{ fontSize: '13.5px', color: '#1E293B', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 14px' }}
                  dangerouslySetInnerHTML={{ __html: aboutForm.directorMessage }}
                />
              ) : (
                <p style={{ fontSize: '13.5px', color: '#1E293B', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 14px' }}>
                  At Zeal Pharma, quality is never an accident; it is always the result of high intention, sincere effort, intelligent direction, and skillful execution. We welcome ambitious pharma entrepreneurs to grow with us.
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                  }}
                >
                  {aboutForm.directorName ? aboutForm.directorName.charAt(0) : 'Z'}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                    {aboutForm.directorName || 'Board of Directors'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6828DC', fontWeight: 600 }}>
                    {aboutForm.directorTitle || 'Executive Leadership, Zeal Pharmaceuticals'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: PROMO & SHOWCASE BANNERS */}
      {/* ========================================================================= */}
      {activeTab === 'promos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #EDE9FE',
              padding: 'clamp(16px, 3.5vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              boxShadow: '0 4px 16px rgba(104, 40, 220, 0.04)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#EDE9FE',
                  color: '#6828DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Layers size={19} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Showcase, Catalog & Promotional Banners
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
                  Manage promotional graphic cards featured on Homepage, Products catalog, and Contact pages. High-resolution fallback images remain active if unassigned.
                </p>
              </div>
            </div>

            {/* Section 1: Home & Contact Showcase Cards */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} style={{ color: '#6828DC' }} />
                <span>Homepage & Contact Feature Cards</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {/* Monopoly Card */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Homepage (Middle Feature Card) &amp; Contact Page</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Stockists / Distribution Monopoly Rights Card</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Shows in Home showcase &amp; Contact page feature card</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.cardMonopoly) || '/banners/card_monopoly_formulations.jpg'}
                      alt="Stockists / Distribution Monopoly"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_cardMonopoly')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.cardMonopoly && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, cardMonopoly: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Warehouse Depot */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Homepage (Middle Depot Card) &amp; Contact Page</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Central Depot & Logistics Card</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Shows in Home showcase &amp; Contact page feature card</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.warehouseDepot) || '/banners/pharma_warehouse_depot.jpg'}
                      alt="Central Depot"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_warehouseDepot')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.warehouseDepot && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, warehouseDepot: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Institutional Supply */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Contact Page (Institutional Formulations Card)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Hospital & Institutional Supply</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Featured on Contact Page feature banners</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.cardInstitutional) || '/banners/card_institutional_formulations.jpg'}
                      alt="Institutional Supply"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_cardInstitutional')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.cardInstitutional && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, cardInstitutional: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Products Catalog Promo Banners */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} style={{ color: '#6828DC' }} />
                <span>Product Catalog Therapeutic Division Banners</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {/* Diabetic Banner */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Products Page (Top Banner Card 1)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Diabetic & Metabolic Range</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Products catalog top hero promo</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.cardDiabetic) || '/promos/promo_diabetic.jpg'}
                      alt="Diabetic Range"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_cardDiabetic')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.cardDiabetic && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, cardDiabetic: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Biotin Banner */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Products Page (Top Banner Card 2)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Biotin & Hair Nutrition</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Products catalog top hero promo</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.cardBiotin) || '/promos/promo_hair_biotin.jpg'}
                      alt="Biotin Nutrition"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_cardBiotin')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.cardBiotin && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, cardBiotin: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Respiratory Care */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Products Page (Middle Section Banner 1)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Respiratory & Chest Care</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Products catalog middle section promo</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.cardRespiratory) || '/promos/promo_respiratory.jpg'}
                      alt="Respiratory Care"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_cardRespiratory')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.cardRespiratory && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, cardRespiratory: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Pediatric Range */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Products Page (Middle Section Banner 2)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Pediatric Syrups & Drops</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Products catalog middle section promo</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.cardPediatric) || '/promos/promo_pediatric.jpg'}
                      alt="Pediatric Range"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_cardPediatric')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.cardPediatric && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, cardPediatric: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Dermatology Range */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Products Page (Bottom Promo Banner)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Dermatology & Skin Care</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Products catalog bottom promo</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.cardDerma) || '/promos/promo_derma_barrier.jpg'}
                      alt="Derma Range"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_cardDerma')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.cardDerma && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, cardDerma: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Product Detail Promo Banners */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={15} style={{ color: '#6828DC' }} />
                <span>Product Detail Sidebar Banners</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {/* Multivitamin Banner */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Single Product Detail Page (Sidebar Top Card)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Multivitamin & Immunity Boost</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Product detail sidebar promo</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.productMultivitamin) || '/promos/promo_multivitamin.jpg'}
                      alt="Multivitamin"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_productMultivitamin')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.productMultivitamin && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, productMultivitamin: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Wellness Banner */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '5px', fontSize: '10.5px', fontWeight: 800, marginBottom: '6px' }}>
                    <span>📍</span>
                    <span>Single Product Detail Page (Sidebar Bottom Card)</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Daily Vitality & Nutraceuticals</div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px' }}>Product detail sidebar promo</p>
                  <div style={{ height: '130px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px' }}>
                    <img
                      src={galleryService.formatUrl(formSettings.promoBanners?.productWellness) || '/promos/promo_wellness.jpg'}
                      alt="Daily Vitality"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setAboutMediaPickerField('promo_productWellness')}
                      style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#6828DC', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      Pick from Gallery
                    </button>
                    {formSettings.promoBanners?.productWellness && (
                      <button
                        type="button"
                        onClick={() => setFormSettings((prev) => ({ ...prev, promoBanners: { ...prev.promoBanners, productWellness: '' } }))}
                        style={{ padding: '6px 10px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', background: '#FFFFFF', color: '#EF4444', border: '1px solid #FECACA', cursor: 'pointer' }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FAQs & Answers Management */}
      {activeTab === 'faqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #EDE9FE',
              padding: 'clamp(16px, 3.5vw, 28px)',
              boxShadow: '0 4px 16px rgba(104, 40, 220, 0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#EDE9FE',
                    color: '#6828DC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Frequently Asked Questions ({faqList.length})
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
                    Manage client inquiries about stockists distribution rights, minimum order quantities, and delivery schedules.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingFaq({ question: '', answer: '', category: 'General', order: faqList.length + 1 });
                  setIsFaqModalOpen(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
                }}
              >
                <Plus size={15} /> Add New FAQ
              </button>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {['ALL', 'General', 'Stockists Distribution', 'Ordering & Delivery', 'Quality'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFaqFilter(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: faqFilter === cat ? '1px solid #6828DC' : '1px solid #E2E8F0',
                    background: faqFilter === cat ? '#EDE9FE' : '#FFFFFF',
                    color: faqFilter === cat ? '#6828DC' : '#64748B',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            {filteredFaqs.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px dashed #CBD5E1',
                }}
              >
                <HelpCircle size={32} style={{ color: '#94A3B8', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>No FAQs found</div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>Add commonly asked questions to help prospective stockist partners.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredFaqs.map((faq, idx) => (
                  <div
                    key={faq._id || faq.id || idx}
                    style={{
                      background: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            background: '#EDE9FE',
                            color: '#6828DC',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800,
                          }}
                        >
                          {faq.category || 'General'}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                          {faq.question}
                        </h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFaq(faq);
                            setIsFaqModalOpen(true);
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            color: '#475569',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(faq._id || faq.id || '')}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: '#FEF2F2',
                            border: '1px solid #FCA5A5',
                            color: '#DC2626',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: Quality Certifications & Accreditations Management */}
      {activeTab === 'certifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #EDE9FE',
              padding: 'clamp(16px, 3.5vw, 28px)',
              boxShadow: '0 4px 16px rgba(104, 40, 220, 0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#EDE9FE',
                    color: '#6828DC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Quality Accreditations & Certifications ({certList.length})
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
                    Showcase WHO-GMP, ISO 9001:2015, GLP, and DCGI compliance badges displayed across the website footer and trust sections.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCert({ title: '', issuer: '', description: '', certificateNumber: '', validUntil: '', icon: '' });
                  setIsCertModalOpen(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
                }}
              >
                <Plus size={15} /> Add Accreditation
              </button>
            </div>

            {certList.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px dashed #CBD5E1',
                }}
              >
                <Award size={32} style={{ color: '#94A3B8', margin: '0 auto 8px' }} />
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>No Certifications Added</div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>Add official regulatory certifications to build trust with distributors.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {certList.map((cert, idx) => (
                  <div
                    key={cert._id || cert.id || idx}
                    style={{
                      background: '#F8FAFC',
                      borderRadius: '14px',
                      border: '1.5px solid #E2E8F0',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span
                          style={{
                            background: '#EDE9FE',
                            color: '#6828DC',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 800,
                          }}
                        >
                          {cert.issuer || 'Accredited'}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCert(cert);
                              setIsCertModalOpen(true);
                            }}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              background: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              color: '#475569',
                              cursor: 'pointer',
                              fontSize: '11px',
                            }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCert(cert._id || cert.id || '')}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              background: '#FEF2F2',
                              border: '1px solid #FCA5A5',
                              color: '#DC2626',
                              cursor: 'pointer',
                              fontSize: '11px',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                        {cert.title}
                      </h4>
                      <p style={{ margin: '0 0 10px', fontSize: '12.5px', color: '#64748B', lineHeight: 1.5 }}>
                        {cert.description || 'Verified manufacturing and testing compliance standards.'}
                      </p>
                    </div>

                    <div
                      style={{
                        paddingTop: '10px',
                        borderTop: '1px solid #E2E8F0',
                        fontSize: '11.5px',
                        color: '#64748B',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>No: <b>{cert.certificateNumber || 'N/A'}</b></span>
                      <span>Valid: <b>{cert.validUntil || 'Active'}</b></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add/Edit FAQ */}
      {isFaqModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                {editingFaq?._id || editingFaq?.id ? 'Edit FAQ Item' : 'Add New FAQ Item'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="cms-label">
                <span>Category</span>
              </label>
              <select
                value={editingFaq?.category || 'General'}
                onChange={(e) => setEditingFaq((prev: any) => ({ ...prev, category: e.target.value }))}
                className="cms-input"
              >
                <option value="General">General</option>
                <option value="Stockists Distribution">Stockists Distribution</option>
                <option value="Ordering & Delivery">Ordering & Delivery</option>
                <option value="Quality">Quality & Formulations</option>
              </select>
            </div>

            <div>
              <label className="cms-label">
                <span>Question</span>
              </label>
              <input
                type="text"
                value={editingFaq?.question || ''}
                onChange={(e) => setEditingFaq((prev: any) => ({ ...prev, question: e.target.value }))}
                placeholder="e.g. What is the minimum investment for Stockists Distribution?"
                className="cms-input"
              />
            </div>

            <div>
              <label className="cms-label">
                <span>Answer</span>
              </label>
              <textarea
                rows={4}
                value={editingFaq?.answer || ''}
                onChange={(e) => setEditingFaq((prev: any) => ({ ...prev, answer: e.target.value }))}
                placeholder="Provide a clear, detailed response..."
                className="cms-input" style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFaqModal}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
                }}
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Certification */}
      {isCertModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                {editingCert?._id || editingCert?.id ? 'Edit Accreditation' : 'Add New Accreditation'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="cms-label">
                <span>Certification Title</span>
              </label>
              <input
                type="text"
                value={editingCert?.title || ''}
                onChange={(e) => setEditingCert((prev: any) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. WHO-GMP Certified Manufacturing"
                className="cms-input"
              />
            </div>

            <div>
              <label className="cms-label">
                <span>Issuing Authority</span>
              </label>
              <input
                type="text"
                value={editingCert?.issuer || ''}
                onChange={(e) => setEditingCert((prev: any) => ({ ...prev, issuer: e.target.value }))}
                placeholder="e.g. World Health Organization / DCGI"
                className="cms-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="cms-label">
                  <span>Certificate No.</span>
                </label>
                <input
                  type="text"
                  value={editingCert?.certificateNumber || ''}
                  onChange={(e) => setEditingCert((prev: any) => ({ ...prev, certificateNumber: e.target.value }))}
                  placeholder="e.g. GMP-IND-2024-981"
                  className="cms-input"
                />
              </div>
              <div>
                <label className="cms-label">
                  <span>Validity / Status</span>
                </label>
                <input
                  type="text"
                  value={editingCert?.validUntil || ''}
                  onChange={(e) => setEditingCert((prev: any) => ({ ...prev, validUntil: e.target.value }))}
                  placeholder="e.g. Valid until 2028 / Lifetime"
                  className="cms-input"
                />
              </div>
            </div>

            <div>
              <label className="cms-label">
                <span>Description</span>
              </label>
              <textarea
                rows={3}
                value={editingCert?.description || ''}
                onChange={(e) => setEditingCert((prev: any) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief summary of compliance coverage..."
                className="cms-input" style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCertModal}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
                }}
              >
                Save Accreditation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Gallery Picker for Logo */}
      <MediaGalleryModal
        isOpen={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
        defaultTag="LOGO"
        onSelect={(imgUrl) => {
          setFormSettings((prev) => ({ ...prev, logoUrl: imgUrl }));
        }}
      />

      {/* Media Gallery Picker for Hero Banner Image */}
      <MediaGalleryModal
        isOpen={bannerModalOpen}
        onClose={() => setBannerModalOpen(false)}
        defaultTag="BANNER"
        onSelect={(imgUrl) => {
          setBannerItem((prev: any) => ({ ...prev, imageUrl: imgUrl }));
        }}
      />

      {/* Media Gallery Picker for About & Promo Images */}
      <MediaGalleryModal
        isOpen={Boolean(aboutMediaPickerField)}
        onClose={() => setAboutMediaPickerField(null)}
        defaultTag="BANNER"
        onSelect={(imgUrl) => {
          if (!aboutMediaPickerField) return;
          if (aboutMediaPickerField.startsWith('promo_')) {
            const promoKey = aboutMediaPickerField.replace('promo_', '');
            setFormSettings((prev: any) => ({
              ...prev,
              promoBanners: {
                ...(prev.promoBanners || {}),
                [promoKey]: imgUrl,
              },
            }));
          } else {
            setAboutForm((prev: any) => ({
              ...prev,
              [aboutMediaPickerField]: imgUrl,
            }));
          }
          setAboutMediaPickerField(null);
        }}
      />
    </div>
  );
};


