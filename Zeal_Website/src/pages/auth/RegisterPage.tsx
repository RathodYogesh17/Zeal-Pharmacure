import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { AuthCardLayout, AuthInputField, AuthSubmitButton } from '../../components/common/auth';

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

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        confirmPassword,
      });

      setSuccessMessage(res.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your information and try again.');
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
          onChange={(e) => setName(e.target.value)}
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
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98765 43210"
          icon={Phone}
        />

        <AuthInputField
          label="Password (min 6 characters)"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          icon={Lock}
        />

        <AuthSubmitButton label="Create Account" loading={isLoading} style={{ marginTop: '8px' }} />
      </form>
    </AuthCardLayout>
  );
};
