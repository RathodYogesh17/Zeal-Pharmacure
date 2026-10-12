export interface IEmailOtpTemplateProps {
  otp: string;
  purpose: string;
  expiryMinutes?: number | undefined;
  userName?: string | undefined;
}

export const generateOtpEmailHtml = ({
  otp,
  expiryMinutes = 1,
  userName = "User",
}: IEmailOtpTemplateProps): string => {
  const currentYear = new Date().getFullYear();
  const cleanOtp = otp.trim();
  const expiryText = expiryMinutes === 1 ? "1 minute" : `${expiryMinutes} minutes`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Zeal Pharmacure - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  
  <!-- Outer Wrapper Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; padding: 16px 8px;">
    <tr>
      <td align="center">
        
        <!-- Main Card (100% on mobile, max 460px on desktop) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 460px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 18px 20px; border-bottom: 1px solid #F1F5F9;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 32px; height: 32px; background-color: #6828DC; border-radius: 8px; text-align: center; vertical-align: middle;">
                    <span style="color: #FFFFFF; font-size: 16px; font-weight: 800; font-family: Arial, sans-serif; line-height: 32px; display: block;">Z</span>
                  </td>
                  <td style="padding-left: 10px; vertical-align: middle;">
                    <span style="font-size: 16px; font-weight: 700; color: #0F172A; letter-spacing: -0.3px;">
                      Zeal <span style="color: #6828DC;">Pharmacure</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 22px 20px 16px 20px;">
              <p style="margin: 0 0 12px 0; font-size: 15px; color: #1E293B; line-height: 1.4;">
                Hello <strong>${userName}</strong>,
              </p>

              <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.5; color: #475569;">
                Your one-time verification code (OTP) is:
              </p>

              <!-- Responsive OTP Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 18px 0;">
                <tr>
                  <td align="center" style="background-color: #F5F3FF; border: 1.5px dashed #8B5CF6; border-radius: 8px; padding: 14px 10px;">
                    <div style="font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #6828DC; font-family: 'Courier New', Courier, monospace; text-align: center; line-height: 1.2;">
                      ${cleanOtp}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 14px 0; font-size: 13px; line-height: 1.5; color: #64748B;">
                ⏱️ This code is valid for <strong>${expiryText}</strong>. Never share this code with anyone.
              </p>

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94A3B8;">
                If you did not request this OTP, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 14px 20px 16px 20px; background-color: #F8FAFC; border-top: 1px solid #F1F5F9; font-size: 11px; line-height: 1.5; color: #64748B;">
              <div style="font-weight: 600; color: #334155;">Zeal Pharmacure Pvt. Ltd.</div>
              <div style="color: #64748B; margin-top: 2px;">Surat, Gujarat – 395010 | Helpline: +91 9316227576</div>
              <div style="color: #94A3B8; margin-top: 6px;">&copy; ${currentYear} Zeal Pharmacure. All rights reserved.</div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};

export interface IEnquiryEmailAlertProps {
  enquiryType: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  companyName?: string | undefined;
  productName?: string | undefined;
  quantity?: string | number | undefined;
  quantityUnit?: string | undefined;
  drugLicenseNumber?: string | undefined;
  gstNumber?: string | undefined;
  territoryDistrict?: string | undefined;
  investmentBudget?: string | undefined;
  message?: string | undefined;
  enquiryId?: string | undefined;
}

