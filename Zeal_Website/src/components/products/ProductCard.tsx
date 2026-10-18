import React from 'react';
import { Pill, FileText, Send, CheckSquare, Square } from 'lucide-react';
import type { IProduct } from '../../types';
import { getMediaUrl } from '../../utils/mediaUtils';

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
  return (
    <div className={`zp-product-card ${isBulkSelected ? 'is-selected' : ''}`}>
      <div>
        {/* Top Badges & Bulk Checkbox */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '24px',
          marginBottom: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="zp-badge-purple">
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
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {isBulkSelected ? <CheckSquare size={17} color="var(--zp-primary)" /> : <Square size={17} color="#94A3B8" />}
              <span style={{ fontSize: '10.5px', color: isBulkSelected ? 'var(--zp-primary)' : 'var(--zp-text-muted)' }}>Bulk</span>
            </button>
          )}
        </div>

        {/* Product Visual Box */}
        <div
          onClick={() => onViewDossier(product)}
          className="zp-product-img-box"
          style={{
            width: '100%',
            height: '190px',
            marginBottom: '12px',
            cursor: 'pointer',
            padding: 0,
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            position: 'relative',
            overflow: 'hidden',
            display: 'block',
          }}
        >
          {product.featuredImage ? (
            <img
              src={getMediaUrl(product.featuredImage)}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                minWidth: '100%',
                minHeight: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
              loading="lazy"
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FAF5FF',
              gap: '6px',
            }}>
              <Pill size={36} style={{ color: '#8B5CF6' }} />
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--zp-primary)' }}>
                {product.dosageForm || 'Medicine'}
              </span>
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

        {/* Generic Molecule / Salt */}
        <p className="zp-product-generic">
          {product.genericName}
        </p>

        {/* Clinical Composition Snippet */}
        <p className="zp-product-comp">
          {product.composition || 'Active Pharmaceutical Formulation'}
        </p>

        {/* Product MRP in Plain Black Text (No box, no green) */}
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
          <span className="zp-badge-green" style={{ border: 'none', padding: 0, background: 'none', flexShrink: 0 }}>
            ● Ready Stock
          </span>
        </div>
      </div>

      {/* Action Buttons: "Dossier" & "Enquire Now" */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '6px' }}>
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
