import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Activity,
  Pill,
  Layers,
  ShieldCheck,
  Sparkles,
  Flame,
  Zap,
  Brain,
  ShieldAlert,
  Filter,
  Wind,
} from 'lucide-react';
import type { ICategory } from '../../types';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SectionHeader } from '../common';
import './HomeStyles.css';

export interface HomeCategoriesGridProps {
  categories: ICategory[];
  loading: boolean;
}

interface PrimaryCategoryConfig {
  slug: string;
  name: string;
  bodyPart: string;
  formulationCount: string;
  icon: React.ReactNode;
  bg: string;
  border: string;
  textColor: string;
}

const PRIMARY_12_CONFIGS: PrimaryCategoryConfig[] = [
  {
    slug: 'cardiology-and-blood-pressure',
    name: 'Cardiology & Blood Pressure',
    bodyPart: 'Heart & Vascular',
    formulationCount: '37+ Formulations',
    icon: <HeartPulse size={26} style={{ color: '#E11D48' }} />,
    bg: '#FFF1F2',
    border: '#FFE4E6',
    textColor: '#E11D48',
  },
  {
    slug: 'diabetes-and-blood-sugar',
    name: 'Diabetes & Blood Sugar',
    bodyPart: 'Pancreas & Blood Glucose',
    formulationCount: '27+ Formulations',
    icon: <Activity size={26} style={{ color: '#0D9488' }} />,
    bg: '#F0FDFA',
    border: '#CCFBF1',
    textColor: '#0D9488',
  },
  {
    slug: 'vitamins-minerals-and-supplements',
    name: 'Vitamins, Minerals & Supplements',
    bodyPart: 'Whole Body Vitality',
    formulationCount: '15+ Formulations',
    icon: <Pill size={26} style={{ color: '#7C3AED' }} />,
    bg: '#F5F3FF',
    border: '#EDE9FE',
    textColor: '#7C3AED',
  },
  {
    slug: 'gastroenterology-and-digestive-health',
    name: 'Gastroenterology & Digestive Health',
    bodyPart: 'Stomach, Liver & Gut',
    formulationCount: '13+ Formulations',
    icon: <Layers size={26} style={{ color: '#D97706' }} />,
    bg: '#FEF3C7',
    border: '#FDE68A',
    textColor: '#D97706',
  },
  {
    slug: 'orthopedics-and-pain-management',
    name: 'Orthopedics & Pain Management',
    bodyPart: 'Bones, Spine & Joints',
    formulationCount: '5+ Formulations',
    icon: <ShieldCheck size={26} style={{ color: '#059669' }} />,
    bg: '#ECFDF5',
    border: '#D1FAE5',
    textColor: '#059669',
  },
  {
    slug: 'dermatology-and-skin-care',
    name: 'Dermatology & Skin Care',
    bodyPart: 'Skin, Dermis & Hair',
    formulationCount: '4+ Formulations',
    icon: <Sparkles size={26} style={{ color: '#EA580C' }} />,
    bg: '#FFF7ED',
    border: '#FED7AA',
    textColor: '#EA580C',
  },
  {
    slug: 'endocrinology-and-thyroid-care',
    name: 'Endocrinology & Thyroid Care',
    bodyPart: 'Thyroid & Hormones',
    formulationCount: '4+ Formulations',
    icon: <Flame size={26} style={{ color: '#4F46E5' }} />,
    bg: '#EEF2FF',
    border: '#E0E7FF',
    textColor: '#4F46E5',
  },
  {
    slug: 'neurology-and-nerve-pain',
    name: 'Neurology & Nerve Pain',
    bodyPart: 'Nerves & Neuropathic',
    formulationCount: '4+ Formulations',
    icon: <Zap size={26} style={{ color: '#0891B2' }} />,
    bg: '#ECFEFF',
    border: '#CFFAFE',
    textColor: '#0891B2',
  },
  {
    slug: 'neurology-and-brain-health',
    name: 'Neurology & Brain Health',
    bodyPart: 'Brain & Cognitive CNS',
    formulationCount: '3+ Formulations',
    icon: <Brain size={26} style={{ color: '#2563EB' }} />,
    bg: '#EFF6FF',
    border: '#DBEAFE',
    textColor: '#2563EB',
  },
  {
    slug: 'anti-infectives',
    name: 'Anti-infectives',
    bodyPart: 'Immune & Infection',
    formulationCount: '3+ Formulations',
    icon: <ShieldAlert size={26} style={{ color: '#BE123C' }} />,
    bg: '#FFF1F2',
    border: '#FECDD3',
    textColor: '#BE123C',
  },
  {
    slug: 'urology-and-prostate-health',
    name: 'Urology & Prostate Health',
    bodyPart: 'Kidneys & Urinary',
    formulationCount: '3+ Formulations',
    icon: <Filter size={26} style={{ color: '#0284C7' }} />,
    bg: '#F0F9FF',
    border: '#E0F2FE',
    textColor: '#0284C7',
  },
  {
    slug: 'respiratory-and-ent-care',
    name: 'Respiratory & ENT Care',
    bodyPart: 'Lungs, Airway & ENT',
    formulationCount: '2+ Formulations',
    icon: <Wind size={26} style={{ color: '#0369A1' }} />,
    bg: '#E0F2FE',
    border: '#BAE6FD',
    textColor: '#0369A1',
  },
];

