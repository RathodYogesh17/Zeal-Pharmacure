import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  ShieldCheck,
  Truck,
  FileText,
  PackageCheck,
  Trash2,
  Plus,
  Minus,
  BadgePercent,
  Pill,
} from 'lucide-react';
import type { IProduct } from '../../types';
import { enquiryService } from '../../api/enquiryService';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { VerifiedUserBadge } from '../common/VerifiedUserBadge';
import { B2BCustomerFields } from '../common/forms';
import { buildBulkBatchWhatsAppMessage } from '../../utils/whatsappMessageBuilder';

interface BulkProductEnquiryModalProps {
  products: IProduct[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (id: string) => void;
  onClearAll: () => void;
}

export const BulkProductEnquiryModal: React.FC<BulkProductEnquiryModalProps> = ({
  products,
  isOpen,
  onClose,
  onRemoveProduct,
  onClearAll,
}) => {
  const { settings } = useSiteSettings();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    companyName: '',
    city: '',
    state: '',
    drugLicenseNumber: '',
    gstNumber: '',
    message: '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [quantityUnits, setQuantityUnits] = useState<Record<string, string>>({});
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

  if (!isOpen) return null;

  const handleFieldChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleQtyChange = (id: string, val: number) => {
    const safeVal = Math.max(1, isNaN(val) ? 100 : val);
    setQuantities((prev) => ({ ...prev, [id]: safeVal }));
  };

  const handleStepQty = (id: string, step: number) => {
    const current = quantities[id] || 100;
    const nextVal = Math.max(1, current + step);
    setQuantities((prev) => ({ ...prev, [id]: nextVal }));
  };

  const handleUnitChange = (id: string, unit: string) => {
    setQuantityUnits((prev) => ({ ...prev, [id]: unit }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (products.length === 0) {
      setErrorMsg('Please select at least one product for bulk stockist enquiry.');
      return;
    }

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

    if (!formData.city.trim()) errs.city = 'City / Headquarters is required';
    if (!formData.state.trim()) errs.state = 'State is required';

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const items = products.map((p) => ({
        productId: p._id,
        quantity: quantities[p._id] || 100,
        quantityUnit: quantityUnits[p._id] || 'Boxes',
        message: `${p.name} (${p.packaging || 'Standard Pack'})`,
      }));

      await enquiryService.submitProductEnquiry({
        enquiryType: 'BULK_PRODUCT',
        products: items,
        fullName: effectiveName,
        name: effectiveName,
        phone: cleanPhone,
        email: effectiveEmail,
        companyName: formData.companyName.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        drugLicenseNumber: formData.drugLicenseNumber.trim() || undefined,
        gstNumber: formData.gstNumber.trim() || undefined,
        message:
          formData.message.trim() ||
          `Bulk Stockist Distribution Enquiry for ${products.length} formulations`,
        source: 'BULK_ENQUIRY',
      });

      setSuccessMsg(
        `Your bulk enquiry for ${products.length} formulations has been submitted successfully! Wholesale stockist rates, territory monopoly verification & batch dispatch schedules are being prepared.`
      );
      setTimeout(() => {
        onClearAll();
        onClose();
        setSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
        'Failed to submit bulk enquiry. Please verify your contact details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const waText = buildBulkBatchWhatsAppMessage({
      items: products.map((p) => ({
        name: p.name,
        quantity: quantities[p._id] || 100,
        unit: quantityUnits[p._id] || 'Boxes',
        composition: p.genericName || p.composition,
        mrp: p.mrp,
      })),
      fullName: formData.fullName || user?.name || '',
      phone: formData.phone || user?.phone || '',
      email: formData.email || user?.email || '',
      companyName: formData.companyName,
      city: formData.city,
      state: formData.state,
      gstNumber: formData.gstNumber,
      message: formData.message,
      authUser: user ? { name: user.name, phone: user.phone || formData.phone, email: user.email } : undefined,
    });
    window.open(`https://wa.me/${(settings.whatsappNumber || '919316227576').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`, '_blank');
  };

  return (
    <div className="zp-modal-overlay" onClick={onClose}>
      <div
        className="zp-modal-box"
        style={{
          maxWidth: '780px',
          maxHeight: '94vh',
          overflowY: 'auto',
          padding: '28px',
          borderRadius: '24px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            paddingBottom: '16px',
            borderBottom: '1.5px solid #F1F5F9',
            marginBottom: '18px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#6828DC',
                background: '#EDE9FE',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '6px',
              }}
            >
              <PackageCheck size={14} color="#6828DC" />
              <span>Bulk Stockist Distribution Network</span>
            </div>

            <h3
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#0F172A',
                margin: 0,
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
              }}
            >
              Bulk Stockist Distribution Enquiry
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
              Request direct manufacturer wholesale pricing, batch lot availability &amp; authorized stockists rights for multiple formulations.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="zp-modal-close-btn"
            title="Close"
            style={{
              width: '34px',
              height: '34px',
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

        {/* Verified Account Badge */}
        <VerifiedUserBadge user={user} />

        {/* 4 Trust Pillars Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px',
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
            border: '1.5px solid #DDD6FE',
            borderRadius: '14px',
            padding: '12px 14px',
          }}
        >
          {[
            { icon: ShieldCheck, color: '#6828DC', title: 'Stockists Distribution', sub: 'Authorized Network', titleColor: '#4C1D95', subColor: '#6D28D9' },
            { icon: BadgePercent, color: '#059669', title: 'Wholesale Margin', sub: 'Ex-Factory Tier', titleColor: '#065F46', subColor: '#047857' },
            { icon: Truck, color: '#D97706', title: 'Priority Dispatch', sub: '24-48h Batch SLA', titleColor: '#92400E', subColor: '#B45309' },
            { icon: FileText, color: '#2563EB', title: 'Visual Aid Kit', sub: 'Samples & LBLs', titleColor: '#1E40AF', subColor: '#1D4ED8' },
          ].map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={18} color={pill.color} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: pill.titleColor }}>{pill.title}</div>
                  <div style={{ fontSize: '10px', color: pill.subColor }}>{pill.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Formulations Batch Manager */}
        <div style={{ marginBottom: '22px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#0F172A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Selected Formulations Batch
              </span>
              <span
                style={{
                  background: '#EDE9FE',
                  color: '#6828DC',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                {products.length} Formulations
              </span>
            </div>

            {products.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 6px',
                }}
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div
            style={{
              background: '#F8FAFC',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              padding: '12px',
              maxHeight: '220px',
              overflowY: 'auto',
            }}
          >
            {products.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px 16px',
                  color: '#64748B',
                  fontSize: '13px',
                }}
              >
                <PackageCheck
                  size={32}
                  style={{ color: '#94A3B8', margin: '0 auto 8px', display: 'block' }}
                />
                <div style={{ fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                  No formulations currently in bulk batch
                </div>
                <div style={{ fontSize: '12px' }}>
                  Tick the &ldquo;Bulk&rdquo; checkbox on product cards in the catalog to add them here.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {products.map((p) => {
                  const qty = quantities[p._id] || 100;
                  const unit = quantityUnits[p._id] || 'Boxes';

                  return (
                    <div
                      key={p._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        border: '1px solid #E2E8F0',
                        gap: '12px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          minWidth: '200px',
                          flex: '1 1 200px',
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#FAF5FF',
                            border: '1px solid #EDE9FE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          {p.featuredImage ? (
                            <img
                              src={p.featuredImage}
                              alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
                            />
                          ) : (
                            <Pill size={18} color="#6828DC" />
                          )}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: '13.5px',
                              color: '#0F172A',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {p.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6828DC', fontWeight: 600 }}>
                            {p.packaging || 'Standard Pack'} &bull; {p.dosageForm || 'Formulation'}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Unit */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: '#F1F5F9',
                            borderRadius: '8px',
                            padding: '2px',
                            border: '1px solid #CBD5E1',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleStepQty(p._id, -50)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              background: '#FFFFFF',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#475569',
                            }}
                            title="Decrease quantity by 50"
                          >
                            <Minus size={12} />
                          </button>

                          <input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => handleQtyChange(p._id, parseInt(e.target.value, 10))}
                            style={{
                              width: '58px',
                              textAlign: 'center',
                              background: 'transparent',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 800,
                              color: '#0F172A',
                              outline: 'none',
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => handleStepQty(p._id, 50)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              background: '#FFFFFF',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#475569',
                            }}
                            title="Increase quantity by 50"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <select
                          value={unit}
                          onChange={(e) => handleUnitChange(p._id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1.5px solid #DDD6FE',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#6828DC',
                            background: '#FAF5FF',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="Boxes">Boxes</option>
                          <option value="Strips">Strips</option>
                          <option value="Bottles / Syrup">Bottles / Syrup</option>
                          <option value="Tablets / Capsules">Tablets / Capsules</option>
                          <option value="Vials / Injections">Vials / Injections</option>
                          <option value="Tubes">Tubes (Ointment/Gel)</option>
                          <option value="Cartons">Cartons</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => onRemoveProduct(p._id)}
                          style={{
                            background: '#FEF2F2',
                            border: '1px solid #FEE2E2',
                            color: '#EF4444',
                            borderRadius: '8px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          title="Remove formulation from bulk batch"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Success Feedback */}
        {successMsg ? (
          <div
            style={{
              background: '#ECFDF5',
              border: '1.5px solid #A7F3D0',
              borderRadius: '16px',
              padding: '28px 20px',
              textAlign: 'center',
              color: '#065F46',
            }}
          >
            <CheckCircle2 size={44} style={{ color: '#10B981', margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '6px' }}>
              Bulk Stockist Enquiry Successfully Received
            </h4>
            <p style={{ fontSize: '13.5px', lineHeight: 1.5, maxWidth: '520px', margin: '0 auto' }}>
              {successMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {errorMsg && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1.5px solid #FECACA',
                  color: '#991B1B',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                <div>{errorMsg}</div>
              </div>
            )}

            <B2BCustomerFields
              formData={formData}
              onChange={handleFieldChange}
              errors={fieldErrors}
              nameLabel="CONTACT PERSON / AUTHORIZED SIGNATORY *"
              showCompany={true}
              showDrugLicense={true}
              showGst={true}
              showMessage={true}
              messageLabel="WHOLESALE REQUIREMENTS / DISPATCH TIMELINES (OPTIONAL)"
              messagePlaceholder="Mention required delivery schedule, preferred logistics transporter, or specific batch packaging preferences..."
            />

            {/* Instant WhatsApp Wholesale Escalation Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '12px',
                padding: '10px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#166534' }}>
                <Phone size={14} color="#16A34A" />
                <span>
                  Need direct WhatsApp confirmation? Speak directly with our Distribution Desk.
                </span>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppClick}
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#15803D',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Chat on WhatsApp &rarr;</span>
              </button>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingTop: '6px',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                className="zp-btn-secondary"
                style={{
                  padding: '10px 20px',
                  fontSize: '13.5px',
                  borderRadius: '10px',
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || products.length === 0}
                className="btn btn-primary"
                style={{
                  padding: '11px 24px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: loading || products.length === 0 ? 0.65 : 1,
                  cursor: loading || products.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <Send size={15} />
                <span>
                  {loading
                    ? 'Submitting Wholesale Request...'
                    : `Submit Bulk Stockist Request (${products.length})`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
