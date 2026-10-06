import Joi from "joi";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createRoleSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Role name is required",
    }),
  code: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(50)
    .pattern(/^[A-Z0-9_]+$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Role code must contain only uppercase letters, numbers, and underscores (e.g. PHARMA_OPERATOR)",
    }),
  description: Joi.string().trim().max(200).allow(null, "").optional(),
  sortOrder: Joi.number().integer().min(0).default(0).optional(),
  isActive: Joi.boolean().default(true).optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateRoleSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  code: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(50)
    .pattern(/^[A-Z0-9_]+$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Role code must contain only uppercase letters, numbers, and underscores (e.g. PHARMA_OPERATOR)",
    }),
  description: Joi.string().trim().max(200).allow(null, "").optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const assignRolePermissionsSchema = Joi.object({
  permissionIds: Joi.array()
    .items(
      Joi.string().pattern(objectIdRegex).required().messages({
        "string.pattern.base":
          "Each permissionId must be a valid 24-character hexadecimal ObjectId",
      })
    )
    .unique()
    .required(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const assignUserPermissionsSchema = Joi.object({
  overrides: Joi.array()
    .items(
      Joi.object({
        permissionId: Joi.string().pattern(objectIdRegex).required().messages({
          "string.pattern.base":
            "Each permissionId must be a valid 24-character hexadecimal ObjectId",
        }),
        effect: Joi.string().valid("ALLOW", "DENY").optional(),
        type: Joi.string().valid("ALLOW", "DENY").optional(),
        isActive: Joi.boolean().default(true).optional(),
      })
    )
    .required(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export {
  createRoleSchema,
  updateRoleSchema,
  assignRolePermissionsSchema,
  assignUserPermissionsSchema,
};
