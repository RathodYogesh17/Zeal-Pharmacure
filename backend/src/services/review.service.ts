import mongoose from "mongoose";
import Review from "../models/review.model";
import Product from "../models/product.model";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import { buildPagination } from "../utils/pagination";
import type {
  ICreateReviewRequest,
  IReviewQuery,
} from "../types/review.types";
import type { IAuthenticatedUser } from "../types/user.types";

const recalculateProductRating = async (
  productId: string | mongoose.Types.ObjectId
): Promise<void> => {
  const prodId = new mongoose.Types.ObjectId(String(productId));

  const stats = await Review.aggregate([
    {
      $match: {
        product: prodId,
        isApproved: true,
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const averageRating =
    stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  const totalReviews = stats.length > 0 ? stats[0].count : 0;

  await Product.findByIdAndUpdate(prodId, {
    averageRating,
    totalReviews,
  });
};

const createReview = async (
  productId: string,
  body: ICreateReviewRequest,
  user?: IAuthenticatedUser
) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(MESSAGES.INVALID_PRODUCT_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const product = await Product.findOne({ _id: productId, isDeleted: false });
  if (!product) {
    throw new AppError(MESSAGES.PRODUCT_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const review = await Review.create({
    product: new mongoose.Types.ObjectId(productId),
    reviewerName: body.reviewerName.trim(),
    reviewerRole: body.reviewerRole?.trim() || "",
    reviewerDesignation: body.reviewerDesignation?.trim() || "",
    rating: Number(body.rating),
    title: body.title?.trim() || "",
    comment: body.comment.trim(),
    city: body.city?.trim() || "",
    state: body.state?.trim() || "",
    isVerified: false,
    isApproved: false, // Requires admin moderation
    isFeatured: false,
    adminReply: "",
    source: body.source?.trim() || "WEBSITE",
    createdBy: user?._id ? new mongoose.Types.ObjectId(String(user._id)) : null,
  });

  return review;
};

const getProductReviews = async (
  productId: string,
  query: IReviewQuery = {}
) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(MESSAGES.INVALID_PRODUCT_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const { page, limit, skip } = buildPagination(
    Number(query.page ?? 1),
    Number(query.limit ?? 10)
  );

  const filter: Record<string, unknown> = {
    product: new mongoose.Types.ObjectId(productId),
    isApproved: true,
    isDeleted: false,
  };

  if (query.rating) {
    filter.rating = Number(query.rating);
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("adminReplyBy", "name role")
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { reviews, total, page, limit, totalPages };
};

const getAllReviewsAdmin = async (query: IReviewQuery = {}) => {
  const { page, limit, skip } = buildPagination(
    Number(query.page ?? 1),
    Number(query.limit ?? 20)
  );

  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.productId && mongoose.Types.ObjectId.isValid(query.productId)) {
    filter.product = new mongoose.Types.ObjectId(query.productId);
  }

  if (query.isApproved !== undefined) {
    filter.isApproved = query.isApproved === "true";
  }

  if (query.isFeatured !== undefined) {
    filter.isFeatured = query.isFeatured === "true";
  }

  if (query.isVerified !== undefined) {
    filter.isVerified = query.isVerified === "true";
  }

  if (query.source && query.source.trim()) {
    filter.source = query.source.trim();
  }

  if (query.rating) {
    filter.rating = Number(query.rating);
  }

  if (query.search && query.search.trim()) {
    const searchRegex = { $regex: query.search.trim(), $options: "i" };
    filter.$or = [
      { reviewerName: searchRegex },
      { reviewerRole: searchRegex },
      { reviewerDesignation: searchRegex },
      { comment: searchRegex },
      { title: searchRegex },
      { city: searchRegex },
      { state: searchRegex },
    ];
  }

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("product", "name slug dosageForm packaging featuredImage")
      .populate("approvedBy", "name email role")
      .populate("verifiedBy", "name email role")
      .populate("adminReplyBy", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { reviews, total, page, limit, totalPages };
};

const approveReview = async (
  reviewId: string,
  isApproved: boolean,
  user?: IAuthenticatedUser
) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new AppError(MESSAGES.INVALID_REVIEW_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const review = await Review.findOne({ _id: reviewId, isDeleted: false });
  if (!review) {
    throw new AppError(MESSAGES.REVIEW_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  review.isApproved = Boolean(isApproved);
  review.approvedBy = user?._id
    ? new mongoose.Types.ObjectId(String(user._id))
    : null;
  review.approvedAt = new Date();
  await review.save();

  // Re-calculate product's average rating and total review counts
  await recalculateProductRating(review.product);

  return review;
};

const replyReview = async (
  reviewId: string,
  adminReply: string,
  user?: IAuthenticatedUser
) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new AppError(MESSAGES.INVALID_REVIEW_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const review = await Review.findOne({ _id: reviewId, isDeleted: false });
  if (!review) {
    throw new AppError(MESSAGES.REVIEW_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  review.adminReply = adminReply.trim();
  review.adminReplyBy = user?._id
    ? new mongoose.Types.ObjectId(String(user._id))
    : null;
  review.adminReplyAt = new Date();
  await review.save();

  return review;
};

const toggleReviewFeature = async (
  reviewId: string,
  isFeatured: boolean
) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new AppError(MESSAGES.INVALID_REVIEW_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const review = await Review.findOne({ _id: reviewId, isDeleted: false });
  if (!review) {
    throw new AppError(MESSAGES.REVIEW_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  review.isFeatured = Boolean(isFeatured);
  await review.save();

  return review;
};

const toggleReviewVerification = async (
  reviewId: string,
  isVerified: boolean,
  user?: IAuthenticatedUser
) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new AppError(MESSAGES.INVALID_REVIEW_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const review = await Review.findOne({ _id: reviewId, isDeleted: false });
  if (!review) {
    throw new AppError(MESSAGES.REVIEW_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  review.isVerified = Boolean(isVerified);
  review.verifiedBy = isVerified && user?._id
    ? new mongoose.Types.ObjectId(String(user._id))
    : null;
  review.verifiedAt = isVerified ? new Date() : null;
  await review.save();

  return review;
};

const deleteReview = async (reviewId: string, user?: IAuthenticatedUser) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new AppError(MESSAGES.INVALID_REVIEW_ID, HTTP_STATUS.BAD_REQUEST);
  }

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: user?._id || null,
    },
    { new: true }
  );

  if (!review) {
    throw new AppError(MESSAGES.REVIEW_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Re-calculate product stats after soft deletion
  await recalculateProductRating(review.product);

  return {
    _id: review._id,
    isDeleted: review.isDeleted,
    deletedAt: review.deletedAt,
  };
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
  recalculateProductRating,
};
