import mongoose from "mongoose";
import Product from "../models/product.model";
import Category from "../models/category.model";
import SubCategory from "../models/subCategory.model";
import Indication from "../models/indication.model";
import { createSlug, generateUniqueSlug } from "../utils/slug";
import { resolveMediaReference } from "./media.service";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { buildPagination } from "../utils/pagination";
import type {
  ICreateProductRequest,
  IUpdateProductRequest,
  IToggleProductStatusRequest,
  IProductQuery,
  IFiltersResponse,
} from "../types/product.types";
import type { IAuthenticatedUser } from "../types/user.types";

const defaultPopulate = [
  { path: "category", select: "name slug description icon isFeatured" },
  { path: "subCategory", select: "name slug description image sortOrder" },
  { path: "indications", select: "name slug description sortOrder" },
  { path: "createdBy", select: "name email role" },
  { path: "updatedBy", select: "name email role" },
];

const publicPopulate = [
  { path: "category", select: "name slug description icon isFeatured" },
  { path: "subCategory", select: "name slug description image sortOrder" },
  { path: "indications", select: "name slug description sortOrder" },
];

const publicProductFields =
  "_id name slug brandName genericName composition strength dosageForm packaging packSize category subCategory subCategoryName indications indicationTags therapeuticClass mrp availabilityStatus featuredImage isFeatured featuredOrder isNewLaunch prescriptionType allowEnquiry averageRating totalReviews status isActive createdAt";

const validateProductId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(MESSAGES.INVALID_PRODUCT_ID, HTTP_STATUS.BAD_REQUEST);
  }
};

