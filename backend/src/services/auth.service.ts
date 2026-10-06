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


const sendOtpNotification = async ({ to, subject, otp, purpose }: { to: string; subject: string; otp: string; purpose: string; }) => {
  const hasMailConfig = Boolean(process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASSWORD);

  if (!hasMailConfig) {
    console.warn(`[DEV OTP] ${purpose} OTP for ${to}: ${otp}`);
    return { sent: false, otp };
  }

  await sendEmail({
    to, subject,
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
  });
  return { sent: true, otp };
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

  const user = await User.findOne({ email, isDeleted: false }).select("+password").populate("role", "name code");
  if (!user) { throw new AppError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED); }

  const isPasswordValid = await comparePassword(body.password, user.password);
  if (!isPasswordValid) { throwServiceError(MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED); }
  if (!user.isActive) { throwServiceError(MESSAGES.ACCOUNT_INACTIVE, HTTP_STATUS.FORBIDDEN); }

  const roleName = ((user.role as any)?.name || user.role || USER_ROLES.USER) as string;
  const adminRoles: string[] = [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN];
  if (adminRoles.includes(roleName)) {
    const otpCode = createOtp();
    await User.findByIdAndUpdate(user._id, {
      otpCode,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      otpPurpose: "adminLogin",
    });

    const otpResult = await sendOtpNotification({ to: email, subject: "Admin login verification", otp: otpCode, purpose: "adminLogin", });
    return {
      success: true,
      message: otpResult.sent
        ? MESSAGES.LOGIN_OTP_SENT
        : MESSAGES.LOGIN_OTP_DEV.replace("{otp}", otpResult.otp),
      otp: otpResult.otp,
      otpSent: otpResult.sent,
    };
  }

  const payload = { _id: user._id, email: user.email, role: roleName };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date(), lastActivityAt: new Date() });
  const safeUser = sanitizeUser(user.toObject());
  return { accessToken, refreshToken, user: { ...safeUser, role: roleName }, message: MESSAGES.LOGIN_SUCCESS };
};



const logoutUser = async () => { return { success: true, message: MESSAGES.LOGOUT_SUCCESS, }; };



const changePassword = async (userId: string, body: IChangePasswordRequest) => {
  const user = await User.findById(userId).select("+password");
  if (!user || user.isDeleted) { throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND); }
  const isCurrentPasswordValid = await comparePassword(body.currentPassword, user.password);
  if (!isCurrentPasswordValid) { throwServiceError(MESSAGES.CURRENT_PASSWORD_INCORRECT, HTTP_STATUS.BAD_REQUEST); }
  if (body.currentPassword === body.newPassword) { throwServiceError(MESSAGES.PASSWORD_SAME_AS_CURRENT, HTTP_STATUS.BAD_REQUEST); }
  if (body.newPassword !== body.confirmPassword) { throwServiceError(MESSAGES.PASSWORD_CONFIRM_MISMATCH, HTTP_STATUS.BAD_REQUEST); }
  user.password = await hashPassword(body.newPassword);
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();
  return { success: true, message: MESSAGES.PASSWORD_CHANGED, };
};



const forgotPassword = async (body: IForgotPasswordRequest) => {
  const email = body.email.trim().toLowerCase();
  const user = await User.findOne({ email, isDeleted: false });

  let otpCode = null;

  if (user) {
    otpCode = createOtp();
    await User.findByIdAndUpdate(user._id, {
      otpCode,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      otpPurpose: "passwordReset",
    });
    const otpResult = await sendOtpNotification({ to: email, subject: "Password reset OTP", otp: otpCode, purpose: "passwordReset", });
    otpCode = otpResult.otp;
  }

  return {
    success: true, message: MESSAGES.FORGOT_PASSWORD_SENT,
    otp: otpCode, otpSent: Boolean(otpCode),
  };
};



const verifyOtp = async (body: IVerifyOtpRequest) => {
  const email = body.email.trim().toLowerCase();
  const user = await User.findOne({ email, isDeleted: false })
    .select("+otpCode +otpExpiresAt +otpPurpose")
    .populate("role", "name code");

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
  if (user.otpCode !== body.otp) { throwServiceError(MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST); }

  const otpPurpose = user.otpPurpose;

  if (otpPurpose === "adminLogin") {
    await User.findByIdAndUpdate(user._id, {
      otpCode: null,
      otpExpiresAt: null,
      otpPurpose: null,
      isEmailVerified: true,
    });

    const roleName = ((user.role as any)?.name || user.role || USER_ROLES.ADMIN) as string;
    const payload = { _id: user._id, email: user.email, role: roleName };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      success: true,
      message: MESSAGES.ADMIN_LOGIN_SUCCESS,
      accessToken, refreshToken,
      user: { _id: user._id, name: user.name, email: user.email, role: roleName, },
    };
  }

  if (otpPurpose === "passwordReset") {
    await user.save();
    return {
      success: true,
      message: MESSAGES.PASSWORD_RESET_OTP_VERIFIED,
    };
  }

  user.otpCode = null;
  user.otpExpiresAt = null;
  user.otpPurpose = null;
  await user.save();
  return { success: true, message: MESSAGES.OTP_VERIFIED };
};



const resetPassword = async (body: IResetPasswordRequest) => {
  const email = body.email.trim().toLowerCase();
  const user = await User.findOne({ email, isDeleted: false });

  if (!user) { throw new AppError(MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND); }
  if (!user.otpCode || !user.otpExpiresAt) { throwServiceError(MESSAGES.OTP_NOT_FOUND, HTTP_STATUS.BAD_REQUEST); }

  if (new Date() > new Date(user.otpExpiresAt as Date)) {
    user.otpCode = null;
    user.otpExpiresAt = null;
    user.otpPurpose = null;
    await user.save();
    throwServiceError(MESSAGES.OTP_EXPIRED, HTTP_STATUS.BAD_REQUEST);
  }

  if (user.otpCode !== body.otp) { throwServiceError(MESSAGES.INVALID_OTP, HTTP_STATUS.BAD_REQUEST); }
  if (body.newPassword !== body.confirmPassword) { throwServiceError(MESSAGES.PASSWORD_CONFIRM_MISMATCH, HTTP_STATUS.BAD_REQUEST); }

  user.password = await hashPassword(body.newPassword);
  user.otpCode = null;
  user.otpExpiresAt = null;
  user.otpPurpose = null;
  await user.save();

  return {
    success: true,
    message: MESSAGES.PASSWORD_RESET_SUCCESS,
  };
};

export { registerUser, loginUser, logoutUser, changePassword, forgotPassword, verifyOtp, resetPassword };