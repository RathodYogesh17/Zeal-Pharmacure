import type { Request, Response } from "express";
import * as reviewService from "../services/review.service";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { sendSuccess } from "../utils/apiResponse";
import type {
  IReviewRequest,
  ICreateReviewRequest,
  IApproveReviewRequest,
  IAdminReplyReviewRequest,
  IToggleReviewFeatureRequest,
  IToggleReviewVerificationRequest,
  IReviewQuery,
} from "../types/review.types";
import type { IAuthenticatedUser } from "../types/user.types";

const createReview = async (req: Request, res: Response): Promise<void> => {
  const productId = String(req.params.productId);
  const body: any = req.body;
  const user = (req as any).user as IAuthenticatedUser | undefined;
  const normalizedBody: ICreateReviewRequest = {
    reviewerName: (body.reviewerName || body.name || "").trim(),
    reviewerRole: (body.reviewerRole || body.doctorSpeciality || "").trim(),
    reviewerDesignation: (
      body.reviewerDesignation ||
      body.hospitalClinicName ||
      ""
    ).trim(),
    rating: Number(body.rating),
    title: (body.title || "").trim(),
    comment: (body.comment || body.review || "").trim(),
    city: (body.city || "").trim(),
    state: (body.state || "").trim(),
    source: (body.source || "WEBSITE").trim(),
  };
  const result = await reviewService.createReview(productId, normalizedBody, user);
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.REVIEW_SUBMITTED, result);
};

const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  const productId = String(req.params.productId);
  const query: IReviewQuery = req.query as IReviewQuery;
  const result = await reviewService.getProductReviews(productId, query);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.REVIEWS_FETCHED, result);
};

const getAllReviewsAdmin = async (
  req: IReviewRequest,
  res: Response
): Promise<void> => {
  const query: IReviewQuery = req.validatedQuery ?? (req.query as IReviewQuery);
  const result = await reviewService.getAllReviewsAdmin(query);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.REVIEWS_FETCHED, result);
};

const approveReview = async (
  req: IReviewRequest,
  res: Response
): Promise<void> => {
  const reviewId = String(req.params.id);
  const body: IApproveReviewRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await reviewService.approveReview(reviewId, body.isApproved, user);
  const message = body.isApproved
    ? MESSAGES.REVIEW_APPROVED
    : MESSAGES.REVIEW_REJECTED;
  sendSuccess(res, HTTP_STATUS.OK, message, result);
};

const replyReview = async (
  req: IReviewRequest,
  res: Response
): Promise<void> => {
  const reviewId = String(req.params.id);
  const body: IAdminReplyReviewRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await reviewService.replyReview(reviewId, body.adminReply, user);
  sendSuccess(res, HTTP_STATUS.OK, "Admin response saved successfully", result);
};

const toggleReviewFeature = async (
  req: IReviewRequest,
  res: Response
): Promise<void> => {
  const reviewId = String(req.params.id);
  const body: IToggleReviewFeatureRequest = req.body;
  const result = await reviewService.toggleReviewFeature(reviewId, body.isFeatured);
  sendSuccess(
    res,
    HTTP_STATUS.OK,
    body.isFeatured ? "Review featured successfully" : "Review unfeatured successfully",
    result
  );
};

const toggleReviewVerification = async (
  req: IReviewRequest,
  res: Response
): Promise<void> => {
  const reviewId = String(req.params.id);
  const body: IToggleReviewVerificationRequest = req.body;
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await reviewService.toggleReviewVerification(
    reviewId,
    body.isVerified,
    user
  );
  sendSuccess(
    res,
    HTTP_STATUS.OK,
    body.isVerified ? "Review verified successfully" : "Review unverified successfully",
    result
  );
};

const deleteReview = async (
  req: IReviewRequest,
  res: Response
): Promise<void> => {
  const reviewId = String(req.params.id);
  const user = req.user ? (req.user as unknown as IAuthenticatedUser) : undefined;
  const result = await reviewService.deleteReview(reviewId, user);
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.REVIEW_DELETED, result);
};

export {
  createReview,
  getProductReviews,
  getAllReviewsAdmin,
  approveReview,
  replyReview,
  toggleReviewFeature,
  toggleReviewVerification,
  deleteReview,
};
