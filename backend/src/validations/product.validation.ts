import Joi from "joi";

const mediaItemValidation = Joi.alternatives().try(
  Joi.object({
    url: Joi.string().trim().required(),
    imageId: Joi.string().hex().length(24).allow(null, "").optional(),
    title: Joi.string().trim().max(100).allow(null, "").optional(),
    altText: Joi.string().trim().max(200).allow(null, "").optional(),
  }),
  Joi.string().trim()
);

const seoValidationSchema = Joi.object({
  metaTitle: Joi.string().trim().max(200).allow(null, "").optional(),
  metaDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  keywords: Joi.array().items(Joi.string().trim()).default([]).optional(),
  canonicalUrl: Joi.string().trim().max(500).allow(null, "").optional(),
  ogTitle: Joi.string().trim().max(200).allow(null, "").optional(),
  ogDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  ogImage: Joi.string().trim().allow(null, "").optional(),
}).optional();

const packSizeValidationSchema = Joi.object({
  value: Joi.number().min(0).allow(null).optional(),
  unit: Joi.string().trim().allow("").optional(),
}).optional();

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters",
    "string.max": "Product name cannot exceed 200 characters",
  }),
  slug: Joi.string()
    .trim()
    .min(2)
    .max(220)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      "string.pattern.base": "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  productCode: Joi.string().trim().uppercase().max(50).allow(null, "").optional(),
  brandName: Joi.string().trim().max(200).allow(null, "").optional(),
  genericName: Joi.string().trim().max(200).allow(null, "").optional(),
  manufacturer: Joi.string().trim().max(200).allow(null, "").optional(),
  composition: Joi.string().trim().min(2).max(1000).required().messages({
    "string.empty": "Composition / formulation is required",
  }),
  strength: Joi.string().trim().max(100).allow(null, "").optional(),
  dosageForm: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Dosage form is required (e.g., Tablet, Capsule, Syrup)",
  }),
  packaging: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Packaging is required (e.g., 10x10 Alu-Alu, 100ml)",
  }),
  packSize: packSizeValidationSchema,
  category: Joi.string().hex().length(24).required().messages({
    "string.empty": "Category ID is required",
    "string.hex": "Category ID must be a valid ObjectId",
    "string.length": "Category ID must be 24 characters",
  }),
  subCategory: Joi.string().trim().max(100).allow(null, "").optional(),
  subCategoryName: Joi.string().trim().max(100).allow(null, "").optional(),
  indications: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().trim().max(150)),
      Joi.string().trim().max(2500)
    )
    .allow(null, "")
    .optional(),
  indicationTags: Joi.array().items(Joi.string().trim()).default([]).optional(),
  therapeuticClass: Joi.string().trim().max(200).allow(null, "").optional(),
  tags: Joi.array().items(Joi.string().trim()).default([]).optional(),
  searchKeywords: Joi.array().items(Joi.string().trim()).default([]).optional(),
  shortDescription: Joi.string().trim().max(1000).allow(null, "").optional(),
  description: Joi.string().trim().max(10000).allow(null, "").optional(),
  sideEffects: Joi.string().trim().max(2500).allow(null, "").optional(),
  howToUse: Joi.string().trim().max(2500).allow(null, "").optional(),
  precautions: Joi.string().trim().max(2500).allow(null, "").optional(),
  contraindications: Joi.string().trim().max(2500).allow(null, "").optional(),
  warnings: Joi.string().trim().max(2500).allow(null, "").optional(),
  storage: Joi.string().trim().max(1000).allow(null, "").optional(),
  pregnancyInfo: Joi.string().trim().max(2500).allow(null, "").optional(),
  lactationInfo: Joi.string().trim().max(2500).allow(null, "").optional(),
  prescriptionType: Joi.string()
    .valid("Rx", "OTC", "Schedule H", "Schedule H1", "General", "OTC / General")
    .default("Rx")
    .optional(),
  regulatoryInfo: Joi.string().trim().max(2500).allow(null, "").optional(),
  licenseNumber: Joi.string().trim().max(100).allow(null, "").optional(),
  countryOfOrigin: Joi.string().trim().max(100).default("India").optional(),
  mrp: Joi.number().min(0).allow(null, "").optional(),
  availabilityStatus: Joi.string()
    .valid("AVAILABLE", "OUT_OF_STOCK", "COMING_SOON", "DISCONTINUED")
    .default("AVAILABLE")
    .optional(),
  featuredImage: Joi.string().allow(null, "").optional(),
  featuredImageId: Joi.string().hex().length(24).allow(null, "").optional(),
  mediaGallery: Joi.array().items(mediaItemValidation).default([]).optional(),
  brochureUrl: Joi.string().trim().allow(null, "").optional(),
  brochureName: Joi.string().trim().max(200).allow(null, "").optional(),
  isFeatured: Joi.boolean().default(false).optional(),
  featuredOrder: Joi.number().integer().min(0).default(0).optional(),
  isNewLaunch: Joi.boolean().default(false).optional(),
  launchDate: Joi.date().allow(null).optional(),
  allowEnquiry: Joi.boolean().default(true).optional(),
  seo: seoValidationSchema,
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").default("DRAFT").optional(),
  isActive: Joi.boolean().default(true).optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).optional(),
  slug: Joi.string()
    .trim()
    .min(2)
    .max(220)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      "string.pattern.base": "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  productCode: Joi.string().trim().uppercase().max(50).allow(null, "").optional(),
  brandName: Joi.string().trim().max(200).allow(null, "").optional(),
  genericName: Joi.string().trim().max(200).allow(null, "").optional(),
  manufacturer: Joi.string().trim().max(200).allow(null, "").optional(),
  composition: Joi.string().trim().min(2).max(1000).optional(),
  strength: Joi.string().trim().max(100).allow(null, "").optional(),
  dosageForm: Joi.string().trim().min(1).max(100).optional(),
  packaging: Joi.string().trim().min(2).max(100).optional(),
  packSize: packSizeValidationSchema,
  category: Joi.string().hex().length(24).optional(),
  subCategory: Joi.string().trim().max(100).allow(null, "").optional(),
  subCategoryName: Joi.string().trim().max(100).allow(null, "").optional(),
  indications: Joi.alternatives()
    .try(
      Joi.array().items(Joi.string().trim().max(150)),
      Joi.string().trim().max(2500)
    )
    .allow(null, "")
    .optional(),
  indicationTags: Joi.array().items(Joi.string().trim()).optional(),
  therapeuticClass: Joi.string().trim().max(200).allow(null, "").optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  searchKeywords: Joi.array().items(Joi.string().trim()).optional(),
  shortDescription: Joi.string().trim().max(1000).allow(null, "").optional(),
  description: Joi.string().trim().max(10000).allow(null, "").optional(),
  sideEffects: Joi.string().trim().max(2500).allow(null, "").optional(),
  howToUse: Joi.string().trim().max(2500).allow(null, "").optional(),
  precautions: Joi.string().trim().max(2500).allow(null, "").optional(),
  contraindications: Joi.string().trim().max(2500).allow(null, "").optional(),
  warnings: Joi.string().trim().max(2500).allow(null, "").optional(),
  storage: Joi.string().trim().max(1000).allow(null, "").optional(),
  pregnancyInfo: Joi.string().trim().max(2500).allow(null, "").optional(),
  lactationInfo: Joi.string().trim().max(2500).allow(null, "").optional(),
  prescriptionType: Joi.string()
    .valid("Rx", "OTC", "Schedule H", "Schedule H1", "General", "OTC / General")
    .optional(),
  regulatoryInfo: Joi.string().trim().max(2500).allow(null, "").optional(),
  licenseNumber: Joi.string().trim().max(100).allow(null, "").optional(),
  countryOfOrigin: Joi.string().trim().max(100).optional(),
  mrp: Joi.number().min(0).allow(null, "").optional(),
  availabilityStatus: Joi.string()
    .valid("AVAILABLE", "OUT_OF_STOCK", "COMING_SOON", "DISCONTINUED")
    .optional(),
  featuredImage: Joi.string().allow(null, "").optional(),
  featuredImageId: Joi.string().hex().length(24).allow(null, "").optional(),
  mediaGallery: Joi.array().items(mediaItemValidation).optional(),
  brochureUrl: Joi.string().trim().allow(null, "").optional(),
  brochureName: Joi.string().trim().max(200).allow(null, "").optional(),
  isFeatured: Joi.boolean().optional(),
  featuredOrder: Joi.number().integer().min(0).optional(),
  isNewLaunch: Joi.boolean().optional(),
  launchDate: Joi.date().allow(null).optional(),
  allowEnquiry: Joi.boolean().optional(),
  seo: seoValidationSchema,
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").optional(),
  isActive: Joi.boolean().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const toggleProductStatusSchema = Joi.object({
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  isNewLaunch: Joi.boolean().optional(),
})
  .min(1)
  .options({
    abortEarly: false,
    stripUnknown: true,
  });

