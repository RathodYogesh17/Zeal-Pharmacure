import { ZEAL_OFFICIAL_PHONE, type WhatsAppEnquiryCategory } from './whatsappConstants';
import type { WhatsAppTemplateDetails } from './whatsappTemplates';

export interface NormalizedWhatsAppRecipient {
  category: WhatsAppEnquiryCategory;
  recipientName: string;
  recipientPhone: string;
  cleanPhone: string;
  currentStatus?: string;
  referenceTitle?: string;
  details?: WhatsAppTemplateDetails;
  referenceId?: string;
}

export const cleanWhatsAppPhone = (phone?: string): string => {
  if (!phone) return ZEAL_OFFICIAL_PHONE;
  const digits = String(phone).replace(/[^0-9]/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

export const buildWhatsAppWebUrl = (phone?: string, text?: string): string => {
  const cleaned = cleanWhatsAppPhone(phone);
  const encoded = encodeURIComponent(text || '');
  return `https://wa.me/${cleaned}?text=${encoded}`;
};

export const isCareerEntity = (item: any): boolean => {
  if (!item) return false;
  return Boolean(
    item.enquiryType === 'CAREER' ||
    item.enquiryCategory === 'CAREER' ||
    item.positionAppliedFor ||
    item.jobOpening ||
    item.resumeUrl ||
    item.totalExperienceYears !== undefined
  );
};

export const isFranchiseEntity = (item: any): boolean => {
  if (!item) return false;
  return Boolean(
    item.enquiryType === 'FRANCHISE' ||
    item.enquiryCategory === 'FRANCHISE' ||
    item.businessType ||
    item.preferredTerritory ||
    item.territoryDistrict ||
    item.investmentBudget
  );
};

export const isBulkEntity = (item: any): boolean => {
  if (!item) return false;
  return Boolean(
    item.enquiryType === 'BULK_PRODUCT' ||
    item.enquiryType === 'BULK' ||
    item.enquiryCategory === 'BULK' ||
    (Array.isArray(item.products) && item.products.length > 0)
  );
};

/**
 * Normalizes any entity (enquiry, career application, custom recipient) into a standardized WhatsApp recipient
 */
export const normalizeWhatsAppRecipient = (input: any): NormalizedWhatsAppRecipient => {
  if (!input) {
    return {
      category: 'PRODUCT',
      recipientName: 'Valued Client',
      recipientPhone: ZEAL_OFFICIAL_PHONE,
      cleanPhone: `91${ZEAL_OFFICIAL_PHONE}`,
    };
  }

  // If passed an entity inside .enquiry or .recipient
  const entity = input.enquiry || input.recipient || input;

  let category: WhatsAppEnquiryCategory = input.category || entity.category;
  if (!category) {
    if (isCareerEntity(entity)) {
      category = 'CAREER';
    } else if (isFranchiseEntity(entity)) {
      category = 'FRANCHISE';
    } else if (isBulkEntity(entity)) {
      category = 'BULK';
    } else {
      category = 'PRODUCT';
    }
  }

  const rawPhone =
    input.recipientPhone ||
    entity.whatsappNumber ||
    entity.phone ||
    entity.mobile ||
    ZEAL_OFFICIAL_PHONE;

  const recipientName =
    input.recipientName ||
    entity.fullName ||
    entity.name ||
    'Associate';

  let referenceTitle = input.referenceTitle || entity.referenceTitle;
  if (!referenceTitle) {
    if (category === 'CAREER') {
      referenceTitle = entity.positionAppliedFor || entity.jobTitle || 'Career Candidate';
    } else if (category === 'FRANCHISE') {
      referenceTitle = entity.preferredTerritory || entity.territoryDistrict || entity.city || 'District Monopoly';
    } else if (category === 'BULK') {
      const pLen = Array.isArray(entity.products) ? entity.products.length : 0;
      referenceTitle = `${pLen || 1} Bulk Formulations`;
    } else {
      referenceTitle =
        typeof entity.product === 'object' && entity.product?.name
          ? entity.product.name
          : typeof entity.product === 'string'
          ? entity.product
          : entity.productName || 'Pharmaceutical Formulation';
    }
  }

  const details: WhatsAppTemplateDetails = {
    city: input.details?.city || entity.city || entity.currentCity,
    state: input.details?.state || entity.state || entity.currentState,
    companyName: input.details?.companyName || entity.companyName || entity.currentCompany,
    itemCount: input.details?.itemCount || (Array.isArray(entity.products) ? entity.products.length : undefined),
    interviewDate: input.details?.interviewDate || entity.interviewDate,
    interviewMode: input.details?.interviewMode || entity.interviewMode,
    meetingLink: input.details?.meetingLink || entity.meetingLink,
    qualification: input.details?.qualification || entity.qualification,
    experience: input.details?.experience || entity.totalExperienceYears,
    dosageForm: input.details?.dosageForm || entity.dosageForm,
    packaging: input.details?.packaging || entity.packaging,
  };

  return {
    category,
    recipientName,
    recipientPhone: rawPhone,
    cleanPhone: cleanWhatsAppPhone(rawPhone),
    currentStatus: input.currentStatus || entity.status,
    referenceTitle,
    details,
    referenceId: entity._id,
  };
};
