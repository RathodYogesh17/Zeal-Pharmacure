import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@zealpharma.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
      padding: '24px',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      }}>
        {/* Brand Icon */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(104, 40, 220, 0.25)',
            border: '2px solid #EDE9FE',
            overflow: 'hidden',
          }}>
            <img
              src="/images/zeal-logo.png"
              alt="Zeal Pharma"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>
            Zeal Pharma Admin Portal
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
            Enter credentials to manage content, leads & products
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            padding: '12px 14px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94A3B8' }} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{
            background: '#F8FAFC',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontSize: '12px',
            color: '#64748B',
          }}>
            Default Superadmin: <strong>admin@zealpharma.com</strong> / <strong>Admin@123456</strong>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 700 }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/" style={{ fontSize: '13px', color: '#6828DC', fontWeight: 600 }}>
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
