import { Router } from "express";
import {
  getAllPermissions,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignRolePermissions,
  getUserPermissions,
  assignUserPermissions,
  getAuditLogs,
} from "../controllers/settings.controller";
import {
  createRoleSchema,
  updateRoleSchema,
  assignRolePermissionsSchema,
  assignUserPermissionsSchema,
} from "../validations/settings.validation";
import { validate } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const settingsRouter = Router();

settingsRouter.use(authMiddleware);

// ==========================================
// AUDIT LOGS
// ==========================================
settingsRouter.get(
  "/audit-logs",
  requirePermissions(PERMISSIONS.AUDIT_VIEW),
  asyncHandler(getAuditLogs)
);

// ==========================================
// PERMISSIONS
// ==========================================
settingsRouter.get(
  "/permissions",
  requirePermissions(PERMISSIONS.PERMISSION_VIEW),
  asyncHandler(getAllPermissions)
);

// ==========================================
// ROLES CRUD
// ==========================================
settingsRouter.get(
  "/roles",
  requirePermissions(PERMISSIONS.ROLE_VIEW),
  asyncHandler(getAllRoles)
);

settingsRouter.get(
  "/roles/:id",
  requirePermissions(PERMISSIONS.ROLE_VIEW),
  asyncHandler(getRoleById)
);

settingsRouter.post(
  "/roles",
  requirePermissions(PERMISSIONS.ROLE_CREATE),
  validate(createRoleSchema),
  asyncHandler(createRole)
);

settingsRouter.put(
  "/roles/:id",
  requirePermissions(PERMISSIONS.ROLE_UPDATE),
  validate(updateRoleSchema),
  asyncHandler(updateRole)
);

settingsRouter.delete(
  "/roles/:id",
  requirePermissions(PERMISSIONS.ROLE_DELETE),
  asyncHandler(deleteRole)
);

// ==========================================
// ROLE PERMISSIONS ASSIGNMENT
// ==========================================
settingsRouter.put(
  "/roles/:id/permissions",
  requirePermissions(PERMISSIONS.PERMISSION_ASSIGN),
  validate(assignRolePermissionsSchema),
  asyncHandler(assignRolePermissions)
);

// ==========================================
// USER PERMISSION OVERRIDES (ALLOW / DENY)
// ==========================================
settingsRouter.get(
  "/users/:id/permissions",
  requirePermissions(PERMISSIONS.PERMISSION_VIEW),
  asyncHandler(getUserPermissions)
);

settingsRouter.put(
  "/users/:id/permissions",
  requirePermissions(PERMISSIONS.PERMISSION_ASSIGN),
  validate(assignUserPermissionsSchema),
  asyncHandler(assignUserPermissions)
);

export { settingsRouter };