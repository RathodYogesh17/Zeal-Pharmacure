import express from "express";
import { registerUser, loginUser, logoutUser, changePassword, forgotPassword, verifyOtp, resetPassword, getMe, updateProfile } from "../controllers/auth.controller";
import { registerUserSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema } from "../validations/auth.validation";
import { validate } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadNone, uploadProfileImage, attachProfileImageUrl } from "../middleware/upload.middleware";
import asyncHandler from "../utils/asyncHandler";

const authRouter = express.Router();

authRouter.post("/register", uploadProfileImage, attachProfileImageUrl, validate(registerUserSchema), asyncHandler(registerUser));
authRouter.post("/login", uploadNone, validate(loginSchema), asyncHandler(loginUser));
authRouter.post("/logout", authMiddleware, asyncHandler(logoutUser));
authRouter.post("/change-password", authMiddleware, uploadNone, validate(changePasswordSchema), asyncHandler(changePassword));
authRouter.put("/profile", authMiddleware, uploadProfileImage, attachProfileImageUrl, asyncHandler(updateProfile));
authRouter.post("/forgot-password", uploadNone, validate(forgotPasswordSchema), asyncHandler(forgotPassword));
authRouter.post("/verify-otp", uploadNone, validate(verifyOtpSchema), asyncHandler(verifyOtp));
authRouter.post("/reset-password", uploadNone, validate(resetPasswordSchema), asyncHandler(resetPassword));
authRouter.get("/me", authMiddleware, asyncHandler(getMe));

export { authRouter };