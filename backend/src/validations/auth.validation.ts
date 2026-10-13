import Joi from "joi";
import { USER_ROLES } from "../constants/enums";

const normalizePhone = (value: string, helpers: Joi.CustomHelpers) => {
  const digits = String(value).replace(/[\s\-\(\)\+]/g, "");
  const normalized = digits.length > 10 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (/^[0-9]{10}$/.test(normalized)) {
    return normalized;
  }
  return helpers.error("string.pattern.base");
};

const registerUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  phone: Joi.string()
    .trim()
    .custom(normalizePhone)
    .required()
    .messages({
      "string.pattern.base": "Phone must be a valid 10-digit number (e.g. 9876543210)",
    }),
  password: Joi.string().min(6).max(50).required(),
  role: Joi.string()
    .valid(...Object.values(USER_ROLES).filter((role) => role !== USER_ROLES.EMPLOYEE))
    .optional(),
  profileImage: Joi.string().allow(null, "").optional(),
  profileImageId: Joi.string().hex().length(24).allow(null, "").optional(),
})
  .options({ abortEarly: false, stripUnknown: true });


const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false, stripUnknown: true, });


const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(30).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "confirmPassword must match newPassword",
    "any.required": "confirmPassword is required",
  }),
})
  .options({ abortEarly: false, stripUnknown: true, });


const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
})
  .options({ abortEarly: false, stripUnknown: true, });


const verifyOtpSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  otp: Joi.alternatives().try(
    Joi.string().length(6).pattern(/^[0-9]{6}$/),
    Joi.number().integer().min(100000).max(999999)
  ).required(),
  purpose: Joi.string().trim().optional(),
})
  .options({ abortEarly: false, stripUnknown: true, });


const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  otp: Joi.alternatives().try(
    Joi.string().length(6).pattern(/^[0-9]{6}$/),
    Joi.number().integer().min(100000).max(999999)
  ).required(),
  newPassword: Joi.string().min(8).max(30).required(),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "confirmPassword must match newPassword",
    "any.required": "confirmPassword is required",
  }),
})
  .options({ abortEarly: false, stripUnknown: true, });
  

export { registerUserSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema };