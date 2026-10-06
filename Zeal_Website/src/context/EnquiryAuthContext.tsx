import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  Lock,
  X,
  Mail,
  Phone,
  User,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthInputField, AuthSubmitButton } from '../components/common/auth';

interface RequireAuthOptions {
  title?: string;
  subtitle?: string;
  source?: string;
}

interface EnquiryAuthContextType {
  requireAuth: (action: () => void, options?: RequireAuthOptions) => void;
  openAuthModal: (options?: RequireAuthOptions) => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

const EnquiryAuthContext = createContext<EnquiryAuthContextType | undefined>(undefined);

export const EnquiryAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<RequireAuthOptions>({});
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pendingActionRef = useRef<(() => void) | null>(null);

  const openAuthModal = useCallback((options?: RequireAuthOptions) => {
    setModalOptions(options || {});
    setErrorMsg(null);
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
    setErrorMsg(null);
    pendingActionRef.current = null;
  }, []);

  const requireAuth = useCallback(
    (action: () => void, options?: RequireAuthOptions) => {
      if (isAuthenticated) {
        action();
      } else {
        pendingActionRef.current = action;
        openAuthModal(options);
      }
    },
    [isAuthenticated, openAuthModal]
  );

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await login(email.trim(), password);
      if (res.otpRequired) {
        // If 2FA OTP is required, redirect to login page with preserved state
        closeAuthModal();
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      setIsOpen(false);
      if (pendingActionRef.current) {
        const action = pendingActionRef.current;
        pendingActionRef.current = null;
        setTimeout(() => action(), 150);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!regName.trim() || !regPhone.trim() || !regEmail.trim() || !regPassword) {
      setErrorMsg('Please complete all fields.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

      // Automatically login after successful registration
      await login(regEmail.trim(), regPassword);

      setIsOpen(false);
      if (pendingActionRef.current) {
        const action = pendingActionRef.current;
        pendingActionRef.current = null;
        setTimeout(() => action(), 150);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Email or phone may already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToFullLogin = () => {
    closeAuthModal();
    navigate('/login', { state: { from: location.pathname } });
  };

  return (
    <EnquiryAuthContext.Provider
      value={{
        requireAuth,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen: isOpen,
      }}
    >
      {children}

      {/* Global Enquiry Authentication Modal */}
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={closeAuthModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 25px 60px -12px rgba(104, 40, 220, 0.2), 0 2px 10px rgba(0, 0, 0, 0.04)',
              border: '1.5px solid #EDE9FE',
              overflow: 'hidden',
              position: 'relative',
              animation: 'scaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '28px 24px 16px', position: 'relative' }}>
              <button
                type="button"
                onClick={closeAuthModal}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EDE9FE';
                  e.currentTarget.style.color = '#6828DC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.color = '#64748B';
                }}
              >
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 20px rgba(104, 40, 220, 0.28)',
                    flexShrink: 0,
                  }}
                >
                  <Lock size={22} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#6828DC',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      background: '#F5F3FF',
                      border: '1px solid #DDD6FE',
                      padding: '2px 9px',
                      borderRadius: '999px',
                      display: 'inline-block',
                      marginBottom: '3px',
                    }}
                  >
                    B2B Enquiry Verification
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                      fontSize: '21px',
                      fontWeight: 900,
                      color: '#1E1B4B',
                      margin: 0,
                      lineHeight: 1.25,
                    }}
                  >
                    {modalOptions.title || 'Please Log In to Enquire'}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                {modalOptions.subtitle ||
                  'To protect wholesale pricing and track your stockist distribution inquiries with our sales team, please sign in or register.'}
              </p>

              {/* Navigation Tabs - Pure Purple Theme */}
              <div
                style={{
                  display: 'flex',
                  background: '#F5F3FF',
                  borderRadius: '12px',
                  padding: '4px',
                  marginTop: '18px',
                  border: '1.5px solid #EDE9FE',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setErrorMsg(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '9px 14px',
                    borderRadius: '9px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: tab === 'login' ? '#6828DC' : 'transparent',
                    color: tab === 'login' ? '#FFFFFF' : '#64748B',
                    boxShadow: tab === 'login' ? '0 4px 14px rgba(104, 40, 220, 0.25)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMsg(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '9px 14px',
                    borderRadius: '9px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: tab === 'register' ? '#6828DC' : 'transparent',
                    color: tab === 'register' ? '#FFFFFF' : '#64748B',
                    boxShadow: tab === 'register' ? '0 4px 14px rgba(104, 40, 220, 0.25)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Quick Register
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div style={{ padding: '0 24px 10px' }}>
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '10px',
                    padding: '9px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#DC2626',
                    fontSize: '12.5px',
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            {/* Form Body */}
            <div style={{ padding: '0 24px 24px' }}>
              {tab === 'login' ? (
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <AuthInputField
                    label="Email Address"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    compact
                  />

                  <AuthInputField
                    label="Password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    compact
                  />

                  <AuthSubmitButton
                    label="Sign In & Continue Enquiry"
                    loading={isLoading}
                    icon={Sparkles}
                    compact
                    style={{ marginTop: '6px' }}
                  />
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                  <AuthInputField
                    label="Full Name"
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    icon={User}
                    compact
                  />

                  <AuthInputField
                    label="Mobile Phone (for WhatsApp updates)"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    required
                    placeholder="+91 9876543210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    icon={Phone}
                    compact
                  />

                  <AuthInputField
                    label="Email Address"
                    type="email"
                    name="regEmail"
                    autoComplete="email"
                    required
                    placeholder="rahul@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    icon={Mail}
                    compact
                  />

                  <AuthInputField
                    label="Create Password"
                    type="password"
                    name="regPassword"
                    autoComplete="new-password"
                    required
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    icon={Lock}
                    compact
                  />

                  <AuthSubmitButton
                    label="Register & Submit Enquiry"
                    loading={isLoading}
                    icon={ShieldCheck}
                    compact
                    style={{ marginTop: '6px' }}
                  />
                </form>
              )}

              {/* Bottom Helpers */}
              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '14px',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#64748B',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} style={{ color: '#6828DC' }} />
                  <span>100% Privacy &amp; Data Security</span>
                </div>
                <button
                  type="button"
                  onClick={handleGoToFullLogin}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6828DC',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                >
                  <span>Full Sign In Page</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </EnquiryAuthContext.Provider>
  );
};

export const useEnquiryAuth = () => {
  const context = useContext(EnquiryAuthContext);
  if (!context) {
    throw new Error('useEnquiryAuth must be used within an EnquiryAuthProvider');
  }
  return context;
};
