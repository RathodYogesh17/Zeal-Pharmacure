import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Pill, ShieldCheck, Sparkles, ZoomIn, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import type { IProduct } from '../../types';
import { getMediaUrl } from '../../utils/mediaUtils';
import './ProductDetailStyles.css';

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
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);

  // Collect all gallery images: featuredImage + mediaGallery items (deduplicated & normalized)
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (product.featuredImage) {
      const url = getMediaUrl(product.featuredImage);
      if (url && !list.includes(url)) {
        list.push(url);
      }
    }
    if (product.mediaGallery && product.mediaGallery.length > 0) {
      product.mediaGallery.forEach((item) => {
        const rawUrl = typeof item === 'object' && (item as any)?.url ? (item as any).url : String(item);
        const url = getMediaUrl(rawUrl);
        if (url && !list.includes(url)) {
          list.push(url);
        }
      });
    }
    return list;
  }, [product]);

  const currentDisplayImage = getMediaUrl(activeImage || product.featuredImage || galleryImages[0] || '');
  const currentIndex = Math.max(0, galleryImages.findIndex((img) => img === currentDisplayImage));

  // Navigation handlers
  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (galleryImages.length <= 1) return;
    const newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    setSlideDirection('prev');
    setActiveImage(galleryImages[newIndex]);
  }, [currentIndex, galleryImages, setActiveImage]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (galleryImages.length <= 1) return;
    const newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    setSlideDirection('next');
    setActiveImage(galleryImages[newIndex]);
  }, [currentIndex, galleryImages, setActiveImage]);

  // Touch Swipe for mobile gestures
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation when zoom modal is active
  useEffect(() => {
    if (!isZoomModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setIsZoomModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomModalOpen, handlePrev, handleNext]);

  // Auto-scroll active thumbnail into view
  const thumbButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const selectedBtn = thumbButtonRefs.current[currentIndex];
    if (selectedBtn) {
      selectedBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentIndex]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0, width: '100%' }}>
      {/* Main Big Image Stage Box with Slider Controls */}
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentDisplayImage ? (
          <img
            key={currentDisplayImage}
            src={currentDisplayImage}
            alt={`${product.name} view ${currentIndex + 1}`}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              imageRendering: '-webkit-optimize-contrast',
              filter: 'drop-shadow(0 10px 20px rgba(15, 23, 42, 0.12))',
              transition: 'transform 0.3s ease',
            }}
            className={`zp-gallery-main-img ${
              slideDirection === 'next' ? 'zp-gallery-slide-right' : slideDirection === 'prev' ? 'zp-gallery-slide-left' : ''
            }`}
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

        {/* Previous Slider Arrow Button */}
        {galleryImages.length > 1 && (
          <button
            type="button"
            className="zp-gallery-nav-btn prev"
            onClick={handlePrev}
            title="Previous Angle / Image"
            aria-label="Previous Image"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Next Slider Arrow Button */}
        {galleryImages.length > 1 && (
          <button
            type="button"
            className="zp-gallery-nav-btn next"
            onClick={handleNext}
            title="Next Angle / Image"
            aria-label="Next Image"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Image Angle Counter Badge */}
        {galleryImages.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              letterSpacing: '0.3px',
              zIndex: 4,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <ImageIcon size={12} />
            <span>{currentIndex + 1} / {galleryImages.length}</span>
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
            WebkitBackdropFilter: 'blur(8px)',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#7C3AED',
            border: '1.5px solid #EDE9FE',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 4,
          }}
        >
          <ShieldCheck size={14} color="#7C3AED" />
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
              zIndex: 4,
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
              WebkitBackdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 4,
            }}
          >
            <ZoomIn size={12} />
            <span>Click to Zoom</span>
          </div>
        )}
      </div>

      {/* Thumbnails Row (Extra Images directly underneath) */}
      {galleryImages.length > 1 && (
        <div className="zp-gallery-thumbs-row">
          {galleryImages.map((imgUrl, index) => {
            const isSelected = imgUrl === currentDisplayImage;
            return (
              <button
                key={index}
                ref={(el) => { thumbButtonRefs.current[index] = el; }}
                type="button"
                onClick={() => {
                  setSlideDirection(index > currentIndex ? 'next' : 'prev');
                  setActiveImage(imgUrl);
                }}
                title={`View angle ${index + 1}`}
                aria-label={`View angle ${index + 1}`}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '10px',
                  border: isSelected ? '2.5px solid #7C3AED' : '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isSelected ? '0 0 0 2px #EDE9FE, 0 4px 12px rgba(124, 58, 237, 0.15)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  flexShrink: 0,
                  outline: 'none',
                }}
              >
                <img
                  src={imgUrl}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Zoom Lightbox Modal with Slider Icons */}
      {isZoomModalOpen && currentDisplayImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(12px, 2.5vw, 24px)',
          }}
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '88vh',
              width: 'clamp(320px, 86vw, 980px)',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: 'clamp(18px, 3vw, 32px)',
              boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                zIndex: 25,
                transition: 'all 0.2s ease',
              }}
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Slider Prev Button inside Zoom Modal */}
            {galleryImages.length > 1 && (
              <button
                type="button"
                className="zp-zoom-nav-btn prev"
                onClick={handlePrev}
                title="Previous Angle (Left Arrow)"
                aria-label="Previous Angle"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            {/* Slider Next Button inside Zoom Modal */}
            {galleryImages.length > 1 && (
              <button
                type="button"
                className="zp-zoom-nav-btn next"
                onClick={handleNext}
                title="Next Angle (Right Arrow)"
                aria-label="Next Angle"
              >
                <ChevronRight size={26} />
              </button>
            )}

            {/* Zoomed Big Image Stage */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 'clamp(280px, 58vh, 520px)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                key={currentDisplayImage}
                src={currentDisplayImage}
                alt={`${product.name} angle ${currentIndex + 1}`}
                className={
                  slideDirection === 'next' ? 'zp-gallery-slide-right' : slideDirection === 'prev' ? 'zp-gallery-slide-left' : ''
                }
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  imageRendering: '-webkit-optimize-contrast',
                  filter: 'drop-shadow(0 14px 28px rgba(15, 23, 42, 0.16))',
                  userSelect: 'none',
                }}
              />
            </div>

            {/* Bottom Caption & Mini Thumbnails Strip in Zoom Modal */}
            <div style={{ textAlign: 'center', marginTop: '14px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '16px', color: '#0F172A' }}>{product.name}</strong>
                {galleryImages.length > 1 && (
                  <span
                    style={{
                      background: '#EDE9FE',
                      color: '#7C3AED',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: '12px',
                    }}
                  >
                    Angle {currentIndex + 1} of {galleryImages.length}
                  </span>
                )}
              </div>
              {product.genericName && (
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                  {product.genericName}
                </p>
              )}

              {/* Mini Thumbnails in Zoom Modal for Direct Angle Jump */}
              {galleryImages.length > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '12px',
                    overflowX: 'auto',
                    padding: '4px',
                  }}
                >
                  {galleryImages.map((imgUrl, idx) => {
                    const isSelected = imgUrl === currentDisplayImage;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSlideDirection(idx > currentIndex ? 'next' : 'prev');
                          setActiveImage(imgUrl);
                        }}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          border: isSelected ? '2.5px solid #7C3AED' : '1.5px solid #E2E8F0',
                          background: '#FFFFFF',
                          padding: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isSelected ? '0 0 0 2px #EDE9FE' : 'none',
                          opacity: isSelected ? 1 : 0.6,
                          transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                          transition: 'all 0.2s ease',
                          flexShrink: 0,
                          outline: 'none',
                        }}
                        title={`Switch to angle ${idx + 1}`}
                        aria-label={`Switch to angle ${idx + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
