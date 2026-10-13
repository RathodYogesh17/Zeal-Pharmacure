import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { AuthCardLayout, AuthInputField, AuthSubmitButton } from '../../components/common/auth';

export const LoginPage: React.FC = () => {
  const { login, verifyOtp, isAuthenticated } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 2FA OTP state
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const clearFieldError = (field: 'email' | 'password') => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const errs: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    try {
      setIsLoading(true);
      const res = await login(email, password);

      if (res.otpRequired) {
        setOtpRequired(true);
        if (res.otp) {
          setDevOtpHint(res.otp);
        }
        setSuccessMessage(res.message || 'Security OTP code sent to your email.');
      } else {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/profile', { replace: true });
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6-digit verification code.');
      return;
    }

    try {
      setIsLoading(true);
      await verifyOtp(email, otp.trim(), 'adminLogin');
      setSuccessMessage('Verification successful! Redirecting...');
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title={otpRequired ? 'Security Verification' : 'Welcome Back'}
      subtitle={
        otpRequired
          ? `Enter the 6-digit code sent to ${email}`
          : `Sign in to access your ${settings.companyName || 'Zeal Pharmacure'} account`
      }
      icon={otpRequired ? ShieldCheck : Sparkles}
      errorMessage={errorMessage}
      successMessage={successMessage}
      bannerContent={
        devOtpHint ? (
          <div
            style={{
              background: '#FEF3C7',
              border: '1px dashed #F59E0B',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '12.5px',
              color: '#92400E',
              marginBottom: '18px',
              textAlign: 'center',
            }}
          >
            🔑 Dev OTP: <strong>{devOtpHint}</strong>
          </div>
        ) : null
      }
      footer={
        <div>
          Don&apos;t have an account yet?{' '}
          <Link
            to="/register"
            style={{ fontWeight: 700, color: '#6828DC', textDecoration: 'none' }}
          >
            Create Account
          </Link>
        </div>
      }
    >
      {!otpRequired ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <AuthInputField
            label="Email Address"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError('email');
            }}
            error={fieldErrors.email}
            placeholder="name@example.com"
            icon={Mail}
          />

          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: '12px', fontWeight: 700, color: '#6828DC', textDecoration: 'none' }}
              >
                Forgot Password?
              </Link>
            </div>
            <AuthInputField
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError('password');
              }}
              error={fieldErrors.password}
              placeholder="••••••••"
              icon={Lock}
            />
          </div>

          <AuthSubmitButton label="Sign In" loading={isLoading} style={{ marginTop: '6px' }} />
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              required
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '24px',
                letterSpacing: '8px',
                textAlign: 'center',
                fontWeight: 700,
                borderRadius: '12px',
                border: '2px solid #6828DC',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#FAF5FF',
              }}
            />
          </div>

          <AuthSubmitButton label="Verify Code" loading={isLoading} />

          <button
            type="button"
            onClick={() => setOtpRequired(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6828DC',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Back to password login
          </button>
        </form>
      )}
    </AuthCardLayout>
  );
};
