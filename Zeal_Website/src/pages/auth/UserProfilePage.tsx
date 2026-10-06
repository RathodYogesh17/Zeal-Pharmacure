import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Pill, FileCheck2, Loader2, } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { Breadcrumb, StatCard } from '../../components/common';
import { ProfileHero, ProfileSidebar, ProfileDetailsTab, ProfileEnquiriesTab, ProfileSecurityTab, type ProfileTabType, } from '../../components/profile';
import { isStaffRole, cleanDesignationValue } from '../../utils/roleUtils';
import { productService } from '../../api/productService';

export const UserProfilePage: React.FC = () => {
  const {
    user,
    isLoading: authLoading,
    updateUserProfile,
    changePassword,
    logout,
    refreshProfile,
  } = useAuth();
  const { openFranchiseModal, productCount } = useSiteSettings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ProfileTabType>('profile');

  // Form input states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [businessType, setBusinessType] = useState('PROPRIETORSHIP');
  const [drugLicense, setDrugLicense] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [address, setAddress] = useState('');

  // Dynamic products / formulations count
  const [formulaCount, setFormulaCount] = useState<number | null>(null);

  // Profile image upload
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Populate data from user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      const cleanDesig = cleanDesignationValue(user.designation);
      setDesignation(cleanDesig);
      setCompanyName(user.department || '');

      try {
        const extraKey = `zeal_user_meta_${user._id}`;
        const savedMeta = localStorage.getItem(extraKey);
        if (savedMeta) {
          const parsed = JSON.parse(savedMeta);
          if (parsed.companyName && !user.department) setCompanyName(parsed.companyName);
          if (parsed.designation && !cleanDesig) {
            setDesignation(cleanDesignationValue(parsed.designation));
          }
          setBusinessType(parsed.businessType || 'PROPRIETORSHIP');
          setDrugLicense(parsed.drugLicense || '');
          setGstNumber(parsed.gstNumber || '');
          setCity(parsed.city || '');
          setStateName(parsed.stateName || '');
          setAddress(parsed.address || '');
        }
      } catch {
        // Ignore JSON error
      }
    }
  }, [user]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Fetch real-time products count for dynamic Formulations display
  useEffect(() => {
    let isMounted = true;
    productService.getProducts({ limit: 1 })
      .then((res) => {
        if (isMounted && typeof res?.total === 'number') {
          setFormulaCount(res.total);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Image size must be less than 5MB.');
      return;
    }
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfileImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setProfileError(null);
  };

  const handleClearSelectedImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
  };

  const handleRemoveSavedImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    try {
      setIsUpdatingProfile(true);
      const isStaff = isStaffRole(user?.role);
      const finalDesignation = isStaff ? cleanDesignationValue(designation) : '';
      await updateUserProfile({
        name: name.trim() || user?.name || '',
        phone: phone.trim(),
        designation: finalDesignation,
        department: companyName.trim(),
        profileImage: '',
      });
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setProfileSuccess('Profile picture removed successfully.');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to remove picture.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!name.trim()) {
      setProfileError('Full Name cannot be empty.');
      return;
    }

    try {
      setIsUpdatingProfile(true);

      const isStaff = isStaffRole(user?.role);
      const finalDesignation = isStaff ? cleanDesignationValue(designation) : '';

      const res = await updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        designation: finalDesignation,
        department: companyName.trim(),
        profileImageFile: profileImageFile || undefined,
      });

      if (user?._id) {
        const extraKey = `zeal_user_meta_${user._id}`;
        const metaToSave = {
          companyName: companyName.trim(),
          designation: finalDesignation,
          businessType,
          drugLicense: drugLicense.trim(),
          gstNumber: gstNumber.trim(),
          city: city.trim(),
          stateName: stateName.trim(),
          address: address.trim(),
        };
        localStorage.setItem(extraKey, JSON.stringify(metaToSave));
      }

      setProfileSuccess(res.message || 'Profile updated successfully!');
      setProfileImageFile(null);
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await changePassword({ currentPassword, newPassword, confirmPassword });
      setPasswordSuccess(res.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out from Zeal Pharmaceuticals?')) {
      logout();
      navigate('/login');
    }
  };

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', color: '#6828DC' }}>
        <Loader2 size={36} className="animate-spin" />
        <span style={{ fontSize: '17px', fontWeight: 700 }}>Loading your pharmaceutical profile...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 160px)', background: '#F8FAFC', padding: '32px 16px 70px' }}>
      <div className="container" style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* === UNIVERSAL BREADCRUMB === */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Formulations', href: '/products' },
            { label: 'My Account Profile' },
          ]}
        />

        {/* === HERO PROFILE BANNER === */}
        <ProfileHero
          user={user}
          designation={designation}
          companyName={companyName}
          profileImagePreview={profileImagePreview}
          onImageSelect={handleImageSelect}
          onOpenFranchise={openFranchiseModal}
          onLogout={handleLogout}
        />

        {/* === REUSABLE PHARMA METRIC STAT CARDS === */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <StatCard
            icon={<ShieldCheck size={22} />}
            label="Account Health"
            value="Active & Verified"
            colorScheme="green"
            subtext="SSL Verified Session"
          />

          <StatCard
            icon={<Pill size={22} />}
            label="Catalog Access"
            value={`${productCount || formulaCount || 18} Formulations`}
            colorScheme="purple"
            subtext="All Therapeutic Divisions"
          />

          <StatCard
            icon={<FileCheck2 size={22} />}
            label="Drug License"
            value={drugLicense ? 'Uploaded & Valid' : 'Optional / Add D.L.'}
            colorScheme="amber"
            subtext={drugLicense ? '20B / 21B Recorded' : 'Add in Business tab'}
          />
        </div>

        {/* === MAIN CONTENT WITH MODULAR TABS === */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Sidebar Navigation */}
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            user={user}
            onLogout={handleLogout}
          />

          {/* Tab Content Panels */}
          <div>
            {activeTab === 'profile' && (
              <ProfileDetailsTab
                userRole={user.role}
                name={name}
                setName={setName}
                phone={phone}
                setPhone={setPhone}
                email={user.email}
                companyName={companyName}
                setCompanyName={setCompanyName}
                businessType={businessType}
                setBusinessType={setBusinessType}
                drugLicense={drugLicense}
                setDrugLicense={setDrugLicense}
                gstNumber={gstNumber}
                setGstNumber={setGstNumber}
                city={city}
                setCity={setCity}
                stateName={stateName}
                setStateName={setStateName}
                address={address}
                setAddress={setAddress}
                profileImagePreview={profileImagePreview}
                currentSavedImage={user.profileImage}
                onClearSelectedImage={handleClearSelectedImage}
                onRemoveSavedImage={handleRemoveSavedImage}
                onImageSelect={handleImageSelect}
                onSubmit={handleUpdateProfile}
                isUpdating={isUpdatingProfile}
                successMsg={profileSuccess}
                errorMsg={profileError}
              />
            )}

            {activeTab === 'enquiries' && (
              <ProfileEnquiriesTab
                city={city}
                stateName={stateName}
                onOpenFranchise={openFranchiseModal}
              />
            )}

            {activeTab === 'security' && (
              <ProfileSecurityTab
                onSubmit={handleChangePassword}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                isChanging={isChangingPassword}
                successMsg={passwordSuccess}
                errorMsg={passwordError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
