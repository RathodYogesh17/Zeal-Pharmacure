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

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISiteSettings>(fallbackContactInfo);
  const [banners, setBanners] = useState<IBannerItem[]>(fallbackBanners);
  const [about, setAbout] = useState<IAboutContent>(fallbackAbout);
  const [faqs, setFaqs] = useState<IFaqItem[]>(fallbackFaqs);
  const [certifications, setCertifications] = useState<ICertificationItem[]>(fallbackCertifications);
  const [isLoading, setIsLoading] = useState(true);
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      const [contactData, bannerData, aboutData, faqData, certData] = await Promise.all([
        contentService.getContentByKey<ISiteSettings>('contact-info'),
        contentService.getContentByKey<IBannerItem[]>('banners'),
        contentService.getContentByKey<IAboutContent>('about-us'),
        contentService.getContentByKey<{ items: IFaqItem[] }>('faqs'),
        contentService.getContentByKey<{ items: ICertificationItem[] }>('certifications'),
      ]);

      if (contactData) {
        setSettings(prev => ({ ...prev, ...contactData, }));
      }

      if (bannerData && Array.isArray(bannerData) && bannerData.length > 0) {
        setBanners(bannerData);
      }

      if (aboutData) {
        setAbout((prev: IAboutContent) => ({ ...prev, ...aboutData, }));
      }

      if (faqData?.items && Array.isArray(faqData.items)) {
        setFaqs(faqData.items);
      }

      if (certData?.items && Array.isArray(certData.items)) {
        setCertifications(certData.items);
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
