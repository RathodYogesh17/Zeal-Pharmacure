import React from 'react';
import { User, FileText, KeyRound, LogOut } from 'lucide-react';
import type { IUser } from '../../types';

export type ProfileTabType = 'profile' | 'enquiries' | 'security';

export interface ProfileSidebarProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
  user?: IUser;
  onLogout: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
  user: _user,
  onLogout,
}) => {
  const tabs = [
    { id: 'profile' as ProfileTabType, label: 'Personal & Business', icon: <User size={18} /> },
    { id: 'enquiries' as ProfileTabType, label: 'My Inquiries & Requests', icon: <FileText size={18} /> },
    { id: 'security' as ProfileTabType, label: 'Security & Password', icon: <KeyRound size={18} /> },
  ];

  return (
    <div className="zp-tab-list">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`zp-tab-btn ${isSelected ? 'is-active' : ''}`}
          >
            <span style={{ color: isSelected ? 'var(--zp-primary)' : '#94A3B8', display: 'flex' }}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}

      <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '8px 0' }} />

      <button
        type="button"
        onClick={onLogout}
        className="zp-tab-btn"
        style={{ color: '#EF4444', marginTop: '4px' }}
      >
        <LogOut size={16} />
        <span>Sign Out Account</span>
      </button>
    </div>
  );
};
