import { Router } from "express";
import {
  createSubCategory,
  getPublicSubCategories,
  getAdminSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategory.controller";
import {
  createSubCategorySchema,
  updateSubCategorySchema,
  subCategoryQuerySchema,
} from "../validations/subCategory.validation";
import { validate, validateQuery } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const subCategoryRouter = Router();

// Public (Used for dependent dropdowns in website & forms: e.g. /api/subcategories?category={categoryId})
subCategoryRouter.get("/", validateQuery(subCategoryQuerySchema), asyncHandler(getPublicSubCategories));
subCategoryRouter.get("/:slugOrId", asyncHandler(getSubCategory));

// Admin Protected
subCategoryRouter.get(
  "/admin/all",
  authMiddleware,
  requirePermissions(PERMISSIONS.CATEGORY_VIEW),
  validateQuery(subCategoryQuerySchema),
  asyncHandler(getAdminSubCategories)
);

subCategoryRouter.post(
  "/",
  authMiddleware,
  requirePermissions(PERMISSIONS.CATEGORY_CREATE),
  validate(createSubCategorySchema),
  asyncHandler(createSubCategory)
);

subCategoryRouter.put(
  "/:id",
  authMiddleware,
  requirePermissions(PERMISSIONS.CATEGORY_UPDATE),
  validate(updateSubCategorySchema),
  asyncHandler(updateSubCategory)
);

subCategoryRouter.delete(
  "/:id",
  authMiddleware,
  requirePermissions(PERMISSIONS.CATEGORY_DELETE),
  asyncHandler(deleteSubCategory)
);

export { subCategoryRouter };
