import React from 'react';
import { Package, Sparkles, Clock, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ProfileEnquiriesTabProps {
  city?: string;
  stateName?: string;
  onOpenFranchise: () => void;
}

export const ProfileEnquiriesTab: React.FC<ProfileEnquiriesTabProps> = ({
  city,
  stateName,
  onOpenFranchise,
}) => {
  return (
    <div className="zp-card">
      <div className="zp-card-header">
        <div>
          <h2 className="zp-card-title">My Inquiries &amp; Requests</h2>
          <p className="zp-card-subtitle">
            Track your product quotations, bulk formulation requests, and Stockists Distribution applications.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenFranchise}
          className="zp-btn-primary"
          style={{ padding: '8px 16px', fontSize: '12px' }}
        >
          <Sparkles size={14} />
          <span>Apply for Stockists / Distribution</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Stockists Distribution Request Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#FAF5FF',
                color: 'var(--zp-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Package size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--zp-text-dark)' }}>
                  Stockists Distribution Application
                </span>
                <span className="zp-badge-green">
                  ACTIVE IN TOUCH
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Territory: <strong>{city || 'Target Territory'}, {stateName || 'Active State'}</strong> • Representative: Regional Sales Manager assigned.
              </div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={12} />
                <span>Last updated today • Ref: ZP-SD-9821</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onOpenFranchise}
              className="zp-btn-secondary"
            >
              View Application
            </button>
          </div>
        </div>

        {/* Product Catalog Direct Inquiry Card */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--zp-text-dark)' }}>
                  Bulk Formulation Price List Request
                </span>
                <span className="zp-badge-purple">
                  DISPATCHED
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Category: <strong>Tablets, Capsules &amp; Injectables Rate Chart 2026</strong> • Verified by Sales Desk.
              </div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} color="#10B981" />
                <span>Catalog sent to registered email</span>
              </div>
            </div>
          </div>

          <Link to="/products" className="zp-btn-secondary">
            <span>Browse Catalog</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
