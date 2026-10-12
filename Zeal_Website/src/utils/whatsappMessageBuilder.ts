/**
 * WhatsApp Message Builder
 * Generates clean, humble, executive B2B WhatsApp messages.
 * Contains NO emojis, only dynamic details, and a single bottom divider line.
 */

export interface AuthenticatedUserMeta {
  name: string;
  phone?: string;
  email?: string;
}

export interface StockistLeadData {
  fullName: string;
  phone: string;
  email?: string;
  companyName?: string;
  businessType?: string;
  district?: string;
  city?: string;
  state?: string;
  pincode?: string;
  investmentBudget?: string;
  pharmaExperience?: string;
  drugLicenseNumber?: string;
  gstNumber?: string;
  interestedDivisions?: string[];
  message?: string;
  authUser?: AuthenticatedUserMeta;
}

export interface ProductInquiryData {
  productName: string;
  genericName?: string;
  dosageForm?: string;
  packaging?: string;
  targetVolume?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  city?: string;
  state?: string;
  quantity?: string;
  drugLicenseNumber?: string;
  gstNumber?: string;
  mrp?: number | string | null;
  message?: string;
  authUser?: AuthenticatedUserMeta;
}

export interface BulkBatchItem {
  name: string;
  quantity: number | string;
  unit?: string;
  composition?: string;
  mrp?: number | string | null;
}

export interface BulkBatchInquiryData {
  items: BulkBatchItem[];
  fullName: string;
  phone: string;
  email?: string;
  companyName?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
  message?: string;
  authUser?: AuthenticatedUserMeta;
}

export interface CareerApplicationData {
  jobTitle: string;
  department?: string;
  fullName: string;
  phone: string;
  email?: string;
  currentCity?: string;
  currentState?: string;
  qualification?: string;
  totalExperience?: string;
  currentCompany?: string;
  currentDesignation?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  coverNote?: string;
  authUser?: AuthenticatedUserMeta;
}

export interface QuickWhatsAppInquiryData {
  user?: AuthenticatedUserMeta;
  topicTitle?: string;
  topicLabel?: string;
  message?: string;
  source?: string;
}

// -------------------------------------------------------------
// 1. Single Product Enquiry (User -> Sales Desk)
// -------------------------------------------------------------
export const buildProductWhatsAppMessage = (data: ProductInquiryData): string => {
  const clientName = data.authUser?.name || data.fullName || 'Valued Associate';
  const clientPhone = data.authUser?.phone || data.phone;
  const clientEmail = data.authUser?.email || data.email;
  const location = [data.city, data.state].filter(Boolean).join(', ');
  const qty = data.quantity || data.targetVolume;

  let mrpText: string | null = null;
  if (data.mrp !== undefined && data.mrp !== null && data.mrp !== '') {
    const numericMrp = Number(data.mrp);
    const displayMrp = isNaN(numericMrp) ? data.mrp : numericMrp.toLocaleString('en-IN');
    mrpText = `Rs. ${displayMrp} / Pack`;
  }

  const lines = [
    `Namaste / Hello Zeal Pharmacure Team,`,
    ``,
    `Thank you for your valuable support. I am interested in your pharmaceutical formulation and would like to receive your official distributor rates.`,
    ``,
    `*Product Details:*`,
    `• Formulation: ${data.productName}`,
    data.genericName ? `• Composition: ${data.genericName}` : null,
    data.packaging ? `• Packaging: ${data.packaging}` : null,
    data.dosageForm ? `• Dosage Form: ${data.dosageForm}` : null,
    mrpText ? `• Single Unit MRP: ${mrpText}` : null,
    qty ? `• Required Quantity: ${qty}` : null,
    ``,
    `*My Contact Details:*`,
    `• Name: ${clientName}`,
    clientPhone ? `• Mobile: ${clientPhone}` : null,
    clientEmail ? `• Email: ${clientEmail}` : null,
    data.companyName ? `• Firm / Pharmacy: ${data.companyName}` : null,
    location ? `• Location: ${location}` : null,
    data.drugLicenseNumber ? `• Drug License: ${data.drugLicenseNumber}` : null,
    data.gstNumber ? `• GSTIN: ${data.gstNumber}` : null,
    data.message ? `• Requirement Note: "${data.message}"` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Kindly share the net distributor rates and dispatch availability at your earliest convenience. Thank you very much!`,
  ].filter(line => line !== null);

  return lines.join('\n');
};

// -------------------------------------------------------------
// 2. Bulk Batch Formulation Enquiry (User -> Sales Desk)
// -------------------------------------------------------------
export const buildBulkBatchWhatsAppMessage = (data: BulkBatchInquiryData): string => {
  const clientName = data.authUser?.name || data.fullName || 'Valued Associate';
  const clientPhone = data.authUser?.phone || data.phone;
  const clientEmail = data.authUser?.email || data.email;
  const location = [data.city, data.state].filter(Boolean).join(', ');

  const itemLines = data.items.map((it, idx) => {
    let mrpSuffix = '';
    if (it.mrp !== undefined && it.mrp !== null && it.mrp !== '') {
      const n = Number(it.mrp);
      mrpSuffix = ` (MRP: Rs. ${isNaN(n) ? it.mrp : n.toLocaleString('en-IN')} / Pack)`;
    }
    const comp = it.composition ? ` [${it.composition}]` : '';
    return `${idx + 1}. ${it.name} — ${it.quantity} ${it.unit || 'Boxes'}${comp}${mrpSuffix}`;
  });

  const lines = [
    `Namaste / Hello Zeal Pharmacure Team,`,
    ``,
    `Thank you for your assistance. We are looking to place an institutional bulk requirement for the following formulations:`,
    ``,
    `*Requested Formulations (${data.items.length} Items):*`,
    ...itemLines,
    ``,
    `*Firm & Contact Details:*`,
    `• Contact Person: ${clientName}`,
    clientPhone ? `• Mobile: ${clientPhone}` : null,
    clientEmail ? `• Email: ${clientEmail}` : null,
    data.companyName ? `• Firm Name: ${data.companyName}` : null,
    location ? `• Delivery Location: ${location}` : null,
    data.gstNumber ? `• GSTIN: ${data.gstNumber}` : null,
    data.message ? `• Special Instructions: "${data.message}"` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Kindly share the consolidated quotation with wholesale discounts and freight terms. Thank you very much!`,
  ].filter(line => line !== null);

  return lines.join('\n');
};

