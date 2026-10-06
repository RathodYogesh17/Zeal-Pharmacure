import type { Types } from "mongoose";
import type { Request } from "express";
import type { IAuthenticatedUser } from "./user.types";

export type StorageProvider = "LOCAL" | "CLOUDINARY" | "S3" | "OTHER";
export type MediaType = "IMAGE" | "VIDEO" | "PDF" | "DOCUMENT" | "OTHER";

interface IUploadedImage {
  path: string;
  originalname: string;
  filename: string;
  mimetype: string;
  size: number;
}

type IGalleryRequest = Request & {
  user?: IAuthenticatedUser;
};

interface IMedia {
  _id: Types.ObjectId | string;
  originalName: string;
  filename: string;
  url: string;
  storageKey?: string;
  storageProvider?: StorageProvider;
  mediaType: MediaType;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  title?: string;
  altText?: string;
  caption?: string;
  folder?: string;
  tags?: string[];
  isPublic?: boolean;
  hash: string;
  tag?: string;
  uploadedBy?: Types.ObjectId | string | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IGalleryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface IGalleryUploadResponse {
  created: IMedia[];
  existing: IMedia[];
  total: number;
}

interface IGalleryListResponse {
  items: IMedia[];
  pagination: IGalleryPagination;
}

export type {
  IUploadedImage,
  IGalleryRequest,
  IMedia,
  IGalleryPagination,
  IGalleryUploadResponse,
  IGalleryListResponse,
};