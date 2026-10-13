import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, FlaskConical, Building2, ShieldCheck, Clock, Award } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { getMediaUrl } from '../../utils/mediaUtils';
import './AboutStyles.css';

export interface AboutHeroProps {
  onOpenFranchiseModal: () => void;
}

export const AboutHero: React.FC<AboutHeroProps> = ({ onOpenFranchiseModal }) => {
  const { productCount, about } = useSiteSettings();
  const heroImg = getMediaUrl((about as any)?.heroImage, '/banners/about_animated_formulations.jpg');
  return (
    <section className="zp-about-hero-wrapper" style={{ borderBottomColor: '#A78BFA' }}>
      {/* Background Purple Shade Layer */}
      <div
        className="zp-about-hero-bg-layer"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 45%, #2E1065 80%, #3B0764 100%)',
          opacity: 1,
        }}
      />

      {/* High-tech Subtle Grid Overlay */}
      <div className="zp-about-hero-grid-pattern" />

      {/* Royal Purple & Violet Ambient Radial Glows */}
      <div className="zp-about-hero-glow-layer">
        <div
          className="zp-about-hero-glow-1"
          style={{
            background: 'radial-gradient(circle, rgba(104, 40, 220, 0.35) 0%, rgba(0, 0, 0, 0) 70%)',
          }}
        />
        <div
          className="zp-about-hero-glow-2"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
        <div className="zp-about-hero-grid">
          {/* Left Column: High-Impact Concise Content (Fits comfortably in 570px banner height) */}
          <div className="zp-about-hero-left-col">
            {/* Pill Badge */}
            <div
              className="zp-about-badge"
              style={{
                color: '#DDD6FE',
                background: 'rgba(30, 27, 75, 0.75)',
                borderColor: 'rgba(139, 92, 246, 0.45)',
              }}
            >
              <Sparkles size={13} style={{ color: '#DDD6FE' }} />
              <span>Pharmaceutical Legacy &amp; Quality Excellence</span>
            </div>

            {/* Title with Royal Lavender Highlight */}
            <h1 className="zp-about-hero-title">
              Connecting High-Quality Formulations with{' '}
              <span
                className="highlight"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 50%, #A78BFA 100%)',
                }}
              >
                Trusted Healthcare Stockists
              </span>{' '}
              Across India
            </h1>

            {/* Concise Description */}
            <p className="zp-about-hero-desc">
              Zeal Pharmacure is an established pharmaceutical marketing and wholesale distribution powerhouse. We supply {productCount}+ DCGI-approved finished therapeutics backed by authorized territory monopoly rights and express 24-48h dispatch from our central depot.
            </p>

            {/* Quick Value Metric Chips */}
            <div className="zp-about-chips-row">
              <div className="zp-about-chip">
                <Building2 size={14} style={{ color: '#A78BFA' }} />
                <span>Surat Central Logistics Depot</span>
              </div>
              <div className="zp-about-chip">
                <ShieldCheck size={14} style={{ color: '#34D399' }} />
                <span>{productCount}+ DCGI Molecules</span>
              </div>
              <div className="zp-about-chip">
                <Clock size={14} style={{ color: '#FBBF24' }} />
                <span>24-48h Pan-India Dispatch</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="zp-about-actions-row">
              <button
                type="button"
                onClick={onOpenFranchiseModal}
                className="zp-about-btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6828DC 100%)',
                  boxShadow: '0 8px 24px -4px rgba(104, 40, 220, 0.65)',
                }}
              >
                <span>Apply for Stockists / Distribution</span>
                <ArrowRight size={15} />
              </button>

              <Link to="/products" className="zp-about-btn-outline">
                <FlaskConical size={15} style={{ color: '#A78BFA' }} />
                <span>Explore {productCount}+ Formulations</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Card Matching Home Page Visual Media Exact Size */}
          <div>
            <div
              className="zp-about-visual-card"
              style={{
                borderColor: 'rgba(139, 92, 246, 0.4)',
                boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.5), 0 0 35px rgba(104, 40, 220, 0.25)',
              }}
            >
              {/* Top Floating Pill Badge */}
              <div
                className="zp-about-floating-card-1"
                style={{ borderColor: '#DDD6FE' }}
              >
                <Award size={18} style={{ color: '#8B5CF6' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                    100% Monopoly Rights
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    District-Wise Exclusivity
                  </div>
                </div>
              </div>

              {/* Central Media Container with 3D Cartoon Medicine Rack Visual */}
              <div className="zp-about-visual-media">
                <img
                  src={heroImg}
                  alt="Zeal Pharmacure DCGI Approved Medicine Formulations & Therapeutics"
                  className="zp-about-card-img is-active"
                />

                <div className="zp-about-visual-overlay" />

                {/* Top Left Live Status Badge */}
                <div className="zp-about-visual-badge-top">
                  <span
                    style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981', }}/>
                  <span>Stockist Depot: Ready Inventory</span>
                </div>

                {/* Bottom Bar Info */}
                <div className="zp-about-visual-bottom-bar">
                  <div>
                    <div
                      style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)',fontSize: '13.5px', fontWeight: 800,color: '#FFFFFF',lineHeight: 1.2,}}>
                      Surat Central Logistics Depot
                    </div>
                    <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 600 }}>
                      7015, BTM Market • 24-48h Dispatch
                    </div>
                  </div>

                  <span
                    style={{ background: '#F5F3FF', color: '#6828DC',fontSize: '11px', fontWeight: 800,  padding: '4px 10px',  borderRadius: '999px', textTransform: 'uppercase',whiteSpace: 'nowrap', }}>
                    Active Hub
                  </span>
                </div>
              </div>

              {/* Bottom Floating Pill Badge */}
              <div
                className="zp-about-floating-card-2"
                style={{ borderColor: '#DDD6FE' }}
              >
                <ShieldCheck size={18} style={{ color: '#8B5CF6' }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                    {productCount}+ Ready Formulations
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    100% DCGI Approved Batch Stock
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
