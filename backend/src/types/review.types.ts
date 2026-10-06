import type { Request } from "express";
import type { Types } from "mongoose";
import type { IAuthenticatedUser } from "./user.types";

export interface IReview {
  _id: Types.ObjectId | string;
  product: Types.ObjectId | string;
  reviewerName: string;
  reviewerRole: string;
  reviewerDesignation?: string;
  rating: number;
  title?: string;
  comment: string;
  city?: string;
  state?: string;
  isVerified: boolean;
  verifiedBy?: Types.ObjectId | string | null;
  verifiedAt?: Date | null;
  isApproved: boolean;
  approvedBy?: Types.ObjectId | string | null;
  approvedAt?: Date | null;
  isFeatured: boolean;
  adminReply?: string;
  adminReplyBy?: Types.ObjectId | string | null;
  adminReplyAt?: Date | null;
  source: string;
  createdBy?: Types.ObjectId | string | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateReviewRequest {
  productId?: string;
  reviewerName: string;
  reviewerRole?: string;
  reviewerDesignation?: string;
  rating: number;
  title?: string;
  comment: string;
  city?: string;
  state?: string;
  source?: string;
}

export interface IApproveReviewRequest {
  isApproved: boolean;
}

export interface IAdminReplyReviewRequest {
  adminReply: string;
}

export interface IToggleReviewFeatureRequest {
  isFeatured: boolean;
}

export interface IToggleReviewVerificationRequest {
  isVerified: boolean;
}

export interface IReviewQuery {
  page?: string;
  limit?: string;
  productId?: string;
  isApproved?: string;
  isFeatured?: string;
  isVerified?: string;
  rating?: string;
  source?: string;
  search?: string;
}

export interface IReviewRequest extends Request {
  user?: IAuthenticatedUser;
  validatedQuery?: IReviewQuery;
}