export const generateEnquiryAlertEmailHtml = (props: IEnquiryEmailAlertProps): string => {
  const currentYear = new Date().getFullYear();
  const cleanPhone = props.phone.replace(/\D/g, "");
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const isFranchise = props.enquiryType === "FRANCHISE";
  const typeBadge = isFranchise ? "Stockists Distribution Network" : (props.enquiryType === "BULK_PRODUCT" ? "Bulk Formulation Order" : "Product Inquiry");
  const topic = props.productName || (isFranchise ? `Territory: ${props.territoryDistrict || props.city}` : "General B2B Inquiry");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Alert - Zeal Pharmaceuticals</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #6828DC; padding: 20px 24px; color: #FFFFFF;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; background-color: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; display: inline-block;">
                      🔔 Instant Lead Notification
                    </span>
                    <h2 style="margin: 10px 0 2px 0; font-size: 20px; font-weight: 800; color: #FFFFFF;">
                      ${typeBadge}
                    </h2>
                    <p style="margin: 0; font-size: 13px; color: #E9D5FF;">
                      Target: <strong>${topic}</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Lead Details Table -->
          <tr>
            <td style="padding: 24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748B; width: 38%;">👤 Client Name:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0F172A;">${props.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748B;">📱 Mobile / WhatsApp:</td>
                  <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #0F172A;">${props.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748B;">✉️ Email:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #2563EB;">${props.email}</td>
                </tr>
                ${props.companyName ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #64748B;">🏢 Firm / Clinic:</td><td style="padding: 8px 0; font-size: 14px; color: #0F172A;">${props.companyName}</td></tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748B;">📍 Location:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0F172A;">${props.city}, ${props.state}</td>
                </tr>
                ${props.quantity ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #64748B;">📦 Requirement:</td><td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #059669;">${props.quantity} ${props.quantityUnit || 'units'}</td></tr>` : ''}
                ${props.drugLicenseNumber ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #64748B;">📜 Drug License (DL):</td><td style="padding: 8px 0; font-size: 13px; font-family: monospace; color: #475569;">${props.drugLicenseNumber}</td></tr>` : ''}
                ${props.gstNumber ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #64748B;">📑 GST No.:</td><td style="padding: 8px 0; font-size: 13px; font-family: monospace; color: #475569;">${props.gstNumber}</td></tr>` : ''}
                ${props.message ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #64748B; vertical-align: top;">💬 Client Message:</td><td style="padding: 8px 0; font-size: 13px; color: #334155; line-height: 1.4; font-style: italic;">"${props.message}"</td></tr>` : ''}
              </table>

              <!-- 1-Click Action Buttons -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 10px;">
                <tr>
                  <td style="padding-right: 8px; width: 50%;">
                    <a href="https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${props.name}, greetings from Zeal Pharmaceuticals! Regarding your inquiry for "${topic}":`)}" style="display: block; background-color: #25D366; color: #FFFFFF; text-align: center; padding: 12px 14px; border-radius: 8px; text-decoration: none; font-size: 13.5px; font-weight: 700;">
                      💬 Reply on WhatsApp
                    </a>
                  </td>
                  <td style="padding-left: 8px; width: 50%;">
                    <a href="mailto:${props.email}?subject=${encodeURIComponent(`Re: Your Inquiry for ${topic} - Zeal Pharmaceuticals`)}" style="display: block; background-color: #0F172A; color: #FFFFFF; text-align: center; padding: 12px 14px; border-radius: 8px; text-decoration: none; font-size: 13.5px; font-weight: 700;">
                      ✉️ Reply by Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 14px 24px; border-top: 1px solid #E2E8F0; font-size: 11.5px; color: #64748B; text-align: center;">
              Zeal Pharmaceuticals Automated CRM Lead Engine &copy; ${currentYear}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const generateClientEnquiryConfirmationHtml = (props: {
  name: string;
  enquiryType: string;
  productName?: string | undefined;
  enquiryId?: string | undefined;
}): string => {
  const currentYear = new Date().getFullYear();
  const subjectText = props.productName || "Pharmaceutical Products & Distribution";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Received - Zeal Pharmaceuticals</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden;">
          <tr>
            <td style="padding: 24px; border-bottom: 1px solid #F1F5F9; text-align: center;">
              <span style="font-size: 20px; font-weight: 800; color: #0F172A;">
                Zeal <span style="color: #6828DC;">Pharmacure</span>
              </span>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748B;">Excellence in Healthcare & Pharmaceutical Formulations</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 14px 0; font-size: 15px; color: #1E293B;">
                Dear <strong>${props.name}</strong>,
              </p>
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #475569;">
                Thank you for your interest in <strong>Zeal Pharmaceuticals</strong>. We have received your inquiry regarding <strong>${subjectText}</strong>.
              </p>
              <div style="background-color: #F5F3FF; border-left: 4px solid #6828DC; padding: 14px 16px; border-radius: 6px; margin-bottom: 18px;">
                <p style="margin: 0; font-size: 13.5px; color: #4C1D95; line-height: 1.4;">
                  Our Area Sales Manager has received your inquiry details and will connect with you via Phone / WhatsApp shortly with our product visual aid sheet and wholesale distribution rates.
                </p>
              </div>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748B;">
                Need urgent assistance? Reach our sales desk directly:
              </p>
              <p style="margin: 0; font-size: 13.5px; font-weight: 700; color: #0F172A;">
                📞 +91 9316227576 &nbsp;|&nbsp; ✉️ info@zealpharma.com
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8FAFC; padding: 14px 24px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; text-align: center;">
              &copy; ${currentYear} Zeal Pharmacure Pvt. Ltd. | Surat, Gujarat – 395010
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const generateAdminReplyEmailHtml = (props: {
  clientName: string;
  replyMessage: string;
  senderName?: string | undefined;
  senderDesignation?: string | undefined;
  enquirySubject?: string | undefined;
}): string => {
  const currentYear = new Date().getFullYear();
  const sender = props.senderName || "Zeal Pharma Sales Desk";
  const designation = props.senderDesignation || "Zeal Pharmacure Pvt. Ltd.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Response from Zeal Pharmaceuticals</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8FAFC; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; overflow: hidden;">
          <tr>
            <td style="padding: 20px 24px; background-color: #0F172A; color: #FFFFFF;">
              <span style="font-size: 18px; font-weight: 800; color: #FFFFFF;">
                Zeal <span style="color: #A78BFA;">Pharmacure</span>
              </span>
              <div style="font-size: 12px; color: #94A3B8; margin-top: 2px;">Official Response regarding: ${props.enquirySubject || 'Your Inquiry'}</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0 0 14px 0; font-size: 14.5px; color: #1E293B;">
                Dear <strong>${props.clientName}</strong>,
              </p>
              <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-bottom: 24px; background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 18px; border-radius: 8px;">
${props.replyMessage}
              </div>
              <p style="margin: 0 0 4px 0; font-size: 13.5px; font-weight: 700; color: #0F172A;">
                ${sender}
              </p>
              <p style="margin: 0; font-size: 12.5px; color: #64748B;">
                ${designation}
              </p>
              <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #6828DC; font-weight: 600;">
                Helpline: +91 9316227576 | www.zealpharma.com
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #F8FAFC; padding: 14px 24px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; text-align: center;">
              &copy; ${currentYear} Zeal Pharmacure Pvt. Ltd. | Surat, Gujarat – 395010
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

