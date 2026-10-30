import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, AlertTriangle, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export type ComplianceTab = 'terms' | 'privacy' | 'pharmacovigilance';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ComplianceTab;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<ComplianceTab>(initialTab);
  const { settings } = useSiteSettings();

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #4C1D95 0%, #6828DC 100%)',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                Regulatory Compliance & Legal Policies
              </h3>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.85 }}>
                WHO-GMP &amp; ISO 9001:2015 Compliant Pharmaceutical Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            background: '#F8FAFC',
            padding: '0 16px',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('terms')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'terms' ? '2px solid #6828DC' : '2px solid transparent',
              color: activeTab === 'terms' ? '#6828DC' : '#64748B',
              fontWeight: activeTab === 'terms' ? 700 : 500,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <FileText size={15} />
            <span>Franchise Terms</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'privacy' ? '2px solid #6828DC' : '2px solid transparent',
              color: activeTab === 'privacy' ? '#6828DC' : '#64748B',
              fontWeight: activeTab === 'privacy' ? 700 : 500,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Lock size={15} />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('pharmacovigilance')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'pharmacovigilance' ? '2px solid #6828DC' : '2px solid transparent',
              color: activeTab === 'pharmacovigilance' ? '#6828DC' : '#64748B',
              fontWeight: activeTab === 'pharmacovigilance' ? 700 : 500,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <AlertTriangle size={15} />
            <span>Pharmacovigilance (ADR)</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, color: '#334155', fontSize: '14px', lineHeight: 1.6 }}>
          {activeTab === 'terms' && (
            <div>
              <h4 style={{ margin: '0 0 10px', color: '#0F172A', fontSize: '16px', fontWeight: 700 }}>
                PCD Franchise &amp; Monopoly Distribution Terms
              </h4>
              <p style={{ margin: '0 0 14px' }}>
                Zeal Pharmacure appoints authorized Stockist / PCD Distribution partners on a mutually agreed district-wise monopoly framework.
              </p>

              <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong>District Monopoly Rights:</strong> Exclusive territory rights are allocated per assigned district once the initial stocking order and registration documentation are completed.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong>Documentation Requirements:</strong> Mandatory valid Wholesale Drug License (Form 20B/21B) and GST Registration Certificate prior to first dispatch.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong>Promotional &amp; Marketing Inputs:</strong> Visual Aids, Leave Behind Leaflets (LBL), MR bags, catch covers, sample catch boxes, and order pads provided on confirmed orders.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong>Dispatch SLA &amp; Transport:</strong> Orders processed and dispatched via certified temperature-controlled transport hubs within 24 to 48 hours of payment confirmation.
                  </div>
                </div>
              </div>

              <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                <strong>Territory Dispute / Clarification Helpline:</strong> Phone:{' '}
                <a href={`tel:${settings.phone}`} style={{ color: '#6828DC', fontWeight: 600 }}>
                  {settings.phone}
                </a>{' '}
                | Email:{' '}
                <a href={`mailto:${settings.email}`} style={{ color: '#6828DC', fontWeight: 600 }}>
                  {settings.email}
                </a>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h4 style={{ margin: '0 0 10px', color: '#0F172A', fontSize: '16px', fontWeight: 700 }}>
                Privacy Policy &amp; Digital Data Protection
              </h4>
              <p style={{ margin: '0 0 14px' }}>
                In compliance with the Information Technology Act 2000 and the Digital Personal Data Protection (DPDP) Act, Zeal Pharmacure is committed to safeguarding personal and business information.
              </p>

              <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <strong>1. Data Collection:</strong> We collect contact details, professional designations, drug license numbers, and commercial inquiries solely to facilitate verified B2B distribution and order fulfillment.
                </div>
                <div>
                  <strong>2. Zero Data Brokering:</strong> Zeal Pharmacure strictly does not sell, rent, or lease distributor or practitioner data to third-party telemarketers or external advertising networks.
                </div>
                <div>
                  <strong>3. Secure Transmission:</strong> All communications, inquiries, and credentials are encrypted using 256-bit SSL encryption.
                </div>
                <div>
                  <strong>4. Data Retention &amp; Rights:</strong> Registered partners may inspect, rectify, or request deletion of their account information by emailing our data privacy desk.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pharmacovigilance' && (
            <div>
              <h4 style={{ margin: '0 0 10px', color: '#0F172A', fontSize: '16px', fontWeight: 700 }}>
                Pharmacovigilance &amp; Adverse Drug Reaction (ADR) Safety Desk
              </h4>
              <p style={{ margin: '0 0 14px' }}>
                Zeal Pharmacure adheres to the Pharmacovigilance Programme of India (PvPI) guidelines under the Central Drugs Standard Control Organization (CDSCO) to maintain rigorous patient safety monitoring.
              </p>

              <div style={{ padding: '14px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FCA5A5', marginBottom: '16px' }}>
                <strong style={{ color: '#991B1B' }}>Reporting an Adverse Event or Product Quality Concern:</strong>
                <p style={{ margin: '6px 0 0', color: '#7F1D1D', fontSize: '13px' }}>
                  If a healthcare practitioner, pharmacist, or patient experiences an unexpected reaction, quality variation, or batch discrepancy with any Zeal formulation, please report it immediately:
                </p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a
                    href={`tel:${settings.phone}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#991B1B',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={14} /> Hotline: {settings.phone}
                  </a>
                  <a
                    href={`mailto:safety@zealpharmacure.com?subject=ADR Reporting - Zeal Pharmacure`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#991B1B',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <Mail size={14} /> safety@zealpharmacure.com
                  </a>
                </div>
              </div>

              <p style={{ fontSize: '12.5px', color: '#64748B' }}>
                Required reporting details include: Product Brand Name, Batch Number, Manufacturing / Expiry Date, Patient Age / Gender, and Description of the observed reaction.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#F8FAFC',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

