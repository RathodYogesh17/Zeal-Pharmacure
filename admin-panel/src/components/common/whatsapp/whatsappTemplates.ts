import {
  ZEAL_OFFICIAL_PHONE_DISPLAY,
  ZEAL_PORTAL_URL,
  type WhatsAppEnquiryCategory,
} from './whatsappConstants';

export type { WhatsAppEnquiryCategory };

export interface WhatsAppTemplateDetails {
  packaging?: string;
  dosageForm?: string;
  quantity?: string;
  city?: string;
  state?: string;
  companyName?: string;
  itemCount?: number;
  drugLicenseNumber?: string;
  gstNumber?: string;
  investmentBudget?: string;
  interestedDivisions?: string;
  interviewDate?: string;
  interviewMode?: string;
  meetingLink?: string;
  qualification?: string;
  experience?: string | number;
  note?: string;
  mrp?: number | string | null;
}

export interface MessageTemplate {
  id: string;
  label: string;
  icon: string;
  getMessage: () => string;
}

/**
 * Builds a humble, respectful, and fully dynamic WhatsApp status message
 */
export const buildStatusWhatsAppMessage = ({
  category,
  name,
  phone,
  email,
  refId,
  status,
  title,
  details,
}: {
  category: WhatsAppEnquiryCategory;
  name: string;
  phone?: string;
  email?: string;
  refId?: string;
  status: string;
  title?: string;
  details?: WhatsAppTemplateDetails;
}): string => {
  const clientName = name?.trim() || 'Valued Associate';
  const statusUpper = (status || 'UPDATED').toUpperCase();
  const formattedId = refId
    ? refId.startsWith('#')
      ? refId
      : `#${refId.slice(-8).toUpperCase()}`
    : '';
  const refSnippet = formattedId ? ` (Ref: ${formattedId})` : '';
  const location = [details?.city, details?.state].filter(Boolean).join(', ');

  // ==========================================
  // 1. CAREER CANDIDATE
  // ==========================================
  if (category === 'CAREER') {
    const jobTitle = title || 'Pharmaceutical Career Opening';
    let statusText = statusUpper;
    let narrative = '';

    switch (statusUpper) {
      case 'SHORTLISTED':
        statusText = 'APPLICATION SHORTLISTED';
        narrative =
          'Congratulations! Following review by our Recruitment Panel, your application has been shortlisted. Our HR team will connect with you shortly with your interview schedule.';
        break;
      case 'INTERVIEW_SCHEDULED':
        statusText = 'INTERVIEW SCHEDULED';
        narrative =
          'Your interview round has been officially scheduled. Please review the schedule below and ensure your availability.';
        break;
      case 'OFFERED':
      case 'HIRED':
        statusText = 'OFFICIAL OFFER EXTENDED';
        narrative =
          'We are delighted to extend our official Offer of Employment! Formal documentation has been dispatched to your email for review and acceptance.';
        break;
      case 'ON_HOLD':
        statusText = 'APPLICATION ON HOLD';
        narrative =
          'Your application is placed on hold for upcoming regional headcount approvals. We will proactively reach out once recruitment resumes.';
        break;
      case 'REJECTED':
        statusText = 'APPLICATION STATUS UPDATE';
        narrative =
          'Thank you for your valuable time and interest in Zeal Pharmacure. For this specific opening, we have moved forward with another applicant. Your profile remains active in our talent repository.';
        break;
      default:
        statusText = statusUpper;
        narrative =
          'Your job application is currently under active review by our Human Resources and Technical Screening Board.';
        break;
    }

    const lines = [
      `Dear ${clientName},`,
      ``,
      `Greetings from Zeal Pharmacure Pvt. Ltd.${refSnippet}!`,
      `Thank you very much for your interest in building your career with us.`,
      ``,
      `*Position:* ${jobTitle}`,
      `*Status:* ${statusText}`,
      ``,
      narrative,
      ``,
      details?.interviewDate ? `• Date & Time: ${details.interviewDate}` : null,
      details?.interviewMode ? `• Meeting Mode: ${details.interviewMode}` : null,
      details?.meetingLink ? `• Joining Link / Venue: ${details.meetingLink}` : null,
      details?.note ? `• Remarks: ${details.note}` : null,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Warm regards,`,
      `HR & Talent Acquisition Team | Zeal Pharmacure`,
      `Helpline: ${ZEAL_OFFICIAL_PHONE_DISPLAY} | careers@zealpharma.com`,
    ].filter(line => line !== null);

    return lines.join('\n');
  }

  // ==========================================
  // 2. FRANCHISE / STOCKIST CLIENT
  // ==========================================
  if (category === 'FRANCHISE') {
    const territory = details?.city || title || 'Designated Territory';
    let statusText = statusUpper;
    let narrative = '';

    switch (statusUpper) {
      case 'APPROVED':
        statusText = 'DISTRIBUTION ALLOTMENT APPROVED';
        narrative =
          'We are delighted to announce that your application for Authorized Stockist Distribution Rights has been approved! Our Zonal Business Manager will share the formal agreement and starter promotional kit.';
        break;
      case 'DOCUMENTS_PENDING':
        statusText = 'DOCUMENTATION REQUIRED';
        narrative =
          'To finalize your territory reservation and distributor code, kindly share clear copies of your Drug License (Form 20B/21B) and GST Registration Certificate.';
        break;
      case 'QUOTED':
        statusText = 'WHOLESALE RATE CHART READY';
        narrative =
          'Our Zonal Commercial Desk has generated the Wholesale Distributor Net Price List, Monopoly Division schemes, and dispatch schedule for your territory.';
        break;
      case 'QUALIFIED':
      case 'CONTACTED':
      case 'IN_TOUCH':
        statusText = 'PRE-QUALIFICATION CONFIRMED';
        narrative =
          'Our Market Expansion Desk has pre-screened your application and confirmed territory availability. Our Area Manager will connect with you to review distribution terms.';
        break;
      case 'FOLLOW_UP':
        statusText = 'FOLLOW-UP SCHEDULED';
        narrative =
          'A consultation has been scheduled regarding your Stockist Distribution Application to finalize division selections and initial batch placement.';
        break;
      case 'ON_HOLD':
        statusText = 'APPLICATION ON HOLD';
        narrative =
          'Your application is on temporary hold. Whenever you wish to resume, simply reply directly to this WhatsApp chat or call our Helpline.';
        break;
      case 'CLOSED':
        statusText = 'DISTRIBUTOR ACCOUNT ACTIVE';
        narrative =
          'Your Authorized Distributor Onboarding is completed and your account is active in our Central ERP. For batch orders, our Sales Desk is at your service.';
        break;
      case 'REJECTED':
        statusText = 'TERRITORY AVAILABILITY UPDATE';
        narrative =
          'We regret to inform you that Authorized Stockist Rights for this specific territory are already committed to an existing partner. Our desk will notify you as soon as adjacent quotas open.';
        break;
      default:
        statusText = statusUpper;
        narrative =
          'Your Stockist Distribution Application is under active evaluation by our Commercial Committee.';
        break;
    }

    const lines = [
      `Dear ${clientName} Ji,`,
      ``,
      `Greetings from Zeal Pharmacure Pvt. Ltd.${refSnippet}!`,
      `Thank you very much for connecting with us regarding the Stockist Distribution Network. We truly appreciate your interest in partnering with our brand.`,
      ``,
      `*Territory:* ${territory}`,
      details?.companyName ? `*Firm Name:* ${details.companyName}` : null,
      `*Status:* ${statusText}`,
      ``,
      narrative,
      ``,
      details?.note ? `• Remarks: ${details.note}` : null,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Warm regards,`,
      `Stockists Distribution Desk | Zeal Pharmacure`,
      `Helpline: ${ZEAL_OFFICIAL_PHONE_DISPLAY} | ${ZEAL_PORTAL_URL}`,
    ].filter(line => line !== null);

    return lines.join('\n');
  }

  // ==========================================
  // 3. PRODUCT / BULK INQUIRY
  // ==========================================
  const prodName = title || 'Pharmaceutical Formulation';
  let statusText = statusUpper;
  let narrative = '';

  switch (statusUpper) {
    case 'QUOTED':
      statusText = 'COMMERCIAL QUOTATION READY';
      narrative =
        'Our Institutional Sales Division has prepared the official Rate Contract and wholesale quotation for your requirement. Our Key Account Manager will connect shortly with the formal proforma invoice.';
      break;
    case 'IN_PROGRESS':
      statusText = 'ORDER IN PROGRESS';
      narrative =
        'Your requirement is under active processing with our Fulfillment & Quality Assurance team for batch release and logistics transit scheduling.';
      break;
    case 'DOCUMENTS_PENDING':
      statusText = 'REGULATORY DOCUMENTS REQUIRED';
      narrative =
        'To issue your tax invoice and dispatch goods, kindly reply with copies of your Wholesale Drug License (20B/21B) and GST Registration Certificate.';
      break;
    case 'APPROVED':
      statusText = 'ORDER APPROVED';
      narrative =
        'We are pleased to confirm that your order requirements have been formally approved! Batch allocation and staging at our Central Logistics Warehouse are underway.';
      break;
    case 'QUALIFIED':
    case 'CONTACTED':
    case 'IN_TOUCH':
      statusText = 'REQUIREMENT VERIFIED';
      narrative =
        'Our Institutional Sales Team has verified your product requirement. A dedicated Key Account Manager has been assigned to share monographs and pricing sheets.';
      break;
    case 'FOLLOW_UP':
      statusText = 'FOLLOW-UP SCHEDULED';
      narrative =
        'A follow-up consultation has been scheduled regarding your ongoing requirement to review dispatch timelines and volume options.';
      break;
    case 'ON_HOLD':
      statusText = 'INQUIRY ON HOLD';
      narrative =
        'Your inquiry is kept on hold as per your request. Whenever you are ready to resume, simply reply to this WhatsApp chat to reactivate your file instantly.';
      break;
    case 'CLOSED':
      statusText = 'ORDER COMPLETED';
      narrative =
        'Thank you for partnering with Zeal Pharmacure Pvt. Ltd. Your order has been fulfilled. For repeat batches or replenishment, our Sales Desk is available 24/7.';
      break;
    case 'REJECTED':
      statusText = 'STOCK ALLOCATION NOTICE';
      narrative =
        'Manufacturing lots for this specific formulation are temporarily fully committed. We will inform you immediately once fresh QA batches are released.';
      break;
    default:
      statusText = statusUpper;
      narrative =
        'Your inquiry is currently being handled by our Sales Fulfillment Team.';
      break;
  }

  let mrpText: string | null = null;
  if (details?.mrp !== undefined && details?.mrp !== null && details?.mrp !== '') {
    const num = Number(details.mrp);
    mrpText = `Rs. ${isNaN(num) ? details.mrp : num.toLocaleString('en-IN')} / Pack`;
  }

  const lines = [
    `Dear ${clientName} Ji,`,
    ``,
    `Greetings from Zeal Pharmacure Pvt. Ltd.${refSnippet}!`,
    `Thank you very much for reaching out to us. We sincerely appreciate your interest in our formulations.`,
    ``,
    `*Requirement Details:*`,
    `• Formulation: ${prodName}`,
    details?.packaging ? `• Packaging: ${details.packaging}` : null,
    mrpText ? `• Single Unit MRP: ${mrpText}` : null,
    details?.quantity ? `• Quantity: ${details.quantity}` : null,
    details?.companyName ? `• Firm: ${details.companyName}` : null,
    location ? `• Location: ${location}` : null,
    ``,
    `*Status:* ${statusText}`,
    narrative,
    ``,
    details?.note ? `• Remarks: ${details.note}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Warm regards,`,
    `Institutional Sales Desk | Zeal Pharmacure`,
    `Helpline: ${ZEAL_OFFICIAL_PHONE_DISPLAY} | ${ZEAL_PORTAL_URL}`,
  ].filter(line => line !== null);

  return lines.join('\n');
};

