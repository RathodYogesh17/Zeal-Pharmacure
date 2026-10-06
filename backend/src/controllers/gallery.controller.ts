import type { Request, Response } from "express";
import type {
  IGalleryRequest,
  IGalleryUploadResponse,
  IGalleryListResponse,
  IMedia,
} from "../types/gallery.types";
import Media from "../models/media.model";
import User from "../models/user.model";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";
import AppError from "../utils/appError";
import { registerUploadedMedia } from "../services/media.service";
import { recordAuditLog } from "../utils/auditLogger";

const getFiles = (req: IGalleryRequest): Express.Multer.File[] =>
  Array.isArray(req.files) ? req.files : [];

const uploadGalleryImages = async (req: IGalleryRequest, res: Response): Promise<void> => {
  const files = getFiles(req);
  if (files.length === 0) {
    throw new AppError(MESSAGES.MEDIA_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const tag = String(req.body?.tag || req.body?.folder || "PRODUCT").toUpperCase();
  const folder = String(req.body?.folder || tag || "OTHER").toUpperCase();
  const tags = req.body?.tags
    ? (Array.isArray(req.body.tags) ? req.body.tags : [String(req.body.tags)])
    : [tag];

  const created: IMedia[] = [];
  const existing: IMedia[] = [];

  const results = await Promise.all(
    files.map((file) =>
      registerUploadedMedia(file, req.user?._id, {
        tag,
        folder,
        tags,
        title: req.body?.title,
        altText: req.body?.altText,
        caption: req.body?.caption,
        isPublic: req.body?.isPublic !== undefined ? Boolean(req.body.isPublic) : true,
      })
    )
  );

  for (const result of results) {
    if (result.reused) {
      existing.push(result.media);
    } else {
      created.push(result.media);
    }
  }

  void recordAuditLog({
    userId: req.user?._id,
    action: "MEDIA_UPLOAD",
    module: "GALLERY",
    targetType: "Media",
    req,
    metadata: {
      total: created.length + existing.length,
      createdCount: created.length,
      existingCount: existing.length,
      folder,
      tag,
    },
  });

  const response: IGalleryUploadResponse = {
    created,
    existing,
    total: created.length + existing.length,
  };
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.GALLERY_UPLOADED, response);
};

const getGalleryImages = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100);
  const search = String(req.query.search || "").trim();
  const folder = req.query.folder ? String(req.query.folder).trim().toUpperCase() : "";
  const tag = req.query.tag ? String(req.query.tag).toUpperCase() : "";
  const mediaType = req.query.mediaType ? String(req.query.mediaType).toUpperCase() : "";
  const isPublicQuery =
    req.query.isPublic !== undefined ? req.query.isPublic === "true" : undefined;

  const filter: Record<string, unknown> = { isDeleted: false };

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    filter.$or = [
      { originalName: searchRegex },
      { filename: searchRegex },
      { title: searchRegex },
      { altText: searchRegex },
      { caption: searchRegex },
      { tags: searchRegex },
    ];
  }

  if (folder && folder !== "ALL") {
    filter.folder = folder;
  } else if (tag && tag !== "ALL") {
    filter.$or = [{ folder: tag }, { tags: tag }];
  }

  if (mediaType && mediaType !== "ALL") {
    filter.mediaType = mediaType;
  }

  if (isPublicQuery !== undefined) {
    filter.isPublic = isPublicQuery;
  }

  const [items, total] = await Promise.all([
    Media.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean() as Promise<IMedia[]>,
    Media.countDocuments(filter) as Promise<number>,
  ]);

  const response: IGalleryListResponse = {
    items,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.GALLERY_FETCHED, response);
};

const updateGalleryImage = async (req: IGalleryRequest, res: Response): Promise<void> => {
  const media = await Media.findOne({ _id: req.params.id, isDeleted: false });
  if (!media) {
    throw new AppError(MESSAGES.MEDIA_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const { title, altText, caption, folder, tags, isPublic } = req.body;
  if (title !== undefined) media.title = String(title).trim();
  if (altText !== undefined) media.altText = String(altText).trim();
  if (caption !== undefined) media.caption = String(caption).trim();
  if (folder !== undefined) media.folder = String(folder).trim().toUpperCase();
  if (tags !== undefined) media.tags = Array.isArray(tags) ? tags.map(String) : [];
  if (isPublic !== undefined) media.isPublic = Boolean(isPublic);

  await media.save();

  void recordAuditLog({
    userId: req.user?._id,
    action: "MEDIA_UPDATE",
    module: "GALLERY",
    targetType: "Media",
    targetId: String(req.params.id),
    req,
  });

  sendSuccess(res, HTTP_STATUS.OK, "Media details updated successfully", media.toObject());
};

const deleteGalleryImage = async (req: IGalleryRequest, res: Response): Promise<void> => {
  const media = (await Media.findOne({ _id: req.params.id, isDeleted: false })) as IMedia | null;

  if (!media) {
    throw new AppError(MESSAGES.MEDIA_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  const profileUsageCount = await User.countDocuments({
    profileImageId: media._id,
    isDeleted: false,
  });
  if (profileUsageCount > 0) {
    throw new AppError(MESSAGES.MEDIA_IN_USE, HTTP_STATUS.CONFLICT);
  }

  await Media.findByIdAndUpdate(media._id, {
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: req.user?._id || null,
  });

  void recordAuditLog({
    userId: req.user?._id,
    action: "MEDIA_DELETE",
    module: "GALLERY",
    targetType: "Media",
    targetId: String(req.params.id),
    req,
  });

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.GALLERY_DELETED);
};

export {
  uploadGalleryImages,
  getGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
};
