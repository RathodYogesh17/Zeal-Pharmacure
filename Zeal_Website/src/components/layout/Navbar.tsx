import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X, User as UserIcon, LogOut, ChevronDown, ShieldCheck, ExternalLink, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common';

export const Navbar: React.FC = () => {
  const { settings, openFranchiseModal, productCount } = useSiteSettings();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Careers', path: '/career' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      background: '#FFFFFF',
      boxShadow: '0 2px 12px rgba(15, 23, 42, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid #F1F5F9',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.companyName}
              style={{ height: '48px', objectFit: 'contain' }}
            />
          ) : (
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(104, 40, 220, 0.35)',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6M12 18V22M6 12H2M22 12H18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3.5" fill="#FFFFFF"/>
                <path d="M16.24 7.76L19.07 4.93M4.93 19.07L7.76 16.24M16.24 16.24L19.07 19.07M4.93 4.93L7.76 7.76" stroke="#EDE9FE" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}

          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#1E293B',
              lineHeight: 1.1,
            }}>
              <span style={{ color: '#6828DC' }}>ZEAL</span> PHARMACURE
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#64748B',
              textTransform: 'uppercase',
            }}>
              {settings.tagline || 'Innovating Healthcare'}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hide-mobile">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontSize: '15px',
                fontWeight: isActive(link.path) ? 700 : 500,
                color: isActive(link.path) ? '#6828DC' : '#334155',
                position: 'relative',
                padding: '8px 0',
                textDecoration: 'none',
              }}
            >
              {link.name}
              {isActive(link.path) && (
                <span style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  height: '2.5px',
                  background: '#6828DC',
                  borderRadius: '999px',
                }} />
              )}
            </Link>
          ))}
        </nav>

        {/* Right CTA Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

          {/* User Profile / Auth Button */}
          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef} className="hide-mobile">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '5px 12px 5px 6px',
                  borderRadius: '999px',
                  background: userMenuOpen ? '#F3E8FF' : '#FAF5FF',
                  border: '1.5px solid #DDD6FE',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: userMenuOpen ? '0 4px 12px rgba(104, 40, 220, 0.15)' : 'none',
                }}
                title={user.name}
              >
                {/* Gmail-style Avatar (Image if available, else 1st character) */}
                <UserAvatar
                  image={user.profileImage}
                  name={user.name}
                  size={32}
                  fontSize={14}
                  showBadge={true}
                  badgeColor="#10B981"
                />
                <span style={{
                  fontSize: '13.5px',
                  fontWeight: 700,
                  color: '#4C1D95',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown
                  size={14}
                  color="#6828DC"
                  style={{
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* User Dropdown - Modern Executive Purple Theme Design */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 12px)',
                    width: '305px',
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    boxShadow: '0 24px 48px -12px rgba(104, 40, 220, 0.24), 0 4px 16px rgba(0, 0, 0, 0.04)',
                    border: '1.5px solid #EDE9FE',
                    padding: 0,
                    zIndex: 100,
                    overflow: 'hidden',
                    animation: 'fadeInScale 0.18s ease-out',
                  }}
                >
                  {/* Account Header Banner */}
                  <div
                    style={{
                      position: 'relative',
                      background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 50%, #EDE9FE 100%)',
                      padding: '22px 20px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderBottom: '1px solid #EDE9FE',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Ambient subtle glow orb */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-30px',
                        right: '-30px',
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(104, 40, 220, 0.18) 0%, transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Avatar with purple drop glow */}
                    <div
                      style={{
                        marginBottom: '10px',
                        borderRadius: '50%',
                        boxShadow: '0 6px 18px rgba(104, 40, 220, 0.22)',
                      }}
                    >
                      <UserAvatar
                        image={user.profileImage}
                        name={user.name}
                        size={64}
                        fontSize={26}
                        border="3px solid #FFFFFF"
                        showBadge={true}
                      />
                    </div>

                    <div
                      style={{
                        fontSize: '15.5px',
                        fontWeight: 900,
                        color: '#1E1B4B',
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                      }}
                    >
                      {user.name}
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6B7280',
                        fontWeight: 500,
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginTop: '2px',
                      }}
                    >
                      {user.email}
                    </div>

                    {/* Role badge */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginTop: '8px',
                        padding: '3px 12px',
                        borderRadius: '999px',
                        background: '#FFFFFF',
                        color: '#6828DC',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        border: '1px solid #DDD6FE',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 6px rgba(104, 40, 220, 0.08)',
                      }}
                    >
                      <ShieldCheck size={12} style={{ color: '#7C3AED' }} />
                      <span>{user.role || 'Member'}</span>
                    </div>

                    {/* Manage Account Purple Button */}
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        marginTop: '14px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        borderRadius: '999px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
                        color: '#FFFFFF',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        boxShadow: '0 6px 18px -3px rgba(104, 40, 220, 0.45)',
                        width: '100%',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease',
                        fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 8px 22px -2px rgba(104, 40, 220, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 6px 18px -3px rgba(104, 40, 220, 0.45)';
                      }}
                    >
                      <UserIcon size={14} />
                      <span>Manage Your Account</span>
                    </Link>
                  </div>

                  {/* Menu Options Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px 14px' }}>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF5FF')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: '#F5F3FF',
                            border: '1px solid #EDE9FE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6828DC',
                            flexShrink: 0,
                          }}
                        >
                          <UserIcon size={16} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                            View Profile Page
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>
                            Account settings &amp; status
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#C4B5FD" />
                    </Link>

                    <Link
                      to="/products"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF5FF')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: '#F5F3FF',
                            border: '1px solid #EDE9FE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6828DC',
                            flexShrink: 0,
                          }}
                        >
                          <ExternalLink size={15} />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
                            Browse Products
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>
                            {productCount}+ formulations catalog
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={14} color="#C4B5FD" />
                    </Link>

                    <div style={{ height: '1px', background: '#F1F5F9', margin: '4px 0' }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#FEF2F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: '#FEF2F2',
                          border: '1px solid #FEE2E2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#DC2626',
                          flexShrink: 0,
                        }}
                      >
                        <LogOut size={15} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626', lineHeight: 1.2 }}>
                          Sign Out
                        </div>
                        <div style={{ fontSize: '11px', color: '#991B1B' }}>
                          End current session
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '999px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#334155',
                fontSize: '13.5px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              className="hide-mobile"
            >
              <UserIcon size={15} color="#6828DC" />
              <span>Sign In</span>
            </Link>
          )}

          <button
            onClick={openFranchiseModal}
            className="btn btn-primary"
            style={{
              padding: '11px 22px',
              fontSize: '14.5px',
              fontWeight: 700,
              borderRadius: '999px',
            }}
          >
            <span>{settings.primaryCtaText || 'Enquire Now'}</span>
            <ArrowRight size={16} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '8px',
              color: '#334155',
              background: 'none',
              border: 'none',
            }}
            className="show-mobile"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '16px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        }}>
          {/* User status in mobile */}
          {isAuthenticated && user ? (
            <div style={{
              background: '#FAF5FF',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #DDD6FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
              >
                <UserAvatar
                  image={user.profileImage}
                  name={user.name}
                  size={42}
                  fontSize={18}
                  showBadge={true}
                />
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#4C1D95' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: '#6B21A8' }}>View & Edit Profile</div>
                </div>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '6px 10px',
                }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid #6828DC',
                color: '#6828DC',
                fontSize: '14.5px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <UserIcon size={16} />
              <span>Sign In / Register</span>
            </Link>
          )}

          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: isActive(link.path) ? 700 : 500,
                color: isActive(link.path) ? '#6828DC' : '#1E293B',
                padding: '10px 0',
                borderBottom: '1px solid #F1F5F9',
                textDecoration: 'none',
              }}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openFranchiseModal();
            }}
            className="btn btn-primary"
            style={{ marginTop: '10px', width: '100%', borderRadius: '8px' }}
          >
            <span>Enquire for Franchise</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Responsive helper styles for mobile navbar */}
      <style>{`
        @media (max-width: 900px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 901px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
};
