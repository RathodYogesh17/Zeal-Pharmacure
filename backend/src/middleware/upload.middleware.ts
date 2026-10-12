import multer, { type FileFilterCallback } from "multer";
import { galleryDir } from "./galleryUpload.middleware";
import { registerUploadedMedia } from "../services/media.service";

type UploadedFile = Express.Multer.File;


const storage = multer.diskStorage({
  destination: ( _req: import("express").Request, _file: UploadedFile,
    cb: (error: Error | null, destination: string) => void ) => {
    cb(null, galleryDir); },
  filename: (  _req: import("express").Request,  file: UploadedFile,  cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.originalname ? file.originalname.slice(file.originalname.lastIndexOf(".")) : "";
    cb(null, `image-${uniqueSuffix}${ext.toLowerCase()}`);
  },
});



const fileFilter = (
  _req: import("express").Request,
  file: UploadedFile,
  cb: FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) { cb(null, true);
    return;
  }
  cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed."));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024,},});
const uploadNone = multer().none();
const uploadProfileImage = upload.single("profileImage");
const uploadCategoryImage = upload.single("image");
const uploadProductImage = upload.single("featuredImage");

const attachProductImageUrl = (
  req: import("express").Request,
  _res: import("express").Response,
  next: import("express").NextFunction
) => {
  void (async () => {
    if (req.file) {
      const authenticatedRequest = req as import("express").Request & {
        user?: { _id: string };
      };
      const result = await registerUploadedMedia(req.file, authenticatedRequest.user?._id || null, {
        tag: "PRODUCT",
        folder: "PRODUCT",
        tags: ["PRODUCT", "FORMULATION"],
        title: req.body?.name ? `Product - ${req.body.name}` : undefined,
      });
      req.body = {
        ...req.body,
        featuredImage: result.media.url,
        featuredImageId: String(result.media._id),
      };
    }
    next();
  })().catch(next);
};

const attachProfileImageUrl = (
  req: import("express").Request,
  _res: import("express").Response,
  next: import("express").NextFunction
) => {
  void (async () => {
    if (req.file) {
      const authenticatedRequest = req as import("express").Request & {
        user?: { _id: string; name?: string };
      };
      const userName = (authenticatedRequest.user?.name || req.body?.name || "Staff Member").trim();
      const result = await registerUploadedMedia(req.file, authenticatedRequest.user?._id || null, {
        tag: "PROFILE",
        folder: "PROFILE",
        tags: ["PROFILE", "STAFF", "AVATAR"],
        title: `Profile Photo - ${userName}`,
        caption: `User / Staff Profile Photo for ${userName}`,
      });
      req.body = {
        ...req.body,
        profileImage: result.media.url,
        profileImageId: String(result.media._id),
      };
    }
    next();
  })().catch(next);
};

const attachCategoryImageUrl = (
  req: import("express").Request,
  _res: import("express").Response,
  next: import("express").NextFunction
) => {
  void (async () => {
    if (req.file) {
      const authenticatedRequest = req as import("express").Request & {
        user?: { _id: string };
      };
      const result = await registerUploadedMedia(req.file, authenticatedRequest.user?._id || null, {
        tag: "CATEGORY",
        folder: "CATEGORY",
        tags: ["CATEGORY", "THERAPEUTIC"],
        title: req.body?.name ? `Category - ${req.body.name}` : undefined,
      });
      req.body = {
        ...req.body,
        image: result.media.url,
        imageId: String(result.media._id),
      };
    }
    next();
  })().catch(next);
};

export {
  uploadNone,
  uploadProfileImage,
  attachProfileImageUrl,
  uploadCategoryImage,
  attachCategoryImageUrl,
  uploadProductImage,
  attachProductImageUrl,
};

