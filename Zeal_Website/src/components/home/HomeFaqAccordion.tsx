import React from 'react';
import type { IFaqItem } from '../../types';
import { FaqAccordion } from '../common';

export interface HomeFaqAccordionProps {
  faqs?: IFaqItem[];
}

export const HomeFaqAccordion: React.FC<HomeFaqAccordionProps> = ({ faqs }) => {
  return (
    <FaqAccordion
      faqs={faqs}
      badge="Stockists Distribution FAQs"
      title="Common Questions About Zeal Pharma Stockists Distribution"
      subtitle="Transparent answers regarding authorized stockists distribution, minimum order requirements, and marketing collaterals."
      footerLink="/contact"
      footerText="Have more questions? Contact our stockists & distribution helpdesk"
    />
  );
};
