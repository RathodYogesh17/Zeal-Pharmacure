import React, { useState, useEffect } from 'react';
import { X, Send, CheckCheck, Sparkles, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { VerifiedUserBadge } from '../common/VerifiedUserBadge';
import { buildQuickWhatsAppMessage } from '../../utils/whatsappMessageBuilder';

/** Official WhatsApp SVG Icon */
const WhatsAppIcon: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; className?: string }> = ({
  size = 20,
  color = 'currentColor',
  style,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ display: 'inline-block', flexShrink: 0, ...style }}
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

interface QuickTopic {
  id: string;
  label: string;
  emoji: string;
  shortTag: string;
  message: string;
}

const QUICK_TOPICS: QuickTopic[] = [
  {
    id: 'stockist',
    label: 'Stockist Distribution',
    emoji: '',
    shortTag: 'Distribution Network',
    message: 'Hello Zeal Pharmacure team! I am interested in joining your Stockist Distribution network. Please share your product portfolio, visual aid, and terms.',
  },
  {
    id: 'bulk',
    label: 'Third-Party / Contract Mfg',
    emoji: '',
    shortTag: 'Bulk Manufacturing',
    message: 'Hello Zeal Pharmacure, we are looking for third-party contract manufacturing / bulk formulation supply for our pharmaceutical brand. Please connect me with your contract manufacturing division.',
  },
  {
    id: 'catalog',
    label: 'Product Catalog & Price List',
    emoji: '',
    shortTag: 'Instant Brochure',
    message: 'Hello Zeal Pharmacure, please share your latest Product Catalog, Visual Aid brochure, and comprehensive Price List with current batch details.',
  },
  {
    id: 'career',
    label: 'Careers / MR Openings',
    emoji: '',
    shortTag: 'Field Sales & MR',
    message: 'Hello HR Team at Zeal Pharmacure, I am writing to inquire about current Medical Representative (MR) / Area Sales Manager vacancies.',
  },
  {
    id: 'formulation',
    label: 'Formulation Supply & Inquiries',
    emoji: '💊',
    shortTag: 'Direct Supply',
    message: 'Hello Zeal Pharmacure team, I would like to inquire about availability and bulk pricing for your WHO-GMP certified formulation range.',
  },
];

