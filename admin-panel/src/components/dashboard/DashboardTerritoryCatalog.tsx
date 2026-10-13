import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Pill, CheckCircle2 } from 'lucide-react';
import type { IDashboardStats } from '../../api/dashboardService';

export interface DashboardTerritoryCatalogProps {
  stats: IDashboardStats;
}

export const DashboardTerritoryCatalog: React.FC<DashboardTerritoryCatalogProps> = ({ stats }) => {
  const rawStates = stats.enquiryBreakdowns?.byTopStates || [];
  const normalizedMap = new Map<string, number>();
  rawStates.forEach((st) => {
    if (st.state) {
      const cleaned = st.state
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      normalizedMap.set(cleaned, (normalizedMap.get(cleaned) || 0) + st.count);
    }
  });
  const topStates = Array.from(normalizedMap.entries())
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '22px',
        width: '100%',
      }}
    >
      {/* Left: State-wise Geographic Lead Demand */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} style={{ color: '#6828DC' }} />
                <span>State & Territory Demand</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>
                High-inquiry regions across India distribution network
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6828DC', background: '#F5F3FF', border: '1px solid #E9D5FF', padding: '3px 8px', borderRadius: '6px' }}>
              {topStates.length} Active Regions
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {topStates.slice(0, 5).map((st, idx) => {
              const isTop = idx === 0;
              return (
                <div
                  key={idx}
                  style={{
                    background: isTop ? 'linear-gradient(135deg, #FAF7FF 0%, #F5F3FF 100%)' : '#F8FAFC',
                    border: `1.5px solid ${isTop ? '#DDD6FE' : '#E2E8F0'}`,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: isTop ? '#6828DC' : '#EDE9FE',
                        color: isTop ? '#FFFFFF' : '#6828DC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 800,
                      }}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{st.state}</span>
                        {isTop && (
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#6828DC', background: '#EDE9FE', padding: '1px 6px', borderRadius: '4px' }}>
                            Primary Hub
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                        Exclusive Monopoly & Stockists / Distribution Requests
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        background: isTop ? '#6828DC' : '#EDE9FE',
                        color: isTop ? '#FFFFFF' : '#6828DC',
                        fontSize: '12px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {st.count} {st.count === 1 ? 'Lead' : 'Leads'}
                    </span>
                  </div>
                </div>
              );
            })}
            {topStates.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px', padding: '24px 0' }}>
                No geographic distribution data recorded yet.
              </div>
            )}
          </div>

          {/* Territory Intelligence Summary Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '14px' }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Monopoly Status</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669', marginTop: '2px' }}>Active Allotment</div>
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Logistics Reach</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#6828DC', marginTop: '2px' }}>All 28 States</div>
            </div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>HQ Dispatch Hub</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>Ahmedabad, GJ</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F1F5F9', marginTop: '18px', fontSize: '12px', color: '#64748B' }}>
          <span>Pan-India Stockists / Distribution</span>
          <Link
            to="/admin/stockist-enquiries"
            style={{
              color: '#6828DC',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{stats.globalReach}+ Stockist Target Territories →</span>
          </Link>
        </div>
      </div>

      {/* Right: Formulation Dosage Breakdown & Compliance Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '22px 24px',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pill size={18} style={{ color: '#6828DC' }} />
                <span>Formulation Dosage Forms & Categories</span>
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>
                Therapeutic formulation delivery systems & active lines
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '6px' }}>
              {Math.round((stats.activeProducts / Math.max(1, stats.totalProducts)) * 100)}% Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '8px', marginTop: '14px' }}>
            {(stats.productBreakdowns?.byDosageForm || []).map((df, idx) => (
              <div
                key={idx}
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6828DC', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {df.dosageForm || 'Tablets'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#6828DC', background: '#EDE9FE', padding: '2px 7px', borderRadius: '5px', flexShrink: 0 }}>
                  {df.count}
                </span>
              </div>
            ))}
            {(!stats.productBreakdowns?.byDosageForm || stats.productBreakdowns.byDosageForm.length === 0) && (
              <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px', padding: '20px 0', width: '100%' }}>
                Standard Dosage forms: Tablets, Capsules, Syrups, Suspensions, Injections
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: '16px',
              background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
              borderRadius: '12px',
              padding: '13px 16px',
              border: '1.5px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: '#D1FAE5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#065F46' }}>
                  Catalog Integrity: 100% Verified
                </div>
                <div style={{ fontSize: '11.5px', color: '#047857', marginTop: '2px' }}>
                  {stats.activeProducts} of {stats.totalProducts} Verified Lines • WHO-GMP & CDSCO Standard
                </div>
              </div>
            </div>
            <span
              style={{
                background: '#059669',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '6px',
                flexShrink: 0,
              }}
            >
              Compliant
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #F1F5F9', marginTop: '18px', fontSize: '12px', color: '#64748B' }}>
          <span>{stats.totalCategories} Categories & {stats.totalDivisions} Divisions</span>
          <Link to="/admin/products" style={{ color: '#6828DC', fontWeight: 700, textDecoration: 'none' }}>
            View Catalog →
          </Link>
        </div>
      </div>
    </div>
  );
};
