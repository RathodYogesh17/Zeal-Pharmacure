import { Router } from "express";
import {
  createJob,
  getPublicJobs,
  getAdminJobs,
  getJob,
  updateJob,
  deleteJob,
  applyForJob,
  getAllApplications,
  getApplication,
  updateApplicationStatus,
  addApplicationNote,
  assignApplication,
  scheduleInterviewRound,
  logCandidateContact,
  deleteApplication,
} from "../controllers/career.controller";
import {
  createJobSchema,
  updateJobSchema,
  jobQuerySchema,
  createApplicationSchema,
  updateApplicationStatusSchema,
  addApplicationNoteSchema,
  assignApplicationSchema,
  interviewRoundValidationSchema,
  applicationQuerySchema,
} from "../validations/career.validation";
import {
  uploadResume,
  attachResumeMetadata,
} from "../middleware/resumeUpload.middleware";
import { validate, validateQuery } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermissions } from "../middleware/role.middleware";
import PERMISSIONS from "../constants/permissions";
import asyncHandler from "../utils/asyncHandler";

const careerRouter = Router();

// =====================================================
// PUBLIC ROUTES (Job Seekers, MRs, ASMs, Freshers)
// =====================================================

// 1. Browse active job openings / vacancies
careerRouter.get("/jobs", asyncHandler(getPublicJobs));

// 2. View single job details by slug or ID
careerRouter.get("/jobs/:slugOrId", asyncHandler(getJob));

// 3. Submit job application (with PDF/DOCX resume upload)
careerRouter.post(
  "/apply",
  uploadResume,
  attachResumeMetadata,
  validate(createApplicationSchema),
  asyncHandler(applyForJob)
);

// =====================================================
// PROTECTED ROUTES (HR Managers, Admins, Leadership)
// =====================================================

// Job Openings Management
careerRouter.get(
  ["/jobs", "/admin/jobs"],
  authMiddleware,
  requirePermissions(PERMISSIONS.JOB_VIEW),
  validateQuery(jobQuerySchema),
  asyncHandler(getAdminJobs)
);

careerRouter.post(
  ["/jobs", "/admin/jobs"],
  authMiddleware,
  requirePermissions(PERMISSIONS.JOB_CREATE),
  validate(createJobSchema),
  asyncHandler(createJob)
);

careerRouter.put(
  ["/jobs/:id", "/admin/jobs/:id"],
  authMiddleware,
  requirePermissions(PERMISSIONS.JOB_UPDATE),
  validate(updateJobSchema),
  asyncHandler(updateJob)
);

careerRouter.delete(
  ["/jobs/:id", "/admin/jobs/:id"],
  authMiddleware,
  requirePermissions(PERMISSIONS.JOB_DELETE),
  asyncHandler(deleteJob)
);

// Candidate Applications Management
careerRouter.get(
  ["/applications", "/admin/applications"],
  authMiddleware,
  requirePermissions(PERMISSIONS.APPLICATION_VIEW),
  validateQuery(applicationQuerySchema),
  asyncHandler(getAllApplications)
);

careerRouter.get(
  ["/applications/:id", "/admin/applications/:id"],
  authMiddleware,
  requirePermissions(PERMISSIONS.APPLICATION_VIEW),
  asyncHandler(getApplication)
);

careerRouter.patch(
  ["/applications/:id/status", "/admin/applications/:id/status"],
  authMiddleware,
  requirePermissions(PERMISSIONS.APPLICATION_UPDATE),
  validate(updateApplicationStatusSchema),
  asyncHandler(updateApplicationStatus)
);

careerRouter.post(
  ["/applications/:id/notes", "/admin/applications/:id/notes"],
  authMiddleware,
  requirePermissions(PERMISSIONS.APPLICATION_UPDATE),
  validate(addApplicationNoteSchema),
  asyncHandler(addApplicationNote)
);

careerRouter.patch(
  ["/applications/:id/assign", "/admin/applications/:id/assign"],
  authMiddleware,
  requirePermissions(PERMISSIONS.APPLICATION_UPDATE),
  validate(assignApplicationSchema),
  asyncHandler(assignApplication)
);

careerRouter.post(
  ["/applications/:id/interview-rounds", "/admin/applications/:id/interview-rounds"],
  authMiddleware,
  requirePermissions(PERMISSIONS.APPLICATION_UPDATE),
  validate(interviewRoundValidationSchema),
  asyncHandler(scheduleInterviewRound)
);

careerRouter.post(
  ["/applications/:id/contact", "/admin/applications/:id/contact"],
  authMiddleware,
  requirePermissions(PERMISSIONS.APPLICATION_UPDATE),
  asyncHandler(logCandidateContact)
);

careerRouter.delete(
  ["/applications/:id", "/admin/applications/:id"],
  authMiddleware,
  requirePermissions(PERMISSIONS.APPLICATION_UPDATE),
  asyncHandler(deleteApplication)
);

export { careerRouter };