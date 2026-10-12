import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Inbox,
  Briefcase,
  Image,
  ArrowRight,
  Plus,
  RefreshCw,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  Layers,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import { dashboardService } from '../api/dashboardService';
import type { IDashboardStats } from '../api/dashboardService';
import { useAuth } from '../context/AuthContext';
import { useAppSelector } from '../store';
import { selectEffectivePermissions, selectCurrentRole } from '../store/slices/authSlice';
import {
  DashboardKpiGrid,
  DashboardReminders,
  DashboardPipelineCards,
  DashboardTrendChart,
  DashboardActivityStream,
  DashboardTerritoryCatalog,
  DashboardRecentEnquiries,
  DashboardEnterpriseBanner,
  DashboardQuickActions,
  type DashboardKpiItem,
} from '../components/dashboard';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const activeRole = useAppSelector(selectCurrentRole);
  const effectivePermissions = useAppSelector(selectEffectivePermissions);

  const hasPerm = (perm: string | string[] | null) => {
    if (!perm) return true;
    if (activeRole === 'SUPER_ADMIN') return true;
    if (!effectivePermissions || effectivePermissions.length === 0) return false;
    if (effectivePermissions.includes('*')) return true;
    if (Array.isArray(perm)) {
      return perm.some((p) => effectivePermissions.includes(p));
    }
    return effectivePermissions.includes(perm);
  };

  const [stats, setStats] = useState<IDashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    totalCategories: 0,
    totalDivisions: 0,
    totalIndications: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0,
    contactedEnquiries: 0,
    documentsPendingEnquiries: 0,
    quotedEnquiries: 0,
    approvedEnquiries: 0,
    closedEnquiries: 0,
    franchiseEnquiries: 0,
    openJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    shortlistedApplications: 0,
    totalGalleryImages: 0,
    yearsInBusiness: 15,
    globalReach: 50,
    happyClients: 1000,
    recentActivities: [],
    recentEnquiries: [],
    recentApplications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    dashboardService
      .getDashboardMetrics()
      .then((res) => {
        setStats(res);
      })
      .finally(() => setLoading(false));
  };

  const canSeeProducts = hasPerm('product:view');
  const canSeeEnquiries = hasPerm(['product_enquiry:view', 'stockist_enquiry:view', 'sales_enquiry:view']);
  const canSeeCareers = hasPerm(['job:view', 'application:view']);
  const canSeeGallery = hasPerm(['gallery:view', 'media:view']);

  let dynamicKpis: DashboardKpiItem[] = [];

  if (activeRole === 'SUPER_ADMIN' || (canSeeProducts && canSeeEnquiries && canSeeCareers)) {
    dynamicKpis = [
      {
        label: 'Total Products',
        value: stats.totalProducts,
        sublabel: `${stats.activeProducts} Live • ${stats.inactiveProducts} Draft`,
        icon: <Package size={22} style={{ color: '#6828DC' }} />,
        bg: '#F5F3FF',
        link: '/admin/products',
      },
      {
        label: 'Customer Enquiries',
        value: stats.totalEnquiries,
        sublabel: `${stats.pendingEnquiries} Urgent • ${stats.documentsPendingEnquiries} Docs`,
        icon: <Inbox size={22} style={{ color: '#2563EB' }} />,
        bg: '#EFF6FF',
        link: '/admin/enquiries',
      },
      {
        label: 'Career Applications',
        value: stats.totalApplications,
        sublabel: `${stats.newApplications} New Resumes`,
        icon: <Briefcase size={22} style={{ color: '#10B981' }} />,
        bg: '#ECFDF5',
        link: '/admin/careers',
      },
      {
        label: 'Media Assets',
        value: stats.totalGalleryImages,
        sublabel: 'Approved Certificates',
        icon: <Image size={22} style={{ color: '#EA580C' }} />,
        bg: '#FFF7ED',
        link: '/admin/gallery',
      },
    ];
  } else if (canSeeEnquiries && !canSeeCareers) {
    dynamicKpis = [
      {
        label: 'Total Enquiries',
        value: stats.totalEnquiries,
        sublabel: 'Across all channels',
        icon: <Inbox size={22} style={{ color: '#2563EB' }} />,
        bg: '#EFF6FF',
        link: '/admin/enquiries',
      },
      {
        label: 'Action Required',
        value: stats.pendingEnquiries,
        sublabel: 'Awaiting first contact',
        icon: <AlertTriangle size={22} style={{ color: '#DC2626' }} />,
        bg: '#FEF2F2',
        link: '/admin/enquiries',
      },
      {
        label: 'Documents Pending',
        value: stats.documentsPendingEnquiries,
        sublabel: 'GST / Drug License check',
        icon: <FileCheck2 size={22} style={{ color: '#D97706' }} />,
        bg: '#FFFBEB',
        link: '/admin/enquiries',
      },
      {
        label: 'Active Pipeline',
        value: stats.quotedEnquiries + stats.contactedEnquiries,
        sublabel: 'Quoted & in discussion',
        icon: <TrendingUp size={22} style={{ color: '#059669' }} />,
        bg: '#ECFDF5',
        link: '/admin/enquiries',
      },
    ];
  } else if (canSeeCareers && !canSeeEnquiries) {
    dynamicKpis = [
      {
        label: 'Total Applications',
        value: stats.totalApplications,
        sublabel: 'Candidate pipeline',
        icon: <Users size={22} style={{ color: '#6828DC' }} />,
        bg: '#F5F3FF',
        link: '/admin/careers',
      },
      {
        label: 'New Resumes',
        value: stats.newApplications,
        sublabel: 'Awaiting screening',
        icon: <Briefcase size={22} style={{ color: '#2563EB' }} />,
        bg: '#EFF6FF',
        link: '/admin/careers',
      },
      {
        label: 'Shortlisted',
        value: stats.shortlistedApplications,
        sublabel: 'For Interview stage',
        icon: <CheckCircle2 size={22} style={{ color: '#10B981' }} />,
        bg: '#ECFDF5',
        link: '/admin/careers',
      },
      {
        label: 'Open Vacancies',
        value: stats.openJobs,
        sublabel: 'Active job postings',
        icon: <Layers size={22} style={{ color: '#EA580C' }} />,
        bg: '#FFF7ED',
        link: '/admin/careers',
      },
    ];
  } else {
    dynamicKpis = [
      {
        label: 'Total Formulations',
        value: stats.totalProducts,
        sublabel: 'Pharmaceutical items',
        icon: <Package size={22} style={{ color: '#6828DC' }} />,
        bg: '#F5F3FF',
        link: '/admin/products',
      },
      {
        label: 'Live Active',
        value: stats.activeProducts,
        sublabel: 'Published on portal',
        icon: <CheckCircle2 size={22} style={{ color: '#10B981' }} />,
        bg: '#ECFDF5',
        link: '/admin/products',
      },
      {
        label: 'Draft / Inactive',
        value: stats.inactiveProducts,
        sublabel: 'Requires review',
        icon: <Clock size={22} style={{ color: '#D97706' }} />,
        bg: '#FFFBEB',
        link: '/admin/products',
      },
      {
        label: 'Categories',
        value: stats.totalCategories,
        sublabel: `${stats.totalDivisions} Divisions`,
        icon: <Layers size={22} style={{ color: '#2563EB' }} />,
        bg: '#EFF6FF',
        link: '/admin/categories',
      },
    ];
  }

  return (
    <div
      className="zeal-admin-dashboard"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. ENTERPRISE OPERATIONS COMMAND CONSOLE */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '22px 28px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '18px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#475569',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10B981',
                  display: 'inline-block',
                }}
              />
              <span>Operational ERP Console</span>
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>•</span>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              WHO-GMP & CDSCO Monograph Standards
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Enterprise Operations & Command Console
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: '4px 0 0 0' }}>
            Real-time control center for formulations catalog, stockists distribution pipeline, and recruitment.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Active Profile Pill */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6828DC' }} />
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Active Profile
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                {activeRole ? activeRole.replace(/_/g, ' ') : 'Administrator'}
              </div>
            </div>
          </div>

          {/* Sync Refresh Button */}
          <button
            type="button"
            onClick={loadDashboardData}
            title="Sync Realtime ERP Data"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '10px',
              padding: '9px 14px',
              cursor: 'pointer',
              color: '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12.5px',
              fontWeight: 700,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6828DC';
              e.currentTarget.style.color = '#6828DC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#334155';
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          {/* Primary Quick Action Button */}
          {hasPerm('product:create') ? (
            <Link
              to="/admin/products/new"
              style={{
                background: '#6828DC',
                color: '#FFFFFF',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(104, 40, 220, 0.25)',
              }}
            >
              <Plus size={15} />
              <span>New Formulation</span>
            </Link>
          ) : hasPerm('stockist_enquiry:view') ? (
            <Link
              to="/admin/stockist-enquiries"
              style={{
                background: '#6828DC',
                color: '#FFFFFF',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(104, 40, 220, 0.25)',
              }}
            >
              <ArrowRight size={15} />
              <span>Stockist Pipeline</span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* 2. DYNAMIC ROLE-ADAPTIVE KPI STATS CARDS */}
      <DashboardKpiGrid kpis={dynamicKpis} />

      {/* 3. ROLE-ADAPTIVE OPERATIONAL REMINDERS & ACTION CENTER */}
      <DashboardReminders
        stats={stats}
        canSeeEnquiries={canSeeEnquiries}
        canSeeCareers={canSeeCareers}
      />

      {/* 4. LEAD CRM PIPELINE & STAGE FUNNEL */}
      <DashboardPipelineCards
        stats={stats}
        canSeeEnquiries={canSeeEnquiries}
      />

      {/* 5. DYNAMIC ANALYTICS ROW: 30-Day Visitors Wave Chart, Donut Chart & Live Recent Activities */}
      <div className="dashboard-analytics-grid">
        <DashboardTrendChart stats={stats} />
        <DashboardActivityStream activities={stats.recentActivities} />
      </div>

      {/* 6. GEOGRAPHIC TERRITORY DEMAND & FORMULATION DOSAGE BREAKDOWN */}
      <DashboardTerritoryCatalog stats={stats} />

      {/* 7. LIVE CUSTOMER INQUIRIES ACTION TABLE */}
      <DashboardRecentEnquiries
        stats={stats}
        canSeeEnquiries={canSeeEnquiries}
      />

      {/* 8. ENTERPRISE BANNER WITH REAL COMPANY STATS */}
      <DashboardEnterpriseBanner
        stats={stats}
        canSeeProducts={canSeeProducts}
      />

      {/* 9. QUICK ACTIONS & QUALITY COMPLIANCE ROW */}
      <DashboardQuickActions hasPerm={hasPerm} />
    </div>
  );
};
