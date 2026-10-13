import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ISiteSettings, IBannerItem, IFaqItem, ICertificationItem, IAboutContent } from '../types';
import { contentService, fallbackContactInfo, fallbackBanners, fallbackAbout, fallbackFaqs, fallbackCertifications } from '../api/contentService';

interface SiteSettingsContextType {
  settings: ISiteSettings;
  banners: IBannerItem[];
  about: IAboutContent;
  faqs: IFaqItem[];
  certifications: ICertificationItem[];
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
  const [isLoading, setIsLoading] = useState(false);
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);

  const refreshSettings = async () => {
    try {
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
          setAbout((prev: IAboutContent) => ({ ...prev, ...aboutData }));
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
    <SiteSettingsContext.Provider value={{settings, banners, about, faqs, certifications, isLoading, refreshSettings, isFranchiseModalOpen, openFranchiseModal, closeFranchiseModal, }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {throw new Error('useSiteSettings must be used within a SiteSettingsProvider')}
  return context;
};
