import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { IDashboardStats } from '../../api/dashboardService';

export interface DashboardEnterpriseBannerProps {
  stats: IDashboardStats;
  canSeeProducts: boolean;
}

export const DashboardEnterpriseBanner: React.FC<DashboardEnterpriseBannerProps> = ({
  stats,
  canSeeProducts,
}) => {
  return (
    <div
      className="stats-counter-banner"
      style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4C1D95 75%, #6828DC 100%)',
        borderRadius: '20px',
        padding: '30px 34px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 28px rgba(76, 29, 149, 0.2)',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      {/* Decorative lighting layers */}
      <div
        style={{
          position: 'absolute',
          right: '-30px',
          top: '-30px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.22) 0%, rgba(104, 40, 220, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '25%',
          bottom: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(79, 70, 229, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '560px', zIndex: 1, position: 'relative' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(8px)',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#DDD6FE',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            marginBottom: '12px',
            letterSpacing: '0.04em',
          }}
        >
          <Sparkles size={12} style={{ color: '#FDE047' }} />
          <span>ZEAL PHARMA ENTERPRISE PORTAL</span>
        </div>

        <h2
          style={{
            fontSize: '24px',
            fontWeight: 900,
            marginBottom: '8px',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            color: '#FFFFFF',
          }}
        >
          Unified Pharmaceutical Operations Console
        </h2>
        <p
          style={{
            fontSize: '13.5px',
            color: '#E9D5FF',
            lineHeight: 1.55,
            marginBottom: '20px',
          }}
        >
          Centralized management for WHO-GMP compliant formulations, distribution channels, applicant tracking, and digital media assets.
        </p>

        {canSeeProducts && (
          <Link
            to="/admin/products"
            className="btn btn-white"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '10px',
              padding: '10px 22px',
              fontSize: '13.5px',
              fontWeight: 800,
              background: '#FFFFFF',
              color: '#6828DC',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.14)';
            }}
          >
            <span>Explore Formulations</span>
            <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {/* Dynamic Mini Stats Grid */}
      <div
        className="stats-items-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(14px)',
          padding: '16px',
          borderRadius: '16px',
          border: '1.5px solid rgba(255, 255, 255, 0.18)',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            textAlign: 'center',
            minWidth: '95px',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF' }}>{stats.yearsInBusiness}+</div>
          <div style={{ fontSize: '11px', color: '#C4B5FD', fontWeight: 600, marginTop: '2px' }}>Industry Years</div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            textAlign: 'center',
            minWidth: '95px',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF' }}>{stats.totalProducts}+</div>
          <div style={{ fontSize: '11px', color: '#C4B5FD', fontWeight: 600, marginTop: '2px' }}>Formulations</div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            textAlign: 'center',
            minWidth: '95px',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF' }}>{stats.globalReach}+</div>
          <div style={{ fontSize: '11px', color: '#C4B5FD', fontWeight: 600, marginTop: '2px' }}>Districts / Reach</div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            textAlign: 'center',
            minWidth: '95px',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF' }}>{stats.happyClients}+</div>
          <div style={{ fontSize: '11px', color: '#C4B5FD', fontWeight: 600, marginTop: '2px' }}>Partners</div>
        </div>
      </div>
    </div>
  );
};
