import React from 'react';
import { Building2, Phone, Mail, MapPin, FileCheck, MessageSquare } from 'lucide-react';

export interface B2BCustomerData {
  fullName: string;
  phone: string;
  email: string;
  companyName?: string;
  city: string;
  state: string;
  drugLicenseNumber?: string;
  gstNumber?: string;
  message?: string;
}

export interface B2BCustomerFieldsProps {
  formData: B2BCustomerData;
  onChange: (field: keyof B2BCustomerData, value: string) => void;
  showCompany?: boolean;
  showDrugLicense?: boolean;
  showGst?: boolean;
  showMessage?: boolean;
  messageLabel?: string;
  messagePlaceholder?: string;
  nameLabel?: string;
  phoneLabel?: string;
  compact?: boolean;
  disabled?: boolean;
}

export const B2BCustomerFields: React.FC<B2BCustomerFieldsProps> = ({
  formData,
  onChange,
  showCompany = true,
  showDrugLicense = true,
  showGst = true,
  showMessage = true,
  messageLabel = 'MESSAGE / SPECIAL REQUIREMENTS',
  messagePlaceholder = 'Share your district territory preference, marketing plan, or queries...',
  nameLabel = 'YOUR NAME / FIRM NAME *',
  phoneLabel = 'PHONE / WHATSAPP NUMBER *',
  compact = false,
  disabled = false,
}) => {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: compact ? '9px 12px' : '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid #CBD5E1',
    fontSize: compact ? '13px' : '13.5px',
    fontWeight: 600,
    color: '#0F172A',
    outline: 'none',
    background: '#FFFFFF',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: compact ? '11px' : '11.5px',
    fontWeight: 800,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    marginBottom: '5px',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#6828DC';
    e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.1)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#CBD5E1';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? '12px' : '14px' }}>
      {/* Row 1: Name & Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        <div>
          <label style={labelStyle}>
            <Building2 size={13} color="#6828DC" />
            <span>{nameLabel}</span>
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            placeholder="e.g. Ramesh Patel / Patel Medicos"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label style={labelStyle}>
            <Phone size={13} color="#059669" />
            <span>{phoneLabel}</span>
          </label>
          <input
            type="tel"
            required
            disabled={disabled}
            placeholder="e.g. +91 98765 43210"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Row 2: Email & Optional Company Name */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        <div>
          <label style={labelStyle}>
            <Mail size={13} color="#6828DC" />
            <span>BUSINESS EMAIL ADDRESS *</span>
          </label>
          <input
            type="email"
            required
            disabled={disabled}
            placeholder="e.g. pharma@distributor.com"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {showCompany && (
          <div>
            <label style={labelStyle}>
              <Building2 size={13} color="#6828DC" />
              <span>COMPANY / DISTRIBUTOR FIRM NAME</span>
            </label>
            <input
              type="text"
              disabled={disabled}
              placeholder="e.g. Patel Healthcare Agency"
              value={formData.companyName || ''}
              onChange={(e) => onChange('companyName', e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        )}
      </div>

      {/* Row 3: City & State */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        <div>
          <label style={labelStyle}>
            <MapPin size={13} color="#6828DC" />
            <span>CITY / HEADQUARTERS *</span>
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            placeholder="e.g. Surat, Indore, Varanasi"
            value={formData.city}
            onChange={(e) => onChange('city', e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label style={labelStyle}>
            <MapPin size={13} color="#6828DC" />
            <span>STATE *</span>
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            placeholder="e.g. Gujarat, Madhya Pradesh"
            value={formData.state}
            onChange={(e) => onChange('state', e.target.value)}
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Row 4: Drug License & GST */}
      {(showDrugLicense || showGst) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {showDrugLicense && (
            <div>
              <label style={labelStyle}>
                <FileCheck size={13} color="#6828DC" />
                <span>DRUG LICENSE NUMBER (OPTIONAL)</span>
              </label>
              <input
                type="text"
                disabled={disabled}
                placeholder="e.g. 20B/21B-XXXXX"
                value={formData.drugLicenseNumber || ''}
                onChange={(e) => onChange('drugLicenseNumber', e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          )}

          {showGst && (
            <div>
              <label style={labelStyle}>
                <FileCheck size={13} color="#6828DC" />
                <span>GSTIN NUMBER (OPTIONAL)</span>
              </label>
              <input
                type="text"
                disabled={disabled}
                placeholder="e.g. 24AAAAA0000A1Z5"
                value={formData.gstNumber || ''}
                onChange={(e) => onChange('gstNumber', e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          )}
        </div>
      )}

      {/* Row 5: Message */}
      {showMessage && (
        <div>
          <label style={labelStyle}>
            <MessageSquare size={13} color="#6828DC" />
            <span>{messageLabel}</span>
          </label>
          <textarea
            rows={2}
            disabled={disabled}
            placeholder={messagePlaceholder}
            value={formData.message || ''}
            onChange={(e) => onChange('message', e.target.value)}
            style={{
              ...inputStyle,
              height: 'auto',
              minHeight: '64px',
              resize: 'vertical',
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      )}
    </div>
  );
};
