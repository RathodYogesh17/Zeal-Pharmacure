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
  defaultCount: number;
  icon: React.ReactNode;
}

const PRIMARY_12_CONFIGS: PrimaryCategoryConfig[] = [
  {
    slug: 'cardiology-and-blood-pressure',
    name: 'Cardiology & Blood Pressure',
    defaultCount: 37,
    icon: <HeartPulse size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'diabetes-and-blood-sugar',
    name: 'Diabetes & Blood Sugar',
    defaultCount: 27,
    icon: <Activity size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'vitamins-minerals-and-supplements',
    name: 'Vitamins, Minerals & Supplements',
    defaultCount: 15,
    icon: <Pill size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'gastroenterology-and-digestive-health',
    name: 'Gastroenterology & Digestive Health',
    defaultCount: 13,
    icon: <Layers size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'orthopedics-and-pain-management',
    name: 'Orthopedics & Pain Management',
    defaultCount: 5,
    icon: <ShieldCheck size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'dermatology-and-skin-care',
    name: 'Dermatology & Skin Care',
    defaultCount: 4,
    icon: <Sparkles size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'endocrinology-and-thyroid-care',
    name: 'Endocrinology & Thyroid Care',
    defaultCount: 4,
    icon: <Flame size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'neurology-and-nerve-pain',
    name: 'Neurology & Nerve Pain',
    defaultCount: 4,
    icon: <Zap size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'neurology-and-brain-health',
    name: 'Neurology & Brain Health',
    defaultCount: 3,
    icon: <Brain size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'anti-infectives',
    name: 'Anti-infectives',
    defaultCount: 3,
    icon: <ShieldAlert size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'urology-and-prostate-health',
    name: 'Urology & Prostate Health',
    defaultCount: 3,
    icon: <Filter size={26} strokeWidth={2.2} />,
  },
  {
    slug: 'respiratory-and-ent-care',
    name: 'Respiratory & ENT Care',
    defaultCount: 2,
    icon: <Wind size={26} strokeWidth={2.2} />,
  },
];

export const HomeCategoriesGrid: React.FC<HomeCategoriesGridProps> = ({ categories, loading }) => {
  const { productCount } = useSiteSettings();

  // Map the 12 primary configs with live categories from backend
  const displayItems = PRIMARY_12_CONFIGS.map((cfg) => {
    const liveCat = categories.find(
      (c) =>
        c.slug === cfg.slug ||
        c.name.toLowerCase().trim() === cfg.name.toLowerCase().trim()
    );

    const count = typeof liveCat?.productCount === 'number'
      ? liveCat.productCount
      : cfg.defaultCount;

    return {
      _id: liveCat?._id || cfg.slug,
      slug: liveCat?.slug || cfg.slug,
      name: liveCat?.name || cfg.name,
      formulationCount: `${count}+ Formulations`,
      icon: cfg.icon,
    };
  });

  return (
    <section style={{ padding: '72px 0 60px', background: '#FFFFFF' }}>
      <div className="container">
        <SectionHeader
          badge="Specialized Therapeutic Segments"
          title="Explore Formulations by Category"
          subtitle={`Comprehensive pharmaceutical portfolio formulated in cGMP-certified facilities covering ${productCount || 130}+ DCGI-approved formulations.`}
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
                  border: '1.5px solid #EDE9FE',
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
                title={`Explore ${item.name} Formulations`}
              >
                <div className="zp-home-cat-icon-wrap">
                  {item.icon}
                </div>
                <div className="zp-home-cat-title">
                  {item.name}
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
