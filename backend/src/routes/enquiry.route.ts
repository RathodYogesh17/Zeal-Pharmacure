import { Router } from "express";
import {
  createProductEnquiry,
  createFranchiseEnquiry,
  createEnquiry,
  confirmEnquiry,
  validateDrugLicense,
  getAllProductEnquiries,
  getAllFranchiseEnquiries,
  getAllEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  assignEnquiry,
  addEnquiryNote,
  deleteEnquiry,
} from "../controllers/enquiry.controller";
import {
  createProductEnquirySchema,
  createFranchiseEnquirySchema,
  createEnquirySchema,
  validateDlSchema,
  updateEnquiryStatusSchema,
  assignEnquirySchema,
  addEnquiryNoteSchema,
  enquiryQuerySchema,
} from "../validations/enquiry.validation";
import { validate, validateQuery } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const enquiryRouter = Router();

// =====================================================
// PUBLIC ROUTES (Doctors, Chemists, B2B PCD Franchisees)
// =====================================================
enquiryRouter.post("/", validate(createEnquirySchema), asyncHandler(createEnquiry));
enquiryRouter.post("/product", validate(createProductEnquirySchema), asyncHandler(createProductEnquiry));
enquiryRouter.post("/franchise", validate(createFranchiseEnquirySchema), asyncHandler(createFranchiseEnquiry));
enquiryRouter.post("/:id/confirm", asyncHandler(confirmEnquiry));
enquiryRouter.post("/validate-dl", validate(validateDlSchema), asyncHandler(validateDrugLicense));
enquiryRouter.get("/validate-dl", asyncHandler(validateDrugLicense));

// =====================================================
// PROTECTED ROUTES (Sales Managers, Admins, Staff)
// =====================================================
enquiryRouter.get(
  "/products",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_ENQUIRY_VIEW),
  validateQuery(enquiryQuerySchema),
  asyncHandler(getAllProductEnquiries)
);

enquiryRouter.get(
  "/franchises",
  authMiddleware,
  requirePermissions(PERMISSIONS.SALES_ENQUIRY_VIEW, PERMISSIONS.PRODUCT_ENQUIRY_VIEW),
  validateQuery(enquiryQuerySchema),
  asyncHandler(getAllFranchiseEnquiries)
);

enquiryRouter.get(
  "/",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_ENQUIRY_VIEW),
  validateQuery(enquiryQuerySchema),
  asyncHandler(getAllEnquiries)
);

enquiryRouter.get(
  "/:id",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_ENQUIRY_VIEW),
  asyncHandler(getEnquiry)
);

enquiryRouter.patch(
  "/:id/status",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_ENQUIRY_UPDATE),
  validate(updateEnquiryStatusSchema),
  asyncHandler(updateEnquiryStatus)
);

enquiryRouter.patch(
  "/:id/assign",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_ENQUIRY_ASSIGN),
  validate(assignEnquirySchema),
  asyncHandler(assignEnquiry)
);

enquiryRouter.post(
  "/:id/notes",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_ENQUIRY_UPDATE),
  validate(addEnquiryNoteSchema),
  asyncHandler(addEnquiryNote)
);

enquiryRouter.delete(
  "/:id",
  authMiddleware,
  requirePermissions(PERMISSIONS.PRODUCT_ENQUIRY_DELETE),
  asyncHandler(deleteEnquiry)
);

export { enquiryRouter };