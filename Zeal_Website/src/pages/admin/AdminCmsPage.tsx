import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  AlertCircle,
  Palette,
  Phone,
  Building,
  Image,
  MousePointerClick
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { contentService } from '../../api/contentService';
import type { ISiteSettings, IBannerItem, IAboutContent } from '../../types';

export const AdminCmsPage: React.FC = () => {
  const { settings, banners, about, refreshSettings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'hero' | 'about'>('branding');

  // Form States
  const [formSettings, setFormSettings] = useState<ISiteSettings>(settings);
  const [bannerItem, setBannerItem] = useState<IBannerItem>(banners[0] || {
    id: 'banner-1',
    title: 'Partner with India’s Most Trusted Stockists Distribution Network',
    subtitle: 'Over 18+ WHO-GMP & ISO certified pharmaceutical formulations with authorized stockists distribution rights.',
    badge: 'Leading Stockists Distribution Network in India',
    ctaText: 'Apply for Stockists Distribution',
    ctaLink: '/contact',
    isActive: true,
  });
  const [aboutForm, setAboutForm] = useState<IAboutContent>(about);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setFormSettings(settings);
    if (banners.length > 0) setBannerItem(banners[0]);
    setAboutForm(about);
  }, [settings, banners, about]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBannerItem(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAboutForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

      // 2. Update Hero Banner
      await contentService.updateContent('banners', {
        title: 'Homepage Hero Banners',
        content: [bannerItem],
        isActive: true,
      });

      // 3. Update About Content
      await contentService.updateContent('about-us', {
        title: 'About Zeal Pharmaceuticals',
        content: aboutForm,
        isActive: true,
      });

      // 4. Refresh site settings in reactive context
      await refreshSettings();

      setSaveSuccess('All changes saved successfully! The live website has been updated instantly with your new logo, text, and buttons.');
      setTimeout(() => setSaveSuccess(''), 5000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save CMS updates to backend.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
            Site Customizer & CMS Content Editor
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
            Modify website branding, logos, button labels, phone numbers, and pharma copy without editing any code.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn btn-primary"
          style={{ borderRadius: '8px', padding: '12px 24px', fontSize: '14.5px' }}
        >
          <Save size={17} />
          <span>{saving ? 'Saving to Database...' : 'Save & Publish Changes'}</span>
        </button>
      </div>

      {/* Success / Error Banners */}
      {saveSuccess && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          padding: '16px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          fontSize: '14px',
        }}>
          <CheckCircle size={22} style={{ color: '#10B981', flexShrink: 0 }} />
          <div>{saveSuccess}</div>
        </div>
      )}

      {saveError && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#991B1B',
          padding: '14px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
          fontSize: '13.5px',
        }}>
          <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />
          <div>{saveError}</div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid #E2E8F0',
        marginBottom: '28px',
      }}>
        {[
          { id: 'branding', label: 'Logo & Buttons', icon: <Palette size={16} /> },
          { id: 'contact', label: 'Topbar & Contact Helpline', icon: <Phone size={16} /> },
          { id: 'hero', label: 'Hero Banners & Headlines', icon: <Image size={16} /> },
          { id: 'about', label: 'About Story & Leadership', icon: <Building size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderBottom: activeTab === tab.id ? '2.5px solid #6828DC' : '2.5px solid transparent',
              color: activeTab === tab.id ? '#6828DC' : '#64748B',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '14px',
              background: 'transparent',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: BRANDING, LOGO & BUTTON LABELS */}
      {activeTab === 'branding' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={20} style={{ color: '#6828DC' }} />
            <span>Logo, Brand Name & Buttons Configuration</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Company Brand Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formSettings.companyName}
                onChange={handleSettingsChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Company Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formSettings.tagline}
                onChange={handleSettingsChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Custom Logo Image URL (Leave blank to use modern high-res vector pinwheel)
            </label>
            <input
              type="text"
              name="logoUrl"
              placeholder="https://example.com/logo.png or /uploads/logo.png"
              value={formSettings.logoUrl || ''}
              onChange={handleSettingsChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Buttons Customization */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            padding: '20px',
            borderRadius: '12px',
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MousePointerClick size={18} style={{ color: '#6828DC' }} />
              <span>Navbar & Pre-Footer Button Settings</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Primary CTA Button Label (Navbar & Banner)
                </label>
                <input
                  type="text"
                  name="primaryCtaText"
                  placeholder="e.g. Enquire Now"
                  value={formSettings.primaryCtaText || 'Enquire Now'}
                  onChange={handleSettingsChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    background: '#FFFFFF',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Button Action / Target Link
                </label>
                <input
                  type="text"
                  name="primaryCtaLink"
                  placeholder="e.g. /contact or opens Stockists / Distribution Modal"
                  value={formSettings.primaryCtaLink || '/contact'}
                  onChange={handleSettingsChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    background: '#FFFFFF',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPBAR & CONTACT HELPLINES */}
      {activeTab === 'contact' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Helpline Phone Numbers, WhatsApp & Addresses
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Main Hotline Phone (Topbar & Cards)
              </label>
              <input
                type="text"
                name="phone"
                value={formSettings.phone}
                onChange={handleSettingsChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Sales Helpline
              </label>
              <input
                type="text"
                name="salesHelpline"
                value={formSettings.salesHelpline}
                onChange={handleSettingsChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                WhatsApp Lead Alert Number (Receives Leads)
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={formSettings.whatsappNumber}
                onChange={handleSettingsChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Primary Email
              </label>
              <input
                type="email"
                name="email"
                value={formSettings.email}
                onChange={handleSettingsChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Working Hours
              </label>
              <input
                type="text"
                name="workingHours"
                value={formSettings.workingHours}
                onChange={handleSettingsChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Head Office Address
            </label>
            <input
              type="text"
              name="headOfficeAddress"
              value={formSettings.headOfficeAddress}
              onChange={handleSettingsChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                GSTIN Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formSettings.gstNumber || ''}
                onChange={handleSettingsChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Wholesale Drug License No.
              </label>
              <input
                type="text"
                name="drugLicenseNumber"
                value={formSettings.drugLicenseNumber || ''}
                onChange={handleSettingsChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HERO BANNER & HEADLINES */}
      {activeTab === 'hero' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Homepage Hero Headline & Subtitles
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Badge Text (Top Pill)
            </label>
            <input
              type="text"
              name="badge"
              value={bannerItem.badge || ''}
              onChange={handleBannerChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Main Heading Title
            </label>
            <input
              type="text"
              name="title"
              value={bannerItem.title}
              onChange={handleBannerChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Subtitle Description
            </label>
            <textarea
              name="subtitle"
              rows={3}
              value={bannerItem.subtitle}
              onChange={handleBannerChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                CTA Button Text
              </label>
              <input
                type="text"
                name="ctaText"
                value={bannerItem.ctaText || ''}
                onChange={handleBannerChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                CTA Button Link
              </label>
              <input
                type="text"
                name="ctaLink"
                value={bannerItem.ctaLink || ''}
                onChange={handleBannerChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ABOUT STORY & LEADERSHIP */}
      {activeTab === 'about' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Company Legacy Story, Mission & Leadership Message
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Company Story Narrative (A Legacy of Better Healthcare)
            </label>
            <textarea
              name="companyStory"
              rows={4}
              value={aboutForm.companyStory}
              onChange={handleAboutChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Mission Statement
              </label>
              <textarea
                name="mission"
                rows={3}
                value={aboutForm.mission}
                onChange={handleAboutChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Vision Statement
              </label>
              <textarea
                name="vision"
                rows={3}
                value={aboutForm.vision}
                onChange={handleAboutChange}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Executive Director’s Quote / Message
            </label>
            <textarea
              name="directorMessage"
              rows={3}
              value={aboutForm.directorMessage || ''}
              onChange={handleAboutChange}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
