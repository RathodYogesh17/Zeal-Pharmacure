import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { IDashboardStats } from '../../api/dashboardService';

export interface DashboardPipelineCardsProps {
  stats: IDashboardStats;
  canSeeEnquiries: boolean;
}

export const DashboardPipelineCards: React.FC<DashboardPipelineCardsProps> = ({
  stats,
  canSeeEnquiries,
}) => {
  if (!canSeeEnquiries) return null;

  const pipelineStages = [
    {
      step: '01',
      label: 'New Leads',
      count: stats.pendingEnquiries,
      pct: stats.totalEnquiries > 0 ? Math.round((stats.pendingEnquiries / stats.totalEnquiries) * 100) : 0,
      desc: 'Fresh submissions',
    },
    {
      step: '02',
      label: 'Contacted',
      count: stats.contactedEnquiries,
      pct: stats.totalEnquiries > 0 ? Math.round((stats.contactedEnquiries / stats.totalEnquiries) * 100) : 0,
      desc: 'In discussion',
    },
    {
      step: '03',
      label: 'Docs Pending',
      count: stats.documentsPendingEnquiries,
      pct: stats.totalEnquiries > 0 ? Math.round((stats.documentsPendingEnquiries / stats.totalEnquiries) * 100) : 0,
      desc: 'Drug License/GST',
    },
    {
      step: '04',
      label: 'Quoted',
      count: stats.quotedEnquiries,
      pct: stats.totalEnquiries > 0 ? Math.round((stats.quotedEnquiries / stats.totalEnquiries) * 100) : 0,
      desc: 'Rate quotation sent',
    },
    {
      step: '05',
      label: 'Approved / Closed',
      count: stats.approvedEnquiries + stats.closedEnquiries,
      pct: stats.totalEnquiries > 0 ? Math.round(((stats.approvedEnquiries + stats.closedEnquiries) / Math.max(1, stats.totalEnquiries)) * 100) : 0,
      desc: 'Converted orders',
    },
  ];

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
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <TrendingUp size={18} style={{ color: '#6828DC' }} />
            <span>Customer Inquiries & Franchise Conversion Funnel</span>
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>
            Real-time lead stages from initial submission to contract execution
          </p>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#F8FAFC',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontSize: '12px',
            fontWeight: 700,
            color: '#334155',
          }}
        >
          <span>
            Total Volume: <strong style={{ color: '#6828DC' }}>{stats.totalEnquiries} Leads</strong>
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
        }}
      >
        {pipelineStages.map((stg, i) => {
          const hasItems = stg.count > 0;
          return (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                border: `1.5px solid ${hasItems ? '#DDD6FE' : '#E2E8F0'}`,
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                transition: 'all 0.2s ease',
                boxShadow: hasItems ? '0 2px 8px rgba(104, 40, 220, 0.04)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    background: hasItems ? '#6828DC' : '#F1F5F9',
                    color: hasItems ? '#FFFFFF' : '#64748B',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '6px',
                  }}
                >
                  Step {stg.step}
                </span>
                <span
                  style={{
                    background: hasItems ? '#F5F3FF' : '#F8FAFC',
                    color: hasItems ? '#6828DC' : '#64748B',
                    border: `1px solid ${hasItems ? '#E9D5FF' : '#E2E8F0'}`,
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '6px',
                  }}
                >
                  {stg.pct}% Share
                </span>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    color: hasItems ? '#6828DC' : '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                >
                  {stg.label}
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
                  {stg.count}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '8px',
                  fontSize: '11px',
                  color: '#64748B',
                }}
              >
                <span>{stg.desc}</span>
                <strong style={{ color: hasItems ? '#6828DC' : '#94A3B8' }}>{stg.count} Leads</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
