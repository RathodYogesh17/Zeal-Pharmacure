import Joi from "joi";

const seoValidationSchema = Joi.object({
  metaTitle: Joi.string().trim().max(200).allow(null, "").optional(),
  metaDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  keywords: Joi.array().items(Joi.string().trim()).default([]).optional(),
  canonicalUrl: Joi.string().trim().max(500).allow(null, "").optional(),
}).optional();

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name cannot exceed 100 characters",
  }),
  code: Joi.string().trim().uppercase().max(50).allow(null, "").optional(),
  slug: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      "string.pattern.base": "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  shortDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  description: Joi.string().trim().max(5000).allow(null, "").optional(),
  image: Joi.string().allow(null, "").optional(),
  imageId: Joi.string().hex().length(24).allow(null, "").optional(),
  bannerImage: Joi.string().allow(null, "").optional(),
  bannerImageId: Joi.string().hex().length(24).allow(null, "").optional(),
  icon: Joi.string().trim().max(100).allow(null, "").optional(),
  sortOrder: Joi.number().integer().min(0).default(0).optional(),
  isFeatured: Joi.boolean().optional(),
  showOnHome: Joi.boolean().optional(),
  showInMenu: Joi.boolean().optional(),
  seo: seoValidationSchema,
  isActive: Joi.boolean().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name cannot exceed 100 characters",
  }),
  code: Joi.string().trim().uppercase().max(50).allow(null, "").optional(),
  slug: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      "string.pattern.base": "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  shortDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  description: Joi.string().trim().max(5000).allow(null, "").optional(),
  image: Joi.string().allow(null, "").optional(),
  imageId: Joi.string().hex().length(24).allow(null, "").optional(),
  bannerImage: Joi.string().allow(null, "").optional(),
  bannerImageId: Joi.string().hex().length(24).allow(null, "").optional(),
  icon: Joi.string().trim().max(100).allow(null, "").optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
  isFeatured: Joi.boolean().optional(),
  showOnHome: Joi.boolean().optional(),
  showInMenu: Joi.boolean().optional(),
  seo: seoValidationSchema,
  isActive: Joi.boolean().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const categoryQuerySchema = Joi.object({
  page: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  limit: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  search: Joi.string().trim().max(100).optional(),
  isActive: Joi.string().valid("true", "false").optional(),
  isFeatured: Joi.string().valid("true", "false").optional(),
  showOnHome: Joi.string().valid("true", "false").optional(),
  showInMenu: Joi.string().valid("true", "false").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export { createCategorySchema, updateCategorySchema, categoryQuerySchema };