export const FloatingWhatsAppWidget: React.FC = () => {
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('stockist');
  const [userMsg, setUserMsg] = useState(QUICK_TOPICS[0].message);
  const [currentTime, setCurrentTime] = useState('10:00 AM');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Set real-time clock on mount
  useEffect(() => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    );

    // Auto-dismiss tooltip after 8s
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const cleanNumber = (settings.whatsappNumber || '+91 93162 27576').replace(/[^0-9]/g, '');

  const handleSelectTopic = (topic: QuickTopic) => {
    setSelectedTopic(topic.id);
    setUserMsg(topic.message);
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const activeTopic = QUICK_TOPICS.find((t) => t.id === selectedTopic);
    const text = buildQuickWhatsAppMessage({
      topicLabel: activeTopic?.label || 'General Inquiry',
      message: userMsg.trim(),
      user: user ? {
        name: user.name,
        phone: user.phone,
        email: user.email,
      } : undefined,
    });
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
    setHasInteracted(true);
    setShowTooltip(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Tooltip Prompt (before opening) */}
      {!isOpen && showTooltip && !hasInteracted && (
        <div
          onClick={handleToggleOpen}
          style={{
            position: 'absolute',
            bottom: '72px',
            right: '4px',
            background: '#FFFFFF',
            color: '#0F172A',
            padding: '10px 14px',
            borderRadius: '14px',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.16)',
            border: '1px solid #E2E8F0',
            fontSize: '12.5px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            animation: 'bounceIn 0.4s ease',
          }}
        >
          <span style={{ fontSize: '15px' }}>💬</span>
          <span>
            Join <strong style={{ color: '#059669' }}>Stockist Distribution</strong> Network?
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '2px',
              marginLeft: '4px',
              display: 'flex',
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Expanded Quick Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '74px',
            right: '0',
            width: '360px',
            maxWidth: 'calc(100vw - 32px)',
            background: '#FFFFFF',
            borderRadius: '22px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.22), 0 4px 16px rgba(0,0,0,0.06)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideUpFade 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header (Authentic WhatsApp Business Teal / Green) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)',
              color: '#FFFFFF',
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* WhatsApp & Logo Badge */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    padding: '8px',
                    boxSizing: 'border-box',
                  }}
                >
                  <WhatsAppIcon size={28} color="#25D366" />
                </div>
                {/* Active Online Pulse Dot */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '1px',
                    right: '1px',
                    width: '11px',
                    height: '11px',
                    borderRadius: '50%',
                    background: '#25D366',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 0 6px #25D366',
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '15px',
                    fontWeight: 800,
                    letterSpacing: '-0.2px',
                  }}
                >
                  <span>Zeal Pharmacure</span>
                  <span
                    title="Verified Company Desk"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#25D366',
                      borderRadius: '50%',
                      width: '15px',
                      height: '15px',
                    }}
                  >
                    <CheckCheck size={10} color="#FFFFFF" strokeWidth={3} />
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '11.5px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '2px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#4ADE80',
                      display: 'inline-block',
                    }}
                  />
                  <span>Online Desk • Typically replies in 5m</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp Chat"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
            >
              <X size={17} />
            </button>
          </div>

          {/* Chat Canvas (WhatsApp authentic wallpaper background) */}
          <div
            style={{
              padding: '16px',
              background: '#ECE5DD',
              backgroundImage:
                'radial-gradient(#DFD6C9 1px, transparent 1px), radial-gradient(#DFD6C9 1px, #ECE5DD 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '340px',
              overflowY: 'auto',
            }}
          >
              {/* Today Date Badge */}
              <div
                style={{
                  alignSelf: 'center',
                  background: 'rgba(255, 255, 255, 0.92)',
                  padding: '3px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#54656F',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  letterSpacing: '0.3px',
                }}
              >
                Today
              </div>

              {/* Verified User Pill or Prompt */}
              {user ? (
                <VerifiedUserBadge user={user} style={{ margin: '2px 0 8px 0' }} />
              ) : (
                <div
                  style={{
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    color: '#92400E',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                  }}
                >
                  <ShieldCheck size={13} color="#D97706" />
                  <span>Verified user sign-in required before WhatsApp dispatch.</span>
                </div>
              )}

            {/* Official Zeal Welcome Bubble */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                borderTopLeftRadius: '3px',
                padding: '12px 14px',
                boxShadow: '0 1.5px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#075E54', letterSpacing: '0.2px' }}>
                  Zeal Pharmacure Desk
                </span>
                <span
                  style={{
                    background: '#EDE9FE',
                    color: '#6828DC',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  WHO-GMP
                </span>
              </div>

              <div style={{ fontSize: '12.5px', color: '#1E293B', lineHeight: 1.55 }}>
                Namaste! 🙏 Welcome to <strong>Zeal Pharmacure</strong>.
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#475569' }}>
                  Leading manufacturer of WHO-GMP certified Tablets, Capsules, Syrups & Injections.
                </div>
                <div style={{ marginTop: '5px', fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} color="#6828DC" />
                  <span>7015, Billiogo Textile Market, Parvat Patiya, Surat</span>
                </div>
              </div>

              <div
                style={{
                  alignSelf: 'flex-end',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  color: '#64748B',
                  marginTop: '2px',
                }}
              >
                <span>{currentTime}</span>
                <CheckCheck size={13} color="#53BDEB" />
              </div>
            </div>

            {/* Quick Topic Selector Label */}
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginTop: '2px',
              }}
            >
              <Sparkles size={12} color="#059669" />
              <span>Select your inquiry type:</span>
            </div>

            {/* Quick Topics Pills Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {QUICK_TOPICS.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    style={{
                      background: isSelected ? '#DCF8C6' : '#FFFFFF',
                      border: isSelected ? '1.5px solid #25D366' : '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isSelected ? '0 2px 6px rgba(37, 211, 102, 0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px' }}>{topic.emoji}</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                          {topic.label}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748B' }}>{topic.shortTag}</div>
                      </div>
                    </div>
                    <ChevronRight size={14} color={isSelected ? '#075E54' : '#94A3B8'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Composer & WhatsApp CTA */}
          <form
            onSubmit={handleStartChat}
            noValidate
            style={{
              padding: '14px 16px',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#64748B',
                  marginBottom: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Custom Message</span>
                <span style={{ color: '#059669', fontSize: '10.5px' }}>Ready to send</span>
              </div>
              <textarea
                rows={3}
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                placeholder="Type your message here..."
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '12.5px',
                  lineHeight: 1.45,
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#0F172A',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#25D366')}
                onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
              />
            </div>

            {/* Submit / WhatsApp Open Button */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '11px 16px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(37, 211, 102, 0.35)',
                transition: 'all 0.15s ease',
                letterSpacing: '0.2px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 22px rgba(37, 211, 102, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 211, 102, 0.35)';
              }}
            >
              <WhatsAppIcon size={19} color="#FFFFFF" />
              <span>Start WhatsApp Chat (Verified)</span>
              <Send size={14} style={{ opacity: 0.9 }} />
            </button>

            {/* Official Helpline Trust Footer */}
            <div
              style={{
                fontSize: '10.5px',
                color: '#64748B',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              <ShieldCheck size={12} color="#10B981" />
              <span>
                Official Helpline: <strong>+91 93162 27576</strong>
              </span>
            </div>
          </form>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={handleToggleOpen}
        aria-label={isOpen ? 'Close WhatsApp Widget' : 'Open WhatsApp Support'}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'rotate(90deg)' : 'scale(1)',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? (
          <X size={26} strokeWidth={2.5} />
        ) : (
          <>
            <WhatsAppIcon size={32} color="#FFFFFF" />
            {/* Unread Message Notification Dot */}
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#EF4444',
                color: '#FFFFFF',
                fontSize: '10.5px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
              }}
            >
              1
            </span>
          </>
        )}
      </button>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes bounceIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
