import mongoose from "mongoose";
import type { Request } from "express";
import AuditLog from "../models/auditLog.model";
import type { AuditLogStatus } from "../types/auditLog.types";

export interface ILogAuditOptions {
  action: string;
  module: string;
  userId?: mongoose.Types.ObjectId | string | null | undefined;
  targetType?: string | null | undefined;
  targetId?: mongoose.Types.ObjectId | string | null | undefined;
  status?: AuditLogStatus | undefined;
  reason?: string | undefined;
  requestId?: string | null | undefined;
  ipAddress?: string | null | undefined;
  userAgent?: string | null | undefined;
  metadata?: Record<string, unknown> | undefined;
  req?: Request | undefined;
}

/**
 * Helper to record audit logs safely without interrupting the primary application flow.
 */
export const recordAuditLog = async (options: ILogAuditOptions): Promise<void> => {
  try {
    const { req, ...data } = options;

    let ipAddress: string | null = data.ipAddress ?? null;
    let userAgent: string | null = data.userAgent ?? null;
    let userId: mongoose.Types.ObjectId | string | null = data.userId ?? null;
    let requestId: string | null = data.requestId ?? null;

    if (req) {
      if (!ipAddress) {
        const forwarded = req.headers["x-forwarded-for"];
        if (typeof forwarded === "string") {
          ipAddress = forwarded.split(",")[0]?.trim() || null;
        } else if (Array.isArray(forwarded) && forwarded.length > 0) {
          ipAddress = forwarded[0]?.trim() || null;
        } else {
          ipAddress = req.socket?.remoteAddress || req.ip || null;
        }
      }

      if (!userAgent) {
        userAgent = (req.headers["user-agent"] as string) || null;
      }

      if (!requestId) {
        const headerRequestId = req.headers["x-request-id"];
        if (typeof headerRequestId === "string") {
          requestId = headerRequestId.trim();
        } else if ((req as unknown as { id?: string }).id) {
          requestId = (req as unknown as { id?: string }).id || null;
        }
      }

      const reqUserId = (req as unknown as { user?: { _id?: string } }).user?._id;
      if (!userId && reqUserId) {
        userId = reqUserId;
      }
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
      // Schema requires a valid ObjectId for userId. If unauthenticated, skip safely.
      return;
    }

    const parsedUserId = new mongoose.Types.ObjectId(String(userId));

    await AuditLog.create({
      userId: parsedUserId,
      action: data.action.trim().toUpperCase(),
      module: data.module.trim().toUpperCase(),
      targetType: data.targetType ? String(data.targetType).trim() : null,
      targetId: data.targetId ? String(data.targetId).trim() : null,
      status: data.status === "FAILED" ? "FAILED" : "SUCCESS",
      reason: data.reason ? String(data.reason).trim() : "",
      requestId: requestId ? String(requestId).trim() : null,
      ipAddress: ipAddress ? String(ipAddress).trim() : null,
      userAgent: userAgent ? String(userAgent).trim() : null,
      metadata: data.metadata && typeof data.metadata === "object" ? data.metadata : {},
    });
  } catch (error) {
    // Non-blocking: Logging failure should not crash main request
    console.error("[AuditLog Error]: Failed to record audit log:", error);
  }
};