// -------------------------------------------------------------
// 3. Stockist / PCD Distribution Application (User -> Sales Desk)
// -------------------------------------------------------------
export const buildStockistsWhatsAppMessage = (data: StockistLeadData): string => {
  const clientName = data.authUser?.name || data.fullName || 'Valued Associate';
  const clientPhone = data.authUser?.phone || data.phone;
  const clientEmail = data.authUser?.email || data.email;
  const location = [data.city, data.district, data.state].filter(Boolean).join(', ');
  const divisions = data.interestedDivisions?.length ? data.interestedDivisions.join(', ') : null;

  const lines = [
    `Namaste / Hello Zeal Pharmacure Team,`,
    ``,
    `Thank you for offering quality healthcare products. We are keen to associate with Zeal Pharmacure Pvt. Ltd. as an Authorized Stockist Partner in our territory.`,
    ``,
    `*Application Details:*`,
    location ? `• Target Territory: ${location}${data.pincode ? ` (PIN: ${data.pincode})` : ''}` : null,
    data.companyName ? `• Firm Name: ${data.companyName}` : null,
    `• Contact Person: ${clientName}`,
    clientPhone ? `• Mobile: ${clientPhone}` : null,
    clientEmail ? `• Email: ${clientEmail}` : null,
    data.businessType ? `• Business Structure: ${data.businessType.replace(/_/g, ' ')}` : null,
    data.investmentBudget ? `• Investment Capacity: ${data.investmentBudget}` : null,
    data.pharmaExperience ? `• Pharma Experience: ${data.pharmaExperience}` : null,
    data.drugLicenseNumber ? `• Drug License (DL): ${data.drugLicenseNumber}` : null,
    data.gstNumber ? `• GSTIN: ${data.gstNumber}` : null,
    divisions ? `• Interested Divisions: ${divisions}` : null,
    data.message ? `• Note: "${data.message}"` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `We request you to kindly share the territory availability, visual aids, and monopoly distribution terms. Thank you!`,
  ].filter(line => line !== null);

  return lines.join('\n');
};

export const buildFranchiseWhatsAppMessage = buildStockistsWhatsAppMessage;

// -------------------------------------------------------------
// 4. Career Candidate Application (Applicant -> HR Desk)
// -------------------------------------------------------------
export const buildCareerWhatsAppMessage = (data: CareerApplicationData): string => {
  const candidateName = data.authUser?.name || data.fullName || 'Candidate';
  const candidatePhone = data.authUser?.phone || data.phone;
  const candidateEmail = data.authUser?.email || data.email;
  const location = [data.currentCity, data.currentState].filter(Boolean).join(', ');

  const lines = [
    `Namaste / Hello Zeal Pharmacure HR Team,`,
    ``,
    `Thank you for reviewing my profile. I am writing to express my keen interest in the career opening at Zeal Pharmacure Pvt. Ltd.`,
    ``,
    `*Candidate Profile:*`,
    `• Position Applied: ${data.jobTitle}`,
    data.department ? `• Department: ${data.department}` : null,
    `• Candidate Name: ${candidateName}`,
    candidatePhone ? `• Mobile: ${candidatePhone}` : null,
    candidateEmail ? `• Email: ${candidateEmail}` : null,
    location ? `• Current Location: ${location}` : null,
    data.qualification ? `• Highest Qualification: ${data.qualification}` : null,
    data.totalExperience ? `• Total Experience: ${data.totalExperience}` : null,
    data.currentCompany ? `• Current Company: ${data.currentCompany}` : null,
    data.currentDesignation ? `• Current Designation: ${data.currentDesignation}` : null,
    data.expectedCtc ? `• Expected CTC: ${data.expectedCtc}` : null,
    data.noticePeriod ? `• Notice Period: ${data.noticePeriod}` : null,
    data.coverNote ? `• Candidate Note: "${data.coverNote}"` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Kindly consider my application for the interview process. Thank you very much!`,
  ].filter(line => line !== null);

  return lines.join('\n');
};

// -------------------------------------------------------------
// 5. Quick Direct Desk Enquiry
// -------------------------------------------------------------
export const buildQuickWhatsAppMessage = (data: QuickWhatsAppInquiryData): string => {
  const clientName = data.user?.name || 'Valued Associate';
  const clientPhone = data.user?.phone;
  const clientEmail = data.user?.email;
  const subject = data.topicTitle || data.topicLabel;

  const lines = [
    `Namaste / Hello Zeal Pharmacure Team,`,
    ``,
    `Thank you for your assistance. I would like to make an enquiry regarding the following:`,
    ``,
    subject ? `*Subject:* ${subject}` : null,
    `*Contact Details:*`,
    `• Name: ${clientName}`,
    clientPhone ? `• Mobile: ${clientPhone}` : null,
    clientEmail ? `• Email: ${clientEmail}` : null,
    data.message ? `• Message: "${data.message}"` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Kindly connect with me at your convenience. Thank you!`,
  ].filter(line => line !== null);

  return lines.join('\n');
};
