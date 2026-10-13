import React from 'react';
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  Warehouse,
  Pill,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { getMediaUrl } from '../../utils/mediaUtils';
import './ContactStyles.css';

export interface ContactHeroProps {
  onOpenFranchise: () => void;
  onScrollToForm: () => void;
}

export const ContactHero: React.FC<ContactHeroProps> = ({ onOpenFranchise, onScrollToForm }) => {
  const { settings, about, productCount } = useSiteSettings();
  const depotImg = getMediaUrl((settings as any)?.promoBanners?.warehouseDepot || (about as any)?.depotImage, '/banners/pharma_warehouse_depot.jpg');
  const corporatePhone = settings.phone || '+91 9909160190';
  const cleanPhone = corporatePhone.replace(/[^0-9]/g, '');

  return (
    <section className="zp-contact-hero">
      <div className="zp-contact-hero-glow-1" />
      <div className="zp-contact-hero-glow-2" />

      <div className="container">
        <div className="zp-contact-hero-grid">
          {/* Left Column: Heading, Info, Stats & CTAs */}
          <div className="zp-contact-hero-left">
            <div className="zp-contact-hero-badge">
              <ShieldCheck size={16} style={{ color: '#34D399' }} />
              <span>WHO-GMP DIRECT CORPORATE &amp; STOCKIST HUB</span>
            </div>

            <h1 className="zp-contact-hero-title">
              Direct Corporate &amp; <span>Central Warehouse Hub</span>
            </h1>

            <p className="zp-contact-hero-desc">
              Connect directly with Zeal Pharmacure for exclusive district monopoly rights, {productCount}+ DCGI-approved formulations, institutional hospital supply contracts, and 24–48h dispatches from our central distribution warehouse.
            </p>

            {/* 3 Quick Stat Badges */}
            <div className="zp-contact-hero-stats">
              <div className="zp-contact-stat-pill">
                <div className="zp-contact-stat-icon">
                  <Warehouse size={16} />
                </div>
                <div>
                  <div className="zp-contact-stat-label">Central Depot</div>
                  <div className="zp-contact-stat-value">12,000+ Sq. Ft.</div>
                </div>
              </div>

              <div className="zp-contact-stat-pill">
                <div className="zp-contact-stat-icon" style={{ color: '#60A5FA' }}>
                  <Pill size={16} />
                </div>
                <div>
                  <div className="zp-contact-stat-label">Formulations</div>
                  <div className="zp-contact-stat-value">{productCount}+ Molecules</div>
                </div>
              </div>

              <div className="zp-contact-stat-pill">
                <div className="zp-contact-stat-icon" style={{ color: '#FBBF24' }}>
                  <Clock size={16} />
                </div>
                <div>
                  <div className="zp-contact-stat-label">Dispatch SLA</div>
                  <div className="zp-contact-stat-value">24–48h Turnaround</div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="zp-contact-hero-actions">
              <button
                type="button"
                onClick={onOpenFranchise}
                className="zp-contact-btn-primary"
              >
                <Sparkles size={16} />
                <span>Apply for Stockists / Distribution</span>
              </button>

              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Zeal Pharmacure, I would like to inquire about stockist distribution and product catalog.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="zp-contact-btn-whatsapp"
              >
                <MessageSquare size={16} />
                <span>WhatsApp Business</span>
              </a>

              <a
                href={`tel:${corporatePhone}`}
                className="zp-contact-btn-call"
                title={`Call ${corporatePhone}`}
              >
                <Phone size={15} style={{ color: '#60A5FA' }} />
                <span>{corporatePhone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Authentic Indian Pharma Warehouse Visual */}
          <div className="zp-contact-hero-visual">
            <div className="zp-contact-hero-img-card">
              <img
                src={depotImg}
                alt="Zeal Pharmacure Central Distribution Warehouse and Medicine Rack Logistics Depot"
                className="zp-contact-hero-img"
              />
              <div className="zp-contact-hero-overlay" />

              {/* Live Active Status Badge */}
              <div className="zp-contact-hero-depot-badge">
                <span className="zp-status-pulse" />
                <span>Central Depot: Active Dispatching</span>
              </div>

              {/* Bottom Warehouse Details Overlay */}
              <div className="zp-contact-hero-depot-info">
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading, "Outfit", sans-serif)' }}>
                    Surat Central Logistics &amp; Distribution Depot
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                    7015, BTM Market, Puna Gam, Surat
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onScrollToForm}
                  style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>Locate Hub</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
