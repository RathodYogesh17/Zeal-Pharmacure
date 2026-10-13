import React, { useState, useMemo } from 'react';
import {FileText,CheckCircle2, AlertCircle, UploadCloud, Send, ShieldCheck,X, Briefcase, MapPin, MessageCircle,} from 'lucide-react';
import { careerService } from '../../api/careerService';
import type { IJobOpening } from '../../types';
import { ThemedSelect } from '../common/ThemedSelect';
import { VerifiedUserBadge } from '../common/VerifiedUserBadge';
import { buildCareerWhatsAppMessage } from '../../utils/whatsappMessageBuilder';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAuth } from '../../context/AuthContext';

export interface CareerApplicationFormProps {
  jobs?: IJobOpening[];
  selectedJobId?: string;
  selectedJobTitle?: string;
  onJobSelect?: (id: string, title: string) => void;
  targetJob?: IJobOpening;
}

import { CAREER_ROLE_PRESETS, ZEAL_SINGLE_LOCATION } from '../../constants/careerPresets';

const DEFAULT_POSITIONS = CAREER_ROLE_PRESETS.map((p, idx) => ({
  _id: `preset-role-${idx + 1}`,
  title: p.title,
  department: p.department,
  location: ZEAL_SINGLE_LOCATION,
}));

