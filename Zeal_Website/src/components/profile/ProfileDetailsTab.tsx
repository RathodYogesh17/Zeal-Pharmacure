import React from 'react';
import {
  Save,
  Loader2,
  Building2,
  Phone,
  MapPin,
  CheckCircle2,
  Trash2,
  Camera,
} from 'lucide-react';
import { ThemedSelect } from '../common/ThemedSelect';
import { FormAlert } from '../common/FormAlert';
import { UserAvatar } from '../common/UserAvatar';
import { getRoleDisplayName, isStaffRole } from '../../utils/roleUtils';

const BUSINESS_TYPE_OPTIONS = [
  { value: 'PROPRIETORSHIP', label: 'Proprietorship Enterprise', subtitle: 'Individual proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership Firm', subtitle: 'Registered partners' },
  { value: 'PRIVATE_LIMITED', label: 'Private Limited Company', subtitle: 'Corporate entity (Pvt Ltd)' },
  { value: 'LLP', label: 'Limited Liability Partnership (LLP)', subtitle: 'LLP structure' },
  { value: 'INDIVIDUAL', label: 'Medical Representative (Individual)', subtitle: 'Pharma professional' },
  { value: 'OTHER', label: 'Retail Chemist / Other Stockist', subtitle: 'Retail / wholesale pharmacy' },
];

export interface ProfileDetailsTabProps {
  userRole?: string | any;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  companyName: string;
  setCompanyName: (v: string) => void;
  businessType: string;
  setBusinessType: (v: string) => void;
  drugLicense: string;
  setDrugLicense: (v: string) => void;
  gstNumber: string;
  setGstNumber: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  stateName: string;
  setStateName: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  profileImagePreview: string | null;
  currentSavedImage?: string | null;
  onClearSelectedImage: () => void;
  onRemoveSavedImage?: () => void;
  onImageSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isUpdating: boolean;
  successMsg: string | null;
  errorMsg: string | null;
}

