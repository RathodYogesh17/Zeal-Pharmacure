import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { selectCurrentRole, setSimulatedRole } from '../../store/slices/authSlice';

interface RoleOption {
  value: string;
  label: string;
  badge: string;
  desc: string;
}

const ROLES: RoleOption[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin', badge: 'Full Access', desc: 'Unrestricted enterprise control' },
  { value: 'ADMIN', label: 'Admin (Ops)', badge: 'Manager', desc: 'Product, enquiries & operations' },
  { value: 'SALES_MANAGER', label: 'Sales Manager', badge: 'Sales', desc: 'Franchise & product enquiries' },
  { value: 'HR_MANAGER', label: 'HR Manager', badge: 'HR', desc: 'Vacancies & candidate resumes' },
  { value: 'CONTENT_MANAGER', label: 'Content Manager', badge: 'Media', desc: 'CMS pages & gallery assets' },
  { value: 'EMPLOYEE', label: 'Employee', badge: 'Read-only', desc: 'Catalog & basic viewer rights' },
];

export const CustomRoleDropdown: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeRole = useAppSelector(selectCurrentRole);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = ROLES.find((r) => r.value === activeRole) || ROLES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRole = (val: string) => {
    dispatch(setSimulatedRole(val === 'SUPER_ADMIN' ? null : val));
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Role Simulator: ${currentOption.label}`}
        className="role-simulator-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isOpen ? '#EDE9FE' : '#F5F3FF',
          border: '1.5px solid',
          borderColor: isOpen ? '#8B5CF6' : '#DDD6FE',
          borderRadius: '10px',
          padding: '6px 10px',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '0 0 0 3px rgba(104, 40, 220, 0.12)' : 'none',
        }}
        onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.borderColor = '#A78BFA'; }}
        onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.borderColor = '#DDD6FE'; }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6828DC 0%, #8B5CF6 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={15} />
        </div>

        <div className="role-sim-text" style={{ textAlign: 'left', lineHeight: 1.15 }}>
          <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#6828DC', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Role Simulator
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: '1px' }}>
            {currentOption.label}
          </div>
        </div>

        <ChevronDown
          className="role-sim-chevron"
          size={14}
          style={{
            color: '#6828DC',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            marginLeft: '2px',
          }}
        />
      </button>

      <style>{`
        @media (max-width: 640px) {
          .role-sim-text, .role-sim-chevron {
            display: none !important;
          }
          .role-simulator-btn {
            padding: 5px !important;
          }
        }
      `}</style>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '260px',
            maxWidth: 'calc(100vw - 24px)',
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.15), 0 4px 12px rgba(104, 40, 220, 0.08)',
            zIndex: 9999,
            padding: '6px',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <div
            style={{ padding: '8px 10px 6px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid #F1F5F9', marginBottom: '4px', }} > Simulate Role Permissions </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {ROLES.map((role) => {
              const isSelected = role.value === activeRole;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => handleSelectRole(role.value)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '8px', background: isSelected ? '#FAF5FF' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s ease', }}
                  onMouseEnter={(e) => {if (!isSelected) e.currentTarget.style.background = '#F8FAFC';}}
                  onMouseLeave={(e) => {if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#6828DC' : '#1E293B' }}> {role.label} </span>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '999px', background: isSelected ? '#EDE9FE' : '#F1F5F9', color: isSelected ? '#6828DC' : '#64748B',}}> {role.badge} </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}> {role.desc} </span>
                  </div>
                  {isSelected && <Check size={16} style={{ color: '#6828DC', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
