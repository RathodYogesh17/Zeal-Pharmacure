import Joi from "joi";

const seoValidationSchema = Joi.object({
  metaTitle: Joi.string().trim().max(200).allow(null, "").optional(),
  metaDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  keywords: Joi.array().items(Joi.string().trim()).default([]).optional(),
  canonicalUrl: Joi.string().trim().max(500).allow(null, "").optional(),
}).optional();

const createIndicationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required().messages({
    "string.empty": "Indication / Problem name is required",
    "string.min": "Indication name must be at least 2 characters",
  }),
  code: Joi.string().trim().uppercase().max(50).allow(null, "").optional(),
  slug: Joi.string()
    .trim()
    .min(2)
    .max(160)
    .pattern(/^[a-z0-9-]+$/)
    .optional(),
  shortDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  description: Joi.string().trim().max(2000).allow(null, "").optional(),
  category: Joi.string().hex().length(24).required().messages({
    "string.empty": "Category ID is required for indication",
    "any.required": "Category ID is required for indication",
    "string.hex": "Category ID must be a valid ObjectId",
  }),
  subCategory: Joi.string().hex().length(24).allow(null, "").optional(),
  sortOrder: Joi.number().integer().min(0).default(0).optional(),
  isFeatured: Joi.boolean().default(false).optional(),
  showOnHome: Joi.boolean().default(false).optional(),
  seo: seoValidationSchema,
  isActive: Joi.boolean().default(true).optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateIndicationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).optional(),
  code: Joi.string().trim().uppercase().max(50).allow(null, "").optional(),
  slug: Joi.string()
    .trim()
    .min(2)
    .max(160)
    .pattern(/^[a-z0-9-]+$/)
    .optional(),
  shortDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  description: Joi.string().trim().max(2000).allow(null, "").optional(),
  category: Joi.string().hex().length(24).allow(null, "").optional(),
  subCategory: Joi.string().hex().length(24).allow(null, "").optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
  isFeatured: Joi.boolean().optional(),
  showOnHome: Joi.boolean().optional(),
  seo: seoValidationSchema,
  isActive: Joi.boolean().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const indicationQuerySchema = Joi.object({
  page: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  limit: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  search: Joi.string().trim().max(100).optional(),
  category: Joi.string().trim().max(100).optional(),
  subCategory: Joi.string().trim().max(100).optional(),
  isActive: Joi.string().valid("true", "false").optional(),
  isFeatured: Joi.string().valid("true", "false").optional(),
  showOnHome: Joi.string().valid("true", "false").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export {
  createIndicationSchema,
  updateIndicationSchema,
  indicationQuerySchema,
};
