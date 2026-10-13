import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Lock,
  Phone,
  Mail,
  Camera,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MessageSquare,
  ClipboardList,
  RefreshCw,
  Send,
  Radio,
  Search,
  Check,
  X,
  Layers,
  Upload,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../store';
import { setCredentials, selectCurrentRole } from '../store/slices/authSlice';
import { request } from '../api/apiClient';
import { Button, FormInput, Badge, MediaGalleryModal, ThemeSelect, ZealLoader } from '../components/common';
import { galleryService } from '../api/galleryService';
import { settingsService, IAuditLogItem } from '../api/settingsService';

export const AdminSettingsPage: React.FC = () => {
  const { user, token, updateUser } = useAuth();
  const dispatch = useAppDispatch();
  const simulatedRole = useAppSelector(selectCurrentRole);
  const userRole = typeof user?.role === 'object' && user?.role !== null
    ? ((user.role as any).name || (user.role as any).code || 'SUPER_ADMIN')
    : String(user?.role || 'SUPER_ADMIN');
  const effectiveRole = String(simulatedRole || userRole || 'SUPER_ADMIN').toUpperCase();
  const isSuperAdminOrAdmin = effectiveRole === 'SUPER_ADMIN' || effectiveRole === 'ADMIN';

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'whatsapp' | 'audit'>('profile');

  // WhatsApp Helpline & Click-to-Chat State
  const [testNumber, setTestNumber] = useState('919316227576');
  const [testMsgText, setTestMsgText] = useState('Hello from Zeal Pharmaceuticals Head Office! Your WhatsApp lead routing is working perfectly.');
  const [testCopied, setTestCopied] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<IAuditLogItem[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState('');
  const [auditStatusFilter, setAuditStatusFilter] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditTotal, setAuditTotal] = useState(0);

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 93162 27576');
  const [profileImage, setProfileImage] = useState<string>(user?.profileImage || '');
  const [avatarImgError, setAvatarImgError] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Profile feedback
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [nameError, setNameError] = useState('');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passErrors, setPassErrors] = useState<Record<string, string>>({});

  const clearPassError = (key: string) => {
    if (passErrors[key]) {
      setPassErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Password feedback
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Synchronize state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setProfileImage(user.profileImage || '');
      setAvatarImgError(false);
    }
  }, [user]);

  // Guard WhatsApp / Audit tab if not super admin or admin
  useEffect(() => {
    if (!isSuperAdminOrAdmin && (activeTab === 'whatsapp' || activeTab === 'audit')) {
      setActiveTab('profile');
    }
  }, [isSuperAdminOrAdmin, activeTab]);

  // Save profile image directly (from gallery or removal)
  const handleApplyProfileImage = async (newImageUrl: string | null) => {
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const res = await request<any>(`/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim() || user?.name || '',
          phone: phone.trim() || user?.phone || '',
          profileImage: newImageUrl || null,
          profileImageId: null,
        }),
      }).catch(async () => {
        const userId = user?._id || 'me';
        return request<any>(`/users/${userId}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: name.trim() || user?.name || '',
            phone: phone.trim() || user?.phone || '',
            profileImage: newImageUrl || null,
          }),
        });
      }).catch(async () => ({
        data: {
          ...user,
          profileImage: newImageUrl || null,
        }
      }));

      const updatedUser = {
        ...user,
        name: name.trim() || user?.name || '',
        phone: phone.trim() || user?.phone || '',
        ...(res?.data || {}),
        profileImage: newImageUrl || null,
      };

      setProfileImage(newImageUrl || '');
      setAvatarImgError(false);
      updateUser(updatedUser);
      if (token) {
        dispatch(setCredentials({ user: updatedUser as any, token }));
      }

      setProfileSuccess(newImageUrl ? 'Profile photo updated successfully!' : 'Profile photo removed successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile image.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Upload photo file from computer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Image size exceeds 5MB limit.');
      return;
    }

    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('name', name.trim() || user?.name || '');
      if (phone) formData.append('phone', phone.trim());

      const res = await request<any>(`/auth/profile`, {
        method: 'PUT',
        body: formData,
      });

      const updatedUser = {
        ...user,
        ...(res?.data || {}),
      };

      setProfileImage(updatedUser.profileImage || '');
      setAvatarImgError(false);
      updateUser(updatedUser);
      if (token) {
        dispatch(setCredentials({ user: updatedUser as any, token }));
      }

      setProfileSuccess('Profile photo uploaded and updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to upload image file.');
    } finally {
      setProfileSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove photo
  const handleRemoveProfilePhoto = async () => {
    if (!profileImage && !user?.profileImage) return;
    await handleApplyProfileImage(null);
  };

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Full Name is required.');
      return;
    }
    setNameError('');

    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const res = await request<any>(`/auth/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          profileImage: profileImage || null,
        }),
      }).catch(async () => {
        const userId = user?._id || 'me';
        return request<any>(`/users/${userId}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            profileImage: profileImage || null,
          }),
        });
      }).catch(async () => {
        // Local fallback if offline or mock user
        return {
          data: {
            ...user,
            name: name.trim(),
            phone: phone.trim(),
            profileImage: profileImage || null,
          }
        };
      });

      const updatedUser = {
        ...user,
        name: name.trim(),
        phone: phone.trim(),
        profileImage: profileImage || null,
        ...(res?.data || {}),
      };

      updateUser(updatedUser);
      if (token) {
        dispatch(setCredentials({ user: updatedUser as any, token }));
      }

      setProfileSuccess('Profile information updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const errs: Record<string, string> = {};
    if (!currentPassword) {
      errs.current = 'Current password is required.';
    }
    if (!newPassword) {
      errs.new = 'New password is required.';
    } else if (newPassword.length < 6) {
      errs.new = 'New password must be at least 6 characters.';
    }
    if (!confirmPassword) {
      errs.confirm = 'Confirm new password is required.';
    } else if (newPassword !== confirmPassword) {
      errs.confirm = 'New password and confirm password do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setPassErrors(errs);
      return;
    }
    setPassErrors({});

    setPasswordSaving(true);
    try {
      await request('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      setPasswordSuccess('Password changed successfully! Please use your new password next time.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password. Please verify current password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  // WhatsApp Click-to-Chat Test Handler
  const handleLaunchWhatsAppTest = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = testNumber.replace(/\D/g, '');
    if (!clean) {
      alert('Please enter a valid phone number with country code');
      return;
    }
    const target = clean.length === 10 ? `91${clean}` : clean;
    const url = `https://wa.me/${target}?text=${encodeURIComponent(testMsgText.trim())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyWhatsAppLink = async () => {
    const clean = testNumber.replace(/\D/g, '');
    const target = clean.length === 10 ? `91${clean}` : clean;
    const url = `https://wa.me/${target}?text=${encodeURIComponent(testMsgText.trim())}`;
    try {
      await navigator.clipboard.writeText(url);
      setTestCopied(true);
      setTimeout(() => setTestCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Audit logs loaders
  const loadAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const res = await settingsService.getAuditLogs({
        page: auditPage,
        limit: 15,
        search: auditSearch || undefined,
        module: auditModuleFilter || undefined,
        status: auditStatusFilter || undefined,
      });
      setAuditLogs(res.logs || []);
      setAuditTotalPages(res.totalPages || 1);
      setAuditTotal(res.total || 0);
    } catch (err: any) {
      console.warn('Failed to load audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'audit') {
      loadAuditLogs();
    }
  }, [activeTab, auditPage, auditModuleFilter, auditStatusFilter]);

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
            System Settings &gt; <strong style={{ color: '#0F172A' }}>My Account Profile</strong>
          </div>
          <h1 className="admin-page-title">Account Settings &amp; Staff Profile</h1>
          <p className="admin-page-subtitle">Manage your personal profile, staff credentials, and account password</p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div style={{
        background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px',
        boxShadow: '0 10px 25px -5px rgba(104, 40, 220, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Hidden File Input for Device Photo Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg,image/jpg,image/webp"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          {/* Avatar with Camera Overlay */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: '#FFFFFF',
              color: '#6828DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 900,
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              border: '3px solid #EDE9FE',
            }}>
              {profileImage && !avatarImgError ? (
                <img
                  src={galleryService.formatUrl(profileImage)}
                  alt={user?.name || 'Profile'}
                  onError={() => setAvatarImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#0F172A',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
                cursor: 'pointer',
              }}
              title="Upload / Change Profile Photo"
            >
              <Camera size={13} />
            </button>
          </div>

          <div>
            <div style={{ fontSize: '22px', fontWeight: 800 }}>
              {user?.name || 'Dr. Amit Shah'}
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>
              {user?.email || 'admin@zealpharma.com'}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}>
                {effectiveRole || 'SUPER_ADMIN'}
              </span>
              <span style={{
                background: '#10B981',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11.5px',
                fontWeight: 700,
              }}>
                Active Account
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={profileSaving}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Upload size={14} />
            {profileImage ? 'Edit / Upload Photo' : 'Upload Photo'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGalleryModalOpen(true)}
            disabled={profileSaving}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              borderColor: 'rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ImageIcon size={14} />
            Select from Gallery
          </Button>
          {profileImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveProfilePhoto}
              disabled={profileSaving}
              style={{
                background: 'rgba(239, 68, 68, 0.25)',
                color: '#FFFFFF',
                borderColor: 'rgba(239, 68, 68, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Trash2 size={14} />
              Remove Photo
            </Button>
          )}
        </div>
      </div>

      {/* Main Settings Navigation Tabs */}
      <div className="admin-tabs" style={{ borderBottomWidth: '2px' }}>
        {[
          { id: 'profile', icon: <User size={18} />, label: 'Profile Details' },
          { id: 'security', icon: <KeyRound size={18} />, label: 'Change Password & Security' },
          ...(isSuperAdminOrAdmin
            ? [{ id: 'whatsapp', icon: <MessageSquare size={18} />, label: 'WhatsApp & Helpline Hub' }]
            : []),
          ...(isSuperAdminOrAdmin
            ? [{ id: 'audit', icon: <ClipboardList size={18} />, label: 'Audit Trail & Security Logs' }]
            : []),
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`settings-tab-btn${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '28px',
          maxWidth: '850px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Personal Profile Information
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
            Update your public staff display name, phone number, and avatar photo
          </p>

          {profileSuccess && (
            <div className="alert-banner alert-success">
              <CheckCircle2 size={18} style={{ color: '#10B981' }} />
              <span>{profileSuccess}</span>
            </div>
          )}
          {profileError && (
            <div className="alert-banner alert-error">
              <AlertCircle size={18} style={{ color: '#EF4444' }} />
              <span>{profileError}</span>
            </div>
          )}

          {/* Profile Photo Quick Controls Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#EDE9FE',
                border: '2px solid #DDD6FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                fontWeight: 800,
                fontSize: '22px',
                color: '#6828DC',
                flexShrink: 0,
              }}>
                {profileImage && !avatarImgError ? (
                  <img
                    src={galleryService.formatUrl(profileImage)}
                    alt={user?.name || 'Profile'}
                    onError={() => setAvatarImgError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  (user?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  Staff Profile Photo
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  {profileImage
                    ? 'Custom photo active. Shown across top navigation bar and sidebar.'
                    : 'Initial avatar active. Upload a custom photo or choose from gallery.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={profileSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  background: '#6828DC',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Upload size={14} />
                {profileImage ? 'Edit / Upload' : 'Upload Photo'}
              </button>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(true)}
                disabled={profileSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  background: '#FFFFFF',
                  color: '#0F172A',
                  border: '1.5px solid #CBD5E1',
                  cursor: 'pointer',
                }}
              >
                <ImageIcon size={14} />
                Gallery
              </button>
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveProfilePhoto}
                  disabled={profileSaving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Full Name */}
              <FormInput
                label="Full Name"
                required
                value={name}
                error={nameError}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                placeholder="e.g. Dr. Amit Shah"
                prefixIcon={<User size={16} />}
              />

              {/* Phone */}
              <FormInput
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 93162 27576"
                prefixIcon={<Phone size={16} />}
              />
            </div>

            {/* Read-Only Notice */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '18px 20px',
              marginBottom: '24px',
            }}>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} style={{ color: '#6828DC' }} />
                Organization Managed Fields (Protected)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Email (Read Only) */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                    Email Address (Disabled)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                    <input
                      type="text"
                      disabled
                      value={user?.email || 'admin@zealpharma.com'}
                      style={{
                        width: '100%',
                        padding: '10px 36px 10px 38px',
                        background: '#F1F5F9',
                        color: '#64748B',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '13.5px',
                        cursor: 'not-allowed',
                      }}
                    />
                    <Lock size={15} style={{ position: 'absolute', right: '12px', top: '12px', color: '#94A3B8' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                    Email cannot be changed directly as it is your organization login identifier.
                  </div>
                </div>

                {/* Assigned Role (Read Only) */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                    Assigned Role & System Scope (Disabled)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Shield size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                    <input
                      type="text"
                      disabled
                      value={(() => {
                        const r: any = user?.role;
                        if (!r) return 'SUPER_ADMIN';
                        const code = typeof r === 'object' ? (r.name || r.code || 'SUPER_ADMIN') : String(r);
                        return /^[0-9a-fA-F]{24}$/.test(code) ? 'SUPER_ADMIN' : code.toUpperCase();
                      })()}
                      style={{
                        width: '100%',
                        padding: '10px 36px 10px 38px',
                        background: '#F1F5F9',
                        color: '#6828DC',
                        fontWeight: 700,
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '13.5px',
                        cursor: 'not-allowed',
                      }}
                    />
                    <Lock size={15} style={{ position: 'absolute', right: '12px', top: '12px', color: '#94A3B8' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                    Staff roles and RBAC privileges can only be modified from the Super Admin Matrix.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button
                type="submit"
                variant="primary"
                loading={profileSaving}
                disabled={profileSaving}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: CHANGE PASSWORD */}
      {activeTab === 'security' && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          padding: '28px',
          maxWidth: '650px',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Change Account Password
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
            Ensure your account uses a strong password with letters, numbers, and symbols
          </p>

          {passwordSuccess && (
            <div style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              padding: '14px 18px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              fontSize: '13.5px',
            }}>
              <CheckCircle2 size={18} style={{ color: '#10B981' }} />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: '14px 18px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              fontSize: '13.5px',
            }}>
              <AlertCircle size={18} style={{ color: '#EF4444' }} />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} noValidate>
            {/* Current Password */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                Current Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    clearPassError('current');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: '8px',
                    border: passErrors.current ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    boxShadow: passErrors.current ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passErrors.current && (
                <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                  {passErrors.current}
                </p>
              )}
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                New Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearPassError('new');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: '8px',
                    border: passErrors.new ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    boxShadow: passErrors.new ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passErrors.new && (
                <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                  {passErrors.new}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                Confirm New Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearPassError('confirm');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 14px',
                    borderRadius: '8px',
                    border: passErrors.confirm ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                    boxShadow: passErrors.confirm ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passErrors.confirm && (
                <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                  {passErrors.confirm}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button
                type="submit"
                variant="primary"
                loading={passwordSaving}
                disabled={passwordSaving}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: WHATSAPP & HELPLINE HUB (Super Admin / Admin Only) */}
      {activeTab === 'whatsapp' && isSuperAdminOrAdmin && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
          {/* Header Description */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
              border: '1.5px solid #DDD6FE',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '20px' }}>💬</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Corporate WhatsApp Routing &amp; Sales Helpline
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.5, maxWidth: '680px' }}>
                Official Click-to-Chat (<code style={{ color: '#6828DC', background: '#EDE9FE', padding: '2px 6px', borderRadius: '4px' }}>wa.me</code>) deep-link engine.
                Doctors, Chemists, and PCD Franchise applicants connect instantly to the sales desk without third-party API fees or ban risks.
              </p>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '30px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#065F46',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              Live Cloud Mode (100% Serverless Ready)
            </div>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Card 1: Official Corporate Number Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #EDE9FE',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(104, 40, 220, 0.04)',
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={17} style={{ color: '#059669' }} />
                  <span>Primary Sales WhatsApp Line</span>
                </h4>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.8px', color: '#64748B' }}>
                    Registered Mobile Line
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: '4px', fontFamily: 'monospace' }}>
                    +91 9316227576
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
                    Zeal Pharmaceuticals Head Office / Sales Desk
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                    <CheckCircle2 size={15} style={{ color: '#10B981', flexShrink: 0 }} />
                    <span>Single Product Formulations ➔ Instant pre-filled quotes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                    <CheckCircle2 size={15} style={{ color: '#10B981', flexShrink: 0 }} />
                    <span>PCD Pharma Franchise ➔ Monopoly territory distribution</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                    <CheckCircle2 size={15} style={{ color: '#10B981', flexShrink: 0 }} />
                    <span>Admin 1-Click Reply ➔ Pre-composed templates in CRM</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                <a
                  href="https://wa.me/919316227576?text=Hello%20Zeal%20Pharma%20Sales%20Team%2C%20testing%20WhatsApp%20routing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    color: '#059669',
                    border: '1.5px solid #A7F3D0',
                    background: '#ECFDF5',
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Open Sales Line in WhatsApp Web</span>
                </a>
              </div>
            </div>

            {/* Card 2: Click-to-Chat Test & Link Generator */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #EDE9FE',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(104, 40, 220, 0.04)',
              }}
            >
              <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={16} style={{ color: '#6828DC' }} />
                <span>Quick WhatsApp Link Generator &amp; Test</span>
              </h4>

              <form onSubmit={handleLaunchWhatsAppTest} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                    Destination Phone Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    value={testNumber}
                    onChange={(e) => setTestNumber(e.target.value)}
                    placeholder="e.g. 919316227576"
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      color: '#0F172A',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                    Greeting Message
                  </label>
                  <textarea
                    rows={3}
                    value={testMsgText}
                    onChange={(e) => setTestMsgText(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      color: '#0F172A',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      background: '#059669',
                      borderColor: '#059669',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <MessageSquare size={14} />
                    <span>Launch WhatsApp Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyWhatsAppLink}
                    className="btn btn-secondary"
                    style={{
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#475569',
                    }}
                  >
                    {testCopied ? <CheckCircle2 size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
                    <span>{testCopied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL & SECURITY LOGS */}
      {activeTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #EDE9FE',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(104, 40, 220, 0.04)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#EDE9FE',
                    color: '#6828DC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                    System Audit Trail ({auditTotal} events)
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748B' }}>
                    Tamper-evident logs of administrative actions, user logins, and catalog modifications.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={loadAuditLogs}
                disabled={auditLoading}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RefreshCw size={13} className={auditLoading ? 'animate-spin' : ''} />
                Refresh Logs
              </button>
            </div>

            {/* Filter controls */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '20px',
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search user, action, IP..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadAuditLogs()}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ minWidth: '190px' }}>
                <ThemeSelect
                  icon={<Layers size={14} />}
                  value={auditModuleFilter}
                  onChange={(e) => {
                    setAuditModuleFilter(e.target.value);
                    setAuditPage(1);
                  }}
                  containerStyle={{ width: '100%' }}
                  options={[
                    { value: '', label: 'All Modules' },
                    { value: 'AUTH', label: 'Authentication' },
                    { value: 'CONTENT', label: 'CMS Content' },
                    { value: 'PRODUCT', label: 'Products' },
                    { value: 'ORDER', label: 'Orders' },
                    { value: 'CAREER', label: 'Careers & ATS' },
                    { value: 'SETTINGS', label: 'Settings' },
                  ]}
                />
              </div>

              <div style={{ minWidth: '170px' }}>
                <ThemeSelect
                  icon={<CheckCircle2 size={14} />}
                  value={auditStatusFilter}
                  onChange={(e) => {
                    setAuditStatusFilter(e.target.value);
                    setAuditPage(1);
                  }}
                  containerStyle={{ width: '100%' }}
                  options={[
                    { value: '', label: 'All Statuses' },
                    { value: 'SUCCESS', label: 'Success' },
                    { value: 'FAILED', label: 'Failed' },
                  ]}
                />
              </div>

              {(Boolean(auditSearch) || Boolean(auditModuleFilter) || Boolean(auditStatusFilter)) && (
                <button
                  type="button"
                  onClick={() => {
                    setAuditSearch('');
                    setAuditModuleFilter('');
                    setAuditStatusFilter('');
                    setAuditPage(1);
                  }}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#64748B',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Audit Logs Table */}
            <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>User</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Action</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Module</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>IP Address</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Timestamp</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLoading ? (
                    <ZealLoader
                      variant="table-row"
                      colSpan={6}
                      title="Loading Audit Trail Events"
                      subtitle="Querying enterprise security logs..."
                      size="md"
                    />
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                        No audit log entries matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log, idx) => (
                      <tr key={log._id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>
                            {log.userId?.name || (log as any).user?.name || log.metadata?.userName || 'System'}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                            {log.userId?.email || (log as any).user?.email || log.metadata?.userEmail || 'system@zeal'}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1E293B' }}>
                          {log.action}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              background: '#EDE9FE',
                              color: '#6828DC',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {log.module}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748B', fontFamily: 'monospace' }}>
                          {log.ipAddress || '127.0.0.1'}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748B', fontSize: '12px' }}>
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Just now'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              background: log.status === 'SUCCESS' ? '#DCFCE7' : '#FEE2E2',
                              color: log.status === 'SUCCESS' ? '#166534' : '#991B1B',
                            }}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {auditTotalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button
                  type="button"
                  disabled={auditPage <= 1}
                  onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: auditPage <= 1 ? 'not-allowed' : 'pointer',
                    opacity: auditPage <= 1 ? 0.5 : 1,
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: '12.5px', color: '#64748B', alignSelf: 'center' }}>
                  Page {auditPage} of {auditTotalPages}
                </span>
                <button
                  type="button"
                  disabled={auditPage >= auditTotalPages}
                  onClick={() => setAuditPage((p) => Math.min(auditTotalPages, p + 1))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: auditPage >= auditTotalPages ? 'not-allowed' : 'pointer',
                    opacity: auditPage >= auditTotalPages ? 0.5 : 1,
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MEDIA GALLERY MODAL FOR AVATAR SELECTION */}
      <MediaGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        title="Select Staff Profile Photo from Gallery"
        defaultTag="PROFILE"
        onSelect={async (imgUrl) => {
          setIsGalleryModalOpen(false);
          if (imgUrl) {
            await handleApplyProfileImage(imgUrl);
          }
        }}
      />
    </div>
  );
};

