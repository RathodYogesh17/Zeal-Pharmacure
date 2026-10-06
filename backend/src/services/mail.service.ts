import nodemailer from "nodemailer";

const createTransporter = () => {
  const host = process.env.MAIL_HOST;
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;

  if (!host || !user || !pass) { return null; }
  return nodemailer.createTransport({
    host,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: { user,  pass, },
  });
};

const sendEmail = async ({to,  subject,  html, }: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn(`[MAIL] SMTP not configured. Skipping email to ${to}.`);
    return;   }
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER, to, subject, html,
  });
};

export { sendEmail };