export const getCategoryWhatsAppTemplates = (
  category: WhatsAppEnquiryCategory,
  recipientName: string,
  referenceTitle?: string,
  details?: WhatsAppTemplateDetails,
  phone?: string,
  email?: string,
  refId?: string,
  currentStatus?: string
): MessageTemplate[] => {
  const st = currentStatus || 'NEW';

  const primaryMessage = buildStatusWhatsAppMessage({
    category,
    name: recipientName,
    phone,
    email,
    refId,
    status: st,
    title: referenceTitle,
    details,
  });

  return [
    {
      id: 'current-status',
      label: `Current Status (${st})`,
      icon: 'Sparkles',
      getMessage: () => primaryMessage,
    },
    {
      id: 'status-followup',
      label: 'Follow-Up Update',
      icon: 'Clock',
      getMessage: () =>
        buildStatusWhatsAppMessage({
          category,
          name: recipientName,
          phone,
          email,
          refId,
          status: 'FOLLOW_UP',
          title: referenceTitle,
          details,
        }),
    },
    {
      id: 'status-completed',
      label: 'Approved / Completed',
      icon: 'FileCheck',
      getMessage: () =>
        buildStatusWhatsAppMessage({
          category,
          name: recipientName,
          phone,
          email,
          refId,
          status: category === 'CAREER' ? 'OFFERED' : 'APPROVED',
          title: referenceTitle,
          details,
        }),
    },
  ];
};
