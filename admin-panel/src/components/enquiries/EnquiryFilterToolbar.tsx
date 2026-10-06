import React from 'react';
import { Search } from 'lucide-react';
import { ThemeSelect, DateFilterSelect, type DateFilterType } from '../common';

export interface EnquiryFilterToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  dateFilter: DateFilterType;
  onDateFilterChange: (val: DateFilterType) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  stateFilter: string;
  onStateFilterChange: (val: string) => void;
  uniqueStates: string[];
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const EnquiryFilterToolbar: React.FC<EnquiryFilterToolbarProps> = ({
  search,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
  stateFilter,
  onStateFilterChange,
  uniqueStates,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <div
      className="responsive-filter-bar"
      style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        alignItems: 'center',
        flexWrap: 'wrap',
        background: '#FFFFFF',
        padding: '14px',
        borderRadius: '12px',
        border: '1.5px solid #E2E8F0',
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94A3B8',
          }}
        />
        <input
          type="text"
          placeholder="Search by Name, Company, City, District, Phone, DL..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px 9px 36px',
            borderRadius: '8px',
            border: '1.5px solid #CBD5E1',
            fontSize: '13.5px',
          }}
        />
      </div>

      {/* Date Filter Dropdown */}
      <DateFilterSelect value={dateFilter} onChange={onDateFilterChange} />

      {/* Pipeline Status Filter */}
      <div style={{ minWidth: '170px' }}>
        <ThemeSelect
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="ALL">All Pipeline Status</option>
          <option value="NEW">New Lead</option>
          <option value="CONTACTED">In Contact</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="DOCUMENTS_PENDING">Documents Pending</option>
          <option value="QUOTED">Quotation Sent</option>
          <option value="APPROVED">Approved / Closed</option>
          <option value="REJECTED">Rejected</option>
          <option value="ON_HOLD">On Hold</option>
        </ThemeSelect>
      </div>

      {/* State Filter */}
      {uniqueStates.length > 0 && (
        <div style={{ minWidth: '150px' }}>
          <ThemeSelect
            value={stateFilter}
            onChange={(e) => onStateFilterChange(e.target.value)}
          >
            <option value="ALL">All States ({uniqueStates.length})</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </ThemeSelect>
        </div>
      )}

      {/* Reset Filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="btn btn-secondary"
          style={{ borderRadius: '8px', padding: '9px 14px', fontSize: '13px' }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
