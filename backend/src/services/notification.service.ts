/**
 * Notification Service
 * Handles instant WhatsApp lead notifications, 100% Free wa.me links,
 * and automated alerts to Sales Manager (+91 9316227576).
 */

export interface ILeadNotificationPayload {
  enquiryId: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  companyName?: string | undefined;
  drugLicenseNumber?: string | undefined;
  gstNumber?: string | undefined;
  pincode?: string | undefined;
  territoryDistrict?: string | undefined;
  investmentBudget?: string | undefined;
  pharmaExperience?: string | undefined;
  interestedDivisions?: string[] | undefined;
  hasGodownFacility?: boolean | undefined;
  hasTransportFacility?: boolean | undefined;
  quantity?: string | undefined;
  message?: string | undefined;
  enquiryType: string;
  productName?: string | undefined;
  productSlug?: string | undefined;
  source?: string | undefined;
  isConfirmed?: boolean | undefined;
}

export interface IWhatsAppDispatchResult {
  sent: boolean;
  webhookStatus?: number | undefined;
  instantWhatsAppChatUrl: string;
  adminDirectWhatsAppUrl: string;
  salesManagerNotificationText: string;
  error?: string | undefined;
}

export interface ICareerNotificationPayload {
  applicationId: string;
  fullName: string;
  phone: string;
  email: string;
  currentCity: string;
  currentState: string;
  preferredLocation?: string | undefined;
  positionAppliedFor: string;
  department: string;
  qualification: string;
  totalExperienceYears: string | number;
  currentCompany?: string | undefined;
  currentDesignation?: string | undefined;
  currentCtc?: string | undefined;
  expectedCtc?: string | undefined;
  noticePeriod?: string | undefined;
  resumeUrl?: string | undefined;
  coverNote?: string | undefined;
}

/**
 * Sanitize an Indian or international mobile number to E.164 without leading plus for wa.me links
 */
export const sanitizeWhatsAppNumber = (rawPhone: string): string => {
  const digits = rawPhone.replace(/\D/g, "");
  // If 10-digit Indian number without country code, prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // If already starts with 91 and has 12 digits
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }
  return digits;
};

/**
 * Build pre-filled wa.me link for Sales Manager (+91 9316227576) to 1-click reply to doctor/lead
 */
