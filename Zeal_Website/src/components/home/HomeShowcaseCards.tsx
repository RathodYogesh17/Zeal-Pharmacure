import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { getMediaUrl } from '../../utils/mediaUtils';
import './HomeStyles.css';

export interface HomeShowcaseCardsProps {
  onOpenFranchiseModal: () => void;
}

export const HomeShowcaseCards: React.FC<HomeShowcaseCardsProps> = ({ onOpenFranchiseModal }) => {
  const { productCount, settings } = useSiteSettings();
  const monopolyImg = getMediaUrl((settings as any)?.promoBanners?.cardMonopoly, '/banners/card_monopoly_formulations.jpg');
  const depotImg = getMediaUrl((settings as any)?.promoBanners?.warehouseDepot, '/banners/pharma_warehouse_depot.jpg');
  return (
    <section className="zp-home-showcase-section">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F5F3FF',
              border: '1px solid #DDD6FE',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--zp-primary, #6828DC)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '12px',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            }}
          >
            <ShieldCheck size={13} />
            <span>Pharma Wholesale &amp; Stockist Excellence</span>
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              fontSize: 'clamp(26px, 3.2vw, 36px)',
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1.2,
              letterSpacing: '-0.6px',
              margin: '0 0 10px 0',
            }}
          >
            Direct Factory Supply &amp; Monopoly Protection
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
              fontSize: '14.5px',
              color: '#64748B',
              margin: 0,
            }}
          >
            Built for stockists, wholesale distributors, and healthcare procurement teams seeking zero-conflict supply.
          </p>
        </div>

        {/* 2 Wide Cards Grid */}
        <div className="zp-home-showcase-grid-2col">
          {/* Card 1: Exclusive Territory Monopoly Rights (Emerald/Mint Theme) */}
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
                <span>STOCKIST TERRITORY MONOPOLY</span>
              </span>

              <h3
                className="zp-home-wide-title"
                style={{ color: '#064E3B' }}
              >
                Exclusive Territory Monopoly Rights
              </h3>

              <p
                className="zp-home-wide-desc"
                style={{ color: '#047857' }}
              >
                Secure guaranteed market monopoly for your district with zero internal competition, protected wholesale profit margins, free doctor visual aids, and express 24-48h dispatch.
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
                <span>Apply For Stockist Monopoly</span>
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
                Direct factory pricing on {productCount}+ DCGI-approved formulations in ready stock at our air-conditioned 7015 BTM depot. Computerized batch tracking with zero supply delays.
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
