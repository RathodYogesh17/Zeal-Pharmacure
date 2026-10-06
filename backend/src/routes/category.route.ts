import { Router } from "express";
import { createCategory, getPublicCategories, getAdminCategories, getCategory, updateCategory, deleteCategory,} from "../controllers/category.controller";
import { createCategorySchema, updateCategorySchema, categoryQuerySchema,} from "../validations/category.validation";
import { validate, validateQuery } from "../middleware/validation.middleware";
import { uploadCategoryImage, attachCategoryImageUrl,} from "../middleware/upload.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const categoryRouter = Router();

// PUBLIC ROUTES (Website visitors & clients)
categoryRouter.get("/", asyncHandler(getPublicCategories));

// ADMIN PROTECTED ROUTES (Staff & Managers)
categoryRouter.get( "/admin/all", authMiddleware, requirePermissions(PERMISSIONS.CATEGORY_VIEW), validateQuery(categoryQuerySchema), asyncHandler(getAdminCategories));
categoryRouter.post("/", authMiddleware, requirePermissions(PERMISSIONS.CATEGORY_CREATE), uploadCategoryImage, attachCategoryImageUrl, validate(createCategorySchema), asyncHandler(createCategory));
categoryRouter.put("/:id", authMiddleware, requirePermissions(PERMISSIONS.CATEGORY_UPDATE), uploadCategoryImage, attachCategoryImageUrl, validate(updateCategorySchema), asyncHandler(updateCategory));
categoryRouter.delete("/:id", authMiddleware, requirePermissions(PERMISSIONS.CATEGORY_DELETE), asyncHandler(deleteCategory));

// Slug or ID lookup for public website (Must be after specific routes)
categoryRouter.get("/:slugOrId", asyncHandler(getCategory));

export { categoryRouter };
