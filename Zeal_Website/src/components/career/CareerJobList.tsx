import React from 'react';
import { Briefcase, MapPin, Clock, CheckCircle2, ArrowRight,} from 'lucide-react';
import type { IJobOpening } from '../../types';

export interface CareerJobListProps {
  jobs: IJobOpening[];
  loading: boolean;
  selectedJobId: string;
  onSelectJob: (job: IJobOpening) => void;
}

export const CareerJobList: React.FC<CareerJobListProps> = ({jobs, loading, selectedJobId, onSelectJob,}) => {
  return (
    <div>
      {/* Section Sub-heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px',fontSize: '11.5px', fontWeight: 800, color: '#6828DC', background: '#EDE9FE', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px', }}>
            <Briefcase size={13} />
            <span>Active Vacancy Listings</span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em', }}>
            Open Positions ({jobs.length})
          </h2>
        </div>

        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
          Direct recruitment on company payroll
        </span>
      </div>

      {loading ? (
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #E2E8F0', padding: '48px 24px', textAlign: 'center', color: 'var(--zp-primary)', }}>
          <div className="pulse-dot" style={{ margin: '0 auto 12px', width: '36px', height: '36px' }}>
            <Briefcase size={36} color="var(--zp-primary)" />
          </div>
          <p style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
            Loading verified career openings...
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div
          style={{ background: '#FFFFFF', borderRadius: '24px', padding: '44px 28px', textAlign: 'center', border: '1.5px solid #E2E8F0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)', }}>
          <div  style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#FAF5FF', border: '1.5px solid #EDE9FE', display: 'flex', alignItems: 'center',justifyContent: 'center',  margin: '0 auto 14px',color: '#6828DC', }}>
            <Briefcase size={26} />
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
            No Matching Vacancies Found
          </h4>
          <p style={{ color: '#64748B', fontSize: '13.5px', maxWidth: '440px', margin: '0 auto 18px' }}>
            We are always scouting for top pharmaceutical talent. You can submit a spontaneous application using the form alongside for upcoming batches.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {jobs.map((job) => {
            const isSelected = selectedJobId === job._id;

            return (
              <div
                key={job._id}
                style={{ background: '#FFFFFF', borderRadius: '24px', border: isSelected ? '2px solid var(--zp-primary)' : '1.5px solid #E2E8F0', padding: '28px', boxShadow: isSelected
                    ? '0 12px 32px rgba(104, 40, 220, 0.14)'
                    : '0 4px 20px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.2s ease', position: 'relative', }}>
                {/* Active Indicator Strip */}
                {isSelected && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#EDE9FE', color: 'var(--zp-primary)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', }}>
                    <CheckCircle2 size={13} color="var(--zp-primary)" />
                    <span>Selected</span>
                  </div>
                )}

                {/* Card Header */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <span
                      style={{ background: '#EDE9FE', color: 'var(--zp-primary)', padding: '4px 12px', borderRadius: '100px', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', }}>
                      {job.department}
                    </span>

                    {job.openingsCount && (
                      <span style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '3px 10px', borderRadius: '100px', fontSize: '11.5px', fontWeight: 700, }}>
                        {job.openingsCount} Vacancies Available
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '21px', fontWeight: 900,color: '#0F172A', margin: 0, lineHeight: 1.3,  letterSpacing: '-0.02em', }}>
                    {job.title}
                  </h3>
                </div>

                {/* Meta Chips Row */}
                <div  style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '16px 0',  }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 12px',  borderRadius: '10px', fontSize: '12.5px', color: '#334155', fontWeight: 600, }}>
                    <MapPin size={14} color="#D97706" />
                    <span>{job.location}</span>
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '10px', fontSize: '12.5px',  color: '#334155',  fontWeight: 600, }}>
                    <Briefcase size={14} color="var(--zp-primary)" />
                    <span>{job.experienceRequired}</span>
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '6px 12px', borderRadius: '10px', fontSize: '12.5px', color: '#065F46', fontWeight: 700, }}>
                    <Clock size={14} color="#10B981" />
                    <span>{job.salaryRange || 'Competitive CTC + Incentives'}</span>
                  </div>
                </div>

                {/* Short Job Description */}
                <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.6,  margin: '0 0 16px 0', }}>
                  {job.description}
                </p>

                {/* Key Responsibilities */}
                {job.responsibilities && job.responsibilities.length > 0 && (
                  <div style={{ background: '#F8FAFC', borderRadius: '14px', padding: '14px 18px', border: '1px solid #E2E8F0', marginBottom: '20px', }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px',}}>
                      Key Responsibilities &amp; Scope:
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {job.responsibilities.slice(0, 3).map((r, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px',fontSize: '13px', color: '#334155', lineHeight: 1.45,}}>
                          <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }}/>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => onSelectJob(job)}
                  className={isSelected ? 'btn btn-primary' : 'zp-btn-secondary'}
                  style={{ width: '100%', borderRadius: '12px', padding: '12px', fontSize: '13.5px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease', }}>
                  <span>
                    {isSelected
                      ? '✓ Selected for Application (Fill Form Beside)'
                      : 'Apply for this Position'}
                  </span>
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
