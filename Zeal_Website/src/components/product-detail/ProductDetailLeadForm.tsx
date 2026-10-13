import React, { useState } from 'react';
import { Building2, Send, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import type { IProduct } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { VerifiedUserBadge } from '../common/VerifiedUserBadge';

interface ProductDetailLeadFormProps {
  product: IProduct;
  leadForm: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    drugLicenseNumber: string;
    message: string;
  };
  setLeadForm: React.Dispatch<React.SetStateAction<{
    fullName: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    drugLicenseNumber: string;
    message: string;
  }>>;
  submittingLead: boolean;
  leadSuccess: string;
  leadError: string;
  handleLeadSubmit: (e: React.FormEvent) => void;
}

export const ProductDetailLeadForm: React.FC<ProductDetailLeadFormProps> = ({
  product,
  leadForm,
  setLeadForm,
  submittingLead,
  leadSuccess,
  leadError,
  handleLeadSubmit,
}) => {
  const { user } = useAuth();
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
    city?: string;
    state?: string;
  }>({});

  const handleInputChange = (field: keyof typeof leadForm, val: string) => {
    setLeadForm(prev => ({ ...prev, [field]: val }));
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const onSubmitLocal = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof fieldErrors = {};

    const effName = leadForm.fullName.trim() || user?.name || '';
    if (!effName) {
      errs.fullName = 'Full name is required';
    } else if (effName.length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

    const effPhone = leadForm.phone.trim() || user?.phone || '';
    const rawDigits = effPhone.replace(/[\s\-\(\)\+]/g, '');
    const cleanPhone = rawDigits.length > 10 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;
    if (!rawDigits) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    const effEmail = leadForm.email.trim() || user?.email || '';
    if (!effEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!leadForm.city.trim()) {
      errs.city = 'Target district / city is required';
    }

    if (!leadForm.state.trim()) {
      errs.state = 'State is required';
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    handleLeadSubmit(e);
  };

  const getInputStyle = (field: keyof typeof fieldErrors) => ({
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: fieldErrors[field] ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
    boxShadow: fieldErrors[field] ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
    fontSize: '13.5px',
    outline: 'none',
    background: '#F8FAFC',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  const renderError = (field: keyof typeof fieldErrors) => {
    if (!fieldErrors[field]) return null;
    return (
      <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, lineHeight: 1.35, marginTop: '4px', display: 'block' }}>
        {fieldErrors[field]}
      </span>
    );
  };

  return (
    <div className="zp-product-leadform-card">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--zp-primary)',
              flexShrink: 0,
            }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Stockists Distribution Inquiry
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '3px 0 0 0' }}>
              Apply for authorized stockist rights for <strong>{product.name}</strong> in your territory.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '6px 14px',
            borderRadius: '100px',
            fontSize: '12.5px',
            fontWeight: 700,
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
          Authorized Stockists Distribution Available
        </div>
      </div>

      <VerifiedUserBadge user={user} style={{ marginBottom: '20px' }} />

      {leadSuccess && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '14px 16px',
            borderRadius: '12px',
            fontSize: '13.5px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
          <div>{leadSuccess}</div>
        </div>
      )}

      {leadError && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            padding: '14px 16px',
            borderRadius: '12px',
            fontSize: '13.5px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
          <div>{leadError}</div>
        </div>
      )}

      <form onSubmit={onSubmitLocal} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="zp-product-leadform-grid">
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Patel"
              value={leadForm.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              style={getInputStyle('fullName')}
            />
            {renderError('fullName')}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={leadForm.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              style={getInputStyle('phone')}
            />
            {renderError('phone')}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Business Email *
            </label>
            <input
              type="email"
              placeholder="pharma@distributor.com"
              value={leadForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={getInputStyle('email')}
            />
            {renderError('email')}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Drug License No. (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 20B/21B..."
              value={leadForm.drugLicenseNumber}
              onChange={(e) => handleInputChange('drugLicenseNumber', e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13.5px',
                outline: 'none',
                background: '#F8FAFC',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Target District / City *
            </label>
            <input
              type="text"
              placeholder="e.g. Rajkot"
              value={leadForm.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              style={getInputStyle('city')}
            />
            {renderError('city')}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              State *
            </label>
            <input
              type="text"
              placeholder="e.g. Gujarat"
              value={leadForm.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              style={getInputStyle('state')}
            />
            {renderError('state')}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Specific Requirement / Message (Optional)
          </label>
          <textarea
            rows={3}
            placeholder={`Mention any target territory, estimated monthly volumes, or current portfolio for ${product.name}...`}
            value={leadForm.message}
            onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
            style={{
              width: '100%',
              padding: '11px 14px',
              borderRadius: '10px',
              border: '1.5px solid #CBD5E1',
              fontSize: '13.5px',
              outline: 'none',
              background: '#F8FAFC',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B' }}>
            <ShieldCheck size={18} color="#10B981" style={{ flexShrink: 0 }} />
            <span>Stockists Distribution Agreement &amp; Promotional Input Kit Included</span>
          </div>

          <button
            type="submit"
            disabled={submittingLead}
            className="btn btn-primary"
            style={{
              borderRadius: '10px',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minWidth: '220px',
            }}
          >
            <Send size={16} />
            <span>{submittingLead ? 'Submitting Details...' : 'Request Stockists Distribution'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
