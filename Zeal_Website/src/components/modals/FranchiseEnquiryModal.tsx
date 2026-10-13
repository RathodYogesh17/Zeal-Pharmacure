import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Send,
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Warehouse,
  Truck,
  FileText,
  Sparkles,
  MessageSquare,
  Package,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { enquiryService } from '../../api/enquiryService';
import { ThemedSelect } from '../common/ThemedSelect';
import { VerifiedUserBadge } from '../common/VerifiedUserBadge';
import { buildFranchiseWhatsAppMessage } from '../../utils/whatsappMessageBuilder';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi (NCT)',
  'Jammu & Kashmir',
  'Ladakh',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Puducherry',
];

const BUSINESS_TYPE_OPTIONS = [
  { value: 'INDIVIDUAL', label: 'Individual / Independent Professional' },
  { value: 'PROPRIETORSHIP', label: 'Sole Proprietorship Firm' },
  { value: 'PARTNERSHIP', label: 'Partnership Enterprise' },
  { value: 'PRIVATE_LIMITED', label: 'Private Limited Company (Pvt. Ltd.)' },
  { value: 'LLP', label: 'Limited Liability Partnership (LLP)' },
  { value: 'OTHER', label: 'Chemist Retail Chain / Other Entity' },
];

const INVESTMENT_OPTIONS = [
  { value: '₹50,000 - ₹1,00,000', label: '₹50,000 - ₹1,00,000 (Entry Level / District Starter)' },
  { value: '₹1,00,000 - ₹2,50,000', label: '₹1,00,000 - ₹2,50,000 (Standard District Monopoly)' },
  { value: '₹2,50,000 - ₹5,00,000', label: '₹2,50,000 - ₹5,00,000 (Zonal Master Stockist)' },
  { value: '₹5,00,000 - ₹10,00,000', label: '₹5,00,000 - ₹10,00,000 (Regional Institutional Hub)' },
  { value: '₹10,00,000+', label: '₹10,00,000+ (Exclusive State Super-Stockist)' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'Fresh Entrepreneur', label: 'New to Pharma / Fresh Entrepreneur' },
  { value: '1-3 Years', label: '1 - 3 Years (Ex-Medical Rep / Chemist Counter)' },
  { value: '3-7 Years', label: '3 - 7 Years (Wholesale Stockist / Sub-Stockist)' },
  { value: '7+ Years', label: '7+ Years (Established C&F / Stockists / Distribution Partner)' },
];

const PRODUCT_DIVISIONS = [
  'General Therapeutics',
  'Tablets & Capsules',
  'Syrups & Suspensions',
  'Injections & Critical Care',
  'Derma & Skincare',
  'Pediatric Range',
  'Cardiac & Diabetic',
  'Nutraceuticals & Protein',
];

const SectionWrapper: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  rightBadge?: React.ReactNode;
}> = ({ icon, title, children, rightBadge }) => (
  <div
    style={{
      background: '#F8FAFC',
      borderRadius: '16px',
      border: '1.2px solid #E2E8F0',
      padding: '18px 20px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 800,
          color: '#6828DC',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}
      >
        {icon}
        <span>{title}</span>
      </div>
      {rightBadge}
    </div>
    {children}
  </div>
);

const FormFieldInput: React.FC<{
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
}> = ({ label, name, type = 'text', required = false, placeholder, value, onChange, maxLength, disabled = false, error }) => (
  <div>
    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
      {label} {required && '*'}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        border: error ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
        boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
        fontSize: '13.5px',
        fontWeight: 600,
        color: '#0F172A',
        outline: 'none',
        background: disabled ? '#F1F5F9' : '#FFFFFF',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = '#6828DC';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
        }
      }}
      onBlur={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = '#CBD5E1';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    />
    {error && (
      <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, lineHeight: 1.35, marginTop: '3px', display: 'block' }}>
        {error}
      </span>
    )}
  </div>
);

