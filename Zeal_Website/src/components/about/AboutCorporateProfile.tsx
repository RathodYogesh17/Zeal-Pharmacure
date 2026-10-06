import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Check, ArrowRight, Package } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const AboutCorporateProfile: React.FC = () => {
  const { productCount } = useSiteSettings();
  const highlights = [
    'Third-Party WHO-GMP Sourcing',
    'Rigorous Batch Testing & Stability',
    'Authorized Stockists Distribution Exclusivity',
    'High Margin Wholesale Commercials',
  ];

  return (
    <section style={{ padding: '80px 0 60px', background: '#FAFAFC' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '48px', alignItems: 'center' }}>
          {/* Left Text */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 800, color: 'var(--zp-primary, #6828DC)', background: 'var(--zp-primary-light, #F5F3FF)', padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading, "Outfit", sans-serif)', }}>
                <Building size={13} />
                <span>Our Corporate Profile</span>
              </span>
            </div>

            <h2
              style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 900, color: '#0F172A', lineHeight: 1.25, marginBottom: '16px', fontFamily: 'var(--font-heading, "Outfit", sans-serif)', }}>
              A Reliable Pharma Marketing &amp; Supply Chain Partner Since 2010
            </h2>

            <p style={{ fontSize: '15.5px', color: '#475569', lineHeight: 1.75, marginBottom: '14px' }}>
              Operated from our centralized hub in <strong>Surat, Gujarat (7015, BTM, Sita Nagar, Parvat Patiya, Puna Gam, Surat – 395010)</strong>, <strong>Zeal Pharmacure</strong> operates as an ethical pharmaceutical marketing, authorized stockist network, and bulk distribution enterprise. We bridge the gap between world-class formulation science and healthcare delivery across India.
            </p>

            <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.75, marginBottom: '24px' }}>
              Rather than operating single manufacturing plants, we strategically contract our product lines to renowned <strong>WHO-GMP, ISO 9001:2015, and Schedule M certified production facilities</strong>. This third-party sourcing model enables us to offer an extensive catalog of {productCount}+ DCGI-certified products spanning Tablets, Capsules, Syrups, Softgels, Dry Syrups, and Injectables.
            </p>

            {/* Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '28px' }}>
              {highlights.map((point, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EDE9FE', color: 'var(--zp-primary, #6828DC)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, }}>
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B' }}>{point}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/products"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '999px', background: 'linear-gradient(135deg, #6828DC 0%, #5218B8 100%)',color: '#FFFFFF', fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '14px', fontWeight: 800,  textDecoration: 'none', boxShadow: '0 6px 18px rgba(104, 40, 220, 0.35)', }}>
                <span>Explore Therapeutic Divisions</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/contact"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 22px', borderRadius: '999px', background: '#FFFFFF', color: '#1E293B', fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '14px', fontWeight: 700, textDecoration: 'none', border: '1.5px solid #CBD5E1', }}>
                <span>Contact Central Depot</span>
              </Link>
            </div>
          </div>

          {/* Right Dual Visual Showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)', border: '3px solid #FFFFFF', background: '#FFFFFF' }}>
              <img
                src="/banners/pharma_warehouse_depot.jpg"
                alt="Zeal Pharma Surat Central Warehousing"
                style={{ width: '100%', height: '230px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Surat Central Logistics Depot (7015, BTM)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Barcoded inventory ready for same-day dispatch</div>
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '6px' }}>
                  100% In-Stock
                </span>
              </div>
            </div>

            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)', border: '3px solid #FFFFFF', background: '#FFFFFF' }}>
              <img
                src="/banners/banner_promotional_kit.jpg"
                alt="Zeal Pharma Promotional Support Kits"
                style={{ width: '100%', height: '190px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading, "Outfit", sans-serif)', fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                    Doctor Visual Aids &amp; Marketing Inputs
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>Free promotional tools provided for franchise distributors</div>
                </div>
                <Package size={20} style={{ color: '#D97706' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
