import mongoose from "mongoose";
import SubCategory from "../models/subCategory.model";
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
  ICreateSubCategoryRequest,
  IUpdateSubCategoryRequest,
  ISubCategoryQuery,
} from "../types/subCategory.types";
import type { IAuthenticatedUser } from "../types/user.types";

const defaultPopulate = [
  { path: "category", select: "name slug code description isFeatured" },
  { path: "createdBy", select: "name email role" },
  { path: "updatedBy", select: "name email role" },
];

const validateSubCategoryId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid SubCategory ID", HTTP_STATUS.BAD_REQUEST);
  }
};

const createSubCategory = async (
  body: ICreateSubCategoryRequest,
  user?: IAuthenticatedUser
) => {
  const trimmedName = body.name.trim();

  // Validate Parent Category
  if (!mongoose.Types.ObjectId.isValid(body.category)) {
    throw new AppError(MESSAGES.INVALID_CATEGORY_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const parentCategory = await Category.findOne({
    _id: body.category,
    isDeleted: false,
  });
  if (!parentCategory) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Prevent duplicate within same Category
  const existing = await SubCategory.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    category: body.category,
    isDeleted: false,
  });
  if (existing) {
    throw new AppError("A subcategory with this name already exists in this category", HTTP_STATUS.CONFLICT);
  }

  // Code validation (if provided)
  const codeValue = body.code?.trim() ? body.code.trim().toUpperCase() : undefined;
  if (codeValue) {
    const existingCode = await SubCategory.findOne({
      code: codeValue,
      isDeleted: false,
    });
    if (existingCode) {
      throw new AppError("SubCategory code already in use", HTTP_STATUS.CONFLICT);
    }
  }

  const rawSlug = body.slug ? body.slug.trim() : trimmedName;
  const uniqueSlug = await generateUniqueSlug(rawSlug, async (slugCandidate) => {
    const found = await SubCategory.findOne({ slug: slugCandidate, isDeleted: false });
    return Boolean(found);
  });

  const media = await resolveMediaReference(body.imageId, body.image);
  const bannerMedia = await resolveMediaReference(body.bannerImageId, body.bannerImage);

  const subCategoryPayload: Record<string, unknown> = {
    name: trimmedName,
    slug: uniqueSlug,
    shortDescription: body.shortDescription?.trim() || "",
    description: body.description?.trim() || "",
    category: new mongoose.Types.ObjectId(body.category),
    image: media?.url || null,
    imageId: media?.id ? new mongoose.Types.ObjectId(media.id) : null,
    bannerImage: bannerMedia?.url || null,
    bannerImageId: bannerMedia?.id ? new mongoose.Types.ObjectId(bannerMedia.id) : null,
    sortOrder: Number(body.sortOrder) || 0,
    isFeatured: Boolean(body.isFeatured),
    showOnHome: Boolean(body.showOnHome),
    showInMenu: body.showInMenu !== undefined ? Boolean(body.showInMenu) : true,
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
  };

  if (codeValue) {
    subCategoryPayload.code = codeValue;
  }

  const subCategory = await SubCategory.create(subCategoryPayload);

  return SubCategory.findById(subCategory._id).populate(defaultPopulate).lean();
};

