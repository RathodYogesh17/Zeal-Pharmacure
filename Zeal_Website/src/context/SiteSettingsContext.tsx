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

const getCachedData = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(`zeal_cms_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        if (Array.isArray(fallback)) {
          return Array.isArray(parsed) && parsed.length > 0 ? (parsed as unknown as T) : fallback;
        }
        return { ...fallback, ...parsed };
      }
    }
  } catch {}
  return fallback;
};

const setCachedData = (key: string, data: any) => {
  try {
    localStorage.setItem(`zeal_cms_${key}`, JSON.stringify(data));
  } catch {}
};

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISiteSettings>(() => getCachedData('contact-info', fallbackContactInfo));
  const [banners, setBanners] = useState<IBannerItem[]>(() => getCachedData('banners', fallbackBanners));
  const [about, setAbout] = useState<IAboutContent>(() => getCachedData('about-us', fallbackAbout));
  const [faqs, setFaqs] = useState<IFaqItem[]>(() => getCachedData('faqs', fallbackFaqs));
  const [certifications, setCertifications] = useState<ICertificationItem[]>(() => getCachedData('certifications', fallbackCertifications));
  const [testimonials, setTestimonials] = useState<ITestimonialItem[]>(() => getCachedData('testimonials', fallbackTestimonials));
  const [productCount, setProductCount] = useState<number>(() => {
    try {
      const c = localStorage.getItem('zeal_product_count');
      return c ? Number(c) : 18;
    } catch {
      return 18;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);

  const refreshSettings = async () => {
    try {
      // 1. Fetch products count asynchronously in background
      productService.getProducts({ limit: 1 })
        .then((productsRes) => {
          if (productsRes && typeof productsRes.total === 'number') {
            setProductCount(productsRes.total);
            try { localStorage.setItem('zeal_product_count', String(productsRes.total)); } catch {}
          }
        })
        .catch(() => null);

      // 2. Fetch ALL CMS content in ONE fast single HTTP request
      const cmsItems = await contentService.getPublicContentList();

      if (Array.isArray(cmsItems) && cmsItems.length > 0) {
        const itemMap = new Map<string, any>();
        cmsItems.forEach((item) => {
          if (item && item.key) {
            itemMap.set(item.key, item.content);
          }
        });

        const contactData = itemMap.get('contact-info');
        if (contactData) {
          setSettings((prev) => ({ ...prev, ...contactData }));
          setCachedData('contact-info', contactData);
        }

        const bannerData = itemMap.get('banners');
        if (bannerData && Array.isArray(bannerData) && bannerData.length > 0) {
          setBanners(bannerData);
          setCachedData('banners', bannerData);
        }

        const aboutData = itemMap.get('about-us');
        if (aboutData) {
          setAbout((prev) => ({ ...prev, ...aboutData }));
          setCachedData('about-us', aboutData);
        }

        const faqData = itemMap.get('faqs');
        if (faqData?.items && Array.isArray(faqData.items)) {
          setFaqs(faqData.items);
          setCachedData('faqs', faqData.items);
        }

        const certData = itemMap.get('certifications');
        if (certData?.items && Array.isArray(certData.items)) {
          setCertifications(certData.items);
          setCachedData('certifications', certData.items);
        }

        const testData = itemMap.get('testimonials');
        if (testData && Array.isArray(testData) && testData.length > 0) {
          setTestimonials(testData);
          setCachedData('testimonials', testData);
        }
      }
    } catch (err) {
      console.warn('Failed to load CMS content, using fallbacks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('zeal_cms_')) {
        refreshSettings();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
