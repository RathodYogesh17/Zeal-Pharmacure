import { Router } from "express";
import {
  getAuditLogs,
  getAuditLogById,
  getAuditLogStats,
  getAuditModulesAndActions,
} from "../controllers/auditLog.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const auditLogRouter = Router();

auditLogRouter.use(authMiddleware);

auditLogRouter.get(
  "/stats",
  requirePermissions(PERMISSIONS.AUDIT_VIEW),
  asyncHandler(getAuditLogStats)
);

auditLogRouter.get(
  "/options",
  requirePermissions(PERMISSIONS.AUDIT_VIEW),
  asyncHandler(getAuditModulesAndActions)
);

auditLogRouter.get(
  "/:id",
  requirePermissions(PERMISSIONS.AUDIT_VIEW),
  asyncHandler(getAuditLogById)
);

auditLogRouter.get(
  "/",
  requirePermissions(PERMISSIONS.AUDIT_VIEW),
  asyncHandler(getAuditLogs)
);

export { auditLogRouter };
