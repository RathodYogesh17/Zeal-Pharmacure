import { request } from './apiClient';
import type { ICmsItem, ISiteSettings, IBannerItem, IFaqItem, ICertificationItem, IAboutContent } from '../types';

export const fallbackContactInfo: ISiteSettings = {
  companyName: 'Zeal Pharmacure',
  tagline: 'A Legacy of Better Healthcare',
  logoUrl: 'https://res.cloudinary.com/dll2ppcmu/image/upload/v1791789054/zeal-pharma/logos/czdkyvkh1vtp3bgqd9il.png',
  phone: '+91 9909160190',
  salesHelpline: '+91 9909160190',
  hrHelpline: '+91 9909160190',
  email: 'zealpharmacure@gmail.com',
  salesEmail: 'zealpharmacure@gmail.com',
  whatsappNumber: '+91 9909160190',
  headOfficeAddress: '7015, BTM (Bellagio Textile Market), Sita Nagar, Parvat Patiya, Puna Gam, Surat, Gujarat – 395010, India',
  plantAddress: '7015, BTM (Bellagio Textile Market), Central Logistics Depot, Surat, Gujarat – 395010, India',
  workingHours: '',
  gstNumber: '24AAACZ1234F1Z5',
  drugLicenseNumber: '20B-123456 / 21B-123456',
  primaryCtaText: 'Enquire Now',
  primaryCtaLink: '/contact',
};

export const fallbackBanners: IBannerItem[] = [
  {
    id: 'banner-1',
    title: 'Partner with India’s Most Trusted Stockist Distribution Network',
    subtitle: 'Over 130+ WHO-GMP & DCGI certified pharmaceutical formulations with authorized district stockist distribution rights and high profit margins.',
    badge: 'WHO-GMP & DCGI COMPLIANT BULK DISTRIBUTION',
    imageUrl: '',
    ctaText: 'Apply for Stockists Distribution',
    ctaLink: '/contact',
    isActive: true,
  },
  {
    id: 'banner-2',
    title: 'Ready Bulk Stock with Pan-India Distribution Network',
    subtitle: 'Equipped with modern temperature-controlled warehousing at Surat (7015, BTM Market) ensuring computerized FEFO batch management, zero stockouts, and seamless transit across all states.',
    badge: 'CENTRAL LOGISTICS DEPOT • SURAT, GUJARAT',
    imageUrl: '',
    ctaText: 'Explore Product Catalog',
    ctaLink: '/products',
    isActive: true,
  },
  {
    id: 'banner-3',
    title: 'Accelerate Prescriptions with Free Visual Aids & Detailing Kits',
    subtitle: 'Empower your field network with premium doctor visual aids, clinical LBLs, reminder cards, scientific product glossaries, and physician sample kits provided at zero cost.',
    badge: 'COMPREHENSIVE B2B MARKETING COLLATERALS',
    imageUrl: '',
    ctaText: 'Request Stockist Kit',
    ctaLink: '/contact',
    isActive: true,
  },
];

export const fallbackAbout: IAboutContent = {
  companyStory: 'Zeal Pharmacure is an ISO 9001:2015 and WHO-GMP compliant pharmaceutical enterprise dedicated to enhancing human healthcare through cutting-edge formulation sciences, rigorous clinical standards, and nationwide stockist distribution partnerships.',
  mission: 'To formulate, produce, and deliver top-quality, affordable, and clinically efficacious allopathic and herbal medicines that doctors trust and patients rely on.',
  vision: 'To establish Zeal Pharmacure as the benchmark Stockists Distribution Network across all 28 Indian states, empowered by high quality formulations and ethical marketing.',
  directorName: 'Board of Directors',
  directorTitle: 'Executive Leadership, Zeal Pharmacure',
  directorMessage: 'At Zeal Pharmacure, quality is never an accident; it is always the result of high intention, sincere effort, intelligent direction, and skillful execution. We welcome ambitious pharma entrepreneurs to grow with us.',
  stats: [
    { label: 'Approved Formulations', value: '18+', icon: 'Pill' },
    { label: 'Active Stockist Partners', value: '650+', icon: 'Users' },
    { label: 'States & UTs Covered', value: '22+', icon: 'MapPin' },
    { label: 'WHO-GMP Certified', value: '100%', icon: 'ShieldCheck' },
  ],
};