const productQuerySchema = Joi.object({
  page: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  limit: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  search: Joi.string().trim().max(100).optional(),
  category: Joi.string().trim().max(100).optional(),
  subCategory: Joi.string().trim().max(100).optional(),
  division: Joi.string().trim().max(100).optional(),
  dosageForm: Joi.string().trim().max(100).optional(),
  indication: Joi.string().trim().max(150).optional(),
  therapeuticClass: Joi.string().trim().max(200).optional(),
  prescriptionType: Joi.string()
    .valid("Rx", "OTC", "Schedule H", "Schedule H1", "General")
    .optional(),
  availabilityStatus: Joi.string()
    .valid("AVAILABLE", "OUT_OF_STOCK", "COMING_SOON", "DISCONTINUED")
    .optional(),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").optional(),
  isFeatured: Joi.string().valid("true", "false").optional(),
  isNewLaunch: Joi.string().valid("true", "false").optional(),
  isActive: Joi.string().valid("true", "false").optional(),
  sortBy: Joi.string().valid("name", "createdAt", "isFeatured", "averageRating", "featuredOrder").optional(),
  sort: Joi.string().valid("name", "createdAt", "isFeatured", "averageRating", "featuredOrder").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  letter: Joi.string().trim().max(10).optional(),
  startDate: Joi.string().trim().optional(),
  endDate: Joi.string().trim().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export {
  createProductSchema,
  updateProductSchema,
  toggleProductStatusSchema,
  productQuerySchema,
};
