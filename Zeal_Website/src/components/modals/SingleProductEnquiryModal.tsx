import React, { useState } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  Package,
  MessageSquare,
  Pill,
} from 'lucide-react';
import type { IProduct } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { enquiryService } from '../../api/enquiryService';
import { FormAlert, SuccessStateView, ThemedSelect } from '../common';
import { VerifiedUserBadge } from '../common/VerifiedUserBadge';
import { getMediaUrl } from '../../utils/mediaUtils';
import { B2BCustomerFields } from '../common/forms';
import { buildProductWhatsAppMessage } from '../../utils/whatsappMessageBuilder';

interface SingleProductEnquiryModalProps {
  product: IProduct | null;
  onClose: () => void;
}

export const SingleProductEnquiryModal: React.FC<SingleProductEnquiryModalProps> = ({
  product,
  onClose,
}) => {
  const { user } = useAuth();

  const [quantityCount, setQuantityCount] = useState<number | string>(100);
  const [selectedUnit, setSelectedUnit] = useState<string>('Boxes');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    companyName: '',
    city: '',
    state: '',
    quantity: '100 Boxes',
    drugLicenseNumber: '',
    gstNumber: '',
    message: '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
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
    city?: string;
    state?: string;
  }>({});

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: typeof fieldErrors = {};
    const effectiveName = formData.name.trim() || user?.name || '';
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

    if (!formData.city.trim()) errs.city = 'City / Headquarters is required';
    if (!formData.state.trim()) errs.state = 'State is required';

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await enquiryService.submitProductEnquiry({
        enquiryType: 'SINGLE_PRODUCT',
        productId: product._id,
        product: product._id,
        productSlug: product.slug,
        name: effectiveName,
        fullName: effectiveName,
        phone: cleanPhone,
        email: effectiveEmail,
        companyName: formData.companyName.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        quantity: formData.quantity,
        drugLicenseNumber: formData.drugLicenseNumber.trim() || undefined,
        gstNumber: formData.gstNumber.trim() || undefined,
        message:
          formData.message.trim() ||
          `Wholesale B2B enquiry for ${product.name} (${product.genericName || ''}) - Pack: ${product.packaging || 'Standard Pack'}`,
        source: 'PRODUCT_PAGE',
      });

      setSuccessMsg(
        `Thank you! Your inquiry for ${product.name} has been registered. Our Area Sales Manager will connect with you via Phone & WhatsApp with distributor net rates.`
      );

      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit enquiry. Please check your contact information and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const waText = buildProductWhatsAppMessage({
      productName: product.name,
      genericName: product.genericName,
      dosageForm: product.dosageForm,
      packaging: product.packaging,
      mrp: product.mrp,
      fullName: formData.name || user?.name || '',
      phone: formData.phone || user?.phone || '',
      email: formData.email || user?.email || '',
      companyName: formData.companyName,
      city: formData.city,
      state: formData.state,
      quantity: formData.quantity,
      drugLicenseNumber: formData.drugLicenseNumber,
      gstNumber: formData.gstNumber,
      message: formData.message,
      authUser: user ? { name: user.name, phone: user.phone || formData.phone, email: user.email } : undefined,
    });
    window.open(`https://wa.me/919316227576?text=${encodeURIComponent(waText)}`, '_blank');
  };

  return (
    <div className="zp-modal-overlay" onClick={onClose}>
      <div
        className="zp-modal-box"
        style={{ maxWidth: '680px', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Product Preview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            paddingBottom: '18px',
            borderBottom: '1.5px solid #F1F5F9',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Product Thumbnail Stage */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: '#FAF5FF',
                border: '1.5px solid #EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {product.featuredImage ? (
                <img
                  src={getMediaUrl(product.featuredImage)}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                />
              ) : (
                <Pill size={28} color="#6828DC" />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span className="zp-badge-purple" style={{ fontSize: '11px', padding: '3px 8px' }}>
                  {product.dosageForm || 'Formulation'}
                </span>
                <span className="zp-badge-green" style={{ fontSize: '11px', padding: '3px 8px' }}>
                  Stockists Distribution Ready
                </span>
                {product.prescriptionType && (
                  <span
                    style={{
                      background: '#F1F5F9',
                      color: '#475569',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {product.prescriptionType}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                Enquire for {product.name}
              </h3>
              <p style={{ fontSize: '12.5px', color: '#6828DC', fontWeight: 600, margin: '2px 0 0 0' }}>
                {product.genericName} • {product.packaging || 'Commercial Packaging'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="zp-modal-close-btn"
            title="Close"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Verified User Badge */}
        <VerifiedUserBadge user={user} />

        {/* Composition Snippet */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
            border: '1px solid #DDD6FE',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '18px',
            fontSize: '12.5px',
            color: '#4C1D95',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ShieldCheck size={16} color="#6828DC" style={{ flexShrink: 0 }} />
          <span>
            <strong>Composition:</strong> {product.composition || 'Active Pharmaceutical Formulation'}
          </span>
        </div>

        {/* Success Feedback View */}
        {successMsg ? (
          <SuccessStateView
            title="Enquiry Registered Successfully!"
            message={successMsg}
            actionButtonText="Back to Formulations"
            onAction={onClose}
          />
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FormAlert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />

            {/* Quantity & Unit Selector */}
            <div>
              <label className="zp-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Package size={13} color="#6828DC" />
                <span>ESTIMATED QUANTITY & PACK TYPE</span>
              </label>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  value={quantityCount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuantityCount(val);
                    setFormData((prev) => ({ ...prev, quantity: val ? `${val} ${selectedUnit}` : '' }));
                  }}
                  className="zp-input"
                  style={{ flex: '1 1 120px', fontWeight: 700 }}
                />

                <div style={{ flex: '1 1 200px' }}>
                  <ThemedSelect
                    value={selectedUnit}
                    onChange={(u) => {
                      setSelectedUnit(u);
                      setFormData((prev) => ({ ...prev, quantity: quantityCount ? `${quantityCount} ${u}` : u }));
                    }}
                    options={[
                      { value: 'Boxes', label: 'Boxes' },
                      { value: 'Strips', label: 'Strips' },
                      { value: 'Bottles / Syrup', label: 'Bottles / Syrup' },
                      { value: 'Tablets / Capsules', label: 'Tablets / Capsules' },
                      { value: 'Vials / Injections', label: 'Vials / Injections' },
                      { value: 'Tubes', label: 'Tubes (Ointment/Gel)' },
                      { value: 'Cartons', label: 'Cartons' },
                    ]}
                    buttonStyle={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#FAF5FF',
                      border: '1.5px solid #DDD6FE',
                      color: '#6828DC',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Quick Select:</span>
                {[50, 100, 200, 500, 1000].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setQuantityCount(num);
                      setFormData((prev) => ({ ...prev, quantity: `${num} ${selectedUnit}` }));
                    }}
                    style={{
                      background: String(quantityCount) === String(num) ? '#EDE9FE' : '#F8FAFC',
                      color: String(quantityCount) === String(num) ? '#6828DC' : '#64748B',
                      border: String(quantityCount) === String(num) ? '1px solid #6828DC' : '1px solid #E2E8F0',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {num} {selectedUnit}
                  </button>
                ))}
              </div>
            </div>

            {/* Reusable B2B Customer Fields */}
            <B2BCustomerFields
              formData={{
                fullName: formData.name,
                phone: formData.phone,
                email: formData.email,
                companyName: formData.companyName,
                city: formData.city,
                state: formData.state,
                drugLicenseNumber: formData.drugLicenseNumber,
                gstNumber: formData.gstNumber,
                message: formData.message,
              }}
              onChange={(field, val) => {
                const key = field === 'fullName' ? 'name' : field;
                setFormData((prev) => ({ ...prev, [key]: val }));
                if (fieldErrors[field as keyof typeof fieldErrors]) {
                  setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
                }
              }}
              errors={fieldErrors}
              showCompany={true}
              showDrugLicense={true}
              showGst={true}
              showMessage={true}
            />

            {/* Footer Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '10px',
                borderTop: '1.5px solid #F1F5F9',
              }}
            >
              <button
                type="button"
                onClick={handleWhatsAppClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#059669',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <MessageSquare size={15} color="#059669" />
                <span>Instant WhatsApp Enquiry (Verified)</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="zp-btn-secondary"
                  style={{ padding: '9px 18px', fontSize: '13px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="zp-btn-primary"
                  style={{ padding: '9px 24px', fontSize: '13px', fontWeight: 700 }}
                >
                  <Send size={14} />
                  <span>{loading ? 'Submitting...' : 'Submit Product Enquiry'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
