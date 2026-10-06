import Joi from "joi";
import { USER_ROLES } from "../constants/enums";

const staffRoles = [
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.ADMIN,
  USER_ROLES.SALES_MANAGER,
  USER_ROLES.HR_MANAGER,
  USER_ROLES.CONTENT_MANAGER,
  USER_ROLES.EMPLOYEE,
];

const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(8).max(30).required(),
  role: Joi.alternatives().try(
    Joi.string().valid(...Object.values(USER_ROLES)),
    Joi.string().hex().length(24)
  ).optional(),
  profileImage: Joi.string().allow(null, "").optional(),
  profileImageId: Joi.string().hex().length(24).allow(null, "").optional(),
  designation: Joi.string().trim().max(100).allow(null, "").optional(),
  department: Joi.string().trim().max(100).allow(null, "").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const adminCreateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(8).max(30).required(),
  role: Joi.alternatives().try(
    Joi.string().valid(...staffRoles),
    Joi.string().hex().length(24)
  ).required(),
  profileImage: Joi.string().allow(null, "").optional(),
  profileImageId: Joi.string().hex().length(24).allow(null, "").optional(),
  designation: Joi.string().trim().max(100).allow(null, "").optional(),
  department: Joi.string().trim().max(100).allow(null, "").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).optional(),
  role: Joi.alternatives().try(
    Joi.string().valid(...Object.values(USER_ROLES)),
    Joi.string().hex().length(24)
  ).optional(),
  profileImage: Joi.string().allow(null, "").optional(),
  profileImageId: Joi.string().hex().length(24).allow(null, "").optional(),
  designation: Joi.string().trim().max(100).allow(null, "").optional(),
  department: Joi.string().trim().max(100).allow(null, "").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const userQuerySchema = Joi.object({
  page: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  limit: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  search: Joi.string().trim().max(100).optional(),
  role: Joi.string().optional(),
  department: Joi.string().trim().max(100).optional(),
  isActive: Joi.string().valid("true", "false").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export { createUserSchema, adminCreateUserSchema, updateUserSchema, userQuerySchema };