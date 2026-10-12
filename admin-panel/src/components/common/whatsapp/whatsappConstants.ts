export const ZEAL_OFFICIAL_PHONE = '9316227576';
export const ZEAL_OFFICIAL_PHONE_DISPLAY = '+91 9316227576';
export const ZEAL_HEAD_OFFICE_ADDRESS = '7015, billiogo text tile market , Parvat Patiya < puna gam';
export const ZEAL_PORTAL_URL = 'www.zealpharma.com';

export type WhatsAppEnquiryCategory = 'PRODUCT' | 'BULK' | 'FRANCHISE' | 'CAREER';

export interface CategoryBadgeStyle {
  bg: string;
  border: string;
  text: string;
  badge: string;
}

export const getWhatsAppCategoryColor = (category: WhatsAppEnquiryCategory): CategoryBadgeStyle => {
  switch (category) {
    case 'CAREER':
      return { bg: '#EDE9FE', border: '#C4B5FD', text: '#5B21B6', badge: 'Career Lead' };
    case 'FRANCHISE':
      return { bg: '#FEF3C7', border: '#FDE68A', text: '#92400E', badge: 'Stockist Monopoly' };
    case 'BULK':
      return { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', badge: 'Bulk Batch' };
    default:
      return { bg: '#ECFDF5', border: '#A7F3D0', text: '#065F46', badge: 'Product Lead' };
  }
};
