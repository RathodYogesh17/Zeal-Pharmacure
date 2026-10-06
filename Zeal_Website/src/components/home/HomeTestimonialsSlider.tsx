import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, CheckCircle2, MapPin } from 'lucide-react';
import type { ITestimonialItem } from '../../types';
import { RatingStars, SectionHeader } from '../common';

export interface HomeTestimonialsSliderProps {
  testimonials?: ITestimonialItem[];
}

export const HomeTestimonialsSlider: React.FC<HomeTestimonialsSliderProps> = ({ testimonials }) => {
  const [itemsPerView, setItemsPerView] = useState(2);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 820 ? 1 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalReviews = testimonials ? testimonials.length : 0;
  const maxTestimonialIndex = Math.max(0, totalReviews - itemsPerView);

  useEffect(() => {
    if (totalReviews <= itemsPerView || isPaused) return;
    const timer = setInterval(() => {
      setTestimonialIndex(prev => (prev >= maxTestimonialIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [totalReviews, itemsPerView, maxTestimonialIndex, isPaused]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      style={{ padding: '72px 0 60px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <SectionHeader
            badge="Client Satisfaction & Clinical Feedback"
            title="What Doctors & Stockist Partners Say"
            subtitle="Trusted by 1000+ medical practitioners and stockists across India."
            style={{ marginBottom: 0 }}
          />

          {totalReviews > itemsPerView && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setTestimonialIndex(prev => Math.max(0, prev - 1))}
                disabled={testimonialIndex === 0}
                aria-label="Previous Reviews"
                style={{width: '38px', height: '38px',borderRadius: '50%', background: '#FFFFFF', border: '1.5px solid #CBD5E1', display: 'flex', alignItems: 'center',justifyContent: 'center',
                  cursor: testimonialIndex === 0 ? 'not-allowed' : 'pointer',
                  color: testimonialIndex === 0 ? '#CBD5E1' : '#475569',
                  opacity: testimonialIndex === 0 ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setTestimonialIndex(prev => Math.min(maxTestimonialIndex, prev + 1))}
                disabled={testimonialIndex >= maxTestimonialIndex}
                aria-label="Next Reviews"
                style={{ width: '38px', height: '38px', borderRadius: '50%',background: '#FFFFFF', border: '1.5px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: testimonialIndex >= maxTestimonialIndex ? 'not-allowed' : 'pointer',
                  color: testimonialIndex >= maxTestimonialIndex ? '#CBD5E1' : '#475569',
                  opacity: testimonialIndex >= maxTestimonialIndex ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Track */}
        <div style={{ overflow: 'hidden', padding: '8px 2px' }}>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              transform: `translateX(calc(-${testimonialIndex} * (100% / ${itemsPerView} + ${24 / itemsPerView}px)))`,
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {testimonials.map((item, idx) => (
              <div
                key={(item as any).id || (item as any)._id || idx}
                className="zp-card-interactive"
                style={{ flex: `0 0 calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})`, background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid var(--zp-primary-light, #F5F3FF)', padding: '30px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px -8px rgba(15, 23, 42, 0.05)', boxSizing: 'border-box',  position: 'relative', overflow: 'hidden', }}>
                <div style={{ position: 'absolute', top: '16px', right: '24px', color: '#F5F3FF', pointerEvents: 'none', zIndex: 0 }}>
                  <Quote size={64} style={{ opacity: 0.9 }} />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
                    <RatingStars
                      rating={item.rating || 5}
                      totalReviews={1}
                      size={15}
                      showText={false}
                      forceStars={true}
                      />
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '4px 10px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, color: '#059669', }}>
                      <CheckCircle2 size={13} style={{ color: '#059669' }} />
                      <span>Verified Feedback</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '22px' }}>
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '44px',height: '44px',borderRadius: '50%', background: 'var(--zp-primary-light, #F5F3FF)', color: 'var(--zp-primary, #6828DC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', border: '1.5px solid var(--zp-primary-border, #DDD6FE)', flexShrink: 0, }}>
                    {item.name ? item.name.charAt(0) : 'D'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 500 }}>
                      {item.role || 'Medical Practitioner'}
                    </div>
                    {item.clinic && (
                      <div style={{ fontSize: '11.5px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin size={11} />
                        <span>{item.clinic}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
