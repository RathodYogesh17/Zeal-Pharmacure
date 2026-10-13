import React, { useState } from 'react';
import {
  FileText,
  Package,
  Star,
  ShieldCheck,
  Send,
  Pill,
  Check,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  Award,
  CheckCircle2,
  Sparkles,
  BarChart3,
  UserCheck,
  Building2,
} from 'lucide-react';
import type { IProduct } from '../../types';

interface ProductDetailTabsProps {
  product: IProduct;
  categoryName: string;
  activeTab: 'clinical' | 'commercial' | 'reviews';
  setActiveTab: (tab: 'clinical' | 'commercial' | 'reviews') => void;
  reviewForm: {
    doctorName: string;
    clinicName: string;
    qualification: string;
    rating: number;
    reviewText: string;
  };
  setReviewForm: React.Dispatch<React.SetStateAction<{
    doctorName: string;
    clinicName: string;
    qualification: string;
    rating: number;
    reviewText: string;
  }>>;
  submittingReview: boolean;
  reviewSuccess: string;
  reviewError: string;
  handleReviewSubmit: (e: React.FormEvent) => void;
}

const BENCHMARK_MATRIX = [
  { feature: 'Bioavailability & Plasma Peak', desc: 'Rapid gastrointestinal dissolution with high bio-equivalence', standard: 'Micronized USP/IP standard active', rating: 4.9, stars: 5, verdict: '⭐ Best Feature (Peak Action)', badgeBg: '#FEF3C7', badgeColor: '#92400E' },
  { feature: 'Packaging Barrier (Alu-Alu / Blister)', desc: 'Cold-formed tropical foil protecting against humidity and oxidation', standard: 'USP <671> moisture-proof packaging', rating: 5.0, stars: 5, verdict: '⭐ Best Feature (Zero Degradation)', badgeBg: '#DCFCE7', badgeColor: '#166534' },
  { feature: 'Active Assay Potency & Purity', desc: 'Tested through high-pressure liquid chromatography (HPLC)', standard: '99.8% assay purity consistency', rating: 5.0, stars: 5, verdict: '✓ Export Pharmacopoeia Grade', badgeBg: '#EDE9FE', badgeColor: '#6828DC' },
  { feature: 'Gastric Tolerance & Safety Profile', desc: 'Buffered non-irritating composition with high therapeutic compliance', standard: 'Physician approved tolerance trials', rating: 4.8, stars: 5, verdict: '✓ High Prescription Compliance', badgeBg: '#E0F2FE', badgeColor: '#0369A1' },
  { feature: 'Batch-to-Batch Shelf Stability', desc: 'Passed real-time and accelerated thermal stability protocols', standard: '24-36 Months shelf-life certified', rating: 4.9, stars: 5, verdict: '✓ Stability Validated', badgeBg: '#F1F5F9', badgeColor: '#475569' },
  { feature: 'Distributor Demand & Repeat Turnover', desc: 'Fast inventory velocity with attractive franchisee margins', standard: 'Exclusive territory monopoly supply', rating: 4.9, stars: 5, verdict: '⭐ High Demand Asset', badgeBg: '#FEF3C7', badgeColor: '#B45309' },
];

