import { Router } from "express";
import {
  getPublicPage,
  getAllPublicPages,
  getAdminPages,
  createPage,
  updatePage,
  deletePage,
} from "../controllers/content.controller";
import {
  createContentSchema,
  updateContentSchema,
  contentQuerySchema,
} from "../validations/content.validation";
import { validate, validateQuery } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const contentRouter = Router();

// =====================================================
// ADMIN PROTECTED ROUTES (CMS Management)
// =====================================================
contentRouter.get(
  "/admin/all",
  authMiddleware,
  requirePermissions(PERMISSIONS.CMS_VIEW),
  validateQuery(contentQuerySchema),
  asyncHandler(getAdminPages)
);

// =====================================================
// PUBLIC ROUTES (About Us, Certifications, FAQs, Banners)
// =====================================================
contentRouter.get("/", asyncHandler(getAllPublicPages));
contentRouter.get("/:key", asyncHandler(getPublicPage));

contentRouter.post(
  "/",
  authMiddleware,
  requirePermissions(PERMISSIONS.CMS_CREATE),
  validate(createContentSchema),
  asyncHandler(createPage)
);

contentRouter.put(
  "/:key",
  authMiddleware,
  requirePermissions(PERMISSIONS.CMS_UPDATE),
  validate(updateContentSchema),
  asyncHandler(updatePage)
);

contentRouter.delete(
  "/:key",
  authMiddleware,
  requirePermissions(PERMISSIONS.CMS_DELETE),
  asyncHandler(deletePage)
);

export { contentRouter };