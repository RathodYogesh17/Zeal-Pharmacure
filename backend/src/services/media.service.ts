import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import "multer";
import Media from "../models/media.model";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import type { IMedia, MediaType, StorageProvider } from "../types/gallery.types";

interface SavedMedia {
  media: IMedia;
  reused: boolean;
  restored: boolean;
}

interface MediaReference {
  id: string;
  url: string;
}

interface UploadMediaOptions {
  tag?: string;
  folder?: string;
  tags?: string[];
  title?: string;
  altText?: string;
  caption?: string;
  isPublic?: boolean;
  storageProvider?: StorageProvider;
  storageKey?: string;
  width?: number | null;
  height?: number | null;
}

const detectMediaType = (mimeType: string): MediaType => {
  const mime = (mimeType || "").toLowerCase();
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  if (mime === "application/pdf") return "PDF";
  if (
    mime.includes("word") ||
    mime.includes("document") ||
    mime.includes("excel") ||
    mime.includes("spreadsheet") ||
    mime.includes("presentation") ||
    mime.includes("powerpoint") ||
    mime.includes("csv") ||
    mime.includes("text/plain") ||
    mime.includes("rtf")
  ) {
    return "DOCUMENT";
  }
  return "OTHER";
};

const registerUploadedMedia = async (
  file: Express.Multer.File,
  uploadedBy?: mongoose.Types.ObjectId | string | null,
  optionsOrTag: any = "PRODUCT"
): Promise<SavedMedia> => {
  const options: UploadMediaOptions =
    typeof optionsOrTag === "string"
      ? { tag: optionsOrTag, folder: optionsOrTag }
      : optionsOrTag || {};

  const tag = String(options.tag || options.folder || "PRODUCT").toUpperCase();
  const folder = String(options.folder || tag || "OTHER").toUpperCase();
  const tags = Array.isArray(options.tags)
    ? options.tags.map(String)
    : tag
    ? [tag]
    : [];

  const buffer = await fs.readFile(file.path);
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  const existing = (await Media.findOne({ hash }).lean()) as IMedia | null;
  const ownerId =
    uploadedBy && mongoose.Types.ObjectId.isValid(String(uploadedBy))
      ? new mongoose.Types.ObjectId(String(uploadedBy))
      : null;

  const mediaType: MediaType = detectMediaType(file.mimetype);
  const storageKey = options.storageKey || file.filename;
  const storageProvider: StorageProvider = options.storageProvider || "LOCAL";
  const title =
    options.title !== undefined
      ? String(options.title).trim()
      : file.originalname.replace(/\.[^/.]+$/, "");
  const altText = options.altText ? String(options.altText).trim() : "";
  const caption = options.caption ? String(options.caption).trim() : "";
  const isPublic = options.isPublic !== undefined ? Boolean(options.isPublic) : true;
  const width = options.width !== undefined ? options.width : null;
  const height = options.height !== undefined ? options.height : null;

  if (existing?.isDeleted === false) {
    await fs.unlink(file.path).catch(() => undefined);
    return { media: existing, reused: true, restored: false };
  }

  if (existing) {
    const previousFilePath = path.join(path.dirname(file.path), existing.filename);
    const restored = (await Media.findByIdAndUpdate(
      existing._id,
      {
        originalName: file.originalname,
        filename: file.filename,
        url: `/uploads/gallery/${file.filename}`,
        storageKey,
        storageProvider,
        mediaType,
        mimeType: file.mimetype,
        size: file.size,
        width,
        height,
        title,
        altText,
        caption,
        folder,
        tags,
        isPublic,
        uploadedBy: ownerId,
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
      },
      { new: true }
    ).lean()) as IMedia;

    if (existing.filename !== file.filename) {
      await fs.unlink(previousFilePath).catch(() => undefined);
    }

    return { media: restored, reused: false, restored: true };
  }

  const created = (
    await Media.create({
      originalName: file.originalname,
      filename: file.filename,
      url: `/uploads/gallery/${file.filename}`,
      storageKey,
      storageProvider,
      mediaType,
      mimeType: file.mimetype,
      size: file.size,
      width,
      height,
      title,
      altText,
      caption,
      folder,
      tags,
      isPublic,
      hash,
      uploadedBy: ownerId,
    })
  ).toObject() as IMedia;

  return { media: created, reused: false, restored: false };
};

const resolveMediaReference = async (
  mediaId?: string | null,
  fallbackUrl?: string | null
): Promise<MediaReference | null> => {
  if (!mediaId) {
    return fallbackUrl ? { id: "", url: fallbackUrl } : null;
  }

  if (!mongoose.Types.ObjectId.isValid(mediaId)) {
    throw new AppError(MESSAGES.INVALID_MEDIA_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const media = (await Media.findOne({ _id: mediaId, isDeleted: false }).lean()) as IMedia | null;
  if (!media) {
    throw new AppError(MESSAGES.MEDIA_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return { id: String(media._id), url: media.url };
};

export { registerUploadedMedia, resolveMediaReference, detectMediaType };
export type { UploadMediaOptions };