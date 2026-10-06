import Joi from "joi";

const createReviewSchema = Joi.object({
  reviewerName: Joi.string().trim().min(2).max(100).optional(),
  name: Joi.string().trim().min(2).max(100).optional(),
  reviewerRole: Joi.string().trim().max(100).allow(null, "").optional(),
  reviewerDesignation: Joi.string().trim().max(100).allow(null, "").optional(),
  doctorSpeciality: Joi.string().trim().max(100).allow(null, "").optional(),
  hospitalClinicName: Joi.string().trim().max(150).allow(null, "").optional(),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number between 1 and 5",
    "number.min": "Rating must be at least 1 star",
    "number.max": "Rating cannot exceed 5 stars",
  }),
  title: Joi.string().trim().max(150).allow(null, "").optional(),
  comment: Joi.string().trim().min(5).max(1500).optional(),
  review: Joi.string().trim().min(5).max(1500).optional(),
  city: Joi.string().trim().max(100).allow(null, "").optional(),
  state: Joi.string().trim().max(100).allow(null, "").optional(),
  phone: Joi.string().trim().max(20).allow(null, "").optional(),
  email: Joi.string().trim().email().allow(null, "").optional(),
  source: Joi.string().trim().max(50).default("WEBSITE").optional(),
  productId: Joi.string().hex().length(24).optional(),
})
  .or("reviewerName", "name")
  .or("comment", "review")
  .options({
    abortEarly: false,
    stripUnknown: true,
  });

const approveReviewSchema = Joi.object({
  isApproved: Joi.boolean().required().messages({
    "any.required": "isApproved boolean is required",
  }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const adminReplyReviewSchema = Joi.object({
  adminReply: Joi.string().trim().min(2).max(1500).required().messages({
    "string.empty": "Admin reply is required",
    "string.min": "Admin reply must be at least 2 characters",
  }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const toggleReviewFeatureSchema = Joi.object({
  isFeatured: Joi.boolean().required().messages({
    "any.required": "isFeatured boolean is required",
  }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const toggleReviewVerificationSchema = Joi.object({
  isVerified: Joi.boolean().required().messages({
    "any.required": "isVerified boolean is required",
  }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const reviewQuerySchema = Joi.object({
  page: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  limit: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  productId: Joi.string().hex().length(24).optional(),
  isApproved: Joi.string().valid("true", "false").optional(),
  isFeatured: Joi.string().valid("true", "false").optional(),
  isVerified: Joi.string().valid("true", "false").optional(),
  rating: Joi.string().pattern(/^[1-5]$/).optional(),
  source: Joi.string().trim().max(50).optional(),
  search: Joi.string().trim().max(100).optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export {
  createReviewSchema,
  approveReviewSchema,
  adminReplyReviewSchema,
  toggleReviewFeatureSchema,
  toggleReviewVerificationSchema,
  reviewQuerySchema,
};
