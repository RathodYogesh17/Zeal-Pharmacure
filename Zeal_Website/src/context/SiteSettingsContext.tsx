import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ISiteSettings, IBannerItem, IFaqItem, ICertificationItem, IAboutContent, ITestimonialItem } from '../types';
import { contentService, fallbackContactInfo, fallbackBanners, fallbackAbout, fallbackFaqs, fallbackCertifications } from '../api/contentService';
import { productService } from '../api/productService';

export const fallbackTestimonials: ITestimonialItem[] = [
  {
    id: 'rev-1',
    name: 'Dr. Amit Shah',
    role: 'Consultant Physician & Cardiologist',
    clinic: 'Apex Multispeciality Hospital, Ahmedabad',
    rating: 5,
    comment: 'Zeal Pharma formulations like Telma and Pantop have demonstrated exceptional clinical efficacy in our outpatient department. Bioavailability and batch consistency are truly unmatched.',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Rajesh V. Patel',
    role: 'Stockist Partner',
    clinic: 'Shreeji Pharma Distributors, Surat',
    rating: 5,
    comment: 'Associated with Zeal Pharma for over 4 years. The stockists distribution support is genuine, dispatch is completed within 24 hours, and promotional visual aids are highest standard.',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Dr. Sneha Kulkarni',
    role: 'Consultant Gynecologist',
    clinic: 'Mothercare Maternity Hospital, Pune',
    rating: 5,
    comment: 'Prescribing Folvite and Shelcal formulations regularly. Patients have shown zero gastrointestinal tolerance issues. Highly recommend their WHO-GMP certified therapeutics.',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'Sunil Aggarwal',
    role: 'Pharma Wholesaler & Stockist',
    clinic: 'Aggarwal Lifesciences, Jaipur',
    rating: 5,
    comment: 'Top quality Alu-Alu and blister packaging. In the pharmaceutical distribution business, brand reputation is everything, and Zeal Pharma delivers 100% on its promises.',
    verified: true,
  },
  {
    id: 'rev-5',
    name: 'Dr. Ramesh Menghrajani',
    role: 'Senior Pediatrician',
    clinic: 'Child Healthcare Clinic, Indore',
    rating: 5,
    comment: 'Calpol suspension and pediatric antibiotics are well accepted by children due to great palatable taste masking and precision dosing syringes.',
    verified: true,
  },
  {
    id: 'rev-6',
    name: 'Vikas Deshmukh',
    role: 'Authorized Stockist Partner',
    clinic: 'Sai Care Distributors, Nagpur',
    rating: 5,
    comment: 'The stockists distribution rights protected my marketing investments. Sales margins are healthy and the customer support helpline resolves queries instantly.',
    verified: true,
  },
];

interface SiteSettingsContextType {
  settings: ISiteSettings;
  banners: IBannerItem[];
  about: IAboutContent;
  faqs: IFaqItem[];
  certifications: ICertificationItem[];
  testimonials: ITestimonialItem[];
  productCount: number;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  isFranchiseModalOpen: boolean;
  openFranchiseModal: () => void;
  closeFranchiseModal: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISiteSettings>(fallbackContactInfo);
  const [banners, setBanners] = useState<IBannerItem[]>(fallbackBanners);
  const [about, setAbout] = useState<IAboutContent>(fallbackAbout);
  const [faqs, setFaqs] = useState<IFaqItem[]>(fallbackFaqs);
  const [certifications, setCertifications] = useState<ICertificationItem[]>(fallbackCertifications);
  const [testimonials, setTestimonials] = useState<ITestimonialItem[]>(fallbackTestimonials);
  const [productCount, setProductCount] = useState<number>(18);
  const [isLoading, setIsLoading] = useState(true);
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      const [contactData, bannerData, aboutData, faqData, certData, testData, productsRes] = await Promise.all([
        contentService.getContentByKey<ISiteSettings>('contact-info'),
        contentService.getContentByKey<IBannerItem[]>('banners'),
        contentService.getContentByKey<IAboutContent>('about-us'),
        contentService.getContentByKey<{ items: IFaqItem[] }>('faqs'),
        contentService.getContentByKey<{ items: ICertificationItem[] }>('certifications'),
        contentService.getContentByKey<ITestimonialItem[]>('testimonials'),
        productService.getProducts({ limit: 1 }).catch(() => null),
      ]);

      if (productsRes && typeof productsRes.total === 'number') {
        setProductCount(productsRes.total);
      }

      if (contactData) {
        setSettings(prev => ({
          ...prev,
          ...contactData,
        }));
      }

      if (bannerData && Array.isArray(bannerData) && bannerData.length > 0) {
        setBanners(bannerData);
      }

      if (aboutData) {
        setAbout(prev => ({
          ...prev,
          ...aboutData,
        }));
      }

      if (faqData?.items && Array.isArray(faqData.items)) {
        setFaqs(faqData.items);
      }

      if (certData?.items && Array.isArray(certData.items)) {
        setCertifications(certData.items);
      }

      if (testData && Array.isArray(testData) && testData.length > 0) {
        setTestimonials(testData);
      }
    } catch (err) {
      console.warn('Failed to load CMS content, using fallbacks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const openFranchiseModal = () => setIsFranchiseModalOpen(true);
  const closeFranchiseModal = () => setIsFranchiseModalOpen(false);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        banners,
        about,
        faqs,
        certifications,
        testimonials,
        productCount,
        isLoading,
        refreshSettings,
        isFranchiseModalOpen,
        openFranchiseModal,
        closeFranchiseModal,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
