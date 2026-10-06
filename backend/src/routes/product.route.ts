import { Router } from "express";
import {
  createProduct,
  getPublicProducts,
  getAdminProducts,
  getProduct,
  getRelatedProducts,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getProductFilters,
  downloadVisualAidPdf,
  duplicateProduct,
} from "../controllers/product.controller";
import {
  createReview,
  getProductReviews,
  getAllReviewsAdmin,
  approveReview,
  replyReview,
  toggleReviewFeature,
  toggleReviewVerification,
  deleteReview as deleteReviewController,
} from "../controllers/review.controller";
import {
  createProductSchema,
  updateProductSchema,
  toggleProductStatusSchema,
  productQuerySchema,
} from "../validations/product.validation";
import {
  createReviewSchema,
  approveReviewSchema,
  adminReplyReviewSchema,
  toggleReviewFeatureSchema,
  toggleReviewVerificationSchema,
  reviewQuerySchema,
} from "../validations/review.validation";
import { validate, validateQuery } from "../middleware/validation.middleware";
import {
  uploadProductImage,
  attachProductImageUrl,
} from "../middleware/upload.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const productRouter = Router();

// =====================================================
// PUBLIC ROUTES (Website visitors, Doctors, Franchisees)
// =====================================================
productRouter.get("/", validateQuery(productQuerySchema), asyncHandler(getPublicProducts));
productRouter.get("/filters", asyncHandler(getProductFilters));
productRouter.get("/related/:slugOrId", asyncHandler(getRelatedProducts));

// Public Reviews
productRouter.post(
  "/:productId/reviews",
  validate(createReviewSchema),
  asyncHandler(createReview)
);
productRouter.get(
  "/:productId/reviews",
  validateQuery(reviewQuerySchema),
  asyncHandler(getProductReviews)
);

// =====================================================
// ADMIN PROTECTED ROUTES (Staff & Catalogue Managers)
// =====================================================
productRouter.get(
  "/admin/all",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_VIEW),
  validateQuery(productQuerySchema),
  asyncHandler(getAdminProducts)
);

// Admin Reviews Moderation
productRouter.get(
  "/admin/reviews",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_VIEW),
  validateQuery(reviewQuerySchema),
  asyncHandler(getAllReviewsAdmin)
);

productRouter.patch(
  "/admin/reviews/:id/approve",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_UPDATE),
  validate(approveReviewSchema),
  asyncHandler(approveReview)
);

productRouter.patch(
  "/admin/reviews/:id/feature",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_UPDATE),
  validate(toggleReviewFeatureSchema),
  asyncHandler(toggleReviewFeature)
);

productRouter.patch(
  "/admin/reviews/:id/verify",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_UPDATE),
  validate(toggleReviewVerificationSchema),
  asyncHandler(toggleReviewVerification)
);

productRouter.post(
  "/admin/reviews/:id/reply",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_UPDATE),
  validate(adminReplyReviewSchema),
  asyncHandler(replyReview)
);

productRouter.delete(
  "/admin/reviews/:id",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_DELETE),
  asyncHandler(deleteReviewController)
);

productRouter.post(
  "/",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_CREATE),
  uploadProductImage,
  attachProductImageUrl,
  validate(createProductSchema),
  asyncHandler(createProduct)
);

productRouter.put(
  "/:id",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_UPDATE),
  uploadProductImage,
  attachProductImageUrl,
  validate(updateProductSchema),
  asyncHandler(updateProduct)
);

productRouter.patch(
  "/:id/status",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_UPDATE),
  validate(toggleProductStatusSchema),
  asyncHandler(toggleProductStatus)
);

productRouter.patch(
  "/:id/toggle-status",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_UPDATE),
  asyncHandler(toggleProductStatus)
);

productRouter.delete(
  "/:id",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_DELETE),
  asyncHandler(deleteProduct)
);

// Duplicate Product
productRouter.post(
  "/:id/duplicate",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_CREATE),
  asyncHandler(duplicateProduct)
);

// Visual Aid / Leave Behind Leaflet (LBL) A4 PDF for MRs, Doctors & Franchisees
productRouter.get("/:slugOrId/visual-aid", asyncHandler(downloadVisualAidPdf));

// Slug or ID lookup for public product details (Must be placed after all specific routes)
productRouter.get("/:slugOrId", asyncHandler(getProduct));

export { productRouter };