import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Download,
  ShieldCheck,
  FileText,
  DollarSign,
  Warehouse,
  Truck,
  Package,
  Pill,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  Plus,
  MessageSquare,
  UserCheck,
  Send,
} from 'lucide-react';
import { ThemeSelect } from '../common';
import { enquiryService } from '../../api/enquiryService';
import { getMediaUrl } from '../../utils/mediaUtils';
import type { IEnquiry, EnquiryStatus } from '../../types';

interface AdminEnquiryDetailModalProps {
  enquiry: IEnquiry | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: EnquiryStatus, note?: string) => Promise<void> | void;
  onAddNote: (id: string, note: string) => Promise<void>;
  onDelete?: (id: string, name: string) => Promise<void>;
}

export const AdminEnquiryDetailModal: React.FC<AdminEnquiryDetailModalProps> = ({
  enquiry,
  onClose,
  onStatusChange,
  onAddNote,
}) => {
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Email Composer Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!enquiry) return null;

  const leadName = enquiry.name || enquiry.fullName || 'Prospective Client';
  const isBulk =
    enquiry.enquiryType === 'BULK_PRODUCT' ||
    (Array.isArray(enquiry.products) && enquiry.products.length > 0);
  const isSingle =
    enquiry.enquiryType === 'SINGLE_PRODUCT' ||
    (Boolean(enquiry.product) && !isBulk);
  const isCareer =
    enquiry.enquiryType === 'CAREER' ||
    enquiry.enquiryCategory === 'CAREER' ||
    Boolean(enquiry.positionAppliedFor);
  const isStockist =
    !isCareer &&
    !isSingle &&
    !isBulk &&
    (enquiry.enquiryType === 'FRANCHISE' ||
      enquiry.enquiryCategory === 'FRANCHISE' ||
      Boolean(enquiry.territoryDistrict || enquiry.investmentBudget || enquiry.drugLicenseNumber));

  // Resolved single product
  const singleProd =
    typeof enquiry.product === 'object' && enquiry.product !== null
      ? enquiry.product
      : null;
  const singleProdName =
    singleProd?.name || (typeof enquiry.product === 'string' ? enquiry.product : 'Pharmaceutical Formulation');

  // Resolved bulk products
  const bulkItems = Array.isArray(enquiry.products) ? enquiry.products : [];
  const totalBulkUnits = bulkItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

  // Status badge colors
  const getStatusMeta = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'PENDING':
        return { label: 'New Lead', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' };
      case 'CONTACTED':
      case 'IN_PROGRESS':
      case 'IN_TOUCH':
      case 'REVIEWING':
        return { label: 'In Contact / Reviewing', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
      case 'QUALIFIED':
      case 'SHORTLISTED':
        return { label: 'Qualified / Shortlisted', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' };
      case 'DOCUMENTS_PENDING':
        return { label: 'Docs Pending', bg: '#FFF7ED', color: '#C2410C', border: '#FFEDD5' };
      case 'QUOTED':
        return { label: 'Quoted', bg: '#F5F3FF', color: '#6828DC', border: '#DDD6FE' };
      case 'APPROVED':
      case 'CLOSED':
      case 'HIRED':
        return { label: 'Approved / Closed', bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' };
      case 'REJECTED':
        return { label: 'Rejected', bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' };
      case 'ON_HOLD':
        return { label: 'On Hold', bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' };
      default:
        return { label: status, bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' };
    }
  };

  const getTypeMeta = () => {
    if (isCareer) {
      return { label: 'Career Candidate Application', bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE', icon: <Briefcase size={14} /> };
    }
    if (isBulk) {
      return { label: 'Bulk Formulation Order', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE', icon: <Package size={14} /> };
    }
    if (isSingle) {
      return { label: 'Single Product Inquiry', bg: '#ECFDF5', color: '#059669', border: '#A7F3D0', icon: <Pill size={14} /> };
    }
    return { label: 'Stockist Distribution Network', bg: '#F5F3FF', color: '#6828DC', border: '#DDD6FE', icon: <Building2 size={14} /> };
  };

  const statusMeta = getStatusMeta(enquiry.status || 'NEW');
  const typeMeta = getTypeMeta();

  // Smart Contextual WhatsApp greeting builder (Humble, respectful, dynamic)
  const getWhatsAppUrl = () => {
    const rawPhone = (enquiry.phone || enquiry.whatsappNumber || '').replace(/[^0-9]/g, '');

    if (isSingle) {
      const qtyText = enquiry.quantity ? `\n• Quantity: ${enquiry.quantity} ${enquiry.quantityUnit || 'Boxes'}` : '';
      let mrpLine = '';
      if (typeof enquiry.product === 'object' && enquiry.product && (enquiry.product as any).mrp) {
        const num = Number((enquiry.product as any).mrp);
        mrpLine = `\n• Single Unit MRP: Rs. ${isNaN(num) ? (enquiry.product as any).mrp : num.toLocaleString('en-IN')} / Pack`;
      }
      const text = `Dear ${leadName} Ji,\n\nGreetings from Zeal Pharmacure Pvt. Ltd.!\n\nThank you very much for your enquiry regarding *${singleProdName}*. We truly appreciate your interest in our formulations.\n\n*Enquiry Details:*${mrpLine}${qtyText}\n\nOur institutional sales team has reviewed your requirement and prepared our net distributor rates. May we take a brief moment of your time to share the commercial details?\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nWarm regards,\nSales Desk | Zeal Pharmacure\nHelpline: +91 93162 27576`;
      return `https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`;
    } else if (isBulk) {
      const prodPreview = bulkItems
        .slice(0, 3)
        .map(i => (typeof i.product === 'object' && i.product?.name ? i.product.name : 'Formulation'))
        .join(', ');
      const text = `Dear ${leadName} Ji,\n\nGreetings from Zeal Pharmacure Pvt. Ltd.!\n\nThank you very much for submitting your Bulk Requirement Batch for *${bulkItems.length} formulations* (${prodPreview}${bulkItems.length > 3 ? '...' : ''}). We truly appreciate your trust in our brand.\n\nOur commercial sales desk has prepared the institutional wholesale quotation with net rates and freight estimates. Could you please confirm your expected delivery schedule?\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nWarm regards,\nInstitutional Sales Desk | Zeal Pharmacure\nHelpline: +91 93162 27576`;
      return `https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`;
    } else if (isCareer) {
      const role = enquiry.positionAppliedFor || 'the advertised position';
      const text = `Dear ${leadName},\n\nGreetings from the HR Department at Zeal Pharmacure Pvt. Ltd.!\n\nThank you very much for your interest in building your career with us for the position of *${role}*.\n\nWe have reviewed your candidate profile and would like to invite you for an interview round. Could you please confirm your availability this week?\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nWarm regards,\nTalent Acquisition Team | Zeal Pharmacure\ncareers@zealpharma.com`;
      return `https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`;
    } else {
      const territory = enquiry.territoryDistrict || enquiry.preferredTerritory || enquiry.city || 'your territory';
      const text = `Dear ${leadName} Ji,\n\nGreetings from Zeal Pharmacure Pvt. Ltd.!\n\nThank you very much for your application for our *Stockists Distribution Network* in *${territory}*. We sincerely appreciate your interest in partnering with our company.\n\nOur market expansion desk has reviewed your file and is pleased to share our product catalog, monopoly division details, and distribution rate charts. Are you available for a brief phone consultation today?\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nWarm regards,\nStockists Network Desk | Zeal Pharmacure\nHelpline: +91 93162 27576`;
      return `https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`;
    }
  };

  const getResumeUrl = (url?: string) => {
    return getMediaUrl(url);
  };

  const handleStatusSubmit = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as EnquiryStatus;
    setUpdatingStatus(true);
    try {
      await onStatusChange(enquiry._id, newStatus);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSubmittingNote(true);
    try {
      await onAddNote(enquiry._id, newNote.trim());
      setNewNote('');
    } finally {
      setSubmittingNote(false);
    }
  };

  const openEmailComposer = (presetKey: string = 'quotation') => {
    setShowEmailModal(true);
    setEmailStatusMsg(null);
    if (presetKey === 'quotation') {
      setEmailSubject(`Commercial Price Quotation - Zeal Pharmaceuticals`);
      setEmailBody(`Dear ${leadName},\n\nThank you for reaching out to Zeal Pharmaceuticals regarding ${isSingle ? singleProdName : (isBulk ? `${bulkItems.length} formulations` : 'Stockists Distribution')}.\n\nWe have prepared our wholesale net distributor rate proposal. Attached/below are the commercial terms and minimum supply schedule.\n\nPlease let us know if you require product samples or our Visual Aid booklet.\n\nWarm regards,\nZeal Pharma Sales Management\nHelpline: +91 9316227576 | info@zealpharma.com`);
    } else if (presetKey === 'docs') {
      setEmailSubject(`Document Verification Required - Zeal Pharmaceuticals`);
      setEmailBody(`Dear ${leadName},\n\nWe have received your B2B inquiry. To process your distributor registration and dispatch commercial Visual Aids, please share a scanned copy of your:\n\n1. Valid Wholesale Drug License (Form 20B/21B)\n2. GST Registration Certificate\n3. Transport/Consignment delivery preferences\n\nYou can reply directly to this email.\n\nBest regards,\nZeal Pharma Compliance Desk`);
    } else {
      setEmailSubject(`Stockists Distribution Network Discussion - Zeal Pharmaceuticals`);
      setEmailBody(`Dear ${leadName},\n\nThank you for your interest in partnering with Zeal Pharmaceuticals for our Stockists Distribution Network.\n\nWe would like to schedule a 10-minute briefing to discuss exclusive territory allocation, profit margins, and promotional support in your district.\n\nPlease let us know your preferred time for a phone discussion this week.\n\nWarm regards,\nDirector - Distribution Alliances\nZeal Pharmaceuticals Pvt. Ltd.`);
    }
  };

  const handleSendEmailReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailBody.trim()) return;
    setSendingEmail(true);
    setEmailStatusMsg(null);
    try {
      const res = await enquiryService.adminReplyEnquiryEmail(enquiry._id, emailBody.trim(), emailSubject.trim() || undefined);
      setEmailStatusMsg({ type: 'success', text: res.message || 'Email successfully delivered to client!' });
      await onAddNote(enquiry._id, `✉️ Sent email reply: "${emailBody.trim().slice(0, 100)}..."`);
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailStatusMsg(null);
      }, 1800);
    } catch (err: any) {
      setEmailStatusMsg({ type: 'error', text: err?.message || 'Failed to send email. Check SMTP settings.' });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '860px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          border: '1.5px solid #E2E8F0',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: '24px 28px 18px',
            borderBottom: '1.5px solid #F1F5F9',
            background: '#FAF5FF',
            borderRadius: '20px 20px 0 0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: typeMeta.bg,
                  color: typeMeta.color,
                  border: `1.2px solid ${typeMeta.border}`,
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {typeMeta.icon}
                <span>{typeMeta.label}</span>
              </span>

              <span
                style={{
                  background: statusMeta.bg,
                  color: statusMeta.color,
                  border: `1.2px solid ${statusMeta.border}`,
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {statusMeta.label}
              </span>

              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                ID: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{enquiry._id}</span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#6828DC',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(104, 40, 220, 0.25)',
                  flexShrink: 0,
                }}
              >
                {leadName.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {leadName}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B', marginTop: '2px', flexWrap: 'wrap' }}>
                  {enquiry.companyName && (
                    <span style={{ fontWeight: 600, color: '#6828DC', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={13} /> {enquiry.companyName}
                    </span>
                  )}
                  {isCareer && enquiry.currentCompany && (
                    <span style={{ fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Briefcase size={13} /> Current: {enquiry.currentCompany} ({enquiry.currentDesignation || 'Candidate'})
                    </span>
                  )}
                  <span>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Contact & Location Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '12px',
            }}
          >
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={13} style={{ color: '#6828DC' }} /> Phone / WhatsApp
              </span>
              <p style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                <a href={`tel:${enquiry.phone || enquiry.whatsappNumber}`} style={{ color: '#0F172A', textDecoration: 'none' }}>
                  {enquiry.phone || enquiry.whatsappNumber || 'N/A'}
                </a>
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={13} style={{ color: '#2563EB' }} /> Email Address
              </span>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#2563EB', marginTop: '4px', margin: 0, wordBreak: 'break-all' }}>
                <a href={`mailto:${enquiry.email}`} style={{ color: '#2563EB', textDecoration: 'none' }}>
                  {enquiry.email || 'N/A'}
                </a>
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={13} style={{ color: '#059669' }} /> Territory / Location
              </span>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                {enquiry.city ? `${enquiry.city}` : enquiry.district || enquiry.territoryDistrict || 'Location'}
                {enquiry.state ? `, ${enquiry.state}` : ''}
                {enquiry.pincode ? ` (${enquiry.pincode})` : ''}
              </p>
            </div>
          </div>

          {/* DYNAMIC BLOCK 1: SINGLE PRODUCT FORMULATION DOSSIER */}
          {isSingle && (
            <div
              style={{
                background: '#F0FDF4',
                border: '1.5px solid #BBF7D0',
                borderRadius: '16px',
                padding: '20px 22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Pill size={18} style={{ color: '#059669' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#065F46', margin: 0 }}>
                    Inquired Formulation Details
                  </h3>
                </div>
                <span className="badge badge-green" style={{ fontSize: '11.5px' }}>
                  Single Product Inquiry
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  border: '1.2px solid #DCFCE7',
                  flexWrap: 'wrap',
                }}
              >
                {/* Product Image / Icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: '#F5F3FF',
                    border: '1.5px solid #EDE9FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {singleProd?.featuredImage ? (
                    <img
                      src={singleProd.featuredImage}
                      alt={singleProdName}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                    />
                  ) : (
                    <Pill size={30} style={{ color: '#6828DC' }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {singleProdName}
                  </h4>
                  {singleProd?.genericName && (
                    <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 8px 0', fontStyle: 'italic' }}>
                      Composition: {singleProd.genericName}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {singleProd?.dosageForm && (
                      <span style={{ background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700 }}>
                        {singleProd.dosageForm}
                      </span>
                    )}
                    {singleProd?.packaging && (
                      <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700 }}>
                        Pack: {singleProd.packaging}
                      </span>
                    )}
                    {singleProd?.category?.name && (
                      <span style={{ background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600 }}>
                        {singleProd.category.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Requested Quantity Stage */}
                <div
                  style={{
                    background: '#FAF5FF',
                    border: '1.5px solid #DDD6FE',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    textAlign: 'center',
                    minWidth: '160px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#6828DC', fontWeight: 700, textTransform: 'uppercase' }}>
                    Requested Quantity
                  </span>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>
                    {enquiry.quantity ? `${enquiry.quantity} ${enquiry.quantityUnit || 'Units'}` : 'Institutional Quote'}
                  </div>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                    Direct Wholesale Supply
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC BLOCK 2: BULK FORMULATION BATCH BREAKDOWN */}
          {isBulk && (
            <div
              style={{
                background: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '16px',
                padding: '20px 22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} style={{ color: '#2563EB' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1E40AF', margin: 0 }}>
                    Bulk Formulation Batch Breakdown ({bulkItems.length} Products)
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ background: '#FFFFFF', color: '#2563EB', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: '1px solid #BFDBFE' }}>
                    Total Items: {bulkItems.length}
                  </span>
                  {totalBulkUnits > 0 && (
                    <span style={{ background: '#2563EB', color: '#FFFFFF', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                      Sum Units: {totalBulkUnits}
                    </span>
                  )}
                </div>
              </div>

              {/* Itemized Table */}
              <div style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #DBEAFE' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '12px' }}>
                      <th style={{ padding: '10px 14px', width: '40px' }}>#</th>
                      <th style={{ padding: '10px 14px' }}>Formulation Name &amp; Generic Composition</th>
                      <th style={{ padding: '10px 14px', width: '110px' }}>Dosage Form</th>
                      <th style={{ padding: '10px 14px', width: '130px' }}>Packaging</th>
                      <th style={{ padding: '10px 14px', width: '130px', textAlign: 'right' }}>Requested Qty</th>
                      <th style={{ padding: '10px 14px' }}>Line Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkItems.map((item, idx) => {
                      const itemProd = typeof item.product === 'object' && item.product !== null ? item.product : null;
                      const itemName = itemProd?.name || (typeof item.product === 'string' ? item.product : 'Formulation');
                      const itemGeneric = itemProd?.genericName;
                      const itemPackaging = itemProd?.packaging;
                      const itemDosage = itemProd?.dosageForm;

                      return (
                        <tr key={item._id || idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#94A3B8' }}>{idx + 1}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>{itemName}</div>
                            {itemGeneric && (
                              <div style={{ fontSize: '11.5px', color: '#64748B', fontStyle: 'italic', marginTop: '2px' }}>
                                {itemGeneric}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700 }}>
                              {itemDosage || 'Dosage'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#475569', fontWeight: 600 }}>
                            {itemPackaging || 'Standard'}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <span style={{ fontWeight: 800, color: '#059669', fontSize: '13.5px' }}>
                              {item.quantity ? `${item.quantity} ${item.quantityUnit || 'Boxes'}` : 'Quote'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#64748B', fontSize: '12px' }}>
                            {item.message || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DYNAMIC BLOCK 3: STOCKIST DISTRIBUTION COMMERCIAL DOSSIER */}
          {isStockist && (
            <div
              style={{
                background: '#FAF5FF',
                border: '1.5px solid #DDD6FE',
                borderRadius: '16px',
                padding: '20px 22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Building2 size={18} style={{ color: '#6828DC' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#5B21B6', margin: 0 }}>
                  Stockist Distribution Commercial Dossier
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >
                {/* Territory */}
                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EDE9FE' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={13} style={{ color: '#6828DC' }} /> Target Territory / District
                  </span>
                  <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                    {enquiry.territoryDistrict || enquiry.preferredTerritory || enquiry.district || enquiry.city || 'Statewide Allotment'}
                  </p>
                </div>

                {/* Investment Budget */}
                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EDE9FE' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <DollarSign size={13} style={{ color: '#059669' }} /> Investment Capital Tier
                  </span>
                  <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#059669', marginTop: '4px', margin: 0 }}>
                    {enquiry.investmentBudget || '₹2 Lakhs - ₹5 Lakhs'}
                  </p>
                </div>

                {/* Drug License 20B/21B */}
                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EDE9FE' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={13} style={{ color: enquiry.drugLicenseNumber ? '#059669' : '#D97706' }} /> Drug License (20B/21B)
                  </span>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: enquiry.drugLicenseNumber ? '#059669' : '#D97706',
                      marginTop: '4px',
                      margin: 0,
                    }}
                  >
                    {enquiry.drugLicenseNumber
                      ? `Verified (${enquiry.drugLicenseNumber})`
                      : enquiry.hasDrugLicense
                      ? 'Registered / Yes'
                      : 'Pending Documentation'}
                  </p>
                </div>

                {/* GST Identification */}
                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EDE9FE' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileText size={13} style={{ color: '#2563EB' }} /> GST Identification Number
                  </span>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                    {enquiry.gstNumber || 'Not Provided'}
                  </p>
                </div>

                {/* Pharma Experience */}
                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EDE9FE' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} style={{ color: '#6828DC' }} /> Distribution Experience
                  </span>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                    {enquiry.pharmaExperience || enquiry.experienceYears || 'Established Pharma Distributor'}
                  </p>
                </div>

                {/* Warehousing & Transport */}
                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EDE9FE' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Warehouse size={13} style={{ color: '#475569' }} /> Logistics Facilities
                  </span>
                  <p style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                    Godown: {enquiry.hasGodownFacility ? 'Yes' : 'No'} | Fleet: {enquiry.hasTransportFacility ? 'Yes' : 'No'}
                  </p>
                </div>

                {/* Business Entity Structure */}
                {enquiry.businessType && (
                  <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EDE9FE' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Building2 size={13} style={{ color: '#6828DC' }} /> Entity Structure
                    </span>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                      {enquiry.businessType.replace(/_/g, ' ')}
                    </p>
                  </div>
                )}

                {/* Current Business / Occupation */}
                {enquiry.currentBusiness && (
                  <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #EDE9FE' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Briefcase size={13} style={{ color: '#2563EB' }} /> Current Business
                    </span>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                      {enquiry.currentBusiness}
                    </p>
                  </div>
                )}
              </div>

              {/* Interested Divisions */}
              {enquiry.interestedDivisions && enquiry.interestedDivisions.length > 0 && (
                <div style={{ marginTop: '12px', background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EDE9FE' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 700 }}>Interested Product Divisions:</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {enquiry.interestedDivisions.map((div, i) => (
                      <span key={i} style={{ background: '#EDE9FE', color: '#6828DC', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700 }}>
                        {div}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC BLOCK 4: CAREER CANDIDATE ATS DOSSIER */}
          {isCareer && (
            <div
              style={{
                background: '#EEF2FF',
                border: '1.5px solid #C7D2FE',
                borderRadius: '16px',
                padding: '20px 22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={18} style={{ color: '#4F46E5' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#3730A3', margin: 0 }}>
                    Candidate Profile &amp; ATS Details
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ background: '#EDE9FE', color: '#6828DC', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                    {enquiry.positionAppliedFor || 'Pharmaceutical Role'}
                  </span>
                  {enquiry.department && (
                    <span style={{ background: '#FFFFFF', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: '1px solid #CBD5E1' }}>
                      {enquiry.department}
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E0E7FF' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} style={{ color: '#4F46E5' }} /> Total Experience
                  </span>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                    {enquiry.totalExperienceYears ? `${enquiry.totalExperienceYears} Years` : 'Fresher'}
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E0E7FF' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <GraduationCap size={13} style={{ color: '#2563EB' }} /> Qualification
                  </span>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                    {enquiry.qualification || 'Pharmacy Graduate'}
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E0E7FF' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <DollarSign size={13} style={{ color: '#059669' }} /> Current / Expected CTC
                  </span>
                  <p style={{ fontSize: '13px', fontWeight: 800, color: '#059669', marginTop: '4px', margin: 0 }}>
                    {enquiry.currentCtc || 'Current: N/A'} → {enquiry.expectedCtc || 'Negotiable'}
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E0E7FF' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={13} style={{ color: '#D97706' }} /> Notice Period
                  </span>
                  <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '4px', margin: 0 }}>
                    {enquiry.noticePeriod || 'Immediate / 30 Days'}
                  </p>
                </div>
              </div>

              {/* Skills Tags */}
              {enquiry.skills && enquiry.skills.length > 0 && (
                <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E0E7FF', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 700 }}>Key Competencies &amp; Skills:</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {enquiry.skills.map((sk, i) => (
                      <span key={i} style={{ background: '#E0E7FF', color: '#3730A3', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700 }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume Download Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E0E7FF', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} style={{ color: '#4F46E5' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Candidate Curriculum Vitae (Resume PDF)</span>
                </div>

                {enquiry.resumeUrl ? (
                  <a
                    href={getResumeUrl(enquiry.resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      background: '#4F46E5',
                      borderColor: '#4F46E5',
                      padding: '7px 14px',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Download size={14} />
                    <span>Download / View Resume</span>
                  </a>
                ) : (
                  <span style={{ fontSize: '12.5px', color: '#94A3B8', fontStyle: 'italic' }}>
                    No resume document uploaded
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Customer / Candidate Message */}
          {enquiry.message && (
            <div
              style={{
                background: '#F8FAFC',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1.5px solid #E2E8F0',
              }}
            >
              <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={14} style={{ color: '#6828DC' }} />
                <span>Inquiry Note / Candidate Statement:</span>
              </h4>
              <p style={{ fontSize: '13.5px', color: '#1E293B', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                &ldquo;{enquiry.message}&rdquo;
              </p>
            </div>
          )}

          {/* Lead Pipeline Status Changer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1.5px solid #E2E8F0',
              background: '#FFFFFF',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>Update Pipeline Status</span>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                Current Lead Stage in Sales &amp; Recruitment Pipeline
              </p>
            </div>

            <div style={{ width: '220px' }}>
              <ThemeSelect
                value={enquiry.status || 'NEW'}
                disabled={updatingStatus}
                onChange={handleStatusSubmit}
                options={[
                  { value: 'NEW', label: 'New Lead / Candidate' },
                  { value: 'CONTACTED', label: 'In Contact / Reviewing' },
                  { value: 'QUALIFIED', label: 'Qualified / Shortlisted' },
                  { value: 'DOCUMENTS_PENDING', label: 'Documents Pending' },
                  { value: 'QUOTED', label: 'Quotation Sent' },
                  { value: 'APPROVED', label: 'Approved / Hired' },
                  { value: 'REJECTED', label: 'Rejected' },
                  { value: 'ON_HOLD', label: 'On Hold' },
                  { value: 'CLOSED', label: 'Closed' },
                ]}
              />
            </div>
          </div>

          {/* Internal CRM Follow-up Notes Timeline */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} style={{ color: '#6828DC' }} />
              <span>Internal CRM Notes ({enquiry.internalNotes?.length || 0})</span>
            </h3>

            {/* Notes List */}
            <div
              style={{
                maxHeight: '160px',
                overflowY: 'auto',
                background: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '12px',
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {enquiry.internalNotes && enquiry.internalNotes.length > 0 ? (
                enquiry.internalNotes.map((n, i) => {
                  const author = typeof n.addedBy === 'object' && n.addedBy?.name ? n.addedBy.name : 'Sales Admin';
                  return (
                    <div key={n._id || i} style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748B', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#6828DC' }}>{author}</span>
                        <span>{n.addedAt ? new Date(n.addedAt).toLocaleString('en-IN') : ''}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#1E293B', margin: 0 }}>{n.note}</p>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '16px', color: '#94A3B8', fontSize: '12.5px' }}>
                  No internal notes logged yet. Log calls, commercial terms, or meeting minutes below.
                </div>
              )}
            </div>

            {/* Add Note Input */}
            <form onSubmit={handleNoteSubmit} noValidate style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Log internal note (e.g. 'Customer confirmed order of 500 boxes. Sent net price list')..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={submittingNote || !newNote.trim()}
                className="btn btn-secondary"
                style={{ borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={15} />
                <span>{submittingNote ? 'Saving...' : 'Add Note'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer Action Bar */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1.5px solid #F1F5F9',
            background: '#F8FAFC',
            borderRadius: '0 0 20px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* WhatsApp Deep-Link 1-Click Button */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{
                borderRadius: '10px',
                padding: '9px 16px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                background: '#059669',
                borderColor: '#059669',
                color: '#FFFFFF',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)',
              }}
              title="Open WhatsApp Web or app with pre-filled greeting"
            >
              <MessageSquare size={14} />
              <span>WhatsApp Reply</span>
            </a>

            {/* Direct In-Portal Email Reply */}
            <button
              type="button"
              onClick={() => openEmailComposer('quotation')}
              className="btn btn-primary"
              style={{
                borderRadius: '10px',
                padding: '9px 16px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#2563EB',
                borderColor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
              }}
              title="Compose and send official email response via Gmail SMTP"
            >
              <Send size={14} />
              <span>Reply by Email</span>
            </button>

            <a
              href={`tel:${enquiry.phone || enquiry.whatsappNumber}`}
              className="btn btn-secondary"
              style={{
                borderRadius: '10px',
                padding: '9px 14px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                color: '#334155',
              }}
            >
              <Phone size={14} style={{ color: '#6828DC' }} />
              <span>Call Lead</span>
            </a>

            <a
              href={`mailto:${enquiry.email}`}
              className="btn btn-secondary"
              style={{
                borderRadius: '10px',
                padding: '9px 14px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                color: '#334155',
              }}
              title="Open default email application"
            >
              <Mail size={14} style={{ color: '#64748B' }} />
              <span>Client App</span>
            </a>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ borderRadius: '10px', padding: '9px 20px', fontSize: '13.5px' }}
            >
              Close
            </button>
          </div>
        </div>

        {/* IN-PORTAL EMAIL COMPOSER MODAL */}
        {showEmailModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001,
              padding: '16px',
            }}
            onClick={() => setShowEmailModal(false)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                maxWidth: '620px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1.5px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F8FAFC',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={18} style={{ color: '#2563EB' }} />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                    Send Email Reply to {leadName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Template Selector */}
              <div style={{ padding: '12px 20px', background: '#FAF5FF', borderBottom: '1px solid #EDE9FE', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#6828DC' }}>⚡ Quick Templates:</span>
                <button
                  type="button"
                  onClick={() => openEmailComposer('quotation')}
                  style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #DDD6FE', background: '#FFFFFF', color: '#6828DC', cursor: 'pointer', fontWeight: 600 }}
                >
                  Price Quotation
                </button>
                <button
                  type="button"
                  onClick={() => openEmailComposer('docs')}
                  style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #DDD6FE', background: '#FFFFFF', color: '#6828DC', cursor: 'pointer', fontWeight: 600 }}
                >
                  Request DL / GST
                </button>
                <button
                  type="button"
                  onClick={() => openEmailComposer('franchise')}
                  style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: '6px', border: '1px solid #DDD6FE', background: '#FFFFFF', color: '#6828DC', cursor: 'pointer', fontWeight: 600 }}
                >
                  Stockist Discussion
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSendEmailReply} noValidate style={{ padding: '20px' }}>
                {emailStatusMsg && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      marginBottom: '14px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: emailStatusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                      color: emailStatusMsg.type === 'success' ? '#047857' : '#B91C1C',
                      border: `1px solid ${emailStatusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
                    }}
                  >
                    {emailStatusMsg.text}
                  </div>
                )}

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    To (Recipient Email)
                  </label>
                  <input
                    type="text"
                    value={enquiry.email || ''}
                    disabled
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '13px', color: '#64748B' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Commercial Price Quotation - Zeal Pharmaceuticals"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Message Content
                  </label>
                  <textarea
                    rows={8}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Type your official response..."
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', lineHeight: 1.5, color: '#0F172A', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    disabled={sendingEmail}
                    className="btn btn-secondary"
                    style={{ borderRadius: '8px', padding: '9px 18px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail || !emailBody.trim()}
                    className="btn btn-primary"
                    style={{ borderRadius: '8px', padding: '9px 22px', fontSize: '13px', fontWeight: 700, background: '#2563EB', borderColor: '#2563EB', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={14} />
                    <span>{sendingEmail ? 'Delivering...' : 'Send Email Now'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
