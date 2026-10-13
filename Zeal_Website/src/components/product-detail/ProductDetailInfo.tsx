import React, { useState } from 'react';
import {
  Send,
  MessageSquare,
  Download,
  ShieldCheck,
  Award,
  Sparkles,
  PlusCircle,
  Check,
  Truck,
  Share2,
  FileText,
  IndianRupee,
  Tag,
} from 'lucide-react';
import type { IProduct } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { productService } from '../../api/productService';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useEnquiryAuth } from '../../context/EnquiryAuthContext';
import { buildProductWhatsAppMessage } from '../../utils/whatsappMessageBuilder';

interface ProductDetailInfoProps {
  product: IProduct;
  categoryName: string;
  onEnquire: () => void;
  isBulkSelected?: boolean;
  onToggleBulk?: () => void;
}

const VOLUME_OPTIONS = ['50 Packs', '100 Packs', '250 Packs', '500 Packs', '1000+ Packs'];

export const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({
  product,
  categoryName,
  onEnquire,
  isBulkSelected = false,
  onToggleBulk,
}) => {
  const [selectedVolume, setSelectedVolume] = useState('100 Packs');
  const [copiedShare, setCopiedShare] = useState(false);
  const { user } = useAuth();
  const { settings } = useSiteSettings();
  const { requireAuth } = useEnquiryAuth();

  const visualAidUrl = productService.getVisualAidUrl(product.slug || product._id);

  const handleWhatsAppInquiry = () => {
    requireAuth(() => {
      const waText = buildProductWhatsAppMessage({
        productName: product.name,
        genericName: product.genericName,
        dosageForm: product.dosageForm,
        packaging: product.packaging,
        mrp: product.mrp,
        quantity: selectedVolume,
        authUser: user ? {
          name: user.name,
          phone: user.phone,
          email: user.email,
        } : undefined,
      });
      const waTarget = (settings?.whatsappNumber || '919909160190').replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${waTarget}?text=${encodeURIComponent(waText)}`, '_blank');
    }, {
      title: `Inquire for ${product.name}`,
      subtitle: 'Sign in or register to verify your credentials for official distributor pricing on WhatsApp.',
    });
  };

  const handleShareClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', minWidth: 0, width: '100%' }}>
      {/* 1. Header Badges & Product Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <span className="zp-badge-purple" style={{ fontSize: '11.5px', padding: '4px 10px' }}>
            {product.dosageForm || 'Pharmaceutical'}
          </span>

          <span className="zp-badge-green" style={{ fontSize: '11.5px', padding: '4px 10px' }}>
            {categoryName}
          </span>

          {product.isNewLaunch && (
            <span
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '0.03em',
              }}
            >
              NEW LAUNCH
            </span>
          )}

          <span
            style={{
              background: '#EFF6FF',
              color: '#1D4ED8',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ShieldCheck size={13} />
            <span>WHO-GMP Certified</span>
          </span>
        </div>

        <h1 className="zp-product-info-title">
          {product.name}
        </h1>

        {/* Generic Molecule / Salt */}
        <div
          style={{
            fontSize: '14.5px',
            color: 'var(--zp-primary)',
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {product.genericName}
        </div>
      </div>

      {/* 2. Doctor Ratings & Quality Certification Summary */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '14px',
          borderBottom: '1px solid #F1F5F9',
          flexWrap: 'wrap',
        }}
      >
        <RatingStars
          rating={product.averageRating}
          totalReviews={product.totalReviews}
          fallbackText="WHO-GMP Quality Certified"
          size={14}
        />
        {product.totalReviews && product.totalReviews > 0 ? (
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            ({product.totalReviews} Verified Doctor Reviews)
          </span>
        ) : (
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Analytical Lab Tested • DCGI Standards
          </span>
        )}
        <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>
          ● In Ready Stock for Distribution
        </span>
      </div>

      {/* MRP Price Box — shown only when MRP is set (compact box on one side) */}
      {product.mrp !== undefined && product.mrp !== null && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div className="zp-mrp-detail-box">
            <div className="zp-mrp-detail-label">
              <Tag size={13} />
              <span>MRP</span>
            </div>
            <div className="zp-mrp-detail-price">
              <IndianRupee size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px', strokeWidth: 2.5 }} />
              {product.mrp.toLocaleString('en-IN')}
            </div>
            <span className="zp-mrp-detail-note">Incl. all taxes</span>
          </div>
        </div>
      )}

      {/* 3. Key Bullet Highlights (as seen in photo) */}
      <div
        style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '14px 16px',
        }}
      >
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '13px',
            color: '#334155',
          }}
        >
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={15} style={{ color: '#059669', flexShrink: 0 }} />
            <span><strong>High Bioavailability:</strong> Tested clinical stability &amp; superior dissolution rate.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={15} style={{ color: '#059669', flexShrink: 0 }} />
            <span><strong>Stockists Distribution Protected:</strong> Zero internal competition in your assigned territory.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={15} style={{ color: '#059669', flexShrink: 0 }} />
            <span><strong>Promotional Tools Included:</strong> Free visual aids, LBLs, reminder cards, and MR bags.</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={15} style={{ color: '#059669', flexShrink: 0 }} />
            <span><strong>Rapid Dispatch:</strong> Temperature-controlled central warehouse dispatch within 24-48 hours.</span>
          </li>
        </ul>
      </div>

      {/* 4. Active Pharmaceutical Composition Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
          border: '1.5px solid #DDD6FE',
          borderRadius: '12px',
          padding: '14px 16px',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#6828DC',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={13} />
          <span>Active Pharmaceutical Formulation</span>
        </div>
        <p
          style={{
            fontSize: '13.5px',
            color: '#1E293B',
            fontWeight: 600,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {product.composition}
        </p>
      </div>

      {/* 5. Target Order Volume Selector Chips (Replacing size/color dropdowns) */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
          Select Target Dispatch Quantity:
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {VOLUME_OPTIONS.map((vol) => (
            <button
              key={vol}
              type="button"
              onClick={() => setSelectedVolume(vol)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: selectedVolume === vol ? '1.5px solid var(--zp-primary)' : '1px solid #CBD5E1',
                background: selectedVolume === vol ? '#FAF5FF' : '#FFFFFF',
                color: selectedVolume === vol ? 'var(--zp-primary)' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {vol}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Commercial Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="zp-product-action-buttons">
          {/* Main Primary Enquiry Button */}
          <button
            type="button"
            onClick={onEnquire}
            className="btn btn-primary zp-product-action-btn-main"
            style={{
              borderRadius: '10px',
              padding: '13px 20px',
              fontSize: '14.5px',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Send size={16} />
            <span>Enquire for Stockists Distribution</span>
          </button>

          {/* Quick WhatsApp Inquiry */}
          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="btn zp-product-action-btn-wa"
            style={{
              borderRadius: '10px',
              padding: '13px 18px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#047857',
              borderColor: '#6EE7B7',
              background: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <MessageSquare size={16} color="#059669" />
            <span>WhatsApp Enquiry (Verified)</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Visual Aid PDF Download */}
          <a
            href={visualAidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{
              flex: '1 1 180px',
              borderRadius: '8px',
              padding: '9px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--zp-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none',
            }}
          >
            <Download size={14} />
            <span>Download Visual Aid (PDF)</span>
          </a>

          {/* Bulk Quotation Selector */}
          {onToggleBulk && (
            <button
              type="button"
              onClick={onToggleBulk}
              className="btn btn-secondary"
              style={{
                flex: '1 1 180px',
                borderRadius: '8px',
                padding: '9px 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: isBulkSelected ? '#10B981' : '#475569',
                borderColor: isBulkSelected ? '#10B981' : '#CBD5E1',
                background: isBulkSelected ? '#F0FDF4' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              {isBulkSelected ? <Check size={14} color="#10B981" /> : <PlusCircle size={14} />}
              <span>{isBulkSelected ? 'Added to Bulk List' : 'Add to Bulk Quotation'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 7. Trust Badges Strip (matching photo under buttons) */}
      <div className="zp-trust-badges-strip">
        {[
          { icon: <Truck size={16} color="var(--zp-primary)" />, label: '24-48h Dispatch' },
          { icon: <Award size={16} color="#059669" />, label: 'Stockists Distribution', border: true },
          { icon: <FileText size={16} color="#D97706" />, label: 'Free Visual Aids' },
        ].map((b, idx) => (
          <div
            key={idx}
            className="zp-flex-col"
            style={{
              alignItems: 'center',
              gap: '3px',
              borderLeft: b.border ? '1px solid #E2E8F0' : 'none',
              borderRight: b.border ? '1px solid #E2E8F0' : 'none',
            }}
          >
            {b.icon}
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>{b.label}</span>
          </div>
        ))}
      </div>

      {/* 8. Specifications & Meta Details */}
      <div
        style={{
          borderTop: '1px solid #F1F5F9',
          paddingTop: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '12.5px',
          color: '#64748B',
        }}
      >
        <div>
          <strong style={{ color: '#334155' }}>Category:</strong> {categoryName}
        </div>
        <div>
          <strong style={{ color: '#334155' }}>Dosage &amp; Packaging:</strong> {product.dosageForm || 'Dosage'} ({product.packaging || 'Standard Pack'})
        </div>
        {product.productCode && (
          <div>
            <strong style={{ color: '#334155' }}>Formulation SKU:</strong> {product.productCode}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          <strong style={{ color: '#334155' }}>Share:</strong>
          <button
            type="button"
            onClick={handleShareClick}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--zp-primary)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: 0,
            }}
          >
            <Share2 size={13} />
            <span>{copiedShare ? 'Link Copied!' : 'Copy Dossier Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