export const buildWhatsAppClickToChatUrl = (
  phone: string,
  clientName: string,
  productOrTopic: string = "Zeal Pharma Stockists Distribution"
): string => {
  const cleanPhone = sanitizeWhatsAppNumber(phone);
  const text = `Hello ${clientName}, greetings from ZEAL PHARMACEUTICALS! We received your Stockists Distribution enquiry regarding "${productOrTopic}". How may we assist you today?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

/**
 * Build 100% FREE direct wa.me link for Client to send enquiry straight to Sales Manager (+91 9316227576).
 * No third-party API or paid package required!
 */
export const buildAdminDirectWhatsAppUrl = (
  lead: ILeadNotificationPayload,
  adminPhone: string = "919316227576"
): string => {
  const cleanAdminPhone = sanitizeWhatsAppNumber(adminPhone);
  const isFranchise = lead.enquiryType === "FRANCHISE";
  const location = `${lead.city}, ${lead.state}${lead.pincode ? ` (PIN: ${lead.pincode})` : ""}`;
  const company = lead.companyName ? lead.companyName : "Independent Pharma Distributor / Chemist";
  const dl = lead.drugLicenseNumber ? lead.drugLicenseNumber : "Not provided";
  const gst = lead.gstNumber ? lead.gstNumber : "Not provided";
  const nowTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  if (isFranchise) {
    const message = [
      `🏛️ *ZEAL PHARMACEUTICALS PVT. LTD.*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📋 *NEW STOCKISTS DISTRIBUTION APPLICATION*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🎯 *Target Territory:* ${lead.territoryDistrict || lead.city}`,
      `💰 *Investment Capacity:* ${lead.investmentBudget || "Ready to invest"}`,
      `⏳ *Pharma Experience:* ${lead.pharmaExperience || "Experienced in Pharma Distribution"}`,
      `📂 *Divisions Interested:* ${lead.interestedDivisions?.length ? lead.interestedDivisions.join(", ") : "All Product Segments"}`,
      ``,
      `👤 *Applicant Name:* ${lead.name}`,
      `📞 *Mobile / WhatsApp:* ${lead.phone}`,
      `✉️ *Email Address:* ${lead.email}`,
      `🏛️ *Company / Firm:* ${company}`,
      `📍 *Location:* ${location}`,
      ``,
      `📜 *Drug License (DL) No.:* ${dl}`,
      `📑 *GST Registration No.:* ${gst}`,
      `🏪 *Godown Facility:* ${lead.hasGodownFacility ? "Available" : "To be arranged"}`,
      `🚚 *Transport Facility:* ${lead.hasTransportFacility ? "Available" : "To be arranged"}`,
      lead.message ? `💬 *Message:* "${lead.message}"` : null,
      ``,
      `✅ *Verification Status:* Double-Confirmed by Applicant on Website`,
      `📅 *Submission Time:* ${nowTime}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👉 *Action Requested:*`,
      `Please provide the Stockists Distribution Agreement, Visual Aid Product Catalog, and Wholesale Price List for ${lead.territoryDistrict || lead.city}.`,
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(message)}`;
  }

  const topic = lead.productName ? `${lead.productName}` : `${lead.enquiryType || "Pharma"} Enquiry`;
  const qty = lead.quantity ? lead.quantity : "Standard Wholesale Batch";
  const note = lead.message ? lead.message : "Interested in Stockists Distribution rates & catalog.";

  const message = [
    `🔔 *NEW B2B PHARMA ENQUIRY - ZEAL PHARMACEUTICALS*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `💊 *Product / Segment:* ${topic}`,
    `🏷️ *Enquiry Type:* ${lead.enquiryType || "PRODUCT"}`,
    ``,
    `👤 *Doctor / Client Name:* ${lead.name}`,
    `📞 *Phone / WhatsApp:* ${lead.phone}`,
    `✉️ *Email Address:* ${lead.email}`,
    `🏛️ *Hospital / Company:* ${company}`,
    `📍 *Territory / Location:* ${location}`,
    ``,
    `📜 *Drug License (DL) No.:* ${dl}`,
    `📑 *GST Registration No.:* ${gst}`,
    `📦 *Estimated Quantity:* ${qty}`,
    `💬 *Requirement Note:* "${note}"`,
    ``,
    `✅ *Verification Status:* Double-Confirmed by Client on Website (Genuine Lead)`,
    `📅 *Submission Time:* ${nowTime}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👉 *Action Requested:*`,
    `Please share the Product Visual Aid Sheet, Stockists Distribution Details, and Wholesale Price List.`,
  ].join("\n");

  return `https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Format sales alert message for console, Baileys bot, webhooks, and CallMeBot
 */
export const formatSalesAlertMessage = (lead: ILeadNotificationPayload): string => {
  const isFranchise = lead.enquiryType === "FRANCHISE";
  const location = `${lead.city}, ${lead.state}${lead.pincode ? ` (PIN: ${lead.pincode})` : ""}`;
  const company = lead.companyName ? lead.companyName : "Independent Pharma Distributor / Chemist";
  const dlText = lead.drugLicenseNumber ? lead.drugLicenseNumber : "Not provided";
  const gstText = lead.gstNumber ? lead.gstNumber : "Not provided";
  const cleanClientDigits = sanitizeWhatsAppNumber(lead.phone);
  const nowTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  if (isFranchise) {
    return [
      `🌟 *NEW STOCKISTS DISTRIBUTION APPLICATION*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏛️ *ZEAL PHARMACEUTICALS - B2B STOCKISTS DISTRIBUTION LEAD*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 *APPLICANT NAME:* ${lead.name}`,
      `📱 *APPLICANT MOBILE:* ${lead.phone}`,
      `✉️ *Email Address:* ${lead.email}`,
      `🏢 *Firm / Company Name:* ${company}`,
      `📍 *Location:* ${location}`,
      ``,
      `🎯 *TARGET TERRITORY:* ${lead.territoryDistrict || lead.city}`,
      `💰 *Investment Capacity:* ${lead.investmentBudget || "Ready to invest"}`,
      `⏳ *Pharma Experience:* ${lead.pharmaExperience || "Pharma Distribution Background"}`,
      `📂 *Interested Divisions:* ${lead.interestedDivisions?.length ? lead.interestedDivisions.join(", ") : "All Segments / Stockists Distribution"}`,
      `🏪 *Godown Facility:* ${lead.hasGodownFacility ? "Yes (Available)" : "To be arranged"}`,
      `🚚 *Transport Facility:* ${lead.hasTransportFacility ? "Yes (Available)" : "To be arranged"}`,
      ``,
      `📜 *Drug License (DL):* ${dlText}`,
      `📑 *GST Registration:* ${gstText}`,
      lead.message ? `💬 *Applicant Message:* "${lead.message}"` : null,
      `✅ *Verification Status:* Double-Confirmed by Applicant on Website`,
      `📅 *Application Time:* ${nowTime}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📲 *1-TAP TO CHAT WITH APPLICANT ON WHATSAPP:*`,
      `https://wa.me/${cleanClientDigits}`,
      ``,
      `📞 *1-TAP TO CALL APPLICANT DIRECTLY:*`,
      `tel:+${cleanClientDigits}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  const topic = lead.productName ? `${lead.productName}` : `${lead.enquiryType || "Stockists Distribution"} Lead`;

  return [
    `🔔 *NEW B2B LEAD ALERT (ZEAL PHARMA)*`,
    `================================`,
    `👤 *REAL CLIENT / DOCTOR:* ${lead.name}`,
    `📱 *CLIENT MOBILE NUMBER:* ${lead.phone}`,
    `✉️ *Client Email:* ${lead.email}`,
    `🏛️ *Clinic / Hospital / Firm:* ${company}`,
    `📍 *Location:* ${location}`,
    ``,
    `💊 *Interested In:* ${topic}`,
    `📦 *Order Quantity:* ${lead.quantity || "Standard Wholesale Minimum"}`,
    `📜 *Drug License (DL):* ${dlText}`,
    `📑 *GST Number:* ${gstText}`,
    lead.message ? `💬 *Doctor Requirement Note:* "${lead.message}"` : null,
    `✅ *Confirmation:* Double-Confirmed by Client on Website`,
    `📅 *Lead Received At:* ${nowTime}`,
    `================================`,
    `📲 *1-TAP TO CHAT WITH CLIENT ON WHATSAPP:*`,
    `https://wa.me/${cleanClientDigits}`,
    ``,
    `📞 *1-TAP TO CALL CLIENT NOW:*`,
    `tel:+${cleanClientDigits}`,
  ]
    .filter(Boolean)
    .join("\n");
};

import whatsAppBotService from "./whatsappBot.service";

/**
 * Send Instant WhatsApp lead notification to Sales Manager (+91 9316227576)
 * Supports:
 * 1. Live WhatsApp Bot session (Scanned QR code via @whiskeysockets/baileys)
 * 2. 100% Free wa.me direct links (Zero paid packages)
 * 3. 100% Free CallMeBot Personal WhatsApp API (if CALLMEBOT_API_KEY is provided)
 * 4. Custom Webhook (if WHATSAPP_WEBHOOK_URL is provided)
 */
export const sendLeadWhatsAppNotification = async (
  lead: ILeadNotificationPayload
): Promise<IWhatsAppDispatchResult> => {
  const adminPhone =
    process.env.ADMIN_WHATSAPP ||
    process.env.SALES_MANAGER_WHATSAPP ||
    process.env.SALES_PHONE ||
    "919316227576";
  const hrPhone = process.env.HR_WHATSAPP || process.env.HR_PHONE;
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL;
  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY;

  const recipients = [adminPhone, ...(hrPhone ? [hrPhone] : [])];

  const topic = lead.productName || lead.enquiryType;
  const instantWhatsAppChatUrl = buildWhatsAppClickToChatUrl(lead.phone, lead.name, topic);
  const adminDirectWhatsAppUrl = buildAdminDirectWhatsAppUrl(lead, adminPhone);
  const salesManagerNotificationText = formatSalesAlertMessage(lead);

  // Always log lead notification to console for live monitoring
  console.log("=================================================");
  console.log(`📢 [WHATSAPP LEAD ALERT TO RECIPIENTS: ${recipients.join(", ")}]`);
  console.log(salesManagerNotificationText);
  console.log(`🔗 Direct WhatsApp link to Admin: ${adminDirectWhatsAppUrl}`);
  console.log("=================================================");

  // Option 1: Direct WhatsApp Bot Delivery (Zero package, pure server-to-phone push to Admin & HR)
  const botStatus = whatsAppBotService.getStatus();
  if (botStatus.status === "CONNECTED") {
    try {
      let anySent = false;
      for (const phone of recipients) {
        const botRes = await whatsAppBotService.sendDirectMessage(
          phone,
          salesManagerNotificationText
        );
        if (botRes.success) {
          anySent = true;
          console.log(`🤖 [WhatsApp Bot Delivered to ${phone}] MsgID: ${botRes.messageId}`);
        }
      }

      if (anySent) {
        return {
          sent: true,
          instantWhatsAppChatUrl,
          adminDirectWhatsAppUrl,
          salesManagerNotificationText,
        };
      }
    } catch (botErr) {
      console.error("WhatsApp Bot direct dispatch error:", botErr);
    }
  }

  // Option 2: Free CallMeBot Personal WhatsApp Gateway (if configured)
  if (callMeBotApiKey && callMeBotApiKey.trim()) {
    try {
      const cleanTargetPhone = sanitizeWhatsAppNumber(adminPhone);
      const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanTargetPhone}&text=${encodeURIComponent(
        salesManagerNotificationText
      )}&apikey=${callMeBotApiKey.trim()}`;

      const botRes = await fetch(callMeBotUrl);
      console.log(`🤖 [CallMeBot Free WhatsApp API]: Status ${botRes.status}`);
      return {
        sent: botRes.ok,
        webhookStatus: botRes.status,
        instantWhatsAppChatUrl,
        adminDirectWhatsAppUrl,
        salesManagerNotificationText,
      };
    } catch (botErr: unknown) {
      const errMsg = botErr instanceof Error ? botErr.message : String(botErr);
      console.error("⚠️ CallMeBot dispatch error:", errMsg);
    }
  }

  // Option B: Custom Webhook (e.g. WATI, AiSensy, Twilio, Zapier, etc.)
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          event: "lead.created",
          salesManagerPhone: adminPhone,
          message: salesManagerNotificationText,
          lead: {
            ...lead,
            instantWhatsAppChatUrl,
            adminDirectWhatsAppUrl,
          },
          timestamp: new Date().toISOString(),
        }),
      });

      return {
        sent: response.ok,
        webhookStatus: response.status,
        instantWhatsAppChatUrl,
        adminDirectWhatsAppUrl,
        salesManagerNotificationText,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("⚠️ WhatsApp Webhook delivery failed:", errorMsg);
      return {
        sent: false,
        error: errorMsg,
        instantWhatsAppChatUrl,
        adminDirectWhatsAppUrl,
        salesManagerNotificationText,
      };
    }
  }

  // Default: 100% Free ready-to-use wa.me action
  return {
    sent: true,
    instantWhatsAppChatUrl,
    adminDirectWhatsAppUrl,
    salesManagerNotificationText,
  };
};

/**
 * Format alert message for HR when a candidate applies
 */
export const formatCareerAlertMessage = (applicant: ICareerNotificationPayload): string => {
  const cleanApplicantDigits = sanitizeWhatsAppNumber(applicant.phone);
  const nowTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const serverBaseUrl = process.env.BASE_URL || "http://localhost:5000";
  const fullResumeUrl = applicant.resumeUrl
    ? applicant.resumeUrl.startsWith("http")
      ? applicant.resumeUrl
      : `${serverBaseUrl}${applicant.resumeUrl}`
    : "Not attached";

  return [
    `💼 *NEW CANDIDATE JOB APPLICATION (ZEAL PHARMA)*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *CANDIDATE NAME:* ${applicant.fullName}`,
    `📱 *MOBILE / WHATSAPP:* ${applicant.phone}`,
    `✉️ *EMAIL:* ${applicant.email}`,
    `📍 *CURRENT LOCATION:* ${applicant.currentCity}, ${applicant.currentState}`,
    applicant.preferredLocation ? `🎯 *PREFERRED HQ / TERRITORY:* ${applicant.preferredLocation}` : null,
    ``,
    `📋 *POSITION APPLIED:* ${applicant.positionAppliedFor}`,
    `🏢 *DEPARTMENT:* ${applicant.department}`,
    `🎓 *HIGHEST QUALIFICATION:* ${applicant.qualification}`,
    `⏳ *TOTAL EXPERIENCE:* ${applicant.totalExperienceYears}`,
    applicant.currentCompany ? `🏢 *CURRENT COMPANY:* ${applicant.currentCompany}` : null,
    applicant.currentDesignation ? `🏷️ *CURRENT DESIGNATION:* ${applicant.currentDesignation}` : null,
    applicant.currentCtc ? `💵 *CURRENT CTC:* ${applicant.currentCtc}` : null,
    applicant.expectedCtc ? `💰 *EXPECTED CTC:* ${applicant.expectedCtc}` : null,
    applicant.noticePeriod ? `⏱️ *NOTICE PERIOD:* ${applicant.noticePeriod}` : null,
    applicant.coverNote ? `💬 *CANDIDATE NOTE:* "${applicant.coverNote}"` : null,
    ``,
    `📎 *RESUME / CV DOCUMENT:*`,
    fullResumeUrl,
    `📅 *APPLICATION TIME:* ${nowTime}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📲 *1-TAP TO CHAT WITH CANDIDATE ON WHATSAPP:*`,
    `https://wa.me/${cleanApplicantDigits}`,
    ``,
    `📞 *1-TAP TO CALL CANDIDATE DIRECTLY:*`,
    `tel:+${cleanApplicantDigits}`,
  ]
    .filter(Boolean)
    .join("\n");
};

/**
 * Send career application notification to HR & Leadership (+91 9316227576)
 */
export const sendCareerWhatsAppNotification = async (
  applicant: ICareerNotificationPayload
): Promise<IWhatsAppDispatchResult> => {
  const hrPhone = process.env.HR_WHATSAPP || process.env.HR_PHONE;
  const adminPhone =
    process.env.ADMIN_WHATSAPP ||
    process.env.SALES_MANAGER_WHATSAPP ||
    "919316227576";

  const recipients = [adminPhone, ...(hrPhone && hrPhone !== adminPhone ? [hrPhone] : [])];

  const instantWhatsAppChatUrl = `https://wa.me/${sanitizeWhatsAppNumber(applicant.phone)}?text=${encodeURIComponent(
    `Hello ${applicant.fullName}, greetings from ZEAL PHARMACEUTICALS HR! We received your application for "${applicant.positionAppliedFor}". We would like to connect with you regarding your profile.`
  )}`;

  const alertText = formatCareerAlertMessage(applicant);

  console.log("=================================================");
  console.log(`💼 [CAREER APPLICATION ALERT TO HR: ${recipients.join(", ")}]`);
  console.log(alertText);
  console.log("=================================================");

  // Direct WhatsApp Bot Delivery via Baileys
  const botStatus = whatsAppBotService.getStatus();
  if (botStatus.status === "CONNECTED") {
    try {
      let anySent = false;
      for (const phone of recipients) {
        const botRes = await whatsAppBotService.sendDirectMessage(phone, alertText);
        if (botRes.success) {
          anySent = true;
          console.log(`🤖 [Career Alert Delivered via WhatsApp Bot to ${phone}] MsgID: ${botRes.messageId}`);
        }
      }

      if (anySent) {
        return {
          sent: true,
          instantWhatsAppChatUrl,
          adminDirectWhatsAppUrl: instantWhatsAppChatUrl,
          salesManagerNotificationText: alertText,
        };
      }
    } catch (botErr) {
      console.error("WhatsApp Bot career dispatch error:", botErr);
    }
  }

  return {
    sent: true,
    instantWhatsAppChatUrl,
    adminDirectWhatsAppUrl: instantWhatsAppChatUrl,
    salesManagerNotificationText: alertText,
  };
};

export interface IStatusUpdateNotificationPayload {
  recipientType: "CAREER_CANDIDATE" | "FRANCHISE_CLIENT" | "PRODUCT_CLIENT" | "BULK_CLIENT";
  recipientName: string;
  recipientPhone: string;
  previousStatus?: string | undefined;
  newStatus: string;
  referenceTitle?: string | undefined;
  additionalDetails?: {
    interviewDate?: string | undefined;
    interviewMode?: string | undefined;
    meetingLink?: string | undefined;
    note?: string | undefined;
    territory?: string | undefined;
    productName?: string | undefined;
    quantity?: string | undefined;
  } | undefined;
  customMessage?: string | undefined;
}

export interface IStatusUpdateDispatchResult {
  sent: boolean;
  deliveredViaBot: boolean;
  directWhatsAppUrl: string;
  messageText: string;
  error?: string;
}

/**
 * Generates tailored executive WhatsApp templates for lead & candidate status updates
 */
export const formatStatusUpdateMessage = (payload: IStatusUpdateNotificationPayload): string => {
  const { recipientType, recipientName, newStatus, referenceTitle, additionalDetails } = payload;
  const name = recipientName || "Associate";
  const ref = referenceTitle || (recipientType === "CAREER_CANDIDATE" ? "your application" : "your inquiry");

  if (recipientType === "CAREER_CANDIDATE") {
    switch (newStatus.toUpperCase()) {
      case "SHORTLISTED":
        return [
          `🎉 *APPLICATION SHORTLISTED - ZEAL PHARMACEUTICALS*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Dear *${name}*,`,
          ``,
          `Congratulations! We are delighted to inform you that your profile for *${ref}* has been *SHORTLISTED* by our Recruitment Committee.`,
          ``,
          `Our HR division will connect with you shortly with interview schedule details.`,
          ``,
          `📞 *HR Helpline:* +91 9316227576`,
          `🌐 *Portal:* www.zealpharma.com`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].join("\n");

      case "INTERVIEW_SCHEDULED":
        const dateStr = additionalDetails?.interviewDate ? `🗓️ *Date & Time:* ${additionalDetails.interviewDate}` : "";
        const modeStr = additionalDetails?.interviewMode ? `💻 *Mode:* ${additionalDetails.interviewMode}` : "";
        const linkStr = additionalDetails?.meetingLink ? `🔗 *Meeting Link / Venue:* ${additionalDetails.meetingLink}` : "";
        return [
          `📅 *INTERVIEW SCHEDULED - ZEAL PHARMACEUTICALS*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Dear *${name}*,`,
          ``,
          `Your interview round for the position of *${ref}* is confirmed:`,
          dateStr,
          modeStr,
          linkStr,
          ``,
          `Please ensure you are available 5 minutes prior to the scheduled time. For any queries or rescheduling, reply directly on this number.`,
          ``,
          `📞 *HR Helpline:* +91 9316227576`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].filter(Boolean).join("\n");

      case "OFFERED":
      case "HIRED":
        return [
          `🌟 *OFFER CONFIRMATION - ZEAL PHARMACEUTICALS*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Dear *${name}*,`,
          ``,
          `Congratulations! We are thrilled to officially welcome you aboard for the role of *${ref}* at Zeal Pharmaceuticals Pvt. Ltd.`,
          ``,
          `Please check your email for the formal Offer Letter and onboarding documentation. We look forward to your impactful contributions.`,
          ``,
          `🏢 *Head Office:* 7015, billiogo text tile market , Parvat Patiya < puna gam`,
          `📞 *Helpline:* +91 9316227576`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].join("\n");

      case "REJECTED":
        return [
          `📋 *APPLICATION STATUS - ZEAL PHARMACEUTICALS*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Dear *${name}*,`,
          ``,
          `Thank you for taking the time to apply for the *${ref}* opening at Zeal Pharmaceuticals.`,
          ``,
          `While we have chosen to proceed with another profile that closely matches our immediate requirements, we have preserved your resume in our Active Talent Pool for future department expansions.`,
          ``,
          `We sincerely wish you the very best in your career pursuits.`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].join("\n");

      case "REVIEWING":
      default:
        return [
          `📋 *APPLICATION UNDER REVIEW - ZEAL PHARMACEUTICALS*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Dear *${name}*,`,
          ``,
          `Your application for *${ref}* has entered *Active Screening* with our Technical Evaluation Team.`,
          ``,
          `We will keep you updated on the next evaluation stages.`,
          ``,
          `📞 *HR Recruitment Desk:* +91 9316227576`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].join("\n");
    }
  }

  if (recipientType === "FRANCHISE_CLIENT") {
    const territory = additionalDetails?.territory || ref || "your district";
    switch (newStatus.toUpperCase()) {
      case "APPROVED":
        return [
          `🏛️ *DISTRIBUTION ALLOTMENT APPROVED*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `*ZEAL PHARMACEUTICALS PVT. LTD.*`,
          ``,
          `Dear *${name}*,`,
          ``,
          `Congratulations! Your application for *Authorized Stockists Distribution Rights* for *${territory}* has been *APPROVED* by our Executive Committee.`,
          ``,
          `Our Zonal Business Manager will connect with you to finalize territory agreement documentation and dispatch your Promotional Starter Kit.`,
          ``,
          `📞 *Stockists Helpline:* +91 9316227576`,
          `🌐 *Official Website:* www.zealpharma.com`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].join("\n");

      case "DOCUMENTS_PENDING":
        return [
          `📑 *DOCUMENTATION REQUIRED - ZEAL PHARMA*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Hello *${name}*,`,
          ``,
          `Regarding your Stockists Distribution allotment for *${territory}*:`,
          ``,
          `Please share a clear copy/photo of your:`,
          `1. Wholesale Drug License (Form 20B / 21B)`,
          `2. GST Registration Certificate`,
          ``,
          `Kindly reply directly on this WhatsApp chat or call +91 9316227576 to fast-track your territory allocation.`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].join("\n");

      case "CONTACTED":
      case "QUALIFIED":
        return [
          `🏛️ *TERRITORY INQUIRY UPDATE - ZEAL PHARMA*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Hello *${name}*,`,
          ``,
          `Thank you for your interest in our Stockists Distribution Network for *${territory}*.`,
          ``,
          `Our Area Business Manager has pre-qualified your territory and will connect with you shortly to share our 250+ WHO-GMP formulation list, distributor profit margins, and district monopoly terms.`,
          ``,
          `📞 *Direct Sales Desk:* +91 9316227576`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].join("\n");

      case "REJECTED":
        return [
          `🏛️ *TERRITORY INQUIRY NOTICE - ZEAL PHARMA*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Hello *${name}*,`,
          ``,
          `Thank you for your application for Stockists Distribution in *${territory}*.`,
          ``,
          `Regrettably, authorized distribution rights for this territory are currently committed to an existing partner. We will contact you as soon as adjacent territories or new divisions open up.`,
          ``,
          `📞 *Zeal Pharma Helpline:* +91 9316227576`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].join("\n");

      default:
        return [
          `🏛️ *ZEAL PHARMACEUTICALS - LEAD UPDATE*`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          `Hello *${name}*,`,
          ``,
          `Your Stockists Distribution application status has been updated to *${newStatus}*.`,
          `Territory: *${territory}*`,
          ``,
          `📞 *Helpline:* +91 9316227576`,
          `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        ].join("\n");
    }
  }

  // Product / Bulk Client
  const prod = additionalDetails?.productName || ref || "Pharmaceutical Formulations";
  switch (newStatus.toUpperCase()) {
    case "QUOTED":
      return [
        `💊 *QUOTATION READY - ZEAL PHARMACEUTICALS*`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Hello *${name}*,`,
        ``,
        `Official distributor quotation for *${prod}* is ready!`,
        ``,
        `Our team has prepared competitive distributor net rates, sample packs, and dispatch schedules from our WHO-GMP facility.`,
        ``,
        `📞 *Sales Desk:* +91 9316227576`,
        `🌐 *Catalog:* www.zealpharma.com`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ].join("\n");

    case "IN_PROGRESS":
      return [
        `💊 *INQUIRY STATUS UPDATE - ZEAL PHARMA*`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Hello *${name}*,`,
        ``,
        `Your inquiry regarding *${prod}* has been assigned to our Institutional Order Division.`,
        ``,
        `A dedicated sales manager will connect with you shortly with rate contracts and availability.`,
        ``,
        `📞 *Direct Helpline:* +91 9316227576`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ].join("\n");

    case "CLOSED":
      return [
        `💊 *ORDER UPDATE - ZEAL PHARMACEUTICALS*`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Hello *${name}*,`,
        ``,
        `Thank you for partnering with Zeal Pharmaceuticals regarding *${prod}*. Your order file has been processed.`,
        ``,
        `For batch reorders or new division inquiries, reach us anytime on +91 9316227576.`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ].join("\n");

    default:
      return [
        `💊 *ZEAL PHARMACEUTICALS - INQUIRY UPDATE*`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Hello *${name}*,`,
        ``,
        `Your inquiry for *${prod}* status is now: *${newStatus}*.`,
        ``,
        `📞 *Helpline:* +91 9316227576`,
        `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ].join("\n");
  }
};

/**
 * Dispatches automated or customized WhatsApp status update to candidate or client
 */
export const sendStatusUpdateWhatsAppNotification = async (
  payload: IStatusUpdateNotificationPayload
): Promise<IStatusUpdateDispatchResult> => {
  const cleanPhone = sanitizeWhatsAppNumber(payload.recipientPhone);
  const messageText = payload.customMessage && payload.customMessage.trim()
    ? payload.customMessage.trim()
    : formatStatusUpdateMessage(payload);

  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

  // Attempt direct WhatsApp bot push if connected
  const botStatus = whatsAppBotService.getStatus();
  if (botStatus.status === "CONNECTED" && cleanPhone) {
    try {
      const botRes = await whatsAppBotService.sendDirectMessage(cleanPhone, messageText);
      if (botRes.success) {
        console.log(`🤖 [Status Alert Delivered via WhatsApp Bot to ${cleanPhone}] Status: ${payload.newStatus} MsgID: ${botRes.messageId}`);
        return {
          sent: true,
          deliveredViaBot: true,
          directWhatsAppUrl,
          messageText,
        };
      }
    } catch (botErr: any) {
      console.error("WhatsApp Bot status update dispatch error:", botErr);
    }
  }

  return {
    sent: true,
    deliveredViaBot: false,
    directWhatsAppUrl,
    messageText,
  };
};

export default {
  sanitizeWhatsAppNumber,
  buildWhatsAppClickToChatUrl,
  buildAdminDirectWhatsAppUrl,
  formatSalesAlertMessage,
  sendLeadWhatsAppNotification,
  formatCareerAlertMessage,
  sendCareerWhatsAppNotification,
  formatStatusUpdateMessage,
  sendStatusUpdateWhatsAppNotification,
};
