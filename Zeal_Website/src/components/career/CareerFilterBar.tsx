import React from 'react';
import { Search, Layers, MapPin, X, Filter } from 'lucide-react';
import { ThemedSelect } from '../common/ThemedSelect';

export interface CareerFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDept: string;
  onDeptChange: (dept: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  totalFilteredCount?: number;
}

export const CareerFilterBar: React.FC<CareerFilterBarProps> = ({ searchQuery, onSearchChange, selectedDept, onDeptChange, selectedLocation, onLocationChange, totalFilteredCount}) => {
  const departments = [
    { value: 'ALL', label: 'All Departments' },
    { value: 'Warehouse & Logistics', label: 'Warehouse & Logistics (Godown / Dispatch)' },
    { value: 'Pharmacy & Quality Control', label: 'Pharmacy & Quality Control (Pharmacist)' },
    { value: 'Sales & Marketing', label: 'Sales & Marketing (Sales Exec)' },
    { value: 'Purchase & Procurement', label: 'Purchase & Procurement' },
    { value: 'Customer Support & Order Processing', label: 'Customer Support & Order Processing' },
    { value: 'Inventory & Accounts', label: 'Inventory & Accounts (ERP / GST)' },
  ];

  const locations = [
    { value: 'ALL', label: 'All Work Locations' },
    { value: 'Surat', label: 'Surat Central Depot (7015, BTM)' },
  ];

  const hasActiveFilters = searchQuery.trim() !== '' || selectedDept !== 'ALL' || selectedLocation !== 'ALL';

  const handleResetFilters = () => {
    onSearchChange('');
    onDeptChange('ALL');
    onLocationChange('ALL');
  };

  return (
    <div className="container" style={{ marginTop: '-34px', position: 'relative', zIndex: 10 }}>
      <div
        style={{ background: '#FFFFFF',  borderRadius: '24px', border: '1.5px solid #E2E8F0', padding: '20px 24px',  boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',}}>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',  gap: '16px', alignItems: 'center', }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px',  top: '50%', transform: 'translateY(-50%)', color: '#6828DC', }}/>
            <input
              type="text"
              placeholder="Search by job title, skill, or role..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#F8FAFC', color: '#0F172A', boxSizing: 'border-box', }}/>
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: '#E2E8F0', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Department Select */}
          <div>
            <ThemedSelect
              icon={<Layers size={17} />}
              value={selectedDept}
              onChange={(val) => onDeptChange(val)}
              options={departments}
              searchable={true}
              searchPlaceholder="Search departments..."
              placeholder="All Departments"
            />
          </div>

          {/* Location Select */}
          <div>
            <ThemedSelect
              icon={<MapPin size={17} color="#D97706" />}
              value={selectedLocation}
              onChange={(val) => onLocationChange(val)}
              options={locations}
              searchable={true}
              searchPlaceholder="Search locations..."
              placeholder="All Work Locations"
            />
          </div>
        </div>

        {/* Quick Filter Department Chips */}
        <div
          style={{ display: 'flex',  alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #F1F5F9', }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={13} />
              <span>Quick Filter:</span>
            </span>

            {departments.map((d) => {
              const isActive = selectedDept === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => onDeptChange(d.value)}
                  style={{ background: isActive ? '#6828DC' : '#FAF5FF', color: isActive ? '#FFFFFF' : '#6828DC', border: `1px solid ${isActive ? '#6828DC' : '#EDE9FE'}`, padding: '5px 12px',  borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s ease',}}>
                  {d.label.split('(')[0].trim()}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {typeof totalFilteredCount === 'number' && (
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#6828DC', background: '#EDE9FE', padding: '3px 10px', borderRadius: '12px' }}>
                {totalFilteredCount} {totalFilteredCount === 1 ? 'Opening' : 'Openings'} Found
              </span>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                style={{ background: 'transparent', border: 'none', color: '#EF4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center',  gap: '4px',}}>
                <X size={13} />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
