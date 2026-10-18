import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import type { IProduct } from '../../types';
import { ProductGrid } from '../common';
import './HomeStyles.css';

export interface HomeFeaturedProductsProps {
  products: IProduct[];
  loading: boolean;
  onEnquire: (p: IProduct) => void;
  onViewDossier: (p: IProduct) => void;
}

export const HomeFeaturedProducts: React.FC<HomeFeaturedProductsProps> = ({
  products,
  loading,
  onEnquire,
  onViewDossier,
}) => {
  const displayProducts = products.slice(0, 4);

  return (
    <section style={{ padding: '72px 0', background: '#FAFAFC', borderTop: '1px solid #F1F5F9' }}>
      <div className="container">
        {/* Executive Section Header with Right-Side Quality Scorecard */}
        <div className="zp-home-testimonials-header-row">
          <div>
            <div className="zp-home-testimonials-badge">
              <Sparkles size={13} />
              <span>Our Featured Products</span>
            </div>

            <h2 className="zp-home-testimonials-title">
              High Quality Formulations for a <span className="highlight-gradient">Healthier Life</span>
            </h2>

            <p className="zp-home-testimonials-sub">
              Live database formulations engineered with verified bioavailability and WHO-GMP stability standards.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div className="zp-home-testimonials-scorecard">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={18} style={{ color: '#059669' }} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 900,
                      fontSize: '15px',
                      color: '#0F172A',
                    }}
                  >
                    WHO-GMP
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                    100% DCGI Approved
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '12px',
                background: 'var(--zp-primary, #6828DC)',
                color: '#FFFFFF',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Explore All Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <ProductGrid
          products={displayProducts}
          loading={loading}
          skeletonCount={4}
          onEnquire={onEnquire}
          onViewDossier={onViewDossier}
          emptyMessage="No products found in database."
        />
      </div>
    </section>
  );
};
