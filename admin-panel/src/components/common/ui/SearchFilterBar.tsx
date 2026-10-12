import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { DateFilterSelect, type DateFilterType } from '../tableTheme';

export interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  dateFilter?: DateFilterType;
  onDateFilterChange?: (filter: DateFilterType) => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  onReset?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  dateFilter,
  onDateFilterChange,
  filters,
  actions,
  onReset,
  className = '',
  style,
}) => {
  return (
    <div
      className={`zp-search-filter-bar ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '12px 16px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: 1,
          minWidth: '260px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search Input Box */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: '200px',
            maxWidth: '380px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              color: '#94A3B8',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            style={{
              width: '100%',
              padding: '8px 32px 8px 36px',
              fontSize: '13px',
              color: '#1E293B',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 0.15s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6828DC';
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(104, 40, 220, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              title="Clear search"
              style={{
                position: 'absolute',
                right: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Date Filter */}
        {dateFilter !== undefined && onDateFilterChange && (
          <DateFilterSelect value={dateFilter} onChange={onDateFilterChange} />
        )}

        {/* Custom Filter Selects / Dropdowns */}
        {filters}

        {/* Reset Button */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            title="Reset all filters"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#64748B',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.color = '#1E293B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {actions && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
};