export const fallbackFaqs: IFaqItem[] = [
  {
    id: 'faq-1',
    category: 'Stockists Distribution',
    question: 'Does Zeal Pharmacure provide exclusive Stockists Distribution rights?',
    answer: 'Yes. We offer strictly protected territory rights backed by a formal Stockists Distribution Agreement to ensure you operate smoothly in your assigned territory.',
    sortOrder: 1,
  },
  {
    id: 'faq-2',
    category: 'Eligibility & Licenses',
    question: 'What legal documents are mandatory to apply as a stockist?',
    answer: 'A valid Wholesale Drug License (Form 20B and Form 21B) along with a valid GST Registration certificate are legally required under the Drugs and Cosmetics Act.',
    sortOrder: 2,
  },
  {
    id: 'faq-3',
    category: 'Order & Dispatch',
    question: 'How quickly are orders dispatched after confirmation?',
    answer: 'Orders are promptly dispatched from our Surat Central Depot via trusted Pan-India pharmaceutical transport logistics with real-time consignment tracking.',
    sortOrder: 3,
  },
  {
    id: 'faq-4',
    category: 'Promotional Support',
    question: 'What promotional inputs and marketing collaterals are provided?',
    answer: 'We supply comprehensive promotional inputs free of charge, including A4 Clinical Visual Aids (LBLs), Catch Covers, Doctor Reminder Cards, Product Glossaries, and Medical Representative Bags.',
    sortOrder: 4,
  },
  {
    id: 'faq-5',
    category: 'Investment',
    question: 'What is the minimum initial investment required for a district franchise?',
    answer: 'We offer flexible initial investment brackets starting from ₹50,000 to ₹5 Lakh+ depending on the district size and selected therapeutic divisions.',
    sortOrder: 5,
  },
];

export const fallbackCertifications: ICertificationItem[] = [
  {
    id: 'who-gmp',
    title: 'WHO-GMP Certification',
    code: 'GMP/FDCA/WHO-COMPLIANT',
    issuer: 'Food and Drugs Control Administration (FDCA)',
    validUntil: 'Permanent / Ongoing Compliance',
    description: 'Certified for adherence to international World Health Organization Good Manufacturing Practices for solid orals, liquids, and topical formulations.',
  },
  {
    id: 'iso-9001',
    title: 'ISO 9001:2015 Quality Management System',
    code: 'ISO-QMS-9001',
    issuer: 'International Organization for Standardization',
    validUntil: 'Current',
    description: 'Certified QMS covering pharmaceutical design, formulation development, quality control testing, and national logistics.',
  },
  {
    id: 'glp',
    title: 'Good Laboratory Practices (GLP)',
    code: 'GLP-LAB-STABILITY',
    issuer: 'National Quality Council',
    validUntil: 'Current',
    description: 'Fully equipped analytical testing laboratory featuring modern HPLC, dissolution testing apparatus, and microbiological incubators.',
  },
  {
    id: 'schedule-m',
    title: 'Schedule M Compliance',
    code: 'SCH-M/DRUGS-COSMETICS-ACT',
    issuer: 'State Drug Regulatory Authority',
    validUntil: 'Current',
    description: 'Strict compliance with Indian Drugs & Cosmetics Act Schedule M requirements for cleanrooms, AHUs, and sterile water systems.',
  },
];

export const contentService = {
  async getPublicContentList(): Promise<ICmsItem[]> {
    try {
      const res = await request<ICmsItem[]>('/content');
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getContentByKey<T = any>(key: string): Promise<T | null> {
    try {
      const res = await request<ICmsItem>(`/content/${key}`);
      return res.data?.content as T;
    } catch {
      return null;
    }
  },

  async getAllContentAdmin(): Promise<ICmsItem[]> {
    const res = await request<ICmsItem[]>('/content/admin/all');
    return res.data || [];
  },

  async updateContent(key: string, payload: { title?: string; content: any; isActive?: boolean }): Promise<ICmsItem> {
    const res = await request<ICmsItem>(`/content/${key}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  },
};
