import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import type { IDashboardStats } from '../../api/dashboardService';

export interface DashboardRecentEnquiriesProps {
  stats: IDashboardStats;
  canSeeEnquiries: boolean;
}

export const DashboardRecentEnquiries: React.FC<DashboardRecentEnquiriesProps> = ({
  stats,
  canSeeEnquiries,
}) => {
  if (!canSeeEnquiries || !stats.recentEnquiries || stats.recentEnquiries.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E2E8F0',
        padding: '24px 28px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Recent Customer & Stockist Inquiries
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Direct one-click WhatsApp communication & rapid lead follow-up console
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Link
            to="/admin/stockist-enquiries"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#475569',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '6px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Stockist Enquiries</span>
          </Link>
          <Link
            to="/admin/product-enquiries"
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#475569',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '6px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Product Enquiries</span>
          </Link>
          <Link
            to="/admin/enquiries"
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#6828DC',
              background: '#F5F3FF',
              border: '1px solid #DDD6FE',
              padding: '6px 14px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>View All Leads ({stats.totalEnquiries})</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
            textAlign: 'left',
            minWidth: '700px',
          }}
        >
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th
                style={{
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderTop: '1px solid #E2E8F0',
                  borderBottom: '1.5px solid #E2E8F0',
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                }}
              >
                Customer & Contact
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderTop: '1px solid #E2E8F0',
                  borderBottom: '1.5px solid #E2E8F0',
                }}
              >
                Territory / Location
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderTop: '1px solid #E2E8F0',
                  borderBottom: '1.5px solid #E2E8F0',
                }}
              >
                Category
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderTop: '1px solid #E2E8F0',
                  borderBottom: '1.5px solid #E2E8F0',
                }}
              >
                Pipeline Status
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  borderTop: '1px solid #E2E8F0',
                  borderBottom: '1.5px solid #E2E8F0',
                  textAlign: 'right',
                  borderTopRightRadius: '8px',
                  borderBottomRightRadius: '8px',
                }}
              >
                Outreach Action
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.recentEnquiries.slice(0, 5).map((enq: any, i: number) => {
              const initials = (enq.name || 'CU')
                .split(' ')
                .map((n: string) => n.charAt(0))
                .slice(0, 2)
                .join('')
                .toUpperCase();
              const isFranchise = enq.enquiryType === 'FRANCHISE' || enq.enquiryType === 'STOCKIST';
              const targetLink = isFranchise ? '/admin/stockist-enquiries' : '/admin/product-enquiries';

              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FAF8FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Customer & Contact */}
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '999px',
                          background: '#F1F5F9',
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 800,
                          flexShrink: 0,
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '13.5px' }}>
                          {enq.name || 'Direct Inquiry'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>
                          {enq.email || enq.phone || 'Contact provided'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td style={{ padding: '14px 16px', fontSize: '12.5px', color: '#334155', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>
                        {[enq.city, enq.state].filter(Boolean).join(', ') || 'Pan-India'}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
                    <span
                      style={{
                        background: isFranchise ? '#F5F3FF' : '#EFF6FF',
                        color: isFranchise ? '#6828DC' : '#2563EB',
                        border: `1px solid ${isFranchise ? '#DDD6FE' : '#BFDBFE'}`,
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {isFranchise ? 'Stockist / Franchise' : 'Product Order'}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
                    <span
                      style={{
                        background:
                          enq.status === 'NEW'
                            ? '#FEF2F2'
                            : enq.status === 'APPROVED'
                              ? '#ECFDF5'
                              : enq.status === 'DOCUMENTS_PENDING'
                                ? '#EFF6FF'
                                : '#F8FAFC',
                        color:
                          enq.status === 'NEW'
                            ? '#DC2626'
                            : enq.status === 'APPROVED'
                              ? '#059669'
                              : enq.status === 'DOCUMENTS_PENDING'
                                ? '#2563EB'
                                : '#334155',
                        border: `1px solid ${
                          enq.status === 'NEW'
                            ? '#FECACA'
                            : enq.status === 'APPROVED'
                              ? '#A7F3D0'
                              : enq.status === 'DOCUMENTS_PENDING'
                                ? '#BFDBFE'
                                : '#E2E8F0'
                        }`,
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {enq.status || 'NEW'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px', textAlign: 'right', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {enq.phone && (
                        <a
                          href={enq.instantWhatsAppChatUrl || `https://wa.me/${enq.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Chat with lead on WhatsApp"
                          style={{
                            background: '#ECFDF5',
                            border: '1px solid #A7F3D0',
                            color: '#059669',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#059669';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ECFDF5';
                            e.currentTarget.style.color = '#059669';
                          }}
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <Link
                        to={targetLink}
                        style={{
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          color: '#334155',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          textDecoration: 'none',
                        }}
                      >
                        Details
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
