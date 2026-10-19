import React, { useState } from 'react';
import { FileText, Send, CheckSquare, Square } from 'lucide-react';
import type { IProduct } from '../../types';
import { getMediaUrl } from '../../utils/mediaUtils';
import { getDosageFormDetails } from '../../utils/pharmaUtils';

export interface ProductCardProps {
  product: IProduct;
  onEnquire: (p: IProduct) => void;
  onViewDossier: (p: IProduct) => void;
  isBulkSelected?: boolean;
  onToggleBulk?: (p: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEnquire,
  onViewDossier,
  isBulkSelected = false,
  onToggleBulk,
}) => {
  const [imageError, setImageError] = useState(false);
  const dosageConfig = getDosageFormDetails(product.dosageForm);
  const DosageIcon = dosageConfig.icon;
  const hasValidImage = Boolean(product.featuredImage && !imageError);

  return (
    <div className={`zp-product-card ${isBulkSelected ? 'is-selected' : ''}`}>
      <div>
        {/* Top Badges & Bulk Checkbox */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '26px',
          marginBottom: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="zp-badge-purple" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {product.dosageForm || 'Formulation'}
            </span>

            {product.prescriptionType && (
              <span className="zp-badge-green">
                {product.prescriptionType}
              </span>
            )}
          </div>

          {onToggleBulk && (
            <button
              type="button"
              onClick={() => onToggleBulk(product)}
              title={isBulkSelected ? 'Remove from Bulk Enquiry' : 'Select for Bulk Enquiry'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isBulkSelected ? 'var(--zp-primary)' : '#94A3B8',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              {isBulkSelected ? <CheckSquare size={16} color="var(--zp-primary)" /> : <Square size={16} color="#94A3B8" />}
              <span style={{ fontSize: '11px', color: isBulkSelected ? 'var(--zp-primary)' : 'var(--zp-text-muted)' }}>Bulk</span>
            </button>
          )}
        </div>

        {/* Product Visual Box */}
        <div
          onClick={() => onViewDossier(product)}
          className="zp-product-img-box"
          title={`Click to view dossier for ${product.name}`}
        >
          {hasValidImage ? (
            <img
              src={getMediaUrl(product.featuredImage)}
              alt={product.name}
              onError={() => setImageError(true)}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="zp-product-placeholder">
              <div
                className="zp-product-placeholder-icon-wrap"
                style={{
                  background: dosageConfig.badgeBg,
                  borderColor: dosageConfig.badgeBorder,
                }}
              >
                <DosageIcon size={26} style={{ color: dosageConfig.badgeColor }} />
              </div>
              <span
                className="zp-product-placeholder-label"
                style={{
                  color: dosageConfig.badgeColor,
                  background: dosageConfig.badgeBg,
                  borderColor: dosageConfig.badgeBorder,
                }}
              >
                {product.dosageForm || dosageConfig.name}
              </span>
              <span className="zp-product-placeholder-sub">ZEAL PHARMA</span>
            </div>
          )}
        </div>

        {/* Product Brand Name */}
        <h4
          onClick={() => onViewDossier(product)}
          className="zp-product-title"
          title={product.name}
        >
          {product.name}
        </h4>

        {/* Clinical Composition / Salt description */}
        <p className="zp-product-comp" title={product.composition || product.genericName || ''}>
          {product.composition || product.genericName || 'Active Pharmaceutical Formulation'}
        </p>

        {/* Product MRP */}
        <div className="zp-product-mrp-row">
          <span className="zp-product-mrp-text">
            <span className="zp-product-mrp-label">MRP:</span> ₹{product.mrp !== undefined && product.mrp !== null ? product.mrp.toLocaleString('en-IN') : '--'}
          </span>
        </div>

        {/* Packaging Specification & Ready Stock row */}
        <div className="zp-product-pack-row">
          <span style={{ color: '#334155', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '65%' }}>
            {product.packaging || 'Standard Pack'}
          </span>
          <span className="zp-badge-green" style={{ border: 'none', padding: 0, background: 'none', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
            Ready Stock
          </span>
        </div>
      </div>

      {/* Action Buttons: "Dossier" & "Enquire Now" */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '8px', marginTop: '4px' }}>
        <button
          type="button"
          onClick={() => onViewDossier(product)}
          className="zp-btn-secondary"
        >
          <FileText size={13} />
          <span>Dossier</span>
        </button>

        <button
          type="button"
          onClick={() => onEnquire(product)}
          className="zp-btn-primary"
        >
          <Send size={12} />
          <span>Enquire Now</span>
        </button>
      </div>
    </div>
  );
};
