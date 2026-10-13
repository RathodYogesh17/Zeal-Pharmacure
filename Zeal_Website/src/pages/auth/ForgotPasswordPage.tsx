import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowLeft, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { authService } from '../../api/authService';
import { AuthCardLayout, AuthInputField, AuthSubmitButton } from '../../components/common/auth';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Multi-step: 1 = Email, 2 = OTP, 3 = New Password, 4 = Done
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    otp?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const clearFieldError = (field: 'email' | 'otp' | 'newPassword' | 'confirmPassword') => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // OTP Countdown Timer (1 minute = 60 seconds)
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

  // Step 1: Send OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setFieldErrors({ email: 'Registered email address is required' });
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldErrors({ email: 'Please enter a valid email address' });
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.forgotPassword(email.trim());
      if (res.otp) {
        setDevOtp(res.otp);
      }
      setSuccessMessage(res.message || 'OTP sent successfully to your email. It expires in 1 minute.');
      setStep(2);
      startOtpCountdown();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      setIsLoading(true);
      const res = await authService.forgotPassword(email.trim());
      setSuccessMessage(res.message || 'New OTP sent to your email. It expires in 1 minute.');
      setOtp('');
      startOtpCountdown();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!otp.trim()) {
      setFieldErrors({ otp: 'Verification code is required' });
      return;
    } else if (otp.trim().length !== 6) {
      setFieldErrors({ otp: 'Please enter the 6-digit verification code' });
      return;
    }

    try {
      setIsLoading(true);
      await authService.verifyOtp(email.trim(), otp.trim(), 'passwordReset');
      setSuccessMessage('OTP code verified! You can now set your new password.');
      if (countdownRef.current) clearInterval(countdownRef.current);
      setOtpCountdown(0);
      setStep(3);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const errs: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword) {
      errs.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });

      setSuccessMessage(res.message || 'Password reset successfully!');
      setStep(4);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Forgot Password';
      case 2: return 'Verify Code';
      case 3: return 'Create New Password';
      case 4: return 'Password Reset!';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return 'Enter your registered email to receive a verification OTP code.';
      case 2: return `Enter the 6-digit OTP sent to ${email}. It expires in 1 minute.`;
      case 3: return 'Choose a strong password to secure your account.';
      case 4: return 'Your password has been changed. Redirecting to login...';
    }
  };

  return (
    <AuthCardLayout
      title={getStepTitle()}
      subtitle={getStepSubtitle()}
      icon={KeyRound}
      errorMessage={errorMessage}
      successMessage={successMessage}
      bannerContent={
        devOtp ? (
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
            🔑 Dev OTP: <strong>{devOtp}</strong>
          </div>
        ) : null
      }
      footer={
        <Link
          to="/login"
          style={{
            fontWeight: 700,
            color: '#6828DC',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </Link>
      }
    >
      {/* Step 1: Request OTP */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <AuthInputField
            label="Registered Email Address"
            type="email"
            name="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError('email');
            }}
            error={fieldErrors.email}
            placeholder="name@example.com"
            icon={Mail}
          />
          <AuthSubmitButton label="Send Reset Code" loading={isLoading} />
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Countdown Timer Banner */}
          <div
            style={{
              background: otpCountdown === 0 ? '#FEF2F2' : otpCountdown <= 15 ? '#FFF7ED' : '#F0FDF4',
              border: `1.5px solid ${otpCountdown === 0 ? '#FECACA' : otpCountdown <= 15 ? '#FED7AA' : '#BBF7D0'}`,
              borderRadius: '10px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
            }}
          >
            <span style={{ color: '#475569', fontSize: '12.5px' }}>
              OTP sent to <strong>{email}</strong>
            </span>
            {otpCountdown > 0 ? (
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '15px',
                  color: otpCountdown <= 15 ? '#DC2626' : '#059669',
                  minWidth: '52px',
                  textAlign: 'right',
                }}
              >
                ⏱ 0:{String(otpCountdown).padStart(2, '0')}
              </span>
            ) : (
              <span style={{ color: '#DC2626', fontWeight: 700, fontSize: '13px' }}>⚠️ Expired!</span>
            )}
          </div>

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
                fontSize: '26px',
                letterSpacing: '10px',
                textAlign: 'center',
                fontWeight: 800,
                borderRadius: '12px',
                border: `2px solid ${otpCountdown === 0 ? '#FECACA' : '#6828DC'}`,
                outline: 'none',
                boxSizing: 'border-box',
                background: otpCountdown === 0 ? '#FEF2F2' : '#FAF5FF',
                color: '#1E1B4B',
              }}
            />
            {otpCountdown === 0 && (
              <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '6px', textAlign: 'center' }}>
                OTP has expired. Please request a new code.
              </p>
            )}
          </div>

          <AuthSubmitButton
            label="Verify OTP"
            loading={isLoading}
            disabled={isLoading || otp.trim().length !== 6 || otpCountdown === 0}
          />

          {/* Resend / Change Email row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading || otpCountdown > 0}
              style={{
                background: 'none',
                border: 'none',
                color: otpCountdown > 0 ? '#94A3B8' : '#6828DC',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isLoading || otpCountdown > 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: 0,
              }}
            >
              <RefreshCw size={13} />
              <span>
                {otpCountdown > 0
                  ? `Resend in 0:${String(otpCountdown).padStart(2, '0')}`
                  : 'Resend New Code'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                if (countdownRef.current) clearInterval(countdownRef.current);
                setOtpCountdown(0);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: 0,
              }}
            >
              <ArrowLeft size={14} />
              <span>Change email</span>
            </button>
          </div>
        </form>
      )}

      {/* Step 3: New Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AuthInputField
            label="New Password (min 6 chars)"
            type="password"
            name="newPassword"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              clearFieldError('newPassword');
            }}
            error={fieldErrors.newPassword}
            placeholder="••••••••"
            icon={Lock}
          />

          <AuthInputField
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearFieldError('confirmPassword');
            }}
            error={fieldErrors.confirmPassword}
            placeholder="••••••••"
            icon={Lock}
          />

          <AuthSubmitButton label="Update Password" loading={isLoading} style={{ marginTop: '8px' }} />
        </form>
      )}

      {/* Step 4: Complete */}
      {step === 4 && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#16A34A',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={36} />
          </div>
          <p style={{ fontSize: '15px', color: '#334155', fontWeight: 600, marginBottom: '20px' }}>
            Your password has been successfully updated!
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #6828DC 100%)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontWeight: 800,
              boxShadow: '0 6px 18px rgba(104, 40, 220, 0.35)',
            }}
          >
            <span>Proceed to Sign In</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </AuthCardLayout>
  );
};
