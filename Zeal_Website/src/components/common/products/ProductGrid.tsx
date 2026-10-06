import React from 'react';
import type { IProduct } from '../../../types';
import { ProductCard } from '../../products/ProductCard';
import { ProductSkeletonGrid } from './ProductSkeletonGrid';

export interface ProductGridProps {
  products: IProduct[];
  loading?: boolean;
  skeletonCount?: number;
  skeletonMode?: 'cards' | 'spinner';
  spinnerText?: string;
  onEnquire?: (product: IProduct) => void;
  onViewDossier?: (product: IProduct) => void;
  bulkSelectedIds?: string[];
  onToggleBulk?: (product: IProduct) => void;
  emptyState?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  skeletonCount = 4,
  skeletonMode = 'cards',
  spinnerText = 'Loading Formulations...',
  onEnquire = () => {},
  onViewDossier = () => {},
  bulkSelectedIds = [],
  onToggleBulk,
  emptyState,
  emptyMessage = 'No formulations found.',
  className = 'zp-grid-products',
  style,
}) => {
  if (loading) {
    return (
      <ProductSkeletonGrid
        count={skeletonCount}
        mode={skeletonMode}
        spinnerText={spinnerText}
      />
    );
  }

  if (!products || products.length === 0) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: '#64748B',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px dashed #E2E8F0',
        }}
      >
        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      {products.map((prod) => (
        <ProductCard
          key={prod._id || prod.slug}
          product={prod}
          onEnquire={onEnquire}
          onViewDossier={onViewDossier}
          isBulkSelected={bulkSelectedIds.includes(prod._id)}
          onToggleBulk={onToggleBulk}
        />
      ))}
    </div>
  );
};