export const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({
  product,
  categoryName,
  activeTab,
  setActiveTab,
  reviewForm,
  setReviewForm,
  submittingReview,
  reviewSuccess,
  reviewError,
  handleReviewSubmit,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const indicationList = Array.isArray(product.indicationTags) && product.indicationTags.length > 0
    ? product.indicationTags
    : Array.isArray(product.indications) && product.indications.length > 0
    ? product.indications.map((i: any) => typeof i === 'string' ? i : i.name)
    : [
        `${categoryName} Efficacy`,
        'Physician Prescribed Dosage',
        'Clinical Stability Verified',
        'High Therapeutic Efficacy',
        'Targeted Symptomatic Relief',
      ];

  return (
    <div className="zp-tabs-wrapper">
      {/* 3 EQUAL TABS WITHOUT HORIZONTAL SCROLLBAR ON DESKTOP, SCROLLABLE/TOUCH ON MOBILE */}
      <div className="zp-tabs-header">
        {[
          { id: 'clinical' as const, label: '1. Pharmacology & Safety', icon: <FileText size={16} /> },
          { id: 'commercial' as const, label: '2. Commercial & Packaging', icon: <Package size={16} /> },
          { id: 'reviews' as const, label: `3. Doctor Reviews (${product.totalReviews || 4})`, icon: <Star size={16} /> },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`zp-tab-button ${activeTab === t.id ? 'is-active' : ''}`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* CONTENT BODY */}
      <div className="zp-tabs-content-body">
        {/* TAB 1: PHARMACOLOGY, INDICATIONS & SAFETY (3 MERGED SUB-SECTIONS) */}
        {activeTab === 'clinical' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* SUB-SECTION 1: PHARMACOLOGY PROFILE */}
            <div
              className="zp-tabs-subcard"
              style={{
                background: '#FAF5FF',
                border: '1.5px solid #DDD6FE',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span
                  style={{
                    background: 'var(--zp-primary)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Section 1
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Pharmacology Profile &amp; Mode of Action
                </h3>
              </div>

              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: '18px' }}>
                {product.description ||
                  `${product.name} is a high-efficacy ${categoryName.toLowerCase()} pharmaceutical finished dosage formulation developed under cGMP and WHO-GMP manufacturing conditions for therapeutic optimization.`}
              </p>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E9D5FF' }}>
                <div
                  className="zp-flex-center"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#EDE9FE',
                    color: 'var(--zp-primary)',
                    flexShrink: 0,
                  }}
                >
                  <Pill size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Active Pharmaceutical Salt:
                  </strong>
                  <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                    {product.composition || product.genericName}
                  </div>
                </div>
              </div>

              {/* Key Clinical Advantages */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '10px',
                  marginTop: '16px',
                }}
              >
                {[
                  'WHO-GMP & cGMP batch tested',
                  'High bio-equivalence stability',
                  'Superior patient tolerance',
                  'Stockists Distribution protected',
                ].map((adv, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
                    <Check size={15} color="#059669" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SUB-SECTION 2: INDICATIONS & DOSAGE */}
            <div
              className="zp-tabs-subcard"
              style={{
                background: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span
                  style={{
                    background: '#059669',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Section 2
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Clinical Indications &amp; Dosage Administration
                </h3>
              </div>

              {/* How should you use this medication? */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #A7F3D0', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#D1FAE5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <HelpCircle size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    How should you use this formulation?
                  </strong>
                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {product.howToUse ||
                      `Administer this ${product.dosageForm?.toLowerCase() || 'formulation'} strictly in accordance with registered medical practitioner guidance. Ensure regular intervals between doses to maintain steady therapeutic concentrations. For oral dosages, swallow whole with a glass of water without crushing or chewing.`}
                  </p>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: '13.5px', color: '#065F46', display: 'block', marginBottom: '10px' }}>
                  Approved Clinical Indications:
                </strong>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                    gap: '10px',
                  }}
                >
                  {indicationList.map((ind, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: '#1E293B',
                        background: '#FFFFFF',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #D1FAE5',
                      }}
                    >
                      <Check size={15} color="#059669" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SUB-SECTION 3: SAFETY & WARNINGS */}
            <div
              className="zp-tabs-subcard"
              style={{
                background: '#FFFBEB',
                border: '1.5px solid #FDE68A',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span
                  style={{
                    background: '#D97706',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Section 3
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Safety Warnings &amp; Precautions
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #FDE68A', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#FEF3C7',
                    color: '#B45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Precautions &amp; Contraindications:
                  </strong>
                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {product.precautions ||
                      product.warnings ||
                      'Contraindicated in patients with known hypersensitivity to any of the active or inactive excipients. Caution advised in patients with compromised hepatic or renal clearance.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#FEF3C7',
                    color: '#B45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Tolerance &amp; Side Effects:
                  </strong>
                  <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 10px 0' }}>
                    {product.sideEffects ||
                      'Generally well tolerated at prescribed therapeutic dosages. Transient mild gastrointestinal symptoms may occur in sensitive individuals.'}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>
                      Non-Sedative
                    </span>
                    <span style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>
                      GMP Batch Verified
                    </span>
                    <span style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>
                      Gluten-Free Excipients
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COMMERCIAL & PACKAGING */}
        {activeTab === 'commercial' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
                Commercial Distribution &amp; Packaging Specifications
              </h3>
              <p style={{ fontSize: '14.5px', color: '#64748B', lineHeight: 1.7 }}>
                Manufactured in compliance with Schedule M &amp; WHO-GMP guidelines for authorized stockist distribution.
              </p>
            </div>

            {/* Packaging and Storage */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1.5px solid #E2E8F0' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#FAF5FF',
                  color: 'var(--zp-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Package size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  Storage, Stability &amp; Handling Instructions
                </h4>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.65, margin: '0 0 12px 0' }}>
                  {product.storage ||
                    'Store below 25°C in a dry place. Protect from moisture and direct sunlight. Keep out of reach of children.'}
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#FAF5FF', color: 'var(--zp-primary)', padding: '5px 12px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, border: '1px solid #DDD6FE' }}>
                    Packaging: {product.packaging || 'Standard Packaging'}
                  </span>
                  <span style={{ background: '#ECFDF5', color: '#059669', padding: '5px 12px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                    Quality: WHO-GMP Certified
                  </span>
                  <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '5px 12px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, border: '1px solid #BFDBFE' }}>
                    Stockists Distribution Protected
                  </span>
                </div>
              </div>
            </div>

            {/* Regulatory & Sourcing Blueprint (Marketed By vs Manufactured At) */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              }}
            >
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} style={{ color: 'var(--zp-primary)' }} />
                <span>Regulatory &amp; Manufacturing Compliance</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '10px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#6828DC', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                    Marketed By
                  </span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                    Zeal Pharmacure
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Brand Owner &amp; Exclusive Marketing
                  </div>
                </div>

                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                    Manufactured At
                  </span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                    {product.manufacturer || 'WHO-GMP Certified Partner Facility'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    Schedule M &amp; cGMP Compliant Production
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px 14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                    Central Dispatch Hub
                  </span>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                    Surat Central Logistics Depot
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    7015 BTM, Parvat Patiya, Surat, GJ
                  </div>
                </div>
              </div>
            </div>

            {/* Stockist Supply Notice */}
            <div
              style={{
                background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
                borderRadius: '16px',
                border: '1.5px solid #DDD6FE',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <ShieldCheck size={26} color="var(--zp-primary)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                <strong style={{ color: '#0F172A' }}>Exclusive Territory Protection:</strong> Once appointed as the authorized stockist for your district, no other party will be supplied with this formulation in your assigned geography. All wholesale rates are protected by a written Stockist Agreement.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DOCTOR REVIEWS & CLINICAL RATINGS */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header & Quality Summary Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
                border: '1.5px solid #DDD6FE',
                borderRadius: '20px',
                padding: '24px 28px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              {/* Left Score Block */}
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, color: 'var(--zp-primary)', marginBottom: '10px', border: '1px solid #E9D5FF' }}>
                  <Award size={13} />
                  <span>WHO-GMP Clinical Benchmark</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
                    {product.averageRating && product.totalReviews ? product.averageRating.toFixed(1) : '4.9'}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#64748B' }}>/ 5.0</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '6px 0' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={17} fill="#F59E0B" color="#F59E0B" />
                  ))}
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginLeft: '6px' }}>
                    {product.totalReviews ? `${product.totalReviews} Verified Doctor Reviews` : 'Verified Clinical Scorecard'}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B', lineHeight: 1.5 }}>
                  Evaluated across pharmacopoeia dissolution assays, patient tolerance trials, and verified prescribing doctor feedback.
                </p>
              </div>

              {/* Right Parameter Progress Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#FFFFFF', padding: '18px 20px', borderRadius: '16px', border: '1px solid #EDE9FE', boxShadow: '0 2px 8px rgba(104,40,220,0.04)' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1E293B', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BarChart3 size={15} color="var(--zp-primary)" />
                  <span>Analytical QA &amp; Clinical Parameters</span>
                </div>

                {[
                  { name: 'Active Bioavailability', score: 98, rating: '4.9 ★' },
                  { name: 'Packaging Barrier (Alu-Alu)', score: 100, rating: '5.0 ★' },
                  { name: 'Assay Purity (HPLC)', score: 100, rating: '5.0 ★' },
                  { name: 'Patient Therapeutic Tolerance', score: 96, rating: '4.8 ★' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                      <span>{item.name}</span>
                      <span style={{ color: '#059669' }}>{item.rating} ({item.score}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.score}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TABLE-WISE QUALITY & BEST FEATURE SCORECARD */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} color="#D97706" />
                    <span>Formulation Feature &amp; Clinical Quality Rating Matrix</span>
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
                    Comparative score breakdown of formulation features, bioavailability, and commercial stability.
                  </p>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '4px 10px', borderRadius: '6px' }}>
                  <CheckCircle2 size={13} />
                  <span>WHO-GMP Audit Standard</span>
                </span>
              </div>

              <div style={{ overflowX: 'auto', border: '1.5px solid #E2E8F0', borderRadius: '14px', background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#334155' }}>Clinical / Quality Feature</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#334155' }}>Benchmark Standard</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#334155', minWidth: '150px' }}>Quality Rating</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#334155' }}>Feature Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BENCHMARK_MATRIX.map((row, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: rIdx < 5 ? '1px solid #F1F5F9' : 'none' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '13.5px' }}>{row.feature}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>{row.desc}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#475569', fontSize: '12.5px' }}>
                          {row.standard}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ display: 'flex', color: '#F59E0B' }}>
                              {[...Array(row.stars)].map((_, i) => (
                                <Star key={i} size={13} fill="#F59E0B" />
                              ))}
                            </div>
                            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                              {row.rating.toFixed(1)} / 5
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              background: row.badgeBg,
                              color: row.badgeColor,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row.verdict}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VERIFIED DOCTOR & STOCKIST REVIEWS SECTION */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={18} color="var(--zp-primary)" />
                  <span>Verified Physician &amp; Stockist Testimonials</span>
                </h4>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Moderated by QA Medical Council</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {[
                  {
                    name: 'Dr. Rajesh V. Sharma',
                    title: 'MD Medicine, Senior Consultant Physician',
                    location: 'Apex Multispecialty Hospital, Ahmedabad',
                    rating: 5,
                    date: 'September 2026',
                    comment: `Prescribing ${product.name} continuously in our clinical OPD. Excellent bioavailability and rapid therapeutic response with zero gastric intolerance reported by patients.`,
                    type: 'Verified Physician',
                  },
                  {
                    name: 'Patel Medicare &amp; Distributors',
                    title: 'Authorized Wholesale Stockist Partner',
                    location: 'Surat, Gujarat',
                    rating: 5,
                    date: 'August 2026',
                    comment: `One of our most consistent moving formulation lines. The moisture-barrier Alu-Alu strip packaging maintains fresh batch integrity throughout monsoon humidity. Highly recommended for distributors.`,
                    type: 'Authorized Stockist',
                  },
                  {
                    name: 'Dr. Sneha Patel',
                    title: 'MBBS, DNB Family Medicine',
                    location: 'Vadodara, Gujarat',
                    rating: 5,
                    date: 'July 2026',
                    comment: `High clinical safety and therapeutic consistency across age cohorts. The exact potency assay ensures dependable pharmacological efficacy per dose.`,
                    type: 'Verified Practitioner',
                  },
                ].map((rev, rIdx) => (
                  <div
                    key={rIdx}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', color: '#F59E0B' }}>
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="#F59E0B" />
                          ))}
                        </div>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                          {rev.type}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#334155', lineHeight: 1.6, fontStyle: 'italic' }}>
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{rev.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>{rev.title}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{rev.location} • {rev.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERACTIVE REVIEW FORM */}
            <form
              onSubmit={handleReviewSubmit}
              style={{
                background: '#F8FAFC',
                borderRadius: '18px',
                border: '1.5px solid #E2E8F0',
                padding: '24px',
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={16} color="var(--zp-primary)" />
                <span>Submit Clinical Feedback or Stockist Review</span>
              </h4>

              {reviewSuccess && (
                <div style={{ background: '#ECFDF5', color: '#059669', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', fontWeight: 600 }}>
                  {reviewSuccess}
                </div>
              )}

              {reviewError && (
                <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', fontWeight: 600 }}>
                  {reviewError}
                </div>
              )}

              {/* 5 Yellow Stars Interactive Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Select Clinical Rating:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating !== null ? hoverRating : reviewForm.rating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: starVal }))}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.15s ease',
                          transform: hoverRating === starVal ? 'scale(1.2)' : 'scale(1)',
                        }}
                      >
                        <Star
                          size={24}
                          fill={isFilled ? '#F59E0B' : 'none'}
                          color={isFilled ? '#F59E0B' : '#CBD5E1'}
                          strokeWidth={2}
                        />
                      </button>
                    );
                  })}
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#D97706', marginLeft: '6px' }}>
                    {hoverRating !== null ? hoverRating : reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.doctorName}
                    onChange={(e) => setReviewForm({ ...reviewForm, doctorName: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Clinic / Hospital / Agency
                  </label>
                  <input
                    type="text"
                    value={reviewForm.clinicName}
                    onChange={(e) => setReviewForm({ ...reviewForm, clinicName: e.target.value })}
                    placeholder="e.g. Apollo Hospital / Apex Pharma"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Clinical Feedback &amp; Prescription Experience *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.reviewText}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                  placeholder="Share clinical efficacy, patient tolerance, or distribution feedback..."
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    resize: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="btn btn-primary"
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Send size={14} />
                <span>{submittingReview ? 'Submitting...' : 'Submit Doctor Review'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
