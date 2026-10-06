import type { Request } from "express";
import type { Types } from "mongoose";
import type { IAuthenticatedUser } from "./user.types";

export type JobStatus = "OPEN" | "CLOSED" | "DRAFT";
export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type ApplicationStatus =
  | "NEW"
  | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED"
  | "OFFERED"
  | "HIRED"
  | "REJECTED"
  | "ON_HOLD"
  | "WITHDRAWN";

export interface IJobSeo {
  metaTitle?: string | undefined;
  metaDescription?: string | undefined;
  keywords?: string[] | undefined;
  canonicalUrl?: string | undefined;
}

export interface IJobOpening {
  _id: Types.ObjectId | string;
  title: string;
  code?: string | null | undefined;
  slug: string;
  shortDescription?: string | undefined;
  department: string;
  location: string;
  jobType: JobType;
  experienceRequired: string;
  openingsCount: number;
  salaryRange?: string | undefined;
  qualificationRequired?: string | undefined;
  responsibilities: string[];
  requirements: string[];
  skills?: string[] | undefined;
  benefits?: string[] | undefined;
  applicationEmail?: string | undefined;
  applicationDeadline?: Date | null | undefined;
  description: string;
  status: JobStatus;
  publishedAt?: Date | null | undefined;
  sortOrder?: number | undefined;
  isActive: boolean;
  isFeatured: boolean;
  viewsCount?: number | undefined;
  applicationCount?: number | undefined;
  seo?: IJobSeo | undefined;
  createdBy?: Types.ObjectId | string | null | undefined;
  updatedBy?: Types.ObjectId | string | null | undefined;
  isDeleted: boolean;
  deletedAt?: Date | null | undefined;
  deletedBy?: Types.ObjectId | string | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface ICreateJobRequest {
  title: string;
  code?: string | undefined;
  shortDescription?: string | undefined;
  department: string;
  location: string;
  jobType?: JobType | undefined;
  experienceRequired: string;
  openingsCount?: number | undefined;
  salaryRange?: string | undefined;
  qualificationRequired?: string | undefined;
  responsibilities?: string[] | undefined;
  requirements?: string[] | undefined;
  skills?: string[] | undefined;
  benefits?: string[] | undefined;
  applicationEmail?: string | undefined;
  applicationDeadline?: string | Date | null | undefined;
  description: string;
  status?: JobStatus | undefined;
  publishedAt?: string | Date | null | undefined;
  sortOrder?: number | undefined;
  isActive?: boolean | undefined;
  isFeatured?: boolean | undefined;
  seo?: IJobSeo | undefined;
}

export interface IUpdateJobRequest {
  title?: string | undefined;
  code?: string | undefined;
  shortDescription?: string | undefined;
  department?: string | undefined;
  location?: string | undefined;
  jobType?: JobType | undefined;
  experienceRequired?: string | undefined;
  openingsCount?: number | undefined;
  salaryRange?: string | undefined;
  qualificationRequired?: string | undefined;
  responsibilities?: string[] | undefined;
  requirements?: string[] | undefined;
  skills?: string[] | undefined;
  benefits?: string[] | undefined;
  applicationEmail?: string | undefined;
  applicationDeadline?: string | Date | null | undefined;
  description?: string | undefined;
  status?: JobStatus | undefined;
  publishedAt?: string | Date | null | undefined;
  sortOrder?: number | undefined;
  isActive?: boolean | undefined;
  isFeatured?: boolean | undefined;
  seo?: IJobSeo | undefined;
}

export interface IJobQuery {
  page?: string | undefined;
  limit?: string | undefined;
  search?: string | undefined;
  department?: string | undefined;
  location?: string | undefined;
  jobType?: JobType | undefined;
  status?: JobStatus | undefined;
  isActive?: string | undefined;
  isFeatured?: string | undefined;
}

export interface ICandidateNote {
  _id?: Types.ObjectId | string | undefined;
  note: string;
  addedBy: Types.ObjectId | string;
  addedAt: Date;
}

export interface IInterviewRound {
  _id?: Types.ObjectId | string | undefined;
  roundName: string;
  interviewDate?: Date | null | undefined;
  mode?: "ONLINE" | "OFFLINE" | "PHONE" | undefined;
  meetingLink?: string | undefined;
  interviewer?: Types.ObjectId | string | null | undefined;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | undefined;
  feedback?: string | undefined;
  rating?: number | null | undefined;
  notes?: string | undefined;
}

export interface ICareerApplication {
  _id: Types.ObjectId | string;
  applicationCode?: string | undefined;
  jobOpening?: Types.ObjectId | string | null | undefined;
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber?: string | undefined;
  currentCity: string;
  currentState: string;
  preferredLocation?: string | undefined;
  dateOfBirth?: Date | null | undefined;
  positionAppliedFor: string;
  department: string;
  skills: string[];
  qualification: string;
  totalExperienceYears: number;
  currentCompany?: string | undefined;
  currentDesignation?: string | undefined;
  currentCtc?: string | undefined;
  expectedCtc?: string | undefined;
  noticePeriod?: string | undefined;
  resumeMediaId?: Types.ObjectId | string | null | undefined;
  resumeUrl?: string | undefined;
  resumeOriginalName?: string | undefined;
  resumeMimeType?: string | undefined;
  resumeSize?: number | undefined;
  coverNote?: string | undefined;
  status: ApplicationStatus;
  interviewRounds: IInterviewRound[];
  hrNotes: ICandidateNote[];
  assignedTo?: Types.ObjectId | string | null | undefined;
  assignedBy?: Types.ObjectId | string | null | undefined;
  assignedAt?: Date | null | undefined;
  lastContactedAt?: Date | null | undefined;
  lastContactedBy?: Types.ObjectId | string | null | undefined;
  source?: string | undefined;
  consentGiven?: boolean | undefined;
  consentAt?: Date | null | undefined;
  isDeleted: boolean;
  deletedAt?: Date | null | undefined;
  deletedBy?: Types.ObjectId | string | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface ICreateApplicationRequest {
  applicationCode?: string | undefined;
  jobOpeningId?: string | undefined;
  fullName: string;
  email: string;
  phone: string;
  whatsappNumber?: string | undefined;
  currentCity: string;
  currentState: string;
  preferredLocation?: string | undefined;
  dateOfBirth?: string | Date | undefined;
  positionAppliedFor: string;
  department: string;
  skills?: string[] | undefined;
  qualification: string;
  totalExperienceYears: number | string;
  currentCompany?: string | undefined;
  currentDesignation?: string | undefined;
  currentCtc?: string | undefined;
  expectedCtc?: string | undefined;
  noticePeriod?: string | undefined;
  resumeMediaId?: string | null | undefined;
  resumeUrl?: string | undefined;
  resumeOriginalName?: string | undefined;
  resumeMimeType?: string | undefined;
  resumeSize?: number | undefined;
  coverNote?: string | undefined;
  source?: string | undefined;
  consentGiven?: boolean | undefined;
  interviewRounds?: IInterviewRound[] | undefined;
}

export interface IUpdateApplicationStatusRequest {
  status: ApplicationStatus;
  interviewDate?: string | Date | undefined;
  note?: string | undefined;
  notifyCandidate?: boolean;
  customWhatsAppMessage?: string;
}

export interface IAddApplicationNoteRequest {
  note: string;
}

export interface IAssignApplicationRequest {
  assignedTo: string;
  note?: string | undefined;
}

export interface IScheduleInterviewRequest {
  roundName: string;
  interviewDate?: string | Date | null | undefined;
  mode?: "ONLINE" | "OFFLINE" | "PHONE" | undefined;
  meetingLink?: string | undefined;
  interviewer?: string | null | undefined;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED" | undefined;
  feedback?: string | undefined;
  rating?: number | null | undefined;
  notes?: string | undefined;
  notifyCandidate?: boolean;
  customWhatsAppMessage?: string;
}

export interface IApplicationQuery {
  page?: string | undefined;
  limit?: string | undefined;
  search?: string | undefined;
  status?: ApplicationStatus | undefined;
  department?: string | undefined;
  positionAppliedFor?: string | undefined;
  jobOpeningId?: string | undefined;
  assignedTo?: string | undefined;
  skills?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
}

export interface ICareerRequest extends Request {
  user?: IAuthenticatedUser | undefined;
  validatedQuery?: IApplicationQuery | IJobQuery | undefined;
}
