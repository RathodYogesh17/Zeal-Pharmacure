import Joi from "joi";
import { validateDrugLicenseNumber } from "../utils/dlValidator";

const productItemValidationSchema = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "string.empty": "Product ID is required for bulk items",
    "string.hex": "Product ID must be a valid ObjectId",
  }),
  quantity: Joi.number().min(0).allow(null).optional(),
  quantityUnit: Joi.string().trim().max(50).allow(null, "").optional(),
  message: Joi.string().trim().max(1000).allow(null, "").optional(),
});

const createProductEnquirySchema = Joi.object({
  enquiryType: Joi.string()
    .valid("SINGLE_PRODUCT", "BULK_PRODUCT")
    .default("SINGLE_PRODUCT")
    .optional(),
  productId: Joi.string().hex().length(24).allow(null, "").optional(),
  product: Joi.string().hex().length(24).allow(null, "").optional(),
  productSlug: Joi.string().trim().allow(null, "").optional(),
  products: Joi.array().items(productItemValidationSchema).default([]).optional(),
  name: Joi.string().trim().min(2).max(100).optional(),
  fullName: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string().trim().min(8).max(20).required().messages({
    "string.empty": "Phone / WhatsApp number is required",
  }),
  whatsappNumber: Joi.string().trim().max(20).allow(null, "").optional(),
  companyName: Joi.string().trim().max(150).allow(null, "").optional(),
  city: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "City is required",
  }),
  state: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "State is required",
  }),
  pincode: Joi.string().trim().max(10).allow(null, "").optional(),
  drugLicenseNumber: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .custom((value, helpers) => {
      if (!value || !value.trim()) return value;
      const res = validateDrugLicenseNumber(value);
      if (!res.isValid) {
        return helpers.message({ custom: res.error || "Invalid Drug License format" });
      }
      return res.normalized;
    })
    .optional(),
  gstNumber: Joi.string().trim().max(20).allow(null, "").optional(),
  quantity: Joi.alternatives().try(Joi.number().min(0), Joi.string().trim()).allow(null).optional(),
  quantityUnit: Joi.string().trim().max(50).allow(null, "").optional(),
  message: Joi.string().trim().max(2000).allow(null, "").optional(),
  source: Joi.string()
    .valid("WEBSITE", "PRODUCT_PAGE", "BULK_ENQUIRY", "ADMIN", "OTHER")
    .default("WEBSITE")
    .optional(),
  isConfirmed: Joi.boolean().default(true).optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const createFranchiseEnquirySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  fullName: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string().trim().min(8).max(20).required().messages({
    "string.empty": "Phone / WhatsApp number is required",
  }),
  whatsappNumber: Joi.string().trim().max(20).allow(null, "").optional(),
  companyName: Joi.string().trim().max(150).allow(null, "").optional(),
  businessType: Joi.string()
    .valid("INDIVIDUAL", "PROPRIETORSHIP", "PARTNERSHIP", "PRIVATE_LIMITED", "LLP", "OTHER")
    .default("INDIVIDUAL")
    .optional(),
  drugLicenseNumber: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .custom((value, helpers) => {
      if (!value || !value.trim()) return value;
      const res = validateDrugLicenseNumber(value);
      if (!res.isValid) {
        return helpers.message({ custom: res.error || "Invalid Drug License format" });
      }
      return res.normalized;
    })
    .optional(),
  gstNumber: Joi.string().trim().max(20).allow(null, "").optional(),
  address: Joi.string().trim().max(300).allow(null, "").optional(),
  city: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "City is required",
  }),
  state: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "State is required",
  }),
  district: Joi.string().trim().max(100).allow(null, "").optional(),
  territoryDistrict: Joi.string().trim().max(100).allow(null, "").optional(),
  pincode: Joi.string().trim().max(10).allow(null, "").optional(),
  pharmaExperience: Joi.string().trim().max(100).allow(null, "").optional(),
  currentBusiness: Joi.string().trim().max(200).allow(null, "").optional(),
  investmentBudget: Joi.string().trim().max(100).allow(null, "").optional(),
  interestedDivisions: Joi.array().items(Joi.string().trim()).allow(null).optional(),
  hasGodownFacility: Joi.boolean().default(false).optional(),
  godownDetails: Joi.string().trim().max(500).allow(null, "").optional(),
  hasTransportFacility: Joi.boolean().default(false).optional(),
  transportDetails: Joi.string().trim().max(500).allow(null, "").optional(),
  preferredTerritory: Joi.string().trim().max(200).allow(null, "").optional(),
  interestedProducts: Joi.array().items(Joi.string().hex().length(24)).default([]).optional(),
  message: Joi.string().trim().max(2000).allow(null, "").optional(),
  source: Joi.string()
    .valid("WEBSITE", "FRANCHISE_PAGE", "CONTACT_PAGE", "ADMIN", "OTHER")
    .default("WEBSITE")
    .optional(),
  isConfirmed: Joi.boolean().default(true).optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