const getAllSubCategories = async (
  query: ISubCategoryQuery = {},
  isPublic: boolean = false
) => {
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
  } else {
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
  }

  // Dependent Filter: Filter subcategories belonging to a parent Category (by ID or Slug)
  if (query.category && query.category.trim()) {
    const catQuery = query.category.trim();
    if (mongoose.Types.ObjectId.isValid(catQuery)) {
      filter.category = new mongoose.Types.ObjectId(catQuery);
    } else {
      const parent = await Category.findOne({ slug: catQuery.toLowerCase(), isDeleted: false });
      if (parent) {
        filter.category = parent._id;
      } else {
        return { subCategories: [], total: 0, page: 1, limit: 20, totalPages: 0 };
      }
    }
  }

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

  const { page, limit, skip } = buildPagination(Number(query.page ?? 1), Number(query.limit ?? 50));

  const [subCategories, total] = await Promise.all([
    SubCategory.find(filter)
      .populate(defaultPopulate)
      .sort({ sortOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SubCategory.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { subCategories, total, page, limit, totalPages };
};

const getSubCategoryBySlugOrId = async (slugOrId: string) => {
  const filter: Record<string, unknown> = { isDeleted: false };
  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    filter.$or = [{ _id: slugOrId }, { slug: slugOrId.toLowerCase() }];
  } else {
    filter.slug = slugOrId.toLowerCase();
  }

  const subCategory = await SubCategory.findOne(filter).populate(defaultPopulate).lean();
  if (!subCategory) {
    throw new AppError("SubCategory not found", HTTP_STATUS.NOT_FOUND);
  }
  return subCategory;
};

const updateSubCategory = async (
  id: string,
  body: IUpdateSubCategoryRequest,
  user?: IAuthenticatedUser
) => {
  validateSubCategoryId(id);

  const existing = await SubCategory.findOne({ _id: id, isDeleted: false });
  if (!existing) {
    throw new AppError("SubCategory not found", HTTP_STATUS.NOT_FOUND);
  }

  const updatePayload: Record<string, unknown> = {
    updatedBy: user?._id || null,
  };

  if (body.category) {
    if (!mongoose.Types.ObjectId.isValid(body.category)) {
      throw new AppError(MESSAGES.INVALID_CATEGORY_ID, HTTP_STATUS.BAD_REQUEST);
    }
    const parent = await Category.findOne({ _id: body.category, isDeleted: false });
    if (!parent) {
      throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    updatePayload.category = new mongoose.Types.ObjectId(body.category);
  }

  if (body.name && body.name.trim() !== existing.name) {
    const trimmedName = body.name.trim();
    const catToCheck = body.category || existing.category;
    const duplicate = await SubCategory.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      category: catToCheck,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (duplicate) {
      throw new AppError("SubCategory with this name already exists in this category", HTTP_STATUS.CONFLICT);
    }

    updatePayload.name = trimmedName;

    if (!body.slug) {
      updatePayload.slug = await generateUniqueSlug(trimmedName, async (candidate) => {
        const found = await SubCategory.findOne({ slug: candidate, _id: { $ne: id }, isDeleted: false });
        return Boolean(found);
      });
    }
  }

  let shouldUnsetCode = false;
  if (body.code !== undefined) {
    const trimmedCode = body.code?.trim() ? body.code.trim().toUpperCase() : undefined;
    if (trimmedCode) {
      const duplicateCode = await SubCategory.findOne({
        code: trimmedCode,
        _id: { $ne: id },
        isDeleted: false,
      });
      if (duplicateCode) {
        throw new AppError("SubCategory code already in use", HTTP_STATUS.CONFLICT);
      }
      updatePayload.code = trimmedCode;
    } else {
      shouldUnsetCode = true;
    }
  }

  if (body.slug) {
    const trimmedSlug = createSlug(body.slug);
    const duplicateSlug = await SubCategory.findOne({
      slug: trimmedSlug,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (duplicateSlug) {
      throw new AppError("SubCategory slug already in use", HTTP_STATUS.CONFLICT);
    }
    updatePayload.slug = trimmedSlug;
  }

  if (body.shortDescription !== undefined) updatePayload.shortDescription = body.shortDescription.trim();
  if (body.description !== undefined) updatePayload.description = body.description.trim();
  if (body.sortOrder !== undefined) updatePayload.sortOrder = Number(body.sortOrder);
  if (body.isFeatured !== undefined) updatePayload.isFeatured = Boolean(body.isFeatured);
  if (body.showOnHome !== undefined) updatePayload.showOnHome = Boolean(body.showOnHome);
  if (body.showInMenu !== undefined) updatePayload.showInMenu = Boolean(body.showInMenu);
  if (body.isActive !== undefined) updatePayload.isActive = Boolean(body.isActive);

  if (body.seo) {
    updatePayload.seo = {
      metaTitle: body.seo.metaTitle?.trim() || "",
      metaDescription: body.seo.metaDescription?.trim() || "",
      keywords: body.seo.keywords || [],
      canonicalUrl: body.seo.canonicalUrl?.trim() || "",
    };
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

  const updateQuery: Record<string, unknown> = { $set: updatePayload };
  if (shouldUnsetCode) {
    updateQuery.$unset = { code: 1 };
  }

  const updated = await SubCategory.findByIdAndUpdate(id, updateQuery, { new: true })
    .populate(defaultPopulate)
    .lean();

  return updated;
};

const deleteSubCategory = async (id: string, user?: IAuthenticatedUser) => {
  validateSubCategoryId(id);

  const deleted = await SubCategory.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id || null,
    },
    { new: true }
  ).lean();

  if (!deleted) {
    throw new AppError("SubCategory not found", HTTP_STATUS.NOT_FOUND);
  }

  return {
    _id: deleted._id,
    name: deleted.name,
    isDeleted: deleted.isDeleted,
    deletedAt: deleted.deletedAt,
  };
};

export {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryBySlugOrId,
  updateSubCategory,
  deleteSubCategory,
};
