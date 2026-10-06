import Joi from "joi";

const seoValidationSchema = Joi.object({
  metaTitle: Joi.string().trim().max(200).allow(null, "").optional(),
  metaDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  keywords: Joi.array().items(Joi.string().trim()).default([]).optional(),
  canonicalUrl: Joi.string().trim().max(500).allow(null, "").optional(),
  ogTitle: Joi.string().trim().max(200).allow(null, "").optional(),
  ogDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  ogImage: Joi.string().allow(null, "").optional(),
}).optional();

const createContentSchema = Joi.object({
  key: Joi.string().trim().lowercase().min(2).max(100).required().messages({
    "string.empty": "Content key is required",
    "any.required": "Content key is required",
  }),
  slug: Joi.string().trim().lowercase().max(150).allow(null, "").optional(),
  title: Joi.string().trim().min(2).max(200).required().messages({
    "string.empty": "Content title is required",
    "any.required": "Content title is required",
  }),
  description: Joi.string().trim().max(1000).allow(null, "").optional(),
  contentType: Joi.string()
    .valid("PAGE", "SECTION", "BANNER", "FAQ", "POLICY", "SETTING")
    .default("SECTION")
    .optional(),
  section: Joi.string().trim().max(100).allow(null, "").optional(),
  content: Joi.alternatives()
    .try(Joi.object(), Joi.array(), Joi.string())
    .required()
    .messages({
      "any.required": "Content body is required",
    }),
  mediaIds: Joi.array().items(Joi.string().hex().length(24)).default([]).optional(),
  seo: seoValidationSchema,
  metadata: seoValidationSchema,
  sortOrder: Joi.number().integer().min(0).default(0).optional(),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").default("DRAFT").optional(),
  publishedAt: Joi.date().iso().allow(null).optional(),
  scheduledAt: Joi.date().iso().allow(null).optional(),
  isActive: Joi.boolean().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateContentSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).optional(),
  slug: Joi.string().trim().lowercase().max(150).allow(null, "").optional(),
  description: Joi.string().trim().max(1000).allow(null, "").optional(),
  contentType: Joi.string()
    .valid("PAGE", "SECTION", "BANNER", "FAQ", "POLICY", "SETTING")
    .optional(),
  section: Joi.string().trim().max(100).allow(null, "").optional(),
  content: Joi.alternatives()
    .try(Joi.object(), Joi.array(), Joi.string())
    .optional(),
  mediaIds: Joi.array().items(Joi.string().hex().length(24)).optional(),
  seo: seoValidationSchema,
  metadata: seoValidationSchema,
  sortOrder: Joi.number().integer().min(0).optional(),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").optional(),
  publishedAt: Joi.date().iso().allow(null).optional(),
  scheduledAt: Joi.date().iso().allow(null).optional(),
  isActive: Joi.boolean().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const contentQuerySchema = Joi.object({
  page: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  limit: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  search: Joi.string().trim().max(100).optional(),
  contentType: Joi.string()
    .valid("PAGE", "SECTION", "BANNER", "FAQ", "POLICY", "SETTING")
    .optional(),
  section: Joi.string().trim().max(100).optional(),
  status: Joi.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").optional(),
  isActive: Joi.string().valid("true", "false").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export { createContentSchema, updateContentSchema, contentQuerySchema };
