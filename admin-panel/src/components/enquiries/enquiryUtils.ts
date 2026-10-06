import type { IEnquiry, EnquiryStatus } from '../../types';

// Mutually exclusive category classification helpers
export const isCareerLead = (e: IEnquiry): boolean => {
  return Boolean(
    e.enquiryType === 'CAREER' ||
    e.enquiryCategory === 'CAREER' ||
    e.positionAppliedFor ||
    e.resumeUrl ||
    e.totalExperienceYears
  );
};

export const isStockistLead = (e: IEnquiry): boolean => {
  if (isCareerLead(e)) return false;
  if (e.enquiryType === 'FRANCHISE' || e.enquiryCategory === 'FRANCHISE') return true;
  if (
    e.territoryDistrict ||
    e.investmentBudget ||
    e.pharmaExperience ||
    e.hasGodownFacility !== undefined ||
    e.hasTransportFacility !== undefined ||
    (Array.isArray(e.interestedDivisions) && e.interestedDivisions.length > 0)
  ) {
    return true;
  }
  // If not career and no product/products array attached
  if (!e.product && (!e.products || e.products.length === 0)) {
    return true;
  }
  return false;
};

export const isBulkLead = (e: IEnquiry): boolean => {
  if (isCareerLead(e) || isStockistLead(e)) return false;
  return (
    e.enquiryType === 'BULK_PRODUCT' ||
    (Array.isArray(e.products) && e.products.length > 0)
  );
};

export const isSingleProductLead = (e: IEnquiry): boolean => {
  if (isCareerLead(e) || isStockistLead(e) || isBulkLead(e)) return false;
  return true;
};

export interface EnquiryStats {
  total: number;
  franchiseTotal: number;
  productTotal: number;
  bulkTotal: number;
  careerTotal: number;
  newLeads: number;
  totalProducts: number;
  productNew: number;
  franchiseDlVerified: number;
  franchiseLogisticsReady: number;
  franchiseNew: number;
  careerExperienced: number;
  careerFreshers: number;
  careerShortlisted: number;
}

