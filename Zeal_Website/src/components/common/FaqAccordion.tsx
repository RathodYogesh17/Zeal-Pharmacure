import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import type { IFaqItem } from '../../types';
import { fallbackFaqs as defaultFaqs } from '../../api/contentService';
import { SectionHeader } from './SectionHeader';

export interface FaqAccordionProps {
  faqs?: IFaqItem[];
  fallbackFaqs?: IFaqItem[];
  badge?: string;
  badgeIcon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  footerLink?: string;
  footerText?: string;
  className?: string;
  style?: React.CSSProperties;
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
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const displayFaqs = (faqs && faqs.length > 0) ? faqs : fallbackFaqs;
  if (!displayFaqs || displayFaqs.length === 0) return null;

  return (
    <section
      className={`faq-section-wrap ${className}`}
      style={{ padding: '72px 0', background: '#FFFFFF',  borderTop: '1px solid #E2E8F0', ...style,}}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <SectionHeader
          badge={badge}
          badgeIcon={badgeIcon}
          title={title}
          subtitle={subtitle}
          centered={true}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayFaqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={(faq as any).id || (faq as any)._id || idx}
                style={{ background: isOpen ? '#FAF5FF' : '#F8FAFC', borderRadius: '12px', border: isOpen ? '1.5px solid #C4B5FD' : '1px solid #E2E8F0', boxShadow: isOpen ? '0 4px 16px rgba(104, 40, 220, 0.08)' : '0 2px 4px rgba(0,0,0,0.02)', overflow: 'hidden',  transition: 'all 0.2s ease', }}>
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{ width: '100%', padding: '16px 22px',display: 'flex', alignItems: 'center', justifyContent: 'space-between',textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', gap: '12px', }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: isOpen ? 'var(--zp-primary, #6828DC)' : '#0F172A', }}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: isOpen ? 'var(--zp-primary, #6828DC)' : '#64748B',flexShrink: 0,}}/>
                </button>

                {isOpen && (
                  <div  style={{ padding: '0 22px 18px', fontSize: '14px', color: '#475569', lineHeight: 1.65, borderTop: '1px solid #F1F5F9', paddingTop: '12px', }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {footerLink && footerText && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link to={footerLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--zp-primary, #6828DC)', fontWeight: 700, fontSize: '14px', textDecoration: 'none', }}>
              <span>{footerText}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
