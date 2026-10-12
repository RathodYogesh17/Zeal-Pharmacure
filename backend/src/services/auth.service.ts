import mongoose from "mongoose";
import User from "../models/user.model";
import { USER_ROLES } from "../constants/enums";
import MESSAGES from "../constants/messages";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import { sendEmail } from "../services/mail.service";
import { hashPassword, comparePassword, sanitizeUser } from "../utils/password";
import AppError from "../utils/appError";
import HTTP_STATUS from "../constants/httpStatus";
import type { HttpStatusCode } from "../constants/httpStatus";
import { resolveMediaReference } from "../services/media.service";
import { resolveRoleId } from "../utils/resolveRole";
import { getEffectivePermissions } from "./permission.service";
import { generateOtpEmailHtml } from "../utils/emailTemplate";
import type {
  IChangePasswordRequest,
  IForgotPasswordRequest,
  ILoginRequest,
  IRegisterRequest,
  IResetPasswordRequest,
  IVerifyOtpRequest,
} from "../types/auth.types";

const throwServiceError = (message: string, statusCode: HttpStatusCode): never => {
  throw new AppError(message, statusCode);
};

const createOtp = (): string => { return Math.floor(100000 + Math.random() * 900000).toString(); };


const sendOtpNotification = async ({
  to,
  subject,
  otp,
  purpose,
  expiryMinutes = 10,
  userName,
}: {
  to: string;
  subject: string;
  otp: string;
  purpose: string;
  expiryMinutes?: number | undefined;
  userName?: string | undefined;
}) => {
  const hasMailConfig = Boolean(process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASSWORD);

  if (!hasMailConfig) {
    console.log(`\n==================================================`);
    console.log(`[ZEAL SECURITY CONSOLE] ${purpose.toUpperCase()} OTP for ${to}: ${otp}`);
    console.log(`(Configure MAIL_HOST/MAIL_USER/MAIL_PASSWORD in .env for inbox delivery)`);
    console.log(`==================================================\n`);
    return { sent: false };
  }

  try {
    const html = generateOtpEmailHtml({
      otp,
      purpose,
      expiryMinutes,
      userName: userName || (to.split("@")[0] ? to.split("@")[0] : "Valued User"),
    });

    await sendEmail({
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err: any) {
    console.error(`[MAIL ERROR] Failed to send OTP email to ${to}:`, err.message);
    return { sent: false };
  }
};




const registerUser = async (body: IRegisterRequest) => {
  const email = body.email.trim().toLowerCase();
  const phone = body.phone.trim();
  const existingUser = await User.findOne({ $or: [{ email }, { phone }], isDeleted: false, });
  if (existingUser) {
    throwServiceError(MESSAGES.EMAIL_OR_PHONE_EXISTS, HTTP_STATUS.CONFLICT);
  }

  const hashedPassword = await hashPassword(body.password);
  const profileMedia = await resolveMediaReference(body.profileImageId, body.profileImage);
  const defaultRoleId = await resolveRoleId(USER_ROLES.USER);
  const user = await User.create({
    name: body.name,
    email,
    phone,
    password: hashedPassword,
    role: defaultRoleId,
    profileImage: profileMedia?.url || null,
    profileImageId: profileMedia?.id || null,
    isEmailVerified: true,
    otpCode: null,
    otpExpiresAt: null,
    otpPurpose: null,
  });
  const userData = sanitizeUser(user.toObject());
  return { user: userData, message: MESSAGES.REGISTRATION_SUCCESS };
};




const loginUser = async (body: ILoginRequest) => {
  const email = body.email.trim().toLowerCase();

  const user = await User.findOne({ email, isDeleted: false }).select("+password");
  if (!user) { throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED); }

  if (user.role && mongoose.isValidObjectId(user.role)) {
    await user.populate("role", "name code");
  }

  const isPasswordValid = await comparePassword(body.password, user.password);
  if (!isPasswordValid) { throwServiceError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED); }
  if (!user.isActive) { throwServiceError(MESSAGES.ACCOUNT_INACTIVE, HTTP_STATUS.FORBIDDEN); }

  const roleName = ((user.role as any)?.name || (user.role as any)?.code || user.role || USER_ROLES.USER) as string;
  const adminRoles: string[] = [
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    "SUPER_ADMIN",
    "ADMIN",
    "Super Admin",
    "Admin",
  ];
  if (adminRoles.includes(roleName)) {
    const otpCode = createOtp();
    await User.findByIdAndUpdate(user._id, {
      otpCode,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      otpPurpose: "adminLogin",
    });

    const otpResult = await sendOtpNotification({
      to: email,
      subject: "Zeal Pharma - Login Verification OTP",
      otp: otpCode,
      purpose: "adminLogin",
    });

    return {
      success: true,
      requiresOtp: true,
      message: MESSAGES.LOGIN_OTP_SENT,
      otpSent: otpResult.sent,
    };
  }

  const payload = { _id: user._id, email: user.email, role: roleName };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date(), lastActivityAt: new Date() });
  const safeUser = sanitizeUser(user.toObject());
  const effectivePerms = await getEffectivePermissions({ _id: user._id.toString(), role: roleName as any, permissions: user.permissions });
  const permissionsList = Array.from(effectivePerms);
  return { accessToken, refreshToken, user: { ...safeUser, role: roleName, permissions: permissionsList }, message: MESSAGES.LOGIN_SUCCESS };
};



const logoutUser = async () => { return { success: true, message: MESSAGES.LOGOUT_SUCCESS, }; };



