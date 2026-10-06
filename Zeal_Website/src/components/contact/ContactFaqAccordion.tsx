import React from 'react';
import type { IFaqItem } from '../../types';
import { FaqAccordion } from '../common';

export interface ContactFaqAccordionProps {
  faqs?: IFaqItem[];
}

export const ContactFaqAccordion: React.FC<ContactFaqAccordionProps> = ({ faqs }) => {
  return (
    <FaqAccordion
      faqs={faqs}
      badge="Stockist Distribution Queries"
      title="Frequently Asked Questions"
      subtitle="Have questions about minimum investment, territory monopoly, or drug license requirements? Find quick answers below."
      style={{ padding: '64px 0', borderTop: '1px solid #F1F5F9' }}
    />
  );
};
