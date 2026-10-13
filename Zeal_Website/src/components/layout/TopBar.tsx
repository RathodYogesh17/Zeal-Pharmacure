import React from 'react';
import { Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const TopBar: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <div style={{
      background: '#4C1D95',
      color: '#EDE9FE',
      fontSize: '12.5px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '7px 0',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Left: Contact Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a
            href={`tel:${settings.phone}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EDE9FE' }}
          >
            <Phone size={13} style={{ color: '#A78BFA' }} />
            <span>Hotline: <strong>{settings.phone}</strong></span>
          </a>

          <a
            href={`mailto:${settings.email}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EDE9FE' }}
            className="hide-mobile"
          >
            <Mail size={13} style={{ color: '#A78BFA' }} />
            <span>{settings.email}</span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CBD5E1' }} className="hide-mobile">
            <Clock size={13} style={{ color: '#A78BFA' }} />
            <span>{settings.workingHours || 'Monday - Saturday: 9:30 AM - 6:30 PM'}</span>
          </div>
        </div>

        {/* Right: Accreditations */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34D399', fontWeight: 600 }}>
            <ShieldCheck size={14} />
            <span>WHO-GMP & ISO 9001:2015</span>
          </span>
        </div>
      </div>
    </div>
  );
};
