import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { getMediaUrl } from '../../utils/mediaUtils';
import './HomeStyles.css';

export interface HomeShowcaseCardsProps {
  onOpenFranchiseModal: () => void;
}

export const HomeShowcaseCards: React.FC<HomeShowcaseCardsProps> = ({ onOpenFranchiseModal }) => {
  const { productCount, settings } = useSiteSettings();
  const monopolyImg = getMediaUrl((settings as any)?.promoBanners?.cardMonopoly, '/banners/card_stockist_medical_green.jpg');
  const depotImg = getMediaUrl((settings as any)?.promoBanners?.warehouseDepot, '/banners/card_depot_herbal_leaf.jpg');
  return (
    <section className="zp-home-showcase-section">
      <div className="container">
        {/* Executive Section Header with Right-Side Logistics Scorecard */}
        <div className="zp-home-testimonials-header-row">
          <div>
            <div className="zp-home-testimonials-badge">
              <ShieldCheck size={13} />
              <span>Pharma Wholesale &amp; Stockist Excellence</span>
            </div>

            <h2 className="zp-home-testimonials-title">
              Direct Depot Supply &amp; <span className="highlight-gradient">Stockist Distribution</span>
            </h2>

            <p className="zp-home-testimonials-sub">
              Access computerized inventory management, authorized distribution rights, and express logistics from our Surat central warehouse.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div className="zp-home-testimonials-scorecard">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#E0F2FE',
                    border: '1px solid #BAE6FD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Truck size={18} style={{ color: '#0284C7' }} />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 900,
                      fontSize: '15px',
                      color: '#0F172A',
                    }}
                  >
                    Surat Central Depot
                  </div>
                  <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 700 }}>
                    7015, BTM Market
                  </div>
                </div>
              </div>
              <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }} />
              <div style={{ fontSize: '11.5px', color: '#475569', fontWeight: 700, lineHeight: 1.3 }}>
                <div>Pan-India Delivery</div>
                <div style={{ color: '#059669', fontSize: '10.5px' }}>Zero Stockout Guarantee</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Wide Cards Grid */}
        <div className="zp-home-showcase-grid-2col">
          {/* Card 1: Authorized District Stockist & Distribution (Emerald/Mint Theme) */}
          <div
            className="zp-home-wide-card"
            style={{
              background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #E6FFFA 100%)',
              border: '1.5px solid #A7F3D0',
            }}
          >
            <div className="zp-home-wide-content">
              <span
                className="zp-home-wide-badge"
                style={{ background: '#059669', color: '#FFFFFF' }}
              >
                <Sparkles size={12} />
                <span>AUTHORIZED STOCKIST NETWORK</span>
              </span>

              <h3
                className="zp-home-wide-title"
                style={{ color: '#064E3B' }}
              >
                Authorized District Stockist &amp; Distribution
              </h3>

              <p
                className="zp-home-wide-desc"
                style={{ color: '#047857' }}
              >
                Partner as an authorized district stockist with direct depot wholesale pricing, protected trade margins, doctor detailing visual aids, and reliable Pan-India distribution dispatch.
              </p>

              <button
                type="button"
                onClick={onOpenFranchiseModal}
                className="zp-home-wide-btn"
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                }}
              >
                <span>Apply for Stockists / Distribution</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="zp-home-wide-img-wrap">
              <img
                src={monopolyImg}
                alt="Zeal Pharmacure Monopoly Formulations and Doctor Sample Kit"
                className="zp-home-wide-img"
              />
            </div>
          </div>

          {/* Card 2: Central Logistics Depot & Formulations (Royal Purple Theme) */}
          <div
            className="zp-home-wide-card"
            style={{
              background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)',
              border: '1.5px solid #DDD6FE',
            }}
          >
            <div className="zp-home-wide-content">
              <span
                className="zp-home-wide-badge"
                style={{ background: 'var(--zp-primary, #6828DC)', color: '#FFFFFF' }}
              >
                <ShieldCheck size={12} />
                <span>CENTRAL DEPOT &amp; {productCount}+ FORMULATIONS</span>
              </span>

              <h3
                className="zp-home-wide-title"
                style={{ color: '#2E1065' }}
              >
                Surat Central Logistics Hub &amp; Bulk Supply
              </h3>

              <p
                className="zp-home-wide-desc"
                style={{ color: '#4C1D95' }}
              >
                Direct depot wholesale pricing on {productCount}+ DCGI-approved formulations in ready stock at our air-conditioned 7015 BTM depot. Computerized batch tracking with zero supply delays.
              </p>

              <Link
                to="/products"
                className="zp-home-wide-btn"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
                  boxShadow: '0 4px 14px rgba(104, 40, 220, 0.35)',
                }}
              >
                <span>Explore {productCount}+ Formulations</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="zp-home-wide-img-wrap">
              <img
                src={depotImg}
                alt="Zeal Pharmacure Surat Central Logistics Depot"
                className="zp-home-wide-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
