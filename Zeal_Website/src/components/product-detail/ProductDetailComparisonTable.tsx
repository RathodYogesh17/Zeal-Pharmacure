import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Send } from 'lucide-react';
import type { IProduct } from '../../types';
import { RatingStars } from '../common/RatingStars';

interface ProductDetailComparisonTableProps {
  currentProduct: IProduct;
  comparisonProducts: IProduct[];
  onEnquireProduct: (product: IProduct) => void;
}

export const ProductDetailComparisonTable: React.FC<ProductDetailComparisonTableProps> = ({
  currentProduct,
  comparisonProducts,
  onEnquireProduct,
}) => {
  // Take current product + 2 similar products
  const products = [currentProduct, ...comparisonProducts.slice(0, 2)];
  if (products.length < 2) return null;

  const getCellStyle = (idx: number, extra?: React.CSSProperties): React.CSSProperties => ({
    padding: '14px 12px',
    textAlign: 'center',
    background: idx === 0 ? '#FAF5FF' : 'transparent',
    borderLeft: '1px solid #F1F5F9',
    ...extra,
  });

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E2E8F0',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        margin: '36px 0',
        overflowX: 'auto',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--zp-primary)',
            background: '#FAF5FF',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid #DDD6FE',
          }}
        >
          Formulation Benchmarking
        </span>
        <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginTop: '6px', marginBottom: '4px' }}>
          Compare with Similar Formulations
        </h3>
        <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
          Side-by-side pharmacological comparison of our WHO-GMP finished dosage forms.
        </p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '650px' }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #E2E8F0' }}>
            <th style={{ width: '22%', textAlign: 'left', padding: '16px 12px', color: '#64748B', fontWeight: 700 }}>
              Formulation
            </th>
            {products.map((p, idx) => (
              <th
                key={p._id}
                style={{
                  width: `${78 / products.length}%`,
                  textAlign: 'center',
                  padding: '16px 12px',
                  background: idx === 0 ? '#FAF5FF' : 'transparent',
                  borderLeft: '1px solid #F1F5F9',
                }}
              >
                <div
                  className="zp-flex-center"
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    margin: '0 auto 10px',
                    padding: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  {p.featuredImage ? (
                    <img src={p.featuredImage} alt={p.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ fontSize: '32px' }}>💊</div>
                  )}
                </div>

                <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0F172A', marginBottom: '6px' }}>
                  {p.name}
                </div>

                {idx === 0 ? (
                  <span style={{ background: 'var(--zp-primary)', color: '#FFFFFF', fontSize: '10.5px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', display: 'inline-block', marginBottom: '8px' }}>
                    Current Product
                  </span>
                ) : (
                  <Link to={`/products/${p.slug || p._id}`} style={{ fontSize: '11.5px', color: 'var(--zp-primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginBottom: '8px' }}>
                    View Dossier →
                  </Link>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Rating */}
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '14px 12px', fontWeight: 700, color: '#334155' }}>Doctor Rating &amp; Quality</td>
            {products.map((p, idx) => (
              <td key={p._id} style={getCellStyle(idx)}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <RatingStars rating={p.averageRating} totalReviews={p.totalReviews} fallbackText="WHO-GMP Verified" />
                  {p.totalReviews && p.totalReviews > 0 ? (
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                      {p.averageRating?.toFixed(1)}
                    </span>
                  ) : null}
                </div>
              </td>
            ))}
          </tr>

          {/* Therapeutic Category */}
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '14px 12px', fontWeight: 700, color: '#334155' }}>Therapeutic Segment</td>
            {products.map((p, idx) => (
              <td key={p._id} style={getCellStyle(idx, { color: '#475569', fontWeight: 600 })}>
                {typeof p.category === 'object' ? p.category?.name : p.category || p.subCategoryName || 'General'}
              </td>
            ))}
          </tr>

          {/* Dosage Form */}
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '14px 12px', fontWeight: 700, color: '#334155' }}>Dosage Form</td>
            {products.map((p, idx) => (
              <td key={p._id} style={getCellStyle(idx, { fontWeight: 600, color: '#0F172A' })}>
                <span style={{ background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px', fontSize: '12px' }}>
                  {p.dosageForm || 'Oral Solid'}
                </span>
              </td>
            ))}
          </tr>

          {/* Active Composition */}
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '14px 12px', fontWeight: 700, color: '#334155' }}>Active Composition</td>
            {products.map((p, idx) => (
              <td key={p._id} style={getCellStyle(idx, { fontSize: '12px', color: '#334155', lineHeight: 1.4 })}>
                {p.composition || p.genericName}
              </td>
            ))}
          </tr>

          {/* Packaging Standard */}
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '14px 12px', fontWeight: 700, color: '#334155' }}>Packaging Standard</td>
            {products.map((p, idx) => (
              <td key={p._id} style={getCellStyle(idx, { color: '#475569', fontWeight: 600 })}>
                {p.packaging || 'Standard Packaging'}
              </td>
            ))}
          </tr>

          {/* Quality Certification */}
          <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
            <td style={{ padding: '14px 12px', fontWeight: 700, color: '#334155' }}>Quality Accreditation</td>
            {products.map((p, idx) => (
              <td key={p._id} style={getCellStyle(idx, { color: '#059669', fontWeight: 700 })}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} />
                  <span>WHO-GMP / cGMP</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Monopoly Availability */}
          <tr style={{ borderBottom: '1.5px solid #E2E8F0' }}>
            <td style={{ padding: '14px 12px', fontWeight: 700, color: '#334155' }}>Monopoly Rights</td>
            {products.map((p, idx) => (
              <td key={p._id} style={getCellStyle(idx, { color: 'var(--zp-primary)', fontWeight: 700 })}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={14} />
                  <span>District Protected</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Action Row */}
          <tr>
            <td style={{ padding: '16px 12px' }}></td>
            {products.map((p, idx) => (
              <td key={p._id} style={getCellStyle(idx, { padding: '16px 12px' })}>
                <button
                  type="button"
                  onClick={() => onEnquireProduct(p)}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, margin: '0 auto' }}
                >
                  <Send size={12} />
                  <span>Enquire Monopoly</span>
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