export const CareerApplicationForm: React.FC<CareerApplicationFormProps> = ({
  jobs = [],
  selectedJobId = '',
  selectedJobTitle = '',
  onJobSelect,
  targetJob,
}) => {
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const allPositions = jobs && jobs.length > 0 ? jobs : DEFAULT_POSITIONS;
  const hrWhatsAppNumber = (settings?.whatsappNumber || settings?.hrHelpline || '919909160190').replace(/[^0-9]/g, '');

  const positionOptions = useMemo(() => {
    const list = allPositions.map((p) => ({
      value: p._id,
      label: p.title,
      subtitle: `${p.department} • ${p.location}`,
      category: p.department,
    }));
    return [
      ...list,
      {
        value: 'general-opening',
        label: 'General / Other Openings',
        subtitle: 'Submit CV for upcoming department expansions',
      },
    ];
  }, [allPositions]);

  const experienceOptions = [
    { value: 'Fresher', label: 'Fresher (0 - 1 Year)' },
    { value: '1-3 Years', label: '1 - 3 Years' },
    { value: '3-5 Years', label: '3 - 5 Years' },
    { value: '5-8 Years', label: '5 - 8 Years' },
    { value: '8+ Years', label: '8+ Years (Leadership)' },
  ];

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    whatsappNumber: user?.phone || '',
    currentCity: '',
    currentState: '',
    qualification: '',
    totalExperience: '1-3 Years',
    currentCompany: '',
    currentDesignation: '',
    currentCtc: '',
    expectedCtc: '',
    noticePeriod: '',
    coverNote: '',
  });

  React.useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        whatsappNumber: prev.whatsappNumber || user.phone || '',
      }));
    }
  }, [user]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    resumeFile?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError('Resume file size exceeds 10MB limit.');
        return;
      }
      setResumeFile(file);
      setSubmitError('');
      setFieldErrors((prev) => ({ ...prev, resumeFile: undefined }));
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const errs: typeof fieldErrors = {};
    const effName = form.fullName.trim() || user?.name || '';
    if (!effName) {
      errs.fullName = 'Full legal name is required';
    } else if (effName.length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

    const effEmail = form.email.trim() || user?.email || '';
    if (!effEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(effEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    const effPhone = form.phone.trim() || user?.phone || '';
    const rawDigits = effPhone.replace(/[\s\-\(\)\+]/g, '');
    const cleanPhone = rawDigits.length > 10 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;
    if (!rawDigits) {
      errs.phone = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!resumeFile) {
      errs.resumeFile = 'Please attach your PDF or DOCX resume';
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      const effectiveJobId = targetJob?._id || selectedJobId;
      const effectiveJobTitle = targetJob?.title || selectedJobTitle || 'General Application';
      const effectiveDept = targetJob?.department || 'Distribution & Operations';

      const formData = new FormData();
      formData.append('fullName', effName);
      formData.append('email', effEmail);
      formData.append('phone', cleanPhone);
      if (form.whatsappNumber.trim()) {
        formData.append('whatsappNumber', form.whatsappNumber.trim());
      }
      formData.append('currentCity', form.currentCity.trim() || 'Surat');
      formData.append('currentState', form.currentState.trim() || 'Gujarat');
      formData.append('qualification', form.qualification.trim() || 'Graduate / Pharma');
      formData.append('positionAppliedFor', effectiveJobTitle);
      formData.append('jobTitle', effectiveJobTitle);
      formData.append('department', effectiveDept);

      if (effectiveJobId) {
        formData.append('jobOpeningId', effectiveJobId);
        formData.append('jobId', effectiveJobId);
      }

      formData.append('totalExperience', form.totalExperience);
      formData.append('totalExperienceYears', String(parseInt(form.totalExperience, 10) || 0));

      if (form.currentCompany.trim()) formData.append('currentCompany', form.currentCompany.trim());
      if (form.currentDesignation.trim()) formData.append('currentDesignation', form.currentDesignation.trim());
      if (form.currentCtc.trim()) formData.append('currentCtc', form.currentCtc.trim());
      if (form.expectedCtc.trim()) formData.append('expectedCtc', form.expectedCtc.trim());
      if (form.noticePeriod.trim()) formData.append('noticePeriod', form.noticePeriod.trim());
      if (form.coverNote.trim()) formData.append('coverNote', form.coverNote.trim());

      formData.append('resume', resumeFile!);
      formData.append('consentGiven', 'true');
      formData.append('source', 'WEBSITE_CAREERS');

      await careerService.applyForJob(formData);

      setSubmitSuccess(
        `Your application for "${effectiveJobTitle}" has been received! Our Talent Acquisition team will review your profile against the criteria within 48 business hours.`
      );

      setForm({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        whatsappNumber: user?.phone || '',
        currentCity: '',
        currentState: '',
        qualification: '',
        totalExperience: '1-3 Years',
        currentCompany: '',
        currentDesignation: '',
        currentCtc: '',
        expectedCtc: '',
        noticePeriod: '',
        coverNote: '',
      });
      setResumeFile(null);
      setFieldErrors({});
    } catch (err: any) {
      setSubmitError(
        err.message || 'Failed to submit application. Please verify details and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppApply = () => {
    const waText = buildCareerWhatsAppMessage({
      jobTitle: targetJob?.title || selectedJobTitle || 'General Application',
      department: targetJob?.department || 'Operations & Distribution',
      fullName: form.fullName.trim() || user?.name || 'Candidate',
      phone: form.phone.trim() || user?.phone || '',
      email: form.email.trim() || user?.email || '',
      currentCity: form.currentCity.trim(),
      currentState: form.currentState.trim(),
      qualification: form.qualification.trim(),
      totalExperience: form.totalExperience,
      currentCompany: form.currentCompany.trim(),
      currentDesignation: form.currentDesignation.trim(),
      expectedCtc: form.expectedCtc.trim(),
      noticePeriod: form.noticePeriod.trim(),
      coverNote: form.coverNote.trim(),
      authUser: user ? {
        name: user.name,
        phone: user.phone,
        email: user.email,
      } : undefined,
    });
    window.open(`https://wa.me/${hrWhatsAppNumber || '919909160190'}?text=${encodeURIComponent(waText)}`, '_blank');
  };

  return (
    <div id="application-form-card" style={{ width: '100%' }}>
      <div
        style={{ background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #E2E8F0', padding: '28px 24px', boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)', }}>
        {/* Form Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{width: '42px', height: '42px', borderRadius: '12px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--zp-primary)', }}>
              <FileText size={20} />
            </div>

            <div>
              <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#0F172A', margin: 0, lineHeight: 1.25, }}>
                {targetJob ? 'Apply for this Vacancy' : 'Direct HR Application'}
              </h3>
              <span style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 700 }}>
                ● Fast-Track 48-Hour HR Review
              </span>
            </div>
          </div>

          <VerifiedUserBadge user={user} style={{ marginTop: '14px' }} />

          {/* Targeted Job Banner OR Dropdown Selector */}
          {targetJob ? (
            <div
              style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)', borderRadius: '12px', padding: '12px 14px', border: '1.5px solid #DDD6FE', marginTop: '12px', }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#6828DC', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <Briefcase size={12} />
                <span>Selected Opening:</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1E1B4B', marginTop: '2px' }}>
                {targetJob.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>{targetJob.department}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={11} color="#6828DC" />
                  {targetJob.location}
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{ background: '#F8FAFC', borderRadius: '10px', padding: '10px 12px', border: '1px solid #E2E8F0', marginTop: '10px', }}>
              <label style={{display: 'block', fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase',marginBottom: '4px', }}>
                Target Position:
              </label>
              <ThemedSelect
                value={selectedJobId}
                onChange={(id) => {
                  const match = allPositions.find((j) => j._id === id);
                  if (onJobSelect) {
                    onJobSelect(
                      id,
                      match?.title || (id === 'general-opening' ? 'General Application' : '')
                    );
                  }
                }}
                options={positionOptions}
                searchable={true}
                searchPlaceholder="Type to search department roles..."
                placeholder="Select target job position..."
              />
            </div>
          )}
        </div>

        {submitSuccess && (
          <div
            style={{ background: '#ECFDF5', border: '1.5px solid #A7F3D0', color: '#065F46', padding: '16px',  borderRadius: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px', }}>
            <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '14px' }}>Application Submitted Successfully!</div>
              <div style={{ fontSize: '13px', marginTop: '4px', lineHeight: 1.5 }}>
                {submitSuccess}
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div
            style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#991B1B', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px', }}>
            <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '13px' }}>{submitError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Full Legal Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Rahul Patel"
              value={form.fullName}
              onChange={handleChange}
              className="zp-form-input"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: fieldErrors.fullName ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                boxShadow: fieldErrors.fullName ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                fontSize: '13.5px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            />
            {fieldErrors.fullName && (
              <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, lineHeight: 1.35, marginTop: '4px', display: 'block' }}>
                {fieldErrors.fullName}
              </span>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Email Address <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="name@email.com"
                value={form.email}
                onChange={handleChange}
                className="zp-form-input"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: fieldErrors.email ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  boxShadow: fieldErrors.email ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              />
              {fieldErrors.email && (
                <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, lineHeight: 1.35, marginTop: '4px', display: 'block' }}>
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Mobile / Phone <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="98765 43210"
                value={form.phone}
                onChange={handleChange}
                className="zp-form-input"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: fieldErrors.phone ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  boxShadow: fieldErrors.phone ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              />
              {fieldErrors.phone && (
                <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, lineHeight: 1.35, marginTop: '4px', display: 'block' }}>
                  {fieldErrors.phone}
                </span>
              )}
            </div>
          </div>

          {/* City & State Grid */}
          <div className="zp-career-form-grid-2col">
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Current City
              </label>
              <input
                type="text"
                name="currentCity"
                placeholder="e.g. Surat"
                value={form.currentCity}
                onChange={handleChange}
                className="zp-form-input"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Current State
              </label>
              <input
                type="text"
                name="currentState"
                placeholder="e.g. Gujarat"
                value={form.currentState}
                onChange={handleChange}
                className="zp-form-input"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Qualification & Experience Grid */}
          <div className="zp-career-form-grid-2col">
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Highest Qualification
              </label>
              <input
                type="text"
                name="qualification"
                placeholder="B.Pharma / D.Pharma / B.Sc"
                value={form.qualification}
                onChange={handleChange}
                className="zp-form-input"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Total Experience
              </label>
              <ThemedSelect
                value={form.totalExperience}
                onChange={(val) => setForm((p) => ({ ...p, totalExperience: val }))}
                options={experienceOptions}
                searchable={false}
              />
            </div>
          </div>

          {/* Current Company & Designation */}
          <div className="zp-career-form-grid-2col">
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Current Company
              </label>
              <input
                type="text"
                name="currentCompany"
                placeholder="Company / Agency"
                value={form.currentCompany}
                onChange={handleChange}
                className="zp-form-input"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Current Role / Title
              </label>
              <input
                type="text"
                name="currentDesignation"
                placeholder="e.g. Senior MR / Pharmacist"
                value={form.currentDesignation}
                onChange={handleChange}
                className="zp-form-input"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Current CTC & Expected CTC */}
          <div className="zp-career-form-grid-2col">
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Current CTC (₹ LPA)
              </label>
              <input
                type="text"
                name="currentCtc"
                placeholder="e.g. ₹3.5 LPA"
                value={form.currentCtc}
                onChange={handleChange}
                className="zp-form-input"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Expected CTC (₹ LPA)
              </label>
              <input
                type="text"
                name="expectedCtc"
                placeholder="e.g. ₹4.8 LPA"
                value={form.expectedCtc}
                onChange={handleChange}
                className="zp-form-input"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Cover Note / Brief Pitch */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Candidate Brief Pitch / Cover Note
            </label>
            <textarea
              name="coverNote"
              rows={2}
              placeholder="Highlight relevant pharma distribution, batch handling, or sales achievements..."
              value={form.coverNote}
              onChange={handleChange}
              className="zp-form-input"
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {/* Resume Upload Box */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Upload Resume (PDF, DOCX) <span style={{ color: '#EF4444' }}>*</span>
            </label>

            {!resumeFile ? (
              <>
                <label
                  style={{
                    border: fieldErrors.resumeFile ? '2px dashed #EF4444' : '2px dashed #CBD5E1',
                    boxShadow: fieldErrors.resumeFile ? '0 0 0 3px rgba(239, 68, 68, 0.12)' : 'none',
                    borderRadius: '12px',
                    padding: '20px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: '#F8FAFC',
                    transition: 'all 0.2s ease',
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setResumeFile(e.dataTransfer.files[0]);
                      setFieldErrors((prev) => ({ ...prev, resumeFile: undefined }));
                    }
                  }}
                >
                  <UploadCloud size={30} color={fieldErrors.resumeFile ? '#EF4444' : '#6828DC'} style={{ marginBottom: '6px' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E1B4B' }}>
                    Click to Browse or Drag &amp; Drop CV
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    PDF, DOC, DOCX up to 10MB
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                {fieldErrors.resumeFile && (
                  <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 500, lineHeight: 1.35, marginTop: '4px', display: 'block' }}>
                    {fieldErrors.resumeFile}
                  </span>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <FileText size={18} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E40AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                    {resumeFile.name}
                  </span>
                  <span style={{ fontSize: '11px', color: '#60A5FA' }}>
                    ({(resumeFile.size / 1024).toFixed(0)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '2px' }}
                  title="Remove File"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Privacy & Trust Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            <ShieldCheck size={14} color="#10B981" style={{ flexShrink: 0 }} />
            <span>Strict confidentiality. Your profile is shared only with our internal Talent Committee.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.75 : 1 }}
          >
            <Send size={16} />
            <span>
              {submitting
                ? 'Submitting Application...'
                : targetJob
                ? `Submit Application for ${targetJob.title}`
                : 'Submit Career Application'}
            </span>
          </button>

          {/* Direct WhatsApp HR Button */}
          <button
            type="button"
            onClick={handleWhatsAppApply}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '13.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px', background: '#25D366', color: '#FFFFFF', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)', boxSizing: 'border-box', transition: 'all 0.2s' }}
          >
            <MessageCircle size={17} />
            <span>Connect with HR on WhatsApp (Verified Login)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
