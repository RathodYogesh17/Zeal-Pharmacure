import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const dashboardRouter = Router();

// =====================================================
// PROTECTED ROUTES (Admin & Sales Leadership Analytics)
// =====================================================
dashboardRouter.get(
  "/",
  authMiddleware,
  requirePermissions(PERMISSIONS.DASHBOARD_VIEW),
  asyncHandler(getDashboardStats)
);

dashboardRouter.get(
  "/stats",
  authMiddleware,
  requirePermissions(PERMISSIONS.DASHBOARD_VIEW),
  asyncHandler(getDashboardStats)
);

export { dashboardRouter };
export default dashboardRouter;