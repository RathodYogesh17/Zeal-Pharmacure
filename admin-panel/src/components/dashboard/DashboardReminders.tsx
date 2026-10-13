import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Briefcase, ChevronRight } from 'lucide-react';
import type { IDashboardStats } from '../../api/dashboardService';

export interface DashboardRemindersProps {
  stats: IDashboardStats;
  canSeeEnquiries: boolean;
  canSeeCareers: boolean;
}

export const DashboardReminders: React.FC<DashboardRemindersProps> = ({
  stats,
  canSeeEnquiries,
  canSeeCareers,
}) => {
  if (!canSeeEnquiries && !canSeeCareers) return null;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E2E8F0',
        padding: '22px 24px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#6828DC',
              boxShadow: '0 0 0 4px rgba(104, 40, 220, 0.15)',
            }}
          />
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Urgent Operational Reminders & Action Center
          </h3>
          <span
            style={{
              background: '#F5F3FF',
              color: '#6828DC',
              border: '1px solid #DDD6FE',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            Action Required
          </span>
        </div>
        <span style={{ fontSize: '12px', color: '#64748B' }}>
          Live departmental reminders for your assigned role
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Reminder Item 1: Enquiries Pending Response */}
        {canSeeEnquiries && (
          <div
            style={{
              background: '#FFFFFF',
              border: `1.5px solid ${stats.pendingEnquiries > 0 ? '#DDD6FE' : '#E2E8F0'}`,
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              transition: 'all 0.2s ease',
              boxShadow: stats.pendingEnquiries > 0 ? '0 2px 8px rgba(104, 40, 220, 0.04)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#F5F3FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6828DC',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {stats.pendingEnquiries} Unanswered Leads
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    Awaiting initial WhatsApp or phone outreach
                  </div>
                </div>
              </div>
              <span
                style={{
                  background: stats.pendingEnquiries > 0 ? '#6828DC' : '#F1F5F9',
                  color: stats.pendingEnquiries > 0 ? '#FFFFFF' : '#64748B',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {stats.pendingEnquiries > 0 ? 'Urgent' : 'All Clear'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>Target response: &lt;2 hours</span>
              <Link
                to="/admin/enquiries"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#6828DC',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                }}
              >
                <span>Attend Leads</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* Reminder Item 2: Documents Verification Pending */}
        {canSeeEnquiries && (
          <div
            style={{
              background: '#FFFFFF',
              border: `1.5px solid ${stats.documentsPendingEnquiries > 0 ? '#DDD6FE' : '#E2E8F0'}`,
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              transition: 'all 0.2s ease',
              boxShadow: stats.documentsPendingEnquiries > 0 ? '0 2px 8px rgba(104, 40, 220, 0.04)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#F5F3FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6828DC',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {stats.documentsPendingEnquiries} Franchise / Bulk Docs
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    Awaiting Drug License or GST compliance check
                  </div>
                </div>
              </div>
              <span
                style={{
                  background: stats.documentsPendingEnquiries > 0 ? '#6828DC' : '#F1F5F9',
                  color: stats.documentsPendingEnquiries > 0 ? '#FFFFFF' : '#64748B',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                Compliance
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>Stockists / Distribution & Bulk Verification</span>
              <Link
                to="/admin/stockist-enquiries"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#6828DC',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                }}
              >
                <span>Verify Files</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* Reminder Item 3: New Resumes to Screen */}
        {canSeeCareers && (
          <div
            style={{
              background: '#FFFFFF',
              border: `1.5px solid ${stats.newApplications > 0 ? '#DDD6FE' : '#E2E8F0'}`,
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              transition: 'all 0.2s ease',
              boxShadow: stats.newApplications > 0 ? '0 2px 8px rgba(104, 40, 220, 0.04)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#F5F3FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6828DC',
                    flexShrink: 0,
                  }}
                >
                  <Briefcase size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {stats.newApplications} New Job Applications
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    Unscreened candidate profiles & CVs
                  </div>
                </div>
              </div>
              <span
                style={{
                  background: stats.newApplications > 0 ? '#6828DC' : '#F1F5F9',
                  color: stats.newApplications > 0 ? '#FFFFFF' : '#64748B',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                HR Review
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>{stats.shortlistedApplications} Shortlisted currently</span>
              <Link
                to="/admin/careers"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#6828DC',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                }}
              >
                <span>Review Resumes</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
