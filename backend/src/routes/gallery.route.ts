import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadGalleryImages } from "../middleware/galleryUpload.middleware";
import {
  uploadGalleryImages as uploadImages,
  getGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  autoOrganizeGallery,
  batchMoveGalleryImages,
  batchDeleteGalleryImages,
} from "../controllers/gallery.controller";
import asyncHandler from "../utils/asyncHandler";

const galleryRouter = Router();

// Allow browsing gallery images for modal picker & admin gallery
galleryRouter.get("/", asyncHandler(getGalleryImages));

// Auto-organize all old & unassigned media into correct folders (PROFILE, PRODUCT, LOGO, BANNER)
galleryRouter.post("/auto-organize", authMiddleware, asyncHandler(autoOrganizeGallery));

// Batch move media assets into a folder
galleryRouter.post("/batch-move", authMiddleware, asyncHandler(batchMoveGalleryImages));

// Batch delete media assets
galleryRouter.post("/batch-delete", authMiddleware, asyncHandler(batchDeleteGalleryImages));

// Upload requires authenticated staff
galleryRouter.post(
  "/upload",
  authMiddleware,
  uploadGalleryImages,
  asyncHandler(uploadImages)
);

// Update media details (title, altText, caption, folder, tags, isPublic)
galleryRouter.patch("/:id", authMiddleware, asyncHandler(updateGalleryImage));
galleryRouter.put("/:id", authMiddleware, asyncHandler(updateGalleryImage));

// Delete requires authenticated staff
galleryRouter.delete("/:id", authMiddleware, asyncHandler(deleteGalleryImage));

export { galleryRouter };