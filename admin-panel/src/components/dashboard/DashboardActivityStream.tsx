import React, { useState } from 'react';
import { Clock, Pill, Mail, Briefcase, Star } from 'lucide-react';
import type { IDashboardActivity } from '../../api/dashboardService';

export interface DashboardActivityStreamProps {
  activities: IDashboardActivity[];
}

export const DashboardActivityStream: React.FC<DashboardActivityStreamProps> = ({ activities }) => {
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'ENQUIRY' | 'PRODUCT' | 'APPLICATION' | 'REVIEW'>('ALL');

  const formatRelativeTime = (dateVal: string | Date | undefined) => {
    if (!dateVal) return 'Just now';
    try {
      const diffSec = Math.floor((Date.now() - new Date(dateVal).getTime()) / 1000);
      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (activityFilter === 'ALL') return true;
    return act.type === activityFilter;
  });

  return (
    <div className="dashboard-analytics-card" style={{ justifyContent: 'flex-start' }}>
      {/* Header with Live Pulse */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          flexShrink: 0,
        }}
      >
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Recent Activities
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>
            Audit trail across products & inquiries
          </p>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#F5F3FF',
            color: '#6828DC',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 800,
            border: '1px solid #E9D5FF',
            flexShrink: 0,
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
          Live Log
        </div>
      </div>

      {/* Activity Filters */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          paddingBottom: '4px',
          marginBottom: '10px',
          flexShrink: 0,
        }}
      >
        {[
          { id: 'ALL', label: 'All' },
          { id: 'ENQUIRY', label: 'Inquiries' },
          { id: 'PRODUCT', label: 'Products' },
          { id: 'APPLICATION', label: 'Careers' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActivityFilter(f.id as any)}
            style={{
              border: 'none',
              background: activityFilter === f.id ? '#6828DC' : '#F1F5F9',
              color: activityFilter === f.id ? '#FFFFFF' : '#475569',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activity List Container */}
      <div
        className="dashboard-activity-list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {filteredActivities.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
              fontSize: '13px',
              padding: '24px 0',
            }}
          >
            <Clock size={28} style={{ color: '#CBD5E1', marginBottom: '8px' }} />
            <span>No activities found for this filter</span>
          </div>
        ) : (
          filteredActivities.map((act) => {
            let icon = <Clock size={16} style={{ color: '#6828DC' }} />;
            let badgeBg = '#FAF5FF';
            let badgeBorder = '#E9D5FF';
            let typeLabel = 'System';

            if (act.type === 'PRODUCT') {
              icon = <Pill size={16} style={{ color: '#059669' }} />;
              badgeBg = '#ECFDF5';
              badgeBorder = '#A7F3D0';
              typeLabel = 'Product';
            } else if (act.type === 'ENQUIRY') {
              icon = <Mail size={16} style={{ color: '#2563EB' }} />;
              badgeBg = '#EFF6FF';
              badgeBorder = '#BFDBFE';
              typeLabel = 'Inquiry';
            } else if (act.type === 'APPLICATION') {
              icon = <Briefcase size={16} style={{ color: '#D97706' }} />;
              badgeBg = '#FFFBEB';
              badgeBorder = '#FDE68A';
              typeLabel = 'Career';
            } else if (act.type === 'REVIEW') {
              icon = <Star size={16} style={{ color: '#EA580C' }} />;
              badgeBg = '#FFF7ED';
              badgeBorder = '#FFEDD5';
              typeLabel = 'Review';
            }

            return (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#F1F5F9';
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: badgeBg,
                    border: `1px solid ${badgeBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>

                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#0F172A',
                        fontSize: '12.5px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1,
                        minWidth: 0,
                      }}
                      title={act.title}
                    >
                      {act.title}
                    </span>
                    {act.status && (
                      <span
                        style={{
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: '#EDE9FE',
                          color: '#6828DC',
                          fontWeight: 700,
                          fontSize: '10px',
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {act.status}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '3px',
                      fontSize: '11px',
                      color: '#64748B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#334155', flexShrink: 0 }}>
                      {typeLabel}
                    </span>
                    <span style={{ flexShrink: 0 }}>•</span>
                    <span style={{ flexShrink: 0 }}>
                      {formatRelativeTime(act.updatedAt || act.createdAt)}
                    </span>
                    {act.meta && (
                      <>
                        <span style={{ flexShrink: 0 }}>•</span>
                        <span
                          style={{
                            color: '#475569',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {act.meta}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
