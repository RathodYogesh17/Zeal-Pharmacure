import mongoose from "mongoose";
import { generateUniqueSlug } from "../utils/slug";
import JobOpening from "../models/jobOpening.model";
import CareerApplication from "../models/careerApplication.model";
import User from "../models/user.model";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { buildPagination } from "../utils/pagination";
import { sendCareerWhatsAppNotification, sendStatusUpdateWhatsAppNotification } from "./notification.service";
import { resolveMediaReference } from "./media.service";
import type {
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

const defaultJobPopulate = [
  { path: "createdBy", select: "name email role" },
  { path: "updatedBy", select: "name email role" },
];

const defaultApplicationPopulate = [
  { path: "jobOpening", select: "title slug department location jobType experienceRequired" },
  { path: "resumeMediaId", select: "url originalName mimeType size filename" },
  { path: "interviewRounds.interviewer", select: "name email role phone" },
  { path: "assignedTo", select: "name email role phone" },
  { path: "assignedBy", select: "name email role" },
  { path: "lastContactedBy", select: "name email role" },
  { path: "hrNotes.addedBy", select: "name email role" },
];

const generateApplicationCode = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  const prefix = `CA-${currentYear}-`;
  const latest = await CareerApplication.findOne({
    applicationCode: { $regex: new RegExp(`^${prefix}`) },
  })
    .sort({ createdAt: -1 })
    .select("applicationCode")
    .lean();

  let nextSeq = 1;
  if (latest?.applicationCode) {
    const parts = latest.applicationCode.split("-");
    const lastNum = parts[2] ? parseInt(parts[2], 10) : NaN;
    if (!isNaN(lastNum)) {
      nextSeq = lastNum + 1;
    }
  }

  return `${prefix}${String(nextSeq).padStart(6, "0")}`;
};

const validateObjectId = (id: string, message: string = "Invalid ID"): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(message, HTTP_STATUS.BAD_REQUEST);
  }
};