const changePassword = async (userId: string, body: IChangePasswordRequest) => {
  const user = await User.findById(userId).select("+password");
  if (!user || user.isDeleted) { throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND); }
  const isCurrentPasswordValid = await comparePassword(body.currentPassword, user.password);
  if (!isCurrentPasswordValid) { throwServiceError(MESSAGES.CURRENT_PASSWORD_INCORRECT, HTTP_STATUS.BAD_REQUEST); }
  if (body.currentPassword === body.newPassword) { throwServiceError(MESSAGES.PASSWORD_SAME_AS_CURRENT, HTTP_STATUS.BAD_REQUEST); }
  if (body.newPassword !== body.confirmPassword) { throwServiceError(MESSAGES.PASSWORD_CONFIRM_MISMATCH, HTTP_STATUS.BAD_REQUEST); }
  const hashedPassword = await hashPassword(body.newPassword);
  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    otpCode: null,
    otpExpiresAt: null,
    otpPurpose: null,
  });
  return { success: true, message: MESSAGES.PASSWORD_CHANGED, };
};



const forgotPassword = async (body: IForgotPasswordRequest) => {
  const email = body.email.trim().toLowerCase();
  const user = await User.findOne({ email, isDeleted: false });

  if (!user) {
    throw new AppError("No account found with this email address.", HTTP_STATUS.NOT_FOUND);
  }

  const otpCode = createOtp();
  // OTP expires in 1 minute for password reset (as per requirement)
  await User.findByIdAndUpdate(user._id, {
    otpCode,
    otpExpiresAt: new Date(Date.now() + 1 * 60 * 1000),
    otpPurpose: "passwordReset",
  });

  const otpResult = await sendOtpNotification({
    to: email,
    subject: "Zeal Pharmacure - Password Reset OTP Code",
    otp: otpCode,
    purpose: "passwordReset",
    expiryMinutes: 1,
    userName: user.name || email.split("@")[0],
  });

  return {
    success: true,
    message: "Verification OTP has been sent to your registered email address. It expires in 1 minute.",
    otpSent: otpResult.sent,
  };
};



const verifyOtp = async (body: IVerifyOtpRequest) => {
  const email = body.email.trim().toLowerCase();
  const user = await User.findOne({ email, isDeleted: false })
    .select("+otpCode +otpExpiresAt +otpPurpose");

  if (!user) { throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND); }
  if (user.role && mongoose.isValidObjectId(user.role)) {
    await user.populate("role", "name code");
  }
  if (!user.otpCode || !user.otpExpiresAt) { throwServiceError(MESSAGES.OTP_NOT_FOUND, HTTP_STATUS.BAD_REQUEST); }

  if (new Date() > new Date(user.otpExpiresAt as Date)) {
    await User.findByIdAndUpdate(user._id, {
      otpCode: null,
      otpExpiresAt: null,
      otpPurpose: null,
    });
    throwServiceError(MESSAGES.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST);
  }
  const otp = String(body.otp ?? "").trim();
  if (user.otpCode !== otp) { throwServiceError(MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST); }

  const otpPurpose = user.otpPurpose;

  if (otpPurpose === "adminLogin") {
    await User.findByIdAndUpdate(user._id, {
      otpCode: null,
      otpExpiresAt: null,
      otpPurpose: null,
      isEmailVerified: true,
      lastLogin: new Date(),
      lastActivityAt: new Date(),
    });

    const roleName = ((user.role as any)?.name || user.role || USER_ROLES.ADMIN) as string;
    const payload = { _id: user._id, email: user.email, role: roleName };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const effectivePerms = await getEffectivePermissions({ _id: user._id.toString(), role: roleName as any, permissions: user.permissions });
    const permissionsList = Array.from(effectivePerms);

    return {
      success: true,
      message: MESSAGES.ADMIN_LOGIN_SUCCESS,
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: roleName,
        profileImage: user.profileImage || null,
        designation: user.designation || '',
        department: user.department || '',
        permissions: permissionsList,
      },
    };
  }

  if (otpPurpose === "passwordReset") {
    return {
      success: true,
      message: MESSAGES.PASSWORD_RESET_OTP_VERIFIED,
      otpVerified: true,
    };
  }

  await User.findByIdAndUpdate(user._id, {
    otpCode: null,
    otpExpiresAt: null,
    otpPurpose: null,
  });
  return { success: true, message: MESSAGES.OTP_VERIFIED };
};



const resetPassword = async (body: IResetPasswordRequest) => {
  const email = body.email.trim().toLowerCase();
  const user = await User.findOne({ email, isDeleted: false })
    .select("+password +otpCode +otpExpiresAt +otpPurpose");

  if (!user) { throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND); }
  if (!user.otpCode || !user.otpExpiresAt) { throwServiceError(MESSAGES.OTP_NOT_FOUND, HTTP_STATUS.BAD_REQUEST); }

  if (new Date() > new Date(user.otpExpiresAt as Date)) {
    await User.findByIdAndUpdate(user._id, {
      otpCode: null,
      otpExpiresAt: null,
      otpPurpose: null,
    });
    throwServiceError(MESSAGES.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const otp = String(body.otp ?? "").trim();
  if (user.otpCode !== otp) { throwServiceError(MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST); }
  if (body.newPassword !== body.confirmPassword) { throwServiceError(MESSAGES.PASSWORD_CONFIRM_MISMATCH, HTTP_STATUS.BAD_REQUEST); }

  const hashedPassword = await hashPassword(body.newPassword);
  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    otpCode: null,
    otpExpiresAt: null,
    otpPurpose: null,
  });

  return {
    success: true,
    message: MESSAGES.PASSWORD_RESET_SUCCESS,
  };
};

export { registerUser, loginUser, logoutUser, changePassword, forgotPassword, verifyOtp, resetPassword };