// Generic schema accepting either product or franchise enquiry
const createEnquirySchema = Joi.object({
  enquiryType: Joi.string()
    .valid("PRODUCT", "FRANCHISE", "THIRD_PARTY", "GENERAL", "SINGLE_PRODUCT", "BULK_PRODUCT")
    .default("GENERAL")
    .optional(),
  productId: Joi.string().hex().length(24).allow(null, "").optional(),
  product: Joi.string().hex().length(24).allow(null, "").optional(),
  productSlug: Joi.string().trim().allow(null, "").optional(),
  products: Joi.array().items(productItemValidationSchema).default([]).optional(),
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string().trim().min(8).max(20).required().messages({
    "string.empty": "Phone / WhatsApp number is required",
  }),
  whatsappNumber: Joi.string().trim().max(20).allow(null, "").optional(),
  companyName: Joi.string().trim().max(150).allow(null, "").optional(),
  businessType: Joi.string().allow(null, "").optional(),
  city: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "City is required",
  }),
  state: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "State / Territory is required",
  }),
  district: Joi.string().trim().max(100).allow(null, "").optional(),
  territoryDistrict: Joi.string().trim().max(100).allow(null, "").optional(),
  address: Joi.string().trim().max(300).allow(null, "").optional(),
  drugLicenseNumber: Joi.string()
    .trim()
    .max(100)
    .allow(null, "")
    .custom((value, helpers) => {
      if (!value || !value.trim()) return value;
      const res = validateDrugLicenseNumber(value);
      if (!res.isValid) {
        return helpers.message({ custom: res.error || "Invalid Drug License format" });
      }
      return res.normalized;
    })
    .optional(),
  gstNumber: Joi.string().trim().max(20).allow(null, "").optional(),
  pincode: Joi.string().trim().max(10).allow(null, "").optional(),
  investmentBudget: Joi.string().trim().max(100).allow(null, "").optional(),
  pharmaExperience: Joi.string().trim().max(100).allow(null, "").optional(),
  currentBusiness: Joi.string().trim().max(200).allow(null, "").optional(),
  interestedDivisions: Joi.array().items(Joi.string().trim()).allow(null).optional(),
  hasGodownFacility: Joi.boolean().allow(null).optional(),
  godownDetails: Joi.string().trim().max(500).allow(null, "").optional(),
  hasTransportFacility: Joi.boolean().allow(null).optional(),
  transportDetails: Joi.string().trim().max(500).allow(null, "").optional(),
  preferredTerritory: Joi.string().trim().max(200).allow(null, "").optional(),
  interestedProducts: Joi.array().items(Joi.string().hex().length(24)).allow(null).optional(),
  quantity: Joi.alternatives().try(Joi.number().min(0), Joi.string().trim()).allow(null, "").optional(),
  quantityUnit: Joi.string().trim().max(50).allow(null, "").optional(),
  message: Joi.string().trim().max(2000).allow(null, "").optional(),
  source: Joi.string().trim().max(100).allow(null, "").optional(),
  isConfirmed: Joi.boolean().default(true).optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const validateDlSchema = Joi.object({
  drugLicenseNumber: Joi.string().trim().required().messages({
    "string.empty": "Drug License Number is required",
    "any.required": "Drug License Number is required",
  }),
  state: Joi.string().trim().max(100).allow(null, "").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateEnquiryStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "PENDING",
      "IN_TOUCH",
      "QUOTED",
      "CLOSED",
      "REJECTED",
      "NEW",
      "IN_PROGRESS",
      "FOLLOW_UP",
      "CONTACTED",
      "QUALIFIED",
      "DOCUMENTS_PENDING",
      "APPROVED",
      "ON_HOLD"
    )
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Invalid status value",
    }),
  note: Joi.string().trim().max(1000).allow(null, "").optional(),
  nextFollowUpAt: Joi.date().iso().allow(null).optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const assignEnquirySchema = Joi.object({
  assignedTo: Joi.string().hex().length(24).required().messages({
    "string.empty": "Assigned User ID is required",
    "string.hex": "Assigned User ID must be a valid ObjectId",
  }),
  note: Joi.string().trim().max(1000).allow(null, "").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const addEnquiryNoteSchema = Joi.object({
  note: Joi.string().trim().min(2).max(1000).required().messages({
    "string.empty": "Note content is required",
    "string.min": "Note must be at least 2 characters",
  }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const enquiryQuerySchema = Joi.object({
  page: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  limit: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  search: Joi.string().trim().max(100).optional(),
  category: Joi.string().valid("product", "franchise", "all").optional(),
  status: Joi.string().optional(),
  enquiryType: Joi.string().optional(),
  productId: Joi.string().hex().length(24).optional(),
  assignedTo: Joi.string().hex().length(24).optional(),
  city: Joi.string().trim().max(100).optional(),
  state: Joi.string().trim().max(100).optional(),
  district: Joi.string().trim().max(100).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export {
  createProductEnquirySchema,
  createFranchiseEnquirySchema,
  createEnquirySchema,
  validateDlSchema,
  updateEnquiryStatusSchema,
  assignEnquirySchema,
  addEnquiryNoteSchema,
  enquiryQuerySchema,
};
