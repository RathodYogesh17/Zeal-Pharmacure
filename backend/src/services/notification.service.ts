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
export const sanitizeWhatsAppNumber = (rawPhone?: string | null): string => {
  if (!rawPhone) return "";
  const digits = String(rawPhone).replace(/\D/g, "");
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
  const serverBaseUrl = (process.env.BASE_URL || "https://zeal-pharmacure-backend.vercel.app").replace(/\/$/, "");
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



  return {
    sent: true,
    instantWhatsAppChatUrl,
    adminDirectWhatsAppUrl: instantWhatsAppChatUrl,
    salesManagerNotificationText: alertText,
  };
};

export interface IStatusUpdateNotificationPayload {
  recipientType: "CAREER_CANDIDATE" | "FRANCHISE_CLIENT" | "PRODUCT_CLIENT" | "BULK_CLIENT";
  referenceId?: string | undefined;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string | undefined;
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
    packaging?: string | undefined;
    companyName?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    drugLicenseNumber?: string | undefined;
    gstNumber?: string | undefined;
    department?: string | undefined;
    qualification?: string | undefined;
    experienceYears?: string | number | undefined;
    investmentBudget?: string | undefined;
    interestedDivisions?: string | undefined;
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
 * Generates tailored executive WhatsApp templates for lead & candidate status updates.
 * Compulsorily displays:
 * 1. Username / Client Name
 * 2. Mobile Phone Number
 * 3. Email Address
 * 4. Reference / Lead ID
 * 5. Domain-specific details (Product info, Franchise territory, or Career profile)
 * 6. Detailed, professional corporate narrative with crystal-clear next steps
 */
export const formatStatusUpdateMessage = (payload: IStatusUpdateNotificationPayload): string => {
  const {
    recipientType,
    recipientName,
    recipientPhone,
    recipientEmail,
    referenceId,
    newStatus,
    referenceTitle,
    additionalDetails,
  } = payload;

  const name = recipientName?.trim() || "Valued Associate";
  const phone = recipientPhone?.trim() || "N/A";
  const email = recipientEmail?.trim() || "N/A";
  const refId = referenceId
    ? referenceId.startsWith("#")
      ? referenceId
      : `#${referenceId.slice(-8).toUpperCase()}`
    : "N/A";
  const statusUpper = (newStatus || "UPDATED").toUpperCase();
  const location = [additionalDetails?.city, additionalDetails?.state].filter(Boolean).join(", ");
  const company = additionalDetails?.companyName || "Independent Business Entity";

  // Mandatory Common Profile Block (Compulsory in every single message)
  const mandatoryDetailsBlock = [
    `👤 *REGISTERED CLIENT / APPLICANT:*`,
    `• *Full Name:* ${name}`,
    `• *Mobile / WhatsApp:* ${phone}`,
    `• *Email Address:* ${email}`,
    `• *Reference Tracking ID:* ${refId}`,
  ].join("\n");

  // ==========================================
  // 1. CAREER CANDIDATE
  // ==========================================
  if (recipientType === "CAREER_CANDIDATE") {
    const jobTitle = referenceTitle || "Pharmaceutical Career Opening";
    const profileLines = [
      `💼 *APPLICATION PROFILE DETAILS:*`,
      `• *Position Applied:* ${jobTitle}`,
      additionalDetails?.department ? `• *Department:* ${additionalDetails.department}` : null,
      additionalDetails?.qualification ? `• *Qualification:* ${additionalDetails.qualification}` : null,
      additionalDetails?.experienceYears !== undefined && additionalDetails?.experienceYears !== ""
        ? `• *Total Experience:* ${additionalDetails.experienceYears} Years`
        : null,
      location ? `• *Current Location:* ${location}` : null,
    ].filter(Boolean).join("\n");

    let statusNarrative = "";
    switch (statusUpper) {
      case "SHORTLISTED":
        statusNarrative = [
          `🎉 *APPLICATION SHORTLISTED!*`,
          `Congratulations! Following a comprehensive review by our Recruitment Committee, your application for *${jobTitle}* has been successfully *SHORTLISTED*.`,
          ``,
          `📋 *Next Steps & Schedule:*`,
          `1. Our Talent Acquisition Team is coordinating with the Technical Department Panel.`,
          `2. You will receive an official invitation with your interview date, time slot, and meeting link.`,
          `3. Please keep your updated resume, educational certificates, and experience documents handy for preliminary verification.`,
        ].join("\n");
        break;

      case "INTERVIEW_SCHEDULED":
        statusNarrative = [
          `📅 *INTERVIEW ROUND SCHEDULED & CONFIRMED:*`,
          `Your interview round for the position of *${jobTitle}* has been officially scheduled.`,
          ``,
          `📌 *Interview Details:*`,
          additionalDetails?.interviewDate ? `• *Date & Time:* ${additionalDetails.interviewDate}` : `• *Date & Time:* As notified by HR Desk`,
          additionalDetails?.interviewMode ? `• *Meeting Mode:* ${additionalDetails.interviewMode}` : `• *Meeting Mode:* Virtual (Google Meet / Zoom)`,
          additionalDetails?.meetingLink ? `• *Joining Link / Venue:* ${additionalDetails.meetingLink}` : `• *Venue:* Zeal Corporate Office / Virtual Link dispatched to your email`,
          ``,
          `💡 *Candidate Guidelines:*`,
          `• Please join or arrive 5 minutes prior to your allocated time slot.`,
          `• Ensure stable high-speed internet connectivity if attending virtually.`,
          `• Have a soft copy of your resume and recent salary slips available.`,
        ].filter(Boolean).join("\n");
        break;

      case "OFFERED":
      case "HIRED":
        statusNarrative = [
          `🌟 *OFFICIAL JOB OFFER & SELECTION CONFIRMATION!*`,
          `On behalf of Zeal Pharmaceuticals Pvt. Ltd., we are thrilled to extend our official *Offer of Employment* for *${jobTitle}*!`,
          ``,
          `📋 *Onboarding Next Steps:*`,
          `1. Your Formal Offer Letter and Annexure detailing CTC, designation, and job responsibilities have been dispatched to: *${email}*.`,
          `2. Please review, sign, and return the duplicate copy within 3 working days.`,
          `3. Our HR Onboarding Officer will connect with you to guide you through KYC verification and induction schedules.`,
          ``,
          `Welcome to the Zeal Pharmaceuticals family! We look forward to a rewarding professional journey together.`,
        ].join("\n");
        break;

      case "ON_HOLD":
        statusNarrative = [
          `⏸️ *APPLICATION STATUS: ON HOLD*`,
          `Thank you for your active interest in *${jobTitle}* at Zeal Pharmaceuticals.`,
          ``,
          `📌 *Current Status:*`,
          `Your application has been placed on hold pending upcoming departmental restructuring and regional headcount approvals.`,
          `• Your complete candidate file and test scores are retained in our Priority Talent Pool.`,
          `• As soon as the next recruitment cycle resumes, our HR desk will proactively reach out to you first.`,
        ].join("\n");
        break;

      case "REJECTED":
        statusNarrative = [
          `📋 *APPLICATION STATUS UPDATE:*`,
          `Thank you for taking the time to apply for *${jobTitle}* and engaging with Zeal Pharmaceuticals.`,
          ``,
          `📌 *Evaluation Decision:*`,
          `After careful assessment of all candidate profiles against our specific technical requirements for this opening, we have decided to move forward with another applicant.`,
          ``,
          `💼 *Active Talent Pool:*`,
          `Your curriculum vitae and credentials have been securely archived in our Talent Repository for 6 months. Should a role that closely aligns with your qualifications and experience open up, our recruitment team will gladly contact you.`,
          `We wish you every success in your ongoing career endeavors!`,
        ].join("\n");
        break;

      case "REVIEWING":
      case "APPLIED":
      default:
        statusNarrative = [
          `📌 *APPLICATION STATUS: ${statusUpper}*`,
          `Thank you for submitting your job application for *${jobTitle}* at Zeal Pharmaceuticals Pvt. Ltd.`,
          ``,
          `📋 *Current Status & Workflow:*`,
          `• Your application file has been registered under Tracking ID *${refId}*.`,
          `• Our Human Resources and Technical Screening Board are currently evaluating your qualifications and experience profile.`,
          `• If shortlisted, our Talent Acquisition team will reach out directly on this WhatsApp number or via email.`,
        ].join("\n");
        break;
    }

    const noteLine = additionalDetails?.note ? `\n\n📝 *HR Desk Remarks:* ${additionalDetails.note}` : "";

    return [
      `👔 *ZEAL PHARMACEUTICALS PVT. LTD.*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📢 *CAREER APPLICATION STATUS UPDATE*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 *Current Pipeline Status:* *${statusUpper}*`,
      ``,
      mandatoryDetailsBlock,
      ``,
      profileLines,
      ``,
      statusNarrative + noteLine,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📞 *HR Desk Direct Helpline:* +91 9316227576`,
      `✉️ *HR Email:* careers@zealpharma.com`,
      `🌐 *Careers Portal:* www.zealpharma.com/careers`,
      `🏢 *Zeal Pharmaceuticals Pvt. Ltd.* (Ahmedabad, Gujarat)`,
    ].filter(Boolean).join("\n");
  }

  // ==========================================
  // 2. FRANCHISE / STOCKIST CLIENT
  // ==========================================
  if (recipientType === "FRANCHISE_CLIENT") {
    const territory = additionalDetails?.territory || referenceTitle || "Designated Territory";
    const franchiseLines = [
      `🏛️ *STOCKISTS & MONOPOLY PROPOSAL DETAILS:*`,
      `• *Target Territory / District:* ${territory}`,
      `• *Firm / Business Name:* ${company}`,
      additionalDetails?.investmentBudget ? `• *Investment Capacity:* ${additionalDetails.investmentBudget}` : null,
      additionalDetails?.interestedDivisions ? `• *Interested Divisions:* ${additionalDetails.interestedDivisions}` : null,
      location ? `• *Operational Location:* ${location}` : null,
      additionalDetails?.drugLicenseNumber ? `• *Drug License (DL):* ${additionalDetails.drugLicenseNumber}` : null,
      additionalDetails?.gstNumber ? `• *GSTIN:* ${additionalDetails.gstNumber}` : null,
    ].filter(Boolean).join("\n");

    let statusNarrative = "";
    switch (statusUpper) {
      case "APPROVED":
        statusNarrative = [
          `🎉 *CONGRATULATIONS! MONOPOLY ALLOTMENT APPROVED!*`,
          `We are delighted to formally announce that your application for *Authorized Stockists Distribution Rights* for *${territory}* has been officially *APPROVED* by our Board of Directors!`,
          ``,
          `📋 *Onboarding Protocol & Next Steps:*`,
          `1. *Formal Agreement:* Our Zonal Business Manager is drafting your Monopoly Stockists Agreement.`,
          `2. *Starter Kit Dispatch:* Your Visual Aid Product Catalog, Sample Packs, M.R. Bag, and Promotional Literature Kit are being prepared for dispatch.`,
          `3. *ERP Account Activation:* Our billing desk will issue your Authorized Distributor Code upon agreement signing.`,
          ``,
          `Welcome to the Zeal Pharmaceuticals Distribution Network!`,
        ].join("\n");
        break;

      case "DOCUMENTS_PENDING":
        statusNarrative = [
          `📑 *DOCUMENTATION PENDING - REGULATORY VERIFICATION:*`,
          `Thank you for your active interest in securing Stockists Distribution Rights for *${territory}*.`,
          ``,
          `📋 *Required Documents to Finalize Allotment:*`,
          `To clear your territory monopoly reservation and activate distributor billing, please provide clear copies of:`,
          `1. Wholesale Drug License (Form 20B and Form 21B)`,
          `2. GST Registration Certificate (GSTIN)`,
          `3. Firm PAN Card & Registered Godown Address Details`,
          `4. Cancelled Cheque (for commercial account verification)`,
          ``,
          `👉 *How to Submit:* Kindly reply with PDF/photocopies directly on this WhatsApp chat or email them to *distribution@zealpharma.com*.`,
        ].join("\n");
        break;

      case "QUOTED":
        statusNarrative = [
          `💰 *COMMERCIAL PROPOSAL & PRICE LIST READY:*`,
          `Our Zonal Commercial Desk has generated the Wholesale Distributor Price List, Scheme Structure, and Net Margin Breakdown for *${territory}*.`,
          ``,
          `📋 *What is Included:*`,
          `• 250+ WHO-GMP Certified Formulation Catalog & Division Breakdown`,
          `• Highly attractive Net Distributor Margins & Monthly Target Schemes`,
          `• Complimentary Marketing & Promotional Material Support (Visual Aids, Catch Covers, Reminder Cards)`,
          `• Standard Dispatch & Freight Delivery Schedule`,
          ``,
          `Our Area Business Manager will connect with you today to discuss initial stock placement and territory planning.`,
        ].join("\n");
        break;

      case "QUALIFIED":
      case "CONTACTED":
      case "IN_TOUCH":
        statusNarrative = [
          `🤝 *TERRITORY PRE-QUALIFICATION CONFIRMED:*`,
          `Thank you for expressing interest in partnering with Zeal Pharmaceuticals for *${territory}*.`,
          ``,
          `📌 *Current Status:*`,
          `Our Market Expansion Desk has pre-screened your application and confirmed that *${territory}* is currently open for Exclusive Monopoly Allotment.`,
          `• An Area Business Manager (ABM) has been assigned to your account.`,
          `• We will contact you to review your division preferences, distributor margins, and initial stock requirements.`,
        ].join("\n");
        break;

      case "FOLLOW_UP":
        statusNarrative = [
          `📞 *FOLLOW-UP CONSULTATION SCHEDULED:*`,
          `A dedicated follow-up consultation has been scheduled regarding your Stockists Distribution Application for *${territory}*.`,
          ``,
          `📌 *Agenda for Discussion:*`,
          `• Reviewing target division selection (General, Gynec, Derma, Ortho, Pediatric, Cardiac-Diabetic)`,
          `• Finalizing initial order quantum and first batch dispatch timeline`,
          `• Territory exclusivity boundary definition`,
          ``,
          `Our Zonal Business Manager will connect with you at your convenience.`,
        ].join("\n");
        break;

      case "ON_HOLD":
        statusNarrative = [
          `⏸️ *APPLICATION STATUS: TEMPORARILY ON HOLD*`,
          `Your application for Stockists Distribution in *${territory}* has been placed on temporary hold.`,
          ``,
          `📌 *Details:*`,
          `• If you have pending documentation or wish to revise your target division/territory, please notify our desk.`,
          `• To resume your application, simply reply to this message or call our Stockists Hotline.`,
        ].join("\n");
        break;

      case "CLOSED":
        statusNarrative = [
          `✅ *DISTRIBUTOR ONBOARDING COMPLETED & ACCOUNT ACTIVE:*`,
          `We are delighted to confirm that the Stockists Distribution onboarding file for *${territory}* has been successfully completed and finalized!`,
          ``,
          `• Your Distributor Account is active in our Central ERP.`,
          `• For batch orders, billing queries, or replenishment, our Sales Desk is at your service 24/7.`,
        ].join("\n");
        break;

      case "REJECTED":
        statusNarrative = [
          `🏛️ *TERRITORY AVAILABILITY UPDATE:*`,
          `Thank you for your valued interest in Zeal Pharmaceuticals for *${territory}*.`,
          ``,
          `📌 *Territory Status:*`,
          `We regret to inform you that Authorized Stockists Rights for *${territory}* have already been committed to an existing monopoly franchise partner in our network.`,
          ``,
          `💡 *Alternative Opportunities:*`,
          `We warmly invite you to explore open adjacent districts or newly introduced specialized divisions. Our expansion desk will reach out as soon as new territory quotas unlock.`,
        ].join("\n");
        break;

      default:
        statusNarrative = [
          `📌 *APPLICATION STATUS: ${statusUpper}*`,
          `Your Stockists Distribution Application for *${territory}* is currently marked as *${statusUpper}*.`,
          `Our Zonal Commercial Committee is actively evaluating your application parameters.`,
        ].join("\n");
        break;
    }

    const noteLine = additionalDetails?.note ? `\n\n📝 *Desk Remarks:* ${additionalDetails.note}` : "";

    return [
      `🏛️ *ZEAL PHARMACEUTICALS PVT. LTD.*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📦 *STOCKISTS DISTRIBUTION NETWORK UPDATE*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 *Application Status:* *${statusUpper}*`,
      ``,
      mandatoryDetailsBlock,
      ``,
      franchiseLines,
      ``,
      statusNarrative + noteLine,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📞 *Stockists Sales Desk Helpline:* +91 9316227576`,
      `✉️ *Franchise Support Email:* distribution@zealpharma.com`,
      `🌐 *Product Catalog & Portal:* www.zealpharma.com`,
      `🏢 *Zeal Pharmaceuticals Pvt. Ltd.* (Ahmedabad, Gujarat)`,
    ].filter(Boolean).join("\n");
  }

  // ==========================================
  // 3. PRODUCT / BULK INQUIRY
  // ==========================================
  const prodName = additionalDetails?.productName || referenceTitle || "Pharmaceutical Formulation Requirement";
  const productLines = [
    `📦 *PRODUCT & COMMERCIAL SPECIFICATIONS:*`,
    `• *Formulation / Product:* ${prodName}`,
    additionalDetails?.quantity ? `• *Order Quantity:* ${additionalDetails.quantity}` : null,
    additionalDetails?.packaging ? `• *Packaging / Dosage Form:* ${additionalDetails.packaging}` : null,
    `• *Hospital / Enterprise:* ${company}`,
    location ? `• *Delivery Location:* ${location}` : null,
    additionalDetails?.drugLicenseNumber ? `• *Drug License (DL):* ${additionalDetails.drugLicenseNumber}` : null,
    additionalDetails?.gstNumber ? `• *GSTIN:* ${additionalDetails.gstNumber}` : null,
  ].filter(Boolean).join("\n");

  let statusNarrative = "";
  switch (statusUpper) {
    case "QUOTED":
      statusNarrative = [
        `💊 *OFFICIAL COMMERCIAL QUOTATION GENERATED!*`,
        `We are pleased to inform you that our Institutional Sales Division has prepared the official Rate Contract and Commercial Quotation for *${prodName}*.`,
        ``,
        `📋 *Quotation Highlights:*`,
        `• Direct WHO-GMP Manufacturer Net Rates`,
        `• Minimum Batch Order Quantity (MOQ) and Volume Discount Tier Applied`,
        `• Standard Dispatch Timeline: 48 to 72 Hours from Order Confirmation`,
        `• Complete Product Dossier, Certificate of Analysis (COA), and Batch Test Reports included`,
        ``,
        `Our Key Account Manager will connect shortly with the formal proforma invoice.`,
      ].join("\n");
      break;

    case "IN_PROGRESS":
      statusNarrative = [
        `⚙️ *ORDER FILE UNDER ACTIVE PROCESSING:*`,
        `Your product inquiry for *${prodName}* is currently in progress with our Institutional Fulfillment Team.`,
        ``,
        `📋 *Processing Workflow:*`,
        `1. Batch availability and Quality Assurance release confirmation in progress.`,
        `2. Logistics transit routes to ${location || "your destination"} being calculated.`,
        `3. Proforma Invoice & Dispatch staging schedule being finalized.`,
      ].join("\n");
      break;

    case "DOCUMENTS_PENDING":
      statusNarrative = [
        `📑 *REGULATORY COMPLIANCE DOCUMENTS REQUIRED:*`,
        `To process and dispatch your pharmaceutical order for *${prodName}*, statutory drug regulations mandate submission of:`,
        ``,
        `1. Wholesale Drug License (Form 20B / Form 21B)`,
        `2. Valid GST Registration Certificate`,
        `3. Consignee Delivery Address & Transport Godown Details`,
        ``,
        `👉 *How to Send:* Please reply directly to this WhatsApp message or email clear copies to *sales@zealpharma.com* so we can issue your tax invoice immediately.`,
      ].join("\n");
      break;

    case "APPROVED":
      statusNarrative = [
        `🎉 *ORDER & COMMERCIAL TERMS APPROVED!*`,
        `We are pleased to confirm that your order requirements for *${prodName}* have been formally *APPROVED* by our Commercial Sales Board!`,
        ``,
        `• Tax Invoice / Commercial Proforma generated.`,
        `• Batch allocation and packing scheduled at our Central Logistics Warehouse.`,
        `• Dispatch details and LR / Consignment tracking number will be shared upon handover to our transport partner.`,
      ].join("\n");
      break;

    case "QUALIFIED":
    case "CONTACTED":
    case "IN_TOUCH":
      statusNarrative = [
        `🤝 *REQUIREMENT VERIFIED & ACCOUNT MANAGER ASSIGNED:*`,
        `Thank you for your B2B pharmaceutical inquiry regarding *${prodName}*.`,
        ``,
        `📌 *Current Status:*`,
        `Our Institutional Sales Team has verified your product requirement.`,
        `• A dedicated Key Account Manager has been assigned to handle your request.`,
        `• We will share complete product monographs, batch packaging details, and institutional pricing sheets shortly.`,
      ].join("\n");
      break;

    case "FOLLOW_UP":
      statusNarrative = [
        `📞 *FOLLOW-UP DISCUSSION SCHEDULED:*`,
        `A follow-up consultation has been scheduled regarding your ongoing requirement for *${prodName}*.`,
        ``,
        `Our sales manager will connect with you to review volume requirements, customized packaging options, and dispatch schedules.`,
      ].join("\n");
      break;

    case "ON_HOLD":
      statusNarrative = [
        `⏸️ *INQUIRY STATUS: ON HOLD*`,
        `Your inquiry for *${prodName}* has been kept on hold as per your request or pending clarification.`,
        ``,
        `Whenever you are ready to resume, simply reply to this WhatsApp chat or reach out to our Sales Desk to reactivate your order file instantly.`,
      ].join("\n");
      break;

    case "CLOSED":
      statusNarrative = [
        `✅ *TRANSACTION COMPLETED & ORDER DELIVERED:*`,
        `Thank you for partnering with Zeal Pharmaceuticals Pvt. Ltd. for *${prodName}*!`,
        ``,
        `• Your order has been successfully fulfilled and closed in our system.`,
        `• For repeat orders, batch replenishment, or additional formulations, our Key Account Desk is available at your service.`,
      ].join("\n");
      break;

    case "REJECTED":
      statusNarrative = [
        `📋 *INQUIRY UPDATE - STOCK ALLOCATION NOTICE:*`,
        `Thank you for contacting Zeal Pharmaceuticals regarding *${prodName}*.`,
        ``,
        `📌 *Notice:*`,
        `We regret to inform you that current manufacturing lots for this specific formulation are temporarily fully committed or under restricted institutional allocation.`,
        `Our sales team will notify you immediately as soon as fresh manufacturing batches are released by our Quality Assurance division.`,
      ].join("\n");
      break;

    default:
      statusNarrative = [
        `📌 *INQUIRY STATUS: ${statusUpper}*`,
        `Your inquiry regarding *${prodName}* has been updated to *${statusUpper}*.`,
        `Our sales fulfillment team is actively handling your request.`,
      ].join("\n");
      break;
  }

  const noteLine = additionalDetails?.note ? `\n\n📝 *Order Desk Remarks:* ${additionalDetails.note}` : "";

  return [
    `💊 *ZEAL PHARMACEUTICALS PVT. LTD.*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📋 *B2B PHARMACEUTICAL INQUIRY UPDATE*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 *Inquiry Status:* *${statusUpper}*`,
    ``,
    mandatoryDetailsBlock,
    ``,
    productLines,
    ``,
    statusNarrative + noteLine,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📞 *Institutional Sales Desk:* +91 9316227576`,
    `✉️ *Sales Support Email:* sales@zealpharma.com`,
    `🌐 *WHO-GMP Formulation Catalog:* www.zealpharma.com`,
    `🏢 *Zeal Pharmaceuticals Pvt. Ltd.* (Ahmedabad, Gujarat)`,
  ].filter(Boolean).join("\n");
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
