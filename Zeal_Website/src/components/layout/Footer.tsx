import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const Footer: React.FC = () => {
  const { settings, openFranchiseModal } = useSiteSettings();

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #130826 0%, #080312 100%)',
        color: '#CBD5E1',
        paddingTop: '68px',
        fontSize: '14px',
        borderTop: '1px solid rgba(139, 92, 246, 0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top illuminated line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '5%',
          right: '5%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(167, 139, 250, 0.7), transparent)',
        }}
      />

      {/* Subtle ambient purple glow */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '-60px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(104, 40, 220, 0.16) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '-80px',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* 4-Column Balanced Pharma Executive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: 'clamp(28px, 4vw, 44px)',
            paddingBottom: '52px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Column 1: Brand Identity & Trust */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                textDecoration: 'none',
                marginBottom: '14px',
              }}
            >
              {/* Logo Emblem Badge */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 18px rgba(104, 40, 220, 0.4)',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  flexShrink: 0,
                }}
              >
                <img
                  src={settings.logoUrl || '/images/zeal-logo.png'}
                  alt={settings.companyName || 'Zeal Pharmacure'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/zeal-logo.png';
                  }}
                />
              </div>

              {/* Brand Typography Lockup */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    fontSize: '22px',
                    fontWeight: 900,
                    letterSpacing: '-0.3px',
                    lineHeight: 1.15,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ZEAL
                  </span>
                  <span style={{ color: '#FFFFFF' }}>PHARMACURE</span>
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1.2px',
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    marginTop: '3px',
                  }}
                >
                  {settings.tagline || 'A Legacy of Better Healthcare'}
                </div>
              </div>
            </Link>

            <p
              style={{
                color: '#94A3B8',
                lineHeight: 1.6,
                margin: '0 0 16px 0',
                fontSize: '13.5px',
                maxWidth: '380px',
              }}
            >
              An ISO 9001:2015 &amp; WHO-GMP certified pharmaceutical enterprise delivering research-backed therapeutics and verified Stockists / Distribution opportunities across India.
            </p>

            {/* Quality Accreditations Badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '18px',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 9px',
                  borderRadius: '6px',
                  background: 'rgba(104, 40, 220, 0.16)',
                  border: '1px solid rgba(139, 92, 246, 0.28)',
                  color: '#DDD6FE',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={12} style={{ color: '#A78BFA' }} />
                <span>WHO-GMP Certified</span>
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 9px',
                  borderRadius: '6px',
                  background: 'rgba(104, 40, 220, 0.16)',
                  border: '1px solid rgba(139, 92, 246, 0.28)',
                  color: '#DDD6FE',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <Award size={12} style={{ color: '#A78BFA' }} />
                <span>ISO 9001:2015</span>
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 9px',
                  borderRadius: '6px',
                  background: 'rgba(104, 40, 220, 0.16)',
                  border: '1px solid rgba(139, 92, 246, 0.28)',
                  color: '#DDD6FE',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={12} style={{ color: '#A78BFA' }} />
                <span>FDCA Compliant</span>
              </span>
            </div>

            {/* Partnership CTA Button */}
            <div>
              <button
                type="button"
                onClick={openFranchiseModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(104, 40, 220, 0.35)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(104, 40, 220, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(104, 40, 220, 0.35)';
                }}
              >
                <Sparkles size={14} style={{ color: '#FDE047' }} />
                <span>Apply for Stockists / Distribution</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 800,
                marginBottom: '18px',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '4px', height: '14px', borderRadius: '2px', background: '#8B5CF6' }} />
              <span>Quick Navigation</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', padding: 0, margin: 0 }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Company' },
                { to: '/products', label: 'Pharmaceutical Catalog' },
                { to: '/career', label: 'Careers & Openings' },
                { to: '/contact', label: 'Contact & Branch Offices' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="zp-footer-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      fontSize: '13.5px',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ color: '#8B5CF6', opacity: 0.7, fontSize: '11px' }}>›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Therapeutic Ranges */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 800,
                marginBottom: '18px',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '4px', height: '14px', borderRadius: '2px', background: '#8B5CF6' }} />
              <span>Therapeutic Ranges</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', padding: 0, margin: 0 }}>
              {[
                { to: '/products?category=cardiology', label: 'Cardiology Formulations' },
                { to: '/products?category=orthopedic', label: 'Orthopedic & Pain Relief' },
                { to: '/products?category=diabetology', label: 'Diabetology Care' },
                { to: '/products?category=dermatology', label: 'Dermatological Topicals' },
                { to: '/products?category=gastroenterology', label: 'Gastroenterology' },
                { to: '/products?category=general-medicine', label: 'General Medicine' },
              ].map((cat) => (
                <li key={cat.to}>
                  <Link
                    to={cat.to}
                    className="zp-footer-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      fontSize: '13.5px',
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ color: '#8B5CF6', opacity: 0.7, fontSize: '11px' }}>›</span>
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Corporate Headquarters & Helplines */}
          <div>
            <h4
              style={{
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 800,
                marginBottom: '18px',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '4px', height: '14px', borderRadius: '2px', background: '#8B5CF6' }} />
              <span>Corporate Inquiries</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '13px', fontSize: '13px' }}>
              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: 'rgba(104, 40, 220, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#A78BFA',
                    marginTop: '2px',
                  }}
                >
                  <MapPin size={15} />
                </div>
                <span style={{ color: '#94A3B8', lineHeight: 1.5, fontSize: '13px' }}>
                  {settings.headOfficeAddress || '7015, BTM (Bellagio Textile Market), Sita Nagar, Parvat Patiya, Puna Gam, Surat, Gujarat – 395010, India'}
                </span>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#34D399',
                  }}
                >
                  <Phone size={15} />
                </div>
                <a
                  href={`tel:${settings.phone || '+919909160190'}`}
                  style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}
                >
                  {settings.phone || '+91 9909160190'}
                </a>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#60A5FA',
                  }}
                >
                  <Mail size={15} />
                </div>
                <a
                  href={`mailto:${settings.email || 'zealpharmacure@gmail.com'}`}
                  style={{ color: '#CBD5E1', textDecoration: 'none', fontSize: '13px' }}
                >
                  {settings.email || 'zealpharmacure@gmail.com'}
                </a>
              </div>

              {/* Working Hours (only if explicitly configured in CMS) */}
              {settings.workingHours ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#FBBF24',
                    }}
                  >
                    <Clock size={15} />
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '12.5px' }}>
                    {settings.workingHours}
                  </span>
                </div>
              ) : null}

              {/* Compact GST verification badge */}
              <div
                style={{
                  marginTop: '4px',
                  padding: '7px 11px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '7px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  fontSize: '11.5px',
                  color: '#94A3B8',
                  width: 'fit-content',
                }}
              >
                <span style={{ color: '#A78BFA', fontWeight: 800 }}>GSTIN:</span>
                <span style={{ color: '#E2E8F0', letterSpacing: '0.4px' }}>
                  {settings.gstNumber || '24AAACZ1234F1Z5'}
                </span>
                <span style={{ color: '#64748B' }}>• Gujarat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Copyright & Regulatory Sub-Bar */}
        <div
          style={{
            padding: '22px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '12.5px',
            color: '#64748B',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()}{' '}
            <strong style={{ color: '#CBD5E1', fontWeight: 700 }}>
              {settings.companyName || 'Zeal Pharmacure Pvt. Ltd.'}
            </strong>
            . All Rights Reserved. WHO-GMP &amp; ISO 9001:2015 Compliant.
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link
              to="/contact"
              style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#EDE9FE')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Franchise Terms
            </Link>
            <Link
              to="/contact"
              style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#EDE9FE')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              style={{ color: '#94A3B8', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#EDE9FE')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Pharmacovigilance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