export const ProfileDetailsTab: React.FC<ProfileDetailsTabProps> = ({
  userRole,
  name,
  setName,
  phone,
  setPhone,
  email,
  companyName,
  setCompanyName,
  businessType,
  setBusinessType,
  drugLicense,
  setDrugLicense,
  gstNumber,
  setGstNumber,
  city,
  setCity,
  stateName,
  setStateName,
  address,
  setAddress,
  profileImagePreview,
  currentSavedImage,
  onClearSelectedImage,
  onRemoveSavedImage,
  onImageSelect,
  onSubmit,
  isUpdating,
  successMsg,
  errorMsg,
}) => {
  return (
    <div className="zp-card">
      <div className="zp-card-header">
        <div>
          <h2 className="zp-card-title">Personal &amp; Business Details</h2>
          <p className="zp-card-subtitle">
            Update your pharmaceutical partner profile, contact information, and business credentials.
          </p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6828DC', fontWeight: 800, fontSize: '13.5px' }}>
          <CheckCircle2 size={16} color="#10B981" />
          <span>Verified</span>
        </div>
      </div>

      <FormAlert type="success" message={successMsg} />
      <FormAlert type="error" message={errorMsg} />

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Profile Photo & Identity Header Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1.5px solid #E9D5FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '2.5px solid #FFFFFF',
                boxShadow: '0 4px 14px rgba(104, 40, 220, 0.2)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <UserAvatar
                src={profileImagePreview || currentSavedImage}
                name={name}
                size={64}
                fontSize={26}
              />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1E1B4B' }}>
                {name || 'Your Name'}
              </div>
              <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
                {email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {onImageSelect && (
              <>
                <input
                  type="file"
                  id="tab-profile-photo-upload"
                  onChange={onImageSelect}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('tab-profile-photo-upload')?.click()}
                  className="zp-btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Camera size={13} color="var(--zp-primary)" />
                  <span>{currentSavedImage || profileImagePreview ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
              </>
            )}

            {profileImagePreview ? (
              <button
                type="button"
                onClick={onClearSelectedImage}
                className="zp-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px', color: '#DC2626', borderColor: '#FECACA' }}
              >
                Cancel Selection
              </button>
            ) : currentSavedImage && onRemoveSavedImage ? (
              <button
                type="button"
                onClick={onRemoveSavedImage}
                className="zp-btn-secondary"
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  color: '#DC2626',
                  borderColor: '#FECACA',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#FEF2F2',
                }}
              >
                <Trash2 size={13} color="#DC2626" />
                <span>Remove Picture</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Section 1: Contact Information */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--zp-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={14} />
            <span>1. Contact &amp; Identity</span>
          </div>

          <div className="zp-form-grid-3">
            <div>
              <label className="zp-label">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Ramesh Patel"
                className="zp-input"
              />
            </div>

            <div>
              <label className="zp-label">Phone / WhatsApp Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="zp-input"
              />
            </div>

            <div>
              <label className="zp-label">Registered Email</label>
              <input
                type="email"
                disabled
                value={email}
                className="zp-input"
                style={{ background: '#F1F5F9', color: '#64748B', cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business & Commercial Profile */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--zp-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={14} />
            <span>2. Business &amp; Commercial Credentials</span>
          </div>

          {(() => {
            const staffRoleTitle = getRoleDisplayName(userRole);
            const isStaff = isStaffRole(userRole);

            return (
              <div className={isStaff ? 'zp-form-grid-3' : 'zp-form-grid-2'}>
                <div>
                  <label className="zp-label">Firm / Agency Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Patel Medicare & Distributors"
                    className="zp-input"
                  />
                </div>

                {isStaff && (
                  <div>
                    <label className="zp-label">Staff Role / Designation</label>
                    <input
                      type="text"
                      value={staffRoleTitle}
                      disabled
                      readOnly
                      className="zp-input"
                      style={{
                        background: '#F8FAFC',
                        color: '#475569',
                        fontWeight: 600,
                        cursor: 'default',
                        border: '1px solid #E2E8F0',
                      }}
                    />
                  </div>
                )}

                <div>
                  <ThemedSelect
                    label="Business Type"
                    value={businessType}
                    onChange={(val) => setBusinessType(val)}
                    options={BUSINESS_TYPE_OPTIONS}
                    placeholder="Select business type"
                    searchable={false}
                  />
                </div>
              </div>
            );
          })()}

          <div className="zp-form-grid-2">
            <div>
              <label className="zp-label">Drug License Number (20B / 21B)</label>
              <input
                type="text"
                value={drugLicense}
                onChange={(e) => setDrugLicense(e.target.value)}
                placeholder="e.g. 20B/21B-GJ-10294"
                className="zp-input"
              />
            </div>

            <div>
              <label className="zp-label">GST Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="e.g. 24AAAAA0000A1Z5"
                className="zp-input"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Territory & Address */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--zp-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} />
            <span>3. Primary Territory &amp; Location</span>
          </div>

          <div className="zp-form-grid-2">
            <div>
              <label className="zp-label">City / Town Headquarter</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Surat / Ahmedabad / Indore"
                className="zp-input"
              />
            </div>

            <div>
              <label className="zp-label">State</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="e.g. Gujarat / Rajasthan / MP"
                className="zp-input"
              />
            </div>
          </div>

          <div className="zp-form-row">
            <label className="zp-label">Commercial Godown / Office Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Complete commercial complex or godown address..."
              className="zp-textarea"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="zp-form-actions">
          <span style={{ fontSize: '12px', color: '#94A3B8', marginRight: 'auto' }}>
            Profile changes update instantly across your session.
          </span>

          <button
            type="submit"
            disabled={isUpdating}
            className="zp-btn-primary"
            style={{ padding: '11px 26px', fontSize: '13.5px' }}
          >
            {isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save &amp; Update Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
