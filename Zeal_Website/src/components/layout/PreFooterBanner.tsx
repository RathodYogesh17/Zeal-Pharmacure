import React from 'react';
import { ArrowRight, PhoneCall, Sparkles, Award, Truck, CheckCircle2 } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const PreFooterBanner: React.FC = () => {
  const { settings, openFranchiseModal, productCount } = useSiteSettings();

  const helplineNumber = settings.salesHelpline || settings.phone || '+91 9909160190';
  const helplineClean = helplineNumber.replace(/\s+/g, '');

  return (
    <section
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 38%, #2E1065 72%, #1A0D33 100%)',
        padding: '76px 0 80px',
        color: '#FFFFFF',
        borderTop: '2px solid rgba(139, 92, 246, 0.35)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-60px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(104, 40, 220, 0.42) 0%, rgba(139, 92, 246, 0.12) 55%, transparent 75%)',
          filter: 'blur(75px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-40px',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(104, 40, 220, 0.06) 60%, transparent 75%)',
          filter: 'blur(65px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '36px',
        }}
      >
        {/* Left Column: Heading, Subtitle & Trust Points */}
        <div style={{ maxWidth: '640px', flex: '1 1 500px' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(104, 40, 220, 0.4)',
              border: '1px solid rgba(196, 181, 253, 0.45)',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 800,
              marginBottom: '18px',
              color: '#EDE9FE',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 2px 8px rgba(104, 40, 220, 0.2)',
            }}
          >
            <Sparkles size={14} style={{ color: '#C4B5FD' }} />
            <span>Authorized Stockists Distribution Available</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              fontSize: 'clamp(30px, 4vw, 42px)',
              fontWeight: 900,
              lineHeight: 1.16,
              marginBottom: '16px',
              color: '#FFFFFF',
              letterSpacing: '-0.8px',
            }}
          >
            Let’s Build a{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 50%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Healthier Tomorrow
            </span>{' '}
            Together
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
              fontSize: '15.5px',
              color: '#CBD5E1',
              lineHeight: 1.65,
              margin: '0 0 24px 0',
            }}
          >
            Become an authorized Stockist Distribution Partner with {settings.companyName || 'Zeal Pharmacure'}. Benefit from {productCount}+ DCGI formulations, direct brand wholesale pricing, and comprehensive promotional marketing support.
          </p>

          {/* 3 Mini Trust Feature Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#F1F5F9',
              }}
            >
              <CheckCircle2 size={14} style={{ color: '#34D399' }} />
              <span>{productCount}+ DCGI Formulations</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#F1F5F9',
              }}
            >
              <Award size={14} style={{ color: '#FBBF24' }} />
              <span>Monopoly Territory Rights</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#F1F5F9',
              }}
            >
              <Truck size={14} style={{ color: '#60A5FA' }} />
              <span>Pan-India Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Action Showcase Card */}
        <div
          style={{
            flex: '0 1 400px',
            width: '100%',
            maxWidth: '420px',
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '24px',
            padding: '26px 26px 22px',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                fontSize: '18px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.3px',
                marginBottom: '4px',
              }}
            >
              Apply for Territory Rights
            </div>
            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
              Direct brand wholesale pricing with verified WHO-GMP certificates.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={openFranchiseModal}
              style={{
                width: '100%',
                padding: '14px 24px',
                fontSize: '14.5px',
                fontWeight: 800,
                borderRadius: '999px',
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6828DC 100%)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 22px -3px rgba(104, 40, 220, 0.55)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 28px -2px rgba(104, 40, 220, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 8px 22px -3px rgba(104, 40, 220, 0.55)';
              }}
            >
              <span>{settings.primaryCtaText || 'Apply for Stockists / Distribution'}</span>
              <ArrowRight size={17} />
            </button>

            <a
              href={`tel:${helplineClean}`}
              style={{
                width: '100%',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700,
                borderRadius: '999px',
                border: '1.5px solid rgba(255, 255, 255, 0.22)',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '9px',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.borderColor = '#C4B5FD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
              }}
            >
              <PhoneCall size={16} style={{ color: '#34D399' }} />
              <span>{helplineNumber}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
