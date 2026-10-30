import type { WASocket } from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import os from "os";

export type WhatsAppBotStatus = "DISCONNECTED" | "SCAN_QR" | "CONNECTING" | "CONNECTED";

class WhatsAppBotService {
  private sock: WASocket | null = null;
  private status: WhatsAppBotStatus = "DISCONNECTED";
  private qrRaw: string | null = null;
  private qrCodeDataUrl: string | null = null;
  private connectedNumber: string | null = null;
  private sessionDir: string;
  private isInitializing = false;

  constructor() {
    // In serverless environments (like Vercel AWS Lambda), process.cwd() is read-only (/var/task).
    // Always use os.tmpdir() in production/serverless to avoid EROFS crashes.
    const isServerless = Boolean(
      process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production"
    );
    this.sessionDir = isServerless
      ? path.join(os.tmpdir(), "zeal_whatsapp_session")
      : path.join(process.cwd(), "whatsapp_session");
  }

  private ensureSessionDir(): void {
    try {
      if (!fs.existsSync(this.sessionDir)) {
        fs.mkdirSync(this.sessionDir, { recursive: true });
      }
    } catch (err: any) {
      console.warn("[WhatsAppBot] Session directory setup skipped:", err.message);
    }
  }

  public async initWhatsAppBot(): Promise<void> {
    // Only initialize persistent socket bot if explicitly enabled on a long-running server (VPS/Docker)
    if (process.env.ENABLE_WHATSAPP_BOT !== "true") {
      this.status = "DISCONNECTED";
      return;
    }

    if (this.isInitializing || this.status === "CONNECTED") {
      return;
    }

    this.isInitializing = true;
    this.status = "CONNECTING";

    try {
      this.ensureSessionDir();

      // Dynamic import to prevent native Rust binary crash on serverless runtimes
      const baileys = await import("@whiskeysockets/baileys");
      const makeWASocket = baileys.default || baileys.makeWASocket;
      const { useMultiFileAuthState, DisconnectReason } = baileys;
      const pino = (await import("pino")).default;

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
            console.log("👉 Open in browser to scan: /api/whatsapp-bot/qr");
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
          console.log("=================================================");
        }

        if (connection === "close") {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.log(
            `⚠️ WhatsApp Bot disconnected (Code: ${statusCode}). Reconnecting: ${shouldReconnect}`
          );

          this.status = "DISCONNECTED";
          this.isInitializing = false;

          if (shouldReconnect) {
            setTimeout(() => void this.initWhatsAppBot(), 3000);
          } else {
            this.clearSession();
            setTimeout(() => void this.initWhatsAppBot(), 2000);
          }
        }
      });
    } catch (err: any) {
      console.warn("[WhatsAppBot] Runtime initialization skipped:", err.message);
      this.status = "DISCONNECTED";
    } finally {
      this.isInitializing = false;
    }
  }

  public clearSession(): void {
    try {
      if (fs.existsSync(this.sessionDir)) {
        fs.rmSync(this.sessionDir, { recursive: true, force: true });
      }
      this.connectedNumber = null;
      this.qrRaw = null;
      this.qrCodeDataUrl = null;
      this.status = "DISCONNECTED";
    } catch (e: any) {
      console.warn("Failed to clear session dir:", e.message);
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
   * Send a direct automated WhatsApp message
   */
  public async sendDirectMessage(
    rawPhone: string,
    messageText: string
  ): Promise<{ success: boolean; error?: string | undefined; messageId?: string | undefined }> {
    if (this.status !== "CONNECTED" || !this.sock) {
      return {
        success: false,
        error: "WhatsApp Bot is in Standby mode. Instant alerts are delivered to Sales Desk via direct WhatsApp links.",
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
   * Generates a modern HTML web page to view status or QR code
   */
  public renderHtmlPage(): string {
    const isConnected = this.status === "CONNECTED";
    const isScanQr = this.status === "SCAN_QR" && this.qrCodeDataUrl;
    const isStandby = process.env.ENABLE_WHATSAPP_BOT !== "true";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZEAL PHARMA - WhatsApp Notification Hub</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border: 1px solid #3a506b;
    }
    h1 { margin-top: 0; font-size: 22px; color: #48cae4; }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 20px;
      background: ${isConnected ? "#2ec4b6" : isStandby ? "#3a86ff" : "#ff9f1c"};
      color: #0b132b;
    }
    p { font-size: 14px; color: #cbd5e1; line-height: 1.6; }
    .btn {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 20px;
      border-radius: 8px;
      background: #48cae4;
      color: #0b132b;
      text-decoration: none;
      font-weight: bold;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>ZEAL PHARMA WhatsApp Hub</h1>
    <div class="badge">${isConnected ? "CONNECTED" : isStandby ? "WEBHOOK & CLOUD ACTIVE" : "SCAN QR CODE"}</div>
    ${
      isConnected
        ? `<p>Logged in as: <strong>+${this.connectedNumber}</strong><br>All leads are being dispatched live.</p>`
        : isScanQr
        ? `<img src="${this.qrCodeDataUrl}" style="width:240px;height:240px;border-radius:12px;background:white;padding:10px;" />
           <p>Scan with WhatsApp on Sales Desk device</p>`
        : `<p>Real-time lead alerts are operational via WhatsApp Webhook & Direct 1-Click WhatsApp links to Sales Desk (+91 9316227576).</p>`
    }
    <br>
    <a href="/" class="btn">Back to Website</a>
  </div>
</body>
</html>`;
  }
}

export const whatsAppBotService = new WhatsAppBotService();
export default whatsAppBotService;