export const computeEnquiryStats = (enquiries: IEnquiry[]): EnquiryStats => {
  const total = enquiries.length;
  const franchiseTotal = enquiries.filter(isStockistLead).length;
  const productTotal = enquiries.filter(isSingleProductLead).length;
  const bulkTotal = enquiries.filter(isBulkLead).length;
  const careerTotal = enquiries.filter(isCareerLead).length;
  const newLeads = enquiries.filter(e => e.status === 'NEW' || (e.status as any) === 'PENDING').length;

  const totalProducts = productTotal + bulkTotal;
  const productNew = enquiries.filter(
    e => (isSingleProductLead(e) || isBulkLead(e)) && (e.status === 'NEW' || (e.status as any) === 'PENDING')
  ).length;

  const franchiseDlVerified = enquiries.filter(
    e => isStockistLead(e) && Boolean(e.drugLicenseNumber || e.hasDrugLicense)
  ).length;
  const franchiseLogisticsReady = enquiries.filter(
    e => isStockistLead(e) && Boolean(e.hasGodownFacility || e.hasTransportFacility)
  ).length;
  const franchiseNew = enquiries.filter(
    e => isStockistLead(e) && (e.status === 'NEW' || (e.status as any) === 'PENDING')
  ).length;

  const careerExperienced = enquiries.filter(
    e => isCareerLead(e) && Boolean(Number(e.totalExperienceYears) > 0)
  ).length;
  const careerFreshers = enquiries.filter(
    e => isCareerLead(e) && (!e.totalExperienceYears || Number(e.totalExperienceYears) === 0)
  ).length;
  const careerShortlisted = enquiries.filter(
    e => isCareerLead(e) && (e.status === 'QUALIFIED' || e.status === 'CONTACTED' || (e.status as any) === 'SHORTLISTED')
  ).length;

  return {
    total,
    franchiseTotal,
    productTotal,
    bulkTotal,
    careerTotal,
    newLeads,
    totalProducts,
    productNew,
    franchiseDlVerified,
    franchiseLogisticsReady,
    franchiseNew,
    careerExperienced,
    careerFreshers,
    careerShortlisted,
  };
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'NEW':
    case 'PENDING':
      return { label: 'New Lead', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' };
    case 'CONTACTED':
    case 'IN_PROGRESS':
    case 'IN_TOUCH':
      return { label: 'In Contact', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
    case 'QUALIFIED':
      return { label: 'Qualified', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' };
    case 'DOCUMENTS_PENDING':
      return { label: 'Docs Pending', bg: '#FFF7ED', color: '#C2410C', border: '#FFEDD5' };
    case 'QUOTED':
      return { label: 'Quotation Sent', bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' };
    case 'APPROVED':
    case 'CLOSED':
      return { label: 'Approved / Active', bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' };
    case 'REJECTED':
      return { label: 'Rejected', bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' };
    case 'ON_HOLD':
      return { label: 'On Hold', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' };
    default:
      return { label: status, bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' };
  }
};

export const getTypeBadge = (type: string, category?: string, enq?: IEnquiry) => {
  if (enq ? isCareerLead(enq) : (type === 'CAREER' || category === 'CAREER')) {
    return { label: 'Career Candidate', bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE' };
  }
  if (enq ? isStockistLead(enq) : (type === 'FRANCHISE' || category === 'FRANCHISE')) {
    return { label: 'Stockist Distribution', bg: '#F5F3FF', color: '#6828DC', border: '#DDD6FE' };
  }
  if (enq ? isBulkLead(enq) : (type === 'BULK_PRODUCT')) {
    return { label: 'Bulk Order', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
  }
  if (type === 'THIRD_PARTY') {
    return { label: '3rd Party Mfg', bg: '#FDF2F8', color: '#BE185D', border: '#FBCFE8' };
  }
  return { label: 'Single Product', bg: '#ECFDF5', color: '#059669', border: '#BBF7D0' };
};

export const exportEnquiriesCSV = (filtered: IEnquiry[], onNotify: (msg: string) => void) => {
  if (filtered.length === 0) {
    onNotify('No leads available to export');
    return;
  }

  const headers = [
    'Enquiry ID',
    'Date',
    'Type',
    'Applicant Name',
    'Company Name',
    'Phone',
    'Email',
    'City',
    'District/Territory',
    'State',
    'Drug License',
    'GST Number',
    'Investment Budget',
    'Pharma Experience',
    'Status',
    'Message',
  ];

  const rows = filtered.map(e => [
    `"${e._id}"`,
    `"${e.createdAt ? new Date(e.createdAt).toLocaleDateString('en-IN') : ''}"`,
    `"${e.enquiryType || e.enquiryCategory || 'GENERAL'}"`,
    `"${(e.name || e.fullName || '').replace(/"/g, '""')}"`,
    `"${(e.companyName || '').replace(/"/g, '""')}"`,
    `"${e.phone || ''}"`,
    `"${e.email || ''}"`,
    `"${(e.city || '').replace(/"/g, '""')}"`,
    `"${(e.district || e.territoryDistrict || '').replace(/"/g, '""')}"`,
    `"${(e.state || '').replace(/"/g, '""')}"`,
    `"${e.drugLicenseNumber || (e.hasDrugLicense ? 'Verified' : 'None')}"`,
    `"${e.gstNumber || ''}"`,
    `"${(e.investmentBudget || '').replace(/"/g, '""')}"`,
    `"${(e.pharmaExperience || e.experienceYears || '').replace(/"/g, '""')}"`,
    `"${e.status || 'NEW'}"`,
    `"${(e.message || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ZealPharma_Leads_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  onNotify(`Exported ${filtered.length} leads to CSV`);
};
