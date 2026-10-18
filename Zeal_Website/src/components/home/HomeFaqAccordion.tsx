import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import type { IFaqItem } from '../../types';
import { fallbackFaqs as defaultFaqs } from '../../api/contentService';
import './HomeStyles.css';

export interface HomeFaqAccordionProps {
  faqs?: IFaqItem[];
}

export const HomeFaqAccordion: React.FC<HomeFaqAccordionProps> = ({ faqs }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  if (!displayFaqs || displayFaqs.length === 0) return null;

  return (
    <section style={{ padding: '72px 0 80px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Executive Section Header with Right-Side Helpdesk Scorecard */}
        <div className="zp-home-testimonials-header-row">
          <div>
            <div className="zp-home-testimonials-badge">
              <HelpCircle size={13} />
              <span>Stockists Distribution FAQs</span>
            </div>

            <h2 className="zp-home-testimonials-title">
              Common Questions About <span className="highlight-gradient">Zeal Pharma</span>
            </h2>

            <p className="zp-home-testimonials-sub">
              Transparent answers regarding authorized stockists distribution, minimum order requirements, and marketing collaterals.
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
                    background: '#F5F3FF',
                    border: '1px solid #DDD6FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HelpCircle size={18} style={{ color: 'var(--zp-primary, #6828DC)' }} />
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
                    Stockist Helpdesk
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--zp-primary, #6828DC)', fontWeight: 700 }}>
                    Dedicated Pharma Support
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
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
              <span>Contact Helpdesk</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Accordion Items */}
        <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayFaqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={(faq as any).id || (faq as any)._id || idx}
                style={{
                  background: isOpen ? '#FAF5FF' : '#F8FAFC',
                  borderRadius: '14px',
                  border: isOpen ? '1.5px solid #C4B5FD' : '1px solid #E2E8F0',
                  boxShadow: isOpen ? '0 4px 16px rgba(104, 40, 220, 0.08)' : '0 2px 4px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: isOpen ? 'var(--zp-primary, #6828DC)' : '#0F172A',
                      fontFamily: 'Outfit, sans-serif',
                    }}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: isOpen ? 'var(--zp-primary, #6828DC)' : '#64748B',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 22px 18px',
                      fontSize: '14px',
                      color: '#475569',
                      lineHeight: 1.65,
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '12px',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
