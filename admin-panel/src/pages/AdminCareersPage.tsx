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
  Trash2,
  CheckCircle,
  AlertCircle,
  Star,
  Check,
  Eye,
  Building,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap,
  Globe,
  Sparkles,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { careerService } from '../api/careerService';
import { productService } from '../api/productService';
import { API_BASE } from '../api/apiClient';
import type { IJobOpening, ICareerApplication, IEnquiry, EnquiryStatus } from '../types';
import { CAREER_ROLE_PRESETS, ZEAL_SINGLE_LOCATION } from '../constants/careerPresets';
import { AdminEnquiryDetailModal } from '../components/enquiries';
import {
  ThemeSelect,
  CustomThemeSelect,
  DateFilterSelect,
  TablePagination,
  ThemeQuillEditor,
  filterByDateRange,
  DateFilterType,
  AdvancedWhatsAppModal,
  ZealLoader,
} from '../components/common';
import { useCareersDataQuery } from '../hooks/queries/useCareersQuery';

export const AdminCareersPage: React.FC = () => {
  const { data: careersQueryData, isLoading: loadingCareers, isFetching, refetch } = useCareersDataQuery();

  const [jobs, setJobs] = useState<IJobOpening[]>(() => careersQueryData?.jobs || []);
  const [viewCandidateModal, setViewCandidateModal] = useState<ICareerApplication | null>(null);
  const [applications, setApplications] = useState<ICareerApplication[]>(() => careersQueryData?.applications || []);
  const [reviews, setReviews] = useState<any[]>(() => careersQueryData?.reviews || []);
  const [activeTab, setActiveTab] = useState<'applications' | 'vacancies' | 'reviews'>('applications');
  const loading = loadingCareers && jobs.length === 0 && applications.length === 0;

  // Filters for Applications
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');
  const [appDateFilter, setAppDateFilter] = useState<DateFilterType>('ALL');
  const [appPage, setAppPage] = useState(1);
  const [appPageSize, setAppPageSize] = useState(10);

  // Filters for Vacancies
  const [jobSearch, setJobSearch] = useState('');
  const [jobRoleFilter, setJobRoleFilter] = useState('ALL');
  const [jobDateFilter, setJobDateFilter] = useState<DateFilterType>('ALL');
  const [jobPage, setJobPage] = useState(1);
  const [jobPageSize, setJobPageSize] = useState(5);

  // Filters for Reviews
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('ALL');
  const [reviewDateFilter, setReviewDateFilter] = useState<DateFilterType>('ALL');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPageSize, setReviewPageSize] = useState(10);

  // Feedback Messages
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // New Job Modal State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [creatingJob, setCreatingJob] = useState(false);
  const [showJobSeo, setShowJobSeo] = useState(false);
  const [jobTitleError, setJobTitleError] = useState('');

  // View Job Details Modal State
  const [viewJobModal, setViewJobModal] = useState<IJobOpening | null>(null);
  const [updatingJobStatus, setUpdatingJobStatus] = useState(false);

  // ATS Interview & Notes Modal States
  const [interviewModalApp, setInterviewModalApp] = useState<ICareerApplication | null>(null);
  const [interviewRoundName, setInterviewRoundName] = useState('Technical Interview');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewMode, setInterviewMode] = useState<'ONLINE' | 'OFFLINE' | 'PHONE'>('ONLINE');
  const [meetingLink, setMeetingLink] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [interviewSubmitting, setInterviewSubmitting] = useState(false);

  // ATS Candidate Note Modal State
  const [noteModalApp, setNoteModalApp] = useState<ICareerApplication | null>(null);
  const [candidateNote, setCandidateNote] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  // Advanced WhatsApp Candidate Modal
  const [activeWhatsAppCandidate, setActiveWhatsAppCandidate] = useState<ICareerApplication | null>(null);

  const initialJobForm = {
    title: '',
    department: 'Pharmacy & Quality Check',
    location: ZEAL_SINGLE_LOCATION,
    jobType: 'FULL_TIME',
    experienceRequired: '1 - 3 Years',
    salaryRange: '₹3.0 LPA - ₹4.5 LPA',
    openingsCount: 2,
    qualificationRequired: 'B.Pharma / D.Pharma / Graduate',
    description: '',
    responsibilitiesText: '• Medicine-related supervision across storage and dispatch.\n• Check incoming and outgoing batch numbers and expiry dates.\n• Maintain regulatory registers and Good Storage Practices.',
    requirementsText: '• Relevant pharmaceutical wholesale / stockist experience.\n• Punctual, accurate, and disciplined teamwork.\n• Good communication and verification skills.',
    applicationEmail: 'careers@zealpharma.com',
    applicationDeadline: '',
    isFeatured: false,
    isActive: true,
    seo: {
      metaTitle: '',
      metaDescription: '',
    },
  };
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [selectedPresetRole, setSelectedPresetRole] = useState('');

  const handleSelectRolePreset = (roleTitle: string) => {
    setSelectedPresetRole(roleTitle);
    if (!roleTitle) return;
    const preset = CAREER_ROLE_PRESETS.find((p) => p.title === roleTitle);
    if (!preset) return;
    setJobForm((prev) => ({
      ...prev,
      title: preset.title,
      department: preset.department,
      location: preset.location,
      jobType: preset.jobType,
      experienceRequired: preset.experienceRequired,
      openingsCount: preset.openingsCount,
      salaryRange: preset.salaryRange,
      qualificationRequired: preset.qualificationRequired,
      description: preset.description,
      responsibilitiesText: preset.responsibilities.map((r) => `• ${r}`).join('\n'),
      requirementsText: preset.requirements.map((r) => `• ${r}`).join('\n'),
    }));
  };

  useEffect(() => {
    if (careersQueryData) {
      setJobs(careersQueryData.jobs);
      setApplications(careersQueryData.applications);
      setReviews(careersQueryData.reviews);
    }
  }, [careersQueryData]);

  const loadData = () => {
    refetch();
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title.trim()) {
      setJobTitleError('Job Designation / Title is required.');
      return;
    }
    setJobTitleError('');

    const desc = jobForm.description.trim() ||
      `Exciting career opening for ${jobForm.title} in our ${jobForm.department} team at ${jobForm.location}. Candidates must possess strong pharmaceutical ethics, technical competence, and dedication to WHO-GMP standards.`;

    const responsibilities = jobForm.responsibilitiesText
      .split('\n')
      .map((s) => s.replace(/^[\s•\-*]+/, '').trim())
      .filter(Boolean);

    const requirements = jobForm.requirementsText
      .split('\n')
      .map((s) => s.replace(/^[\s•\-*]+/, '').trim())
      .filter(Boolean);

    setCreatingJob(true);
    setErrorMsg('');
    try {
      const newJob = await careerService.adminCreateJob({
        title: jobForm.title.trim(),
        department: jobForm.department.trim(),
        location: jobForm.location.trim(),
        jobType: jobForm.jobType,
        experienceRequired: jobForm.experienceRequired.trim(),
        openingsCount: Number(jobForm.openingsCount) || 1,
        salaryRange: jobForm.salaryRange.trim(),
        qualificationRequired: jobForm.qualificationRequired.trim(),
        description: desc,
        responsibilities: responsibilities.length > 0 ? responsibilities : [
          'Meet monthly and quarterly target objectives.',
          'Coordinate with doctors, chemists, and distribution stockists.',
          'Ensure strict compliance with Schedule M and pharmaceutical good practices.',
        ],
        requirements: requirements.length > 0 ? requirements : [
          'Bachelor’s or Master’s degree in Pharmacy, Science, or relevant discipline.',
          'Demonstrated competence and excellent communication skills.',
        ],
        applicationEmail: jobForm.applicationEmail.trim(),
        applicationDeadline: jobForm.applicationDeadline ? new Date(jobForm.applicationDeadline) : undefined,
        status: 'OPEN',
        isActive: jobForm.isActive,
        isFeatured: jobForm.isFeatured,
        seo: {
          metaTitle: jobForm.seo.metaTitle.trim(),
          metaDescription: jobForm.seo.metaDescription.trim(),
        },
      });

      setJobs((prev) => [newJob, ...prev]);
      setIsJobModalOpen(false);
      setJobForm(initialJobForm);
      setSelectedPresetRole('');
      setFeedbackMsg(`Job vacancy "${newJob.title}" posted successfully!`);
      setTimeout(() => setFeedbackMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to post new job opening.');
    } finally {
      setCreatingJob(false);
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove vacancy "${title}"?`)) return;
    try {
      await careerService.adminDeleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      if (viewJobModal?._id === id) setViewJobModal(null);
      setFeedbackMsg(`Job opening "${title}" removed successfully.`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete job opening.');
    }
  };

  const handleToggleJobStatus = async (job: IJobOpening) => {
    const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    setUpdatingJobStatus(true);
    try {
      await careerService.adminUpdateJob(job._id, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j)));
      setViewJobModal((prev) => (prev ? { ...prev, status: newStatus } : null));
      setFeedbackMsg(`Vacancy status updated to ${newStatus}.`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update job status.');
    } finally {
      setUpdatingJobStatus(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await careerService.adminUpdateApplicationStatus(id, newStatus, true);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus as any } : a))
      );
      const app = applications.find((a) => a._id === id);
      setFeedbackMsg(
        `Application status updated to ${newStatus}.${app?.phone ? ' Automated WhatsApp status notification dispatched to candidate.' : ''}`
      );
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update application status.');
    }
  };

  const handleScheduleInterviewRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModalApp) return;
    if (!interviewDate) {
      alert('Please select an interview date and time.');
      return;
    }

    setInterviewSubmitting(true);
    try {
      const res = await careerService.adminScheduleInterviewRound(interviewModalApp._id, {
        roundName: interviewRoundName,
        interviewDate: new Date(interviewDate).toISOString(),
        mode: interviewMode,
        meetingLink: meetingLink || undefined,
        notes: interviewNotes || undefined,
        notifyCandidate: true,
      });

      setApplications((prev) =>
        prev.map((a) => (a._id === interviewModalApp._id ? (res.application || { ...a, status: 'SHORTLISTED' as any }) : a))
      );

      setFeedbackMsg(`Interview round "${interviewRoundName}" scheduled for ${interviewModalApp.fullName} & invitation dispatched via WhatsApp.`);
      setInterviewModalApp(null);
      setInterviewNotes('');
      setMeetingLink('');
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to schedule interview round.');
    } finally {
      setInterviewSubmitting(false);
    }
  };

  const handleAddCandidateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalApp || !candidateNote.trim()) return;

    setNoteSubmitting(true);
    try {
      const res = await careerService.adminAddApplicationNote(noteModalApp._id, candidateNote.trim());
      setApplications((prev) =>
        prev.map((a) => (a._id === noteModalApp._id ? (res.application || a) : a))
      );
      setFeedbackMsg('Internal recruiter note added.');
      setNoteModalApp(null);
      setCandidateNote('');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to add recruiter note.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleDeleteApplication = async (appId: string, candidateName: string) => {
    if (!window.confirm(`Are you sure you want to permanently remove application for "${candidateName}"?`)) return;
    try {
      await careerService.adminDeleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a._id !== appId));
      setFeedbackMsg(`Application for "${candidateName}" removed.`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete application.');
    }
  };

  // Review Moderation Handlers
  const handleToggleApproveReview = async (reviewId: string, currentApproved: boolean) => {
    try {
      const nextApproved = !currentApproved;
      await productService.adminApproveReview(reviewId, nextApproved);
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, isApproved: nextApproved } : r))
      );
      setFeedbackMsg(nextApproved ? 'Review approved! It will now appear on the website.' : 'Review marked unapproved and hidden from website.');
      setTimeout(() => setFeedbackMsg(''), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update review status.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user review?')) return;
    try {
      await productService.adminDeleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setFeedbackMsg('Review deleted from database.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete review.');
    }
  };

  const getResumeUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    const base = API_BASE.replace('/api', '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Filter Applications
  const filteredApps = applications.filter((app) => {
    const term = appSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      app.fullName?.toLowerCase().includes(term) ||
      app.email?.toLowerCase().includes(term) ||
      app.phone?.toLowerCase().includes(term) ||
      app.positionAppliedFor?.toLowerCase().includes(term);
    const matchesStatus = appStatusFilter === 'ALL' || (app.status || 'NEW') === appStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const dateFilteredApps = filterByDateRange(filteredApps, (a: ICareerApplication) => a.createdAt, appDateFilter);
  const paginatedApps = dateFilteredApps.slice((appPage - 1) * appPageSize, appPage * appPageSize);

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    const term = jobSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      job.title?.toLowerCase().includes(term) ||
      job.department?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term);
    const matchesRole =
      jobRoleFilter === 'ALL' ||
      job.title?.toLowerCase().includes(jobRoleFilter.toLowerCase()) ||
      jobRoleFilter.toLowerCase().includes(job.title?.toLowerCase() || '');
    return matchesSearch && matchesRole;
  });
  const dateFilteredJobs = filterByDateRange(filteredJobs, (j: IJobOpening) => j.createdAt, jobDateFilter);
  const paginatedJobs = dateFilteredJobs.slice((jobPage - 1) * jobPageSize, jobPage * jobPageSize);

  // Filter Reviews
  const filteredReviews = reviews.filter((rev) => {
    const term = reviewSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      rev.reviewerName?.toLowerCase().includes(term) ||
      rev.comment?.toLowerCase().includes(term) ||
      rev.product?.name?.toLowerCase().includes(term);
    const matchesStatus =
      reviewStatusFilter === 'ALL' ||
      (reviewStatusFilter === 'APPROVED' && rev.isApproved) ||
      (reviewStatusFilter === 'PENDING' && !rev.isApproved);
    return matchesSearch && matchesStatus;
  });
  const dateFilteredReviews = filterByDateRange(filteredReviews, (r: any) => r.createdAt, reviewDateFilter);
  const paginatedReviews = dateFilteredReviews.slice((reviewPage - 1) * reviewPageSize, reviewPage * reviewPageSize);

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h1 className="admin-page-title">Careers, Recruitment &amp; Review Management</h1>
          <p className="admin-page-subtitle">
            Publish open job vacancies, review candidate resumes, and moderate doctor/user testimonials.
          </p>
        </div>
        <button className="btn-primary-action" onClick={() => setIsJobModalOpen(true)}>
          <Plus size={17} />
          <span>Post New Job Vacancy</span>
        </button>
      </div>

      {/* Feedback Messages */}
      {feedbackMsg && (
        <div className="alert-banner alert-success">
          <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0 }} />
          <div>{feedbackMsg}</div>
        </div>
      )}
      {errorMsg && (
        <div className="alert-banner alert-error">
          <AlertCircle size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
          <div>{errorMsg}</div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab-btn${activeTab === 'applications' ? ' active' : ''}`} onClick={() => setActiveTab('applications')}>
          <Users size={17} />
          <span>Candidate Applications ({applications.length})</span>
        </button>
        <button className={`admin-tab-btn${activeTab === 'vacancies' ? ' active' : ''}`} onClick={() => setActiveTab('vacancies')}>
          <Briefcase size={17} />
          <span>Active Vacancies ({jobs.length})</span>
        </button>
        <button className={`admin-tab-btn${activeTab === 'reviews' ? ' active' : ''}`} onClick={() => setActiveTab('reviews')}>
          <Star size={17} />
          <span>Reviews Moderation ({reviews.length})</span>
        </button>
      </div>

      {/* 1. APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div>
          {/* Applications Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-search-wrap">
              <Search size={15} className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search candidates by name, email, phone..."
                value={appSearch}
                onChange={(e) => { setAppSearch(e.target.value); setAppPage(1); }}
                className="admin-search-input"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ width: '180px' }}>
                <ThemeSelect
                  value={appStatusFilter}
                  onChange={(e) => { setAppStatusFilter(e.target.value); setAppPage(1); }}
                  options={[
                    { value: 'ALL', label: 'All Statuses' },
                    { value: 'NEW', label: 'New Candidate' },
                    { value: 'REVIEWING', label: 'Reviewing Profile' },
                    { value: 'SHORTLISTED', label: 'Shortlisted' },
                    { value: 'REJECTED', label: 'Rejected' },
                    { value: 'HIRED', label: 'Hired' },
                  ]}
                />
              </div>
              <DateFilterSelect value={appDateFilter} onChange={(df) => { setAppDateFilter(df); setAppPage(1); }} />
            </div>
          </div>

          {loading ? (
            <ZealLoader
              title="Loading Candidate Applications"
              subtitle="Retrieving candidate profiles and resume records..."
              size="lg"
              minHeight="320px"
            />
          ) : dateFilteredApps.length === 0 ? (
            <div style={{ background: '#FFFFFF', padding: '48px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid #E2E8F0' }}>
              <FileText size={36} style={{ color: '#94A3B8', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No candidate applications found</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
                {applications.length === 0
                  ? 'Submissions from the public Careers form will appear here with candidate details and downloadable resumes.'
                  : 'Try clearing your search or date filter to see other applications.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {paginatedApps.map((app) => (
                <div
                  key={app._id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    padding: '22px 24px',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge badge-purple">{app.positionAppliedFor || 'General Application'}</span>
                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                          Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                          {app.updatedAt && app.updatedAt !== app.createdAt ? ` · Updated: ${new Date(app.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                        {app.fullName}
                      </h3>
                    </div>

                    {/* Status Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Status:</span>
                      <div style={{ width: '170px' }}>
                        <ThemeSelect
                          value={app.status || 'NEW'}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          options={[
                            { value: 'NEW', label: 'New Candidate' },
                            { value: 'REVIEWING', label: 'Reviewing Profile' },
                            { value: 'SHORTLISTED', label: 'Shortlisted' },
                            { value: 'REJECTED', label: 'Rejected' },
                            { value: 'HIRED', label: 'Hired' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} style={{ color: '#6828DC' }} />
                      <span>{app.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} style={{ color: '#6828DC' }} />
                      <span>{app.email}</span>
                    </div>
                    <div>
                      <strong>Experience:</strong> {app.totalExperienceYears || 'Fresher'}
                    </div>
                    <div>
                      <strong>Qualification:</strong> {app.qualification || 'Pharmacy Graduate'}
                    </div>
                  </div>

                  {app.coverLetter && (
                    <div
                      style={{
                        background: '#F8FAFC',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        fontSize: '12.5px',
                        color: '#475569',
                        marginBottom: '16px',
                        border: '1px solid #F1F5F9',
                      }}
                    >
                      <strong>Candidate Note:</strong> {app.coverLetter}
                    </div>
                  )}

                  {/* Interview Rounds & Notes Timeline */}
                  {((app.interviewRounds && app.interviewRounds.length > 0) || (app.internalNotes && app.internalNotes.length > 0)) && (
                    <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', marginBottom: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {app.interviewRounds && app.interviewRounds.length > 0 && (
                        <div>
                          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#6828DC' }}>Scheduled Rounds:</span>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {app.interviewRounds.map((rnd: any, i: number) => (
                              <span
                                key={i}
                                style={{
                                  background: '#EDE9FE',
                                  color: '#6828DC',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                }}
                              >
                                {rnd.roundName} ({rnd.mode}) - {new Date(rnd.interviewDate).toLocaleDateString()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {app.internalNotes && app.internalNotes.length > 0 && (
                        <div>
                          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569' }}>Internal Notes ({app.internalNotes.length}):</span>
                          <div style={{ fontSize: '12px', color: '#64748B', fontStyle: 'italic', marginTop: '2px' }}>
                            Latest: "{app.internalNotes[app.internalNotes.length - 1].note}"
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setViewCandidateModal(app)}
                        style={{
                          fontSize: '12px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#FAF5FF',
                          color: '#6828DC',
                          border: '1.2px solid #DDD6FE',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Eye size={13} />
                        <span>View Full Profile</span>
                      </button>

                      {app.resumeUrl ? (
                        <a
                          href={getResumeUrl(app.resumeUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Download size={13} />
                          <span>Resume PDF</span>
                        </a>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic', alignSelf: 'center' }}>
                          No resume uploaded
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveWhatsAppCandidate(app)}
                        style={{
                          fontSize: '12px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#ECFDF5',
                          color: '#059669',
                          border: '1.2px solid #A7F3D0',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                        title="Chat with candidate on WhatsApp"
                      >
                        <MessageSquare size={13} /> WhatsApp
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setInterviewModalApp(app);
                          setInterviewRoundName('Round 1 - Technical Screening');
                          setInterviewDate('');
                          setInterviewMode('ONLINE');
                          setMeetingLink('');
                          setInterviewNotes('');
                        }}
                        style={{
                          fontSize: '12px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#EDE9FE',
                          color: '#6828DC',
                          border: '1px solid #DDD6FE',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Calendar size={13} /> Schedule Interview
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNoteModalApp(app);
                          setCandidateNote('');
                        }}
                        style={{
                          fontSize: '12px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#F1F5F9',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <FileText size={13} /> Add Note
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteApplication(app._id, app.fullName)}
                      style={{
                        fontSize: '12px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FCA5A5',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Standardized Pagination */}
              <TablePagination
                currentPage={appPage}
                pageSize={appPageSize}
                totalItems={dateFilteredApps.length}
                onPageChange={setAppPage}
                onPageSizeChange={(sz) => {
                  setAppPageSize(sz);
                  setAppPage(1);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 2. VACANCIES TAB */}
      {activeTab === 'vacancies' && (
        <div>
          {/* Vacancies Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-search-wrap">
              <Search size={15} className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search vacancies by title, location..."
                value={jobSearch}
                onChange={(e) => { setJobSearch(e.target.value); setJobPage(1); }}
                className="admin-search-input"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ width: '290px' }}>
                <ThemeSelect
                  searchable
                  placeholder="Filter by Position..."
                  value={jobRoleFilter}
                  onChange={(e) => { setJobRoleFilter(e.target.value); setJobPage(1); }}
                  options={[
                    { value: 'ALL', label: 'All 16 Positions / Roles' },
                    ...CAREER_ROLE_PRESETS.map((p) => ({ value: p.title, label: p.title })),
                  ]}
                />
              </div>
              <DateFilterSelect value={jobDateFilter} onChange={(df) => { setJobDateFilter(df); setJobPage(1); }} />
            </div>
          </div>

          {dateFilteredJobs.length === 0 ? (
            <div style={{ background: '#FFFFFF', padding: '48px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid #E2E8F0' }}>
              <Briefcase size={36} style={{ color: '#94A3B8', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No active job openings found</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px', marginBottom: '18px' }}>
                {jobs.length === 0
                  ? 'Click below to post your first recruitment vacancy.'
                  : 'Try clearing your search or date filter to see other vacancies.'}
              </p>
              <button type="button" className="btn-primary-action" onClick={() => setIsJobModalOpen(true)}>
                <Plus size={16} />
                <span>Post Job Vacancy</span>
              </button>
            </div>
          ) : (
            <div>
              {/* Clean Vacancy List Layout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {paginatedJobs.map((job) => {
                  const jobTypeLabel =
                    job.jobType === 'FULL_TIME'
                      ? 'Full Time'
                      : job.jobType === 'PART_TIME'
                      ? 'Part Time'
                      : job.jobType === 'CONTRACT'
                      ? 'Contract'
                      : job.jobType === 'INTERNSHIP'
                      ? 'Internship'
                      : job.jobType || 'Full Time';

                  return (
                    <div
                      key={job._id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1.5px solid #E2E8F0',
                        padding: '20px 24px',
                        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                        transition: 'all 0.18s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#C4B5FD';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(104, 40, 220, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.03)';
                      }}
                    >
                      {/* Top Row: Department Badge + Date on Left, Status Dropdown on Right */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px',
                          marginBottom: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              background: '#EDE9FE',
                              color: '#6828DC',
                              padding: '4px 12px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            {job.department}
                          </span>
                          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                            Created: {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '29 Sept 2026'}
                          </span>
                        </div>

                        {/* Status Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Status:</span>
                          <div style={{ width: '150px' }}>
                            <ThemeSelect
                              value={job.status || 'OPEN'}
                              onChange={() => handleToggleJobStatus(job)}
                              options={[
                                { value: 'OPEN', label: 'OPEN' },
                                { value: 'CLOSED', label: 'CLOSED' },
                              ]}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Second Row: Big Bold Title */}
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: 800,
                          color: '#0F172A',
                          margin: '0 0 10px 0',
                          cursor: 'pointer',
                        }}
                        onClick={() => setViewJobModal(job)}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#6828DC')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#0F172A')}
                      >
                        {job.title}
                      </h3>

                      {/* Third Row: Inline Details (Exact same layout as screenshot) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '20px',
                          fontSize: '13px',
                          color: '#475569',
                          marginBottom: '16px',
                        }}
                      >
                        {job.salaryRange && (
                          <div>
                            <strong style={{ color: '#0F172A' }}>Salary:</strong>{' '}
                            <span style={{ color: '#059669', fontWeight: 700 }}>{job.salaryRange}</span>
                          </div>
                        )}

                        <div>
                          <strong style={{ color: '#0F172A' }}>Openings:</strong> {job.openingsCount || 1} Vaca
                        </div>

                        <div>
                          <strong style={{ color: '#0F172A' }}>Job Type:</strong> {jobTypeLabel}
                        </div>

                        <div>
                          <strong style={{ color: '#0F172A' }}>Experience:</strong> {job.experienceRequired || '1 - 3 Years'}
                        </div>

                        {job.isFeatured && (
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
                      </div>

                      {/* Bottom Row / Actions (Schedule/Note style on left, Delete on right) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px',
                          paddingTop: '12px',
                          borderTop: '1px solid #F1F5F9',
                        }}
                      >
                        {/* Left Action Button: View Details */}
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setViewJobModal(job)}
                            style={{
                              fontSize: '12px',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              background: '#EDE9FE',
                              color: '#6828DC',
                              border: '1px solid #DDD6FE',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#6828DC';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#EDE9FE';
                              e.currentTarget.style.color = '#6828DC';
                            }}
                          >
                            <Eye size={13} />
                            <span>View Details</span>
                          </button>
                        </div>

                        {/* Right side Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job._id, job.title)}
                          style={{
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            border: '1px solid #FCA5A5',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FEE2E2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FEF2F2';
                          }}
                          title="Delete Vacancy"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Standardized Pagination */}
              <TablePagination
                currentPage={jobPage}
                pageSize={jobPageSize}
                totalItems={dateFilteredJobs.length}
                onPageChange={setJobPage}
                onPageSizeChange={(sz) => {
                  setJobPageSize(sz);
                  setJobPage(1);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* 3. REVIEWS MODERATION TAB */}
      {activeTab === 'reviews' && (
        <div>
          {/* Reviews Toolbar */}
          <div className="admin-toolbar">
            <div className="admin-search-wrap">
              <Search size={15} className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search reviews by name, product, comment..."
                value={reviewSearch}
                onChange={(e) => { setReviewSearch(e.target.value); setReviewPage(1); }}
                className="admin-search-input"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ width: '180px' }}>
                <ThemeSelect
                  value={reviewStatusFilter}
                  onChange={(e) => { setReviewStatusFilter(e.target.value); setReviewPage(1); }}
                  options={[
                    { value: 'ALL', label: 'All Reviews' },
                    { value: 'APPROVED', label: 'Approved Only' },
                    { value: 'PENDING', label: 'Pending Moderation' },
                  ]}
                />
              </div>
              <DateFilterSelect value={reviewDateFilter} onChange={(df) => { setReviewDateFilter(df); setReviewPage(1); }} />
            </div>
          </div>

          {dateFilteredReviews.length === 0 ? (
            <div style={{ background: '#FFFFFF', padding: '48px', borderRadius: '16px', textAlign: 'center', border: '1.5px solid #E2E8F0' }}>
              <Star size={36} style={{ color: '#F59E0B', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No customer or doctor reviews found</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
                {reviews.length === 0
                  ? 'Reviews submitted from product pages will appear here for admin moderation.'
                  : 'Try clearing your search or date filter to see other reviews.'}
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                {paginatedReviews.map((rev) => (
                  <div
                    key={rev._id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #E2E8F0',
                      padding: '24px',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="badge badge-purple">
                            {rev.reviewerRole || 'Medical Practitioner / Doctor'}
                          </span>
                          <span className={`badge ${rev.isApproved ? 'badge-green' : 'badge-yellow'}`}>
                            {rev.isApproved ? 'Approved (Visible on Website)' : 'Pending Moderation'}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                          {rev.reviewerName}
                        </h3>
                        {rev.product?.name && (
                          <div style={{ fontSize: '12.5px', color: '#6828DC', fontWeight: 600 }}>
                            Product: {rev.product.name}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', padding: '4px 10px', borderRadius: '8px' }}>
                        <Star size={16} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                        <strong style={{ fontSize: '14px', color: '#92400E' }}>{rev.rating || 5}.0</strong>
                      </div>
                    </div>

                    {rev.title && (
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E293B', marginBottom: '4px' }}>
                        {rev.title}
                      </div>
                    )}

                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                      "{rev.comment}"
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                        Submitted: {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                      </span>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleApproveReview(rev._id, rev.isApproved)}
                          className={`btn btn-sm ${rev.isApproved ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Check size={14} />
                          <span>{rev.isApproved ? 'Hide from Website' : 'Approve Review'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#EF4444', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Standardized Pagination */}
              <TablePagination
                currentPage={reviewPage}
                pageSize={reviewPageSize}
                totalItems={dateFilteredReviews.length}
                onPageChange={setReviewPage}
                onPageSizeChange={(sz) => {
                  setReviewPageSize(sz);
                  setReviewPage(1);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* =======================================================
          POST NEW JOB VACANCY (ADVANCED MODERN PURPLE THEME)
         ======================================================= */}
      {isJobModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setIsJobModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '740px',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px -15px rgba(104, 40, 220, 0.28), 0 10px 25px -5px rgba(0,0,0,0.1)',
              border: '1.5px solid rgba(255, 255, 255, 0.9)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 26px',
                borderBottom: '1.5px solid #E9D5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 60%, #DDD6FE 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                    Post New Job Vacancy
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6828DC', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Talent Acquisition &amp; Wholesale Distribution Portal</span>
                    <span style={{ background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800 }}>
                      Wholesale Stockist &amp; Distribution
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsJobModalOpen(false);
                  setSelectedPresetRole('');
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DDD6FE',
                  color: '#64748B',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FEE2E2';
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.borderColor = '#FECACA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.borderColor = '#DDD6FE';
                }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateJob} noValidate style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                
                {/* 0. Preset Wholesale Stockist Role Selector (Auto Pre-fills all fields) */}
                <div style={{ background: '#FAF5FF', border: '1.5px solid #DDD6FE', borderRadius: '14px', padding: '16px 18px', boxShadow: '0 2px 10px rgba(104, 40, 220, 0.05)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: '#6828DC', marginBottom: '10px' }}>
                    <Sparkles size={16} />
                    <span>Quick Pre-Fill From 16 Wholesale Stockist Roles (Auto-fills duties, requirements & Surat Godown):</span>
                  </label>
                  <CustomThemeSelect
                    value={selectedPresetRole}
                    onChange={(val) => handleSelectRolePreset(val)}
                    options={[
                      { value: '', label: '-- Choose one of 16 Wholesale Roles to Auto-Fill --' },
                      ...CAREER_ROLE_PRESETS.map((preset) => ({
                        value: preset.title,
                        label: `${preset.title} (${preset.department})`,
                      })),
                    ]}
                    icon={<Sparkles size={16} style={{ color: '#6828DC' }} />}
                    style={{ width: '100%' }}
                    searchable={true}
                    placeholder="Search and select wholesale position..."
                  />
                </div>

                {/* 1. Job Designation / Title (Full Width) */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '7px' }}>
                    <Briefcase size={15} style={{ color: '#6828DC' }} />
                    <span>Job Designation / Title</span>
                    <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pharmacist, Purchase Executive, Dispatch Executive"
                    value={jobForm.title}
                    onChange={(e) => {
                      setJobForm((prev) => ({ ...prev, title: e.target.value }));
                      setJobTitleError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '10px',
                      border: jobTitleError ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                      boxShadow: jobTitleError ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#0F172A',
                      fontWeight: 600,
                      transition: 'all 0.15s ease',
                    }}
                    onFocus={(e) => {
                      if (!jobTitleError) {
                        e.target.style.borderColor = '#6828DC';
                        e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!jobTitleError) {
                        e.target.style.borderColor = '#CBD5E1';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  {jobTitleError && (
                    <p style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, margin: '5px 0 0 0', lineHeight: 1.4 }}>
                      {jobTitleError}
                    </p>
                  )}
                </div>

                {/* 2. Half-Width Dropdowns (Department & Employment Type) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {/* Department Dropdown (Half Width) */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '7px' }}>
                      <Building size={15} style={{ color: '#6828DC' }} />
                      <span>Department</span>
                      <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <CustomThemeSelect
                      value={jobForm.department}
                      onChange={(val) => setJobForm((prev) => ({ ...prev, department: val }))}
                      options={[
                        { value: 'Pharmacy & Quality Check', label: 'Pharmacy & Quality Check' },
                        { value: 'Procurement & Purchase', label: 'Procurement & Purchase' },
                        { value: 'Receiving & Inward', label: 'Receiving & Inward' },
                        { value: 'Warehouse Management & Operations', label: 'Warehouse Management & Operations' },
                        { value: 'Warehouse Staff & Picking', label: 'Warehouse Staff & Picking' },
                        { value: 'Verification & Quality Assurance', label: 'Verification & Quality Assurance' },
                        { value: 'Packing & Secondary Packaging', label: 'Packing & Secondary Packaging' },
                        { value: 'Dispatch & Logistics', label: 'Dispatch & Logistics' },
                        { value: 'Field Delivery & Transit', label: 'Field Delivery & Transit' },
                        { value: 'Sales & Field Distribution', label: 'Sales & Field Distribution' },
                        { value: 'Customer Support & Order Processing', label: 'Customer Support & Order Processing' },
                        { value: 'Website & Digital Enquiry', label: 'Website & Digital Enquiry' },
                        { value: 'Inventory & Data Management', label: 'Inventory & Data Management' },
                        { value: 'Finance & Accounts Billing', label: 'Finance & Accounts Billing' },
                        { value: 'Warehouse Operations & Floor Support', label: 'Warehouse Operations & Floor Support' },
                        { value: 'Warehouse Supervision & Control', label: 'Warehouse Supervision & Control' },
                      ]}
                      icon={<Building size={15} style={{ color: '#6828DC' }} />}
                      style={{ width: '100%' }}
                      searchable={true}
                    />
                  </div>

                  {/* Employment Type Dropdown (Half Width) */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '7px' }}>
                      <Clock size={15} style={{ color: '#6828DC' }} />
                      <span>Employment Type</span>
                      <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <CustomThemeSelect
                      value={jobForm.jobType}
                      onChange={(val) => setJobForm((prev) => ({ ...prev, jobType: val }))}
                      options={[
                        { value: 'FULL_TIME', label: 'Full Time (Permanent)' },
                        { value: 'PART_TIME', label: 'Part Time' },
                        { value: 'CONTRACT', label: 'Contractual (Fixed Term)' },
                        { value: 'INTERNSHIP', label: 'Internship / Trainee' },
                      ]}
                      icon={<Clock size={15} style={{ color: '#6828DC' }} />}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* 3. Location & Experience (Half Width 50/50 Grid) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                        <MapPin size={15} style={{ color: '#6828DC' }} />
                        <span>Operating Location / Godown</span>
                        <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <span style={{ fontSize: '11px', color: '#059669', background: '#ECFDF5', padding: '1px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        Fixed Central Hub
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6828DC', pointerEvents: 'none' }} />
                      <input
                        type="text"
                        readOnly
                        required
                        value={jobForm.location}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 36px',
                          borderRadius: '10px',
                          border: '1.5px solid #E2E8F0',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          background: '#F8FAFC',
                          color: '#334155',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '7px' }}>
                      <Clock size={15} style={{ color: '#6828DC' }} />
                      <span>Experience Required</span>
                      <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6828DC', pointerEvents: 'none' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2 - 4 Years"
                        value={jobForm.experienceRequired}
                        onChange={(e) => setJobForm((prev) => ({ ...prev, experienceRequired: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 36px',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          color: '#0F172A',
                          transition: 'all 0.15s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#6828DC';
                          e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#CBD5E1';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Compensation / Package & Openings Count (Half Width 50/50 Grid) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '7px' }}>
                      <DollarSign size={15} style={{ color: '#6828DC' }} />
                      <span>Compensation / CTC Package</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <DollarSign size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6828DC', pointerEvents: 'none' }} />
                      <input
                        type="text"
                        placeholder="e.g. ₹3.5 LPA - ₹5.5 LPA"
                        value={jobForm.salaryRange}
                        onChange={(e) => setJobForm((prev) => ({ ...prev, salaryRange: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 36px',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          color: '#0F172A',
                          transition: 'all 0.15s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#6828DC';
                          e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#CBD5E1';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '7px' }}>
                      <Users size={15} style={{ color: '#6828DC' }} />
                      <span>Openings / Vacancies Count</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 2"
                      value={jobForm.openingsCount}
                      onChange={(e) => setJobForm((prev) => ({ ...prev, openingsCount: Number(e.target.value) || 1 }))}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        outline: 'none',
                        boxSizing: 'border-box',
                        color: '#0F172A',
                        transition: 'all 0.15s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6828DC';
                        e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#CBD5E1';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* 5. Application Deadline & Official HR Email (Half Width 50/50 Grid) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '7px' }}>
                      <Calendar size={15} style={{ color: '#6828DC' }} />
                      <span>Application Deadline</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6828DC', pointerEvents: 'none' }} />
                      <input
                        type="date"
                        value={jobForm.applicationDeadline}
                        onChange={(e) => setJobForm((prev) => ({ ...prev, applicationDeadline: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 36px',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          color: '#0F172A',
                          transition: 'all 0.15s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#6828DC';
                          e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#CBD5E1';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '7px' }}>
                      <Mail size={15} style={{ color: '#6828DC' }} />
                      <span>Official HR Application Email</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6828DC', pointerEvents: 'none' }} />
                      <input
                        type="email"
                        placeholder="e.g. careers@zealpharma.com"
                        value={jobForm.applicationEmail}
                        onChange={(e) => setJobForm((prev) => ({ ...prev, applicationEmail: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 36px',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '13.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          color: '#0F172A',
                          transition: 'all 0.15s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#6828DC';
                          e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.12)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#CBD5E1';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Role Overview & Scope of Work (ThemeQuillEditor) */}
                <div>
                  <ThemeQuillEditor
                    label={
                      <>
                        <FileText size={15} style={{ color: '#6828DC' }} />
                        <span>Role Overview &amp; Brief Description</span>
                      </>
                    }
                    toolbarPreset="standard"
                    placeholder="Outline high-level vacancy context, team culture, and strategic pharmaceutical objectives..."
                    value={jobForm.description}
                    onChange={(val) => setJobForm((prev) => ({ ...prev, description: val }))}
                    minHeight="110px"
                  />
                </div>

                {/* 7. Key Responsibilities (Full Width Textarea) */}
                <div style={{ background: '#FAF5FF', padding: '16px 18px', borderRadius: '12px', border: '1.5px solid #EDE9FE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#6828DC' }}>
                      <Layers size={16} />
                      <span>Key Responsibilities</span>
                    </label>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#7C3AED', background: '#EDE9FE', padding: '2px 8px', borderRadius: '6px' }}>
                      One per line
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="• Meet monthly and quarterly territory target objectives.&#10;• Coordinate with doctors, chemists, and distribution stockists.&#10;• Ensure strict compliance with Schedule M and pharmaceutical good practices."
                    value={jobForm.responsibilitiesText}
                    onChange={(e) => setJobForm((prev) => ({ ...prev, responsibilitiesText: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '9px',
                      border: '1.5px solid #DDD6FE',
                      background: '#FFFFFF',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      resize: 'vertical',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#0F172A',
                      transition: 'all 0.15s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6828DC';
                      e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#DDD6FE';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* 8. Qualifications & Skills (Full Width Textarea) */}
                <div style={{ background: '#FAF5FF', padding: '16px 18px', borderRadius: '12px', border: '1.5px solid #EDE9FE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#6828DC' }}>
                      <Sparkles size={16} />
                      <span>Qualifications & Essential Skills</span>
                    </label>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#7C3AED', background: '#EDE9FE', padding: '2px 8px', borderRadius: '6px' }}>
                      One per line
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="• Bachelor’s or Master’s degree in Pharmacy (B.Pharm / M.Pharm / B.Sc / MBA).&#10;• Demonstrated competence and excellent communication skills.&#10;• 2+ years field experience in ethical pharma sales or formulations."
                    value={jobForm.requirementsText}
                    onChange={(e) => setJobForm((prev) => ({ ...prev, requirementsText: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '9px',
                      border: '1.5px solid #DDD6FE',
                      background: '#FFFFFF',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      resize: 'vertical',
                      outline: 'none',
                      boxSizing: 'border-box',
                      color: '#0F172A',
                      transition: 'all 0.15s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#6828DC';
                      e.target.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#DDD6FE';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* 9. Publishing Status & Promotional Flags */}
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} style={{ color: '#6828DC' }} />
                    <span>Publishing Status & Promotional Flags</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: jobForm.isActive ? '1.5px solid #10B981' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: jobForm.isActive ? '0 2px 8px rgba(16, 185, 129, 0.1)' : 'none',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Active Opening</div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>Live on public careers portal</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={jobForm.isActive}
                        onChange={(e) => setJobForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: '#FFFFFF',
                      border: jobForm.isFeatured ? '1.5px solid #6828DC' : '1.5px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: jobForm.isFeatured ? '0 2px 8px rgba(104, 40, 220, 0.12)' : 'none',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>★ Featured Vacancy</div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>Priority spotlight on portal</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={jobForm.isFeatured}
                        onChange={(e) => setJobForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                        style={{ width: '18px', height: '18px', accentColor: '#6828DC', cursor: 'pointer' }}
                      />
                    </label>
                  </div>
                </div>

                {/* 10. SEO Settings Accordion */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowJobSeo(!showJobSeo)}
                    style={{
                      background: showJobSeo ? '#FAF5FF' : 'transparent',
                      border: '1px solid',
                      borderColor: showJobSeo ? '#DDD6FE' : '#E2E8F0',
                      borderRadius: '8px',
                      color: '#6828DC',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Globe size={15} />
                    <span>{showJobSeo ? '− Hide Job SEO Settings' : '+ Configure Google Search (SEO) Meta Tags'}</span>
                  </button>

                  {showJobSeo && (
                    <div style={{ marginTop: '14px', padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1.5px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                          SEO Meta Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Careers at Zeal Pharma | Senior ASM Vacancy"
                          value={jobForm.seo.metaTitle}
                          onChange={(e) => setJobForm((prev) => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#6828DC';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#CBD5E1';
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '5px' }}>
                          SEO Meta Description
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Meta description for Google Search index snippets..."
                          value={jobForm.seo.metaDescription}
                          onChange={(e) => setJobForm((prev) => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            lineHeight: 1.5,
                            resize: 'vertical',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#6828DC';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#CBD5E1';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '16px 28px',
                  borderTop: '1.5px solid #E2E8F0',
                  background: '#F8FAFC',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsJobModalOpen(false);
                    setSelectedPresetRole('');
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F1F5F9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingJob}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: creatingJob ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
                    opacity: creatingJob ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!creatingJob) e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!creatingJob) e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Check size={16} />
                  <span>{creatingJob ? 'Publishing Vacancy...' : 'Publish Job Vacancy'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VIEW JOB DETAILS MODAL */}
      {viewJobModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewJobModal(null);
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px -15px rgba(104, 40, 220, 0.35)',
              overflow: 'hidden',
              border: '1.5px solid #DDD6FE',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 26px',
                borderBottom: '1.5px solid #E9D5FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 60%, #DDD6FE 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '13px',
                    background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(104, 40, 220, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  <Briefcase size={22} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                    <span
                      style={{
                        background: '#6828DC',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {viewJobModal.department}
                    </span>
                    <span
                      style={{
                        background: viewJobModal.status === 'OPEN' ? '#ECFDF5' : '#FEF2F2',
                        color: viewJobModal.status === 'OPEN' ? '#059669' : '#DC2626',
                        border: `1px solid ${viewJobModal.status === 'OPEN' ? '#A7F3D0' : '#FECACA'}`,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: viewJobModal.status === 'OPEN' ? '#10B981' : '#EF4444',
                        }}
                      />
                      {viewJobModal.status === 'OPEN' ? 'ACTIVE OPENING' : 'CLOSED'}
                    </span>
                    {viewJobModal.isFeatured && (
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
                        ★ Featured Spotlight
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontWeight: 900,
                      color: '#0F172A',
                      margin: 0,
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {viewJobModal.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewJobModal(null)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DDD6FE',
                  color: '#64748B',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  flexShrink: 0,
                  marginLeft: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FEE2E2';
                  e.currentTarget.style.color = '#EF4444';
                  e.currentTarget.style.borderColor = '#FECACA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.borderColor = '#DDD6FE';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              
              {/* 1. Key Metrics 6-Tile Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                
                {/* Location */}
                <div style={{ background: '#FAF5FF', border: '1px solid #EDE9FE', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6828DC', flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Location / Territory</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '1px' }}>{viewJobModal.location}</div>
                  </div>
                </div>

                {/* Experience */}
                <div style={{ background: '#FAF5FF', border: '1px solid #EDE9FE', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6828DC', flexShrink: 0 }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Experience Required</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '1px' }}>{viewJobModal.experienceRequired}</div>
                  </div>
                </div>

                {/* Compensation */}
                <div style={{ background: '#FAF5FF', border: '1px solid #EDE9FE', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6828DC', flexShrink: 0 }}>
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Compensation Package</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '1px' }}>{viewJobModal.salaryRange || 'Competitive / Confidential'}</div>
                  </div>
                </div>

                {/* Vacancies Count */}
                <div style={{ background: '#FAF5FF', border: '1px solid #EDE9FE', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6828DC', flexShrink: 0 }}>
                    <Users size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Available Positions</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '1px' }}>{viewJobModal.openingsCount || 1} Openings</div>
                  </div>
                </div>

                {/* Application Deadline */}
                <div style={{ background: '#FAF5FF', border: '1px solid #EDE9FE', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6828DC', flexShrink: 0 }}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Application Deadline</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '1px' }}>
                      {viewJobModal.applicationDeadline
                        ? new Date(viewJobModal.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Open Until Filled'}
                    </div>
                  </div>
                </div>

                {/* HR Email */}
                <div style={{ background: '#FAF5FF', border: '1px solid #EDE9FE', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6828DC', flexShrink: 0 }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Official HR Email</div>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '1px' }}>{viewJobModal.applicationEmail || 'careers@zealpharma.com'}</div>
                  </div>
                </div>
              </div>

              {/* 2. Role Overview */}
              {viewJobModal.description && (
                <div style={{ background: '#F8FAFC', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '16px 20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <FileText size={16} style={{ color: '#6828DC' }} />
                    <span>Role Overview & Strategic Scope</span>
                  </div>
                  <div
                    style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6, margin: 0 }}
                    dangerouslySetInnerHTML={{ __html: viewJobModal.description }}
                  />
                </div>
              )}

              {/* 3. Key Responsibilities */}
              {viewJobModal.responsibilities && viewJobModal.responsibilities.length > 0 && (
                <div style={{ background: '#FAF5FF', borderRadius: '14px', border: '1.5px solid #EDE9FE', padding: '18px 20px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#6828DC', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Layers size={17} />
                    <span>Key Responsibilities & Deliverables</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {viewJobModal.responsibilities.map((resp, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#1E293B', lineHeight: 1.5 }}>
                        <div style={{ color: '#6828DC', marginTop: '2px', flexShrink: 0 }}>
                          <CheckCircle size={15} />
                        </div>
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Qualifications & Essential Skills */}
              {viewJobModal.requirements && viewJobModal.requirements.length > 0 && (
                <div style={{ background: '#FAF5FF', borderRadius: '14px', border: '1.5px solid #EDE9FE', padding: '18px 20px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#6828DC', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Sparkles size={17} />
                    <span>Qualifications & Core Competencies</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {viewJobModal.requirements.map((req, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#1E293B', lineHeight: 1.5 }}>
                        <div style={{ color: '#8B5CF6', marginTop: '2px', flexShrink: 0 }}>
                          <Star size={14} />
                        </div>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Google Search (SEO) Card */}
              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1.5px solid #E2E8F0', padding: '16px 20px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
                  <Globe size={15} style={{ color: '#6828DC' }} />
                  <span>Google Search (SEO) Snippet Preview</span>
                </div>
                <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#059669', marginBottom: '2px' }}>
                    https://zealpharma.com › careers › {viewJobModal.slug || 'job-opening'}
                  </div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1A0DAB', marginBottom: '3px' }}>
                    {viewJobModal.seo?.metaTitle || `${viewJobModal.title} | Zeal Pharmaceuticals Careers`}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#4D5156', lineHeight: 1.45 }}>
                    {viewJobModal.seo?.metaDescription || viewJobModal.description || 'Join Zeal Pharmaceuticals - leading WHO-GMP certified pharmaceutical marketing and distribution enterprise.'}
                  </div>
                </div>
              </div>

              {/* 6. System Audit Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11.5px', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                <span>Vacancy ID: <code style={{ color: '#6828DC' }}>{viewJobModal._id}</code></span>
                <span>
                  Posted: {viewJobModal.createdAt ? new Date(viewJobModal.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                  {viewJobModal.updatedAt && ` · Updated: ${new Date(viewJobModal.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '16px 28px',
                borderTop: '1.5px solid #E2E8F0',
                background: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              {/* Quick Status Toggle Button */}
              <button
                type="button"
                disabled={updatingJobStatus}
                onClick={() => handleToggleJobStatus(viewJobModal)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: `1.5px solid ${viewJobModal.status === 'OPEN' ? '#FECACA' : '#A7F3D0'}`,
                  background: viewJobModal.status === 'OPEN' ? '#FEF2F2' : '#ECFDF5',
                  color: viewJobModal.status === 'OPEN' ? '#DC2626' : '#059669',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: updatingJobStatus ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                {viewJobModal.status === 'OPEN' ? (
                  <>
                    <X size={14} />
                    <span>{updatingJobStatus ? 'Updating...' : 'Close Opening (Archive)'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    <span>{updatingJobStatus ? 'Updating...' : 'Re-open Opening (Active)'}</span>
                  </>
                )}
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setViewJobModal(null)}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F1F5F9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ATS Modal 1: Schedule Interview Round */}
      {interviewModalApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                  Schedule Interview Round
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748B' }}>
                  Candidate: <b>{interviewModalApp.fullName}</b> ({interviewModalApp.positionAppliedFor})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInterviewModalApp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewRound} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Interview Round Title
                </label>
                <input
                  type="text"
                  value={interviewRoundName}
                  onChange={(e) => setInterviewRoundName(e.target.value)}
                  placeholder="e.g. Round 1: Technical Screening"
                  required
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
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Interview Mode
                  </label>
                  <select
                    value={interviewMode}
                    onChange={(e) => setInterviewMode(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      background: '#FFFFFF',
                    }}
                  >
                    <option value="ONLINE">Online (Google Meet / Zoom)</option>
                    <option value="OFFLINE">In-Person (HQ Office)</option>
                    <option value="PHONE">Telephonic Screening</option>
                  </select>
                </div>
              </div>

              {interviewMode === 'ONLINE' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Video Conference / Meeting Link
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/xyz-abc-def"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Round Notes / Guidelines for Interviewers
                </label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Outline key questions or topics to evaluate..."
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setInterviewModalApp(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={interviewSubmitting}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
                  }}
                >
                  {interviewSubmitting ? 'Scheduling...' : 'Save & Schedule Round'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATS Modal 2: Add Candidate Recruiter Note */}
      {noteModalApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                  Internal Recruiter Note
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748B' }}>
                  Candidate: <b>{noteModalApp.fullName}</b>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNoteModalApp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCandidateNote} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Note Content
                </label>
                <textarea
                  rows={4}
                  value={candidateNote}
                  onChange={(e) => setCandidateNote(e.target.value)}
                  placeholder="Record interview impressions, salary expectations, notice period, or HR remarks..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setNoteModalApp(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={noteSubmitting}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
                  }}
                >
                  {noteSubmitting ? 'Saving...' : 'Add Recruiter Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Dossier Detail Modal */}
      <AdminEnquiryDetailModal
        enquiry={
          viewCandidateModal
            ? {
                _id: viewCandidateModal._id,
                enquiryType: 'CAREER',
                enquiryCategory: 'CAREER',
                name: viewCandidateModal.fullName,
                fullName: viewCandidateModal.fullName,
                email: viewCandidateModal.email,
                phone: viewCandidateModal.phone,
                whatsappNumber: viewCandidateModal.whatsappNumber || viewCandidateModal.phone,
                city: viewCandidateModal.currentCity,
                state: viewCandidateModal.currentState,
                preferredTerritory: viewCandidateModal.preferredLocation,
                positionAppliedFor: viewCandidateModal.positionAppliedFor || viewCandidateModal.jobTitle || 'Pharmaceutical Candidate',
                department: viewCandidateModal.department || 'Operations',
                qualification: viewCandidateModal.qualification,
                totalExperienceYears: viewCandidateModal.totalExperienceYears,
                currentCompany: viewCandidateModal.currentCompany,
                currentDesignation: viewCandidateModal.currentDesignation,
                currentCtc: viewCandidateModal.currentCtc,
                expectedCtc: viewCandidateModal.expectedCtc,
                noticePeriod: viewCandidateModal.noticePeriod,
                resumeUrl: viewCandidateModal.resumeUrl,
                coverLetter: viewCandidateModal.coverLetter || viewCandidateModal.coverNote,
                skills: viewCandidateModal.skills,
                interviewRounds: viewCandidateModal.interviewRounds,
                internalNotes: (viewCandidateModal.internalNotes as any) || [],
                status: (viewCandidateModal.status || 'NEW') as EnquiryStatus,
                createdAt: viewCandidateModal.createdAt,
                updatedAt: viewCandidateModal.updatedAt,
                message: viewCandidateModal.coverLetter || `Application for ${viewCandidateModal.positionAppliedFor || 'Career Opportunity'}`,
              }
            : null
        }
        onClose={() => setViewCandidateModal(null)}
        onStatusChange={async (id, newStatus) => {
          await handleStatusChange(id, newStatus);
          setViewCandidateModal(prev => (prev && prev._id === id ? { ...prev, status: newStatus } : prev));
        }}
        onAddNote={async (id, noteText) => {
          const res = await careerService.adminAddApplicationNote(id, noteText);
          const newNotes = res?.internalNotes || [
            ...(viewCandidateModal?.internalNotes || []),
            { note: noteText, addedBy: 'HR Admin', addedAt: new Date().toISOString() },
          ];
          setApplications(prev => prev.map(a => (a._id === id ? { ...a, internalNotes: newNotes } : a)));
          setViewCandidateModal(prev => (prev && prev._id === id ? { ...prev, internalNotes: newNotes } : prev));
          setFeedbackMsg('Candidate note logged successfully.');
        }}
        onDelete={async (id, name) => {
          await handleDeleteApplication(id, name);
          setViewCandidateModal(null);
        }}
      />

      {/* Advanced WhatsApp Candidate Communication Hub Modal */}
      {activeWhatsAppCandidate && (
        <AdvancedWhatsAppModal
          isOpen={Boolean(activeWhatsAppCandidate)}
          onClose={() => setActiveWhatsAppCandidate(null)}
          recipient={activeWhatsAppCandidate}
          onMessageSent={() => {
            setFeedbackMsg(`WhatsApp message dispatched to ${activeWhatsAppCandidate.fullName}!`);
            setTimeout(() => setFeedbackMsg(''), 3500);
          }}
        />
      )}
    </div>
  );
};
