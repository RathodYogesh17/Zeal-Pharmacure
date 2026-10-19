import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import type { IFaqItem } from '../../types';
import { fallbackFaqs as defaultFaqs } from '../../api/contentService';
import { SectionHeader } from './SectionHeader';
import '../home/HomeStyles.css';

export interface FaqAccordionProps {
  faqs?: IFaqItem[];
  fallbackFaqs?: IFaqItem[];
  badge?: string;
  badgeIcon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  footerLink?: string;
  footerText?: string;
  className?: string;
  style?: React.CSSProperties;
  headerType?: 'centered' | 'executive';
  supportCardTitle?: string;
  supportCardSubtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  customHeader?: React.ReactNode;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  faqs,
  fallbackFaqs = defaultFaqs,
  badge = 'Stockists Distribution FAQs',
  badgeIcon = <HelpCircle size={13} />,
  title = 'Frequently Asked Questions',
  subtitle = 'Find quick answers regarding minimum order requirements, territory monopoly, and licensing.',
  footerLink,
  footerText,
  className = '',
  style,
  headerType = 'centered',
  supportCardTitle = 'Stockist Helpdesk',
  supportCardSubtitle = 'Dedicated Pharma Support',
  ctaText = 'Contact Helpdesk',
  ctaLink = '/contact',
  customHeader,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const displayFaqs = faqs && faqs.length > 0 ? faqs : fallbackFaqs;
  if (!displayFaqs || displayFaqs.length === 0) return null;

  const isExecutive = headerType === 'executive';

  return (
    <section
      className={`faq-section-wrap ${className}`}
      style={{
        padding: isExecutive ? '72px 0 80px' : '72px 0',
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        ...style,
      }}
    >
      <div className="container" style={!isExecutive ? { maxWidth: '880px' } : undefined}>
        {customHeader ? (
          customHeader
        ) : isExecutive ? (
          <div className="zp-home-testimonials-header-row">
            <div>
              <div className="zp-home-testimonials-badge">
                {badgeIcon}
                <span>{badge}</span>
              </div>

              <h2 className="zp-home-testimonials-title">
                {title === 'Frequently Asked Questions' ? (
                  <>
                    Common Questions About <span className="highlight-gradient">Zeal Pharma</span>
                  </>
                ) : (
                  title
                )}
              </h2>

              <p className="zp-home-testimonials-sub">{subtitle}</p>
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
                      {supportCardTitle}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--zp-primary, #6828DC)', fontWeight: 700 }}>
                      {supportCardSubtitle}
                    </div>
                  </div>
                </div>
              </div>

              {ctaLink && ctaText && (
                <Link
                  to={ctaLink}
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
                  <span>{ctaText}</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <SectionHeader
            badge={badge}
            badgeIcon={badgeIcon}
            title={typeof title === 'string' ? title : ''}
            subtitle={subtitle}
            centered={true}
          />
        )}

        <div
          style={{
            maxWidth: isExecutive ? '920px' : undefined,
            margin: isExecutive ? '0 auto' : undefined,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
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

        {footerLink && footerText && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link
              to={footerLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--zp-primary, #6828DC)',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              <span>{footerText}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
