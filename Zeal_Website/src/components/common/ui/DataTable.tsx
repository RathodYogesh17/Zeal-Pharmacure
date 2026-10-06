import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  loading?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (term: string) => void;
  headerActions?: React.ReactNode;
  emptyTitle?: string;
  emptySubtitle?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    totalItems?: number;
  };
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  searchPlaceholder,
  onSearchChange,
  headerActions,
  emptyTitle = 'No records found',
  emptySubtitle = 'Try adjusting your search criteria or filters.',
  pagination,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState('');

  const handleSearch = (val: string) => {
    setInternalSearch(val);
    onSearchChange?.(val);
  };

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',}}>
      {/* Search & Actions Bar */}
      {(searchPlaceholder || headerActions) && (
        <div style={{ padding: '16px 20px', borderBottom: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', backgroundColor: '#F8FAFC', }}>
          {searchPlaceholder && (
            <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', }}/>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={internalSearch}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 36px',  borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF', outline: 'none', boxSizing: 'border-box', }}/>
            </div>
          )}

          {headerActions && <div style={{ display: 'flex', gap: '8px' }}>{headerActions}</div>}
        </div>
      )}

      {/* Table Container */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ padding: '14px 18px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: col.width, textAlign: col.align || 'left', }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '48px', textAlign: 'center', color: '#6828DC', fontWeight: 600 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <Inbox size={36} style={{ color: '#94A3B8', margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
                    {emptyTitle}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                    {emptySubtitle}
                  </p>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ padding: '14px 18px', fontSize: '13.5px', color: '#334155',  textAlign: col.align || 'left',}}>
                      {col.render ? col.render(item, index) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', flexWrap: 'wrap', gap: '10px', }}>
          <div style={{ fontSize: '13px', color: '#64748B' }}>
            Showing page <strong style={{ color: '#0F172A' }}>{pagination.currentPage}</strong> of{' '}
            <strong style={{ color: '#0F172A' }}>{pagination.totalPages}</strong>
            {pagination.totalItems !== undefined && ` (${pagination.totalItems} total items)`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              style={{ width: '32px', height: '32px',  borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: pagination.currentPage <= 1 ? 'not-allowed' : 'pointer',  opacity: pagination.currentPage <= 1 ? 0.5 : 1, }}>
              <ChevronLeft size={16} />
            </button>

            <span style={{ fontSize: '13px', fontWeight: 700, padding: '0 8px', color: '#6828DC' }}>
              {pagination.currentPage}
            </span>

            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1.5px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: pagination.currentPage >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.currentPage >= pagination.totalPages ? 0.5 : 1, }} >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
