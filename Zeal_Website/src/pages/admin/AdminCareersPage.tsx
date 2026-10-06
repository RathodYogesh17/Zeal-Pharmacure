import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Plus,
  FileText,
  Download,
  X,
  Phone,
  Mail,
  Sparkles,
  Trash2,
  Eye,
  Calendar,
  Building,
} from 'lucide-react';
import { careerService } from '../../api/careerService';
import { API_BASE } from '../../api/apiClient';
import type { IJobOpening, ICareerApplication } from '../../types';
import { CAREER_ROLE_PRESETS, ZEAL_SINGLE_LOCATION } from '../../constants/careerPresets';

export const AdminCareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<IJobOpening[]>([]);
  const [applications, setApplications] = useState<ICareerApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'applications' | 'vacancies'>('applications');
  const [loading, setLoading] = useState(true);

  // New Job Modal
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Sales & Distribution',
    location: ZEAL_SINGLE_LOCATION,
    jobType: 'FULL_TIME',
    experienceRequired: '1 - 3 Years',
    salaryRange: '₹3.0 LPA - ₹4.5 LPA',
    openingsCount: 2,
    description: '',
    responsibilities: [
      'Coordinate stock receipt, verification, storage or customer dispatch.',
      'Ensure strict batch and expiry record compliance.',
    ],
    requirements: [
      'Pharmaceutical wholesale / stockist / supply chain experience.',
      'High accuracy, discipline, and customer-first mindset.',
    ],
  });

  const handleSelectRolePreset = (roleTitle: string) => {
    const preset = CAREER_ROLE_PRESETS.find(p => p.title === roleTitle);
    if (!preset) return;
    setJobForm(prev => ({
      ...prev,
      title: preset.title,
      department: preset.department,
      location: preset.location,
      jobType: preset.jobType,
      experienceRequired: preset.experienceRequired,
      salaryRange: preset.salaryRange,
      openingsCount: preset.openingsCount,
      description: preset.description,
      responsibilities: preset.responsibilities,
      requirements: preset.requirements,
    }));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        careerService.getJobs(),
        careerService.adminGetApplications(),
      ]);
      setJobs(jobsData);
      setApplications(appsData);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingJob(true);
    try {
      await careerService.adminCreateJob({
        ...jobForm,
        status: 'OPEN',
        isActive: true,
      });
      setIsJobModalOpen(false);
      loadData();
    } catch (err) {
      console.warn(err);
    } finally {
      setCreatingJob(false);
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove vacancy "${title}"?`)) return;
    try {
      await careerService.adminDeleteJob(id);
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch (err) {
      console.warn(err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await careerService.adminUpdateApplicationStatus(id, newStatus);
      setApplications(prev => prev.map(a => (a._id === id ? { ...a, status: newStatus as any } : a)));
    } catch (err) {
      console.warn(err);
    }
  };

  const getResumeUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    const base = API_BASE.replace('/api', '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
            Careers & HR Recruitment Management
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
            Review candidate resumes and publish open vacancies across departments.
          </p>
        </div>

        <button
          onClick={() => setIsJobModalOpen(true)}
          className="btn btn-primary"
          style={{ borderRadius: '8px', fontSize: '14px' }}
        >
          <Plus size={16} />
          <span>Post New Job Vacancy</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #E2E8F0', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            padding: '12px 18px',
            borderBottom: activeTab === 'applications' ? '2.5px solid #6828DC' : '2.5px solid transparent',
            color: activeTab === 'applications' ? '#6828DC' : '#64748B',
            fontWeight: activeTab === 'applications' ? 700 : 500,
            fontSize: '14.5px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Users size={17} />
          <span>Candidate Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vacancies')}
          style={{
            padding: '12px 18px',
            borderBottom: activeTab === 'vacancies' ? '2.5px solid #6828DC' : '2.5px solid transparent',
            color: activeTab === 'vacancies' ? '#6828DC' : '#64748B',
            fontWeight: activeTab === 'vacancies' ? 700 : 500,
            fontSize: '14.5px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Briefcase size={17} />
          <span>Active Vacancies ({jobs.length})</span>
        </button>
      </div>

      {/* APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6828DC' }}>Loading candidates...</div>
          ) : applications.length === 0 ? (
            <div style={{ background: '#FFFFFF', padding: '48px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid #E2E8F0' }}>
              <FileText size={36} style={{ color: '#94A3B8', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No candidate applications yet</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
                Candidate submissions from the Careers page will appear here with downloadable PDF resumes.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {applications.map(app => (
                <div
                  key={app._id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    padding: '24px',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-purple">{app.jobTitle || 'General Application'}</span>
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A' }}>
                        {app.fullName}
                      </h3>
                    </div>

                    {/* Status Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>HR Status:</label>
                      <select
                        value={app.status || 'PENDING'}
                        onChange={e => handleStatusChange(app._id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '13px',
                          fontWeight: 700,
                          background: app.status === 'SELECTED' ? '#ECFDF5' : app.status === 'SHORTLISTED' ? '#EFF6FF' : '#FFFBEB',
                          color: app.status === 'SELECTED' ? '#059669' : app.status === 'SHORTLISTED' ? '#2563EB' : '#D97706',
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="INTERVIEW_SCHEDULED">INTERVIEW SCHEDULED</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="SELECTED">SELECTED</option>
                      </select>
                    </div>
                  </div>

                  {/* Candidate Details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    padding: '12px 16px',
                    background: '#F8FAFC',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}>
                    <div>
                      <span style={{ color: '#64748B' }}>Experience: </span>
                      <strong>{app.totalExperience}</strong>
                    </div>
                    {app.currentCompany && (
                      <div>
                        <span style={{ color: '#64748B' }}>Company: </span>
                        <strong>{app.currentCompany}</strong>
                      </div>
                    )}
                    {app.currentCtc && (
                      <div>
                        <span style={{ color: '#64748B' }}>Current CTC: </span>
                        <strong>{app.currentCtc}</strong>
                      </div>
                    )}
                  </div>

                  {app.coverNote && (
                    <p style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', marginBottom: '16px' }}>
                      "{app.coverNote}"
                    </p>
                  )}

                  {/* Contact & Download Resume */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13.5px' }}>
                      <a href={`tel:${app.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6828DC', fontWeight: 600 }}>
                        <Phone size={15} />
                        <span>{app.phone}</span>
                      </a>
                      <a href={`mailto:${app.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                        <Mail size={15} />
                        <span>{app.email}</span>
                      </a>
                    </div>

                    {app.resumeUrl && (
                      <a
                        href={getResumeUrl(app.resumeUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ borderRadius: '6px' }}
                      >
                        <Download size={14} />
                        <span>Download Resume (PDF)</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VACANCIES TAB */}
      {activeTab === 'vacancies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.length === 0 ? (
            <div style={{ background: '#FFFFFF', padding: '48px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid #E2E8F0' }}>
              <Briefcase size={36} style={{ color: '#94A3B8', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No active vacancies published yet</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px', marginBottom: '20px' }}>
                All previous static vacancies have been cleared. You can post new vacancies dynamically using the button below.
              </p>
              <button
                type="button"
                onClick={() => setIsJobModalOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '8px', padding: '10px 20px', fontWeight: 700 }}
              >
                + Post New Job Vacancy
              </button>
            </div>
          ) : (
            jobs.map(j => (
              <div
                key={j._id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1.5px solid #EDE9FE',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  boxShadow: '0 2px 8px rgba(104, 40, 220, 0.04)',
                }}
              >
                {/* Left Column: Department, Badges, Title, Salary, Vacancy & Date */}
                <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: '#FAF5FF',
                        color: '#6828DC',
                        border: '1px solid #DDD6FE',
                        padding: '2.5px 10px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Building size={12} />
                      <span>{j.department}</span>
                    </span>

                    <span
                      style={{
                        background: '#F1F5F9',
                        color: '#475569',
                        border: '1px solid #E2E8F0',
                        padding: '2.5px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {j.jobType === 'FULL_TIME' ? 'Full Time' : j.jobType}
                    </span>

                    {j.isFeatured && (
                      <span
                        style={{
                          background: '#FEF3C7',
                          color: '#B45309',
                          border: '1px solid #FDE68A',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                        }}
                      >
                        ★ Featured
                      </span>
                    )}

                    <span
                      style={{
                        background: j.status === 'OPEN' ? '#ECFDF5' : '#FEF2F2',
                        color: j.status === 'OPEN' ? '#059669' : '#DC2626',
                        border: `1px solid ${j.status === 'OPEN' ? '#A7F3D0' : '#FECACA'}`,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                      {j.status === 'OPEN' ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>

                  {/* Title & Salary */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {j.title}
                    </h3>
                    {j.salaryRange && (
                      <span
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 700,
                          color: '#059669',
                          background: '#ECFDF5',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          border: '1px solid #A7F3D0',
                        }}
                      >
                        {j.salaryRange}
                      </span>
                    )}
                  </div>

                  {/* Vacancy count + Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, color: '#334155' }}>
                      <Users size={13} style={{ color: '#6828DC' }} />
                      <span>{j.openingsCount || 1} Vaca</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} style={{ color: '#6828DC' }} />
                      <span>
                        {j.createdAt
                          ? new Date(j.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions: View icon and Delete icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Job Details:\nTitle: ${j.title}\nDepartment: ${j.department}\nLocation: ${j.location}\nSalary: ${j.salaryRange || 'N/A'}\nOpenings: ${j.openingsCount}`);
                    }}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '9px',
                      background: '#EDE9FE',
                      color: '#6828DC',
                      border: '1.5px solid #DDD6FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteJob(j._id, j.title)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '9px',
                      background: '#FEF2F2',
                      color: '#DC2626',
                      border: '1.5px solid #FECACA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Delete Vacancy"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* POST NEW JOB MODAL */}
      {isJobModalOpen && (
        <div className="modal-overlay" onClick={() => setIsJobModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '600px', padding: '32px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={22} style={{ color: '#6828DC' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                  Post New Job Vacancy
                </h3>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                style={{ padding: '6px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Wholesale Preset Dropdown */}
              <div style={{ background: '#FAF5FF', border: '1.5px solid #DDD6FE', borderRadius: '10px', padding: '12px 14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 800, color: '#6828DC', marginBottom: '6px' }}>
                  <Sparkles size={15} />
                  <span>Choose from 16 Wholesale Distribution Roles (Auto-fills form):</span>
                </label>
                <select
                  onChange={(e) => handleSelectRolePreset(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #C4B5FD',
                    fontSize: '13px',
                    background: '#FFFFFF',
                    color: '#1E1B4B',
                    fontWeight: 600,
                  }}
                >
                  <option value="">-- Select Wholesale Role to Pre-fill --</option>
                  {CAREER_ROLE_PRESETS.map((preset) => (
                    <option key={preset.title} value={preset.title}>
                      {preset.title} ({preset.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pharmacist, Purchase Executive, Dispatch Executive"
                  value={jobForm.title}
                  onChange={e => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobForm.department}
                    onChange={e => setJobForm(prev => ({ ...prev, department: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      background: '#FFFFFF',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Location (Surat Central Godown) *
                  </label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={jobForm.location}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '12px',
                      background: '#F8FAFC',
                      color: '#475569',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Experience Required *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 - 3 Years"
                    value={jobForm.experienceRequired}
                    onChange={e => setJobForm(prev => ({ ...prev, experienceRequired: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Salary Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹3.0 LPA - ₹4.5 LPA"
                    value={jobForm.salaryRange}
                    onChange={e => setJobForm(prev => ({ ...prev, salaryRange: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Role Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline core job duties and expectations..."
                  value={jobForm.description}
                  onChange={e => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={creatingJob}
                className="btn btn-primary"
                style={{ width: '100%', padding: '11px', borderRadius: '8px', fontWeight: 700, marginTop: '8px' }}
              >
                {creatingJob ? 'Posting Vacancy...' : 'Publish Job Vacancy'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
