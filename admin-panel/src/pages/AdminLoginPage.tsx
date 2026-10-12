import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';

type AuthViewMode = 'LOGIN' | 'OTP' | 'FORGOT_REQUEST' | 'FORGOT_OTP' | 'FORGOT_NEW_PASSWORD';

export const AdminLoginPage: React.FC = () => {
  const [mode, setMode] = useState<AuthViewMode>('LOGIN');

  // Login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification state (Admin / Super Admin Login 2FA)
  const [otpCode, setOtpCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // OTP Countdown Timer (1 minute = 60 seconds) for forgot password
  const [otpCountdown, setOtpCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startOtpCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setOtpCountdown(60);
    countdownRef.current = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const { login, verifyOtp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // ==========================================
  // 1. HANDLE LOGIN SUBMIT
  // ==========================================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await login(email.trim(), password);
      if (res && res.requiresOtp) {
        setPendingEmail(email.trim());
        setMode('OTP');
        setOtpCode('');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email address or password.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 2. HANDLE OTP VERIFICATION (ADMIN / SUPER ADMIN 2FA)
  // ==========================================
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpCode.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOtp(pendingEmail, cleanOtp);
      navigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend Login OTP
  const handleResendLoginOtp = async () => {
    if (!pendingEmail) return;
    setLoading(true);
    setError('');
    try {
      await authService.login(pendingEmail, password);
      setSuccessMessage('New OTP code has been sent to your email.');
    } catch (err: any) {
      setError(err?.message || 'Failed to resend OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 3. FORGOT PASSWORD - STEP 1 (REQUEST OTP)
  // ==========================================
  const handleForgotRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await authService.forgotPassword(forgotEmail.trim());
      setSuccessMessage(res.message || 'Verification OTP sent to your email. It expires in 1 minute.');
      setMode('FORGOT_OTP');
      setForgotOtp('');
      startOtpCountdown();
    } catch (err: any) {
      setError(err?.message || 'Unable to send password reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 4. FORGOT PASSWORD - STEP 2 (VERIFY OTP)
  // ==========================================
  const handleForgotOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = forgotOtp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await authService.verifyResetOtp(forgotEmail.trim(), cleanOtp);
      setSuccessMessage('OTP code verified successfully! Now create your new password.');
      setMode('FORGOT_NEW_PASSWORD');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend Forgot OTP
  const handleResendForgotOtp = async () => {
    if (!forgotEmail.trim()) return;
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await authService.forgotPassword(forgotEmail.trim());
      setSuccessMessage('New verification OTP sent to your email. It expires in 1 minute.');
      startOtpCountdown();
    } catch (err: any) {
      setError(err?.message || 'Failed to resend OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 5. FORGOT PASSWORD - STEP 3 (CREATE NEW PASSWORD)
  // ==========================================
  const handleForgotNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotNewPassword || forgotNewPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await authService.resetPassword({
        email: forgotEmail.trim(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword,
        confirmPassword: forgotConfirmPassword,
      });

      setEmail(forgotEmail.trim());
      setPassword('');
      setSuccessMessage(res.message || 'Password updated successfully! Please sign in with your new password.');
      setMode('LOGIN');
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    } catch (err: any) {
      setError(err?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
        padding: '24px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '38px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          position: 'relative',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 8px 24px rgba(104, 40, 220, 0.25)',
              border: '2px solid #EDE9FE',
              overflow: 'hidden',
            }}
          >
            <img
              src="/images/zeal-logo.png"
              alt="Zeal Pharma"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {mode === 'LOGIN' && (
            <>
              <h2 style={{ fontSize: '23px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Zeal Pharma Portal
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '5px' }}>
                Enter your credentials to access your dashboard
              </p>
            </>
          )}

          {mode === 'OTP' && (
            <>
              <h2 style={{ fontSize: '23px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Two-Factor Verification
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '5px' }}>
                Enter the 6-digit OTP code sent for{' '}
                <strong style={{ color: '#0F172A' }}>{pendingEmail}</strong>
              </p>
            </>
          )}

          {mode === 'FORGOT_REQUEST' && (
            <>
              <h2 style={{ fontSize: '23px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Forgot Password
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '5px' }}>
                Enter your email address to receive a password reset OTP code
              </p>
            </>
          )}

          {mode === 'FORGOT_OTP' && (
            <>
              <h2 style={{ fontSize: '23px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Verify Reset OTP
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '5px' }}>
                Enter the 6-digit OTP code sent to <strong style={{ color: '#0F172A' }}>{forgotEmail}</strong>
              </p>
            </>
          )}

          {mode === 'FORGOT_NEW_PASSWORD' && (
            <>
              <h2 style={{ fontSize: '23px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Set New Password
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '5px' }}>
                Create a new password for <strong style={{ color: '#0F172A' }}>{forgotEmail}</strong>
              </p>
            </>
          )}
        </div>

        {/* Global Feedback: Error */}
        {error && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: '11px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              marginBottom: '18px',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        {/* Global Feedback: Success */}
        {successMessage && (
          <div
            style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              padding: '11px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              marginBottom: '18px',
              lineHeight: 1.4,
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0, color: '#10B981' }} />
            <div>{successMessage}</div>
          </div>
        )}

        {/* ==================================================== */}
        {/* VIEW 1: LOGIN FORM */}
        {/* ==================================================== */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
                <input
                  type="email"
                  required
                  placeholder="name@zealpharma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#6828DC')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMessage('');
                    setForgotEmail(email);
                    setMode('FORGOT_REQUEST');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6828DC',
                    cursor: 'pointer',
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 40px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#6828DC')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ==================================================== */}
        {/* VIEW 2: OTP VERIFICATION */}
        {/* ==================================================== */}
        {mode === 'OTP' && (
          <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px', textAlign: 'center' }}>
                Enter 6-Digit OTP Code
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: '#6828DC' }} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 46px',
                    borderRadius: '8px',
                    border: '2px solid #8B5CF6',
                    fontSize: '20px',
                    fontWeight: 800,
                    letterSpacing: '6px',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={17} />
                  <span>Verify OTP & Sign In</span>
                </>
              )}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setError('');
                  setSuccessMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </button>

              <button
                type="button"
                onClick={handleResendLoginOtp}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6828DC',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* ==================================================== */}
        {/* VIEW 3: FORGOT PASSWORD - STEP 1 (REQUEST OTP) */}
        {/* ==================================================== */}
        {mode === 'FORGOT_REQUEST' && (
          <form onSubmit={handleForgotRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
                <input
                  type="email"
                  required
                  placeholder="name@zealpharma.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send Reset OTP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setError('');
                  setSuccessMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6828DC',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </button>
            </div>
          </form>
        )}

        {/* ==================================================== */}
        {/* VIEW 4: FORGOT PASSWORD - STEP 2 (VERIFY OTP) */}
        {/* ==================================================== */}
        {mode === 'FORGOT_OTP' && (
          <form onSubmit={handleForgotOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Countdown Timer Banner */}
            <div
              style={{
                background: otpCountdown === 0 ? '#FEF2F2' : otpCountdown <= 15 ? '#FFF7ED' : '#F0FDF4',
                border: `1px solid ${otpCountdown === 0 ? '#FECACA' : otpCountdown <= 15 ? '#FED7AA' : '#BBF7D0'}`,
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px',
              }}
            >
              <span style={{ color: '#475569' }}>OTP sent to <strong>{forgotEmail}</strong></span>
              {otpCountdown > 0 ? (
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '14px',
                    color: otpCountdown <= 15 ? '#DC2626' : '#059669',
                    minWidth: '50px',
                    textAlign: 'right',
                    animation: otpCountdown <= 15 ? 'pulse 1s infinite' : 'none',
                  }}
                >
                  ⏱ 0:{String(otpCountdown).padStart(2, '0')}
                </span>
              ) : (
                <span style={{ color: '#DC2626', fontWeight: 700, fontSize: '13px' }}>Expired!</span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                6-Digit OTP Code
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#6828DC' }} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '8px',
                    border: `1.5px solid ${otpCountdown === 0 ? '#FECACA' : '#8B5CF6'}`,
                    fontSize: '22px',
                    fontWeight: 800,
                    letterSpacing: '6px',
                    outline: 'none',
                    textAlign: 'center',
                    color: '#1E1B4B',
                    background: otpCountdown === 0 ? '#FEF2F2' : '#FAFAFA',
                  }}
                />
              </div>
              {otpCountdown === 0 && (
                <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '6px', textAlign: 'center' }}>
                  OTP has expired. Please resend a new code.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || forgotOtp.trim().length !== 6 || otpCountdown === 0}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading || forgotOtp.trim().length !== 6 || otpCountdown === 0 ? 'not-allowed' : 'pointer',
                opacity: otpCountdown === 0 ? 0.5 : 1,
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Verifying OTP...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  <span>Confirm OTP & Proceed</span>
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleResendForgotOtp}
                disabled={loading || otpCountdown > 0}
                style={{
                  background: 'none',
                  border: 'none',
                  color: otpCountdown > 0 ? '#94A3B8' : '#6828DC',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: loading || otpCountdown > 0 ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                }}
              >
                <RefreshCw size={13} />
                <span>{otpCountdown > 0 ? `Resend in 0:${String(otpCountdown).padStart(2, '0')}` : 'Resend New Code'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('FORGOT_REQUEST');
                  setError('');
                  setSuccessMessage('');
                  if (countdownRef.current) clearInterval(countdownRef.current);
                  setOtpCountdown(0);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {/* ==================================================== */}
        {/* VIEW 5: FORGOT PASSWORD - STEP 3 (CREATE NEW PASSWORD) */}
        {/* ==================================================== */}
        {mode === 'FORGOT_NEW_PASSWORD' && (
          <form onSubmit={handleForgotNewPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                New Password (Min 8 Characters)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
                <input
                  type={showForgotNewPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 40px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showForgotNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
                <input
                  type={showForgotNewPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Saving New Password...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  <span>Create New Password & Sign In</span>
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setError('');
                  setSuccessMessage('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                }}
              >
                <ArrowLeft size={14} />
                <span>Cancel & Back to Login</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Back Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
          <Link to="/" style={{ fontSize: '13px', color: '#6828DC', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
