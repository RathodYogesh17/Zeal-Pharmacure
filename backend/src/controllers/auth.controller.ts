import type { Request, Response } from "express";
import * as authService from "../services/auth.service";
import User from "../models/user.model";
import HTTP_STATUS from "../constants/httpStatus";
import MESSAGES from "../constants/messages";
import type { IAuthenticatedRequest } from "../types/express.types";
import { sendSuccess } from "../utils/apiResponse";
import { recordAuditLog } from "../utils/auditLogger";


const registerUser = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.registerUser(req.body ?? {});
  sendSuccess(res, HTTP_STATUS.CREATED, result.message, { user: result.user });
};


const loginUser = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.loginUser(req.body ?? {});
  if (result.user?._id) {
    void recordAuditLog({
      userId: result.user._id,
      action: "LOGIN",
      module: "AUTH",
      targetType: "User",
      targetId: String(result.user._id),
      req,
      metadata: { email: result.user.email, role: result.user.role },
    });
  }
  sendSuccess(res, HTTP_STATUS.OK, result.message, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: result.user,
    requiresOtp: (result as any).requiresOtp,
    otpSent: (result as any).otpSent,
  });
};


const logoutUser = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.logoutUser();
  const userId = (req as unknown as { user?: { _id?: string } }).user?._id;
  if (userId) {
    void recordAuditLog({
      userId,
      action: "LOGOUT",
      module: "AUTH",
      targetType: "User",
      targetId: String(userId),
      req,
    });
  }
  res.status(HTTP_STATUS.OK).json(result);
};


const changePassword = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
  const result = await authService.changePassword(String(req.user?._id), req.body ?? {});
  if (req.user?._id) {
    void recordAuditLog({
      userId: req.user._id,
      action: "CHANGE_PASSWORD",
      module: "AUTH",
      targetType: "User",
      targetId: String(req.user._id),
      req,
    });
  }
  res.status(HTTP_STATUS.OK).json(result);
};



const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.forgotPassword(req.body ?? {});
  res.status(HTTP_STATUS.OK).json(result);
};


const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.verifyOtp(req.body ?? {});
  res.status(HTTP_STATUS.OK).json(result);
};


const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const result = await authService.resetPassword(req.body ?? {});
  res.status(HTTP_STATUS.OK).json(result);
};


const getMe = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?._id)
    .select("-password")
    .populate("role", "name code")
    .populate([
      { path: "createdBy", select: "name email role" },
      { path: "updatedBy", select: "name email role" },
      { path: "deletedBy", select: "name email role" },
    ])
    .lean();

  if (user) {
    const roleName = (user.role as any)?.name || (user.role as any)?.code || req.user?.role || "USER";
    (user as any).role = roleName;
    if (user.designation && (/^[0-9a-fA-F]{24}$/.test(user.designation) || user.designation === "USER")) {
      user.designation = "";
    }
  }

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SUCCESS, user);
};


const updateProfile = async (req: IAuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;
  const { name, phone, profileImage, profileImageId, designation, department } = req.body;

  // Enforce security: Email and Role cannot be changed by staff/admin profile update
  const updateData: any = {};
  if (name && typeof name === "string") updateData.name = name.trim();
  if (phone !== undefined) updateData.phone = typeof phone === "string" ? phone.trim() : phone;
  if (designation !== undefined) {
    const dStr = typeof designation === "string" ? designation.trim() : "";
    updateData.designation = /^[0-9a-fA-F]{24}$/.test(dStr) || dStr === "USER" ? "" : dStr;
  }
  if (department !== undefined) updateData.department = typeof department === "string" ? department.trim() : department;
  if (profileImage !== undefined) updateData.profileImage = profileImage;
  if (profileImageId !== undefined) updateData.profileImageId = profileImageId;
  updateData.updatedBy = userId;

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true })
    .select("-password")
    .populate("role", "name code")
    .lean();

  if (updatedUser) {
    const roleName = (updatedUser.role as any)?.name || (updatedUser.role as any)?.code || req.user?.role || "USER";
    (updatedUser as any).role = roleName;
    if (updatedUser.designation && (/^[0-9a-fA-F]{24}$/.test(updatedUser.designation) || updatedUser.designation === "USER")) {
      updatedUser.designation = "";
    }
  }

  if (userId) {
    void recordAuditLog({
      userId,
      action: "UPDATE_PROFILE",
      module: "AUTH",
      targetType: "User",
      targetId: String(userId),
      req,
      metadata: { updatedFields: Object.keys(updateData) },
    });
  }

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.USER_UPDATED, updatedUser);
};


export { registerUser, loginUser, logoutUser, changePassword, forgotPassword, verifyOtp, resetPassword, getMe, updateProfile };