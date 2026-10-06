import { Router } from "express";
import {
  createIndication,
  getPublicIndications,
  getAdminIndications,
  getIndication,
  updateIndication,
  deleteIndication,
} from "../controllers/indication.controller";
import {
  createIndicationSchema,
  updateIndicationSchema,
  indicationQuerySchema,
} from "../validations/indication.validation";
import { validate, validateQuery } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const indicationRouter = Router();

// Public (Used for dependent dropdowns in website & forms: e.g. /api/indications?category={categoryId})
indicationRouter.get("/", validateQuery(indicationQuerySchema), asyncHandler(getPublicIndications));
indicationRouter.get("/:slugOrId", asyncHandler(getIndication));

// Admin Protected
indicationRouter.get(
  "/admin/all",
  authMiddleware,
  requirePermissions(PERMISSIONS.CATEGORY_VIEW),
  validateQuery(indicationQuerySchema),
  asyncHandler(getAdminIndications)
);

indicationRouter.post(
  "/",
  authMiddleware,
  requirePermissions(PERMISSIONS.CATEGORY_CREATE),
  validate(createIndicationSchema),
  asyncHandler(createIndication)
);

indicationRouter.put(
  "/:id",
  authMiddleware,
  requirePermissions(PERMISSIONS.CATEGORY_UPDATE),
  validate(updateIndicationSchema),
  asyncHandler(updateIndication)
);

indicationRouter.delete(
  "/:id",
  authMiddleware,
  requirePermissions(PERMISSIONS.CATEGORY_DELETE),
  asyncHandler(deleteIndication)
);

export { indicationRouter };
