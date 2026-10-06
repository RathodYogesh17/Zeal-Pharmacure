import {
  ZEAL_OFFICIAL_PHONE_DISPLAY,
  ZEAL_HEAD_OFFICE_ADDRESS,
  ZEAL_PORTAL_URL,
  type WhatsAppEnquiryCategory,
} from './whatsappConstants';

export interface WhatsAppTemplateDetails {
  packaging?: string;
  dosageForm?: string;
  city?: string;
  state?: string;
  companyName?: string;
  itemCount?: number;
  interviewDate?: string;
  interviewMode?: string;
  meetingLink?: string;
  qualification?: string;
  experience?: string | number;
}

export interface MessageTemplate {
  id: string;
  label: string;
  icon: string;
  getMessage: () => string;
}

export const getCategoryWhatsAppTemplates = (
  category: WhatsAppEnquiryCategory,
  recipientName: string,
  referenceTitle?: string,
  details?: WhatsAppTemplateDetails
): MessageTemplate[] => {
  const name = recipientName?.trim() || 'Associate';
  const ref = referenceTitle?.trim() || (category === 'CAREER' ? 'your application' : 'your inquiry');

  if (category === 'CAREER') {
    return [
      {
        id: 'career-shortlist',
        label: 'Shortlist Update',
        icon: 'Sparkles',
       getMessage: () =>
  `*APPLICATION SHORTLISTED - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Dear *${name}*,\n\n` +
  `We are pleased to inform you that your application for *${ref}* has successfully passed our initial screening and has been *SHORTLISTED* for the next stage of the recruitment process.\n\n` +
  `Our Recruitment & HR Team will contact you shortly with the interview details, including the scheduled date, time, and interview mode.\n\n` +
  `Please keep your registered contact number available and check your messages regularly for further updates from our HR team.\n\n` +
  `📌 *Application Status:* SHORTLISTED\n` +
  `💼 *Position:* ${ref}\n` +
  `📞 *HR Helpline:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Career Portal:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
      {
        id: 'career-interview',
        label: 'Interview Invite',
        icon: 'Clock',
       getMessage: () => {
  const dateStr = details?.interviewDate ? `*Date & Time:* ${details.interviewDate}\n` : '';
  const modeStr = details?.interviewMode ? `*Interview Mode:* ${details.interviewMode}\n` : '';
  const linkStr = details?.meetingLink ? `*Meeting Link / Venue:* ${details.meetingLink}\n` : '';

  return (
    `*INTERVIEW INVITATION - ZEAL PHARMACEUTICALS*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Dear *${name}*,\n\n` +
    `Congratulations! Your profile for the position of *${ref}* has been shortlisted, and you are invited to attend the next stage of our recruitment process.\n\n` +
    `📅 *Interview Details*\n` +
    dateStr +
    modeStr +
    linkStr +
    `\nPlease arrive or join at least *5 minutes before* the scheduled time and keep the required documents ready for verification.\n\n` +
    `If you have any questions regarding the interview, please contact our HR Recruitment Desk.\n\n` +
    `📞 *HR Recruitment Desk:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
    `🌐 *Career Portal:* ${ZEAL_PORTAL_URL}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`
  );
},
      },
      {
        id: 'career-review',
        label: '📋 Active Screening',
        icon: 'Briefcase',
      getMessage: () =>
  `*APPLICATION STATUS UPDATE - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Dear *${name}*,\n\n` +
  `Thank you for your interest in the *${ref}* position at Zeal Pharmaceuticals.\n\n` +
  `We would like to inform you that your application is currently *UNDER ACTIVE REVIEW* by our Recruitment & Technical Evaluation Team.\n\n` +
  `Our team is carefully evaluating your profile, qualifications, and application details. You will be notified once the next stage of the recruitment process is finalized.\n\n` +
  `📌 *Application Status:* UNDER REVIEW\n` +
  `💼 *Position:* ${ref}\n` +
  `📞 *HR Helpline:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Career Portal:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
      {
        id: 'career-offer',
        label: 'Offer Letter Alert',
        icon: 'FileCheck',
        getMessage: () =>
  `*OFFER CONFIRMATION - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Dear *${name}*,\n\n` +
  `Congratulations! We are pleased to inform you that you have been *SELECTED* for the position of *${ref}* at Zeal Pharmaceuticals Pvt. Ltd.\n\n` +
  `We are delighted to welcome you to the next stage of your professional journey with Zeal Pharmaceuticals. Your formal Offer Letter and onboarding instructions will be shared with you through your registered email address.\n\n` +
  `Please review the Offer Letter carefully and complete the required onboarding documentation within the mentioned timeline.\n\n` +
  `📌 *Selection Status:* SELECTED\n` +
  `💼 *Position:* ${ref}\n` +
  `🏢 *Head Office:* ${ZEAL_HEAD_OFFICE_ADDRESS}\n` +
  `📞 *HR Helpline:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Career Portal:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
      {
        id: 'career-decline',
        label: 'Respectful Notice',
        icon: 'User',
       getMessage: () =>
  `*APPLICATION STATUS UPDATE - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Dear *${name}*,\n\n` +
  `Thank you for your time and interest in the *${ref}* opportunity at Zeal Pharmaceuticals.\n\n` +
  `After careful consideration of the applications received for the current opening, we have decided to proceed with another candidate whose profile more closely matches the requirements of this particular position.\n\n` +
  `Please note that this decision applies only to the current opening. Your profile may be retained in our *Talent Pool* for consideration against suitable opportunities that may become available in the future.\n\n` +
  `We sincerely appreciate your interest in Zeal Pharmaceuticals and wish you continued success in your professional journey.\n\n` +
  `📌 *Application Status:* Not Selected for Current Opening\n` +
  `💼 *Position:* ${ref}\n` +
  `📞 *HR Helpline:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Career Portal:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
    ];
  }

  if (category === 'FRANCHISE') {
    const territory = details?.city || ref || 'your district';
    return [
      {
        id: 'franchise-qualified',
        label: 'Monopoly Offer',
        icon: 'Building2',
        getMessage: () =>
  `*ZEAL PHARMACEUTICALS - STOCKISTS DISTRIBUTION*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Hello *${name}*,\n\n` +
  `Thank you for your interest in becoming an *Authorized Stockists Distribution Partner* for *${territory}* with Zeal Pharmaceuticals.\n\n` +
  `We are pleased to inform you that distribution opportunities are currently available for this territory. Our business team can provide detailed information regarding our product portfolio, distribution requirements, commercial terms, and onboarding process.\n\n` +
  `Our Zonal Business Manager will connect with you to discuss the opportunity and guide you through the next steps.\n\n` +
  `📍 *Territory:* ${territory}\n` +
  `📌 *Opportunity:* Stockists Distribution\n` +
  `📞 *Stockists Direct Desk:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Portal:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
      {
        id: 'franchise-docs',
        label: 'Request DL & GST',
        icon: 'FileCheck',
      getMessage: () =>
  `*DOCUMENTATION REQUIRED - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Hello *${name}*,\n\n` +
  `Thank you for your interest in the *Stockists Distribution* opportunity for *${territory}*.\n\n` +
  `To proceed with the initial verification and onboarding process, please provide clear and valid copies of the following documents:\n\n` +
  `📄 *Required Documents:*\n` +
  `1. Wholesale Drug License (Form 20B / 21B)\n` +
  `2. GST Registration Certificate\n\n` +
  `Please ensure that all submitted documents are clear, readable, and up to date. Our team will review the documents and guide you through the next steps of the distribution process.\n\n` +
  `📍 *Territory:* ${territory}\n` +
  `📞 *Stockists Direct Desk:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Portal:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
      {
        id: 'franchise-approved',
        label: 'Allotment Approved',
        icon: 'Sparkles',
       getMessage: () =>
  `*DISTRIBUTION ALLOTMENT APPROVED - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `*ZEAL PHARMACEUTICALS PVT. LTD.*\n\n` +
  `Dear *${name}*,\n\n` +
  `Congratulations! We are pleased to inform you that your application for *Authorized Stockists Distribution* for *${territory}* has been *APPROVED* following the completion of the initial review process.\n\n` +
  `Your territory has been approved for the next stage of the onboarding process. Our Area Manager will contact you to discuss the distribution agreement, required formalities, commercial terms, and further onboarding procedures.\n\n` +
  `📌 *Status:* APPROVED\n` +
  `📍 *Territory:* ${territory}\n` +
  `🤝 *Opportunity:* Authorized Stockists Distribution\n` +
  `📞 *Stockists Helpline:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Portal:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
      {
        id: 'franchise-rejected',
        label: 'Territory Busy',
        icon: 'AlertCircle',
     getMessage: () =>
  `*DISTRIBUTION TERRITORY UPDATE - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Hello *${name}*,\n\n` +
  `Thank you for your interest in the *Stockists Distribution* opportunity with Zeal Pharmaceuticals for *${territory}*.\n\n` +
  `After reviewing the current territory availability, we would like to inform you that the authorized distribution opportunity for *${territory}* is presently assigned to an existing distribution partner.\n\n` +
  `We appreciate your interest and may consider your enquiry for suitable opportunities in nearby territories or when new distribution requirements become available.\n\n` +
  `📌 *Territory Status:* Currently Unavailable\n` +
  `📍 *Requested Territory:* ${territory}\n` +
  `📞 *Zeal Pharma Helpline:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Portal:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
    ];
  }

  if (category === 'BULK') {
    const count = details?.itemCount || 1;
    return [
      {
        id: 'bulk-quote',
        label: ' Wholesale Batch Quote',
        icon: 'Package',
getMessage: () =>
  `*BULK PROCUREMENT UPDATE - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Hello *${name}*,\n\n` +
  `Thank you for sharing your bulk procurement requirement with Zeal Pharmaceuticals.\n\n` +
  `We have received your requirement for *${count} Formulation(s)*. Our commercial team will review the requested products and prepare the applicable bulk quotation based on the required quantities and procurement details.\n\n` +
  `The quotation will include the relevant commercial terms, availability details, and estimated dispatch timelines wherever applicable.\n\n` +
  `📦 *Required Formulations:* ${count}\n` +
  `📌 *Request Type:* Bulk Procurement\n` +
  `📞 *Commercial Institutional Desk:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Website:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
      {
        id: 'bulk-timeline',
        label: 'Production Lead Time',
        icon: 'Clock',
      getMessage: () =>
  `*PRODUCTION TIMELINE UPDATE - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Hello *${name}*,\n\n` +
  `Regarding your batch requirement for *${details?.companyName || 'your firm'}*, we would like to provide you with the current production timeline.\n\n` +
  `Once the order and production requirements are confirmed, our manufacturing team will coordinate the applicable production schedule and dispatch planning.\n\n` +
  `The estimated production turnaround time is *10-14 business days* from the date of confirmation, subject to product availability, batch requirements, and final order approval.\n\n` +
  `Our quality team will complete the required quality checks before the batch is released for dispatch. Relevant quality documentation, including COA where applicable, will be provided as per the order requirements.\n\n` +
  `📦 *Order Type:* Batch Production\n` +
  `⏱️ *Estimated Timeline:* 10-14 Business Days\n` +
  `📞 *Direct Helpline:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Website:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      },
    ];
  }

  // Default Single Product
  return [
    {
      id: 'product-price',
      label: 'Distributor Net Rates',
      icon: 'Package',
   getMessage: () =>
  `*DISTRIBUTOR PRICING & PRODUCT DETAILS - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Hello *${name}*,\n\n` +
  `Thank you for your interest in *${ref}*${details?.dosageForm ? ` (${details.dosageForm})` : ''} from Zeal Pharmaceuticals.\n\n` +
  `Our Sales & Distribution Team will assist you with the applicable distributor pricing, product availability, packaging details, and dispatch information based on your requirement.\n\n` +
  `For authorized distributors, our team can also provide relevant product information and commercial details as applicable.\n\n` +
  `📦 *Product:* ${ref}${details?.dosageForm ? `\n💊 *Dosage Form:* ${details.dosageForm}` : ''}\n` +
  `📌 *Enquiry Type:* Distributor Pricing\n` +
  `📞 *Sales Desk:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Catalog:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    },
    {
      id: 'product-coa',
      label: 'COA & Quality Dossier',
      icon: 'FileCheck',
   getMessage: () =>
  `*QUALITY & PRODUCT DOCUMENTATION - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Hello *${name}*,\n\n` +
  `Thank you for your interest in the quality and technical documentation for *${ref}*.\n\n` +
  `Our Quality Assurance Team can assist with the available product composition details, quality documentation, and applicable batch-related records for authorized business partners.\n\n` +
  `Where applicable, relevant quality documents such as the *Certificate of Analysis (COA)* and supporting technical documentation can be provided as per the product and batch requirements.\n\n` +
  `📦 *Product:* ${ref}\n` +
  `📋 *Documentation:* Quality & Technical Information\n` +
  `📞 *Quality Assurance Desk:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Product Catalog:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    },
    {
      id: 'product-dispatch',
      label: 'Dispatch Ready',
      icon: 'Sparkles',
  getMessage: () =>
  `*DISPATCH READY - ZEAL PHARMACEUTICALS*\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
  `Hello *${name}*,\n\n` +
  `We are pleased to inform you that your consignment for *${ref}* has been successfully verified and is now *READY FOR DISPATCH*.\n\n` +
  `The shipment will be handed over to the designated logistics partner as per the confirmed dispatch schedule. Tracking or transport details will be shared once the consignment has been handed over for transportation.\n\n` +
  `📦 *Product / Consignment:* ${ref}\n` +
  `📌 *Dispatch Status:* READY FOR DISPATCH\n` +
  `🚚 *Tracking:* Shared after logistics handover\n` +
  `📞 *Dispatch Logistics:* ${ZEAL_OFFICIAL_PHONE_DISPLAY}\n` +
  `🌐 *Portal:* ${ZEAL_PORTAL_URL}\n` +
  `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    },
  ];
};
