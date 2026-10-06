/**
 * WhatsApp Message Builder
 * Generates well-structured, executive B2B WhatsApp lead cards
 * with corporate formatting, emojis, and clear sections.
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
  message?: string;
  authUser?: AuthenticatedUserMeta;
}

export interface BulkBatchItem {
  name: string;
  quantity: number | string;
  unit?: string;
  composition?: string;
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

const formatAuthBlock = (
  authUser?: AuthenticatedUserMeta,
  fallbackName?: string,
  fallbackPhone?: string,
  fallbackEmail?: string
) => {
  const name = authUser?.name || fallbackName || 'Registered User';
  const phone = authUser?.phone || fallbackPhone || 'Phone Not Set';
  const email = authUser?.email || fallbackEmail;
  return [
    `👤 *VERIFIED REGISTERED USER (LOGIN ACCOUNT)*`,
    `• *User Name:* ${name}`,
    `• *Registered Phone:* ${phone}`,
    email ? `• *Account Email:* ${email}` : null,
  ].filter(Boolean);
};

export const buildStockistsWhatsAppMessage = (data: StockistLeadData): string => {
  const firm = data.companyName || 'Authorized Stockist Partner';
  const divisions = data.interestedDivisions?.length ? data.interestedDivisions.join(', ') : 'All Formulations';
  const now = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const lines = [
    `🏛️ *ZEAL PHARMACURE PVT. LTD.*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📋 *NEW STOCKISTS DISTRIBUTION APPLICATION*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ...formatAuthBlock(data.authUser, data.fullName, data.phone, data.email),
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `📍 *TARGET TERRITORY ALLOCATION*`,
    `• *Territory / District:* ${data.district || data.city || 'District Headquarter'}`,
    `• *State:* ${data.state || 'India'}`,
    `• *City HQ:* ${data.city || 'Headquarter'}${data.pincode ? ` (PIN: ${data.pincode})` : ''}`,
    ``,
    `🏢 *FIRM & COMMERCIAL DETAILS*`,
    `• *Firm Name:* ${firm}`,
    data.businessType ? `• *Business Structure:* ${data.businessType.replace(/_/g, ' ')}` : null,
    `• *Investment Budget:* ${data.investmentBudget || 'Standard Allocation'}`,
    `• *Pharma Experience:* ${data.pharmaExperience || 'Active Distribution Background'}`,
    data.drugLicenseNumber ? `• *Drug License (20B/21B):* ${data.drugLicenseNumber}` : null,
    data.gstNumber ? `• *GST Number:* ${data.gstNumber}` : null,
    ``,
    `📦 *DIVISIONS OF INTEREST*`,
    `• ${divisions}`,
    ``,
    data.message ? `💬 *Requirement Note:*\n_"${data.message}"_\n` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📅 *Date:* ${now}`,
    `🌐 *Source:* Zeal Pharmacure Stockists Distribution Portal`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👉 *Requested Next Step:*`,
    `Please share the *Stockists Distribution Rate Chart*, *Product Visual Aids*, and *Authorized Territory Terms*.`,
  ].filter(Boolean);

  return lines.join('\n');
};

export const buildFranchiseWhatsAppMessage = buildStockistsWhatsAppMessage;

export const buildProductWhatsAppMessage = (data: ProductInquiryData): string => {
  const lines = [
    `💊 *ZEAL PHARMACURE — STOCKISTS PRODUCT INQUIRY*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ...formatAuthBlock(data.authUser, data.fullName, data.phone, data.email),
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 *FORMULATION DETAILS*`,
    `• *Product Name:* ${data.productName}`,
    data.genericName ? `• *Composition:* ${data.genericName}` : null,
    data.dosageForm ? `• *Dosage Form:* ${data.dosageForm}` : null,
    data.packaging ? `• *Packing:* ${data.packaging}` : null,
    data.quantity ? `• *Estimated Requirement:* ${data.quantity}` : null,
    ``,
    data.companyName ? `🏢 *Firm / Pharmacy:* ${data.companyName}` : null,
    data.city || data.state ? `📍 *Location:* ${[data.city, data.state].filter(Boolean).join(', ')}` : null,
    data.drugLicenseNumber ? `📋 *Drug License:* ${data.drugLicenseNumber}` : null,
    data.message ? `💬 *Note:*\n_"${data.message}"_\n` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🚀 *Please share the Stockists Net Wholesale Rate and dispatch timeline.*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  ].filter(Boolean);

  return lines.join('\n');
};

export const buildBulkBatchWhatsAppMessage = (data: BulkBatchInquiryData): string => {
  const itemLines = data.items.map((it, idx) => {
    return `${idx + 1}️⃣ *${it.name}* — ${it.quantity} ${it.unit || 'Boxes'}${it.composition ? ` (${it.composition})` : ''}`;
  });

  const lines = [
    `📦 *ZEAL PHARMACURE — STOCKISTS BULK BATCH QUOTATION*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ...formatAuthBlock(data.authUser, data.fullName, data.phone, data.email),
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📋 *ITEMIZED FORMULATIONS BATCH (${data.items.length} Items):*`,
    ...itemLines,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    data.companyName ? `🏢 *Firm Name:* ${data.companyName}` : null,
    data.city || data.state ? `📍 *Delivery Headquarter:* ${[data.city, data.state].filter(Boolean).join(', ')}` : null,
    data.gstNumber ? `📋 *GST Number:* ${data.gstNumber}` : null,
    data.message ? `💬 *Special Instructions:*\n_"${data.message}"_\n` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🚀 *Action Required:* Please calculate total institutional batch quotation with freight & wholesale discount.`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  ].filter(Boolean);

  return lines.join('\n');
};

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

export const buildCareerWhatsAppMessage = (data: CareerApplicationData): string => {
  const now = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const location = [data.currentCity, data.currentState].filter(Boolean).join(', ') || 'India';

  const lines = [
    `💼 *ZEAL PHARMACURE — CAREER APPLICATION*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ...formatAuthBlock(data.authUser, data.fullName, data.phone, data.email),
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📋 *JOB VACANCY DETAILS*`,
    `• *Position Applied:* ${data.jobTitle}`,
    data.department ? `• *Department:* ${data.department}` : null,
    ``,
    `👤 *CANDIDATE BACKGROUND*`,
    `• *Current Location:* ${location}`,
    data.qualification ? `• *Highest Qualification:* ${data.qualification}` : null,
    data.totalExperience ? `• *Total Experience:* ${data.totalExperience}` : null,
    data.currentCompany ? `• *Current Firm:* ${data.currentCompany}` : null,
    data.currentDesignation ? `• *Designation:* ${data.currentDesignation}` : null,
    data.expectedCtc ? `• *Expected CTC:* ${data.expectedCtc}` : null,
    data.noticePeriod ? `• *Notice Period:* ${data.noticePeriod}` : null,
    data.coverNote ? `💬 *Candidate Note:*\n_"${data.coverNote}"_\n` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📅 *Date:* ${now}`,
    `🌐 *Source:* Zeal Pharmacure Careers Portal`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🚀 *Action Required:* Please review my candidate application and share interview schedule with HR.`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  ].filter(Boolean);

  return lines.join('\n');
};

export interface QuickWhatsAppInquiryData {
  user?: AuthenticatedUserMeta;
  topicTitle?: string;
  topicLabel?: string;
  message?: string;
  source?: string;
}

export const buildQuickWhatsAppMessage = (data: QuickWhatsAppInquiryData): string => {
  const now = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const subject = data.topicTitle || data.topicLabel;

  const lines = [
    `💬 *ZEAL PHARMACURE — DIRECT ENQUIRY DESK*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ...formatAuthBlock(data.user),
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    subject ? `📌 *Subject / Topic:* ${subject}` : null,
    data.message ? `\n💬 *Message:*\n"${data.message}"\n` : null,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📅 *Date:* ${now}`,
    `🌐 *Source:* ${data.source || 'Zeal Pharmacure Website Desk'}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👉 *Action Required:* Sales Executive please connect with the verified user above.`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  ].filter(Boolean);

  return lines.join('\n');
};
