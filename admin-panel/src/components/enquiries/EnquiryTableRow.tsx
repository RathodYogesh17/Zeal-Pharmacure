import React from 'react';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Eye,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { ThemeSelect, CombinedDateCell, CombinedUserCell } from '../common';
import type { IEnquiry, EnquiryStatus } from '../../types';
import {
  isCareerLead,
  isStockistLead,
  isBulkLead,
  isSingleProductLead,
  getStatusBadge,
  getTypeBadge,
} from './enquiryUtils';

export interface EnquiryTableRowProps {
  enquiry: IEnquiry;
  rowNumber: number;
  updatingId: string | null;
  onStatusChange: (id: string, newStatus: EnquiryStatus) => void;
  onView: (enquiry: IEnquiry) => void;
  onWhatsApp: (enquiry: IEnquiry) => void;
  onDelete: (id: string, name: string) => void;
}

export const EnquiryTableRow: React.FC<EnquiryTableRowProps> = ({
  enquiry: enq,
  rowNumber,
  updatingId,
  onStatusChange,
  onView,
  onWhatsApp,
  onDelete,
}) => {
  const statusMeta = getStatusBadge(enq.status);
  const isRowCareer = isCareerLead(enq);
  const isRowBulk = isBulkLead(enq);
  const isRowSingle = isSingleProductLead(enq);
  const typeMeta = getTypeBadge(enq.enquiryType, enq.enquiryCategory, enq);
  const leadName = enq.name || enq.fullName || 'Prospective Partner';

  const singleProdName =
    typeof enq.product === 'object' && enq.product?.name
      ? enq.product.name
      : typeof enq.product === 'string'
      ? enq.product
      : 'Formulation';

  return (
    <tr
      style={{
        height: '62px',
        borderBottom: '1px solid #F1F5F9',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
    >
      {/* # Index */}
      <td style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: '#94A3B8', verticalAlign: 'middle' }}>
        {rowNumber}
      </td>

      {/* Applicant Profile with Avatar */}
      <td style={{ padding: '8px 14px', verticalAlign: 'middle' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: isRowCareer ? '#EEF2FF' : '#EDE9FE',
              color: isRowCareer ? '#4F46E5' : '#6828DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '13px',
              flexShrink: 0,
            }}
          >
            {leadName.charAt(0).toUpperCase()}
          </div>
          <div style={{ maxWidth: '160px', overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px', lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {leadName}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <MapPin size={11} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.city ? `${enq.city}, ${enq.state || 'India'}` : enq.state || 'India'}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Company & Entity */}
      <td style={{ padding: '8px 14px', verticalAlign: 'middle' }}>
        <div style={{ maxWidth: '160px', overflow: 'hidden' }}>
          {isRowCareer ? (
            <>
              <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '12.5px', lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.currentCompany || 'Candidate Profile'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.currentDesignation || 'Applicant'}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '12.5px', lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.companyName || 'Sole Proprietor / Individual'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'capitalize', lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.businessType ? enq.businessType.replace(/_/g, ' ') : 'Commercial Account'}
              </div>
            </>
          )}
        </div>
      </td>

      {/* Type Badge */}
      <td style={{ padding: '8px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
        <span
          style={{
            background: typeMeta.bg,
            color: typeMeta.color,
            border: `1px solid ${typeMeta.border}`,
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}
        >
          {typeMeta.label}
        </span>
      </td>

      {/* Target Product or Territory */}
      <td style={{ padding: '8px 14px', verticalAlign: 'middle' }}>
        <div style={{ maxWidth: '180px', overflow: 'hidden' }}>
          {isRowSingle ? (
            <>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {singleProdName}
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {typeof enq.product === 'object' && enq.product?.dosageForm && (
                  <span style={{ background: '#EDE9FE', color: '#6828DC', fontSize: '10px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>
                    {enq.product.dosageForm}
                  </span>
                )}
                {enq.quantity ? (
                  <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '10px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', flexShrink: 0 }}>
                    Qty: {enq.quantity} {enq.quantityUnit || 'units'}
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Quote requested</span>
                )}
              </div>
            </>
          ) : isRowBulk ? (
            <>
              <div style={{ lineHeight: '18px' }}>
                <span style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', padding: '1px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, display: 'inline-block' }}>
                  📦 Bulk Batch ({enq.products?.length || 0} Items)
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {(enq.products || []).slice(0, 2).map((p) => (typeof p.product === 'object' && p.product?.name ? p.product.name : 'Formulation')).join(', ')}...
              </div>
            </>
          ) : isRowCareer ? (
            <>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#4F46E5', lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                💼 {enq.positionAppliedFor || 'Career Opening'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.department || 'Operations'} · {enq.totalExperienceYears ? `${enq.totalExperienceYears} Yrs` : 'Fresher'}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.territoryDistrict || enq.preferredTerritory || enq.city || 'Statewide Allotment'}
              </div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Budget: {enq.investmentBudget || 'Open discussion'}
              </div>
            </>
          )}
        </div>
      </td>

      {/* Drug License / GST or Candidate Profile */}
      <td style={{ padding: '8px 14px', verticalAlign: 'middle' }}>
        <div style={{ maxWidth: '160px', overflow: 'hidden' }}>
          {isRowCareer ? (
            <>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.qualification || 'Pharmacy Graduate'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Notice: {enq.noticePeriod || 'Immediate'}
              </div>
            </>
          ) : (
            <>
              <div style={{ lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.drugLicenseNumber ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#065F46', fontWeight: 600 }}>
                    <ShieldCheck size={13} style={{ color: '#10B981', flexShrink: 0 }} />
                    <span>DL: {enq.drugLicenseNumber}</span>
                  </span>
                ) : enq.hasDrugLicense ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#065F46' }}>
                    <CheckCircle2 size={13} style={{ color: '#10B981', flexShrink: 0 }} />
                    <span>DL Registered</span>
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>DL Not Provided</span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {enq.gstNumber ? `GST: ${enq.gstNumber}` : 'GST: Pending / NA'}
              </div>
            </>
          )}
        </div>
      </td>

      {/* Created / Updated Date */}
      <td style={{ padding: '8px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
        <CombinedDateCell createdAt={enq.createdAt} updatedAt={enq.updatedAt} />
      </td>

      {/* Created / Handled By */}
      <td style={{ padding: '8px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
        <CombinedUserCell
          createdBy={enq.name || enq.fullName || 'Lead Submission'}
          updatedBy={
            enq.handledBy ||
            (enq.statusHistory && enq.statusHistory.length > 0
              ? enq.statusHistory[enq.statusHistory.length - 1].changedBy
              : null)
          }
          createdFallback={isRowCareer ? 'ATS Candidate' : 'Web Lead'}
          updatedFallback="Awaiting Action"
        />
      </td>

      {/* Pipeline Status Selector */}
      <td style={{ padding: '8px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
        <ThemeSelect
          value={enq.status || 'NEW'}
          disabled={updatingId === enq._id}
          onChange={(e) => onStatusChange(enq._id, e.target.value as EnquiryStatus)}
          containerStyle={{ minWidth: '135px' }}
          buttonStyle={{
            background: statusMeta.bg,
            color: statusMeta.color,
            border: `1.5px solid ${statusMeta.border}`,
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: 700,
          }}
        >
          <option value="NEW">New Lead</option>
          <option value="CONTACTED">In Contact</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="DOCUMENTS_PENDING">Docs Pending</option>
          <option value="QUOTED">Quoted</option>
          <option value="APPROVED">Approved / Hired</option>
          <option value="REJECTED">Rejected</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="CLOSED">Closed</option>
        </ThemeSelect>
      </td>

      {/* Actions */}
      <td style={{ padding: '8px 14px', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {/* View Dossier Modal */}
          <button
            type="button"
            title="View Lead Dossier & Notes"
            onClick={() => onView(enq)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              border: '1.5px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Eye size={14} />
          </button>

          {/* Advanced WhatsApp Direct Chat Hub */}
          <button
            type="button"
            onClick={() => onWhatsApp(enq)}
            title="Open Advanced WhatsApp Hub"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              border: '1.5px solid #A7F3D0',
              background: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <MessageSquare size={14} />
          </button>

          {/* Delete Lead */}
          <button
            type="button"
            title="Delete Lead"
            onClick={() => onDelete(enq._id, leadName)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1.5px solid #FECACA',
              background: '#FEF2F2',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};
