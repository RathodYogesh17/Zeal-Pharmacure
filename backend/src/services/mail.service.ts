import nodemailer from "nodemailer";

const createTransporter = () => {
  const host = process.env.MAIL_HOST;
  const user = process.env.MAIL_USER?.trim();
  const pass = process.env.MAIL_PASSWORD ? process.env.MAIL_PASSWORD.replace(/\s+/g, "") : "";

  if (!host || !user || !pass || user.includes("YOUR_GMAIL")) {
    return null;
  }

  // Gmail special optimization
  if (host.includes("gmail") || user.endsWith("@gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user,
      pass,
    },
  });
};

const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn(`[MAIL] SMTP not configured. Skipping email to ${to}.`);
    return;
  }

  try {
    const fromAddress = process.env.MAIL_FROM || process.env.MAIL_USER;
    const info = await transporter.sendMail({
      from: `"Zeal Pharmaceuticals" <${fromAddress}>`,
      to,
      subject,
      html,
    });
    console.log(`[MAIL SUCCESS] 🚀 Email delivered to ${to} (MessageId: ${info.messageId})`);
  } catch (err: any) {
    console.error(`[MAIL ERROR] ❌ Failed to send email to ${to}:`, err.message || err);
    throw err;
  }
};

import {
  generateEnquiryAlertEmailHtml,
  generateClientEnquiryConfirmationHtml,
  generateAdminReplyEmailHtml,
  type IEnquiryEmailAlertProps,
} from "../utils/emailTemplate";

const sendLeadAlertEmail = async (lead: IEnquiryEmailAlertProps): Promise<boolean> => {
  const adminRecipients = [
    process.env.ADMIN_EMAIL,
    process.env.MAIL_USER,
    "info@zealpharma.com",
  ].filter(Boolean) as string[];

  const primaryRecipient = adminRecipients[0] || "Yogeshrd1708@gmail.com";
  const topic = lead.productName || (lead.enquiryType === "FRANCHISE" ? "Stockists Distribution" : "B2B Lead");
  const subject = `[New B2B Lead Alert] ${topic} - ${lead.name} (${lead.city}, ${lead.state})`;

  try {
    const html = generateEnquiryAlertEmailHtml(lead);
    await sendEmail({
      to: primaryRecipient,
      subject,
      html,
    });
    return true;
  } catch (err: any) {
    console.error(`[MAIL ERROR] Failed to send lead alert email:`, err.message || err);
    return false;
  }
};

const sendLeadConfirmationEmail = async (client: {
  name: string;
  email: string;
  enquiryType: string;
  productName?: string | undefined;
  enquiryId?: string | undefined;
}): Promise<boolean> => {
  if (!client.email || !client.email.includes("@")) return false;

  const subject = `Thank you for contacting Zeal Pharmaceuticals - Inquiry Received`;

  try {
    const html = generateClientEnquiryConfirmationHtml(client);
    await sendEmail({
      to: client.email.trim(),
      subject,
      html,
    });
    return true;
  } catch (err: any) {
    console.error(`[MAIL ERROR] Failed to send client confirmation email:`, err.message || err);
    return false;
  }
};

const sendAdminReplyEmail = async (options: {
  to: string;
  subject: string;
  message: string;
  clientName: string;
  senderName?: string | undefined;
  senderDesignation?: string | undefined;
}): Promise<boolean> => {
  if (!options.to || !options.to.includes("@")) {
    throw new Error("Recipient email address is invalid or missing");
  }

  try {
    const html = generateAdminReplyEmailHtml({
      clientName: options.clientName,
      replyMessage: options.message,
      senderName: options.senderName,
      senderDesignation: options.senderDesignation,
      enquirySubject: options.subject,
    });

    await sendEmail({
      to: options.to.trim(),
      subject: options.subject,
      html,
    });
    return true;
  } catch (err: any) {
    console.error(`[MAIL ERROR] Failed to send admin reply email:`, err.message || err);
    throw err;
  }
};

export {
  sendEmail,
  sendLeadAlertEmail,
  sendLeadConfirmationEmail,
  sendAdminReplyEmail,
};