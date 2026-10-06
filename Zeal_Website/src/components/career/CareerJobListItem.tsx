import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight,Sparkles, Building,} from 'lucide-react';
import type { IJobOpening } from '../../types';

export interface CareerJobListItemProps {
  job: IJobOpening;
}

export const CareerJobListItem: React.FC<CareerJobListItemProps> = ({ job }) => {
  const navigate = useNavigate();

  const handleOpenDetail = () => {
    navigate(`/career/${job.slug || job._id}`);
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full Time';
      case 'PART_TIME':
        return 'Part Time';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERNSHIP':
        return 'Internship';
      default:
        return type || 'Full Time';
    }
  };

  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '29 Sept 2026';

  return (
    <div
      onClick={handleOpenDetail}
      style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0',padding: '20px 24px',boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',transition: 'all 0.2s ease',cursor: 'pointer',}}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#C4B5FD';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(104, 40, 220, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E2E8F0';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.03)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top Row: Department Badge + Date on Left, Status Badge on Right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px', }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Department Pill */}
          <span style={{ background: '#EDE9FE', color: '#6828DC', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,display: 'inline-flex', alignItems: 'center', gap: '5px',}}>
            {job.department}
          </span>

          {/* Date */}
          <span style={{ fontSize: '12px', color: '#94A3B8' }}> Posted: {formattedDate} </span>

          {/* Job Type Pill */}
          <span style={{ background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700,}} >
            {getJobTypeLabel(job.jobType)}
          </span>

          {/* Priority Hiring Badge */}
          {job.isFeatured && (
            <span style={{background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: '6px',fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px',}}>
              <Sparkles size={12} />
              <span>Priority Hiring</span>
            </span>
          )}
        </div>

        {/* Status Pill on Right */}
        <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '3px 10px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 800,display: 'inline-flex', alignItems: 'center', gap: '6px', }}>
          <span style={{  width: '6px', height: '6px', borderRadius: '50%', background: '#10B981',}}/>
          <span>Open Opening</span>
        </span>
      </div>

      {/* Second Row: Big Bold Title */}
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0', transition: 'color 0.15s ease',}}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#6828DC')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#0F172A')}
      >
        {job.title}
      </h3>

      {/* Third Row: Inline Details (Exact same layout as screenshot) */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px', fontSize: '13px', color: '#475569', marginBottom: '16px', }}>
        {job.salaryRange && (
          <div>
            <strong style={{ color: '#0F172A' }}>Salary:</strong>{' '}
            <span style={{ color: '#059669', fontWeight: 700 }}>{job.salaryRange}</span>
          </div>
        )}

        <div>
          <strong style={{ color: '#0F172A' }}>Openings:</strong> {job.openingsCount || 1}{' '}
          {job.openingsCount === 1 ? 'Vacancy' : 'Vacancies'}
        </div>

        <div>
          <strong style={{ color: '#0F172A' }}>Experience:</strong>{' '}
          {job.experienceRequired || '1 - 3 Years'}
        </div>

        <div>
          <strong style={{ color: '#0F172A' }}>Location:</strong> Surat Central Godown
        </div>
      </div>

      {/* Bottom Row / Actions (Schedule/Note style on left, View & Apply on right) */}
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', }}>
        {/* Left: Division Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B' }}>
          <Building size={14} color="#6828DC" />
          <span>Zeal Pharma • Wholesale Stockist Distribution</span>
        </div>

        {/* Right: View Details & Apply Button */}
        <button
          type="button"
          onClick={(e) => {e.stopPropagation(); handleOpenDetail();}}
          style={{ fontSize: '12.5px', padding: '7px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #6828DC 0%, #7C3AED 100%)', color: '#FFFFFF', border: 'none',fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 3px 10px rgba(104, 40, 220, 0.24)', transition: 'all 0.15s ease',}}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 5px 14px rgba(104, 40, 220, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 3px 10px rgba(104, 40, 220, 0.24)';
          }}
        >
          <span>View Details &amp; Apply</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
