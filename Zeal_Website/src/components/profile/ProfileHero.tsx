import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  BadgeCheck,
  Mail,
  Phone,
  Building2,
  Calendar,
  Sparkles,
  LogOut,
  Pill,
} from 'lucide-react';
import type { IUser } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { getRoleDisplayName, cleanDesignationValue } from '../../utils/roleUtils';

export interface ProfileHeroProps {
  user: IUser;
  designation: string;
  companyName: string;
  profileImagePreview: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenFranchise: () => void;
  onLogout: () => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  user,
  designation,
  companyName,
  profileImagePreview,
  onImageSelect,
  onOpenFranchise,
  onLogout,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = profileImagePreview || user.profileImage || null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Registered Member';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #13092D 0%, #240E54 35%, #3B1278 70%, #5B21B6 100%)',
        borderRadius: '24px',
        padding: '38px 34px',
        color: '#FFFFFF',
        boxShadow: '0 20px 45px -10px rgba(30, 10, 70, 0.45), 0 0 0 1px rgba(168, 85, 247, 0.2)',
        marginBottom: '26px',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.32) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-70px',
          left: '20%',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '26px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Left: Avatar & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                border: '3.5px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.4), 0 0 20px rgba(168, 85, 247, 0.4)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FAF5FF',
                flexShrink: 0,
              }}
            >
              <UserAvatar
                src={currentImage}
                name={user.name}
                size={96}
                fontSize={38}
                className="w-full h-full"
              />
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImageSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Camera upload badge */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload / Change Profile Photo"
              style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FFFFFF',
                color: '#6828DC',
                border: '2px solid #EDE9FE',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.18s ease',
              }}
            >
              <Camera size={15} />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '27px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px', color: '#FFFFFF', fontFamily: 'var(--font-heading, "Outfit", sans-serif)' }}>
                {user.name}
              </h1>
              {(() => {
                const staffRoleTitle = getRoleDisplayName(user.role);
                const cleanDesig = cleanDesignationValue(designation);
                const badgeText = staffRoleTitle || cleanDesig || 'Pharma Partner';
                return (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(16, 185, 129, 0.16)',
                      border: '1px solid rgba(52, 211, 153, 0.4)',
                      color: '#6EE7B7',
                      padding: '3px 12px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <BadgeCheck size={14} color="#34D399" />
                    <span>{badgeText}</span>
                  </span>
                );
              })()}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '13px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '4px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}>
                <Mail size={13} style={{ color: '#C4B5FD' }} />
                <span>{user.email}</span>
              </span>
              {user.phone && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}>
                  <Phone size={13} style={{ color: '#C4B5FD' }} />
                  <span>{user.phone}</span>
                </span>
              )}
              {companyName && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}>
                  <Building2 size={13} style={{ color: '#C4B5FD' }} />
                  <span>{companyName}</span>
                </span>
              )}
            </div>

            {user.createdAt && (
              <div style={{ marginTop: '10px', opacity: 0.75, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={13} />
                <span>Member since {formatDate(user.createdAt)}</span>
                <span>&bull;</span>
                <span>Account ID: ZP-{user._id.slice(-6).toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to="/products"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              padding: '11px 18px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              transition: 'all 0.2s ease',
            }}
          >
            <Pill size={15} style={{ color: '#DDD6FE' }} />
            <span>View Formulations</span>
          </Link>

          <button
            type="button"
            onClick={onOpenFranchise}
            style={{
              background: '#FFFFFF',
              color: '#4C1D95',
              border: 'none',
              padding: '11px 20px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.22)',
              transition: 'all 0.2s ease',
            }}
          >
            <Sparkles size={15} color="#7C3AED" />
            <span>Apply for Stockists / Distribution</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            title="Sign out of account"
            style={{
              background: 'rgba(239, 68, 68, 0.18)',
              color: '#FECACA',
              padding: '11px 15px',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
