import React, { useState } from 'react';
import { Lock, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { FormAlert } from '../common/FormAlert';

export interface ProfileSecurityTabProps {
  onSubmit: (e: React.FormEvent) => void;
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  isChanging: boolean;
  successMsg: string | null;
  errorMsg: string | null;
}

export const ProfileSecurityTab: React.FC<ProfileSecurityTabProps> = ({
  onSubmit,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isChanging,
  successMsg,
  errorMsg,
}) => {
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  return (
    <div className="zp-card">
      <div className="zp-card-header">
        <div>
          <h2 className="zp-card-title">Security &amp; Account Access</h2>
          <p className="zp-card-subtitle">
            Manage your login credentials and enhance your account protection.
          </p>
        </div>
      </div>

      <FormAlert type="success" message={successMsg} />
      <FormAlert type="error" message={errorMsg} />

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '520px' }}>
        {/* Current Password */}
        <div>
          <label className="zp-label">Current Password *</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type={showCurrentPwd ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current account password"
              className="zp-input"
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPwd(!showCurrentPwd)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="zp-label">New Password * (Min. 6 characters)</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type={showNewPwd ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter secure new password"
              className="zp-input"
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowNewPwd(!showNewPwd)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="zp-label">Confirm New Password *</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type={showConfirmPwd ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="zp-input"
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPwd(!showConfirmPwd)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
              }}
            >
              {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ paddingTop: '8px' }}>
          <button
            type="submit"
            disabled={isChanging}
            className="zp-btn-primary"
            style={{ padding: '11px 24px', fontSize: '13.5px' }}
          >
            {isChanging ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <KeyRound size={16} />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
