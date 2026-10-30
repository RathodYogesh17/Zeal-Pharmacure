import { Router, type Request, type Response } from "express";
import whatsAppBotService from "../services/whatsappBot.service";
import asyncHandler from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";

const whatsappBotRouter = Router();

// HTML page for live QR scanning
whatsappBotRouter.get(
  "/qr",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    // Ensure bot is initialized
    if (whatsAppBotService.getStatus().status === "DISCONNECTED") {
      void whatsAppBotService.initWhatsAppBot();
    }
    const html = whatsAppBotService.renderHtmlPage();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  })
);

// JSON Status API
whatsappBotRouter.get(
  "/status",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const status = whatsAppBotService.getStatus();
    res.json({
      success: true,
      data: {
        status: status.status,
        connectedNumber: status.connectedNumber,
        hasQr: status.hasQr,
      },
    });
  })
);

// Reset / Logout Session (Admin only)
whatsappBotRouter.post(
  "/reset",
  authMiddleware,
  requirePermissions(PERMISSIONS.SETTINGS_UPDATE),
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    whatsAppBotService.clearSession();
    void whatsAppBotService.initWhatsAppBot();
    res.json({
      success: true,
      message: "WhatsApp session reset. Please refresh /api/whatsapp-bot/qr to scan a new QR code.",
    });
  })
);

// Send a test message directly (Admin only)
whatsappBotRouter.post(
  "/test-send",
  authMiddleware,
  requirePermissions(PERMISSIONS.SETTINGS_UPDATE),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const toPhone = String(req.body?.phone || "9316227576");
    const text = String(
      req.body?.message ||
        "🔔 *ZEAL PHARMA - Live Test Message*\nWhatsApp Bot is successfully connected and delivering messages!"
    );
    const result = await whatsAppBotService.sendDirectMessage(toPhone, text);
    res.json({
      success: result.success,
      to: toPhone,
      data: result,
    });
  })
);

// Send custom message to any phone (from Admin Panel WhatsApp Hub)
whatsappBotRouter.post(
  "/send-message",
  authMiddleware,
  requirePermissions(PERMISSIONS.SETTINGS_UPDATE),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const rawPhone = String(req.body?.phone || "").trim();
    const text = String(req.body?.message || "").trim();

    if (!rawPhone || !text) {
      res.status(400).json({
        success: false,
        message: "Recipient phone number and message content are required.",
      });
      return;
    }

    const cleanPhone = rawPhone.replace(/[^0-9]/g, "");
    const result = await whatsAppBotService.sendDirectMessage(cleanPhone, text);
    res.json({
      success: result.success,
      to: cleanPhone,
      messageId: result.messageId,
      error: result.error,
    });
  })
);

export { whatsappBotRouter };
