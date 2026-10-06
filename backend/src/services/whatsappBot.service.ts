import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  type WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";

export type WhatsAppBotStatus = "DISCONNECTED" | "SCAN_QR" | "CONNECTING" | "CONNECTED";

class WhatsAppBotService {
  private sock: WASocket | null = null;
  private status: WhatsAppBotStatus = "DISCONNECTED";
  private qrRaw: string | null = null;
  private qrCodeDataUrl: string | null = null;
  private connectedNumber: string | null = null;
  private sessionDir = path.join(process.cwd(), "whatsapp_session");
  private isInitializing = false;

  constructor() {
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true });
    }
  }

  public async initWhatsAppBot(): Promise<void> {
    if (this.isInitializing || this.status === "CONNECTED") {
      return;
    }

    this.isInitializing = true;
    this.status = "CONNECTING";

    try {
      const { state, saveCreds } = await useMultiFileAuthState(this.sessionDir);

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }) as any,
        browser: ["ZEAL-PHARMA", "Chrome", "1.0.0"],
      });

      this.sock.ev.on("creds.update", saveCreds);

      this.sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrRaw = qr;
          this.status = "SCAN_QR";
          try {
            this.qrCodeDataUrl = await QRCode.toDataURL(qr);
            console.log("=================================================");
            console.log("📱 [WHATSAPP BOT QR CODE GENERATED]");
            console.log("👉 Open in browser to scan: http://localhost:5000/api/whatsapp-bot/qr");
            console.log("=================================================");
          } catch (qrErr) {
            console.error("Failed to generate QR data URL:", qrErr);
          }
        }

        if (connection === "open") {
          this.status = "CONNECTED";
          this.qrRaw = null;
          this.qrCodeDataUrl = null;
          const userJid = this.sock?.user?.id || "";
          this.connectedNumber = userJid.split(":")[0]?.replace(/\D/g, "") || null;
          console.log("=================================================");
          console.log(`✅ [WHATSAPP BOT CONNECTED] Logged in as: +${this.connectedNumber}`);
          console.log("Any B2B enquiry will now be sent automatically to Sales Manager!");
          console.log("=================================================");
        }

        if (connection === "close") {
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.log(
            `⚠️ WhatsApp Bot disconnected (Code: ${statusCode}). Reconnecting: ${shouldReconnect}`
          );

          this.status = "DISCONNECTED";
          this.isInitializing = false;

          if (shouldReconnect) {
            setTimeout(() => this.initWhatsAppBot(), 3000);
          } else {
            // User logged out from phone; clear session for new QR
            this.clearSession();
            setTimeout(() => this.initWhatsAppBot(), 2000);
          }
        }
      });
    } catch (err) {
      console.error("Error initializing WhatsApp bot:", err);
      this.status = "DISCONNECTED";
    } finally {
      this.isInitializing = false;
    }
  }

  public clearSession(): void {
    try {
      if (fs.existsSync(this.sessionDir)) {
        fs.rmSync(this.sessionDir, { recursive: true, force: true });
        fs.mkdirSync(this.sessionDir, { recursive: true });
      }
      this.connectedNumber = null;
      this.qrRaw = null;
      this.qrCodeDataUrl = null;
      this.status = "DISCONNECTED";
    } catch (e) {
      console.error("Failed to clear session dir:", e);
    }
  }

  public getStatus() {
    return {
      status: this.status,
      connectedNumber: this.connectedNumber,
      hasQr: Boolean(this.qrCodeDataUrl),
      qrCodeDataUrl: this.qrCodeDataUrl,
    };
  }

  /**
   * Send a direct automated WhatsApp message from the server session to any Indian or global number
   */
  public async sendDirectMessage(
    rawPhone: string,
    messageText: string
  ): Promise<{ success: boolean; error?: string | undefined; messageId?: string | undefined }> {
    if (this.status !== "CONNECTED" || !this.sock) {
      return {
        success: false,
        error: "WhatsApp Bot is not connected. Please scan QR code at /api/whatsapp-bot/qr",
      };
    }

    try {
      const cleanDigits = rawPhone.replace(/\D/g, "");
      const fullNumber = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
      const jid = `${fullNumber}@s.whatsapp.net`;

      const result = await this.sock.sendMessage(jid, { text: messageText });
      return {
        success: true,
        messageId: result?.key?.id || undefined,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("Failed to send WhatsApp message via Bot:", errMsg);
      return {
        success: false,
        error: errMsg,
      };
    }
  }

  /**
   * Generates a modern HTML web page to view and scan the QR code live
   */
  public renderHtmlPage(): string {
    const isConnected = this.status === "CONNECTED";
    const isScanQr = this.status === "SCAN_QR" && this.qrCodeDataUrl;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZEAL PHARMA - WhatsApp Bot Setup</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0b132b;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: #1c2541;
      border-radius: 16px;
      padding: 32px;
      max-width: 460px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border: 1px solid #3a506b;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 8px;
      color: #48cae4;
    }
    p {
      font-size: 14px;
      color: #cbd5e1;
      line-height: 1.5;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 20px;
    }
    .badge-connected {
      background: #10b981;
      color: #ffffff;
    }
    .badge-scan {
      background: #f59e0b;
      color: #000000;
    }
    .badge-disconnected {
      background: #ef4444;
      color: #ffffff;
    }
    .qr-box {
      background: #ffffff;
      padding: 16px;
      border-radius: 12px;
      display: inline-block;
      margin: 16px 0;
    }
    .qr-img {
      width: 250px;
      height: 250px;
      display: block;
    }
    .steps {
      text-align: left;
      background: #0f172a;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 13px;
    }
    .steps ol {
      margin: 8px 0 0 18px;
      padding: 0;
    }
    .steps li {
      margin-bottom: 6px;
      color: #94a3b8;
    }
    .btn {
      background: #0077b6;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      margin-top: 14px;
      text-decoration: none;
      display: inline-block;
    }
    .btn:hover {
      background: #0096c7;
    }
  </style>
  ${!isConnected ? '<meta http-equiv="refresh" content="4">' : ""}
</head>
<body>
  <div class="card">
    <h1>ZEAL PHARMA - WhatsApp Bot</h1>
    <p>Automated B2B Lead Dispatch to Sales Manager (+91 9316227576)</p>

    ${
      isConnected
        ? `
      <div class="badge badge-connected">CONNECTED (+${this.connectedNumber})</div>
      <div style="font-size: 48px; margin: 20px 0;">🎉</div>
      <p style="color: #a7f3d0; font-size: 16px; font-weight: bold;">WhatsApp Bot Active & Running!</p>
      <p>Whenever a client confirms an enquiry on the website, this server will automatically push the message directly to Sales Manager (9316227576).</p>
      <p style="font-size: 12px; color: #64748b;">Client will NOT need to open WhatsApp.</p>
    `
        : isScanQr
        ? `
      <div class="badge badge-scan">SCAN QR CODE</div>
      <div class="qr-box">
        <img class="qr-img" src="${this.qrCodeDataUrl}" alt="WhatsApp Bot QR Code" />
      </div>
      <div class="steps">
        <strong>How to link your WhatsApp:</strong>
        <ol>
          <li>Open WhatsApp on your phone.</li>
          <li>Tap <strong>Settings</strong> &gt; <strong>Linked Devices</strong>.</li>
          <li>Tap <strong>Link a Device</strong> and point your camera at this QR code.</li>
        </ol>
      </div>
      <p style="font-size: 11px; color: #94a3b8; margin-top: 12px;">This page auto-refreshes every 4 seconds.</p>
    `
        : `
      <div class="badge badge-disconnected">${this.status}</div>
      <p>Initializing WhatsApp session... Please wait a few seconds.</p>
      <a href="/api/whatsapp-bot/qr" class="btn">Refresh Status</a>
    `
    }
  </div>
</body>
</html>`;
  }
}

export const whatsAppBotService = new WhatsAppBotService();
export default whatsAppBotService;
