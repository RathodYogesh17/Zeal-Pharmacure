import React, { useState } from 'react';
import { Plus, Send, Sparkles } from 'lucide-react';
import type { IProduct } from '../../types';
import { RatingStars } from '../common/RatingStars';

interface ProductDetailComboInquiryProps {
  currentProduct: IProduct;
  comboProducts: IProduct[];
  onOpenComboEnquiry: (selected: IProduct[]) => void;
}

export const ProductDetailComboInquiry: React.FC<ProductDetailComboInquiryProps> = ({
  currentProduct,
  comboProducts,
  onOpenComboEnquiry,
}) => {
  // Combine current product + up to 2 complementary products
  const allCombo = [currentProduct, ...comboProducts.slice(0, 2)];
  const [selectedIds, setSelectedIds] = useState<string[]>(allCombo.map((p) => p._id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedProducts = allCombo.filter((p) => selectedIds.includes(p._id));

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E2E8F0',
        padding: '30px',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
        margin: '36px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <span
          style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
            color: 'var(--zp-primary)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            border: '1px solid #DDD6FE',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={13} />
          <span>Therapeutic Synergy</span>
        </span>
        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
          Frequently Inquired Together
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 1fr)',
          gap: '30px',
          alignItems: 'center',
        }}
        className="combo-grid"
      >
        {/* Left Side: Product Cards Connected by '+' */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          {allCombo.map((product, idx) => {
            const isSelected = selectedIds.includes(product._id);
            const isCurrent = product._id === currentProduct._id;

            return (
              <React.Fragment key={product._id}>
                {idx > 0 && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#F1F5F9',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={16} />
                  </div>
                )}

                <div
                  style={{
                    flex: '1 1 150px',
                    minWidth: '140px',
                    maxWidth: '190px',
                    background: isSelected ? '#FAF5FF' : '#F8FAFC',
                    border: isSelected ? '1.5px solid #C4B5FD' : '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '16px 14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                  onClick={() => toggleSelect(product._id)}
                >
                  {isCurrent && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: '#EDE9FE',
                        color: 'var(--zp-primary)',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '6px',
                      }}
                    >
                      This Product
                    </div>
                  )}

                  <div
                    style={{
                      width: '100%',
                      height: '110px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                      padding: '8px',
                    }}
                  >
                    {product.featuredImage ? (
                      <img
                        src={product.featuredImage}
                        alt={product.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ fontSize: '28px' }}>💊</div>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 800,
                      color: '#0F172A',
                      lineHeight: 1.25,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.name}
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px' }}>
                    {product.dosageForm || 'Dosage'} ● {product.packaging || 'Standard Pack'}
                  </div>

                  <RatingStars rating={product.averageRating || 5} totalReviews={product.totalReviews || 4} />
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Side: Checkbox Checklist + Enquiry Action */}
        <div
          style={{
            background: '#F8FAFC',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            padding: '20px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
            Combo Formulation Selection:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {allCombo.map((product) => {
              const isSelected = selectedIds.includes(product._id);
              return (
                <label
                  key={product._id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '12.5px',
                    color: isSelected ? '#1E293B' : '#94A3B8',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => toggleSelect(product._id)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    style={{ marginTop: '2px', accentColor: 'var(--zp-primary)' }}
                  />
                  <span>
                    <strong>{product.name}</strong> ({product.dosageForm || 'Formulation'})
                  </span>
                </label>
              );
            })}
          </div>

          <div
            style={{
              paddingTop: '14px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              <strong style={{ color: 'var(--zp-primary)', fontSize: '14px' }}>
                {selectedProducts.length}
              </strong>{' '}
              Formulations ready for combined stockists distribution dispatch
            </div>

            <button
              type="button"
              disabled={selectedProducts.length === 0}
              onClick={() => onOpenComboEnquiry(selectedProducts)}
              className="btn btn-primary"
              style={{
                width: '100%',
                borderRadius: '10px',
                padding: '12px 18px',
                fontSize: '13.5px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(104, 40, 220, 0.25)',
              }}
            >
              <Send size={15} />
              <span>Enquire Combined Formulations</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .combo-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