const normalizeMediaGallery = (items?: any[]): Array<{ url: string; imageId: mongoose.Types.ObjectId | null; title: string }> => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item) return null;
      if (typeof item === "string") {
        const trimmed = item.trim();
        return trimmed ? { url: trimmed, imageId: null, title: "" } : null;
      }
      if (typeof item === "object" && item.url) {
        return {
          url: String(item.url).trim(),
          imageId: item.imageId && mongoose.Types.ObjectId.isValid(item.imageId)
            ? new mongoose.Types.ObjectId(String(item.imageId))
            : null,
          title: item.title ? String(item.title).trim() : "",
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{ url: string; imageId: mongoose.Types.ObjectId | null; title: string }>;
};

// =====================================================
// CREATE PRODUCT
// =====================================================
const createProduct = async (body: ICreateProductRequest, user?: IAuthenticatedUser) => {
  const trimmedName = body.name.trim();

  // 1. Verify Category
  if (!mongoose.Types.ObjectId.isValid(body.category)) {
    throw new AppError(MESSAGES.INVALID_CATEGORY_ID, HTTP_STATUS.BAD_REQUEST);
  }
  const categoryExists = await Category.findOne({
    _id: body.category,
    isDeleted: false,
  });
  if (!categoryExists) {
    throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // 2. Prevent exact duplicate active product
  const existingProduct = await Product.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    isDeleted: false,
  });
  if (existingProduct) {
    throw new AppError(MESSAGES.PRODUCT_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }

  // 3. Generate SEO Unique Slug
  const rawSlug = body.slug ? body.slug.trim() : trimmedName;
  const uniqueSlug = await generateUniqueSlug(rawSlug, async (slugCandidate) => {
    const found = await Product.findOne({ slug: slugCandidate });
    return Boolean(found);
  });

  // 4. Resolve Featured Media Image
  const media = await resolveMediaReference(body.featuredImageId, body.featuredImage);

  // 5. Resolve SubCategory (Supports ObjectId reference OR string name)
  let resolvedSubCategoryId: mongoose.Types.ObjectId | null = null;
  let subCategoryName = "";
  if (body.subCategory && String(body.subCategory).trim()) {
    const subCatInput = String(body.subCategory).trim();
    if (mongoose.Types.ObjectId.isValid(subCatInput)) {
      const foundSubCat = await SubCategory.findOne({ _id: subCatInput, isDeleted: false });
      if (foundSubCat) {
        resolvedSubCategoryId = new mongoose.Types.ObjectId(String(foundSubCat._id));
        subCategoryName = foundSubCat.name;
      }
    } else {
      subCategoryName = subCatInput;
      let foundSubCat = await SubCategory.findOne({
        name: { $regex: new RegExp(`^${subCatInput}$`, "i") },
        category: body.category,
        isDeleted: false,
      });
      if (!foundSubCat) {
        const slugCandidate = await generateUniqueSlug(subCatInput, async (cand) => {
          const exists = await SubCategory.findOne({ slug: cand, isDeleted: false });
          return Boolean(exists);
        });
        foundSubCat = await SubCategory.create({
          name: subCatInput,
          slug: slugCandidate,
          category: new mongoose.Types.ObjectId(body.category),
          createdBy: user?._id || null,
        });
      }
      resolvedSubCategoryId = new mongoose.Types.ObjectId(String(foundSubCat._id));
    }
  }

  // 6. Resolve Indications / Extra Categories (Supports ObjectIds OR text tags)
  const resolvedIndicationIds: mongoose.Types.ObjectId[] = [];
  const indicationTags: string[] = [];

  let rawIndications: string[] = [];
  if (Array.isArray(body.indications)) {
    rawIndications = body.indications.map((i) => String(i).trim()).filter(Boolean);
  } else if (typeof body.indications === "string" && body.indications.trim()) {
    rawIndications = body.indications.split(/[,;\n]+/).map((i) => i.trim()).filter(Boolean);
  }

  for (const item of rawIndications) {
    if (mongoose.Types.ObjectId.isValid(item)) {
      const found = await Indication.findOne({ _id: item, isDeleted: false });
      if (found) {
        resolvedIndicationIds.push(new mongoose.Types.ObjectId(String(found._id)));
        indicationTags.push(found.name);
      }
    } else {
      indicationTags.push(item);
      let found = await Indication.findOne({
        name: { $regex: new RegExp(`^${item}$`, "i") },
        isDeleted: false,
      });
      if (!found) {
        const indSlug = await generateUniqueSlug(item, async (cand) => {
          const exists = await Indication.findOne({ slug: cand, isDeleted: false });
          return Boolean(exists);
        });
        found = await Indication.create({
          name: item,
          slug: indSlug,
          category: new mongoose.Types.ObjectId(body.category),
          subCategory: resolvedSubCategoryId,
          createdBy: user?._id || null,
        });
      }
      resolvedIndicationIds.push(new mongoose.Types.ObjectId(String(found._id)));
    }
  }

  // 6.5 Check Product Code uniqueness if provided
  const productCodeValue = body.productCode?.trim() ? body.productCode.trim().toUpperCase() : undefined;
  if (productCodeValue) {
    const existingCode = await Product.findOne({ productCode: productCodeValue, isDeleted: false });
    if (existingCode) {
      throw new AppError("Product code already in use", HTTP_STATUS.CONFLICT);
    }
  }

  // 7. Create Product
  const productPayload: Record<string, any> = {
    name: trimmedName,
    slug: uniqueSlug,
    brandName: body.brandName?.trim() || "",
    genericName: body.genericName?.trim() || "",
    manufacturer: body.manufacturer?.trim() || "",
    composition: body.composition.trim(),
    strength: body.strength?.trim() || "",
    dosageForm: body.dosageForm.trim(),
    packaging: body.packaging.trim(),
    packSize: body.packSize || { value: null, unit: "" },
    category: new mongoose.Types.ObjectId(body.category),
    subCategory: resolvedSubCategoryId,
    subCategoryName,
    indications: resolvedIndicationIds,
    indicationTags,
    therapeuticClass: body.therapeuticClass?.trim() || "",
    tags: body.tags || [],
    searchKeywords: body.searchKeywords || [],
    shortDescription: body.shortDescription?.trim() || "",
    description: body.description?.trim() || "",
    sideEffects: body.sideEffects?.trim() || "",
    howToUse: body.howToUse?.trim() || "",
    precautions: body.precautions?.trim() || "",
    contraindications: body.contraindications?.trim() || "",
    warnings: body.warnings?.trim() || "",
    storage: body.storage?.trim() || "",
    pregnancyInfo: body.pregnancyInfo?.trim() || "",
    lactationInfo: body.lactationInfo?.trim() || "",
    prescriptionType: body.prescriptionType || "Rx",
    regulatoryInfo: body.regulatoryInfo?.trim() || "",
    licenseNumber: body.licenseNumber?.trim() || "",
    countryOfOrigin: body.countryOfOrigin?.trim() || "India",
    mrp: body.mrp !== undefined && body.mrp !== null && String(body.mrp).trim() !== "" ? Number(body.mrp) : null,
    availabilityStatus: body.availabilityStatus || "AVAILABLE",
    featuredImage: media?.url || null,
    featuredImageId: media?.id ? new mongoose.Types.ObjectId(media.id) : null,
    mediaGallery: normalizeMediaGallery(body.mediaGallery),
    brochureUrl: body.brochureUrl?.trim() || null,
    brochureName: body.brochureName?.trim() || "",
    averageRating: body.averageRating !== undefined ? Number(body.averageRating) : 5.0,
    totalReviews: body.totalReviews !== undefined ? Number(body.totalReviews) : 0,
    isFeatured: Boolean(body.isFeatured),
    featuredOrder: Number(body.featuredOrder) || 0,
    isNewLaunch: Boolean(body.isNewLaunch),
    launchDate: body.launchDate ? new Date(body.launchDate) : null,
    allowEnquiry: body.allowEnquiry !== undefined ? Boolean(body.allowEnquiry) : true,
    seo: {
      metaTitle: body.seo?.metaTitle?.trim() || "",
      metaDescription: body.seo?.metaDescription?.trim() || "",
      keywords: body.seo?.keywords || [],
      canonicalUrl: body.seo?.canonicalUrl?.trim() || "",
      ogTitle: body.seo?.ogTitle?.trim() || "",
      ogDescription: body.seo?.ogDescription?.trim() || "",
      ogImage: body.seo?.ogImage?.trim() || null,
    },
    status: body.status || "DRAFT",
    publishedAt: body.status === "PUBLISHED" ? new Date() : null,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    isDeleted: false,
    deletedAt: null,
    createdBy: user?._id || null,
    updatedBy: null,
    deletedBy: null,
  };

  if (productCodeValue) {
    productPayload.productCode = productCodeValue;
  }

  const product = await Product.create(productPayload);

  return Product.findById(product._id).populate(defaultPopulate).lean();
};

// =====================================================
// GET ALL PRODUCTS (PUBLIC & ADMIN)
// =====================================================
const getAllProducts = async (query: IProductQuery = {}, isPublic: boolean = false) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (isPublic) {
    filter.isActive = true;
  } else if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  // Category filter: handles both ObjectId and slug
  if (query.category && query.category.trim()) {
    const catQuery = query.category.trim();
    if (mongoose.Types.ObjectId.isValid(catQuery)) {
      filter.category = new mongoose.Types.ObjectId(catQuery);
    } else {
      const foundCategory = await Category.findOne({
        $or: [
          { slug: catQuery.toLowerCase() },
          { name: { $regex: new RegExp(`^${catQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        ],
        isDeleted: false,
      });
      if (foundCategory) {
        filter.category = foundCategory._id;
      } else {
        // Return empty result if category slug doesn't exist
        return { products: [], total: 0, page: 1, limit: 20, totalPages: 0 };
      }
    }
  }

  // SubCategory / Division filter (supports ObjectId OR name/slug)
  const divisionQuery = (query.division || query.subCategory)?.trim();
  if (divisionQuery) {
    if (mongoose.Types.ObjectId.isValid(divisionQuery)) {
      filter.subCategory = new mongoose.Types.ObjectId(divisionQuery);
    } else {
      const foundSub = await SubCategory.findOne({
        $or: [{ slug: divisionQuery.toLowerCase() }, { name: { $regex: new RegExp(`^${divisionQuery}$`, "i") } }],
        isDeleted: false,
      });
      if (foundSub) {
        filter.$or = [{ subCategory: foundSub._id }, { subCategoryName: { $regex: new RegExp(`^${divisionQuery}$`, "i") } }];
      } else {
        filter.subCategoryName = { $regex: new RegExp(`^${divisionQuery}$`, "i") };
      }
    }
  }

  // Medical Problem / Indication filter (supports ObjectId OR name tag)
  if (query.indication && query.indication.trim()) {
    const indQuery = query.indication.trim();
    if (mongoose.Types.ObjectId.isValid(indQuery)) {
      filter.indications = new mongoose.Types.ObjectId(indQuery);
    } else {
      filter.indicationTags = { $regex: new RegExp(indQuery, "i") };
    }
  }

  // Dosage Form filter (e.g. Tablet, Tablets, Capsule, Capsules, Syrup, Cream, etc.)
  if (query.dosageForm && query.dosageForm.trim()) {
    const rawDosage = query.dosageForm.trim();
    const baseDosage = rawDosage.replace(/s$/i, "");
    filter.dosageForm = { $regex: new RegExp(`^${baseDosage}s?$`, "i") };
  }

  // Prescription Type filter (Rx, OTC, Schedule H)
  if (query.prescriptionType && query.prescriptionType.trim()) {
    filter.prescriptionType = query.prescriptionType.trim();
  }

  // Therapeutic Class filter
  if (query.therapeuticClass && query.therapeuticClass.trim()) {
    filter.therapeuticClass = { $regex: new RegExp(query.therapeuticClass.trim(), "i") };
  }

  // Availability Status filter
  if (query.availabilityStatus && query.availabilityStatus.trim()) {
    filter.availabilityStatus = query.availabilityStatus.trim();
  }

  // Product Status filter (DRAFT, PUBLISHED, ARCHIVED)
  if (query.status && query.status.trim()) {
    filter.status = query.status.trim();
  }

  // Flags
  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured === "true";
  }
  if (query.isNewLaunch !== undefined) {
    filter.isNewLaunch = query.isNewLaunch === "true";
  }

  // Search filter across name, brandName, productCode, genericName, composition, indications, subCategory
  if (query.search && query.search.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { name: searchRegex },
      { brandName: searchRegex },
      { productCode: searchRegex },
      { genericName: searchRegex },
      { composition: searchRegex },
      { therapeuticClass: searchRegex },
      { indicationTags: searchRegex },
      { subCategoryName: searchRegex },
      { packaging: searchRegex },
      { searchKeywords: searchRegex },
      { tags: searchRegex },
    ];
  }

  // Letter filter (A-Z alphabet index)
  if (query.letter && query.letter.trim() && query.letter.trim().toUpperCase() !== "ALL") {
    filter.name = { $regex: new RegExp(`^${query.letter.trim()}`, "i") };
  }

  // Date Range filter (createdAt)
  if (query.startDate || query.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (query.startDate) {
      dateFilter.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }
    filter.createdAt = dateFilter;
  }

  const { page, limit, skip } = buildPagination(Number(query.page ?? 1), Number(query.limit ?? 20));

  // Sorting
  const sortCriteria: Record<string, 1 | -1> = {};
  if (query.sortBy === "name") {
    sortCriteria.name = query.sortOrder === "desc" ? -1 : 1;
  } else if (query.sortBy === "averageRating") {
    sortCriteria.averageRating = query.sortOrder === "asc" ? 1 : -1;
    sortCriteria.totalReviews = -1;
  } else if (query.sortBy === "isFeatured") {
    sortCriteria.isFeatured = -1;
    sortCriteria.featuredOrder = 1;
    sortCriteria.createdAt = -1;
  } else if (query.sortBy === "featuredOrder") {
    sortCriteria.featuredOrder = 1;
    sortCriteria.createdAt = -1;
  } else {
    sortCriteria.createdAt = query.sortOrder === "asc" ? 1 : -1;
  }

  const populateList = isPublic ? publicPopulate : defaultPopulate;

  let queryBuilder = Product.find(filter);
  if (isPublic) {
    queryBuilder = queryBuilder.select(publicProductFields);
  }

  const [products, total] = await Promise.all([
    queryBuilder
      .populate(populateList)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { products, total, page, limit, totalPages };
};

// =====================================================
// GET SINGLE PRODUCT (BY ID OR SLUG)
// =====================================================
const getProductBySlugOrId = async (slugOrId: string, isPublic: boolean = false) => {
  const filter: Record<string, unknown> = { isDeleted: false };
  if (isPublic) {
    filter.isActive = true;
  }

  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    filter.$or = [{ _id: slugOrId }, { slug: slugOrId.toLowerCase() }];
  } else {
    filter.slug = slugOrId.toLowerCase();
  }

  const product = await Product.findOne(filter).populate(defaultPopulate).lean();
  if (!product) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return product;
};

// =====================================================
// GET RELATED PRODUCTS
// =====================================================
const getRelatedProducts = async (slugOrId: string, limitCount: number = 4) => {
  const currentFilter: Record<string, unknown> = { isDeleted: false, isActive: true };
  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    currentFilter.$or = [{ _id: slugOrId }, { slug: slugOrId.toLowerCase() }];
  } else {
    currentFilter.slug = slugOrId.toLowerCase();
  }

  const currentProduct = await Product.findOne(currentFilter)
    .select('_id category subCategory dosageForm')
    .lean();

  if (!currentProduct) {
    return [];
  }

  const filter: Record<string, unknown> = {
    _id: { $ne: currentProduct._id },
    isActive: true,
    isDeleted: false,
    $or: [
      { category: currentProduct.category },
      ...(currentProduct.subCategory ? [{ subCategory: currentProduct.subCategory }] : []),
      ...(currentProduct.dosageForm ? [{ dosageForm: currentProduct.dosageForm }] : []),
    ],
  };

  const related = await Product.find(filter)
    .select(publicProductFields)
    .populate(publicPopulate)
    .limit(limitCount)
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  return related;
};

// =====================================================
// UPDATE PRODUCT
// =====================================================
const updateProduct = async (
  id: string,
  body: IUpdateProductRequest,
  user?: IAuthenticatedUser
) => {
  validateProductId(id);

  const existingProduct = await Product.findOne({ _id: id, isDeleted: false });
  if (!existingProduct) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const updatePayload: Record<string, unknown> = {
    updatedBy: user?._id || null,
  };

  // Category verification if changing category
  if (body.category) {
    if (!mongoose.Types.ObjectId.isValid(body.category)) {
      throw new AppError(MESSAGES.INVALID_CATEGORY_ID, HTTP_STATUS.BAD_REQUEST);
    }
    const categoryExists = await Category.findOne({
      _id: body.category,
      isDeleted: false,
    });
    if (!categoryExists) {
      throw new AppError(MESSAGES.CATEGORY_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    updatePayload.category = new mongoose.Types.ObjectId(body.category);
  }

  // Name & Slug updates
  if (body.name && body.name.trim() !== existingProduct.name) {
    const trimmedName = body.name.trim();
    const duplicate = await Product.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      _id: { $ne: id },
      isDeleted: false,
    });
    if (duplicate) {
      throw new AppError(MESSAGES.PRODUCT_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
    }

    updatePayload.name = trimmedName;

    // Regenerate slug if not explicitly passed
    if (!body.slug) {
      updatePayload.slug = await generateUniqueSlug(trimmedName, async (candidate) => {
        const found = await Product.findOne({
          slug: candidate,
          _id: { $ne: id },
        });
        return Boolean(found);
      });
    }
  }

  if (body.slug) {
    const trimmedSlug = createSlug(body.slug);
    const duplicateSlug = await Product.findOne({
      slug: trimmedSlug,
      _id: { $ne: id },
      isDeleted: false,
    });
    if (duplicateSlug) {
      throw new AppError("Product slug is already in use", HTTP_STATUS.CONFLICT);
    }
    updatePayload.slug = trimmedSlug;
  }

  // Simple string fields
  if (body.genericName !== undefined) updatePayload.genericName = body.genericName?.trim() || "";
  if (body.composition !== undefined) updatePayload.composition = body.composition.trim();
  if (body.dosageForm !== undefined) updatePayload.dosageForm = body.dosageForm.trim();
  if (body.subCategory !== undefined) {
    if (!body.subCategory) {
      updatePayload.subCategory = null;
      updatePayload.subCategoryName = "";
    } else {
      const subCatInput = String(body.subCategory).trim();
      if (mongoose.Types.ObjectId.isValid(subCatInput)) {
        const found = await SubCategory.findOne({ _id: subCatInput, isDeleted: false });
        if (found) {
          updatePayload.subCategory = new mongoose.Types.ObjectId(String(found._id));
          updatePayload.subCategoryName = found.name;
        }
      } else {
        updatePayload.subCategoryName = subCatInput;
        const parentCategory = body.category || existingProduct.category;
        let found = await SubCategory.findOne({
          name: { $regex: new RegExp(`^${subCatInput}$`, "i") },
          category: parentCategory,
          isDeleted: false,
        });
        if (!found) {
          const candSlug = await generateUniqueSlug(subCatInput, async (cand) => {
            const exists = await SubCategory.findOne({ slug: cand, isDeleted: false });
            return Boolean(exists);
          });
          found = await SubCategory.create({
            name: subCatInput,
            slug: candSlug,
            category: parentCategory,
            createdBy: user?._id || null,
          });
        }
        updatePayload.subCategory = new mongoose.Types.ObjectId(String(found._id));
      }
    }
  }

  if (body.indications !== undefined) {
    const resolvedIndicationIds: mongoose.Types.ObjectId[] = [];
    const indicationTags: string[] = [];

    let rawIndications: string[] = [];
    if (Array.isArray(body.indications)) {
      rawIndications = body.indications.map((i) => String(i).trim()).filter(Boolean);
    } else if (typeof body.indications === "string" && body.indications.trim()) {
      rawIndications = body.indications.split(/[,;\n]+/).map((i) => i.trim()).filter(Boolean);
    }

    for (const item of rawIndications) {
      if (mongoose.Types.ObjectId.isValid(item)) {
        const found = await Indication.findOne({ _id: item, isDeleted: false });
        if (found) {
          resolvedIndicationIds.push(new mongoose.Types.ObjectId(String(found._id)));
          indicationTags.push(found.name);
        }
      } else {
        indicationTags.push(item);
        let found = await Indication.findOne({
          name: { $regex: new RegExp(`^${item}$`, "i") },
          isDeleted: false,
        });
        if (!found) {
          const indSlug = await generateUniqueSlug(item, async (cand) => {
            const exists = await Indication.findOne({ slug: cand, isDeleted: false });
            return Boolean(exists);
          });
          found = await Indication.create({
            name: item,
            slug: indSlug,
            category: (body.category ? new mongoose.Types.ObjectId(body.category) : existingProduct.category) as mongoose.Types.ObjectId,
            subCategory: (updatePayload.subCategory || existingProduct.subCategory || null) as mongoose.Types.ObjectId | null,
            createdBy: user?._id ? new mongoose.Types.ObjectId(String(user._id)) : null,
          });
        }
        resolvedIndicationIds.push(new mongoose.Types.ObjectId(String(found._id)));
      }
    }
    updatePayload.indications = resolvedIndicationIds;
    updatePayload.indicationTags = indicationTags;
  }
  const unsetPayload: Record<string, 1> = {};
  if (body.productCode !== undefined) {
    const trimmedCode = body.productCode?.trim() ? body.productCode.trim().toUpperCase() : null;
    if (trimmedCode) {
      const duplicateCode = await Product.findOne({
        productCode: trimmedCode,
        _id: { $ne: id },
        isDeleted: false,
      });
      if (duplicateCode) {
        throw new AppError("Product code already in use", HTTP_STATUS.CONFLICT);
      }
      updatePayload.productCode = trimmedCode;
    } else {
      unsetPayload.productCode = 1;
    }
  }
  if (body.brandName !== undefined) updatePayload.brandName = body.brandName.trim();
  if (body.manufacturer !== undefined) updatePayload.manufacturer = body.manufacturer.trim();
  if (body.strength !== undefined) updatePayload.strength = body.strength.trim();
  if (body.packSize !== undefined) updatePayload.packSize = body.packSize;
  if (body.therapeuticClass !== undefined) updatePayload.therapeuticClass = body.therapeuticClass.trim();
  if (body.tags !== undefined) updatePayload.tags = body.tags;
  if (body.searchKeywords !== undefined) updatePayload.searchKeywords = body.searchKeywords;
  if (body.shortDescription !== undefined) updatePayload.shortDescription = body.shortDescription.trim();
  if (body.description !== undefined) updatePayload.description = body.description.trim();
  if (body.contraindications !== undefined) updatePayload.contraindications = body.contraindications.trim();
  if (body.warnings !== undefined) updatePayload.warnings = body.warnings.trim();
  if (body.storage !== undefined) updatePayload.storage = body.storage.trim();
  if (body.pregnancyInfo !== undefined) updatePayload.pregnancyInfo = body.pregnancyInfo.trim();
  if (body.lactationInfo !== undefined) updatePayload.lactationInfo = body.lactationInfo.trim();
  if (body.regulatoryInfo !== undefined) updatePayload.regulatoryInfo = body.regulatoryInfo.trim();
  if (body.licenseNumber !== undefined) updatePayload.licenseNumber = body.licenseNumber.trim();
  if (body.countryOfOrigin !== undefined) updatePayload.countryOfOrigin = body.countryOfOrigin.trim();
  if (body.mrp !== undefined) updatePayload.mrp = body.mrp !== null && String(body.mrp).trim() !== "" ? Number(body.mrp) : null;
  if (body.availabilityStatus !== undefined) updatePayload.availabilityStatus = body.availabilityStatus;
  if (body.brochureName !== undefined) updatePayload.brochureName = body.brochureName.trim();
  if (body.featuredOrder !== undefined) updatePayload.featuredOrder = Number(body.featuredOrder);
  if (body.launchDate !== undefined) updatePayload.launchDate = body.launchDate ? new Date(body.launchDate) : null;
  if (body.allowEnquiry !== undefined) updatePayload.allowEnquiry = Boolean(body.allowEnquiry);
  if (body.status !== undefined) {
    updatePayload.status = body.status;
    if (body.status === "PUBLISHED" && !existingProduct.publishedAt) {
      updatePayload.publishedAt = new Date();
    }
  }
  if (body.seo !== undefined) {
    updatePayload.seo = {
      metaTitle: body.seo.metaTitle?.trim() || "",
      metaDescription: body.seo.metaDescription?.trim() || "",
      keywords: body.seo.keywords || [],
      canonicalUrl: body.seo.canonicalUrl?.trim() || "",
      ogTitle: body.seo.ogTitle?.trim() || "",
      ogDescription: body.seo.ogDescription?.trim() || "",
      ogImage: body.seo.ogImage?.trim() || null,
    };
  }
  if (body.sideEffects !== undefined) updatePayload.sideEffects = body.sideEffects?.trim() || "";
  if (body.howToUse !== undefined) updatePayload.howToUse = body.howToUse?.trim() || "";
  if (body.precautions !== undefined) updatePayload.precautions = body.precautions?.trim() || "";
  if (body.prescriptionType !== undefined) updatePayload.prescriptionType = body.prescriptionType;
  if (body.brochureUrl !== undefined) updatePayload.brochureUrl = body.brochureUrl?.trim() || null;
  if (body.averageRating !== undefined) updatePayload.averageRating = Number(body.averageRating);
  if (body.totalReviews !== undefined) updatePayload.totalReviews = Number(body.totalReviews);
  if (body.isFeatured !== undefined) updatePayload.isFeatured = Boolean(body.isFeatured);
  if (body.isNewLaunch !== undefined) updatePayload.isNewLaunch = Boolean(body.isNewLaunch);
  if (body.isActive !== undefined) updatePayload.isActive = Boolean(body.isActive);

  // Media
  if (body.featuredImageId !== undefined || body.featuredImage !== undefined) {
    const media = await resolveMediaReference(body.featuredImageId, body.featuredImage);
    updatePayload.featuredImage = media?.url || null;
    updatePayload.featuredImageId = media?.id ? new mongoose.Types.ObjectId(media.id) : null;
  }

  if (body.mediaGallery !== undefined) {
    updatePayload.mediaGallery = normalizeMediaGallery(body.mediaGallery);
  }

  const updateQuery: Record<string, any> = { $set: updatePayload };
  if (Object.keys(unsetPayload).length > 0) {
    updateQuery.$unset = unsetPayload;
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updateQuery, {
    new: true,
    runValidators: true,
  })
    .populate(defaultPopulate)
    .lean();

  return updatedProduct;
};

// =====================================================
// TOGGLE STATUS
// =====================================================
const toggleProductStatus = async (
  id: string,
  body: IToggleProductStatusRequest,
  user?: IAuthenticatedUser
) => {
  validateProductId(id);

  const updatePayload: Record<string, unknown> = {
    updatedBy: user?._id || null,
  };

  if (body.isActive !== undefined) updatePayload.isActive = Boolean(body.isActive);
  if (body.isFeatured !== undefined) updatePayload.isFeatured = Boolean(body.isFeatured);
  if (body.isNewLaunch !== undefined) updatePayload.isNewLaunch = Boolean(body.isNewLaunch);

  const updated = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updatePayload,
    { new: true }
  )
    .populate(defaultPopulate)
    .lean();

  if (!updated) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return updated;
};

// =====================================================
// DELETE PRODUCT (SOFT DELETE)
// =====================================================
const deleteProduct = async (id: string, user?: IAuthenticatedUser) => {
  validateProductId(id);

  const deleted = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id || null,
    },
    { new: true }
  ).lean();

  if (!deleted) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return {
    _id: deleted._id,
    name: deleted.name,
    isDeleted: deleted.isDeleted,
    deletedAt: deleted.deletedAt,
  };
};

// =====================================================
// GET PRODUCT FILTERS / TAXONOMY
// =====================================================
const getProductFilters = async (division?: string): Promise<IFiltersResponse> => {
  const matchStage: Record<string, unknown> = { isActive: true, isDeleted: false };
  if (division && division.trim()) {
    matchStage.subCategory = { $regex: new RegExp(`^${division.trim()}$`, "i") };
  }

  const [divisionsAgg, dosageFormsAgg, indicationsAgg, totalProducts] = await Promise.all([
    Product.aggregate([
      { $match: { isActive: true, isDeleted: false } },
      { $group: { _id: "$subCategory", count: { $sum: 1 } } },
      { $match: { _id: { $ne: "" } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
    Product.aggregate([
      { $match: matchStage },
      { $group: { _id: "$dosageForm", count: { $sum: 1 } } },
      { $match: { _id: { $ne: "" } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
    Product.aggregate([
      { $match: matchStage },
      { $unwind: "$indications" },
      { $group: { _id: "$indications", count: { $sum: 1 } } },
      { $match: { _id: { $ne: "" } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
    Product.countDocuments(matchStage),
  ]);

  return {
    divisions: divisionsAgg.map((d) => ({ name: d._id, count: d.count })),
    dosageForms: dosageFormsAgg.map((df) => ({ name: df._id, count: df.count })),
    indications: indicationsAgg.map((ind) => ({ name: ind._id, count: ind.count })),
    totalProducts,
  };
};

// =====================================================
// DUPLICATE PRODUCT
// =====================================================
const duplicateProduct = async (id: string, user?: IAuthenticatedUser) => {
  validateProductId(id);

  const existingProduct = await Product.findOne({ _id: id, isDeleted: false }).lean();
  if (!existingProduct) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const baseName = `${existingProduct.name} (Copy)`;
  const rawSlugCandidate = `${existingProduct.slug || createSlug(existingProduct.name)}-copy`;

  const uniqueSlug = await generateUniqueSlug(rawSlugCandidate, async (candidate) => {
    const found = await Product.findOne({ slug: candidate });
    return Boolean(found);
  });

  let newProductCode: string | null = null;
  if (existingProduct.productCode) {
    const candidateCode = `${existingProduct.productCode}-COPY`;
    const codeExists = await Product.findOne({ productCode: candidateCode, isDeleted: false });
    if (!codeExists) {
      newProductCode = candidateCode;
    }
  }

  const cloneData: Record<string, unknown> = {
    name: baseName,
    slug: uniqueSlug,
    productCode: newProductCode,
    brandName: existingProduct.brandName || "",
    genericName: existingProduct.genericName,
    manufacturer: existingProduct.manufacturer || "",
    composition: existingProduct.composition,
    strength: existingProduct.strength || "",
    dosageForm: existingProduct.dosageForm,
    packaging: existingProduct.packaging,
    packSize: existingProduct.packSize || { value: null, unit: "" },
    category: existingProduct.category,
    subCategory: existingProduct.subCategory || null,
    subCategoryName: existingProduct.subCategoryName || "",
    indications: existingProduct.indications || [],
    indicationTags: existingProduct.indicationTags || [],
    therapeuticClass: existingProduct.therapeuticClass || "",
    tags: existingProduct.tags || [],
    searchKeywords: existingProduct.searchKeywords || [],
    shortDescription: existingProduct.shortDescription || "",
    description: existingProduct.description || "",
    sideEffects: existingProduct.sideEffects || "",
    howToUse: existingProduct.howToUse || "",
    precautions: existingProduct.precautions || "",
    contraindications: existingProduct.contraindications || "",
    warnings: existingProduct.warnings || "",
    storage: existingProduct.storage || "",
    pregnancyInfo: existingProduct.pregnancyInfo || "",
    lactationInfo: existingProduct.lactationInfo || "",
    prescriptionType: existingProduct.prescriptionType || "Rx",
    regulatoryInfo: existingProduct.regulatoryInfo || "",
    licenseNumber: existingProduct.licenseNumber || "",
    countryOfOrigin: existingProduct.countryOfOrigin || "India",
    mrp: existingProduct.mrp ?? null,
    availabilityStatus: existingProduct.availabilityStatus || "AVAILABLE",
    featuredImage: existingProduct.featuredImage || null,
    featuredImageId: existingProduct.featuredImageId || null,
    mediaGallery: existingProduct.mediaGallery || [],
    brochureUrl: existingProduct.brochureUrl || null,
    brochureName: existingProduct.brochureName || "",
    averageRating: 0,
    totalReviews: 0,
    isFeatured: false,
    featuredOrder: 0,
    isNewLaunch: false,
    launchDate: null,
    allowEnquiry: existingProduct.allowEnquiry !== false,
    viewCount: 0,
    enquiryCount: 0,
    seo: existingProduct.seo ? { ...existingProduct.seo, canonicalUrl: "" } : undefined,
    status: "DRAFT",
    publishedAt: null,
    isActive: true,
    isDeleted: false,
    createdBy: user?._id || null,
    updatedBy: null,
  };

  const duplicatedProduct = await Product.create(cloneData);
  const populated = await Product.findById(duplicatedProduct._id).populate(defaultPopulate).lean();
  return populated;
};

export {
  createProduct,
  getAllProducts,
  getProductBySlugOrId,
  getRelatedProducts,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  getProductFilters,
  duplicateProduct,
};

