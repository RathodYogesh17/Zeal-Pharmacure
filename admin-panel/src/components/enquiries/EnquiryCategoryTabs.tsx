import React from 'react';
import {
  Layers,
  Pill,
  Package,
  Building2,
  ShieldCheck,
  Warehouse,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import type { EnquiryStats } from './enquiryUtils';

export interface EnquiryCategoryTabsProps {
  pageMode: 'all' | 'product' | 'franchise' | 'career';
  stats: EnquiryStats;
  activeCategoryTab: string;
  onSelectTab: (tab: string) => void;
}

export const EnquiryCategoryTabs: React.FC<EnquiryCategoryTabsProps> = ({
  pageMode,
  stats,
  activeCategoryTab,
  onSelectTab,
}) => {
  const tabs = React.useMemo(() => {
    if (pageMode === 'product') {
      return [
        { id: 'all', label: 'All Product Leads', count: stats.totalProducts, icon: <Layers size={15} />, color: '#059669' },
        { id: 'single', label: 'Single Formulations', count: stats.productTotal, icon: <Pill size={15} />, color: '#059669' },
        { id: 'bulk', label: 'Bulk Batch Orders', count: stats.bulkTotal, icon: <Package size={15} />, color: '#2563EB' },
      ];
    }
    if (pageMode === 'franchise') {
      return [
        { id: 'all', label: 'All Territory Requests', count: stats.franchiseTotal, icon: <Building2 size={15} />, color: '#6828DC' },
        { id: 'dl_verified', label: 'DL Verified', count: stats.franchiseDlVerified, icon: <ShieldCheck size={15} />, color: '#6828DC' },
        { id: 'facility_ready', label: 'Logistics Ready', count: stats.franchiseLogisticsReady, icon: <Warehouse size={15} />, color: '#6828DC' },
      ];
    }
    if (pageMode === 'career') {
      return [
        { id: 'all', label: 'All Candidates', count: stats.careerTotal, icon: <Briefcase size={15} />, color: '#4F46E5' },
        { id: 'experienced', label: 'Experienced Talent', count: stats.careerExperienced, icon: <Briefcase size={15} />, color: '#4F46E5' },
        { id: 'freshers', label: 'Fresh Graduates', count: stats.careerFreshers, icon: <GraduationCap size={15} />, color: '#4F46E5' },
      ];
    }
    return [
      { id: 'all', label: 'All Combined Leads', count: stats.total, icon: <Layers size={15} />, color: '#6828DC' },
      { id: 'franchise', label: 'Stockist Distribution', count: stats.franchiseTotal, icon: <Building2 size={15} />, color: '#6828DC' },
      { id: 'product', label: 'Single Products', count: stats.productTotal, icon: <Pill size={15} />, color: '#6828DC' },
      { id: 'bulk', label: 'Bulk Batch Orders', count: stats.bulkTotal, icon: <Package size={15} />, color: '#6828DC' },
      { id: 'career', label: 'Careers & ATS', count: stats.careerTotal, icon: <Briefcase size={15} />, color: '#6828DC' },
    ];
  }, [pageMode, stats]);

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: '2px',
        overflowX: 'auto',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeCategoryTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: isActive ? tab.color : 'transparent',
              color: isActive ? '#FFFFFF' : '#64748B',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s ease',
            }}
          >
            {tab.icon}
            <span>
              {tab.label} ({tab.count})
            </span>
          </button>
        );
      })}
    </div>
  );
};
