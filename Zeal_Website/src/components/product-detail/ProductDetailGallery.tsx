import React, { useState } from 'react';
import { Pill, ShieldCheck, Sparkles, ZoomIn, X } from 'lucide-react';
import type { IProduct } from '../../types';
import { getMediaUrl } from '../../utils/mediaUtils';

interface ProductDetailGalleryProps {
  product: IProduct;
  activeImage: string;
  setActiveImage: (url: string) => void;
}

export const ProductDetailGallery: React.FC<ProductDetailGalleryProps> = ({
  product,
  activeImage,
  setActiveImage,
}) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Collect all gallery images: featuredImage + mediaGallery items
  const galleryImages: string[] = [];
  if (product.featuredImage) {
    galleryImages.push(getMediaUrl(product.featuredImage));
  }
  if (product.mediaGallery && product.mediaGallery.length > 0) {
    product.mediaGallery.forEach((item) => {
      const rawUrl = typeof item === 'object' && (item as any)?.url ? (item as any).url : String(item);
      const url = getMediaUrl(rawUrl);
      if (url && !galleryImages.includes(url)) {
        galleryImages.push(url);
      }
    });
  }

  const currentDisplayImage = getMediaUrl(activeImage || product.featuredImage || '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0, width: '100%' }}>
      {/* Main Image Stage Box */}
      <div
        className="zp-gallery-stage-box"
        style={{
          background: 'radial-gradient(circle at center, #FFFFFF 45%, #F8FAFC 100%)',
          border: '1.5px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          cursor: currentDisplayImage ? 'zoom-in' : 'default',
        }}
        onClick={() => currentDisplayImage && setIsZoomModalOpen(true)}
      >
        {currentDisplayImage ? (
          <img
            src={currentDisplayImage}
            alt={product.name}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              imageRendering: '-webkit-optimize-contrast',
              filter: 'drop-shadow(0 10px 20px rgba(15, 23, 42, 0.12))',
              transition: 'transform 0.3s ease',
            }}
            className="zp-gallery-main-img"
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#94A3B8' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#FAF5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: 'var(--zp-primary)',
              }}
            >
              <Pill size={44} />
            </div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
              Standard Pharmaceutical Packaging
            </p>
            <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>
              {product.packaging || 'Commercial Pack'}
            </span>
          </div>
        )}

        {/* Prescription Classification Badge */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#6828DC',
            border: '1.5px solid #EDE9FE',
            boxShadow: '0 2px 8px rgba(104, 40, 220, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ShieldCheck size={14} color="#6828DC" />
          <span>{product.prescriptionType || 'Schedule H'}</span>
        </div>

        {/* New Launch Tag */}
        {product.isNewLaunch && (
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={12} />
            <span>NEW FORMULATION</span>
          </div>
        )}

        {/* Click to Enlarge Overlay Indicator */}
        {currentDisplayImage && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ZoomIn size={12} />
            <span>Click to Zoom</span>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="zp-gallery-thumbs-row">
          {galleryImages.map((imgUrl, index) => {
            const isSelected = (activeImage || product.featuredImage) === imgUrl;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(imgUrl)}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '10px',
                  border: isSelected ? '2.5px solid #6828DC' : '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isSelected ? '0 0 0 2px #EDE9FE' : 'none',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} view ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Zoom Lightbox Modal */}
      {isZoomModalOpen && currentDisplayImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '85vh',
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <X size={20} />
            </button>
            <img
              src={currentDisplayImage}
              alt={product.name}
              style={{
                maxWidth: '80vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                imageRendering: '-webkit-optimize-contrast',
              }}
            />
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <strong style={{ fontSize: '15px', color: '#0F172A' }}>{product.name}</strong>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0' }}>
                {product.genericName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
