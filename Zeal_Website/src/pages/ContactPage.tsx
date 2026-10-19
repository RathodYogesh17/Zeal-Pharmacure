import React, { useEffect, useRef } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { PreFooterBanner } from '../components/layout/PreFooterBanner';
import { FaqAccordion } from '../components/common';
import {
  ContactHero,
  ContactInfoCards,
  ContactFeatureBanners,
  ContactForm,
  ContactBranchesMap,
} from '../components/contact';

export const ContactPage: React.FC = () => {
  const { settings, faqs, openFranchiseModal } = useSiteSettings();
  const formSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Contact Us | Zeal Pharmacure - Direct Corporate & Stockist Network';
  }, []);

  const handleScrollToForm = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#0F172A' }}>
      {/* 1. Header Banner with Brand Gradient, Split Visuals & Badge */}
      <ContactHero
        onOpenFranchise={openFranchiseModal}
        onScrollToForm={handleScrollToForm}
      />

      {/* 2. Top 4 Contact Detail Cards (Helpline, WhatsApp, Email, HQ) */}
      <ContactInfoCards settings={settings} />

      {/* 3. Mid-Page Visual Feature Banners (Stockist Monopoly & Institutional Contracts) */}
      <ContactFeatureBanners
        onOpenFranchise={openFranchiseModal}
        onScrollToForm={handleScrollToForm}
      />

      {/* 4. Send Us a Message Form & Regional Depots / Map */}
      <section
        ref={formSectionRef}
        id="contact-form-section"
        className="container"
        style={{ padding: '48px 20px 64px' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '36px',
            alignItems: 'start',
          }}
        >
          <ContactForm />
          <ContactBranchesMap settings={settings} />
        </div>
      </section>

      {/* 5. Stockist Distribution FAQs */}
      <FaqAccordion
        faqs={faqs}
        badge="Stockist Distribution Queries"
        title="Frequently Asked Questions"
        subtitle="Have questions about minimum investment, territory monopoly, or drug license requirements? Find quick answers below."
        style={{ padding: '64px 0', borderTop: '1px solid #F1F5F9' }}
      />

      {/* 6. Pre-Footer Action Banner */}
      <PreFooterBanner />
    </div>
  );
};
