import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { getMediaUrl } from '../../utils/mediaUtils';
import type { IProduct } from '../../types';

interface ProductDetailSidebarProps {
  currentProduct: IProduct;
  relatedProducts: IProduct[];
  categoryName: string;
  onOpenFranchise: () => void;
}

export const ProductDetailSidebar: React.FC<ProductDetailSidebarProps> = ({
  currentProduct,
  relatedProducts,
  categoryName,
  onOpenFranchise,
}) => {
  const { settings } = useSiteSettings();
  const multivitaminImg = getMediaUrl((settings as any)?.promoBanners?.productMultivitamin, '/promos/promo_multivitamin.jpg');
  const wellnessImg = getMediaUrl((settings as any)?.promoBanners?.productWellness, '/promos/promo_wellness.jpg');

  // Get up to 4 products for the 2-column mini grid
  const miniGridProducts = relatedProducts.length > 0 ? relatedProducts.slice(0, 4) : [currentProduct];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. GREEN PROMO BANNER (matching vertical green banner in screenshot) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 60%, #047857 100%)',
          borderRadius: '20px',
          padding: '24px 20px',
          color: '#FFFFFF',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)',
        }}
      >
        <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A7F3D0', marginBottom: '8px' }}>
          By Zeal Pharmacure
        </div>

        <div style={{ width: '80px', height: '80px', margin: '0 auto 10px', background: 'rgba(255,255,255,0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={multivitaminImg}
            alt="Vitamins & Supplements"
            style={{ maxHeight: '70px', maxWidth: '70px', objectFit: 'contain' }}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <h4 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 6px 0', lineHeight: 1.25 }}>
          {categoryName} &amp; Chronic Care
        </h4>
        <p style={{ fontSize: '12px', color: '#D1FAE5', lineHeight: 1.5, margin: '0 0 16px 0' }}>
          WHO-GMP certified oral solids &amp; tonics with high retail margins.
        </p>
        <button
          type="button"
          onClick={onOpenFranchise}
          style={{
            background: '#FFFFFF',
            color: '#065F46',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            transition: 'transform 0.2s',
          }}
        >
          <span>View Range</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 2. "MORE TO LOVE" 2-COLUMN MINI PRODUCTS GRID (exact matching from screenshot!) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E2E8F0',
          padding: '20px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              More to Love
            </h4>
            <span
              style={{
                background: '#FDF2F8',
                color: '#BE185D',
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '6px',
              }}
            >
              Recommended
            </span>
          </div>
          <Link
            to="/products"
            style={{ fontSize: '11.5px', color: 'var(--zp-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            View all
          </Link>
        </div>

        {/* 2-Column Mini Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}
        >
          {miniGridProducts.map((item) => (
            <Link
              key={item._id}
              to={`/products/${item.slug || item._id}`}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--zp-primary-light)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(104, 40, 220, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  left: '6px',
                  background: '#10B981',
                  color: '#FFFFFF',
                  fontSize: '8.5px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '4px',
                }}
              >
                GMP
              </div>

              <div
                style={{
                  width: '100%',
                  height: '75px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '8px 0 6px 0',
                }}
              >
                {item.featuredImage ? (
                  <img
                    src={item.featuredImage}
                    alt={item.name}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ fontSize: '24px' }}>💊</div>
                )}
              </div>

              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.dosageForm || 'Formulation'}
              </span>

              <strong
                style={{
                  fontSize: '11.5px',
                  color: '#0F172A',
                  lineHeight: 1.25,
                  marginTop: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  height: '28px',
                }}
              >
                {item.name}
              </strong>

              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: 'var(--zp-primary)',
                  marginTop: '6px',
                }}
              >
                View Dossier →
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. BOTTOM AMBER PROMO BANNER (matching bottom banner in screenshot) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
          borderRadius: '20px',
          border: '1.5px solid #FCD34D',
          padding: '24px 20px',
          color: '#78350F',
          textAlign: 'center',
          boxShadow: '0 6px 20px rgba(245, 158, 11, 0.1)',
        }}
      >
        <div style={{ width: '80px', height: '80px', margin: '0 auto 10px', background: '#FFFFFF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FCD34D' }}>
          <img
            src={wellnessImg}
            alt="Stockists Distribution"
            style={{ maxHeight: '70px', maxWidth: '70px', objectFit: 'contain' }}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#B45309', marginBottom: '4px' }}>
          Stockists Distribution Rights
        </div>
        <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#451A03', margin: '0 0 6px 0', lineHeight: 1.25 }}>
          Authorized Stockists Rights
        </h4>
        <p style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.5, margin: '0 0 14px 0' }}>
          Zero intra-brand market clash. Full legal distributor rights.
        </p>
        <button
          type="button"
          onClick={onOpenFranchise}
          style={{
            background: '#D97706',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
          }}
        >
          <span>Apply for Stockists / Distribution</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};
