import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const Footer: React.FC = () => {
  const { settings, openFranchiseModal } = useSiteSettings();

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #1A0D33 0%, #0F0721 100%)',
      color: '#CBD5E1',
      paddingTop: '76px',
      fontSize: '14px',
      borderTop: '1px solid rgba(124, 58, 237, 0.25)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background ambient mesh */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        right: '-100px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(104, 40, 220, 0.15) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* 5-Column Executive Pharmaceutical Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
          gap: '40px',
          paddingBottom: '56px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {/* Column 1: Brand, Regulatory & Quality Statement */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                marginBottom: '16px',
              }}
            >
              <img
                src={settings.logoUrl || '/images/zeal-logo.png'}
                alt={settings.companyName || 'Zeal Pharmacure'}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  objectFit: 'contain',
                  background: '#FFFFFF',
                  padding: '2px',
                  boxShadow: '0 4px 14px rgba(104, 40, 220, 0.4)',
                  flexShrink: 0,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/zeal-logo.png';
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    letterSpacing: '-0.5px',
                    lineHeight: 1.1,
                  }}
                >
                  <span style={{ color: '#A78BFA' }}>ZEAL</span> PHARMACURE
                </div>
                <div
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                  }}
                >
                  {settings.tagline || 'A Legacy of Better Healthcare'}
                </div>
              </div>
            </Link>

            <p style={{ color: '#94A3B8', lineHeight: 1.65, marginBottom: '20px', fontSize: '13.5px' }}>
              An ISO 9001:2015 &amp; WHO-GMP compliant pharmaceutical leader offering premium Stockists Distribution Network opportunities across India.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>WHO-GMP &amp; cGMP Compliant Plant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontWeight: 600 }}>
                <Award size={16} />
                <span>ISO 9001:2015 QMS Certified</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DDD6FE' }}>
                <FileCheck size={16} />
                <span>DL No: {settings.drugLicenseNumber || '20B-123456 / 21B-123456'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginBottom: '20px', letterSpacing: '0.3px' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', padding: 0, margin: 0 }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Company' },
                { to: '/products', label: 'Pharmaceutical Catalog' },
                { to: '/career', label: 'Careers & Job Openings' },
                { to: '/contact', label: 'Contact & Branch Offices' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="zp-footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li style={{ marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={openFranchiseModal}
                  style={{
                    color: '#A78BFA',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '13.5px',
                  }}
                >
                  <Sparkles size={13} />
                  <span>Apply for Stockists Distribution</span>
                  <ArrowRight size={13} />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Products / Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginBottom: '20px', letterSpacing: '0.3px' }}>
              Therapeutic Ranges
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
                  <Link to={cat.to} className="zp-footer-link">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Important Regulatory & Quality Compliance */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginBottom: '20px', letterSpacing: '0.3px' }}>
              Quality &amp; Standards
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ color: '#94A3B8', lineHeight: 1.55 }}>
                <strong style={{ color: '#EDE9FE' }}>Schedule M Adherence:</strong> Cleanrooms, AHU filtration systems, and zero-defect packaging compliance.
              </div>
              <div style={{ color: '#94A3B8', lineHeight: 1.55 }}>
                <strong style={{ color: '#EDE9FE' }}>DCGI Approved:</strong> Bioequivalent molecules with proven bioavailability.
              </div>
              <div style={{
                marginTop: '6px',
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '12.5px',
                color: '#CBD5E1',
              }}>
                <div><strong>GSTIN:</strong> {settings.gstNumber || '24AAACZ1234F1Z5'}</div>
                <div style={{ marginTop: '4px' }}><strong>State:</strong> Gujarat, India</div>
              </div>
            </div>
          </div>

          {/* Column 5: Direct Contacts & Helplines */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginBottom: '20px', letterSpacing: '0.3px' }}>
              Corporate Inquiries
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={17} style={{ color: '#A78BFA', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#94A3B8', lineHeight: 1.5 }}>
                  7015, BTM (Bellagio Textile Market), Sita Nagar, Parvat Patiya, Puna Gam, Surat, Gujarat – 395010, India
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={17} style={{ color: '#34D399', flexShrink: 0 }} />
                <a href={`tel:${settings.phone}`} style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}>
                  {settings.phone}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={17} style={{ color: '#60A5FA', flexShrink: 0 }} />
                <a href={`mailto:${settings.email}`} style={{ color: '#94A3B8', textDecoration: 'none' }}>
                  {settings.email}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94A3B8', fontSize: '12px' }}>
                <Clock size={16} style={{ color: '#FBBF24', flexShrink: 0 }} />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Clean Copyright Bar */}
        <div style={{
          padding: '24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '12.5px',
          color: '#94A3B8',
        }}>
          <div>
            &copy; {new Date().getFullYear()} {settings.companyName || 'Zeal Pharmacure Pvt. Ltd.'}. All Rights Reserved. WHO-GMP &amp; ISO 9001:2015 Certified.
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Franchise Terms &amp; Conditions
            </Link>
            <Link to="/contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link to="/contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Pharmacovigilance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