const generateUniqueJobSlug = async (title: string, excludeId?: string): Promise<string> => {
  return generateUniqueSlug(title, async (candidateSlug) => {
    const existing = await JobOpening.findOne({
      slug: candidateSlug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    return Boolean(existing);
  });
};

// =====================================================
// JOB OPENINGS SERVICES
// =====================================================

const createJobOpening = async (
  body: ICreateJobRequest,
  user?: IAuthenticatedUser
) => {
  if (body.code && body.code.trim()) {
    const existingCode = await JobOpening.findOne({
      code: body.code.trim().toUpperCase(),
      isDeleted: false,
    });
    if (existingCode) {
      throw new AppError("Job code already exists", HTTP_STATUS.CONFLICT);
    }
  }

  const slug = await generateUniqueJobSlug(body.title);
  const status = body.status || "DRAFT";
  const publishedAt = body.publishedAt
    ? new Date(body.publishedAt)
    : status === "OPEN"
    ? new Date()
    : null;

  const createPayload: Record<string, unknown> = {
    title: body.title.trim(),
    slug,
    shortDescription: body.shortDescription?.trim() || "",
    department: body.department.trim(),
    location: body.location.trim(),
    jobType: body.jobType || "FULL_TIME",
    experienceRequired: body.experienceRequired.trim(),
    openingsCount: body.openingsCount || 1,
    salaryRange: body.salaryRange?.trim() || "",
    qualificationRequired: body.qualificationRequired?.trim() || "",
    responsibilities: body.responsibilities || [],
    requirements: body.requirements || [],
    skills: body.skills || [],
    benefits: body.benefits || [],
    applicationEmail: body.applicationEmail?.trim().toLowerCase() || "",
    applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
    description: body.description.trim(),
    status,
    publishedAt,
    sortOrder: body.sortOrder ?? 0,
    isActive: body.isActive !== false,
    isFeatured: Boolean(body.isFeatured),
    viewsCount: 0,
    applicationCount: 0,
    seo: {
      metaTitle: body.seo?.metaTitle?.trim() || "",
      metaDescription: body.seo?.metaDescription?.trim() || "",
      keywords: body.seo?.keywords || [],
      canonicalUrl: body.seo?.canonicalUrl?.trim() || "",
    },
    createdBy: user?._id || null,
  };

  if (body.code && body.code.trim()) {
    createPayload.code = body.code.trim().toUpperCase();
  }

  const job = await JobOpening.create(createPayload);

  return JobOpening.findById(job._id).populate(defaultJobPopulate).lean();
};

const getAllJobOpenings = async (query: IJobQuery = {}, isPublic: boolean = false) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (isPublic) {
    filter.isActive = true;
    filter.status = "OPEN";
  } else {
    if (query.status) {
      filter.status = query.status;
    }
    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === "true";
    }
  }

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured === "true";
  }

  if (query.department && query.department.trim()) {
    filter.department = { $regex: new RegExp(query.department.trim(), "i") };
  }

  if (query.location && query.location.trim()) {
    filter.location = { $regex: new RegExp(query.location.trim(), "i") };
  }

  if (query.jobType) {
    filter.jobType = query.jobType;
  }

  if (query.search && query.search.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { title: searchRegex },
      { code: searchRegex },
      { department: searchRegex },
      { location: searchRegex },
      { shortDescription: searchRegex },
      { experienceRequired: searchRegex },
      { description: searchRegex },
      { requirements: searchRegex },
      { responsibilities: searchRegex },
      { skills: searchRegex },
    ];
  }

  const { page, limit, skip } = buildPagination(
    Number(query.page ?? 1),
    Number(query.limit ?? (isPublic ? 50 : 20))
  );

  const [jobs, total] = await Promise.all([
    JobOpening.find(filter)
      .populate(defaultJobPopulate)
      .sort({ sortOrder: 1, isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    JobOpening.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { jobs, total, page, limit, totalPages };
};

const getJobOpeningBySlugOrId = async (slugOrId: string, isPublic: boolean = false) => {
  const filter: Record<string, unknown> = { isDeleted: false };
  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    filter._id = slugOrId;
  } else {
    filter.$or = [
      { slug: slugOrId.toLowerCase() },
      { code: slugOrId.toUpperCase() },
    ];
  }

  if (isPublic) {
    filter.isActive = true;
    filter.status = "OPEN";
  }

  const job = await JobOpening.findOne(filter).populate(defaultJobPopulate);

  if (!job) {
    throw new AppError(MESSAGES.JOB_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (isPublic) {
    await JobOpening.updateOne({ _id: job._id }, { $inc: { viewsCount: 1 } });
    job.viewsCount = (job.viewsCount || 0) + 1;
  }

  return job.toObject ? job.toObject() : job;
};

const updateJobOpening = async (
  id: string,
  body: IUpdateJobRequest,
  user?: IAuthenticatedUser
) => {
  validateObjectId(id, MESSAGES.JOB_NOT_FOUND);

  const job = await JobOpening.findOne({ _id: id, isDeleted: false });
  if (!job) {
    throw new AppError(MESSAGES.JOB_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  if (body.title && body.title.trim() !== job.title) {
    job.title = body.title.trim();
    job.slug = await generateUniqueJobSlug(body.title, id);
  }

  if (body.code !== undefined) {
    const trimmedCode = body.code?.trim();
    if (trimmedCode) {
      const formattedCode = trimmedCode.toUpperCase();
      if (formattedCode !== job.code) {
        const existingCode = await JobOpening.findOne({
          code: formattedCode,
          _id: { $ne: id },
          isDeleted: false,
        });
        if (existingCode) {
          throw new AppError("Job code already exists", HTTP_STATUS.CONFLICT);
        }
      }
      job.code = formattedCode;
    } else {
      job.set("code", undefined);
    }
  }

  if (body.shortDescription !== undefined) job.shortDescription = body.shortDescription?.trim() || "";
  if (body.department !== undefined) job.department = body.department.trim();
  if (body.location !== undefined) job.location = body.location.trim();
  if (body.jobType !== undefined) job.jobType = body.jobType;
  if (body.experienceRequired !== undefined) job.experienceRequired = body.experienceRequired.trim();
  if (body.openingsCount !== undefined) job.openingsCount = body.openingsCount;
  if (body.salaryRange !== undefined) job.salaryRange = body.salaryRange?.trim() || "";
  if (body.qualificationRequired !== undefined) job.qualificationRequired = body.qualificationRequired?.trim() || "";
  if (body.responsibilities !== undefined) job.responsibilities = body.responsibilities;
  if (body.requirements !== undefined) job.requirements = body.requirements;
  if (body.skills !== undefined) job.skills = body.skills;
  if (body.benefits !== undefined) job.benefits = body.benefits;
  if (body.applicationEmail !== undefined) job.applicationEmail = body.applicationEmail?.trim().toLowerCase() || "";
  if (body.applicationDeadline !== undefined) {
    job.applicationDeadline = body.applicationDeadline ? new Date(body.applicationDeadline) : null;
  }
  if (body.description !== undefined) job.description = body.description.trim();
  if (body.status !== undefined) {
    job.status = body.status;
    if (body.status === "OPEN" && !job.publishedAt) {
      job.publishedAt = new Date();
    }
  }
  if (body.publishedAt !== undefined) {
    job.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  }
  if (body.sortOrder !== undefined) job.sortOrder = body.sortOrder;
  if (body.isActive !== undefined) job.isActive = body.isActive;
  if (body.isFeatured !== undefined) job.isFeatured = body.isFeatured;

  if (body.seo) {
    job.seo = {
      metaTitle: body.seo.metaTitle !== undefined ? body.seo.metaTitle.trim() : (job.seo?.metaTitle || ""),
      metaDescription: body.seo.metaDescription !== undefined ? body.seo.metaDescription.trim() : (job.seo?.metaDescription || ""),
      keywords: body.seo.keywords !== undefined ? body.seo.keywords : (job.seo?.keywords || []),
      canonicalUrl: body.seo.canonicalUrl !== undefined ? body.seo.canonicalUrl.trim() : (job.seo?.canonicalUrl || ""),
    };
  }

  job.updatedBy = user?._id ? new mongoose.Types.ObjectId(user._id) : null;
  await job.save();

  return JobOpening.findById(id).populate(defaultJobPopulate).lean();
};

const deleteJobOpening = async (id: string, user?: IAuthenticatedUser) => {
  validateObjectId(id, MESSAGES.JOB_NOT_FOUND);

  const deleted = await JobOpening.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id || null,
    },
    { new: true }
  ).lean();

  if (!deleted) {
    throw new AppError(MESSAGES.JOB_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return { _id: deleted._id, title: deleted.title, isDeleted: true };
};

// =====================================================
// CAREER APPLICATIONS SERVICES
// =====================================================

const submitApplication = async (body: any) => {
  let resolvedJobId: mongoose.Types.ObjectId | null = null;
  const targetJobId = body.jobOpeningId || body.jobId;
  let jobTitle = body.positionAppliedFor || body.jobTitle || 'General Application';

  if (targetJobId && mongoose.Types.ObjectId.isValid(targetJobId)) {
    const job = await JobOpening.findOne({ _id: targetJobId, isDeleted: false });
    if (job) {
      resolvedJobId = new mongoose.Types.ObjectId(job._id);
      if (!body.positionAppliedFor && !body.jobTitle) {
        jobTitle = job.title;
      }
    }
  }

  const media = await resolveMediaReference(body.resumeMediaId, body.resumeUrl);
  const applicationCode = body.applicationCode || (await generateApplicationCode());
  const rawExp = body.totalExperienceYears !== undefined ? body.totalExperienceYears : body.totalExperience;
  const parsedExp = typeof rawExp === "number"
    ? rawExp
    : parseInt(String(rawExp || '0').replace(/[^0-9]/g, ''), 10) || 0;

  const application = await CareerApplication.create({
    applicationCode,
    jobOpening: resolvedJobId,
    fullName: body.fullName.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    whatsappNumber: body.whatsappNumber?.trim() || body.phone.trim(),
    currentCity: body.currentCity.trim(),
    currentState: body.currentState.trim(),
    preferredLocation: body.preferredLocation?.trim() || "",
    dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
    positionAppliedFor: jobTitle.trim(),
    department: body.department?.trim() || "Sales & Marketing",
    skills: body.skills || [],
    qualification: body.qualification.trim(),
    totalExperienceYears: parsedExp,
    currentCompany: body.currentCompany?.trim() || "",
    currentDesignation: body.currentDesignation?.trim() || "",
    currentCtc: body.currentCtc?.trim() || "",
    expectedCtc: body.expectedCtc?.trim() || "",
    noticePeriod: body.noticePeriod?.trim() || "",
    resumeMediaId: media?.id ? new mongoose.Types.ObjectId(media.id) : null,
    resumeUrl: media?.url || body.resumeUrl?.trim() || "",
    resumeOriginalName: body.resumeOriginalName?.trim() || "",
    resumeMimeType: body.resumeMimeType?.trim() || "",
    resumeSize: body.resumeSize || 0,
    coverNote: body.coverNote?.trim() || "",
    status: "NEW",
    interviewRounds: body.interviewRounds || [],
    hrNotes: [],
    assignedTo: null,
    assignedBy: null,
    assignedAt: null,
    lastContactedAt: null,
    lastContactedBy: null,
    source: body.source?.trim() || "WEBSITE_CAREERS",
    consentGiven: Boolean(body.consentGiven),
    consentAt: body.consentGiven ? new Date() : null,
    isDeleted: false,
  });

  if (resolvedJobId) {
    await JobOpening.findByIdAndUpdate(resolvedJobId, {
      $inc: { applicationCount: 1 },
    }).catch(() => {});
  }

  const populated = await CareerApplication.findById(application._id)
    .populate(defaultApplicationPopulate)
    .lean();

  // Send Instant WhatsApp notification to HR & Admin
  const whatsAppDispatch = await sendCareerWhatsAppNotification({
    applicationId: String(application._id),
    fullName: application.fullName,
    phone: application.phone,
    email: application.email,
    currentCity: application.currentCity,
    currentState: application.currentState,
    preferredLocation: application.preferredLocation,
    positionAppliedFor: application.positionAppliedFor,
    department: application.department,
    qualification: application.qualification,
    totalExperienceYears: String(parsedExp),
    currentCompany: application.currentCompany,
    currentDesignation: application.currentDesignation,
    expectedCtc: application.expectedCtc,
    noticePeriod: application.noticePeriod,
    resumeUrl: application.resumeUrl,
    coverNote: application.coverNote,
  });

  return {
    ...populated,
    instantWhatsAppChatUrl: whatsAppDispatch.instantWhatsAppChatUrl,
    whatsAppAlertSent: whatsAppDispatch.sent,
  };
};

const getAllApplications = async (query: IApplicationQuery = {}) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.department && query.department.trim()) {
    filter.department = { $regex: new RegExp(query.department.trim(), "i") };
  }

  if (query.positionAppliedFor && query.positionAppliedFor.trim()) {
    filter.positionAppliedFor = { $regex: new RegExp(query.positionAppliedFor.trim(), "i") };
  }

  if (query.jobOpeningId && mongoose.Types.ObjectId.isValid(query.jobOpeningId)) {
    filter.jobOpening = new mongoose.Types.ObjectId(query.jobOpeningId);
  }

  if (query.assignedTo && mongoose.Types.ObjectId.isValid(query.assignedTo)) {
    filter.assignedTo = new mongoose.Types.ObjectId(query.assignedTo);
  }

  if (query.skills && query.skills.trim()) {
    filter.skills = { $in: [new RegExp(query.skills.trim(), "i")] };
  }

  if (query.city && query.city.trim()) {
    filter.currentCity = { $regex: new RegExp(query.city.trim(), "i") };
  }

  if (query.state && query.state.trim()) {
    filter.currentState = { $regex: new RegExp(query.state.trim(), "i") };
  }

  if (query.startDate || query.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (query.startDate) dateFilter.$gte = new Date(query.startDate);
    if (query.endDate) dateFilter.$lte = new Date(query.endDate);
    filter.createdAt = dateFilter;
  }

  if (query.search && query.search.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { applicationCode: searchRegex },
      { fullName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { positionAppliedFor: searchRegex },
      { skills: searchRegex },
      { currentCompany: searchRegex },
      { qualification: searchRegex },
      { currentCity: searchRegex },
      { currentState: searchRegex },
      { preferredLocation: searchRegex },
    ];
  }

  const { page, limit, skip } = buildPagination(
    Number(query.page ?? 1),
    Number(query.limit ?? 20)
  );

  const [applications, total] = await Promise.all([
    CareerApplication.find(filter)
      .populate(defaultApplicationPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CareerApplication.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { applications, total, page, limit, totalPages };
};

const getApplicationById = async (id: string) => {
  validateObjectId(id, MESSAGES.APPLICATION_NOT_FOUND);

  const application = await CareerApplication.findOne({ _id: id, isDeleted: false })
    .populate(defaultApplicationPopulate)
    .lean();

  if (!application) {
    throw new AppError(MESSAGES.APPLICATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return application;
};

const updateApplicationStatus = async (
  id: string,
  body: IUpdateApplicationStatusRequest,
  user?: IAuthenticatedUser
) => {
  validateObjectId(id, MESSAGES.APPLICATION_NOT_FOUND);

  const application = await CareerApplication.findOne({ _id: id, isDeleted: false });
  if (!application) {
    throw new AppError(MESSAGES.APPLICATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  application.status = body.status;

  if (body.interviewDate) {
    application.interviewRounds.push({
      roundName: "Interview",
      interviewDate: new Date(body.interviewDate),
      mode: "ONLINE",
      meetingLink: "",
      interviewer: user?._id ? new mongoose.Types.ObjectId(user._id) : null,
      status: "SCHEDULED",
      feedback: "",
      rating: null,
      notes: "",
    } as any);
  }

  if (body.note && body.note.trim() && user?._id) {
    application.hrNotes.push({
      note: body.note.trim(),
      addedBy: new mongoose.Types.ObjectId(user._id),
      addedAt: new Date(),
    } as any);
  }

  let whatsAppDispatch = null;
  if (body.notifyCandidate !== false && application.phone) {
    const jobTitle = application.positionAppliedFor || "Position";
    whatsAppDispatch = await sendStatusUpdateWhatsAppNotification({
      recipientType: "CAREER_CANDIDATE",
      recipientName: application.fullName,
      recipientPhone: application.phone,
      newStatus: body.status,
      referenceTitle: jobTitle,
      additionalDetails: body.interviewDate
        ? { interviewDate: new Date(body.interviewDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) }
        : undefined,
      customMessage: body.customWhatsAppMessage || undefined,
    });

    if (user?._id) {
      application.hrNotes.push({
        note: `WhatsApp status update (${body.status}) dispatched to candidate: ${application.phone} (Bot Delivered: ${whatsAppDispatch.deliveredViaBot})`,
        addedBy: new mongoose.Types.ObjectId(user._id),
        addedAt: new Date(),
      } as any);
    }
  }

  await application.save();

  const updated = await CareerApplication.findById(id).populate(defaultApplicationPopulate).lean();
  return { ...(updated as any), whatsAppDispatch };
};

const addApplicationNote = async (
  id: string,
  body: IAddApplicationNoteRequest,
  user: IAuthenticatedUser
) => {
  validateObjectId(id, MESSAGES.APPLICATION_NOT_FOUND);

  const application = await CareerApplication.findOne({ _id: id, isDeleted: false });
  if (!application) {
    throw new AppError(MESSAGES.APPLICATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  application.hrNotes.push({
    note: body.note.trim(),
    addedBy: new mongoose.Types.ObjectId(user._id),
    addedAt: new Date(),
  } as any);

  await application.save();

  return CareerApplication.findById(id).populate(defaultApplicationPopulate).lean();
};

const assignApplication = async (
  id: string,
  body: IAssignApplicationRequest,
  user: IAuthenticatedUser
) => {
  validateObjectId(id, MESSAGES.APPLICATION_NOT_FOUND);
  validateObjectId(body.assignedTo, "Invalid assigned user ID");

  const [application, assignedUser] = await Promise.all([
    CareerApplication.findOne({ _id: id, isDeleted: false }),
    User.findOne({ _id: body.assignedTo, isDeleted: false }).select("name email"),
  ]);

  if (!application) {
    throw new AppError(MESSAGES.APPLICATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  if (!assignedUser) {
    throw new AppError("Assigned staff user not found", HTTP_STATUS.NOT_FOUND);
  }

  application.assignedTo = new mongoose.Types.ObjectId(body.assignedTo);
  application.assignedBy = new mongoose.Types.ObjectId(user._id);
  application.assignedAt = new Date();

  if (body.note && body.note.trim()) {
    application.hrNotes.push({
      note: `Assigned to ${assignedUser.name}: ${body.note.trim()}`,
      addedBy: new mongoose.Types.ObjectId(user._id),
      addedAt: new Date(),
    } as any);
  }

  await application.save();

  return CareerApplication.findById(id).populate(defaultApplicationPopulate).lean();
};

const scheduleInterviewRound = async (
  id: string,
  body: IScheduleInterviewRequest,
  user: IAuthenticatedUser
) => {
  validateObjectId(id, MESSAGES.APPLICATION_NOT_FOUND);

  const application = await CareerApplication.findOne({ _id: id, isDeleted: false });
  if (!application) {
    throw new AppError(MESSAGES.APPLICATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const round = {
    roundName: body.roundName.trim(),
    interviewDate: body.interviewDate ? new Date(body.interviewDate) : null,
    mode: body.mode || "ONLINE",
    meetingLink: body.meetingLink?.trim() || "",
    interviewer: body.interviewer && mongoose.Types.ObjectId.isValid(body.interviewer)
      ? new mongoose.Types.ObjectId(body.interviewer)
      : (user._id ? new mongoose.Types.ObjectId(user._id) : null),
    status: body.status || "SCHEDULED",
    feedback: body.feedback?.trim() || "",
    rating: body.rating ?? null,
    notes: body.notes?.trim() || "",
  };

  application.interviewRounds.push(round as any);

  if (application.status === "NEW" || application.status === "SHORTLISTED") {
    application.status = "INTERVIEW_SCHEDULED";
  }

  let whatsAppDispatch = null;
  if (body.notifyCandidate !== false && application.phone) {
    const jobTitle = application.positionAppliedFor || "Position";
    const dateFormatted = round.interviewDate
      ? new Date(round.interviewDate).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "To be announced";

    whatsAppDispatch = await sendStatusUpdateWhatsAppNotification({
      recipientType: "CAREER_CANDIDATE",
      recipientName: application.fullName,
      recipientPhone: application.phone,
      newStatus: "INTERVIEW_SCHEDULED",
      referenceTitle: jobTitle,
      additionalDetails: {
        interviewDate: `${round.roundName} on ${dateFormatted}`,
        interviewMode: round.mode,
        meetingLink: round.meetingLink,
      },
      customMessage: body.customWhatsAppMessage || undefined,
    });

    if (user?._id) {
      application.hrNotes.push({
        note: `Interview scheduled WhatsApp alert dispatched to ${application.phone} (Bot Delivered: ${whatsAppDispatch.deliveredViaBot})`,
        addedBy: new mongoose.Types.ObjectId(user._id),
        addedAt: new Date(),
      } as any);
    }
  }

  await application.save();

  const updated = await CareerApplication.findById(id).populate(defaultApplicationPopulate).lean();
  return { ...(updated as any), whatsAppDispatch };
};

const logCandidateContact = async (
  id: string,
  user: IAuthenticatedUser,
  note?: string
) => {
  validateObjectId(id, MESSAGES.APPLICATION_NOT_FOUND);

  const application = await CareerApplication.findOne({ _id: id, isDeleted: false });
  if (!application) {
    throw new AppError(MESSAGES.APPLICATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  application.lastContactedAt = new Date();
  application.lastContactedBy = new mongoose.Types.ObjectId(user._id);

  if (note && note.trim()) {
    application.hrNotes.push({
      note: `Contacted candidate: ${note.trim()}`,
      addedBy: new mongoose.Types.ObjectId(user._id),
      addedAt: new Date(),
    } as any);
  }

  await application.save();

  return CareerApplication.findById(id).populate(defaultApplicationPopulate).lean();
};

const deleteApplication = async (id: string, user?: IAuthenticatedUser) => {
  validateObjectId(id, MESSAGES.APPLICATION_NOT_FOUND);

  const deleted = await CareerApplication.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id || null,
    },
    { new: true }
  ).lean();

  if (!deleted) {
    throw new AppError(MESSAGES.APPLICATION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return { _id: deleted._id, fullName: deleted.fullName, isDeleted: true };
};

export {
  createJobOpening,
  getAllJobOpenings,
  getJobOpeningBySlugOrId,
  updateJobOpening,
  deleteJobOpening,
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  addApplicationNote,
  assignApplication,
  scheduleInterviewRound,
  logCandidateContact,
  deleteApplication,
};
