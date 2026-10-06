import React from 'react';
import type { IProduct } from '../../types';
import { SectionHeader, ProductGrid } from '../common';

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
        <SectionHeader
          badge="Our Featured Products"
          title="High Quality Formulations for a Healthier Life"
          subtitle="Live database products formulated according to WHO-GMP standards."
          actionLink="/products"
          actionText="View All Products"
        />

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