export const HomeCategoriesGrid: React.FC<HomeCategoriesGridProps> = ({ categories, loading }) => {
  const { productCount } = useSiteSettings();

  // Map the 12 primary configs with live categories from backend if present
  const displayItems = PRIMARY_12_CONFIGS.map((cfg) => {
    const liveCat = categories.find(
      (c) =>
        c.slug === cfg.slug ||
        c.name.toLowerCase().trim() === cfg.name.toLowerCase().trim()
    );

    return {
      _id: liveCat?._id || cfg.slug,
      slug: liveCat?.slug || cfg.slug,
      name: liveCat?.name || cfg.name,
      bodyPart: cfg.bodyPart,
      formulationCount: liveCat?.productCount ? `${liveCat.productCount}+ Formulations` : cfg.formulationCount,
      icon: cfg.icon,
      bg: cfg.bg,
      border: cfg.border,
      textColor: cfg.textColor,
    };
  });

  return (
    <section style={{ padding: '72px 0 60px', background: '#FFFFFF' }}>
      <div className="container">
        <SectionHeader
          badge="Specialized Therapeutic Segments"
          title="Explore Formulations by Category"
          subtitle={`Comprehensive pharmaceutical portfolio formulated in cGMP-certified facilities covering ${productCount || '130+'}+ DCGI-approved formulations.`}
          actionLink="/products"
          actionText="View Complete Catalog"
        />

        {loading && categories.length === 0 ? (
          <div className="zp-home-categories-grid">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  height: '168px',
                  border: '1.5px solid #E2E8F0',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="zp-home-categories-grid">
            {displayItems.map((item) => (
              <Link
                key={item.slug}
                to={`/products?category=${encodeURIComponent(item.slug)}`}
                className="zp-home-cat-card"
                title={`Explore ${item.name} (${item.bodyPart}) Formulations`}
              >
                <div
                  className="zp-home-cat-icon-wrap"
                  style={{ background: item.bg, border: `1px solid ${item.border}` }}
                >
                  {item.icon}
                </div>
                <div className="zp-home-cat-title">
                  {item.name}
                </div>
                <div
                  className="zp-home-cat-badge"
                  style={{
                    background: item.bg,
                    color: item.textColor,
                    border: `1px solid ${item.border}`,
                  }}
                >
                  {item.bodyPart}
                </div>
                <div className="zp-home-cat-count">
                  {item.formulationCount}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
