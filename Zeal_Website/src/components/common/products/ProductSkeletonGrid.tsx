import React from 'react';
import { Pill } from 'lucide-react';

export interface ProductSkeletonGridProps {
  count?: number;
  mode?: 'cards' | 'spinner';
  spinnerText?: string;
  columns?: string;
}

export const ProductSkeletonGrid: React.FC<ProductSkeletonGridProps> = ({
  count = 4,
  mode = 'cards',
  spinnerText = 'Loading Formulations...',
}) => {
  if (mode === 'spinner') {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--zp-primary, #6828DC)' }}>
        <Pill size={40} className="pulse-dot" style={{ margin: '0 auto 12px' }} />
        <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A' }}>
          {spinnerText}
        </div>
      </div>
    );
  }

  return (
    <div className="zp-grid-products">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid #F1F5F9',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}
        >
          {/* Image Placeholder */}
          <div
            style={{
              height: '190px',
              background: 'linear-gradient(110deg, #F8FAFC 8%, #F1F5F9 18%, #F8FAFC 33%)',
              backgroundSize: '200% 100%',
              animation: 'pulse 1.6s ease-in-out infinite',
            }}
          />

          {/* Content Placeholder */}
          <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {/* Category Pill Skeleton */}
            <div
              style={{
                width: '70px',
                height: '18px',
                borderRadius: '999px',
                background: '#EDE9FE',
                opacity: 0.7,
              }}
            />

            {/* Title Skeleton */}
            <div
              style={{
                height: '18px',
                width: '85%',
                borderRadius: '6px',
                background: '#E2E8F0',
                animation: 'pulse 1.6s ease-in-out infinite',
              }}
            />

            {/* Composition Skeleton */}
            <div
              style={{
                height: '12px',
                width: '65%',
                borderRadius: '4px',
                background: '#F1F5F9',
              }}
            />

            {/* Spacer */}
            <div style={{ flex: 1, minHeight: '12px' }} />

            {/* Action Buttons Skeleton */}
            <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid #F8FAFC' }}>
              <div
                style={{
                  flex: 1,
                  height: '36px',
                  borderRadius: '10px',
                  background: '#F1F5F9',
                }}
              />
              <div
                style={{
                  width: '42px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#EDE9FE',
                  opacity: 0.6,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
