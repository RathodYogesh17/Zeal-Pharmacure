import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Share2,
  Sparkles,
  Award,
  Check,
  DollarSign,
  GraduationCap,
} from 'lucide-react';
import { careerService } from '../api/careerService';
import type { IJobOpening } from '../types';
import { CareerApplicationForm } from '../components/career/CareerApplicationForm';
import { CareerPerksBanner } from '../components/career/CareerPerksBanner';
import { CareerHiringProcess } from '../components/career/CareerHiringProcess';
import { PreFooterBanner } from '../components/layout/PreFooterBanner';
import '../components/career/CareerStyles.css';

export const JobDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<IJobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (slug) {
      loadJob(slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [slug]);

  const loadJob = async (jobSlug: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await careerService.getJobBySlug(jobSlug);
      if (data) {
        setJob(data);
      } else {
        setError('Job vacancy not found');
      }
    } catch (err: any) {
      console.warn('Failed to load job:', err);
      setError(err.message || 'Job vacancy not found');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div style={{ background: '#FAFAFC', minHeight: '80vh', padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#6828DC' }} className="pulse-dot">
          <Briefcase size={48} />
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Loading Job Details...</h3>
        <p style={{ color: '#64748B', fontSize: '14px' }}>Fetching official opening requirements &amp; application form...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div style={{ background: '#FAFAFC', minHeight: '80vh', padding: '120px 24px', textAlign: 'center' }}>
        <div
          style={{
            background: '#FFFFFF',
            maxWidth: '560px',
            margin: '0 auto',
            borderRadius: '24px',
            padding: '48px 32px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#DC2626',
            }}
          >
            <Briefcase size={28} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
            Job Vacancy Not Found
          </h2>
          <p style={{ color: '#64748B', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '24px' }}>
            The position you are looking for may have expired or been filled. Please check our current openings list.
          </p>
          <Link
            to="/career"
            className="btn btn-primary"
            style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: 700, textDecoration: 'none' }}
          >
            <ArrowLeft size={16} style={{ marginRight: '8px' }} />
            <span>Browse All Career Openings</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAFAFC', minHeight: '100vh' }}>
      {/* 1. Hero Header & Breadcrumb - Home Page Style Purple Theme Banner (Content Only, No Image/Slider) */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 42%, #2E1065 78%, #3B0764 100%)',
          color: '#FFFFFF',
          padding: '42px 0 54px',
          borderBottom: '3px solid var(--zp-primary, #6828DC)',
          boxShadow: '0 15px 35px -10px rgba(104, 40, 220, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Background Ambient Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-60px',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(104, 40, 220, 0.45) 0%, rgba(139, 92, 246, 0.15) 55%, transparent 75%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-60px',
            width: '460px',
            height: '460px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(104, 40, 220, 0.08) 60%, transparent 75%)',
            filter: 'blur(65px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb Navigation */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#CBD5E1',
              marginBottom: '20px',
              flexWrap: 'wrap',
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            }}
          >
            <Link
              to="/"
              style={{
                color: '#DDD6FE',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#DDD6FE')}
            >
              Home
            </Link>
            <ChevronRight size={14} color="#A78BFA" />
            <Link
              to="/career"
              style={{
                color: '#DDD6FE',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#DDD6FE')}
            >
              Careers
            </Link>
            <ChevronRight size={14} color="#A78BFA" />
            <span style={{ color: '#E2E8F0' }}>{job.department}</span>
            <ChevronRight size={14} color="#A78BFA" />
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>{job.title}</span>
          </nav>

          {/* Back button */}
          <button
            onClick={() => navigate('/career')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '999px',
              padding: '7px 18px',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              marginBottom: '22px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.borderColor = '#C4B5FD';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft size={14} style={{ color: '#C4B5FD' }} />
            <span>Back to All Openings</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '28px',
            }}
          >
            <div style={{ maxWidth: '840px' }}>
              {/* Badges Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(104, 40, 220, 0.4)',
                    border: '1px solid rgba(196, 181, 253, 0.45)',
                    color: '#EDE9FE',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={12} style={{ color: '#C4B5FD' }} />
                  {job.department}
                </span>

                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(52, 211, 153, 0.45)',
                    color: '#6EE7B7',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                  {job.openingsCount} {job.openingsCount === 1 ? 'Opening' : 'Openings'}
                </span>

                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#F1F5F9',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                  }}
                >
                  {job.jobType === 'FULL_TIME' ? 'Full Time' : job.jobType}
                </span>

                <span
                  style={{
                    background: 'rgba(245, 158, 11, 0.18)',
                    border: '1px solid rgba(251, 191, 36, 0.4)',
                    color: '#FDE68A',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                  }}
                >
                  ⚡ Fast-Track 48-Hour HR Review
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                  fontSize: 'clamp(30px, 4.2vw, 44px)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.16,
                  letterSpacing: '-0.8px',
                  margin: '0 0 18px 0',
                }}
              >
                {job.title}
              </h1>

              {/* Meta information chips in glassmorphic cards */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '13.5px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    color: '#F1F5F9',
                    fontWeight: 600,
                  }}
                >
                  <MapPin size={15} style={{ color: '#34D399' }} />
                  <span>{job.location}</span>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    color: '#F1F5F9',
                    fontWeight: 600,
                  }}
                >
                  <Clock size={15} style={{ color: '#FBBF24' }} />
                  <span>Experience: {job.experienceRequired}</span>
                </div>

                {job.salaryRange && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(104, 40, 220, 0.4)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(196, 181, 253, 0.45)',
                      borderRadius: '999px',
                      padding: '8px 18px',
                      color: '#EDE9FE',
                      fontWeight: 800,
                    }}
                  >
                    <DollarSign size={15} style={{ color: '#C4B5FD' }} />
                    <span>{job.salaryRange}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Share Job Button */}
            <div>
              <button
                type="button"
                onClick={handleShare}
                style={{
                  background: copiedLink ? '#059669' : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: copiedLink ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '999px',
                  padding: '11px 22px',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                }}
                onMouseEnter={(e) => {
                  if (!copiedLink) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #7C3AED, #6828DC)';
                    e.currentTarget.style.borderColor = '#A78BFA';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copiedLink) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                  }
                }}
              >
                {copiedLink ? <Check size={16} /> : <Share2 size={16} style={{ color: '#C4B5FD' }} />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Vacancy'}</span>
              </button>
            </div>
          </div>

          {/* Key Facts / Highlights Bar - Rich Content Showcase (No image, pure content) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                borderRadius: '14px',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(104, 40, 220, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C4B5FD',
                  flexShrink: 0,
                }}
              >
                <Award size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase' }}>
                  Verification
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  WHO-GMP Compliant Depot
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                borderRadius: '14px',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6EE7B7',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase' }}>
                  Hiring Status
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  Active &amp; Urgent Requisition
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                borderRadius: '14px',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FDE68A',
                  flexShrink: 0,
                }}
              >
                <Clock size={18} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#CBD5E1', fontWeight: 600, textTransform: 'uppercase' }}>
                  Response Time
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  48 Hours Feedback
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Two-Column Section: Left Job Details, Right Application Form */}
      <div className="container zp-job-detail-section">
        <div className="zp-job-detail-grid">
          {/* LEFT COLUMN: Comprehensive Job Overview & Requirements */}
          <div className="zp-job-detail-left-col">
            {/* Card 1: Role Overview & Scope */}
            <div className="zp-job-detail-card">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#EDE9FE',
                  color: '#6828DC',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '16px',
                }}
              >
                <Sparkles size={14} />
                <span>Role Overview &amp; Objective</span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginBottom: '14px' }}>
                About this Position at Zeal Pharmacure
              </h2>

              <p
                style={{
                  fontSize: '15px',
                  color: '#475569',
                  lineHeight: 1.75,
                  margin: 0,
                  whiteSpace: 'pre-line',
                }}
              >
                {job.description}
              </p>
            </div>

            {/* Card 2: Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="zp-job-detail-card">
                <h3
                  style={{
                    fontSize: '19px',
                    fontWeight: 900,
                    color: '#0F172A',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#ECFDF5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10B981',
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <span>Key Job Responsibilities</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {job.responsibilities.map((resp, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        background: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <CheckCircle2 size={16} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 3: Requirements & Eligibility */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="zp-job-detail-card">
                <h3
                  style={{
                    fontSize: '19px',
                    fontWeight: 900,
                    color: '#0F172A',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#EDE9FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6828DC',
                    }}
                  >
                    <Award size={18} />
                  </div>
                  <span>Candidate Eligibility &amp; Requirements</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {job.qualificationRequired && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#FAF5FF',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1.5px solid #DDD6FE',
                        marginBottom: '4px',
                      }}
                    >
                      <GraduationCap size={18} color="#6828DC" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#6828DC', textTransform: 'uppercase' }}>
                          Required Educational Qualification
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                          {job.qualificationRequired}
                        </div>
                      </div>
                    </div>
                  )}

                  {job.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        background: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <CheckCircle2 size={16} color="#6828DC" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card 4: 4 Zeal Corporate Culture Highlights */}
            <div className="zp-job-detail-card">
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                Why Work With Zeal Pharmacure?
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                }}
              >
                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#6828DC', fontWeight: 800, textTransform: 'uppercase' }}>Team Strength</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>23+ Dedicated Staff</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Close-knit, transparent team structure</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 800, textTransform: 'uppercase' }}>Quality Standard</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>WHO-GMP Certified</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Ethical pharmaceutical distribution</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 800, textTransform: 'uppercase' }}>Career Progression</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>Meritocracy Appraisals</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Yearly merit reviews &amp; incentives</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 800, textTransform: 'uppercase' }}>National Reach</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>18+ Indian States</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Pan-India stockist network</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dedicated Application Form For This Specific Job */}
          <div className="zp-job-detail-right-col zp-job-detail-sticky-wrap">
            <CareerApplicationForm
              jobs={[job]}
              selectedJobId={job._id}
              selectedJobTitle={job.title}
              onJobSelect={() => {}}
              targetJob={job}
            />
          </div>
        </div>

        {/* 3. Perks Banner */}
        <div style={{ marginBottom: '56px' }}>
          <CareerPerksBanner />
        </div>
      </div>

      {/* 4. 5-Step Hiring Process */}
      <CareerHiringProcess />

      {/* 5. Pre-Footer Banner */}
      <PreFooterBanner />
    </div>
  );
};
