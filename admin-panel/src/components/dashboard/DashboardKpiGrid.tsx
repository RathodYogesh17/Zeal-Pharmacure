import React from 'react';
import { Link } from 'react-router-dom';

export interface DashboardKpiItem {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  bg: string;
  link: string;
}

export interface DashboardKpiGridProps {
  kpis: DashboardKpiItem[];
}

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({ kpis }) => {
  return (
    <div className="dashboard-kpis-grid">
      {kpis.map((k, i) => (
        <Link key={i} to={k.link} className="dashboard-kpi-card">
          <div className="dashboard-kpi-icon" style={{ background: k.bg }}>
            {k.icon}
          </div>
          <div>
            <div className="dashboard-kpi-val">{k.value}</div>
            <div className="dashboard-kpi-label">{k.label}</div>
            {k.sublabel && (
              <div
                style={{
                  fontSize: '11px',
                  color: '#94A3B8',
                  marginTop: '3px',
                  fontWeight: 600,
                }}
              >
                {k.sublabel}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};
