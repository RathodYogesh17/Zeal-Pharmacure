import React from 'react';
import { Pill, Sparkles, Droplets, Syringe } from 'lucide-react';

export interface DosageFormConfig {
  name: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
}

export const getDosageFormDetails = (dosageForm?: string): DosageFormConfig => {
  const form = (dosageForm || '').toLowerCase();
  if (form.includes('capsule') || form.includes('cap')) {
    return {
      name: 'Capsule',
      icon: Pill,
      badgeBg: '#FAF5FF',
      badgeBorder: '#E9D5FF',
      badgeColor: '#7C3AED',
    };
  }
  if (form.includes('cream') || form.includes('gel') || form.includes('ointment')) {
    return {
      name: 'Topical',
      icon: Sparkles,
      badgeBg: '#EFF6FF',
      badgeBorder: '#BFDBFE',
      badgeColor: '#2563EB',
    };
  }
  if (form.includes('syrup') || form.includes('suspension') || form.includes('drops') || form.includes('liquid') || form.includes('lotion')) {
    return {
      name: 'Liquid',
      icon: Droplets,
      badgeBg: '#ECFDF5',
      badgeBorder: '#A7F3D0',
      badgeColor: '#059669',
    };
  }
  if (form.includes('inj') || form.includes('injection')) {
    return {
      name: 'Injectable',
      icon: Syringe,
      badgeBg: '#FFF7ED',
      badgeBorder: '#FED7AA',
      badgeColor: '#EA580C',
    };
  }
  return {
    name: 'Tablet',
    icon: Pill,
    badgeBg: '#FAF5FF',
    badgeBorder: '#DDD6FE',
    badgeColor: '#6828DC',
  };
};

export interface B2BValidationData {
  fullName?: string;
  name?: string;
  phone: string;
  email: string;
  city: string;
  state: string;
}

export const validateB2BCustomerFields = (
  data: B2BValidationData,
  fallbackUser?: { name?: string; phone?: string; email?: string } | null
): {
  isValid: boolean;
  errors: { fullName?: string; phone?: string; email?: string; city?: string; state?: string };
  sanitized: { effectiveName: string; cleanPhone: string; effectiveEmail: string };
} => {
  const errors: { fullName?: string; phone?: string; email?: string; city?: string; state?: string } = {};

  const effectiveName = (data.fullName || data.name || '').trim() || fallbackUser?.name || '';
  if (!effectiveName) {
    errors.fullName = 'Full name is required';
  } else if (effectiveName.length < 2) {
    errors.fullName = 'Name must be at least 2 characters';
  }

  const effectivePhone = data.phone.trim() || fallbackUser?.phone || '';
  const rawDigits = effectivePhone.replace(/[\s\-\(\)\+]/g, '');
  const cleanPhone = rawDigits.length > 10 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;
  if (!rawDigits) {
    errors.phone = 'Mobile number is required';
  } else if (!/^[0-9]{10}$/.test(cleanPhone)) {
    errors.phone = 'Please enter a valid 10-digit mobile number';
  }

  const effectiveEmail = data.email.trim() || fallbackUser?.email || '';
  if (!effectiveEmail) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effectiveEmail)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.city.trim()) errors.city = 'City / Headquarters is required';
  if (!data.state.trim()) errors.state = 'State is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      effectiveName,
      cleanPhone,
      effectiveEmail,
    },
  };
};
