import rateLimit from "express-rate-limit";
import HTTP_STATUS from "../constants/httpStatus";

/**
 * Auth Rate Limiter
 * Limits failed login / OTP verification attempts to prevent brute-force attacks.
 * Allows 20 attempts per 15-minute window per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
});

/**
 * Enquiry / Lead Submission Rate Limiter
 * Protects public enquiry and stockist franchise forms from spam bots and DDoS.
 * Allows generous 25 submissions per 15-minute window per IP so legitimate clients are never blocked.
 */
export const enquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Max 25 submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "We have received multiple enquiries from your IP address. Please allow a few minutes before submitting again or call our sales desk directly.",
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
});

/**
 * Public General API Limiter (Optional protective fallback)
 * Very generous: 600 requests per 15-minute window per IP.
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  },
});

