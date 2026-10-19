import React, { useEffect } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { PreFooterBanner } from '../components/layout/PreFooterBanner';
import { StatsBar } from '../components/common';
import {
  AboutHero,
  AboutCorporateProfile,
  AboutMissionVision,
  AboutPillars,
  AboutTimeline,
  AboutLeadership,
  AboutCertifications,
} from '../components/about';

export const AboutPage: React.FC = () => {
  const { about, openFranchiseModal } = useSiteSettings();

  useEffect(() => {
    document.title = 'About Us | Zeal Pharmacure - Legacy & Quality Excellence';
  }, []);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#0F172A' }}>
      {/* 1. Hero Header */}
      <AboutHero onOpenFranchiseModal={openFranchiseModal} />

      {/* 2. Floating Distribution Stats Bar */}
      <StatsBar variant="inline" />

      {/* 3. Corporate Profile: "Who We Are" */}
      <AboutCorporateProfile />

      {/* 4. Mission & Vision */}
      <AboutMissionVision mission={about?.mission} vision={about?.vision} />

      {/* 5. The 4 Pillars of Zeal Distribution Excellence */}
      <AboutPillars />

      {/* 6. Growth Milestones Interactive Snake Timeline (2010 – 2026) */}
      <AboutTimeline />

      {/* 7. Leadership & Managing Director's Perspective */}
      <AboutLeadership
        directorMessage={about?.directorMessage}
        directorName={about?.directorName}
        directorTitle={about?.directorTitle}
      />

      {/* 8. Certifications & Regulatory Accreditations */}
      <AboutCertifications />

      {/* 9. Pre-Footer Monopoly Franchise Call to Action */}
      <PreFooterBanner />
    </div>
  );
};
