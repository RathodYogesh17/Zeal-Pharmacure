import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { AuthCardLayout, AuthInputField, AuthSubmitButton } from '../../components/common/auth';

interface RegisterFieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});

  const clearFieldError = (field: keyof RegisterFieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const errs: RegisterFieldErrors = {};

    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    const rawDigits = phone.replace(/[\s\-\(\)\+]/g, '');
    const cleanPhone = rawDigits.length > 10 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;

    if (!phone.trim()) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    try {
      setIsLoading(true);
      const res = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        password,
        confirmPassword,
      });

      setSuccessMessage(res.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('email')) {
        setFieldErrors({ email: 'This email is already registered' });
      } else if (msg.toLowerCase().includes('phone')) {
        setFieldErrors({ phone: 'This mobile number is already registered' });
      } else {
        setErrorMessage(msg || 'Registration failed. Please check your information.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCardLayout
      title="Create an Account"
      subtitle={`Join ${settings.companyName || 'Zeal Pharmacure'} to explore products & track enquiries`}
      icon={UserPlus}
      errorMessage={errorMessage}
      successMessage={successMessage}
      maxWidth="480px"
      footer={
        <div>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ fontWeight: 800, color: '#6828DC', textDecoration: 'none' }}
          >
            Sign In
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AuthInputField
          label="Full Name"
          type="text"
          name="fullName"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError('name');
          }}
          error={fieldErrors.name}
          placeholder="e.g. Rahul Sharma"
          icon={User}
        />

        <AuthInputField
          label="Email Address"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError('email');
          }}
          error={fieldErrors.email}
          placeholder="name@example.com"
          icon={Mail}
        />

        <AuthInputField
          label="Mobile / WhatsApp Number"
          type="tel"
          name="phone"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearFieldError('phone');
          }}
          error={fieldErrors.phone}
          placeholder="e.g. 9876543210 (10 digits)"
          icon={Phone}
        />

        <AuthInputField
          label="Password (min 6 characters)"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearFieldError('password');
          }}
          error={fieldErrors.password}
          placeholder="••••••••"
          icon={Lock}
        />

        <AuthInputField
          label="Confirm Password"
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

        <AuthSubmitButton label="Create Account" loading={isLoading} style={{ marginTop: '8px' }} />
      </form>
    </AuthCardLayout>
  );
};
