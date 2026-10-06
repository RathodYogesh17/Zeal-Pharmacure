import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadGalleryImages } from "../middleware/galleryUpload.middleware";
import {
  uploadGalleryImages as uploadImages,
  getGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/gallery.controller";
import asyncHandler from "../utils/asyncHandler";

const galleryRouter = Router();

// Allow browsing gallery images for modal picker & admin gallery
galleryRouter.get("/", asyncHandler(getGalleryImages));

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