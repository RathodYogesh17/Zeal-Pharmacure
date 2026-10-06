import React from 'react';
import { Link } from 'react-router-dom';
import { X, FileText, Star, AlertTriangle, Pill, Check, ExternalLink } from 'lucide-react';
import type { IProduct } from '../../types';
import { productService } from '../../api/productService';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface ProductDetailModalProps {
  product: IProduct | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { openFranchiseModal } = useSiteSettings();

  if (!product) return null;

  const visualAidUrl = productService.getVisualAidUrl(product.slug || product._id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '720px', padding: '32px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-purple">{product.dosageForm || 'Formulation'}</span>
              <span className="badge badge-green">{product.prescriptionType || 'General'}</span>
              {product.isNewLaunch && <span className="badge badge-orange">New Launch</span>}
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
              {product.name}
            </h2>
            <p style={{ fontSize: '14px', color: '#6828DC', fontWeight: 600, marginTop: '4px' }}>
              {product.genericName}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              background: '#F1F5F9',
              color: '#64748B',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Doctor Rating Stars & Packaging */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#F8FAFC',
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '13.5px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', color: '#F59E0B' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < Math.round(product.averageRating || 5) ? '#F59E0B' : 'none'}
                />
              ))}
            </div>
            <span style={{ fontWeight: 700, color: '#1E293B' }}>
              {(product.averageRating || 5).toFixed(1)} / 5.0
            </span>
            <span style={{ color: '#64748B' }}>
              ({product.totalReviews || 12} Doctor Reviews)
            </span>
          </div>

          <div style={{ color: '#334155' }}>
            <strong>Packaging:</strong> {product.packaging}
          </div>
        </div>

        {/* Clinical Composition Box */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
            Active Pharmaceutical Composition
          </h4>
          <div style={{
            background: '#FAF5FF',
            border: '1px solid #E9D5FF',
            color: '#581C87',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '13.5px',
            lineHeight: 1.6,
          }}>
            {product.composition}
          </div>
        </div>

        {/* Indications */}
        {product.indicationTags && product.indicationTags.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
              Approved Clinical Indications
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.indicationTags.map((ind, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#EDE9FE',
                    color: '#6828DC',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                  }}
                >
                  ✓ {ind}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Dosage & Precautions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
              <Pill size={15} style={{ color: '#6828DC' }} />
              <span>Recommended Usage</span>
            </div>
            <p style={{ color: '#64748B', lineHeight: 1.5 }}>
              {product.howToUse || 'As prescribed by a Registered Medical Practitioner. Store in cool, dry place.'}
            </p>
          </div>

          <div style={{ background: '#FFFBEB', padding: '14px', borderRadius: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#B45309', marginBottom: '4px' }}>
              <AlertTriangle size={15} />
              <span>Precautions & Storage</span>
            </div>
            <p style={{ color: '#78350F', lineHeight: 1.5 }}>
              {product.precautions || 'Protect from moisture and direct sunlight. Keep out of reach of children.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to={`/products/${product.slug || product._id}`}
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '10px 18px', fontSize: '13.5px', borderRadius: '8px', color: '#6828DC' }}
          >
            <ExternalLink size={15} />
            <span>Open Dedicated Page</span>
          </Link>

          <a
            href={visualAidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ padding: '10px 18px', fontSize: '13.5px', borderRadius: '8px' }}
          >
            <FileText size={15} />
            <span>1-Click Visual Aid (PDF)</span>
          </a>

          <button
            onClick={() => {
              onClose();
              openFranchiseModal();
            }}
            className="btn btn-primary"
            style={{ padding: '10px 22px', fontSize: '13.5px', borderRadius: '8px' }}
          >
            <Check size={16} />
            <span>Enquire for Territory Monopoly</span>
          </button>
        </div>
      </div>
    </div>
  );
};
