import mongoose from "mongoose";
import Indication from "../models/indication.model";
import { createSlug, generateUniqueSlug } from "../utils/slug";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import { buildPagination } from "../utils/pagination";
import type {
  ICreateIndicationRequest,
  IUpdateIndicationRequest,
  IIndicationQuery,
} from "../types/indication.types";
import type { IAuthenticatedUser } from "../types/user.types";

const defaultPopulate = [
  { path: "category", select: "name slug" },
  { path: "subCategory", select: "name slug" },
  { path: "createdBy", select: "name email role" },
  { path: "updatedBy", select: "name email role" },
];

const validateIndicationId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid Indication ID", HTTP_STATUS.BAD_REQUEST);
  }
};

const createIndication = async (
  body: ICreateIndicationRequest,
  user?: IAuthenticatedUser
) => {
  const trimmedName = body.name.trim();

  const existing = await Indication.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    isDeleted: false,
  });
  if (existing) {
    throw new AppError("An indication with this name already exists", HTTP_STATUS.CONFLICT);
  }

  // Code validation (if provided)
  const codeValue = body.code ? body.code.trim().toUpperCase() : null;
  if (codeValue) {
    const existingCode = await Indication.findOne({
      code: codeValue,
      isDeleted: false,
    });
    if (existingCode) {
      throw new AppError("Indication code already in use", HTTP_STATUS.CONFLICT);
    }
  }

  const rawSlug = body.slug ? body.slug.trim() : trimmedName;
  const uniqueSlug = await generateUniqueSlug(rawSlug, async (slugCandidate) => {
    const found = await Indication.findOne({ slug: slugCandidate, isDeleted: false });
    return Boolean(found);
  });

  if (!body.category || !mongoose.Types.ObjectId.isValid(body.category)) {
    throw new AppError("Valid Category ID is required", HTTP_STATUS.BAD_REQUEST);
  }

  const categoryId = new mongoose.Types.ObjectId(body.category);
  const subCategoryId =
    body.subCategory && mongoose.Types.ObjectId.isValid(body.subCategory)
      ? new mongoose.Types.ObjectId(body.subCategory)
      : null;

  const indication = await Indication.create({
    name: trimmedName,
    code: codeValue,
    slug: uniqueSlug,
    shortDescription: body.shortDescription?.trim() || "",
    description: body.description?.trim() || "",
    category: categoryId,
    subCategory: subCategoryId,
    sortOrder: Number(body.sortOrder) || 0,
    isFeatured: Boolean(body.isFeatured),
    showOnHome: Boolean(body.showOnHome),
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

  return Indication.findById(indication._id).populate(defaultPopulate).lean();
};

const getAllIndications = async (
  query: IIndicationQuery = {},
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
  }

  // Cascading Filter: Filter indications by category or subcategory
  if (query.category && mongoose.Types.ObjectId.isValid(query.category)) {
    filter.category = new mongoose.Types.ObjectId(query.category);
  }

  if (query.subCategory && mongoose.Types.ObjectId.isValid(query.subCategory)) {
    filter.subCategory = new mongoose.Types.ObjectId(query.subCategory);
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

  const { page, limit, skip } = buildPagination(Number(query.page ?? 1), Number(query.limit ?? 100));

  const [indications, total] = await Promise.all([
    Indication.find(filter)
      .populate(defaultPopulate)
      .sort({ sortOrder: 1, name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Indication.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { indications, total, page, limit, totalPages };
};

const getIndicationBySlugOrId = async (slugOrId: string) => {
  const filter: Record<string, unknown> = { isDeleted: false };
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

  const indication = await Indication.findOne(filter).populate(defaultPopulate).lean();
  if (!indication) {
    throw new AppError("Indication not found", HTTP_STATUS.NOT_FOUND);
  }
  return indication;
};

const updateIndication = async (
  id: string,
  body: IUpdateIndicationRequest,
  user?: IAuthenticatedUser
) => {
  validateIndicationId(id);

  const existing = await Indication.findOne({ _id: id, isDeleted: false });
  if (!existing) {
    throw new AppError("Indication not found", HTTP_STATUS.NOT_FOUND);
  }

  const updatePayload: Record<string, unknown> = {
    updatedBy: user?._id || null,
  };

  if (body.name && body.name.trim() !== existing.name) {
    const trimmedName = body.name.trim();
    const duplicate = await Indication.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      _id: { $ne: id },
      isDeleted: false,
    });
    if (duplicate) {
      throw new AppError("Indication with this name already exists", HTTP_STATUS.CONFLICT);
    }
    updatePayload.name = trimmedName;

    if (!body.slug) {
      updatePayload.slug = await generateUniqueSlug(trimmedName, async (candidate) => {
        const found = await Indication.findOne({ slug: candidate, _id: { $ne: id }, isDeleted: false });
        return Boolean(found);
      });
    }
  }

  if (body.code !== undefined) {
    const trimmedCode = body.code ? body.code.trim().toUpperCase() : null;
    if (trimmedCode) {
      const duplicateCode = await Indication.findOne({
        code: trimmedCode,
        _id: { $ne: id },
        isDeleted: false,
      });
      if (duplicateCode) {
        throw new AppError("Indication code already in use", HTTP_STATUS.CONFLICT);
      }
    }
    updatePayload.code = trimmedCode;
  }

  if (body.slug) {
    const trimmedSlug = createSlug(body.slug);
    const duplicateSlug = await Indication.findOne({
      slug: trimmedSlug,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (duplicateSlug) {
      throw new AppError("Indication slug already in use", HTTP_STATUS.CONFLICT);
    }
    updatePayload.slug = trimmedSlug;
  }

  if (body.category !== undefined) {
    if (!body.category || !mongoose.Types.ObjectId.isValid(body.category)) {
      throw new AppError("Valid Category ID is required", HTTP_STATUS.BAD_REQUEST);
    }
    updatePayload.category = new mongoose.Types.ObjectId(body.category);
  }

  if (body.subCategory !== undefined) {
    updatePayload.subCategory =
      body.subCategory && mongoose.Types.ObjectId.isValid(body.subCategory)
        ? new mongoose.Types.ObjectId(body.subCategory)
        : null;
  }

  if (body.shortDescription !== undefined) updatePayload.shortDescription = body.shortDescription.trim();
  if (body.description !== undefined) updatePayload.description = body.description.trim();
  if (body.sortOrder !== undefined) updatePayload.sortOrder = Number(body.sortOrder);
  if (body.isFeatured !== undefined) updatePayload.isFeatured = Boolean(body.isFeatured);
  if (body.showOnHome !== undefined) updatePayload.showOnHome = Boolean(body.showOnHome);

  if (body.seo !== undefined) {
    updatePayload.seo = {
      metaTitle: body.seo.metaTitle?.trim() || "",
      metaDescription: body.seo.metaDescription?.trim() || "",
      keywords: body.seo.keywords || [],
      canonicalUrl: body.seo.canonicalUrl?.trim() || "",
    };
  }

  if (body.isActive !== undefined) updatePayload.isActive = Boolean(body.isActive);

  const updated = await Indication.findByIdAndUpdate(id, updatePayload, { new: true })
    .populate(defaultPopulate)
    .lean();

  return updated;
};

const deleteIndication = async (id: string, user?: IAuthenticatedUser) => {
  validateIndicationId(id);

  const deleted = await Indication.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id || null,
    },
    { new: true }
  ).lean();

  if (!deleted) {
    throw new AppError("Indication not found", HTTP_STATUS.NOT_FOUND);
  }

  return {
    _id: deleted._id,
    name: deleted.name,
    isDeleted: deleted.isDeleted,
    deletedAt: deleted.deletedAt,
  };
};

export {
  createIndication,
  getAllIndications,
  getIndicationBySlugOrId,
  updateIndication,
  deleteIndication,
};
