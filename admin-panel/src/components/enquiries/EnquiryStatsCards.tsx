import React from 'react';
import {
  Layers,
  Pill,
  Package,
  Clock,
  Building2,
  ShieldCheck,
  Warehouse,
  Briefcase,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import type { EnquiryStats } from './enquiryUtils';

interface StatCardProps {
  label: string;
  value: number | string;
  subtext: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  active?: boolean;
  activeBorderColor?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  iconBg,
  iconColor,
  active = false,
  activeBorderColor = '#6828DC',
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      background: '#FFFFFF',
      padding: '18px 20px',
      borderRadius: '14px',
      border: active ? `2px solid ${activeBorderColor}` : '1.5px solid #E2E8F0',
      boxShadow: active ? `0 4px 14px ${activeBorderColor}26` : '0 2px 6px rgba(0,0,0,0.02)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 700,
          color: active ? activeBorderColor : '#64748B',
          textTransform: 'uppercase',
        }}
      >
        {label} {active && '●'}
      </span>
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
        }}
      >
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '26px', fontWeight: 800, color: active ? activeBorderColor : '#0F172A' }}>
      {value}
    </div>
    <span style={{ fontSize: '11.5px', color: '#64748B' }}>{subtext}</span>
  </div>
);

export interface EnquiryStatsCardsProps {
  pageMode: 'all' | 'product' | 'franchise' | 'career';
  stats: EnquiryStats;
  activeCategoryTab: string;
  onSelectTab: (tab: string) => void;
}

export const EnquiryStatsCards: React.FC<EnquiryStatsCardsProps> = ({
  pageMode,
  stats,
  activeCategoryTab,
  onSelectTab,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      {pageMode === 'product' && (
        <>
          <StatCard
            label="All Product Orders"
            value={stats.totalProducts}
            subtext="Total product requirements"
            icon={<Layers size={18} />}
            iconBg="#ECFDF5"
            iconColor="#059669"
            active={activeCategoryTab === 'all'}
            activeBorderColor="#059669"
            onClick={() => onSelectTab('all')}
          />
          <StatCard
            label="Single Formulations"
            value={stats.productTotal}
            subtext="Direct formulation quotes"
            icon={<Pill size={18} />}
            iconBg="#ECFDF5"
            iconColor="#059669"
            active={activeCategoryTab === 'single'}
            activeBorderColor="#059669"
            onClick={() => onSelectTab('single')}
          />
          <StatCard
            label="Bulk Batch Orders"
            value={stats.bulkTotal}
            subtext="Multi-item wholesale batches"
            icon={<Package size={18} />}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            active={activeCategoryTab === 'bulk'}
            activeBorderColor="#2563EB"
            onClick={() => onSelectTab('bulk')}
          />
          <StatCard
            label="New Quotes"
            value={stats.productNew}
            subtext="Awaiting sales pricing"
            icon={<Clock size={18} />}
            iconBg="#FEF3C7"
            iconColor="#B45309"
          />
        </>
      )}

      {pageMode === 'franchise' && (
        <>
          <StatCard
            label="All Stockist Requests"
            value={stats.franchiseTotal}
            subtext="Exclusive territory requests"
            icon={<Building2 size={18} />}
            iconBg="#F5F3FF"
            iconColor="#6828DC"
            active={activeCategoryTab === 'all'}
            activeBorderColor="#6828DC"
            onClick={() => onSelectTab('all')}
          />
          <StatCard
            label="Drug License Verified"
            value={stats.franchiseDlVerified}
            subtext="Pre-screened wholesalers"
            icon={<ShieldCheck size={18} />}
            iconBg="#ECFDF5"
            iconColor="#059669"
            active={activeCategoryTab === 'dl_verified'}
            activeBorderColor="#059669"
            onClick={() => onSelectTab('dl_verified')}
          />
          <StatCard
            label="Logistics Ready"
            value={stats.franchiseLogisticsReady}
            subtext="Godown & Transport ready"
            icon={<Warehouse size={18} />}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            active={activeCategoryTab === 'facility_ready'}
            activeBorderColor="#2563EB"
            onClick={() => onSelectTab('facility_ready')}
          />
          <StatCard
            label="New Territory Leads"
            value={stats.franchiseNew}
            subtext="Unprocessed franchise leads"
            icon={<Clock size={18} />}
            iconBg="#FEF3C7"
            iconColor="#B45309"
          />
        </>
      )}

      {pageMode === 'career' && (
        <>
          <StatCard
            label="All Candidates"
            value={stats.careerTotal}
            subtext="Submitted CVs & applications"
            icon={<Briefcase size={18} />}
            iconBg="#EEF2FF"
            iconColor="#4F46E5"
            active={activeCategoryTab === 'all'}
            activeBorderColor="#4F46E5"
            onClick={() => onSelectTab('all')}
          />
          <StatCard
            label="Experienced Talent"
            value={stats.careerExperienced}
            subtext="Pharma sales & QA professionals"
            icon={<Briefcase size={18} />}
            iconBg="#ECFDF5"
            iconColor="#059669"
            active={activeCategoryTab === 'experienced'}
            activeBorderColor="#059669"
            onClick={() => onSelectTab('experienced')}
          />
          <StatCard
            label="Fresh Graduates"
            value={stats.careerFreshers}
            subtext="B.Pharm / D.Pharm freshers"
            icon={<GraduationCap size={18} />}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            active={activeCategoryTab === 'freshers'}
            activeBorderColor="#2563EB"
            onClick={() => onSelectTab('freshers')}
          />
          <StatCard
            label="Shortlisted for Interview"
            value={stats.careerShortlisted}
            subtext="Active pipeline candidates"
            icon={<Sparkles size={18} />}
            iconBg="#FAF5FF"
            iconColor="#7C3AED"
          />
        </>
      )}

      {pageMode === 'all' && (
        <>
          <StatCard
            label="All Combined Leads"
            value={stats.total}
            subtext="Universal inquiries & applicants"
            icon={<Layers size={18} />}
            iconBg="#F5F3FF"
            iconColor="#6828DC"
            active={activeCategoryTab === 'all'}
            activeBorderColor="#6828DC"
            onClick={() => onSelectTab('all')}
          />
          <StatCard
            label="Stockist Distribution"
            value={stats.franchiseTotal}
            subtext="Monopoly territory requests"
            icon={<Building2 size={18} />}
            iconBg="#F5F3FF"
            iconColor="#6828DC"
            active={activeCategoryTab === 'franchise'}
            activeBorderColor="#6828DC"
            onClick={() => onSelectTab('franchise')}
          />
          <StatCard
            label="Single Products"
            value={stats.productTotal}
            subtext="Direct formulation quotes"
            icon={<Pill size={18} />}
            iconBg="#ECFDF5"
            iconColor="#059669"
            active={activeCategoryTab === 'product'}
            activeBorderColor="#059669"
            onClick={() => onSelectTab('product')}
          />
          <StatCard
            label="Bulk Batch Orders"
            value={stats.bulkTotal}
            subtext="Multi-item wholesale batches"
            icon={<Package size={18} />}
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            active={activeCategoryTab === 'bulk'}
            activeBorderColor="#2563EB"
            onClick={() => onSelectTab('bulk')}
          />
          <StatCard
            label="Career Applicants"
            value={stats.careerTotal}
            subtext="Candidate job applications"
            icon={<Briefcase size={18} />}
            iconBg="#EEF2FF"
            iconColor="#4F46E5"
            active={activeCategoryTab === 'career'}
            activeBorderColor="#4F46E5"
            onClick={() => onSelectTab('career')}
          />
        </>
      )}
    </div>
  );
};
