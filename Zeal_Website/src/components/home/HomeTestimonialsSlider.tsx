import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  Star,
} from 'lucide-react';
import type { ITestimonialItem } from '../../types';
import './HomeStyles.css';

export interface HomeTestimonialsSliderProps {
  testimonials?: ITestimonialItem[];
}

// Helpers to sanitize legacy PCD/monopoly text
const sanitizeFeedback = (text: string) => {
  if (!text) return '';
  return text
    .replace(/PCD pharmaceutical business/gi, 'pharmaceutical distribution business')
    .replace(/PCD Franchise Partner/gi, 'Authorized Stockist Partner')
    .replace(/PCD Distributor/gi, 'Stockist & Distributor')
    .replace(/PCD/gi, 'Stockist')
    .replace(/district monopoly/gi, 'district distribution')
    .replace(/monopoly rights/gi, 'authorized distribution rights')
    .replace(/monopoly/gi, 'distribution');
};

const sanitizeRole = (role: string) => {
  if (!role) return 'Medical Practitioner';
  return role
    .replace(/PCD Franchise Partner/gi, 'Authorized Stockist Partner')
    .replace(/Pharma Wholesaler & PCD Distributor/gi, 'Pharma Wholesaler & Stockist Partner')
    .replace(/Exclusive PCD Franchisee/gi, 'Authorized Stockist Partner')
    .replace(/PCD/gi, 'Stockist');
};

const isMedicalDoctor = (name: string, role?: string) => {
  const n = (name || '').toLowerCase();
  const r = (role || '').toLowerCase();
  return (
    n.startsWith('dr.') ||
    n.startsWith('dr ') ||
    r.includes('physician') ||
    r.includes('pediatrician') ||
    r.includes('cardiologist') ||
    r.includes('gynecologist') ||
    r.includes('doctor') ||
    r.includes('practitioner')
  );
};

