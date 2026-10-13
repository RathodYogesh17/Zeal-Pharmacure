import React from 'react';
import {
  Building2,
  PhoneCall,
  MapPin,
  ExternalLink,
  Navigation,
  Clock,
  Truck,
  ShieldCheck,
  Mail,
} from 'lucide-react';
import type { ISiteSettings } from '../../types';

export interface ContactBranchesMapProps {
  settings: ISiteSettings;
}

export const ContactBranchesMap: React.FC<ContactBranchesMapProps> = ({ settings }) => {
  const corporatePhone = settings.phone || '+91 9909160190';
  const corporateEmail = settings.email || 'zealpharmacure@gmail.com';
  const googleMapsUrl = 'https://maps.app.goo.gl/Fyn1U464AMUPgTPH7';

  return (
    <div id="central-depot-location" className="zp-flex-col" style={{ gap: '24px' }}>
      {/* Interactive Google Map Frame with Exact Surat Coordinates */}
      <div className="zp-card-box" style={{ padding: 0, overflow: 'hidden', borderRadius: '22px', border: '1.5px solid #E2E8F0', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' }}>
        {/* Map Header */}
        <div
          style={{
            padding: '14px 20px',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#EDE9FE',
                color: 'var(--zp-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-heading, "Outfit", sans-serif)' }}>
                Surat Central Depot (Puna Gam)
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                7015, BTM (Bellagio Textile Market), Sita Nagar
              </div>
            </div>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'var(--zp-primary)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              transition: 'opacity 0.2s',
            }}
          >
            <Navigation size={13} />
            <span>Open in Google Maps</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Embedded Google Maps Frame */}
        <div style={{ height: '280px', width: '100%', position: 'relative' }}>
          <iframe
            title="Zeal Pharmacure Central Depot - 7015 BTM Puna Gam Surat"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src="https://maps.google.com/maps?q=21.1979532,72.8670327+(Zeal+Pharmacure+-+7015+BTM+Market,+Puna+Gam,+Surat)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
            style={{ border: 0, width: '100%', height: '100%' }}
            loading="lazy"
          />
        </div>
      </div>

      {/* Single Official Depot & Corporate Headquarters Card */}
      <div
        className="zp-card-box"
        style={{
          padding: '28px',
          borderRadius: '22px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
          background: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <div>
            <span
              style={{
                display: 'inline-block',
                background: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '8px',
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              }}
            >
              Central Corporate &amp; Distribution Depot
            </span>
            <h4
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#0F172A',
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                lineHeight: 1.25,
              }}
            >
              Zeal Pharmacure
            </h4>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#F5F3FF',
              color: 'var(--zp-primary)',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            }}
          >
            <ShieldCheck size={15} />
            <span>WHO-GMP Authorized</span>
          </div>
        </div>

        {/* Address and Info Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              <Building2 size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Depot &amp; Registered Address
              </div>
              <div style={{ fontSize: '13.5px', color: '#1E293B', fontWeight: 600, lineHeight: 1.5, marginTop: '2px' }}>
                7015, BTM (Bellagio Textile Market), Sita Nagar, Parvat Patiya, Puna Gam, Surat, Gujarat – 395010
              </div>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '3px' }}>
                Landmark: Beside RajMahal Mall
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PhoneCall size={14} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Distribution Hotline</div>
                <a href={`tel:${corporatePhone}`} style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>
                  {corporatePhone}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#EFF6FF', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={14} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Official Email</div>
                <a href={`mailto:${corporateEmail}`} style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textDecoration: 'none' }}>
                  {corporateEmail}
                </a>
              </div>
            </div>

            {settings.workingHours ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Working Hours</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                    {settings.workingHours}
                  </div>
                </div>
              </div>
            ) : null}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F5F3FF', color: 'var(--zp-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={14} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Dispatch Carrier SLA</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                  24–48 Hours Pan-India
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px 18px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '13px',
            textDecoration: 'none',
            fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          }}
        >
          <Navigation size={15} />
          <span>Get Driving Directions to Surat Hub</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};
