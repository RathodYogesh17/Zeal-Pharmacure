import React, { useState, useEffect, useMemo } from 'react';
import { Inbox, RefreshCw, Download, CheckCircle2, Building2, Briefcase, Layers, Pill } from 'lucide-react';
import { enquiryService } from '../api/enquiryService';
import { careerService } from '../api/careerService';
import { AdminEnquiryDetailModal, EnquiryStatsCards, EnquiryCategoryTabs, EnquiryFilterToolbar, EnquiryTableRow, StatusChangeConfirmModal, isCareerLead, isStockistLead, isBulkLead, isSingleProductLead, computeEnquiryStats, exportEnquiriesCSV, } from '../components/enquiries';
import { TablePagination, filterByDateRange, type DateFilterType, ZealLoader } from '../components/common';
import type { IEnquiry, EnquiryStatus } from '../types';

export { isCareerLead, isStockistLead, isBulkLead, isSingleProductLead } from '../components/enquiries';

export interface AdminEnquiriesPageProps {
  pageMode?: 'all' | 'product' | 'franchise' | 'career';
}

export const AdminEnquiriesPage: React.FC<AdminEnquiriesPageProps> = ({ pageMode = 'all' }) => {
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    enquiry: IEnquiry;
    newStatus: EnquiryStatus;
  } | null>(null);

  // Reset tab and page when pageMode route changes
  useEffect(() => {
    setActiveCategoryTab('all');
    setCurrentPage(1);
  }, [pageMode]);

  // Dynamic Global Stats computed via common utility
  const stats = useMemo(() => computeEnquiryStats(enquiries), [enquiries]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    loadEnquiries();
  }, [pageMode]);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const categoryParam =
        pageMode === 'franchise'
          ? 'franchise'
          : pageMode === 'product'
            ? 'product'
            : undefined;

      const shouldLoadCareers = pageMode === 'all' || pageMode === 'career';

      const [res, careerApps] = await Promise.all([
        enquiryService.adminGetEnquiries({
          limit: 500,
          category: categoryParam,
        }),
        shouldLoadCareers
          ? careerService.adminGetApplications().catch(() => [])
          : Promise.resolve([]),
      ]);

      const standardEnquiries = res?.enquiries || [];
      const mappedCareers: IEnquiry[] = (careerApps || []).map((app: any) => ({
        _id: app._id,
        enquiryType: 'CAREER',
        enquiryCategory: 'CAREER',
        name: app.fullName,
        fullName: app.fullName,
        email: app.email,
        phone: app.phone,
        whatsappNumber: app.whatsappNumber || app.phone,
        city: app.currentCity,
        state: app.currentState,
        preferredTerritory: app.preferredLocation,
        positionAppliedFor: app.positionAppliedFor || app.jobTitle || 'Candidate',
        department: app.department || 'Operations',
        qualification: app.qualification,
        totalExperienceYears: app.totalExperienceYears,
        currentCompany: app.currentCompany,
        currentDesignation: app.currentDesignation,
        currentCtc: app.currentCtc,
        expectedCtc: app.expectedCtc,
        noticePeriod: app.noticePeriod,
        resumeUrl: app.resumeUrl,
        coverLetter: app.coverLetter || app.coverNote,
        skills: app.skills,
        interviewRounds: app.interviewRounds,
        internalNotes: app.internalNotes,
        status: (app.status || 'NEW') as EnquiryStatus,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        message: app.coverLetter || `Applied for position: ${app.positionAppliedFor || 'Candidate'}`,
      }));

      const combined = [...standardEnquiries, ...mappedCareers].sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      setEnquiries(combined);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
      showToast('Error connecting to enquiries database');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    const target =
      enquiries.find((e) => e._id === id) || (selectedEnquiry?._id === id ? selectedEnquiry : null);
    if (!target) return;
    if (target.status === newStatus) return;
    setPendingStatusChange({ enquiry: target, newStatus });
  };

  const handleConfirmStatusChange = async (
    id: string,
    newStatus: EnquiryStatus,
    note?: string,
    customMessage?: string
  ) => {
    setUpdatingId(id);
    try {
      const target = enquiries.find((e) => e._id === id) || selectedEnquiry;
      const isCandidate =
        target?.enquiryType === 'CAREER' ||
        target?.enquiryCategory === 'CAREER' ||
        Boolean(target?.positionAppliedFor);

      let updatedNotes = target?.internalNotes;
      let whatsAppDispatch: any = null;

      if (isCandidate) {
        const res: any = await careerService.adminUpdateApplicationStatus(
          id,
          newStatus,
          true,
          customMessage
        );
        whatsAppDispatch = res?.whatsAppDispatch;
      } else {
        const updated: any = await enquiryService.adminUpdateEnquiryStatus(
          id,
          newStatus,
          note,
          undefined,
          true,
          customMessage
        );
        updatedNotes = updated?.internalNotes || updatedNotes;
        whatsAppDispatch = updated?.whatsAppDispatch;
      }

      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: newStatus, internalNotes: updatedNotes } : e))
      );
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus, internalNotes: updatedNotes } : null));
      }

      const clientName = target?.name || target?.fullName || 'Client';

      if (whatsAppDispatch?.directWhatsAppUrl) {
        window.open(whatsAppDispatch.directWhatsAppUrl, '_blank', 'noopener,noreferrer');
        showToast(`✅ Status updated to ${newStatus}! WhatsApp chat opened with pre-filled details.`);
      } else {
        showToast(`✅ Status updated to ${newStatus}`);
      }

      setPendingStatusChange(null);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      showToast(err?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddNote = async (id: string, noteText: string) => {
    try {
      const target = enquiries.find((e) => e._id === id) || selectedEnquiry;
      const isCandidate =
        target?.enquiryType === 'CAREER' ||
        target?.enquiryCategory === 'CAREER' ||
        Boolean(target?.positionAppliedFor);

      let updatedInternalNotes: any[] = [];
      if (isCandidate) {
        const res = await careerService.adminAddApplicationNote(id, noteText);
        updatedInternalNotes = res?.internalNotes || [
          ...(target?.internalNotes || []),
          { note: noteText, addedBy: 'HR Admin', addedAt: new Date().toISOString() },
        ];
      } else {
        const updated = await enquiryService.adminAddEnquiryNote(id, noteText);
        updatedInternalNotes = updated?.internalNotes || [
          ...(target?.internalNotes || []),
          { note: noteText, addedBy: 'Sales Admin', addedAt: new Date().toISOString() },
        ];
      }

      setSelectedEnquiry((prev) => (prev && prev._id === id ? { ...prev, internalNotes: updatedInternalNotes } : prev));
      setEnquiries((prev) => prev.map((e) => (e._id === id ? { ...e, internalNotes: updatedInternalNotes } : e)));
      showToast('Internal note saved successfully');
    } catch (err: any) {
      console.error('Failed to add note:', err);
      showToast(err?.message || 'Failed to add note');
    }
  };

  const handleDeleteEnquiry = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete lead enquiry from "${name}"? This action cannot be undone.`)) return;
    try {
      const target = enquiries.find((e) => e._id === id);
      if (target?.enquiryType === 'CAREER' || target?.enquiryCategory === 'CAREER') {
        await careerService.adminDeleteApplication(id);
      } else {
        await enquiryService.adminDeleteEnquiry(id);
      }
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
      if (selectedEnquiry && selectedEnquiry._id === id) {
        setSelectedEnquiry(null);
      }
      showToast(`Lead from "${name}" deleted`);
    } catch (err: any) {
      console.error('Failed to delete enquiry:', err);
      showToast('Failed to delete enquiry');
    }
  };

  // Base scope based on pageMode
  const scopedEnquiries = useMemo(() => {
    if (pageMode === 'product') {
      return enquiries.filter((e) => isSingleProductLead(e) || isBulkLead(e));
    }
    if (pageMode === 'franchise') {
      return enquiries.filter(isStockistLead);
    }
    if (pageMode === 'career') {
      return enquiries.filter(isCareerLead);
    }
    return enquiries;
  }, [enquiries, pageMode]);

  // Extract unique states for filter
  const uniqueStates = useMemo(() => {
    const set = new Set<string>();
    scopedEnquiries.forEach((e) => {
      if (e.state && e.state.trim()) set.add(e.state.trim());
    });
    return Array.from(set).sort();
  }, [scopedEnquiries]);

  // Client-side filtering by search, category tab, status, and state
  const filtered = useMemo(() => {
    let result = scopedEnquiries;

    if (pageMode === 'product') {
      if (activeCategoryTab === 'single') {
        result = result.filter(isSingleProductLead);
      } else if (activeCategoryTab === 'bulk') {
        result = result.filter(isBulkLead);
      }
    } else if (pageMode === 'franchise') {
      if (activeCategoryTab === 'dl_verified') {
        result = result.filter((e) => Boolean(e.drugLicenseNumber || e.hasDrugLicense));
      } else if (activeCategoryTab === 'facility_ready') {
        result = result.filter((e) => Boolean(e.hasGodownFacility || e.hasTransportFacility));
      }
    } else if (pageMode === 'career') {
      if (activeCategoryTab === 'experienced') {
        result = result.filter((e) => Boolean(Number(e.totalExperienceYears) > 0));
      } else if (activeCategoryTab === 'freshers') {
        result = result.filter((e) => !e.totalExperienceYears || Number(e.totalExperienceYears) === 0);
      }
    } else {
      if (activeCategoryTab === 'franchise') {
        result = result.filter(isStockistLead);
      } else if (activeCategoryTab === 'product') {
        result = result.filter(isSingleProductLead);
      } else if (activeCategoryTab === 'bulk') {
        result = result.filter(isBulkLead);
      } else if (activeCategoryTab === 'career') {
        result = result.filter(isCareerLead);
      }
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((e) => {
        if (statusFilter === 'NEW') return e.status === 'NEW' || (e.status as any) === 'PENDING';
        return e.status === statusFilter;
      });
    }

    if (stateFilter !== 'ALL') {
      result = result.filter((e) => e.state === stateFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => {
        const name = (e.name || e.fullName || '').toLowerCase();
        const comp = (e.companyName || e.currentCompany || '').toLowerCase();
        const city = (e.city || '').toLowerCase();
        const dist = (e.district || e.territoryDistrict || '').toLowerCase();
        const state = (e.state || '').toLowerCase();
        const phone = (e.phone || '').toLowerCase();
        const email = (e.email || '').toLowerCase();
        const dl = (e.drugLicenseNumber || '').toLowerCase();
        const prod = typeof e.product === 'object' && e.product?.name ? e.product.name.toLowerCase() : '';
        const role = (e.positionAppliedFor || '').toLowerCase();

        return (
          name.includes(q) ||
          comp.includes(q) ||
          city.includes(q) ||
          dist.includes(q) ||
          state.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          dl.includes(q) ||
          prod.includes(q) ||
          role.includes(q)
        );
      });
    }

    return result;
  }, [scopedEnquiries, pageMode, activeCategoryTab, statusFilter, stateFilter, search]);

  // Date-wise filtering
  const dateFiltered = useMemo(() => {
    return filterByDateRange(filtered, (e) => e.createdAt, dateFilter);
  }, [filtered, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(dateFiltered.length / pageSize));
  const paginatedEnquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return dateFiltered.slice(start, start + pageSize);
  }, [dateFiltered, currentPage, pageSize]);

  const handleExportCSV = () => exportEnquiriesCSV(filtered, showToast);

  const hasActiveFilters = Boolean(
    search || statusFilter !== 'ALL' || stateFilter !== 'ALL' || dateFilter !== 'ALL' || activeCategoryTab !== 'all'
  );

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setStateFilter('ALL');
    setDateFilter('ALL');
    setActiveCategoryTab('all');
    setCurrentPage(1);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '13.5px',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid #334155',
          }}
        >
          <CheckCircle2 size={18} style={{ color: '#10B981' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
            {pageMode === 'product' && <>CRM &amp; Sales Pipeline &gt; <strong>Product Formulation &amp; Bulk Orders</strong></>}
            {pageMode === 'franchise' && <>CRM &amp; Sales Pipeline &gt; <strong>Stockist Distribution Network</strong></>}
            {pageMode === 'career' && <>Talent Pipeline &gt; <strong>Career Applications &amp; ATS</strong></>}
            {pageMode === 'all' && <>CRM &amp; Sales Pipeline &gt; <strong>Stockists Distribution &amp; Product Leads</strong></>}
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {pageMode === 'product' && <><Pill size={26} style={{ color: '#059669' }} /><span>Product Formulation &amp; Bulk Orders</span></>}
            {pageMode === 'franchise' && <><Building2 size={26} style={{ color: '#6828DC' }} /><span>Stockist Distribution Network</span></>}
            {pageMode === 'career' && <><Briefcase size={26} style={{ color: '#4F46E5' }} /><span>Career Applications &amp; Candidate ATS</span></>}
            {pageMode === 'all' && <><Layers size={26} style={{ color: '#6828DC' }} /><span>B2B Lead Pipeline &amp; Inquiries</span></>}
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '2px' }}>
            {pageMode === 'product' && 'Manage Single Formulation quotes and Institutional Multi-Item Wholesale Batch Orders.'}
            {pageMode === 'franchise' && 'Review exclusive district monopoly applications, drug license credentials & commercial logistics.'}
            {pageMode === 'career' && 'Track candidate job applications, qualification credentials, CTC expectations & resume downloads.'}
            {pageMode === 'all' && 'Track Stockists Distribution Network applications, territory requests, and bulk institutional formulation orders.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={loadEnquiries}
            className="btn btn-secondary"
            title="Refresh Inquiries"
            style={{ borderRadius: '8px', padding: '9px 14px', fontSize: '13px' }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-primary"
            style={{ borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600 }}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 1. KPI Stats Cards (Common Component) */}
      <EnquiryStatsCards
        pageMode={pageMode}
        stats={stats}
        activeCategoryTab={activeCategoryTab}
        onSelectTab={(tab) => {
          setActiveCategoryTab(tab);
          setCurrentPage(1);
        }}
      />

      {/* 2. Category Tabs (Common Component) */}
      <EnquiryCategoryTabs
        pageMode={pageMode}
        stats={stats}
        activeCategoryTab={activeCategoryTab}
        onSelectTab={(tab) => {
          setActiveCategoryTab(tab);
          setCurrentPage(1);
        }}
      />

      {/* 3. Filter & Search Toolbar (Common Component) */}
      <EnquiryFilterToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        dateFilter={dateFilter}
        onDateFilterChange={(val) => {
          setDateFilter(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        stateFilter={stateFilter}
        onStateFilterChange={(val) => {
          setStateFilter(val);
          setCurrentPage(1);
        }}
        uniqueStates={uniqueStates}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Enquiries Table */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)',
        }}
      >
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1180px' }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', width: '50px' }}>#</th>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Applicant Profile</th>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Company &amp; Entity</th>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Target Product / Territory</th>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Drug License / GST</th>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Created / Updated Date</th>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Updated By</th>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Pipeline Status</th>
                <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <ZealLoader
                  variant="table-row"
                  colSpan={10}
                  title="Loading Inquiries & Distribution Leads"
                  subtitle="Streaming verified customer enquiries and stockist applications..."
                  size="md"
                />
              ) : dateFiltered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '56px', textAlign: 'center' }}>
                    <Inbox size={40} style={{ color: '#94A3B8', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>No inquiries found</p>
                    <p style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
                      {search || statusFilter !== 'ALL' || stateFilter !== 'ALL' || dateFilter !== 'ALL'
                        ? 'Try clearing your active filters to see all recorded inquiries.'
                        : 'New B2B Stockist Distribution submissions and product queries from the website will appear here in real-time.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedEnquiries.map((enq, index) => (
                  <EnquiryTableRow
                    key={enq._id || index}
                    enquiry={enq}
                    rowNumber={(currentPage - 1) * pageSize + index + 1}
                    updatingId={updatingId}
                    onStatusChange={handleInitiateStatusChange}
                    onView={setSelectedEnquiry}
                    onDelete={handleDeleteEnquiry}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Standardized Table Pagination */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={dateFiltered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Universal Dynamic Single Master Detail Modal */}
      <AdminEnquiryDetailModal
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onStatusChange={handleInitiateStatusChange}
        onAddNote={handleAddNote}
        onDelete={handleDeleteEnquiry}
      />

      {/* 1-Click Status Confirmation & WhatsApp Message Modal */}
      {pendingStatusChange && (
        <StatusChangeConfirmModal
          isOpen={Boolean(pendingStatusChange)}
          onClose={() => setPendingStatusChange(null)}
          enquiry={pendingStatusChange.enquiry}
          newStatus={pendingStatusChange.newStatus}
          onConfirm={handleConfirmStatusChange}
          isSubmitting={updatingId === pendingStatusChange.enquiry._id}
        />
      )}
    </div>
  );
};


