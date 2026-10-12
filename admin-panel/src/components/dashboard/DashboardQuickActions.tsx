import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Mail,
  Briefcase,
  Image,
  Palette,
  Settings,
  ArrowRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export interface DashboardQuickActionsProps {
  hasPerm: (perm: string | string[] | null) => boolean;
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({ hasPerm }) => {
  const quickActions = [
    {
      label: 'Add Product',
      desc: 'Create new formulation',
      icon: <Plus size={18} style={{ color: '#10B981' }} />,
      bg: '#ECFDF5',
      border: '#A7F3D0',
      link: '/admin/products/new',
      perm: 'product:create',
    },
    {
      label: 'View Enquiries',
      desc: 'Customer & franchise leads',
      icon: <Mail size={18} style={{ color: '#2563EB' }} />,
      bg: '#EFF6FF',
      border: '#BFDBFE',
      link: '/admin/enquiries',
      perm: ['product_enquiry:view', 'stockist_enquiry:view', 'sales_enquiry:view'],
    },
    {
      label: 'Career Apps',
      desc: 'Recruitment & candidates',
      icon: <Briefcase size={18} style={{ color: '#059669' }} />,
      bg: '#F0FDF4',
      border: '#BBF7D0',
      link: '/admin/careers',
      perm: ['job:view', 'application:view'],
    },
    {
      label: 'Manage Gallery',
      desc: 'Certificates & media',
      icon: <Image size={18} style={{ color: '#EA580C' }} />,
      bg: '#FFF7ED',
      border: '#FED7AA',
      link: '/admin/gallery',
      perm: ['gallery:view', 'media:view'],
    },
    {
      label: 'Website CMS',
      desc: 'Page content & sections',
      icon: <Palette size={18} style={{ color: '#6828DC' }} />,
      bg: '#FAF5FF',
      border: '#E9D5FF',
      link: '/admin/cms',
      perm: 'cms:view',
    },
    {
      label: 'System Settings',
      desc: 'Preferences & security',
      icon: <Settings size={18} style={{ color: '#64748B' }} />,
      bg: '#F1F5F9',
      border: '#CBD5E1',
      link: '/admin/settings',
      perm: null,
    },
  ].filter((qa) => hasPerm(qa.perm));

  return (
    <div className="dashboard-bottom-grid">
      {/* Quick Actions Grid */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Quick Actions
              </h3>
              <span
                style={{
                  background: '#F5F3FF',
                  color: '#6828DC',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '1px solid #E9D5FF',
                }}
              >
                Shortcut Hub
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Frequent Shortcuts</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '12px',
              width: '100%',
            }}
          >
            {quickActions.map((qa, idx) => (
              <Link
                key={idx}
                to={qa.link}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  minHeight: '68px',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#A78BFA';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(104, 40, 220, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: qa.bg,
                    border: `1px solid ${qa.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {qa.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0F172A',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {qa.label}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#64748B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: '2px',
                    }}
                  >
                    {qa.desc}
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: '#94A3B8', flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quality & Compliance Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.1)',
          border: '1.5px solid #1E293B',
          minHeight: '230px',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(104, 40, 220, 0.28)',
                border: '1px solid rgba(167, 139, 250, 0.35)',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#DDD6FE',
                letterSpacing: '0.04em',
              }}
            >
              <ShieldCheck size={13} style={{ color: '#A78BFA' }} />
              QUALITY & COMPLIANCE
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                color: '#10B981',
                fontWeight: 700,
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
              Verified Active
            </span>
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 800,
              lineHeight: 1.3,
              margin: '0 0 8px 0',
              color: '#FFFFFF',
            }}
          >
            WHO-GMP & ISO Certified Operations
          </h3>
          <p style={{ fontSize: '13px', color: '#CBD5E1', margin: '0 0 16px 0', lineHeight: 1.55 }}>
            Standard operating procedures for pharmaceutical formulations, batch validation, and distribution channels.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#E0E7FF',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              ✓ WHO-GMP Certified
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#E0E7FF',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              ✓ Analytical QC Verified
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#E0E7FF',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              ✓ CDSCO Guidelines
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#94A3B8',
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DDD6FE', fontWeight: 600 }}>
            <Activity size={14} style={{ color: '#8B5CF6' }} />
            <span>Pharmaceutical Quality Index</span>
          </div>
          <strong style={{ color: '#FFFFFF', fontWeight: 800 }}>99.8%</strong>
        </div>
      </div>
    </div>
  );
};
