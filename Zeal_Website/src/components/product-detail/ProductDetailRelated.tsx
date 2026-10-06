import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import type { IProduct } from '../../types';
import { productService } from '../../api/productService';
import { SectionHeader, ProductGrid } from '../common';

interface ProductDetailRelatedProps {
  currentProduct: IProduct;
  categoryName: string;
  categorySlug: string;
  onEnquireProduct: (product: IProduct) => void;
  bulkSelectedIds?: string[];
  onToggleBulk?: (product: IProduct) => void;
}

export const ProductDetailRelated: React.FC<ProductDetailRelatedProps> = ({
  currentProduct,
  categoryName,
  categorySlug,
  onEnquireProduct,
  bulkSelectedIds = [],
  onToggleBulk,
}) => {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        // Try backend related endpoint first
        let list: IProduct[] = await productService.getRelatedProducts(currentProduct.slug || currentProduct._id, 5);

        // If backend returned fewer than 5, fetch by category or general products
        if (!list || list.length < 5) {
          const catRes = await productService.getProducts({
            category: categorySlug || undefined,
            limit: 15,
          });
          const extraCat = (catRes?.products || []).filter(
            (p) =>
              p._id !== currentProduct._id &&
              p.slug !== currentProduct.slug &&
              !list.some((existing) => existing._id === p._id)
          );
          list = [...(list || []), ...extraCat];
        }

        // If still fewer than 5, fetch other products
        if (list.length < 5) {
          const generalResponse = await productService.getProducts({ limit: 12 });
          const extraGeneral = (generalResponse?.products || []).filter(
            (p) =>
              p._id !== currentProduct._id &&
              p.slug !== currentProduct.slug &&
              !list.some((existing) => existing._id === p._id)
          );
          list = [...list, ...extraGeneral];
        }

        // Limit strictly to 4 products as requested by user
        if (isMounted) {
          setRelatedProducts(list.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load related products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryProducts();

    return () => {
      isMounted = false;
    };
  }, [currentProduct._id, currentProduct.slug, categorySlug]);

  const handleViewDossier = (p: IProduct) => {
    navigate(`/products/${p.slug || p._id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!loading && relatedProducts.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '56px', marginBottom: '40px' }}>
      <SectionHeader
        badge={`Therapeutic Category: ${categoryName}`}
        badgeIcon={<Layers size={13} />}
        title={`Related Formulations in ${categoryName}`}
        titleLevel="h3"
        subtitle={`Showing 4 complementary formulations matching the ${categoryName} therapeutic segment.`}
        actionLink={`/products${categorySlug ? `?category=${categorySlug}` : ''}`}
        actionText={`Explore All ${categoryName}`}
        style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #E2E8F0' }}
      />

      <ProductGrid
        products={relatedProducts}
        loading={loading}
        skeletonCount={4}
        onViewDossier={handleViewDossier}
        onEnquire={onEnquireProduct}
        bulkSelectedIds={bulkSelectedIds}
        onToggleBulk={onToggleBulk}
      />
    </div>
  );
};