export const HomeTestimonialsSlider: React.FC<HomeTestimonialsSliderProps> = ({ testimonials }) => {
  const [itemsPerView, setItemsPerView] = useState(3);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 680) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalReviews = testimonials ? testimonials.length : 0;
  const maxTestimonialIndex = Math.max(0, totalReviews - itemsPerView);

  // 5-second smooth auto sliding, one-by-one from right to left
  useEffect(() => {
    if (totalReviews <= itemsPerView || isPaused) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev >= maxTestimonialIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [totalReviews, itemsPerView, maxTestimonialIndex, isPaused, testimonialIndex]);

  if (!testimonials || testimonials.length === 0) return null;

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev >= maxTestimonialIndex ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev <= 0 ? maxTestimonialIndex : prev - 1));
  };

  const gap = 20;

  return (
    <section
      className="zp-home-testimonials-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Decorative Brand Glows & Grid Pattern */}
      <div className="zp-home-testimonials-glow-1" />
      <div className="zp-home-testimonials-glow-2" />
      <div className="zp-home-testimonials-grid-pattern" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header with Trust Scorecard and Controls */}
        <div className="zp-home-testimonials-header-row">
          <div>
            <div className="zp-home-testimonials-badge">
              <Sparkles size={13} />
              <span>Clinical Feedback &amp; Stockist Validation</span>
            </div>

            <h2 className="zp-home-testimonials-title">
              What Doctors &amp; <span className="highlight-gradient">Stockist Partners</span> Say
            </h2>

            <p className="zp-home-testimonials-sub">
              Verified clinical experiences and commercial feedback from 1,000+ medical consultants, hospital practitioners, and stockists across India.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Live Trust Scorecard */}
            <div className="zp-home-testimonials-scorecard">
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B' }}>
                <Star size={18} fill="#F59E0B" />
                <span
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 900,
                    fontSize: '16px',
                    color: '#0F172A',
                    marginLeft: '4px',
                  }}
                >
                  4.98
                </span>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>/ 5.0</span>
              </div>
              <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }} />
              <div style={{ fontSize: '11.5px', color: '#475569', fontWeight: 700, lineHeight: 1.3 }}>
                <div>1,000+ Verified</div>
                <div style={{ color: '#059669', fontSize: '10.5px' }}>Prescribers &amp; Stockists</div>
              </div>
            </div>

            {/* Nav Arrows */}
            {totalReviews > itemsPerView && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={prevTestimonial}
                  aria-label="Previous Reviews"
                  className="zp-home-testimonial-nav-btn"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextTestimonial}
                  aria-label="Next Reviews"
                  className="zp-home-testimonial-nav-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Track: 3 Cards View with 1-by-1 Smooth Transition */}
        <div style={{ overflow: 'hidden', padding: '10px 4px 16px' }}>
          <div
            style={{
              display: 'flex',
              gap: `${gap}px`,
              transform: `translateX(calc(-${testimonialIndex} * (100% / ${itemsPerView} + ${gap / itemsPerView}px)))`,
              transition: 'transform 0.55s cubic-bezier(0.2, 1, 0.3, 1)',
            }}
          >
            {testimonials.map((item, idx) => {
              const isDoc = isMedicalDoctor(item.name, item.role);
              const cleanText = sanitizeFeedback(item.comment);
              const roleClean = sanitizeRole(item.role);

              return (
                <div
                  key={(item as any).id || (item as any)._id || idx}
                  className="zp-home-testimonial-card"
                  style={{
                    flex: `0 0 calc((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView})`,
                  }}
                >
                  {/* Card Content Top: 5 Stars + Verified Feedback Badge */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <div style={{ display: 'flex', color: '#F59E0B', gap: '2px' }}>
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                          ))}
                        </div>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 800,
                            color: '#0F172A',
                            marginLeft: '4px',
                          }}
                        >
                          {(item.rating || 5).toFixed(1)}
                        </span>
                      </div>

                      <span className="zp-verified-badge">
                        <CheckCircle2 size={12} />
                        <span>Verified Feedback</span>
                      </span>
                    </div>

                    {/* Testimonial Quote */}
                    <p className="zp-home-testimonial-quote">
                      &ldquo;{cleanText}&rdquo;
                    </p>
                  </div>

                  {/* Card Footer: Author Profile & Location */}
                  <div className="zp-home-testimonial-footer">
                    <div className={`zp-home-testimonial-avatar ${isDoc ? 'doctor' : 'stockist'}`}>
                      {item.name ? item.name.replace(/^Dr\.\s*/i, '').charAt(0) : 'Z'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '15.5px',
                          fontWeight: 800,
                          color: '#0F172A',
                          margin: '0 0 2px 0',
                          letterSpacing: '-0.2px',
                        }}
                      >
                        {item.name}
                      </h4>
                      <div
                        style={{
                          fontSize: '12px',
                          color: isDoc ? '#6828DC' : '#0284C7',
                          fontWeight: 700,
                          marginBottom: '2px',
                        }}
                      >
                        {roleClean}
                      </div>
                      {item.clinic && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <MapPin size={11} style={{ color: '#94A3B8', flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.clinic}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Pagination Dots & Live Counter */}
        {totalReviews > itemsPerView && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              marginTop: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {Array.from({ length: maxTestimonialIndex + 1 }).map((_, idx) => {
                const isActive = testimonialIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTestimonialIndex(idx)}
                    aria-label={`Jump to review ${idx + 1}`}
                    style={{
                      width: isActive ? '32px' : '9px',
                      height: '9px',
                      borderRadius: '999px',
                      background: isActive ? 'var(--zp-primary, #6828DC)' : '#CBD5E1',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.35s ease',
                      padding: 0,
                    }}
                  />
                );
              })}
            </div>

            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#64748B',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Showing {testimonialIndex + 1}–{Math.min(testimonialIndex + itemsPerView, totalReviews)} of {totalReviews} Verified Stories
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
