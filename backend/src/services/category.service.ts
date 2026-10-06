import mongoose from "mongoose";
import Category from "../models/category.model";
import "../models/user.model";
import "../models/media.model";
import { createSlug, generateUniqueSlug } from "../utils/slug";
import { resolveMediaReference } from "./media.service";

import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { buildPagination } from "../utils/pagination";
import type {
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
  ICategoryQuery,
} from "../types/category.types";
import type { IAuthenticatedUser } from "../types/user.types";

const auditPopulate = [
  { path: "createdBy", select: "name email role" },
  { path: "updatedBy", select: "name email role" },
  { path: "imageId", select: "url originalName mimeType size" },
  { path: "bannerImageId", select: "url originalName mimeType size" },
];

const validateCategoryId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(MESSAGES.INVALID_CATEGORY_ID, HTTP_STATUS.BAD_REQUEST);
  }
};

// =====================================================
// CREATE CATEGORY
// =====================================================
const createCategory = async (body: ICreateCategoryRequest, user?: IAuthenticatedUser) => {
  const trimmedName = body.name.trim();

  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    isDeleted: false,
  });

  if (existingCategory) {
    throw new AppError(MESSAGES.CATEGORY_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }

  // Code validation (if provided)
  const codeValue = body.code ? body.code.trim().toUpperCase() : null;
  if (codeValue) {
    const existingCode = await Category.findOne({
      code: codeValue,
      isDeleted: false,
    });
    if (existingCode) {
      throw new AppError("Category code already in use", HTTP_STATUS.CONFLICT);
    }
  }

  const rawSlug = body.slug ? body.slug.trim() : trimmedName;
  const uniqueSlug = await generateUniqueSlug(rawSlug, async (slugCandidate) => {
    const found = await Category.findOne({ slug: slugCandidate, isDeleted: false });
    return Boolean(found);
  });

  const media = await resolveMediaReference(body.imageId, body.image);
  const bannerMedia = await resolveMediaReference(body.bannerImageId, body.bannerImage);

  const category = await Category.create({
    name: trimmedName,
    code: codeValue,
    slug: uniqueSlug,
    shortDescription: body.shortDescription?.trim() || "",
    description: body.description?.trim() || "",
    image: media?.url || null,
    imageId: media?.id ? new mongoose.Types.ObjectId(media.id) : null,
    bannerImage: bannerMedia?.url || null,
    bannerImageId: bannerMedia?.id ? new mongoose.Types.ObjectId(bannerMedia.id) : null,
    icon: body.icon?.trim() || null,
    sortOrder: Number(body.sortOrder) || 0,
    isFeatured: Boolean(body.isFeatured),
    showOnHome: Boolean(body.showOnHome),
    showInMenu: Boolean(body.showInMenu),
    seo: {
      metaTitle: body.seo?.metaTitle?.trim() || "",
      metaDescription: body.seo?.metaDescription?.trim() || "",
      keywords: body.seo?.keywords || [],
      canonicalUrl: body.seo?.canonicalUrl?.trim() || "",
    },
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    isDeleted: false,
    deletedAt: null,
    createdBy: user?._id || null,
    updatedBy: null,
    deletedBy: null,
  });

  return Category.findById(category._id).populate(auditPopulate).lean();
};

// =====================================================
// GET ALL CATEGORIES (PUBLIC & ADMIN)
// =====================================================
const getAllCategories = async (query: ICategoryQuery = {}, isPublic: boolean = false) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (isPublic) {
    filter.isActive = true;
    if (query.isFeatured !== undefined) {
      filter.isFeatured = query.isFeatured === "true";
    }
    if (query.showOnHome !== undefined) {
      filter.showOnHome = query.showOnHome === "true";
    }
    if (query.showInMenu !== undefined) {
      filter.showInMenu = query.showInMenu === "true";
    }

    const categories = await Category.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .lean();
    return { categories, total: categories.length };
  }

  const { page, limit, skip } = buildPagination(Number(query.page ?? 1), Number(query.limit ?? 20));

  if (query.search && query.search.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { name: searchRegex },
      { code: searchRegex },
      { description: searchRegex },
      { shortDescription: searchRegex },
      { slug: searchRegex },
    ];
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured === "true";
  }

  if (query.showOnHome !== undefined) {
    filter.showOnHome = query.showOnHome === "true";
  }

  if (query.showInMenu !== undefined) {
    filter.showInMenu = query.showInMenu === "true";
  }

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .populate(auditPopulate)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Category.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { categories, total, page, limit, totalPages };
};

