import fs from "fs";
import path from "path";
import multer, { type FileFilterCallback } from "multer";



const galleryDir = path.resolve(process.cwd(), "uploads", "gallery");
if (!fs.existsSync(galleryDir)) { fs.mkdirSync(galleryDir, { recursive: true });}


const storage = multer.diskStorage({
  destination: (_req: unknown, _file: unknown, cb: (error: Error | null, destination: string) => void) => {
    cb(null, galleryDir);
  },
  filename: (_req: unknown, file: { originalname?: string }, cb: (error: Error | null, filename: string) => void) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    cb(null, `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});


const fileFilter = (  _req: unknown, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/svg+xml"];
  if (allowedTypes.includes(file.mimetype)) { cb(null, true); return;}
  cb(new Error("Only JPG, JPEG, PNG, WEBP, and SVG images are allowed."));
};


const uploadGalleryImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024, files: 100 },
}).array("images", 100);

export { uploadGalleryImages, galleryDir };