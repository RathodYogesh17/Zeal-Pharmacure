import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
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

  // Step 1: Send OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.forgotPassword(email.trim());
      if (res.otp) {
        setDevOtp(res.otp);
      }
      setSuccessMessage(res.message || 'OTP sent successfully to your email address.');
      setStep(2);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setIsLoading(true);
      await authService.verifyOtp(email.trim(), otp.trim(), 'passwordReset');
      setSuccessMessage('OTP code verified! You can now set your new password.');
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

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
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
      case 1:
        return 'Forgot Password';
      case 2:
        return 'Verify Code';
      case 3:
        return 'Create New Password';
      case 4:
        return 'Password Reset!';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1:
        return 'Enter your registered email to receive a verification OTP code.';
      case 2:
        return `Enter the 6-digit OTP code sent to ${email}`;
      case 3:
        return 'Choose a strong password to secure your account.';
      case 4:
        return 'Your password has been changed. Redirecting to login...';
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            icon={Mail}
          />
          <AuthSubmitButton label="Send Reset Code" loading={isLoading} />
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === 2 && (
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

          <AuthSubmitButton label="Verify OTP" loading={isLoading} />

          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={16} />
            <span>Change email address</span>
          </button>
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
            onChange={(e) => setNewPassword(e.target.value)}
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
            onChange={(e) => setConfirmPassword(e.target.value)}
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
