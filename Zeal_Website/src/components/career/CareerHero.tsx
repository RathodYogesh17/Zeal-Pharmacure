import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, Sparkles, Building2, Users, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import './CareerStyles.css';

export interface CareerHeroProps {
  totalJobs: number;
}

export const CareerHero: React.FC<CareerHeroProps> = ({ totalJobs }) => {
  return (
    <section className="zp-career-hero-wrapper">
      {/* Background Ambient Glows */}
      <div className="zp-career-hero-glow-1" />
      <div className="zp-career-hero-glow-2" />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Breadcrumb Navigation */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',  color: '#CBD5E1',  marginBottom: '28px', fontFamily: 'var(--font-heading, "Outfit", sans-serif)', }}>
          <Link to="/" style={{ color: '#E9D5FF', textDecoration: 'none', fontWeight: 600 }}>
            Home
          </Link>
          <ChevronRight size={14} color="#94A3B8" />
          <span style={{ color: '#CBD5E1' }}>Company</span>
          <ChevronRight size={14} color="#94A3B8" />
          <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Careers &amp; Opportunities</span>
        </nav>

        <div className="zp-career-hero-grid">
          {/* Left Text Column */}
          <div>
            <div className="zp-career-badge">
              <Sparkles size={14} style={{ color: '#A7F3D0' }} />
              <span>Careers at Zeal Pharmacure</span>
            </div>

            <h1 className="zp-career-hero-title">
              Pharmaceutical Wholesale &amp; <span className="highlight">Stockist Distribution</span> Careers
            </h1>

            <p className="zp-career-hero-desc">
              Join our team of dedicated supply-chain professionals, registered pharmacists, warehouse, and logistics specialists at our Surat Central Distribution Depot. We procure bulk medicines directly from accredited pharma manufacturers and reliably deliver to pharmacies, clinics, and hospitals nationwide.
            </p>

            {/* 4 Trust Metric Cards (Redesigned 2x2 Glassmorphic Bento Cards) */}
            <div className="zp-career-stats-grid">
              <div className="zp-career-stat-card zp-career-stat-card-purple">
                <div className="zp-career-stat-icon-wrap zp-career-stat-icon-purple">
                  <Users size={20} />
                </div>
                <div className="zp-career-stat-info">
                  <span className="zp-career-stat-label zp-career-label-purple">Team Strength</span>
                  <span className="zp-career-stat-val">23+ Staff Members</span>
                  <span className="zp-career-stat-sub">Pharma &amp; Logistics Team</span>
                </div>
              </div>

              <div className="zp-career-stat-card zp-career-stat-card-emerald">
                <div className="zp-career-stat-icon-wrap zp-career-stat-icon-emerald">
                  <Building2 size={20} />
                </div>
                <div className="zp-career-stat-info">
                  <span className="zp-career-stat-label zp-career-label-emerald">Central Depot Hub</span>
                  <span className="zp-career-stat-val">Surat, Gujarat</span>
                  <span className="zp-career-stat-sub">Primary Wholesale Godown</span>
                </div>
              </div>

              <div className="zp-career-stat-card zp-career-stat-card-cyan">
                <div className="zp-career-stat-icon-wrap zp-career-stat-icon-cyan">
                  <ShieldCheck size={20} />
                </div>
                <div className="zp-career-stat-info">
                  <span className="zp-career-stat-label zp-career-label-cyan">Quality Protocol</span>
                  <span className="zp-career-stat-val">GSDP &amp; FEFO</span>
                  <span className="zp-career-stat-sub">Certified Storage Standards</span>
                </div>
              </div>

              <div className="zp-career-stat-card zp-career-stat-card-amber">
                <div className="zp-career-stat-icon-wrap zp-career-stat-icon-amber">
                  <Truck size={20} />
                </div>
                <div className="zp-career-stat-info">
                  <span className="zp-career-stat-label zp-career-label-amber">Distribution Reach</span>
                  <span className="zp-career-stat-val">Pan-India Delivery</span>
                  <span className="zp-career-stat-sub">Gujarat &amp; Interstate Network</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Spotlight Card */}
          <div>
            <div className="zp-career-spotlight-card">
              <div className="zp-career-spotlight-icon">
                <Briefcase size={28} />
              </div>

              <div className="zp-career-spotlight-number">
                {totalJobs > 0 ? `${totalJobs}+ Openings` : 'Direct Hiring'}
              </div>

              <p className="zp-career-spotlight-sub">
                {totalJobs > 0
                  ? 'Current verified career vacancies across our distribution, accounts, and pharmacist divisions.'
                  : 'Submit your profile directly to our Talent Acquisition team for department allocations and upcoming expansions.'}
              </p>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <a href="#openings"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 24px', borderRadius: '999px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6828DC 100%)', color: '#FFFFFF', fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '13.5px',  fontWeight: 800, textDecoration: 'none',  boxShadow: '0 4px 16px rgba(104, 40, 220, 0.45)',}}>
                  <span>View Available Positions</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
