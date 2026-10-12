import type { Request, Response } from "express";
import type {
  IGalleryRequest,
  IGalleryUploadResponse,
  IGalleryListResponse,
  IMedia,
} from "../types/gallery.types";
import Media from "../models/media.model";
import User from "../models/user.model";
import Product from "../models/product.model";
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

  const folderParam = req.body?.folder || req.body?.tag;
  const folder = String(folderParam || "PRODUCT").toUpperCase();
  const tag = folder;
  const rawTags = req.body?.tags
    ? (Array.isArray(req.body.tags) ? req.body.tags : [String(req.body.tags)])
    : [folder];
  const tags = Array.from(new Set([folder, ...rawTags.map(String)]));

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

  const andClauses: any[] = [];

  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    andClauses.push({
      $or: [
        { originalName: searchRegex },
        { filename: searchRegex },
        { title: searchRegex },
        { altText: searchRegex },
        { caption: searchRegex },
        { tags: searchRegex },
      ],
    });
  }

  const activeCategory = folder && folder !== "ALL" ? folder : tag && tag !== "ALL" ? tag : "";
  if (activeCategory) {
    const norm = activeCategory.toUpperCase();
    const isProduct = norm === "PRODUCT" || norm === "PRODUCTS";
    const isProfile = norm === "PROFILE" || norm === "PROFILES" || norm === "STAFF";
    const isBanner = norm === "BANNER" || norm === "BANNERS" || norm === "CMS";
    const isLogo = norm === "LOGO" || norm === "LOGOS" || norm === "BRANDING";

    const catOr: any[] = [
      { folder: norm },
      { tags: norm },
    ];

    if (isProduct) {
      catOr.push({ folder: "PRODUCT" }, { folder: "PRODUCTS" }, { tags: "PRODUCT" }, { tags: "PRODUCTS" });
    }
    if (isProfile) {
      catOr.push({ folder: "STAFF" }, { tags: "STAFF" }, { folder: "PROFILE" }, { tags: "PROFILE" }, { folder: "PROFILES" });
    }
    if (isBanner) {
      catOr.push({ tags: "CMS" }, { tags: "HERO" }, { folder: "BANNER" }, { folder: "BANNERS" });
    }
    if (isLogo) {
      catOr.push({ tags: "BRANDING" }, { folder: "LOGO" }, { folder: "LOGOS" });
    }

    andClauses.push({ $or: catOr });
  }

  if (andClauses.length > 0) {
    filter.$and = andClauses;
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

  const mappedItems = items.map((item) => ({
    ...item,
    tag: item.folder || (item.tags && item.tags[0]) || "OTHER",
  }));

  const response: IGalleryListResponse = {
    items: mappedItems as any,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.GALLERY_FETCHED, response);
};

