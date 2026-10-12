import path from "path";
import os from "os";
import multer, { type FileFilterCallback } from "multer";
import type { Request, Response, NextFunction } from "express";

const galleryDir = path.join(os.tmpdir(), "uploads", "gallery");

// Use memoryStorage for serverless environments & direct cloud streaming
const storage = multer.memoryStorage();

const fileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error("Only JPG, JPEG, PNG, WEBP, and SVG images are allowed."));
};

const multerArrayUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 50 },
}).array("images", 50);

// Safe middleware wrapper catching Multer errors before Express fails
const uploadGalleryImages = (req: Request, res: Response, next: NextFunction) => {
  multerArrayUpload(req, res, (err: any) => {
    if (err) {
      console.error("[GALLERY UPLOAD] Multer processing error:", err);
      const origin = req.headers?.origin;
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }
      return res.status(400).json({
        success: false,
        message: err.message || "File upload processing failed",
      });
    }
    next();
  });
};

export { uploadGalleryImages, galleryDir };