// =====================================================
// GET SINGLE CATEGORY (BY ID, SLUG, OR CODE)
// =====================================================
const getCategoryBySlugOrId = async (slugOrId: string, isPublic: boolean = false) => {
  const filter: Record<string, unknown> = { isDeleted: false };
  if (isPublic) {
    filter.isActive = true;
  }

  const normalized = slugOrId.trim();
  if (mongoose.Types.ObjectId.isValid(normalized)) {
    filter.$or = [
      { _id: normalized },
      { slug: normalized.toLowerCase() },
      { code: normalized.toUpperCase() },
    ];
  } else {
    filter.$or = [
      { slug: normalized.toLowerCase() },
      { code: normalized.toUpperCase() },
    ];
  }

  const category = await Category.findOne(filter).populate(auditPopulate).lean();
  if (!category) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return category;
};

// =====================================================
// UPDATE CATEGORY
// =====================================================
const updateCategory = async (
  id: string,
  body: IUpdateCategoryRequest,
  user?: IAuthenticatedUser
) => {
  validateCategoryId(id);

  const existingCategory = await Category.findOne({ _id: id, isDeleted: false });
  if (!existingCategory) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const updatePayload: Record<string, unknown> = {
    updatedBy: user?._id || null,
  };

  if (body.name && body.name.trim() !== existingCategory.name) {
    const trimmedName = body.name.trim();
    const duplicate = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      _id: { $ne: id },
      isDeleted: false,
    });

    if (duplicate) {
      throw new AppError(MESSAGES.CATEGORY_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    updatePayload.name = trimmedName;

    // Regenerate slug if not custom provided
    if (!body.slug) {
      updatePayload.slug = await generateUniqueSlug(trimmedName, async (candidate) => {
        const found = await Category.findOne({
          slug: candidate,
          _id: { $ne: id },
          isDeleted: false,
        });
        return Boolean(found);
      });
    }
  }

  if (body.code !== undefined) {
    const trimmedCode = body.code ? body.code.trim().toUpperCase() : null;
    if (trimmedCode) {
      const duplicateCode = await Category.findOne({
        code: trimmedCode,
        _id: { $ne: id },
        isDeleted: false,
      });
      if (duplicateCode) {
        throw new AppError("Category code already in use", HTTP_STATUS.CONFLICT);
      }
    }
    updatePayload.code = trimmedCode;
  }

  if (body.slug) {
    const trimmedSlug = createSlug(body.slug);
    const duplicateSlug = await Category.findOne({
      slug: trimmedSlug,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (duplicateSlug) {
      throw new AppError("Category slug already in use", HTTP_STATUS.CONFLICT);
    }
    updatePayload.slug = trimmedSlug;
  }

  if (body.shortDescription !== undefined) {
    updatePayload.shortDescription = body.shortDescription.trim();
  }

  if (body.description !== undefined) {
    updatePayload.description = body.description.trim();
  }

  if (body.icon !== undefined) {
    updatePayload.icon = body.icon?.trim() || null;
  }

  if (body.sortOrder !== undefined) {
    updatePayload.sortOrder = Number(body.sortOrder);
  }

  if (body.isFeatured !== undefined) {
    updatePayload.isFeatured = Boolean(body.isFeatured);
  }

  if (body.showOnHome !== undefined) {
    updatePayload.showOnHome = Boolean(body.showOnHome);
  }

  if (body.showInMenu !== undefined) {
    updatePayload.showInMenu = Boolean(body.showInMenu);
  }

  if (body.seo !== undefined) {
    updatePayload.seo = {
      metaTitle: body.seo.metaTitle?.trim() || "",
      metaDescription: body.seo.metaDescription?.trim() || "",
      keywords: body.seo.keywords || [],
      canonicalUrl: body.seo.canonicalUrl?.trim() || "",
    };
  }

  if (body.isActive !== undefined) {
    updatePayload.isActive = Boolean(body.isActive);
  }

  if (body.imageId !== undefined || body.image !== undefined) {
    const media = await resolveMediaReference(body.imageId, body.image);
    updatePayload.image = media?.url || null;
    updatePayload.imageId = media?.id ? new mongoose.Types.ObjectId(media.id) : null;
  }

  if (body.bannerImageId !== undefined || body.bannerImage !== undefined) {
    const bannerMedia = await resolveMediaReference(body.bannerImageId, body.bannerImage);
    updatePayload.bannerImage = bannerMedia?.url || null;
    updatePayload.bannerImageId = bannerMedia?.id ? new mongoose.Types.ObjectId(bannerMedia.id) : null;
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  })
    .populate(auditPopulate)
    .lean();

  return updatedCategory;
};

// =====================================================
// DELETE CATEGORY (SOFT DELETE)
// =====================================================
const deleteCategory = async (id: string, user?: IAuthenticatedUser) => {
  validateCategoryId(id);

  const deletedCategory = await Category.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id || null,
    },
    { new: true }
  ).lean();

  if (!deletedCategory) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return {
    _id: deletedCategory._id,
    name: deletedCategory.name,
    isDeleted: deletedCategory.isDeleted,
    deletedAt: deletedCategory.deletedAt,
  };
};

export {
  createCategory,
  getAllCategories,
  getCategoryBySlugOrId,
  updateCategory,
  deleteCategory,
};