export const FranchiseEnquiryModal: React.FC = () => {
  const { isFranchiseModalOpen, closeFranchiseModal, settings } = useSiteSettings();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    whatsappNumber: user?.phone || '',
    sameAsPhone: true,
    email: user?.email || '',
    companyName: '',
    businessType: 'INDIVIDUAL',
    city: '',
    district: '',
    state: 'Gujarat',
    pincode: '',
    address: '',
    investmentBudget: '₹50,000 - ₹1,00,000',
    experienceYears: '1-3 Years',
    pharmaExperience: '1-3 Years',
    currentBusiness: '',
    interestedDivisions: ['General Therapeutics', 'Tablets & Capsules'],
    hasDrugLicense: true,
    drugLicenseNumber: '',
    hasGst: true,
    gstNumber: '',
    hasGodownFacility: true,
    hasTransportFacility: false,
    message: '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        whatsappNumber: prev.whatsappNumber || user.phone || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
    district?: string;
    city?: string;
    pincode?: string;
  }>({});

  if (!isFranchiseModalOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'sameAsPhone') {
        setFormData(prev => ({
          ...prev,
          sameAsPhone: checked,
          whatsappNumber: checked ? prev.phone : prev.whatsappNumber,
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => {
        const next = { ...prev, [name]: value };
        if (name === 'phone' && prev.sameAsPhone) {
          next.whatsappNumber = value;
        }
        return next;
      });
    }
  };

  const handleSelectChange = (val: string, name?: string) => {
    if (!name) return;
    setFormData(prev => {
      if (name === 'experienceYears') {
        return { ...prev, experienceYears: val, pharmaExperience: val };
      }
      return { ...prev, [name]: val };
    });
  };

  const toggleDivision = (division: string) => {
    setFormData(prev => {
      const exists = prev.interestedDivisions.includes(division);
      const updated = exists
        ? prev.interestedDivisions.filter(d => d !== division)
        : [...prev.interestedDivisions, division];
      return { ...prev, interestedDivisions: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: typeof fieldErrors = {};
    const effectiveName = formData.fullName.trim() || user?.name || '';
    if (!effectiveName) {
      errs.fullName = 'Full name is required';
    } else if (effectiveName.length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

    const effectivePhone = formData.phone.trim() || user?.phone || '';
    const rawDigits = effectivePhone.replace(/[\s\-\(\)\+]/g, '');
    const cleanPhone = rawDigits.length > 10 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;
    if (!rawDigits) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    const effectiveEmail = formData.email.trim() || user?.email || '';
    if (!effectiveEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.district.trim()) errs.district = 'Preferred District is required';
    if (!formData.city.trim()) errs.city = 'City / Headquarters is required';

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        name: effectiveName,
        fullName: effectiveName,
        phone: cleanPhone,
        whatsappNumber: formData.sameAsPhone
          ? cleanPhone
          : formData.whatsappNumber.trim() || cleanPhone,
        email: effectiveEmail,
        companyName: formData.companyName.trim(),
        businessType: formData.businessType,
        city: formData.city.trim(),
        district: formData.district.trim() || formData.city.trim(),
        preferredTerritory: formData.district.trim() || formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        address: formData.address.trim(),
        investmentBudget: formData.investmentBudget,
        experienceYears: formData.experienceYears,
        pharmaExperience: formData.pharmaExperience,
        currentBusiness: formData.currentBusiness.trim(),
        interestedDivisions: formData.interestedDivisions,
        hasDrugLicense: formData.hasDrugLicense,
        drugLicenseNumber: formData.hasDrugLicense ? formData.drugLicenseNumber.trim() : '',
        hasGst: formData.hasGst,
        gstNumber: formData.hasGst ? formData.gstNumber.trim() : '',
        hasGodownFacility: formData.hasGodownFacility,
        hasTransportFacility: formData.hasTransportFacility,
        message: formData.message.trim(),
        source: 'WEBSITE',
        isConfirmed: true,
      };

      await enquiryService.submitFranchiseEnquiry(payload);
      setSuccessMsg(
        'Your Stockists Distribution application has been submitted successfully! Our Area Business Manager has been alerted and will contact you within 24 hours.'
      );
      setTimeout(() => {
        closeFranchiseModal();
        setSuccessMsg('');
      }, 3500);
    } catch (err: any) {
      setErrorMsg(
        err.message || 'Failed to submit application. Please verify your contact details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsAppChat = () => {
    const waText = buildFranchiseWhatsAppMessage({
      fullName: formData.fullName || user?.name || 'Prospective Stockist',
      phone: formData.phone || user?.phone || '',
      email: formData.email || user?.email || '',
      state: formData.state,
      district: formData.district || formData.city,
      city: formData.city,
      pincode: formData.pincode,
      companyName: formData.companyName,
      businessType: formData.businessType,
      investmentBudget: formData.investmentBudget,
      pharmaExperience: formData.pharmaExperience,
      drugLicenseNumber: formData.hasDrugLicense ? formData.drugLicenseNumber : undefined,
      gstNumber: formData.hasGst ? formData.gstNumber : undefined,
      interestedDivisions: formData.interestedDivisions,
      message: formData.message,
      authUser: user ? { name: user.name, phone: user.phone || formData.phone, email: user.email } : undefined,
    });
    const targetNumber = (settings.whatsappNumber || settings.salesHelpline || '919876543210').replace(
      /[^0-9]/g,
      ''
    );
    window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(waText)}`, '_blank');
  };

  return (
    <div
      className="modal-overlay"
      onClick={closeFranchiseModal}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          background: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 65px -12px rgba(104, 40, 220, 0.35), 0 0 0 1px rgba(104, 40, 220, 0.15)',
          border: '1.5px solid rgba(104, 40, 220, 0.2)',
          position: 'relative',
        }}
      >
        {/* =========================================================================
            TOP BANNER: Styled exactly according to image with warehouse rack image
        ========================================================================= */}
        <div
          style={{
            position: 'relative',
            backgroundImage: `linear-gradient(90deg, rgba(245, 243, 255, 0.98) 0%, rgba(245, 243, 255, 0.94) 52%, rgba(245, 243, 255, 0.70) 78%, rgba(245, 243, 255, 0.22) 100%), url('/banners/stockist_warehouse_rack.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'right center',
            padding: '24px 28px 20px',
            borderBottom: '1.5px solid #EDE9FE',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ maxWidth: '520px', zIndex: 2 }}>
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 900,
                color: 'var(--zp-primary, #6828DC)',
                background: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: '8px',
                marginBottom: '8px',
                border: '1.2px solid #DDD6FE',
                letterSpacing: '0.6px',
                boxShadow: '0 2px 6px rgba(104, 40, 220, 0.08)',
              }}
            >
              <Sparkles size={13} color="#6828DC" />
              <span>STOCKISTS / DISTRIBUTION</span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#0F172A',
                lineHeight: 1.25,
                margin: '0 0 6px 0',
                letterSpacing: '-0.3px',
              }}
            >
              Pan-India Pharmaceutical Supply Chain
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '13px',
                color: '#475569',
                margin: '0 0 12px 0',
                lineHeight: 1.45,
                fontWeight: 500,
              }}
            >
              Exclusive territorial Stockists / Distribution network with promotional support.
            </p>

            {/* Highlights Bar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #DDD6FE',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#5B21B6',
                }}
              >
                <ShieldCheck size={13} color="#6828DC" /> 100% District Monopoly
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #BBF7D0',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#065F46',
                }}
              >
                <Package size={13} color="#059669" /> WHO-GMP Formulations
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #DDD6FE',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#5B21B6',
                }}
              >
                <Clock size={13} color="#6828DC" /> 24-48h Express Dispatch
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={closeFranchiseModal}
            aria-label="Close dialog"
            style={{
              padding: '8px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1.2px solid #E2E8F0',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
              zIndex: 3,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Verified Account Badge */}
          <VerifiedUserBadge user={user} />

          {/* Success Alert */}
          {successMsg && (
            <div
              style={{
                background: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                color: '#065F46',
                padding: '18px 20px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
              }}
            >
              <CheckCircle size={28} style={{ color: '#10B981', flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800 }}>
                  Application Dispatched to Head Office!
                </h4>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#047857' }}>{successMsg}</p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMsg && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1.5px solid #FECACA',
                color: '#991B1B',
                padding: '14px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '13.5px',
              }}
            >
              <AlertCircle size={22} style={{ color: '#EF4444', flexShrink: 0 }} />
              <div>{errorMsg}</div>
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* =========================================================================
                  SECTION 1: APPLICANT & FIRM IDENTITY
              ========================================================================= */}
              <SectionWrapper icon={<Building2 size={16} />} title="1. Applicant & Commercial Enterprise">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <FormFieldInput
                    label="Full Name"
                    name="fullName"
                    required
                    placeholder="e.g. Rajesh Kumar Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={fieldErrors.fullName}
                  />

                  <FormFieldInput
                    label="Primary Mobile Number"
                    name="phone"
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    error={fieldErrors.phone}
                  />

                  {/* WhatsApp Number with toggle */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        WhatsApp Number
                      </label>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#6828DC', cursor: 'pointer', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          name="sameAsPhone"
                          checked={formData.sameAsPhone}
                          onChange={handleChange}
                          style={{ width: '13px', height: '13px', accentColor: '#6828DC' }}
                        />
                        Same as mobile
                      </label>
                    </div>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      disabled={formData.sameAsPhone}
                      placeholder={formData.sameAsPhone ? formData.phone || 'Same as primary mobile' : 'WhatsApp number'}
                      value={formData.sameAsPhone ? formData.phone : formData.whatsappNumber}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: formData.sameAsPhone ? '#64748B' : '#0F172A',
                        background: formData.sameAsPhone ? '#F1F5F9' : '#FFFFFF',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <FormFieldInput
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    placeholder="name@pharmaagency.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                  />

                  <FormFieldInput
                    label="Firm / Agency Name (Optional)"
                    name="companyName"
                    placeholder="e.g. Om Sai Medical Agencies"
                    value={formData.companyName}
                    onChange={handleChange}
                  />

                  <div>
                    <ThemedSelect
                      label="Business Entity Structure"
                      name="businessType"
                      value={formData.businessType}
                      options={BUSINESS_TYPE_OPTIONS}
                      onChange={handleSelectChange}
                      icon={<Building2 size={14} />}
                    />
                  </div>
                </div>
              </SectionWrapper>

              {/* =========================================================================
                  SECTION 2: TERRITORIAL MONOPOLY ALLOCATION
              ========================================================================= */}
              <SectionWrapper icon={<MapPin size={16} />} title="2. Territorial Monopoly Rights & Location">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <ThemedSelect
                      label="State"
                      name="state"
                      value={formData.state}
                      options={INDIAN_STATES}
                      searchable={true}
                      searchPlaceholder="Type state name..."
                      onChange={handleSelectChange}
                      required={true}
                      icon={<MapPin size={14} />}
                    />
                  </div>

                  <FormFieldInput
                    label="Preferred District (Monopoly Territory)"
                    name="district"
                    required
                    placeholder="e.g. Surat, Rajkot, Jaipur, Pune"
                    value={formData.district}
                    onChange={handleChange}
                    error={fieldErrors.district}
                  />

                  <FormFieldInput
                    label="City / Headquarters"
                    name="city"
                    required
                    placeholder="e.g. Vadodara, Ahmedabad"
                    value={formData.city}
                    onChange={handleChange}
                    error={fieldErrors.city}
                  />

                  <FormFieldInput
                    label="Pincode / Postal Code"
                    name="pincode"
                    maxLength={10}
                    placeholder="e.g. 390001"
                    value={formData.pincode}
                    onChange={handleChange}
                    error={fieldErrors.pincode}
                  />
                </div>
              </SectionWrapper>

              {/* =========================================================================
                  SECTION 3: COMMERCIAL INVESTMENT & EXPERIENCE PROFILE
              ========================================================================= */}
              <SectionWrapper icon={<IndianRupee size={16} />} title="3. Commercial Capacity & Domain Background">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div>
                    <ThemedSelect
                      label="Investment Capacity"
                      name="investmentBudget"
                      value={formData.investmentBudget}
                      options={INVESTMENT_OPTIONS}
                      onChange={handleSelectChange}
                      required={true}
                      icon={<IndianRupee size={14} />}
                    />
                  </div>

                  <div>
                    <ThemedSelect
                      label="Pharma Distribution Experience"
                      name="experienceYears"
                      value={formData.experienceYears}
                      options={EXPERIENCE_OPTIONS}
                      onChange={handleSelectChange}
                      icon={<Clock size={14} />}
                    />
                  </div>

                  <FormFieldInput
                    label="Current Occupation / Line of Business"
                    name="currentBusiness"
                    placeholder="e.g. Retail Chemist, Wholesale Distributor, Ex-MR"
                    value={formData.currentBusiness}
                    onChange={handleChange}
                  />
                </div>
              </SectionWrapper>

              {/* =========================================================================
                  SECTION 4: PRODUCT DIVISIONS OF INTEREST (INTERACTIVE CHIPS)
              ========================================================================= */}
              <SectionWrapper
                icon={<Package size={16} />}
                title="4. Product Divisions of Interest"
                rightBadge={<span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>Select all that apply</span>}
              >
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PRODUCT_DIVISIONS.map(div => {
                    const isSelected = formData.interestedDivisions.includes(div);
                    return (
                      <button
                        key={div}
                        type="button"
                        onClick={() => toggleDivision(div)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: '999px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                          border: isSelected ? '1.5px solid #6828DC' : '1.2px solid #CBD5E1',
                          background: isSelected ? '#F5F3FF' : '#FFFFFF',
                          color: isSelected ? '#6828DC' : '#475569',
                          boxShadow: isSelected ? '0 2px 8px rgba(104, 40, 220, 0.15)' : 'none',
                        }}
                      >
                        {isSelected && <CheckCircle size={14} color="#6828DC" />}
                        <span>{div}</span>
                      </button>
                    );
                  })}
                </div>
              </SectionWrapper>

              {/* =========================================================================
                  SECTION 5: STATUTORY LICENSES & WAREHOUSE LOGISTICS
              ========================================================================= */}
              <SectionWrapper icon={<FileText size={16} />} title="5. Statutory Credentials & Logistics Facilities">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  {/* Drug License Card */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1.2px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: formData.hasDrugLicense ? '8px' : '0' }}>
                      <input
                        type="checkbox"
                        id="modalHasDrugLicense"
                        name="hasDrugLicense"
                        checked={formData.hasDrugLicense}
                        onChange={handleChange}
                        style={{ width: '16px', height: '16px', accentColor: '#6828DC', cursor: 'pointer' }}
                      />
                      <label
                        htmlFor="modalHasDrugLicense"
                        style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}
                      >
                        I possess a valid Wholesale Drug License (Form 20B/21B)
                      </label>
                    </div>

                    {formData.hasDrugLicense && (
                      <input
                        type="text"
                        name="drugLicenseNumber"
                        placeholder="Enter Drug License Number (e.g. 20B/GJ-VAD/12345)"
                        value={formData.drugLicenseNumber}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '13px',
                          fontWeight: 600,
                          background: '#FAF5FF',
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                    )}
                  </div>

                  {/* GST Registration Card */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1.2px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '12px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: formData.hasGst ? '8px' : '0' }}>
                      <input
                        type="checkbox"
                        id="modalHasGst"
                        name="hasGst"
                        checked={formData.hasGst}
                        onChange={handleChange}
                        style={{ width: '16px', height: '16px', accentColor: '#6828DC', cursor: 'pointer' }}
                      />
                      <label
                        htmlFor="modalHasGst"
                        style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}
                      >
                        I possess a valid GSTIN Registration Number
                      </label>
                    </div>

                    {formData.hasGst && (
                      <input
                        type="text"
                        name="gstNumber"
                        maxLength={15}
                        placeholder="Enter 15-character GSTIN (Optional)"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '13px',
                          fontWeight: 600,
                          background: '#FAF5FF',
                          color: '#0F172A',
                          outline: 'none',
                        }}
                      />
                    )}
                  </div>

                  {/* Logistics Facility Checkboxes */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#FFFFFF',
                        border: '1.2px solid #E2E8F0',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        name="hasGodownFacility"
                        checked={formData.hasGodownFacility}
                        onChange={handleChange}
                        style={{ width: '15px', height: '15px', accentColor: '#6828DC' }}
                      />
                      <Warehouse size={15} color="#6828DC" />
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Warehouse / Godown Space Available
                      </span>
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#FFFFFF',
                        border: '1.2px solid #E2E8F0',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        name="hasTransportFacility"
                        checked={formData.hasTransportFacility}
                        onChange={handleChange}
                        style={{ width: '15px', height: '15px', accentColor: '#6828DC' }}
                      />
                      <Truck size={15} color="#059669" />
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Local Delivery Fleet / Vehicles Available
                      </span>
                    </label>
                  </div>
                </div>
              </SectionWrapper>

              {/* Remarks / Message */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Specific Requirements / Existing Chemist Coverage (Optional)
                </label>
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Mention your existing chemist network count, target town coverage, or specific therapeutic formulations required..."
                  value={formData.message}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#0F172A',
                    outline: 'none',
                    resize: 'vertical',
                    background: '#FFFFFF',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '4px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    padding: '14px 24px',
                    fontSize: '15px',
                    fontWeight: 800,
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6828DC 0%, #4F46E5 100%)',
                    color: '#FFFFFF',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 20px rgba(104, 40, 220, 0.35)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {loading ? (
                    <span>Submitting Application to Sales Team...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Apply for Stockists / Distribution</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsAppChat}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '12px',
                    border: '1.5px solid #BBF7D0',
                    background: '#F0FDF4',
                    color: '#065F46',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <MessageSquare size={16} color="#059669" />
                  <span>WhatsApp Desk</span>
                </button>
              </div>

              {/* Compliance & Privacy footer note */}
              <p
                style={{
                  fontSize: '11.5px',
                  color: '#64748B',
                  textAlign: 'center',
                  margin: '4px 0 0 0',
                }}
              >
                🔒 All applications are reviewed by our Business Development Director. Territory exclusivity is guaranteed upon formal agreement signing.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
