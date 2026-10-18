import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Inbox,
  Search,
  X,
  RefreshCw,
  Sparkles,
  Building2,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { careerService } from '../api/careerService';
import type { IJobOpening } from '../types';
import { PreFooterBanner } from '../components/layout/PreFooterBanner';
import {
  CareerHero,
  CareerJobListItem,
  CareerHiringProcess,
  CareerPerksBanner,
  CareerWorkflowSection,
} from '../components/career';
import { ThemedSelect } from '../components/common/ThemedSelect';
import { SectionHeader } from '../components/common';
import { MapPin } from 'lucide-react';
import { CAREER_ROLE_PRESETS } from '../constants/careerPresets';

export const CareerPage: React.FC = () => {
  const [jobs, setJobs] = useState<IJobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedJobType, setSelectedJobType] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await careerService.getJobs();
      setJobs(data);
    } catch (err) {
      console.warn('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when search, role, or department changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedDept, selectedJobType]);

  // 16 Wholesale Positions Options
  const roleFilterOptions = useMemo(() => {
    return [
      { value: 'ALL', label: 'All 16 Wholesale Positions' },
      ...CAREER_ROLE_PRESETS.map((p) => ({
        value: p.title,
        label: p.title,
      })),
    ];
  }, []);

  // Extract unique departments dynamically from active database jobs
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return ['ALL', ...Array.from(set)];
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      // Department filter
      if (selectedDept !== 'ALL' && j.department !== selectedDept) {
        return false;
      }
      // Position / Role filter (16 positions)
      if (selectedRole !== 'ALL') {
        const rLower = selectedRole.toLowerCase();
        const tLower = j.title?.toLowerCase() || '';
        if (!tLower.includes(rLower) && !rLower.includes(tLower)) {
          return false;
        }
      }
      // Job Type filter
      if (selectedJobType !== 'ALL' && j.jobType !== selectedJobType) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = j.title?.toLowerCase().includes(q);
        const matchesDept = j.department?.toLowerCase().includes(q);
        const matchesLoc = j.location?.toLowerCase().includes(q);
        const matchesDesc = j.description?.toLowerCase().includes(q);
        const matchesReq = j.requirements?.some((r) => r.toLowerCase().includes(q));
        const matchesResp = j.responsibilities?.some((r) => r.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDept && !matchesLoc && !matchesDesc && !matchesReq && !matchesResp) {
          return false;
        }
      }
      return true;
    });
  }, [jobs, selectedRole, selectedDept, selectedJobType, searchQuery]);

  // Paginated 10 jobs per page
  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, currentPage, PAGE_SIZE]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRole('ALL');
    setSelectedDept('ALL');
    setSelectedJobType('ALL');
    setCurrentPage(1);
  };

  return (
    <div style={{ background: '#FAFAFC', minHeight: '100vh' }}>
      {/* 1. Hero Header Banner */}
      <CareerHero totalJobs={jobs.length} />

      {/* 2. Products-Style Catalog Controls Bar (Sticky / Clean) */}
      <section
        style={{
          background: '#FFFFFF',
          borderBottom: '1.5px solid #E2E8F0',
          padding: '20px 0',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div className="container">
          {/* Top Search & Filter Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            {/* Search Input Box */}
            <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '460px' }}>
              <Search
                size={18}
                color="#6828DC"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Search by role (e.g. Pharmacist, Picker, Dispatch)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#F8FAFC',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6828DC';
                  e.target.style.background = '#FFFFFF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#CBD5E1';
                  e.target.style.background = '#F8FAFC';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                  title="Clear Search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Dropdown Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {/* 16 Wholesale Positions Filter Dropdown */}
              <div style={{ width: '280px' }}>
                <ThemedSelect
                  value={selectedRole}
                  onChange={(val) => setSelectedRole(val)}
                  options={roleFilterOptions}
                  searchable={true}
                  placeholder="Filter by Position..."
                />
              </div>

              {/* Single Verified Location Badge / Display */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '9px 14px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#334155',
                  whiteSpace: 'nowrap',
                }}
                title="Central Distribution Hub: Zeal Pharma, 7015, Billingo, Parvat Patiya, Sita Nagar, Surat"
              >
                <MapPin size={15} style={{ color: '#6828DC', flexShrink: 0 }} />
                <span>Surat Central Godown</span>
              </div>

              {/* Clear Filters Button */}
              {(searchQuery || selectedRole !== 'ALL' || selectedDept !== 'ALL' || selectedJobType !== 'ALL') && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    padding: '9px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#E2E8F0')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                >
                  <RefreshCw size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Department Filter Pills (Like Product Categories) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginRight: '4px' }}>
              Departments:
            </span>
            {departmentsList.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 800 : 600,
                    whiteSpace: 'nowrap',
                    border: isSelected ? '1.5px solid #6828DC' : '1px solid #E2E8F0',
                    background: isSelected ? '#6828DC' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(104, 40, 220, 0.25)' : 'none',
                  }}
                >
                  {dept === 'ALL' ? 'All Roles' : dept}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Main Product-Style Job Vacancies List Section */}
      <div className="container" style={{ padding: '52px 24px 80px' }}>
        {/* Section Header */}
        <SectionHeader
          badge="Current Openings Catalog"
          badgeIcon={<Briefcase size={13} />}
          title={`Available Job Positions (${filteredJobs.length})`}
          titleStyle={{ fontWeight: 900 }}
          subtitle="Click any position to review full responsibilities & submit your application."
          style={{ marginBottom: '36px' }}
        />

        {/* Loading State */}
        {loading ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#6828DC' }}>
            <div style={{ width: '40px', height: '40px', margin: '0 auto 12px' }} className="pulse-dot">
              <Briefcase size={40} />
            </div>
            <p style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
              Loading verified database openings...
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Empty State - Rich Themed Card with Generous Breathing Room */
          <div
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 100%)',
              borderRadius: '28px',
              border: '1.5px solid #EDE9FE',
              padding: 'clamp(48px, 6vw, 68px) clamp(24px, 4vw, 48px)',
              textAlign: 'center',
              boxShadow: '0 20px 45px -12px rgba(104, 40, 220, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04)',
              maxWidth: '820px',
              margin: '0 auto',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle Top-Center Ambient Purple Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '320px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(104, 40, 220, 0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Pill Badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F5F3FF',
                border: '1px solid #DDD6FE',
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--zp-primary, #6828DC)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '22px',
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              }}
            >
              <Sparkles size={12} />
              <span>Recruitment Portal</span>
            </span>

            {/* Glowing Icon Aura Tile */}
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '28px',
                background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 60%, #DDD6FE 100%)',
                border: '1.5px solid #C4B5FD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'var(--zp-primary, #6828DC)',
                boxShadow: '0 14px 32px -6px rgba(104, 40, 220, 0.22)',
              }}
            >
              <Inbox size={48} strokeWidth={1.6} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                fontSize: 'clamp(22px, 2.8vw, 26px)',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.5px',
                margin: '0 0 10px 0',
              }}
            >
              {jobs.length === 0
                ? 'No Active Openings Published Currently'
                : 'No Matching Job Openings Found'}
            </h3>

            {jobs.length === 0 ? (
              <p
                style={{
                  fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
                  color: '#64748B',
                  fontSize: '14.5px',
                  lineHeight: 1.6,
                  maxWidth: '520px',
                  margin: '0 auto 28px',
                }}
              >
                All wholesale departments and central depot positions are currently filled. New vacancies will be updated here as soon as requirements open.
              </p>
            ) : (
              <>
                <p style={{ color: '#64748B', fontSize: '14.5px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px' }}>
                  Try clearing your search query or department filters to see other available openings.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="btn btn-secondary"
                    style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 700 }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </>
            )}

            {/* Bottom Highlights Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                paddingTop: '22px',
                borderTop: '1px solid #EDE9FE',
                marginTop: '8px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#475569',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '6px 14px',
                  borderRadius: '999px',
                }}
              >
                <Building2 size={13} style={{ color: '#6828DC' }} />
                <span>Surat Central Godown</span>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#475569',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '6px 14px',
                  borderRadius: '999px',
                }}
              >
                <ShieldCheck size={13} style={{ color: '#059669' }} />
                <span>Verified Direct Hiring</span>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#475569',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '6px 14px',
                  borderRadius: '999px',
                }}
              >
                <Clock size={13} style={{ color: '#F59E0B' }} />
                <span>Real-Time Status Updates</span>
              </div>
            </div>
          </div>
        ) : (
          /* List Type View of Vacancies (Matching Products Page List Type) */
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {paginatedJobs.map((job) => (
                <CareerJobListItem key={job._id} job={job} />
              ))}
            </div>

            {/* Right-Side Bottom Pagination Bar */}
            {filteredJobs.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  padding: '16px 20px',
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                  marginBottom: '48px',
                }}
              >
                {/* Left: Summary */}
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                  Showing <strong style={{ color: '#0F172A' }}>{Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredJobs.length)} - {Math.min(currentPage * PAGE_SIZE, filteredJobs.length)}</strong> of <strong style={{ color: '#0F172A' }}>{filteredJobs.length}</strong> Vacancies
                </div>

                {/* Right: Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: currentPage === 1 ? '#F8FAFC' : '#FFFFFF',
                      color: currentPage === 1 ? '#94A3B8' : '#334155',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                    const isActive = pg === currentPage;
                    return (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => setCurrentPage(pg)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          border: isActive ? '1.5px solid #6828DC' : '1px solid #E2E8F0',
                          background: isActive ? '#6828DC' : '#FFFFFF',
                          color: isActive ? '#FFFFFF' : '#334155',
                          fontWeight: isActive ? 800 : 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isActive ? '0 2px 8px rgba(104, 40, 220, 0.25)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {pg}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: currentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
                      color: currentPage === totalPages ? '#94A3B8' : '#334155',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Full Width Perks & Culture Banner with Generous Spacing */}
        <div style={{ marginTop: '64px', marginBottom: '56px' }}>
          <CareerPerksBanner />
        </div>
      </div>

      {/* 5. Complete Company Workflow & Parallel Departments */}
      <CareerWorkflowSection />

      {/* 6. 5-Step Transparent Hiring Process */}
      <CareerHiringProcess />

      {/* 7. Pre-Footer Banner */}
      <PreFooterBanner />
    </div>
  );
};
