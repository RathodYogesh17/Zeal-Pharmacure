import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, Sparkles, Building2, Users, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
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
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',  color: '#CBD5E1',  marginBottom: '24px', fontFamily: 'var(--font-heading, "Outfit", sans-serif)', }}>
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

            {/* 4 Trust Metric Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', maxWidth: '560px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', borderRadius: '16px', padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#CBD5E1', fontWeight: 700 }}>
                  <Users size={14} style={{ color: '#C4B5FD' }} />
                  <span>Team Strength</span>
                </div>
                <div style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                  23+ Staff
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', borderRadius: '16px', padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#CBD5E1', fontWeight: 700 }}>
                  <Building2 size={14} style={{ color: '#34D399' }} />
                  <span>Central Depot</span>
                </div>
                <div style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                  Surat, Gujarat
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', borderRadius: '16px', padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#CBD5E1', fontWeight: 700 }}>
                  <ShieldCheck size={14} style={{ color: '#6EE7B7' }} />
                  <span>Quality Protocol</span>
                </div>
                <div style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                  GSDP &amp; FEFO
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', borderRadius: '16px', padding: '12px 14px', border: '1px solid rgba(255, 255, 255, 0.16)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#CBD5E1', fontWeight: 700 }}>
                  <Clock size={14} style={{ color: '#FBBF24' }} />
                  <span>Dispatch Window</span>
                </div>
                <div style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '4px' }}>
                  24–48 Hours
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
