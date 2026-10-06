import Joi from "joi";

// =====================================================
// JOB OPENINGS SCHEMAS
// =====================================================
const jobSeoValidationSchema = Joi.object({
  metaTitle: Joi.string().trim().max(100).allow(null, "").optional(),
  metaDescription: Joi.string().trim().max(300).allow(null, "").optional(),
  keywords: Joi.array().items(Joi.string().trim()).default([]).optional(),
  canonicalUrl: Joi.string().trim().allow(null, "").optional(),
});

const createJobSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "Job title is required",
    "string.min": "Job title must be at least 3 characters",
  }),
  code: Joi.string().trim().uppercase().max(50).allow(null, "").optional(),
  shortDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  department: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Department is required",
  }),
  location: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Job location / HQ is required",
  }),
  jobType: Joi.string()
    .valid("FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP")
    .default("FULL_TIME")
    .optional(),
  experienceRequired: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Experience required is required (e.g. 1-3 Years, Fresher)",
  }),
  openingsCount: Joi.number().integer().min(1).default(1).optional(),
  salaryRange: Joi.string().trim().max(100).allow(null, "").optional(),
  qualificationRequired: Joi.string().trim().max(200).allow(null, "").optional(),
  responsibilities: Joi.array().items(Joi.string().trim()).default([]).optional(),
  requirements: Joi.array().items(Joi.string().trim()).default([]).optional(),
  skills: Joi.array().items(Joi.string().trim()).default([]).optional(),
  benefits: Joi.array().items(Joi.string().trim()).default([]).optional(),
  applicationEmail: Joi.string().trim().email().lowercase().allow(null, "").optional(),
  applicationDeadline: Joi.date().iso().allow(null).optional(),
  description: Joi.string().trim().min(10).max(5000).required().messages({
    "string.empty": "Job description is required",
    "string.min": "Description must be at least 10 characters",
  }),
  status: Joi.string().valid("OPEN", "CLOSED", "DRAFT").default("DRAFT").optional(),
  publishedAt: Joi.date().iso().allow(null).optional(),
  sortOrder: Joi.number().integer().min(0).default(0).optional(),
  isActive: Joi.boolean().default(true).optional(),
  isFeatured: Joi.boolean().default(false).optional(),
  seo: jobSeoValidationSchema.optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateJobSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).optional(),
  code: Joi.string().trim().uppercase().max(50).allow(null, "").optional(),
  shortDescription: Joi.string().trim().max(500).allow(null, "").optional(),
  department: Joi.string().trim().min(2).max(100).optional(),
  location: Joi.string().trim().min(2).max(100).optional(),
  jobType: Joi.string().valid("FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP").optional(),
  experienceRequired: Joi.string().trim().min(1).max(100).optional(),
  openingsCount: Joi.number().integer().min(1).optional(),
  salaryRange: Joi.string().trim().max(100).allow(null, "").optional(),
  qualificationRequired: Joi.string().trim().max(200).allow(null, "").optional(),
  responsibilities: Joi.array().items(Joi.string().trim()).optional(),
  requirements: Joi.array().items(Joi.string().trim()).optional(),
  skills: Joi.array().items(Joi.string().trim()).optional(),
  benefits: Joi.array().items(Joi.string().trim()).optional(),
  applicationEmail: Joi.string().trim().email().lowercase().allow(null, "").optional(),
  applicationDeadline: Joi.date().iso().allow(null).optional(),
  description: Joi.string().trim().min(10).max(5000).optional(),
  status: Joi.string().valid("OPEN", "CLOSED", "DRAFT").optional(),
  publishedAt: Joi.date().iso().allow(null).optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  seo: jobSeoValidationSchema.optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const jobQuerySchema = Joi.object({
  page: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  limit: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  search: Joi.string().trim().max(100).optional(),
  department: Joi.string().trim().max(100).optional(),
  location: Joi.string().trim().max(100).optional(),
  jobType: Joi.string().valid("FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP").optional(),
  status: Joi.string().valid("OPEN", "CLOSED", "DRAFT").optional(),
  isActive: Joi.string().valid("true", "false").optional(),
  isFeatured: Joi.string().valid("true", "false").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

// =====================================================
// JOB APPLICATIONS SCHEMAS
// =====================================================
const interviewRoundValidationSchema = Joi.object({
  roundName: Joi.string().trim().required().messages({
    "string.empty": "Round name is required (e.g. Technical Round, HR Round)",
  }),
  interviewDate: Joi.date().iso().allow(null).optional(),
  mode: Joi.string().valid("ONLINE", "OFFLINE", "PHONE").default("ONLINE").optional(),
  meetingLink: Joi.string().trim().allow("").optional(),
  interviewer: Joi.string().hex().length(24).allow(null, "").optional(),
  status: Joi.string().valid("SCHEDULED", "COMPLETED", "CANCELLED", "RESCHEDULED").default("SCHEDULED").optional(),
  feedback: Joi.string().trim().allow("").optional(),
  rating: Joi.number().min(1).max(5).allow(null).optional(),
  notes: Joi.string().trim().allow("").optional(),
});

const createApplicationSchema = Joi.object({
  applicationCode: Joi.string().trim().max(50).allow(null, "").optional(),
  jobOpeningId: Joi.string().hex().length(24).allow(null, "").optional(),
  jobId: Joi.string().allow(null, "").optional(),
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  phone: Joi.string().trim().min(8).max(20).required().messages({
    "string.empty": "Mobile / WhatsApp number is required",
  }),
  whatsappNumber: Joi.string().trim().max(20).allow(null, "").optional(),
  currentCity: Joi.string().trim().min(2).max(100).default("Ahmedabad").optional(),
  currentState: Joi.string().trim().min(2).max(100).default("Gujarat").optional(),
  preferredLocation: Joi.string().trim().max(150).allow(null, "").optional(),
  dateOfBirth: Joi.date().iso().allow(null).optional(),
  positionAppliedFor: Joi.string().trim().min(2).max(150).allow(null, "").optional(),
  jobTitle: Joi.string().trim().allow(null, "").optional(),
  department: Joi.string().trim().min(2).max(100).default("Distribution & Operations").optional(),
  skills: Joi.array().items(Joi.string().trim()).default([]).optional(),
  qualification: Joi.string().trim().min(2).max(100).default("Graduate / Pharma").optional(),
  totalExperienceYears: Joi.alternatives().try(Joi.number().min(0), Joi.string()).default(0).optional(),
  totalExperience: Joi.string().trim().allow(null, "").optional(),
  currentCompany: Joi.string().trim().max(150).allow(null, "").optional(),
  currentDesignation: Joi.string().trim().max(100).allow(null, "").optional(),
  currentCtc: Joi.string().trim().max(50).allow(null, "").optional(),
  expectedCtc: Joi.string().trim().max(50).allow(null, "").optional(),
  noticePeriod: Joi.string().trim().max(50).allow(null, "").optional(),
  resumeMediaId: Joi.string().hex().length(24).allow(null, "").optional(),
  resumeUrl: Joi.string().trim().allow(null, "").optional(),
  resumeOriginalName: Joi.string().trim().allow(null, "").optional(),
  resumeMimeType: Joi.string().trim().allow(null, "").optional(),
  resumeSize: Joi.number().min(0).optional(),
  coverNote: Joi.string().trim().max(2000).allow(null, "").optional(),
  source: Joi.string().trim().max(100).default("WEBSITE_CAREERS").optional(),
  consentGiven: Joi.boolean().default(true).optional(),
  interviewRounds: Joi.array().items(interviewRoundValidationSchema).default([]).optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const updateApplicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "NEW",
      "SHORTLISTED",
      "INTERVIEW_SCHEDULED",
      "OFFERED",
      "HIRED",
      "REJECTED",
      "ON_HOLD",
      "WITHDRAWN"
    )
    .required()
    .messages({
      "any.required": "Application status is required",
      "any.only": "Invalid status value",
    }),
  interviewDate: Joi.date().iso().allow(null).optional(),
  note: Joi.string().trim().max(1000).allow(null, "").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const addApplicationNoteSchema = Joi.object({
  note: Joi.string().trim().min(2).max(1000).required().messages({
    "string.empty": "Note content is required",
    "string.min": "Note must be at least 2 characters",
  }),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const assignApplicationSchema = Joi.object({
  assignedTo: Joi.string().hex().length(24).required().messages({
    "string.empty": "Assigned user ID is required",
    "string.length": "Assigned user ID must be a valid 24-character hexadecimal ObjectId",
  }),
  note: Joi.string().trim().max(1000).allow(null, "").optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

const applicationQuerySchema = Joi.object({
  page: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  limit: Joi.string().pattern(/^[1-9][0-9]*$/).optional(),
  search: Joi.string().trim().max(100).optional(),
  status: Joi.string()
    .valid(
      "NEW",
      "SHORTLISTED",
      "INTERVIEW_SCHEDULED",
      "OFFERED",
      "HIRED",
      "REJECTED",
      "ON_HOLD",
      "WITHDRAWN"
    )
    .optional(),
  department: Joi.string().trim().max(100).optional(),
  positionAppliedFor: Joi.string().trim().max(150).optional(),
  jobOpeningId: Joi.string().hex().length(24).optional(),
  assignedTo: Joi.string().hex().length(24).optional(),
  skills: Joi.string().trim().max(100).optional(),
  city: Joi.string().trim().max(100).optional(),
  state: Joi.string().trim().max(100).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
}).options({
  abortEarly: false,
  stripUnknown: true,
});

export {
  createJobSchema,
  updateJobSchema,
  jobQuerySchema,
  createApplicationSchema,
  updateApplicationStatusSchema,
  addApplicationNoteSchema,
  assignApplicationSchema,
  interviewRoundValidationSchema,
  applicationQuerySchema,
};
