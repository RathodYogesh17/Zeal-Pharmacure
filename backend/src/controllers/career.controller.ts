import type { Request, Response } from "express";
import * as careerService from "../services/career.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";
import { recordAuditLog } from "../utils/auditLogger";
import type {
  ICareerRequest,
  ICreateJobRequest,
  IUpdateJobRequest,
  IJobQuery,
  ICreateApplicationRequest,
  IUpdateApplicationStatusRequest,
  IAddApplicationNoteRequest,
  IAssignApplicationRequest,
  IScheduleInterviewRequest,
  IApplicationQuery,
} from "../types/career.types";
import type { IAuthenticatedUser } from "../types/user.types";

// =====================================================
// JOB OPENINGS CONTROLLERS
// =====================================================

const createJob = async (req: ICareerRequest, res: Response): Promise<void> => {
  const body: ICreateJobRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await careerService.createJobOpening(body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "JOB_CREATE",
    module: "CAREER",
    targetType: "JobOpening",
    targetId: (result as unknown as { _id?: string })?._id ? String((result as unknown as { _id?: string })._id) : null,
    req,
    metadata: { title: body.title, department: body.department },
  });
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.JOB_CREATED, result);
};

const getPublicJobs = async (req: Request, res: Response): Promise<void> => {
  const query: IJobQuery = req.query as IJobQuery;
  const result = await careerService.getAllJobOpenings(query, true);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.JOBS_FETCHED, result);
};

const getAdminJobs = async (req: ICareerRequest, res: Response): Promise<void> => {
  const query: IJobQuery = (req.validatedQuery ?? req.query) as IJobQuery;
  const result = await careerService.getAllJobOpenings(query, false);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.JOBS_FETCHED, result);
};

const getJob = async (req: Request, res: Response): Promise<void> => {
  const result = await careerService.getJobOpeningBySlugOrId(String(req.params.slugOrId));
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.JOB_FETCHED, result);
};

const updateJob = async (req: ICareerRequest, res: Response): Promise<void> => {
  const body: IUpdateJobRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await careerService.updateJobOpening(String(req.params.id), body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "JOB_UPDATE",
    module: "CAREER",
    targetType: "JobOpening",
    targetId: String(req.params.id),
    req,
    metadata: { updatedFields: Object.keys(body) },
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.JOB_UPDATED, result);
};

const deleteJob = async (req: ICareerRequest, res: Response): Promise<void> => {
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await careerService.deleteJobOpening(String(req.params.id), user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "JOB_DELETE",
    module: "CAREER",
    targetType: "JobOpening",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.JOB_DELETED, result);
};

// =====================================================
// CANDIDATE APPLICATIONS CONTROLLERS
// =====================================================

const applyForJob = async (req: Request, res: Response): Promise<void> => {
  const body: ICreateApplicationRequest = req.body;
  const result = await careerService.submitApplication(body);
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.APPLICATION_SUBMITTED, result);
};

const getAllApplications = async (req: ICareerRequest, res: Response): Promise<void> => {
  const query: IApplicationQuery = (req.validatedQuery ?? req.query) as IApplicationQuery;
  const result = await careerService.getAllApplications(query);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.APPLICATIONS_FETCHED, result);
};

const getApplication = async (req: Request, res: Response): Promise<void> => {
  const result = await careerService.getApplicationById(String(req.params.id));
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.APPLICATION_FETCHED, result);
};

const updateApplicationStatus = async (req: ICareerRequest, res: Response): Promise<void> => {
  const body: IUpdateApplicationStatusRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await careerService.updateApplicationStatus(String(req.params.id), body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "APPLICATION_STATUS_UPDATE",
    module: "CAREER",
    targetType: "CareerApplication",
    targetId: String(req.params.id),
    req,
    metadata: { status: body.status, interviewDate: body.interviewDate },
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.APPLICATION_STATUS_UPDATED, result);
};

const addApplicationNote = async (req: ICareerRequest, res: Response): Promise<void> => {
  const body: IAddApplicationNoteRequest = req.body;
  const user = req.user as unknown as IAuthenticatedUser;
  const result = await careerService.addApplicationNote(String(req.params.id), body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "APPLICATION_NOTE_ADD",
    module: "CAREER",
    targetType: "CareerApplication",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.APPLICATION_NOTE_ADDED, result);
};

const assignApplication = async (req: ICareerRequest, res: Response): Promise<void> => {
  const body: IAssignApplicationRequest = req.body;
  const user = req.user as unknown as IAuthenticatedUser;
  const result = await careerService.assignApplication(String(req.params.id), body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "APPLICATION_ASSIGN",
    module: "CAREER",
    targetType: "CareerApplication",
    targetId: String(req.params.id),
    req,
    metadata: { assignedTo: body.assignedTo },
  });
  sendSuccess(res, HTTP_STATUS.OK, "Application assigned successfully", result);
};

const scheduleInterviewRound = async (req: ICareerRequest, res: Response): Promise<void> => {
  const body: IScheduleInterviewRequest = req.body;
  const user = req.user as unknown as IAuthenticatedUser;
  const result = await careerService.scheduleInterviewRound(String(req.params.id), body, user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "INTERVIEW_SCHEDULE",
    module: "CAREER",
    targetType: "CareerApplication",
    targetId: String(req.params.id),
    req,
    metadata: { roundName: body.roundName, mode: body.mode, status: body.status },
  });
  sendSuccess(res, HTTP_STATUS.OK, "Interview round scheduled successfully", result);
};

const logCandidateContact = async (req: ICareerRequest, res: Response): Promise<void> => {
  const user = req.user as unknown as IAuthenticatedUser;
  const note = typeof req.body?.note === "string" ? req.body.note : undefined;
  const result = await careerService.logCandidateContact(String(req.params.id), user, note);
  void recordAuditLog({
    userId: req.user?._id,
    action: "APPLICATION_CONTACT_LOG",
    module: "CAREER",
    targetType: "CareerApplication",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, "Candidate contact logged successfully", result);
};

const deleteApplication = async (req: ICareerRequest, res: Response): Promise<void> => {
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await careerService.deleteApplication(String(req.params.id), user);
  void recordAuditLog({
    userId: req.user?._id,
    action: "APPLICATION_DELETE",
    module: "CAREER",
    targetType: "CareerApplication",
    targetId: String(req.params.id),
    req,
  });
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.APPLICATION_DELETED, result);
};

export {
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
};
