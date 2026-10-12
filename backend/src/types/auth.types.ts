import type { Types } from "mongoose";
import type { Request } from "express";

export interface IAuthUser {
  _id: Types.ObjectId;
  email: string;
  role: string;
}

export interface IAuthRequest extends Request {
  user: IAuthUser;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  profileImage?: string | null;
  profileImageId?: string | null;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IVerifyOtpRequest {
  email: string;
  otp: string;
  purpose?: string;
}

export interface IResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}