const updateGalleryImage = async (req: IGalleryRequest, res: Response): Promise<void> => {
  const media = await Media.findOne({ _id: req.params.id, isDeleted: false });
  if (!media) {
    throw new AppError(MESSAGES.MEDIA_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const { title, altText, caption, folder, tag, tags, isPublic } = req.body;
  const newFolder = String(folder || tag || "").trim().toUpperCase();

  if (title !== undefined) media.title = String(title).trim();
  if (altText !== undefined) media.altText = String(altText).trim();
  if (caption !== undefined) media.caption = String(caption).trim();
  if (newFolder) {
    media.folder = newFolder;
    const currentTags = Array.isArray(media.tags) ? media.tags : [];
    if (!currentTags.includes(newFolder)) {
      media.tags = [newFolder, ...currentTags];
    }
  }
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

  const responseObj = {
    ...media.toObject(),
    tag: media.folder,
  };

  sendSuccess(res, HTTP_STATUS.OK, "Media details updated successfully", responseObj);
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

const autoOrganizeGallery = async (req: Request, res: Response): Promise<void> => {
  let profileCount = 0;
  let productCount = 0;
  let logoCount = 0;
  let bannerCount = 0;

  // 1. Staff / User profile pictures
  const users = await User.find({ isDeleted: false })
    .select("profileImage profileImageId name email role")
    .lean();

  for (const user of users) {
    if (user.profileImageId) {
      const updated = await Media.findByIdAndUpdate(user.profileImageId, {
        folder: "PROFILE",
        $addToSet: { tags: { $each: ["PROFILE", "STAFF", "AVATAR"] } },
        caption: `Profile photo of ${user.name || "Staff"}`,
      });
      if (updated) profileCount++;
    }
    if (user.profileImage) {
      const filename = user.profileImage.split("/").pop()?.split("?")[0];
      if (filename) {
        const updated = await Media.findOneAndUpdate(
          { $or: [{ url: user.profileImage }, { filename }], folder: { $ne: "PROFILE" } },
          {
            folder: "PROFILE",
            $addToSet: { tags: { $each: ["PROFILE", "STAFF", "AVATAR"] } },
            caption: `Profile photo of ${user.name || "Staff"}`,
          }
        );
        if (updated) profileCount++;
      }
    }
  }

  // 2. Product Formulations
  const products = await Product.find({ isDeleted: false })
    .select("featuredImage featuredImageId mediaGallery name")
    .lean();

  for (const prod of products) {
    if (prod.featuredImageId) {
      const updated = await Media.findByIdAndUpdate(prod.featuredImageId, {
        folder: "PRODUCT",
        $addToSet: { tags: { $each: ["PRODUCT", "FORMULATION"] } },
      });
      if (updated) productCount++;
    }
    if (prod.featuredImage) {
      const filename = prod.featuredImage.split("/").pop()?.split("?")[0];
      if (filename) {
        const updated = await Media.findOneAndUpdate(
          { $or: [{ url: prod.featuredImage }, { filename }], folder: { $nin: ["PROFILE", "PRODUCT"] } },
          {
            folder: "PRODUCT",
            $addToSet: { tags: { $each: ["PRODUCT", "FORMULATION"] } },
          }
        );
        if (updated) productCount++;
      }
    }
    if (Array.isArray(prod.mediaGallery)) {
      for (const item of prod.mediaGallery) {
        const url = typeof item === "string" ? item : (item as any)?.url;
        const filename = url ? url.split("/").pop()?.split("?")[0] : null;
        if (filename) {
          const updated = await Media.findOneAndUpdate(
            { $or: [{ url }, { filename }], folder: { $nin: ["PROFILE", "PRODUCT"] } },
            {
              folder: "PRODUCT",
              $addToSet: { tags: { $each: ["PRODUCT", "FORMULATION"] } },
            }
          );
          if (updated) productCount++;
        }
      }
    }
  }

  // 3. Name & Filename Heuristics for Logos, Banners & Profiles
  const allMedia = await Media.find({ isDeleted: false }).lean();
  for (const m of allMedia) {
    const nameLower = `${m.originalName} ${m.filename} ${m.title || ""}`.toLowerCase();

    // Check if it's a Logo
    if (
      nameLower.includes("logo") ||
      nameLower.includes("brand") ||
      nameLower.includes("zeal-logo") ||
      nameLower.includes("icon")
    ) {
      if (m.folder !== "LOGO") {
        await Media.findByIdAndUpdate(m._id, {
          folder: "LOGO",
          $addToSet: { tags: { $each: ["LOGO", "BRANDING"] } },
        });
        logoCount++;
      }
    }
    // Check if it's a Banner / Hero Slider
    else if (
      nameLower.includes("banner") ||
      nameLower.includes("hero") ||
      nameLower.includes("slider") ||
      nameLower.includes("slide")
    ) {
      if (m.folder !== "BANNER") {
        await Media.findByIdAndUpdate(m._id, {
          folder: "BANNER",
          $addToSet: { tags: { $each: ["BANNER", "CMS", "HERO"] } },
        });
        bannerCount++;
      }
    }
    // Check if it's an Avatar / Profile / Staff photo
    else if (
      nameLower.includes("avatar") ||
      nameLower.includes("profile") ||
      nameLower.includes("staff") ||
      nameLower.includes("user") ||
      nameLower.includes("employee") ||
      nameLower.includes("doctor")
    ) {
      if (m.folder !== "PROFILE") {
        await Media.findByIdAndUpdate(m._id, {
          folder: "PROFILE",
          $addToSet: { tags: { $each: ["PROFILE", "STAFF", "AVATAR"] } },
        });
        profileCount++;
      }
    }
  }

  const totalUpdated = profileCount + productCount + logoCount + bannerCount;
  sendSuccess(res, HTTP_STATUS.OK, `Gallery assets organized successfully! Updated ${totalUpdated} assets.`, {
    totalUpdated,
    profileCount,
    productCount,
    logoCount,
    bannerCount,
  });
};

const batchMoveGalleryImages = async (req: IGalleryRequest, res: Response): Promise<void> => {
  const { ids, folder } = req.body;
  if (!Array.isArray(ids) || ids.length === 0 || !folder) {
    throw new AppError("Valid IDs array and target folder are required", HTTP_STATUS.BAD_REQUEST);
  }

  const normalizedFolder = String(folder).trim().toUpperCase();
  await Media.updateMany(
    { _id: { $in: ids }, isDeleted: false },
    {
      $set: { folder: normalizedFolder },
      $addToSet: { tags: normalizedFolder },
    }
  );

  sendSuccess(res, HTTP_STATUS.OK, `Successfully moved ${ids.length} images to ${normalizedFolder}`);
};

export {
  uploadGalleryImages,
  getGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  autoOrganizeGallery,
  batchMoveGalleryImages,
};
