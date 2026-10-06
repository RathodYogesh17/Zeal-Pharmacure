import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  FlaskConical,
  Activity,
  Layers,
  Brain,
  ShieldCheck,
  Leaf,
  Pill
} from 'lucide-react';
import type { ICategory } from '../../types';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { SectionHeader } from '../common';
import './HomeStyles.css';

export interface HomeCategoriesGridProps {
  categories: ICategory[];
  loading: boolean;
}

interface CategoryMeta {
  icon: React.ReactNode;
  bg: string;
  border: string;
  textColor: string;
  defaultMolecules: string;
}

const getCategoryMeta = (catName: string): CategoryMeta => {
  const lower = catName.toLowerCase();
  if (lower.includes('cardio') || lower.includes('heart')) {
    return {
      icon: <Heart size={24} style={{ color: '#E11D48' }} />,
      bg: '#FFF1F2',
      border: '#FFE4E6',
      textColor: '#E11D48',
      defaultMolecules: '35+ Formulations',
    };
  }
  if (lower.includes('dental') || lower.includes('oral')) {
    return {
      icon: <Sparkles size={24} style={{ color: '#0284C7' }} />,
      bg: '#F0F9FF',
      border: '#E0F2FE',
      textColor: '#0284C7',
      defaultMolecules: '20+ Formulations',
    };
  }
  if (lower.includes('derma') || lower.includes('skin') || lower.includes('hair')) {
    return {
      icon: <FlaskConical size={24} style={{ color: '#EA580C' }} />,
      bg: '#FFF7ED',
      border: '#FED7AA',
      textColor: '#EA580C',
      defaultMolecules: '45+ Formulations',
    };
  }
  if (lower.includes('diabet')) {
    return {
      icon: <Activity size={24} style={{ color: '#0D9488' }} />,
      bg: '#F0FDFA',
      border: '#CCFBF1',
      textColor: '#0D9488',
      defaultMolecules: '28+ Formulations',
    };
  }
  if (lower.includes('gastro') || lower.includes('liver') || lower.includes('hepato')) {
    return {
      icon: <Layers size={24} style={{ color: '#D97706' }} />,
      bg: '#FEF3C7',
      border: '#FDE68A',
      textColor: '#D97706',
      defaultMolecules: '40+ Formulations',
    };
  }
  if (lower.includes('gynec') || lower.includes('women')) {
    return {
      icon: <Heart size={24} style={{ color: '#DB2777' }} />,
      bg: '#FDF2F8',
      border: '#FCE7F3',
      textColor: '#DB2777',
      defaultMolecules: '32+ Formulations',
    };
  }
  if (lower.includes('neuro') || lower.includes('psych')) {
    return {
      icon: <Brain size={24} style={{ color: '#2563EB' }} />,
      bg: '#EFF6FF',
      border: '#DBEAFE',
      textColor: '#2563EB',
      defaultMolecules: '30+ Formulations',
    };
  }
  if (lower.includes('ortho') || lower.includes('bone') || lower.includes('joint')) {
    return {
      icon: <ShieldCheck size={24} style={{ color: '#059669' }} />,
      bg: '#ECFDF5',
      border: '#D1FAE5',
      textColor: '#059669',
      defaultMolecules: '38+ Formulations',
    };
  }
  if (lower.includes('pediatric') || lower.includes('child')) {
    return {
      icon: <Leaf size={24} style={{ color: '#16A34A' }} />,
      bg: '#F0FDF4',
      border: '#DCFCE7',
      textColor: '#16A34A',
      defaultMolecules: '25+ Formulations',
    };
  }
  if (lower.includes('resp') || lower.includes('cough') || lower.includes('cold')) {
    return {
      icon: <Activity size={24} style={{ color: '#0284C7' }} />,
      bg: '#E0F2FE',
      border: '#BAE6FD',
      textColor: '#0284C7',
      defaultMolecules: '36+ Formulations',
    };
  }
  return {
    icon: <Pill size={24} style={{ color: 'var(--zp-primary, #6828DC)' }} />,
    bg: '#F5F3FF',
    border: '#EDE9FE',
    textColor: 'var(--zp-primary, #6828DC)',
    defaultMolecules: '50+ Formulations',
  };
};

export const HomeCategoriesGrid: React.FC<HomeCategoriesGridProps> = ({ categories, loading }) => {
  const { productCount } = useSiteSettings();
  const displayCategories = categories.slice(0, 12);

  return (
    <section style={{ padding: '72px 0 60px', background: '#FFFFFF' }}>
      <div className="container">
        <SectionHeader
          badge="Specialized Therapeutic Segments"
          title="Explore Formulations by Category"
          subtitle={`Comprehensive pharmaceutical portfolio formulated in cGMP-certified facilities covering ${productCount}+ DCGI-approved formulations.`}
          actionLink="/products"
          actionText="View Complete Catalog"
        />

        {loading ? (
          <div className="zp-home-categories-grid">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  height: '140px',
                  border: '1.5px solid #E2E8F0',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : displayCategories.length > 0 ? (
          <div className="zp-home-categories-grid">
            {displayCategories.map((cat, idx) => {
              const meta = getCategoryMeta(cat.name);
              return (
                <Link
                  key={cat._id || cat.slug || idx}
                  to={`/products?category=${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="zp-home-cat-card"
                >
                  <div
                    className="zp-home-cat-icon-wrap"
                    style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
                  >
                    {meta.icon}
                  </div>
                  <div className="zp-home-cat-title">
                    {cat.name}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            No categories available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};
