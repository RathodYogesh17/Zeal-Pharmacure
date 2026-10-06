import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollToId?: string;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, scrollToId,}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    if (scrollToId) {
      const el = document.getElementById(scrollToId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ marginTop: '40px', display: 'flex',alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',gap: '8px', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid var(--zp-border-light)', padding: '14px 20px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',}}>
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="zp-btn-secondary"
        style={{ padding: '8px 14px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', }}>
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageClick(pageNum)}
              style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center',justifyContent: 'center', borderRadius: '10px', border: isCurrent ? '1.5px solid var(--zp-primary)' : '1.5px solid var(--zp-border-light)', background: isCurrent ? 'var(--zp-primary)' : '#FFFFFF', color: isCurrent ? '#FFFFFF' : '#334155', fontSize: '13.5px', fontWeight: isCurrent ? 800 : 600, cursor: 'pointer', boxShadow: isCurrent ? '0 4px 12px var(--zp-primary-glow)' : 'none', transition: 'all 0.15s ease',}}>
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="zp-btn-secondary"
        style={{
          padding: '8px 14px',
          opacity: currentPage === totalPages ? 0.5 : 1,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
