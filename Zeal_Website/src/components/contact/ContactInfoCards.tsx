import React from 'react';
import { Mail, MapPin, MessageSquare, PhoneCall, ExternalLink } from 'lucide-react';
import type { ISiteSettings } from '../../types';
import './ContactStyles.css';

export interface ContactInfoCardsProps {
  settings: ISiteSettings;
}

export const ContactInfoCards: React.FC<ContactInfoCardsProps> = ({ settings }) => {
  const corporatePhone = settings.phone || '+91 9909160190';
  const cleanPhone = corporatePhone.replace(/[^0-9]/g, '');
  const corporateEmail = settings.email || 'zealpharmacure@gmail.com';
  const googleMapsUrl = 'https://maps.app.goo.gl/Fyn1U464AMUPgTPH7';

  const channels = [
    {
      icon: <PhoneCall size={22} />,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      iconShadow: '0 4px 14px rgba(5, 150, 105, 0.15)',
      badgeText: 'DIRECT CALL',
      badgeStyle: { color: '#059669', background: '#ECFDF5', border: '1px solid #A7F3D0' },
      title: 'Distribution Helpline',
      desc: 'Speak directly with our regional territory distribution manager.',
      detailLabel: 'Helpline Number',
      detailValue: corporatePhone,
      valueBg: '#F0FDF4',
      valueBorder: '#BBF7D0',
      valueLabelColor: '#059669',
      btnText: 'Call Helpline',
      btnHref: `tel:${corporatePhone}`,
      btnBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      btnShadow: '0 4px 14px rgba(16, 185, 129, 0.28)',
    },
    {
      icon: <MessageSquare size={22} />,
      iconColor: '#16A34A',
      iconBg: '#F0FDF4',
      iconShadow: '0 4px 14px rgba(22, 163, 74, 0.15)',
      badgeText: 'INSTANT CHAT',
      badgeStyle: { color: '#15803D', background: '#F0FDF4', border: '1px solid #BBF7D0' },
      title: 'WhatsApp Business',
      desc: 'Get instant product catalog, wholesale price list & stockist terms.',
      detailLabel: 'WhatsApp Direct',
      detailValue: corporatePhone,
      valueBg: '#F0FDF4',
      valueBorder: '#BBF7D0',
      valueLabelColor: '#16A34A',
      btnText: 'Chat on WhatsApp',
      btnHref: `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Zeal Pharmacure, I would like to inquire about stockist distribution and product catalog.')}`,
      targetBlank: true,
      btnBg: 'linear-gradient(135deg, #25D366 0%, #16A34A 100%)',
      btnShadow: '0 4px 14px rgba(37, 211, 102, 0.28)',
    },
    {
      icon: <Mail size={22} />,
      iconColor: '#0284C7',
      iconBg: '#F0F9FF',
      iconShadow: '0 4px 14px rgba(2, 132, 199, 0.15)',
      badgeText: 'TENDERS & RFQ',
      badgeStyle: { color: '#0369A1', background: '#F0F9FF', border: '1px solid #BAE6FD' },
      title: 'Corporate Email',
      desc: 'Submit institutional tender RFQs, contracts and commercial inquiries.',
      detailLabel: 'Official Email',
      detailValue: corporateEmail,
      valueBg: '#F0F9FF',
      valueBorder: '#BAE6FD',
      valueLabelColor: '#0284C7',
      btnText: 'Send Email',
      btnHref: `mailto:${corporateEmail}`,
      btnBg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      btnShadow: '0 4px 14px rgba(2, 132, 199, 0.28)',
    },
    {
      icon: <MapPin size={22} />,
      iconColor: 'var(--zp-primary)',
      iconBg: '#F5F3FF',
      iconShadow: '0 4px 14px rgba(104, 40, 220, 0.15)',
      badgeText: 'CENTRAL DEPOT',
      badgeStyle: { color: 'var(--zp-primary)', background: '#F5F3FF', border: '1px solid #DDD6FE' },
      title: 'Surat Central Depot',
      desc: '7015, BTM (Bellagio Textile Market), Puna Gam, Surat – 395010.',
      detailLabel: 'Depot Location',
      detailValue: '7015, BTM Market, Surat',
      valueBg: '#F5F3FF',
      valueBorder: '#DDD6FE',
      valueLabelColor: 'var(--zp-primary)',
      btnText: 'Open in Google Maps',
      btnHref: googleMapsUrl,
      targetBlank: true,
      btnBg: 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
      btnShadow: '0 4px 14px rgba(104, 40, 220, 0.28)',
    },
  ];

  return (
    <div className="container" style={{ marginTop: '-48px', position: 'relative', zIndex: 10 }}>
      <div className="zp-contact-channels-grid">
        {channels.map((ch, idx) => (
          <div
            key={idx}
            className="zp-contact-channel-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '22px',
              border: '1.5px solid #E2E8F0',
              padding: '26px 22px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
          >
            {/* Top Header: Icon on Left, Status Badge on Right */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '15px',
                  background: ch.iconBg,
                  color: ch.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: ch.iconShadow,
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                }}
              >
                {ch.icon}
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '5px 12px',
                  borderRadius: '999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                  ...ch.badgeStyle,
                }}
              >
                {ch.badgeText}
              </span>
            </div>

            {/* Title & Description */}
            <h3
              style={{
                fontSize: '19px',
                fontWeight: 800,
                color: '#0F172A',
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                marginBottom: '6px',
                letterSpacing: '-0.3px',
              }}
            >
              {ch.title}
            </h3>

            <p
              style={{
                fontSize: '13px',
                color: '#64748B',
                lineHeight: 1.5,
                marginBottom: '18px',
                minHeight: '38px',
                fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
              }}
            >
              {ch.desc}
            </p>

            {/* Clean Detail Box */}
            <div
              style={{
                background: ch.valueBg,
                border: `1.5px solid ${ch.valueBorder}`,
                borderRadius: '14px',
                padding: '11px 14px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: ch.valueLabelColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                }}
              >
                {ch.detailLabel}
              </div>
              <div
                style={{
                  fontSize: '14.5px',
                  fontWeight: 800,
                  color: '#0F172A',
                  fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {ch.detailValue}
              </div>
            </div>

            {/* Full-width CTA Button */}
            <a
              href={ch.btnHref}
              target={ch.targetBlank ? '_blank' : undefined}
              rel={ch.targetBlank ? 'noopener noreferrer' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 18px',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '13px',
                textDecoration: 'none',
                background: ch.btnBg,
                color: '#FFFFFF',
                boxShadow: ch.btnShadow,
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                transition: 'transform 0.2s ease, filter 0.2s ease',
                marginTop: 'auto',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.filter = 'brightness(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              <span>{ch.btnText}</span>
              {ch.targetBlank ? <ExternalLink size={13} /> : null}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
